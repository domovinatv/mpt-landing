"use client";

import { useState } from "react";
import type { Locale } from "@/i18n/config";
import { getDictionary } from "@/i18n/dictionaries";
import { cardFee, SEPA_FEE_MAX, SEPA_FEE_MIN } from "@/lib/market-fees";
import { mptMonthlyFee } from "@/lib/mpt-pricing";

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
 * "What goes to intermediaries today?" — an illustrative daily/monthly/yearly
 * projection for one merchant from a transaction count and average amount:
 * card fees (merchant), bank orders (buyers) and MPT at list price (merchant).
 * Fee constants live in src/lib/market-fees.ts and src/lib/mpt-pricing.ts.
 *
 * Inputs are kept as raw strings so the field can be fully cleared while
 * typing (placeholder 0); they are parsed only for the math.
 */
export default function SavingsCalculator({ locale }: { locale: Locale }) {
	const t = getDictionary(locale).savings;
	const [txPerDayRaw, setTxPerDayRaw] = useState("200");
	const [avgAmountRaw, setAvgAmountRaw] = useState("20");

	const txPerDay = Math.max(0, Number(txPerDayRaw) || 0);
	const avgAmount = Math.max(0, Number(avgAmountRaw) || 0);

	const cardPerTx = cardFee(avgAmount);
	// the MPT fee depends on monthly volume (free threshold), so derive day/year from the month
	const mptMonth = mptMonthlyFee(txPerDay * avgAmount * 30);
	const mptPerTx = txPerDay * avgAmount > 0 ? mptMonth / (txPerDay * 30) : 0;
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
		mpt: (mptMonth / 30) * r.mult,
	}));

	const inputCls =
		"mt-1 w-full rounded-lg border border-line bg-white px-3 py-2 font-mono text-sm text-ink outline-none transition focus:border-gold";

	return (
		<div className="rounded-[18px] border border-line bg-soft p-6 sm:p-8">
			<h2 className="font-serif text-2xl font-semibold tracking-tight text-navy">{t.title}</h2>
			<p className="mt-2 text-sm leading-relaxed text-mute">{t.subtitle}</p>

			<div className="mt-5 grid grid-cols-2 gap-3">
				<label className="block">
					<span className="text-xs font-medium text-mute">{t.txPerDay}</span>
					<input
						type="number"
						min={0}
						step={10}
						placeholder="0"
						value={txPerDayRaw}
						onChange={(e) => setTxPerDayRaw(e.target.value)}
						className={inputCls}
					/>
				</label>
				<label className="block">
					<span className="text-xs font-medium text-mute">{t.avgAmount}</span>
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

			<div className="mt-5 overflow-x-auto rounded-xl border border-line bg-white">
				<table className="w-full min-w-[480px] text-sm">
					<thead>
						<tr className="border-b border-line text-left text-[11px] font-bold uppercase tracking-wider text-mute">
							<th className="px-4 py-2.5" />
							<th className="px-4 py-2.5">{t.vsCard}</th>
							<th className="px-4 py-2.5">{t.vsSepa}</th>
							<th className="px-4 py-2.5 text-navy">{t.mpt}</th>
						</tr>
					</thead>
					<tbody>
						<tr className="border-b border-line">
							<td className="px-4 py-2.5 font-medium text-mute">{t.perTx}</td>
							<td className="px-4 py-2.5 font-mono text-ink">
								<span className="whitespace-nowrap">{eur(locale, cardPerTx)}</span>
								{avgAmount > 0 && (
									<span className="block text-xs text-mute">{pct(locale, cardPerTx / avgAmount)}</span>
								)}
							</td>
							<td className="px-4 py-2.5 font-mono text-ink">
								<span className="whitespace-nowrap">
									{eur(locale, SEPA_FEE_MIN)}–{eur(locale, SEPA_FEE_MAX)}
								</span>
								{avgAmount > 0 && (
									<span className="block text-xs text-mute">
										{pct(locale, SEPA_FEE_MIN / avgAmount)}–{pct(locale, SEPA_FEE_MAX / avgAmount)}
									</span>
								)}
							</td>
							<td className="bg-gold-soft/30 px-4 py-2.5 font-mono font-semibold text-navy">
								<span className="whitespace-nowrap">{eur(locale, mptPerTx, 3)}</span>
								{avgAmount > 0 && (
									<span className="block text-xs font-normal text-mute">{pct(locale, mptPerTx / avgAmount)}</span>
								)}
							</td>
						</tr>
						{rows.map((r) => (
							<tr key={r.label} className="border-b border-line last:border-0">
								<td className="px-4 py-2.5 font-medium text-mute">{r.label}</td>
								<td className="px-4 py-2.5 font-mono font-semibold text-red">
									{eur(locale, r.card, digitsFor(r.card))}
								</td>
								<td className="px-4 py-2.5 font-mono text-ink">
									<span className="whitespace-nowrap">{eur(locale, r.sepaMin, digitsFor(r.sepaMax))}</span>–
									<span className="whitespace-nowrap">{eur(locale, r.sepaMax, digitsFor(r.sepaMax))}</span>
								</td>
								<td className="bg-gold-soft/30 px-4 py-2.5 font-mono font-semibold text-navy">
									{eur(locale, r.mpt, digitsFor(r.mpt))}
								</td>
							</tr>
						))}
					</tbody>
				</table>
			</div>

			<p className="mt-3 text-xs leading-relaxed text-mute/90">{t.note}</p>
		</div>
	);
}
