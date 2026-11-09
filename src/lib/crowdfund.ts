/**
 * Crowdfunding MPT-a kroz MPT (mpt.hr/support, /support/sandbox).
 *
 * Stranica ne drži novac i nema backend: stvori MPT payment intent na railu
 * (`POST /api/intents`, isti ugovor kao energy.domovina.ai `lib/mpt-intent.ts`)
 * i otvori railov checkout (`checkout_url`). Monerium minta EURe izravno u Safe
 * kampanje `mpt-crowdfunding` (način `direct`, rail ADR 0025), a rail javlja
 * „zaprimljeno → paid" kao za svakog trgovca. Stranica je tako i javni demo.
 *
 * Preduvjeti na railu (pay.domovina.ai):
 * - `https://mpt.hr` u `ALLOWED_ORIGINS` (PR #144);
 * - Safe registriran kao kampanja tenanta (admin → setup → „Dodaj projekt",
 *   rail ADR 0027). Bez toga rail vraća `target_not_campaign`.
 *
 * Dok je `safe` `null`, stranica kaže „u pripremi" i ne nudi uplatu.
 */

export type Address = `0x${string}`;

export interface CrowdfundRail {
	key: "prod" | "sandbox";
	/** tenant na railu */
	tenant: "italk" | "italk-sandbox";
	/** id kampanje na railu (`tenant_campaigns.campaign_id`, salt `project:<id>`) */
	campaignId: string;
	/** Safe kampanje; `null` dok nije izrađen i registriran */
	safe: Address | null;
	chainName: string;
	explorer: string;
	blockscoutApi: string;
	eure: Address;
	/** `null` = zadani tenant raila (italk). Javni `pk_` ključ smije samo stvoriti intent prema kampanji tenanta. */
	tenantKey: string | null;
	/** tenant objavljuje inicijale + ··1234 (rail ADR 0029, `tenants.public_payer_tags`) */
	payerTags: boolean;
	/** lanac se čita kroz rail `GET /api/activity` (edge cache, ADR 0030); samo Gnosis */
	activityViaRail: boolean;
}

export const RAIL_ORIGIN = "https://mpt.domovina.ai";
export const INTENTS_URL = `${RAIL_ORIGIN}/api/intents`;

export const CROWDFUND_PROD: CrowdfundRail = {
	key: "prod",
	tenant: "italk",
	campaignId: "mpt-crowdfunding",
	safe: null,
	chainName: "Gnosis Chain",
	explorer: "https://gnosisscan.io",
	blockscoutApi: "https://gnosis.blockscout.com/api/v2",
	eure: "0x420CA0f9B9b604cE0fd9C18EF134C705e5Fa3430",
	tenantKey: null,
	payerTags: true,
	activityViaRail: true,
};

/** Javni ključ `italk-sandbox` (izdan 20. 10. 2026., isti koji koristi energy /sandbox/). */
const ITALK_SANDBOX_PUBLIC_KEY = "pk_0f2aa3339d619acb1dd56239e97d33711c5452a7ab8a2057";

export const CROWDFUND_SANDBOX: CrowdfundRail = {
	key: "sandbox",
	tenant: "italk-sandbox",
	campaignId: "mpt-crowdfunding",
	safe: null,
	chainName: "Chiado",
	explorer: "https://gnosis-chiado.blockscout.com",
	blockscoutApi: "https://gnosis-chiado.blockscout.com/api/v2",
	eure: "0x7a47605930002cc2cd2c3c408d1f33fc2a18ab71",
	tenantKey: ITALK_SANDBOX_PUBLIC_KEY,
	payerTags: false,
	activityViaRail: false,
};

/** Ponuđeni iznosi (€). Rail prima >0 € i ≤10.000 € po intentu. */
export const PRESET_AMOUNTS = [10, 25, 50, 100, 250] as const;
export const MAX_AMOUNT_EUR = 10_000;

/**
 * Cilj kampanje u eurima; `null` = bez cilja (prikazuje se samo prikupljeni zbroj).
 * Odluka vlasnika — ne izmišljati broj.
 */
export const GOAL_EUR: number | null = null;

/** "12,5" / "12.50" / "12" → broj eura s najviše dvije decimale; `null` kad nije valjan iznos. */
export function parseAmountEur(input: string): number | null {
	const s = input.trim().replace(/\s/g, "").replace(",", ".");
	if (!/^\d+(\.\d{1,2})?$/.test(s)) return null;
	const n = Number(s);
	if (!Number.isFinite(n) || n <= 0 || n > MAX_AMOUNT_EUR) return null;
	return n;
}

/** EURe ima 18 decimala; zaokruženo na cente. */
export function weiToCents(wei: string): number {
	try {
		return Number((BigInt(wei) + 5_000_000_000_000_000n) / 10_000_000_000_000_000n);
	} catch {
		return 0;
	}
}

export type IntentError =
	| "not_campaign"
	| "invalid_amount"
	| "too_many_open"
	| "network"
	| "unknown";

export type CreateIntentResult = { ok: true; checkoutUrl: string } | { ok: false; reason: IntentError };

