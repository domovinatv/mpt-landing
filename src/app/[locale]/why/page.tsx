import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { isLocale } from "@/i18n/config";
import { getDictionary } from "@/i18n/dictionaries";
import { cardCls, Cta, pageMetadata, PageShell, SectionHeading, textLinkCls } from "@/components/site";

const toneCls: Record<"win" | "leak" | "warn", string> = {
	win: "border-green/40 bg-green-soft/60 text-green",
	leak: "border-red/30 bg-red-soft/70 text-red",
	warn: "border-gold/40 bg-gold-soft/50 text-[#7a5a12]",
};

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
	const { locale } = await params;
	if (!isLocale(locale)) notFound();
	return pageMetadata(locale, "why");
}

export default async function WhyPage({ params }: { params: Promise<{ locale: string }> }) {
	const { locale } = await params;
	if (!isLocale(locale)) notFound();
	const dict = getDictionary(locale);
	const { why } = dict;

	return (
		<PageShell locale={locale} page="why">
			<section className="relative z-10 mx-auto max-w-6xl px-6 pb-12 pt-12 lg:pt-16">
				<SectionHeading as="h1" title={why.title} subtitle={why.subtitle} />

				{/* channel fee comparison — numbers from the isplativost analysis + MPT pricing */}
				<div className="mt-12 overflow-x-auto rounded-[18px] border border-line bg-white shadow-[0_10px_30px_-18px_rgba(0,30,80,0.22)]">
					<table className="w-full min-w-[720px] text-sm">
						<thead>
							<tr className="border-b border-line text-left text-[11px] font-bold uppercase tracking-wider text-mute">
								<th className="px-5 py-3">{why.tableHead.channel}</th>
								<th className="px-5 py-3">{why.tableHead.fee}</th>
								<th className="px-5 py-3">{why.tableHead.at1}</th>
								<th className="px-5 py-3">{why.tableHead.at2}</th>
								<th className="px-5 py-3">{why.tableHead.at5}</th>
								<th className="px-5 py-3">{why.tableHead.at100}</th>
							</tr>
						</thead>
						<tbody>
							{why.channels.map((ch) => (
								<tr key={ch.name} className="border-b border-line last:border-0">
									<td className="px-5 py-4 font-semibold text-ink">{ch.name}</td>
									<td className="max-w-56 px-5 py-4 text-mute">{ch.fee}</td>
									{[ch.at1, ch.at2, ch.at5, ch.at100].map((v, i) => (
										<td key={i} className="px-5 py-4">
											<span
												className={`inline-block whitespace-nowrap rounded-full border px-2.5 py-0.5 font-mono text-xs font-semibold ${toneCls[ch.tone]}`}
											>
												{v}
											</span>
										</td>
									))}
								</tr>
							))}
						</tbody>
					</table>
				</div>

				<div className="mt-6 grid gap-6 sm:grid-cols-2">
					{why.points.map((point) => (
						<div key={point.title} className={`${cardCls} transition hover:border-gold`}>
							<h2 className="font-semibold text-ink">{point.title}</h2>
							<p className="mt-3 text-sm leading-relaxed text-mute">{point.text}</p>
						</div>
					))}
				</div>

				<p className="mt-8 text-center text-sm">
					<Link href={`/${locale}/pricing#calculator`} className={textLinkCls}>
						{why.calcLink} →
					</Link>
				</p>
				<p className="mt-4 text-center text-xs text-mute">
					{why.sourceNote}{" "}
					<a href={why.sourceLink.href} target="_blank" rel="noopener noreferrer" className={textLinkCls}>
						{why.sourceLink.label}
					</a>
				</p>
			</section>

			<Cta dict={dict} />
		</PageShell>
	);
}
