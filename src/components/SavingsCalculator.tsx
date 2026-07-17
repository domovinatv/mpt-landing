"use client";

import { useState } from "react";
import type { Locale } from "@/i18n/config";
import { getDictionary } from "@/i18n/dictionaries";
import { cardFee, SEPA_FEE_MAX, SEPA_FEE_MIN } from "@/lib/market-fees";

const eur = (locale: Locale, value: number, digits = 2) =>
	new Intl.NumberFormat(locale === "hr" ? "hr-HR" : "en-IE", {
		style: "currency",
		currency: "EUR",
		maximumFractionDigits: digits,
		minimumFractionDigits: digits > 0 ? 2 : 0,
	}).format(value);

const pct = (locale: Locale, value: number) =>
	new Intl.NumberFormat(locale === "hr" ? "hr-HR" : "en-IE", {
		style: "percent",
		maximumFractionDigits: 1,
	}).format(value);

/**
 * "What does Croatian retail lose to intermediaries today?" — an illustrative
 * daily/monthly/yearly projection from a transaction count and average amount.
 * Fee constants and their sources live in src/lib/market-fees.ts.
 *
 * Inputs are kept as raw strings so the field can be fully cleared while
 * typing (placeholder 0); they are parsed only for the math.
 */
export default function SavingsCalculator({ locale }: { locale: Locale }) {
	const t = getDictionary(locale).savings;
	const [txPerDayRaw, setTxPerDayRaw] = useState("1000");
	const [avgAmountRaw, setAvgAmountRaw] = useState("20");

	const txPerDay = Math.max(0, Number(txPerDayRaw) || 0);
	const avgAmount = Math.max(0, Number(avgAmountRaw) || 0);

	const cardPerTx = cardFee(avgAmount);
	const digitsFor = (v: number) => (v >= 1000 ? 0 : 2);
	const rows = [
		{ label: t.daily, mult: 1 },
		{ label: t.monthly, mult: 30 },
		{ label: t.yearly, mult: 365 },
	].map((r) => ({
		label: r.label,
		card: cardPerTx * txPerDay * r.mult,
		sepaMin: SEPA_FEE_MIN * txPerDay * r.mult,
		sepaMax: SEPA_FEE_MAX * txPerDay * r.mult,
	}));

	const inputCls =
		"w-full rounded-lg border border-line bg-white px-3 py-2 font-mono text-sm text-ink outline-none transition focus:border-gold";

	return (
		<div className="rounded-2xl border border-line bg-soft p-4">
			<p className="text-xs font-bold uppercase tracking-[0.18em] text-gold">{t.title}</p>
			<p className="mt-2 text-[11px] leading-relaxed text-mute">{t.subtitle}</p>

			<div className="mt-3 grid grid-cols-2 gap-2">
				<label className="block">
					<span className="text-[11px] font-medium text-mute">{t.txPerDay}</span>
					<input
						type="number"
						min={0}
						step={100}
						placeholder="0"
						value={txPerDayRaw}
						onChange={(e) => setTxPerDayRaw(e.target.value)}
						className={inputCls}
					/>
				</label>
				<label className="block">
					<span className="text-[11px] font-medium text-mute">{t.avgAmount}</span>
					<input
						type="number"
						min={0}
						step={1}
						placeholder="0"
						value={avgAmountRaw}
						onChange={(e) => setAvgAmountRaw(e.target.value)}
						className={inputCls}
					/>
				</label>
			</div>

			{/* per-transaction overhead, absolute + as a share of the average amount */}
			<div className="mt-3 rounded-xl border border-line bg-white px-3 py-2 text-[11px] leading-relaxed">
				<p className="font-bold uppercase tracking-wider text-mute">{t.perTx}</p>
				<div className="mt-1 flex items-baseline justify-between gap-2">
					<span className="text-mute">{t.vsCard}</span>
					<span className="text-right font-mono font-semibold text-ink">
						<span className="whitespace-nowrap">{eur(locale, cardPerTx)}</span>
						{avgAmount > 0 && (
							<>
								{" · "}
								<span className="whitespace-nowrap">{pct(locale, cardPerTx / avgAmount)}</span>
							</>
						)}
					</span>
				</div>
				<div className="mt-1 flex items-baseline justify-between gap-2">
					<span className="text-mute">{t.vsSepa}</span>
					<span className="text-right font-mono font-semibold text-ink">
						<span className="whitespace-nowrap">
							{eur(locale, SEPA_FEE_MIN)}–{eur(locale, SEPA_FEE_MAX)}
						</span>
						{avgAmount > 0 && (
							<>
								{" · "}
								<span className="whitespace-nowrap">
									{pct(locale, SEPA_FEE_MIN / avgAmount)}–{pct(locale, SEPA_FEE_MAX / avgAmount)}
								</span>
							</>
						)}
					</span>
				</div>
			</div>

			<div className="mt-3 overflow-hidden rounded-xl border border-line bg-white">
				<table className="w-full text-xs">
					<thead>
						<tr className="border-b border-line text-left text-[10px] font-bold uppercase tracking-wider text-mute">
							<th className="px-3 py-2" />
							<th className="px-3 py-2">{t.vsCard}</th>
							<th className="px-3 py-2">{t.vsSepa}</th>
						</tr>
					</thead>
					<tbody>
						{rows.map((r) => (
							<tr key={r.label} className="border-b border-line last:border-0">
								<td className="px-3 py-2 font-medium text-mute">{r.label}</td>
								<td className="px-3 py-2 font-mono font-semibold text-navy">
									{eur(locale, r.card, digitsFor(r.card))}
								</td>
								<td className="px-3 py-2 font-mono text-ink">
									<span className="whitespace-nowrap">{eur(locale, r.sepaMin, digitsFor(r.sepaMax))}</span>–
									<span className="whitespace-nowrap">{eur(locale, r.sepaMax, digitsFor(r.sepaMax))}</span>
								</td>
							</tr>
						))}
					</tbody>
				</table>
			</div>

			<p className="mt-2 text-[10px] leading-relaxed text-mute/80">{t.note}</p>
		</div>
	);
}
