"use client";

import { useState } from "react";
import type { Locale } from "@/i18n/config";
import { getDictionary } from "@/i18n/dictionaries";
import { cardFee, SEPA_FEE_MAX } from "@/lib/market-fees";

const eur = (locale: Locale, value: number, digits = 2) =>
	new Intl.NumberFormat(locale === "hr" ? "hr-HR" : "en-IE", {
		style: "currency",
		currency: "EUR",
		maximumFractionDigits: digits,
		minimumFractionDigits: digits > 0 ? 2 : 0,
	}).format(value);

/**
 * "What does Croatian retail lose to intermediaries today?" — an illustrative
 * daily/monthly/yearly projection from a transaction count and average amount.
 * Fee constants and their sources live in src/lib/market-fees.ts.
 */
export default function SavingsCalculator({ locale }: { locale: Locale }) {
	const t = getDictionary(locale).savings;
	const [txPerDay, setTxPerDay] = useState(1000);
	const [avgAmount, setAvgAmount] = useState(20);

	const cardPerTx = cardFee(avgAmount);
	const rows = [
		{ label: t.daily, mult: 1 },
		{ label: t.monthly, mult: 30 },
		{ label: t.yearly, mult: 365 },
	].map((r) => ({
		label: r.label,
		card: cardPerTx * txPerDay * r.mult,
		sepa: SEPA_FEE_MAX * txPerDay * r.mult,
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
						value={txPerDay}
						onChange={(e) => setTxPerDay(Math.max(0, Number(e.target.value) || 0))}
						className={inputCls}
					/>
				</label>
				<label className="block">
					<span className="text-[11px] font-medium text-mute">{t.avgAmount}</span>
					<input
						type="number"
						min={0}
						step={1}
						value={avgAmount}
						onChange={(e) => setAvgAmount(Math.max(0, Number(e.target.value) || 0))}
						className={inputCls}
					/>
				</label>
			</div>

			<p className="mt-2 text-[11px] text-mute">
				{t.perTx}: <span className="font-mono text-ink">{eur(locale, cardPerTx)}</span> {t.vsCard} ·{" "}
				<span className="font-mono text-ink">
					{t.upTo} {eur(locale, SEPA_FEE_MAX)}
				</span>{" "}
				{t.vsSepa}
			</p>

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
									{eur(locale, r.card, r.card >= 1000 ? 0 : 2)}
								</td>
								<td className="px-3 py-2 font-mono text-ink">
									{t.upTo} {eur(locale, r.sepa, r.sepa >= 1000 ? 0 : 2)}
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
