"use client";

import { useCallback, useEffect, useState } from "react";
import {
	CROWDFUND_PROD,
	CROWDFUND_SANDBOX,
	GOAL_EUR,
	MAX_AMOUNT_EUR,
	PRESET_AMOUNTS,
	createIntent,
	fetchPayers,
	fetchRaised,
	parseAmountEur,
	type IntentError,
	type PayerTag,
	type Raised,
} from "@/lib/crowdfund";
import type { Dictionary } from "@/i18n/dictionaries";
import type { Locale } from "@/i18n/config";

type Copy = Dictionary["support"]["widget"];

const REFRESH_MS = 20_000;

function eur(cents: number, locale: Locale) {
	return new Intl.NumberFormat(locale === "hr" ? "hr-HR" : "en-IE", {
		style: "currency",
		currency: "EUR",
		minimumFractionDigits: cents % 100 === 0 ? 0 : 2,
	}).format(cents / 100);
}

function when(at: number | null, locale: Locale) {
	if (at === null) return "";
	return new Intl.DateTimeFormat(locale === "hr" ? "hr-HR" : "en-GB", {
		day: "numeric",
		month: "short",
		hour: "2-digit",
		minute: "2-digit",
	}).format(at);
}

export default function SupportWidget({
	railKey,
	copy,
	locale,
}: {
	railKey: "prod" | "sandbox";
	copy: Copy;
	locale: Locale;
}) {
	const rail = railKey === "prod" ? CROWDFUND_PROD : CROWDFUND_SANDBOX;
	const [preset, setPreset] = useState<number | null>(25);
	const [custom, setCustom] = useState("");
	const [busy, setBusy] = useState(false);
	const [error, setError] = useState<IntentError | null>(null);
	const [raised, setRaised] = useState<Raised | null>(null);
	const [payers, setPayers] = useState<PayerTag[]>([]);
	const [readError, setReadError] = useState(false);

	const amount = preset ?? parseAmountEur(custom);
	const ready = rail.safe !== null;

	const load = useCallback(
		async (signal: AbortSignal) => {
			try {
				const [r, p] = await Promise.all([
					fetchRaised(rail, signal),
					fetchPayers(rail, signal).catch(() => [] as PayerTag[]),
				]);
				setRaised(r);
				setPayers(p);
				setReadError(false);
			} catch {
				if (!signal.aborted) setReadError(true);
			}
		},
		[rail],
	);

	useEffect(() => {
		if (!ready) return;
		const ctrl = new AbortController();
		load(ctrl.signal);
		const id = setInterval(() => load(ctrl.signal), REFRESH_MS);
		return () => {
			clearInterval(id);
			ctrl.abort();
		};
	}, [ready, load]);

	async function pay() {
		if (amount === null) return;
		setBusy(true);
		setError(null);
		const r = await createIntent(rail, amount);
		if (r.ok) {
			window.location.assign(r.checkoutUrl);
			return;
		}
		setError(r.reason);
		setBusy(false);
	}

	// received by Monerium, not yet minted (prod only — payer tags carry the state)
	const pendingCents = payers.filter((p) => !p.minted).reduce((s, p) => s + p.cents, 0);
	const goalCents = GOAL_EUR !== null ? GOAL_EUR * 100 : null;
	const pct = goalCents && raised ? Math.min(100, Math.round((raised.cents / goalCents) * 100)) : null;

	return (
		<div className="grid gap-6 lg:grid-cols-[1.1fr_1fr]">
			{/* amount picker */}
			<div className="rounded-[18px] border border-gold bg-white p-7 shadow-[0_10px_30px_-18px_rgba(0,30,80,0.22)] ring-1 ring-gold/40">
				<h2 className="font-serif text-2xl font-semibold tracking-tight text-navy">{copy.title}</h2>
				<p className="mt-2 text-sm leading-relaxed text-mute">{copy.lead}</p>

				{!ready ? (
					<p className="mt-6 rounded-xl border border-line bg-gold-soft px-4 py-3 text-sm leading-relaxed text-navy">
						{copy.notReady}
					</p>
				) : (
					<>
						<div className="mt-6 flex flex-wrap gap-2" role="radiogroup" aria-label={copy.amountLabel}>
							{PRESET_AMOUNTS.map((a) => (
								<button
									key={a}
									type="button"
									role="radio"
									aria-checked={preset === a}
									onClick={() => {
										setPreset(a);
										setCustom("");
										setError(null);
									}}
									className={`rounded-full border px-5 py-2.5 text-sm font-semibold transition ${
										preset === a
											? "border-navy bg-navy text-white"
											: "border-line bg-white text-navy hover:border-gold"
									}`}
								>
									{a} €
								</button>
							))}
						</div>
						<label className="mt-4 block text-sm text-mute">
							{copy.customLabel}
							<div className="mt-1.5 flex items-center gap-2">
								<input
									inputMode="decimal"
									value={custom}
									placeholder="15"
									onChange={(e) => {
										setCustom(e.target.value);
										setPreset(null);
										setError(null);
									}}
									className="w-36 rounded-xl border border-line bg-white px-4 py-2.5 text-ink outline-none focus:border-gold"
								/>
								<span className="text-ink">€</span>
							</div>
						</label>
						{preset === null && custom !== "" && amount === null && (
							<p className="mt-2 text-xs text-[#a1361f]">
								{copy.errors.invalid_amount.replace("{max}", MAX_AMOUNT_EUR.toLocaleString(locale))}
							</p>
						)}

						<button
							type="button"
							disabled={amount === null || busy}
							onClick={pay}
							className="mt-6 w-full rounded-full bg-gradient-to-br from-gold-light to-gold px-6 py-3.5 text-sm font-semibold text-[#3a2900] shadow-[0_8px_22px_-10px_rgba(200,145,42,0.7)] transition hover:-translate-y-0.5 disabled:translate-y-0 disabled:opacity-50"
						>
							{busy ? copy.busy : copy.pay.replace("{amount}", amount !== null ? eur(Math.round(amount * 100), locale) : "")}
						</button>
						{error && (
							<p className="mt-3 text-sm text-[#a1361f]">
								{copy.errors[error].replace("{max}", MAX_AMOUNT_EUR.toLocaleString(locale))}
							</p>
						)}
						<ul className="mt-6 space-y-2 text-xs leading-relaxed text-mute">
							{copy.notes.map((n) => (
								<li key={n} className="flex gap-2">
									<span aria-hidden className="mt-1.5 h-1 w-1 shrink-0 rounded-full bg-gold" />
									<span>{n}</span>
								</li>
							))}
							{rail.payerTags && (
								<li className="flex gap-2">
									<span aria-hidden className="mt-1.5 h-1 w-1 shrink-0 rounded-full bg-gold" />
									<span>{copy.payerTagNotice}</span>
								</li>
							)}
						</ul>
					</>
				)}
			</div>

			{/* raised so far */}
			<div className="rounded-[18px] border border-line bg-white p-7 shadow-[0_10px_30px_-18px_rgba(0,30,80,0.22)]">
				<p className="text-xs font-bold uppercase tracking-[0.18em] text-gold">{copy.raisedLabel}</p>
				<p className="mt-2 font-serif text-4xl font-semibold tracking-tight text-navy">
					{ready && raised ? eur(raised.cents, locale) : "—"}
				</p>
				<p className="mt-1 text-sm text-mute">
					{ready && raised
						? copy.raisedSub.replace("{count}", String(raised.count)).replace("{chain}", rail.chainName)
						: ready
							? copy.loading
							: copy.raisedEmpty}
				</p>
				{pendingCents > 0 && (
					<p className="mt-1 text-sm text-navy">{copy.pending.replace("{amount}", eur(pendingCents, locale))}</p>
				)}
				{pct !== null && goalCents !== null && (
					<div className="mt-4">
						<div className="h-2.5 overflow-hidden rounded-full bg-line">
							<div className="h-full rounded-full bg-gradient-to-r from-gold-light to-gold" style={{ width: `${pct}%` }} />
						</div>
						<p className="mt-1.5 text-xs text-mute">
							{copy.goal.replace("{pct}", String(pct)).replace("{goal}", eur(goalCents, locale))}
						</p>
					</div>
				)}
				{readError && <p className="mt-3 text-xs text-[#a1361f]">{copy.readError}</p>}

				{ready && (
					<>
						<h3 className="mt-6 text-sm font-semibold text-ink">{copy.listTitle}</h3>
						<ul className="mt-2 divide-y divide-line text-sm">
							{(payers.length > 0
								? payers.slice(0, 8).map((p, i) => ({
										key: `${p.at}-${i}`,
										label: p.label ?? copy.anonymous,
										cents: p.cents,
										at: p.at,
										hash: p.txHashes[p.txHashes.length - 1] ?? null,
										state: p.minted ? copy.stateMinted : copy.stateReceived,
									}))
								: (raised?.contributions ?? []).slice(0, 8).map((c) => ({
										key: c.hash,
										label: copy.anonymous,
										cents: c.cents,
										at: c.at,
										hash: c.hash,
										state: copy.stateMinted,
									}))
							).map((row) => (
								<li key={row.key} className="flex items-baseline justify-between gap-3 py-2">
									<span className="min-w-0">
										<span className="font-medium text-ink">{row.label}</span>{" "}
										<span className="text-xs text-mute">
											{when(row.at, locale)} ·{" "}
											{row.hash ? (
												<a
													href={`${rail.explorer}/tx/${row.hash}`}
													target="_blank"
													rel="noopener noreferrer"
													className="underline decoration-gold/50 underline-offset-2"
												>
													{row.state}
												</a>
											) : (
												row.state
											)}
										</span>
									</span>
									<span className="shrink-0 font-semibold text-navy">{eur(row.cents, locale)}</span>
								</li>
							))}
							{raised && raised.count === 0 && payers.length === 0 && (
								<li className="py-2 text-mute">{copy.listEmpty}</li>
							)}
						</ul>
						<a
							href={`${rail.explorer}/address/${rail.safe}#tokentxns`}
							target="_blank"
							rel="noopener noreferrer"
							className="mt-4 inline-block break-all text-xs text-mute underline decoration-gold/50 underline-offset-2"
						>
							{copy.safeLink.replace("{chain}", rail.chainName)}: {rail.safe}
						</a>
					</>
				)}
			</div>
		</div>
	);
}
