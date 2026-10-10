import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { isLocale } from "@/i18n/config";
import { getDictionary } from "@/i18n/dictionaries";
import { cardCls, Cta, pageMetadata, PageShell, SectionHeading } from "@/components/site";

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
	const { locale } = await params;
	if (!isLocale(locale)) notFound();
	return pageMetadata(locale, "merchants");
}

export default async function MerchantsPage({ params }: { params: Promise<{ locale: string }> }) {
	const { locale } = await params;
	if (!isLocale(locale)) notFound();
	const dict = getDictionary(locale);
	const { merchants } = dict;

	return (
		<PageShell locale={locale} page="merchants">
			<section className="relative z-10 mx-auto max-w-6xl px-6 pb-12 pt-12 lg:pt-16">
				<SectionHeading
					as="h1"
					eyebrow={merchants.eyebrow}
					title={merchants.title}
					subtitle={merchants.subtitle}
				/>
			</section>

			<section id="onboarding" className="relative z-10 mx-auto max-w-6xl scroll-mt-24 px-6 py-12">
				<SectionHeading title={merchants.onboardingTitle} subtitle={merchants.onboardingSubtitle} />
				<div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
					{merchants.onboarding.map((step) => (
						<div key={step.num} className={cardCls}>
							<span className="font-serif text-sm font-semibold text-gold">{step.num}</span>
							<h3 className="mt-3 font-semibold text-ink">{step.title}</h3>
							<p className="mt-3 text-sm leading-relaxed text-mute">{step.text}</p>
						</div>
					))}
				</div>
			</section>

			<section id="cases" className="relative z-10 mx-auto max-w-6xl scroll-mt-24 px-6 py-12">
				<SectionHeading title={merchants.casesTitle} subtitle={merchants.casesSubtitle} />

				{/* phones: one card per case */}
				<div className="mt-12 space-y-3 md:hidden">
					{merchants.cases.map((c) => (
						<div key={c.when} className="rounded-[18px] border border-line bg-white p-5 text-sm">
							<p className="font-semibold text-ink">{c.when}</p>
							<p className="mt-2 leading-relaxed text-mute">{c.what}</p>
							<p className="mt-3 font-mono text-xs text-navy">{c.event}</p>
						</div>
					))}
				</div>

				<div className="mt-12 hidden overflow-hidden rounded-[18px] border border-line bg-white shadow-[0_10px_30px_-18px_rgba(0,30,80,0.22)] md:block">
					<table className="w-full text-sm">
						<thead>
							<tr className="border-b border-line text-left text-[11px] font-bold uppercase tracking-wider text-mute">
								<th className="w-1/4 px-5 py-3">{merchants.casesHead.when}</th>
								<th className="px-5 py-3">{merchants.casesHead.what}</th>
								<th className="w-1/5 px-5 py-3">{merchants.casesHead.event}</th>
							</tr>
						</thead>
						<tbody>
							{merchants.cases.map((c) => (
								<tr key={c.when} className="border-b border-line align-top last:border-0">
									<td className="px-5 py-4 font-semibold text-ink">{c.when}</td>
									<td className="px-5 py-4 leading-relaxed text-mute">{c.what}</td>
									<td className="px-5 py-4 font-mono text-xs text-navy">{c.event}</td>
								</tr>
							))}
						</tbody>
					</table>
				</div>
			</section>

			<section id="money" className="relative z-10 mx-auto max-w-6xl scroll-mt-24 px-6 py-12">
				<h2 className="text-center font-serif text-3xl font-semibold tracking-tight text-navy sm:text-4xl">
					{merchants.moneyTitle}
				</h2>
				<div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
					{merchants.money.map((item) => (
						<div key={item.title} className={`${cardCls} transition hover:border-gold`}>
							<h3 className="font-semibold text-ink">{item.title}</h3>
							<p className="mt-3 text-sm leading-relaxed text-mute">{item.text}</p>
						</div>
					))}
				</div>
			</section>

			<section id="missing" className="relative z-10 mx-auto max-w-3xl scroll-mt-24 px-6 py-12">
				<div className="rounded-[18px] border border-line bg-soft p-7">
					<h2 className="font-serif text-2xl font-semibold tracking-tight text-navy">{merchants.missingTitle}</h2>
					<p className="mt-2 text-sm text-mute">{merchants.missingSubtitle}</p>
					<ul className="mt-5 space-y-2.5 text-sm leading-relaxed text-mute">
						{merchants.missing.map((item) => (
							<li key={item} className="flex gap-2.5">
								<span aria-hidden className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-mute" />
								<span>{item}</span>
							</li>
						))}
					</ul>
				</div>
			</section>

			<Cta dict={dict} />
		</PageShell>
	);
}
