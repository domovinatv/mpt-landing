/**
 * Kampanja „Podrži MPT" — crowdfunding razvoja MPT-a kroz MPT (mpt.hr/support).
 *
 * Preneseno iz energy.domovina.ai `lib/beta-projects.ts` (tipovi, iznosi, provjere
 * naplativosti); umjesto tri elektrane je jedna kampanja na dva raila: pravi novac
 * (tenant `italk`, Gnosis) i sandbox (tenant `italk-sandbox`, Chiado).
 *
 * Novac ne prolazi kroz ovu stranicu. Uplatitelj šalje SEPA nalog na Monerium IBAN
 * ITalka, Monerium minta EURe izravno u Safe kampanje (način `direct`, rail ADR 0025),
 * a stranica stvara MPT intent i čita Gnosis Chain.
 *
 * Safe je registriran kao kampanja `mpt-crowdfunding` u adminu raila (setup →
 * „Dodaj projekt", rail ADR 0027). Dok je `safe` `null` ili potpisnici nisu upisani,
 * stranica ne pokazuje uputu za uplatu — invarijanta, ne stil.
 */
import { isAddress } from "viem";
import {
	RAIL_ITALK,
	RAIL_ITALK_SANDBOX,
	explorerAddressUrl,
	explorerTxUrl,
	type RailProfile,
} from "@/lib/rail-profile";

/** EURe (Monerium, V2) na Gnosis Chainu. */
export const EURE_ADDRESS = RAIL_ITALK.eure;
export const GNOSIS_CHAIN_ID = RAIL_ITALK.chainId;

/** Glavni Safe tenanta italk: ovdje stižu samo uplate bez reference — NE kampanja. */
export const RAIL_SAFE_ADDRESS = "0x449aBCEf4e29a7Dd8d98dB451AF2c463561BAf2e";

/** MPT intent API (pay.domovina.ai backend). */
export const RAIL_API_BASE = RAIL_ITALK.apiBase;

export type Address = `0x${string}`;

/** Kopija `isUsableAddress` iz `@domovina/campaign-core` (v0.1.1): valjana adresa i nije nulta. */
const ZERO_ADDRESS = "0x0000000000000000000000000000000000000000";
export function isUsableAddress(value: string | null | undefined): value is Address {
	return typeof value === "string" && isAddress(value) && value.toLowerCase() !== ZERO_ADDRESS;
}

/** Jedan put plaćanja, provjeren u produkciji: MPT payment intent. */
export type BetaPayment = { kind: "mpt-intent" };
const MPT_INTENT: BetaPayment = { kind: "mpt-intent" };

/** Vlasnici Safe-ova kampanje: ista trojka 2-od-3 kao energy projekti i glavni Safe (admin setup, 9. 11. 2026.). */
const OWNER_SIGNERS: { owners: Address[]; threshold: number } = {
	owners: [
		"0x4924f440A12ac82F6e06B058a33d7fd8182f1944",
		"0xF3c4d416Fa863F0801605629097ffF07f1d46FB8",
		"0xC2386b03441C6104F8d40E52e74306EAE830A24B",
	],
	threshold: 2,
};

export interface BetaProject {
	slug: string;
	/** Naziv kampanje (potvrda o uplati ga ispisuje kao primatelja projekta). */
	place: string;
	/** id kampanje na railu (`tenant_campaigns`), salt Safe-a `project:<id>` */
	campaignId: string;
	safe: Address | null;
	/** Očekivani potpisnici i prag; bez njih kampanja nije naplativa. */
	signers: { owners: Address[]; threshold: number } | null;
	/** `null` = bez cilja (prikazuje se samo prikupljeno). */
	goalCents: number | null;
	payment: BetaPayment | null;
	rail: RailProfile;
}

export const CAMPAIGN_PROD: BetaProject = {
	slug: "mpt",
	place: "Razvoj MPT-a",
	campaignId: "mpt-crowdfunding",
	safe: null,
	signers: OWNER_SIGNERS,
	goalCents: null,
	payment: MPT_INTENT,
	rail: RAIL_ITALK,
};

export const CAMPAIGN_SANDBOX: BetaProject = {
	slug: "mpt-sandbox",
	place: "Razvoj MPT-a (sandbox)",
	campaignId: "mpt-crowdfunding",
	safe: "0x9392491B40232C4C9411449A2f350F1647b72fdA",
	signers: OWNER_SIGNERS,
	goalCents: null,
	payment: MPT_INTENT,
	rail: RAIL_ITALK_SANDBOX,
};

export const BETA_PROJECTS: readonly BetaProject[] = [CAMPAIGN_PROD];

export function hasVerifiedSafe(
	project: BetaProject,
): project is BetaProject & { safe: Address; signers: { owners: Address[]; threshold: number } } {
	return isValidSafe(project.safe) && project.signers !== null;
}

export function isValidSafe(address: string | null): address is Address {
	return isUsableAddress(address);
}

export function isPayable(project: BetaProject): project is BetaProject & { safe: Address; payment: BetaPayment } {
	return (
		isValidSafe(project.safe) &&
		project.payment !== null &&
		project.signers !== null &&
		project.signers.threshold >= 1 &&
		project.signers.threshold <= project.signers.owners.length
	);
}

/** Ponuđeni iznosi (€), kao energy /beta/. */
export const PRESET_AMOUNTS_EUR = [1, 10, 20, 50, 100] as const;
export const DEFAULT_AMOUNT_EUR = 1;
/** Rail prima >0 € i ≤10.000 € po intentu (`MAX_AMOUNT_CENTS`). */
export const MAX_AMOUNT_EUR = 10_000;

/** "12,5" / "12.50" / "12" → broj eura s najviše dvije decimale; `null` kad nije valjan iznos. */
export function parseAmountEur(input: string): number | null {
	const s = input.trim().replace(/\s+/g, "").replace(",", ".");
	if (!/^\d+(\.\d{1,2})?$/.test(s)) return null;
	const n = Number(s);
	return n > 0 && n <= MAX_AMOUNT_EUR ? n : null;
}

/** EURe ima 18 decimala; 1 cent = 10^16 wei (odsijeca ostatak). */
export function weiToCents(value: string): number {
	return Number(BigInt(value) / 10n ** 16n);
}

export function gnosisscanAddressUrl(address: Address): string {
	return explorerAddressUrl(RAIL_ITALK, address);
}

export function gnosisscanTxUrl(hash: string): string {
	return explorerTxUrl(RAIL_ITALK, hash);
}
