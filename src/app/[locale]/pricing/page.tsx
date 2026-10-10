import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { isLocale } from "@/i18n/config";
import { getDictionary, requestHref } from "@/i18n/dictionaries";
import SavingsCalculator from "@/components/SavingsCalculator";
import {
	Cta,
	ghostButtonCls,
	goldButtonCls,
	pageMetadata,
	PageShell,
	SectionHeading,
} from "@/components/site";

const GITHUB = "https://github.com/domovinatv/pay.domovina.ai";

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
	const { locale } = await params;
	if (!isLocale(locale)) notFound();
	return pageMetadata(locale, "pricing");
}

export default async function PricingPage({ params }: { params: Promise<{ locale: string }> }) {
	const { locale } = await params;
	if (!isLocale(locale)) notFound();
	const dict = getDictionary(locale);
	const { pricing } = dict;

	return (
		<PageShell locale={locale} page="pricing">
			<section className="relative z-10 mx-auto max-w-6xl px-6 pb-12 pt-12 lg:pt-16">
				<SectionHeading as="h1" eyebrow={pricing.eyebrow} title={pricing.title} subtitle={pricing.subtitle} />

				<div className="mt-12 grid gap-6 lg:grid-cols-3">
					{pricing.plans.map((plan) => (
						<div
							key={plan.name}
							className={`flex flex-col rounded-[18px] border bg-white p-7 shadow-[0_10px_30px_-18px_rgba(0,30,80,0.22)] ${
								plan.featured ? "border-gold ring-1 ring-gold/40" : "border-line"
							}`}
						>
							<h2 className="font-semibold text-ink">{plan.name}</h2>
							<p className="mt-4 font-serif text-4xl font-semibold tracking-tight text-navy">{plan.price}</p>
							<p className="mt-1 text-sm text-mute">{plan.priceNote}</p>
							<ul className="mt-6 flex-1 space-y-2.5 text-sm leading-relaxed text-mute">
								{plan.features.map((feature) => (
									<li key={feature} className="flex gap-2.5">
										<span aria-hidden className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-gold" />
										<span>{feature}</span>
									</li>
								))}
							</ul>
							<a
								href={plan.kind === "github" ? GITHUB : requestHref(dict)}
								{...(plan.kind === "github" ? { target: "_blank", rel: "noopener noreferrer" } : {})}
								className={`mt-7 text-center ${plan.featured ? goldButtonCls : ghostButtonCls}`}
							>
								{plan.cta}
							</a>
						</div>
					))}
				</div>
				<p className="mx-auto mt-6 max-w-3xl text-center text-xs leading-relaxed text-mute">{pricing.note}</p>
			</section>

			<section id="calculator" className="relative z-10 mx-auto max-w-3xl scroll-mt-24 px-6 py-12">
				<SavingsCalculator locale={locale} />
			</section>

			<section className="relative z-10 mx-auto max-w-3xl px-6 py-12">
				<h2 className="text-center font-serif text-3xl font-semibold tracking-tight text-navy">
					{pricing.faqTitle}
				</h2>
				<div className="mt-10 divide-y divide-line rounded-[18px] border border-line bg-white">
					{pricing.faq.map((item) => (
						<details key={item.q} className="group px-6 py-4">
							<summary className="flex cursor-pointer list-none items-center justify-between gap-4 font-semibold text-ink">
								{item.q}
								<span aria-hidden className="text-gold transition group-open:rotate-45">
									+
								</span>
							</summary>
							<p className="mt-3 text-sm leading-relaxed text-mute">{item.a}</p>
						</details>
					))}
				</div>
			</section>

			<Cta dict={dict} />
		</PageShell>
	);
}