export async function createIntent(rail: CrowdfundRail, amountEur: number): Promise<CreateIntentResult> {
	if (rail.safe === null) return { ok: false, reason: "not_campaign" };
	let res: Response;
	try {
		res = await fetch(INTENTS_URL, {
			method: "POST",
			headers: {
				"content-type": "application/json",
				...(rail.tenantKey !== null ? { authorization: `Bearer ${rail.tenantKey}` } : {}),
			},
			body: JSON.stringify({ target_address: rail.safe, amount_eur: amountEur.toFixed(2) }),
		});
	} catch {
		return { ok: false, reason: "network" };
	}
	const b = (await res.json().catch(() => ({}))) as { checkout_url?: string; sid?: string; error?: string };
	if (res.ok && b.sid) {
		const url = b.checkout_url ?? `${RAIL_ORIGIN}/checkout/${encodeURIComponent(b.sid)}`;
		if (url.startsWith(`${RAIL_ORIGIN}/`)) return { ok: true, checkoutUrl: url };
	}
	if (b.error === "target_not_campaign" || b.error === "target_not_whitelisted") return { ok: false, reason: "not_campaign" };
	if (b.error === "invalid_amount_eur" || b.error === "amount_out_of_range") return { ok: false, reason: "invalid_amount" };
	if (b.error === "too_many_open_intents") return { ok: false, reason: "too_many_open" };
	return { ok: false, reason: "unknown" };
}

export interface Contribution {
	hash: string;
	at: number | null;
	cents: number;
}

export interface Raised {
	cents: number;
	count: number;
	contributions: Contribution[];
}

interface TransferPage {
	items: Array<{ transaction_hash: string; timestamp: string; total: { value: string } }>;
	next_page_params: Record<string, string | number> | null;
}

function toContribution(hash: string, timestamp: string, valueWei: string): Contribution {
	const at = Date.parse(timestamp);
	return { hash: hash.toLowerCase(), at: Number.isNaN(at) ? null : at, cents: weiToCents(valueWei) };
}

function summarize(contributions: Contribution[]): Raised {
	return {
		cents: contributions.reduce((s, c) => s + c.cents, 0),
		count: contributions.length,
		contributions: [...contributions].sort((a, b) => (b.at ?? 0) - (a.at ?? 0)),
	};
}

/** Dolazni EURe na Safe kampanje: rail `/api/activity` (Gnosis, cache) ili izravno Blockscout (Chiado). */
export async function fetchRaised(rail: CrowdfundRail, signal: AbortSignal): Promise<Raised> {
	if (rail.safe === null) return { cents: 0, count: 0, contributions: [] };
	if (rail.activityViaRail) {
		const res = await fetch(`${RAIL_ORIGIN}/api/activity/${rail.safe}`, { signal });
		if (res.ok) {
			const b = (await res.json()) as { transfers?: Array<{ hash: string; timestamp: string; value: string }> };
			if (Array.isArray(b.transfers)) {
				return summarize(b.transfers.map((t) => toContribution(t.hash, t.timestamp, t.value)));
			}
		}
	}
	const base = `${rail.blockscoutApi}/addresses/${rail.safe}/token-transfers?type=ERC-20&filter=to&token=${rail.eure}`;
	const out: Contribution[] = [];
	let next: TransferPage["next_page_params"] = null;
	let pages = 0;
	do {
		const query = next
			? "&" + new URLSearchParams(Object.entries(next).map(([k, v]): [string, string] => [k, String(v)])).toString()
			: "";
		const res = await fetch(base + query, { signal, headers: { accept: "application/json" } });
		if (!res.ok) throw new Error(`blockscout ${res.status}`);
		const page = (await res.json()) as TransferPage;
		for (const item of page.items) out.push(toContribution(item.transaction_hash, item.timestamp, item.total.value));
		next = page.next_page_params;
		pages += 1;
	} while (next && pages < 5);
	return summarize(out);
}

export interface PayerTag {
	label: string | null;
	cents: number;
	at: number | null;
	minted: boolean;
	txHashes: string[];
}

/** „M. S. ··1234" (rail ADR 0029); samo kad tenant objavljuje oznake. */
export async function fetchPayers(rail: CrowdfundRail, signal: AbortSignal): Promise<PayerTag[]> {
	if (rail.safe === null || !rail.payerTags) return [];
	const res = await fetch(`${RAIL_ORIGIN}/api/payers/${rail.safe}`, { signal });
	if (!res.ok) throw new Error(`payers ${res.status}`);
	const body = (await res.json()) as { data?: unknown };
	if (!Array.isArray(body.data)) return [];
	return body.data.flatMap((raw): PayerTag[] => {
		if (typeof raw !== "object" || raw === null) return [];
		const r = raw as Record<string, unknown>;
		if (typeof r.amount_cents !== "number") return [];
		const initials = typeof r.initials === "string" && r.initials.trim() ? r.initials.trim() : null;
		const last4 =
			typeof r.iban_last4 === "string" && /^[0-9A-Z]{4}$/.test(r.iban_last4) ? `··${r.iban_last4}` : null;
		const parts = [initials, last4].filter((p): p is string => p !== null);
		const at = typeof r.received_at === "string" ? Date.parse(r.received_at) : NaN;
		return [
			{
				label: parts.length ? parts.join(" ") : null,
				cents: r.amount_cents,
				at: Number.isNaN(at) ? null : at,
				minted: r.state === "minted",
				txHashes: Array.isArray(r.tx_hashes)
					? r.tx_hashes.filter((h): h is string => typeof h === "string").map((h) => h.toLowerCase())
					: [],
			},
		];
	});
}
