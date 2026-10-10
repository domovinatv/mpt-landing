import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { isLocale, type Locale } from "@/i18n/config";
import { getDictionary, requestHref, type Dictionary } from "@/i18n/dictionaries";
import {
	cardCls,
	Cta,
	ghostButtonCls,
	goldButtonCls,
	navyBand,
	pageMetadata,
	PageShell,
	SectionHeading,
	textLinkCls,
} from "@/components/site";

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
	const { locale } = await params;
	if (!isLocale(locale)) notFound();
	return pageMetadata(locale, "home");
}

export default async function HomePage({ params }: { params: Promise<{ locale: string }> }) {
	const { locale } = await params;
	if (!isLocale(locale)) notFound();
	const dict = getDictionary(locale);

	return (
		<PageShell locale={locale} page="home">
			<Hero dict={dict} locale={locale} />
			<How dict={dict} />
			<Integrate dict={dict} locale={locale} />
			<Audiences dict={dict} />
			<PricingTeaser dict={dict} locale={locale} />
			<Trust dict={dict} />
			<Status dict={dict} />
			<Cta dict={dict} />
		</PageShell>
	);
}

function Hero({ dict, locale }: { dict: Dictionary; locale: Locale }) {
	return (
		<section className="relative z-10 mx-auto grid max-w-6xl items-center gap-14 px-6 pb-24 pt-16 lg:grid-cols-2 lg:pt-24">
			<div>
				<p className="mb-5 text-xs font-bold uppercase tracking-[0.18em] text-gold">{dict.hero.eyebrow}</p>
				<h1 className="font-serif text-4xl font-semibold leading-[1.05] tracking-tight text-navy sm:text-5xl lg:text-6xl">
					{dict.hero.title}{" "}
					<span className="bg-gradient-to-r from-gold-light to-gold bg-clip-text text-transparent">
						{dict.hero.titleAccent}
					</span>
				</h1>
				<p className="mt-6 max-w-xl text-lg leading-relaxed text-mute">{dict.hero.subtitle}</p>
				<div className="mt-9 flex flex-wrap gap-4">
					<a href={requestHref(dict)} className={goldButtonCls}>
						{dict.hero.ctaPrimary}
					</a>
					<Link href={`/${locale}/flow`} className={ghostButtonCls}>
						{dict.hero.ctaSecondary}
					</Link>
				</div>
			</div>
			<div
				className="rounded-3xl border border-navy-800 p-8 shadow-[0_24px_60px_-28px_rgba(0,30,80,0.45)]"
				style={{ background: navyBand("420px 260px at 80% 0%") }}
			>
				<p className="text-sm text-[#A9BBD8]">{dict.hero.cardLabel}</p>
				<p className="mt-2 font-serif text-6xl font-semibold tracking-tight text-gold-light">
					{dict.hero.cardTotal}
				</p>
				<p className="mt-1 text-sm text-[#C9D6EC]">{dict.hero.cardTotalNote}</p>
				<div className="mt-8 space-y-4">
					{dict.hero.cardRows.map((row) => (
						<div
							key={row.label}
							className="flex items-center justify-between gap-4 border-b border-white/10 pb-3 text-sm last:border-0"
						>
							<span className="text-[#A9BBD8]">{row.label}</span>
							<span className="shrink-0 font-mono text-white">{row.value}</span>
						</div>
					))}
				</div>
				<p className="mt-4 text-xs text-[#8FA6C9]">{dict.hero.cardFootnote}</p>
			</div>
		</section>
	);
}

function How({ dict }: { dict: Dictionary }) {
	const { how } = dict;
	return (
		<section id="how" className="relative z-10 mx-auto max-w-6xl scroll-mt-24 px-6 py-20">
			<SectionHeading title={how.title} subtitle={how.subtitle} />

			{/* phones: one card per row, so the MPT column is never scrolled out of view */}
			<div className="mt-12 space-y-3 sm:hidden">
				{how.compareRows.map((row) => (
					<div key={row.aspect} className="rounded-[18px] border border-line bg-white p-5 text-sm">
						<p className="font-semibold text-ink">{row.aspect}</p>
						<p className="mt-2 text-mute">
							<span className="text-[11px] font-bold uppercase tracking-wider">RevenueCat</span> · {row.rc}
						</p>
						<p className="mt-1.5 font-medium text-navy">
							<span className="text-[11px] font-bold uppercase tracking-wider">MPT</span> · {row.mpt}
						</p>
					</div>
				))}
			</div>

			<div className="mt-12 hidden overflow-x-auto rounded-[18px] border border-line bg-white shadow-[0_10px_30px_-18px_rgba(0,30,80,0.22)] sm:block">
				<table className="w-full min-w-[640px] text-sm">
					<thead>
						<tr className="border-b border-line text-left text-[11px] font-bold uppercase tracking-wider text-mute">
							<th className="px-5 py-3">{how.compareHead.aspect}</th>
							<th className="px-5 py-3">{how.compareHead.rc}</th>
							<th className="px-5 py-3 text-navy">{how.compareHead.mpt}</th>
						</tr>
					</thead>
					<tbody>
						{how.compareRows.map((row) => (
							<tr key={row.aspect} className="border-b border-line last:border-0">
								<td className="px-5 py-4 font-semibold text-ink">{row.aspect}</td>
								<td className="px-5 py-4 text-mute">{row.rc}</td>
								<td className="bg-gold-soft/30 px-5 py-4 font-medium text-navy">{row.mpt}</td>
							</tr>
						))}
					</tbody>
				</table>
			</div>

			<div className="mt-6 grid gap-6 sm:grid-cols-2">
				{how.cards.map((card) => (
					<div key={card.title} className={`${cardCls} transition hover:border-gold`}>
						<h3 className="font-semibold text-ink">{card.title}</h3>
						<p className="mt-3 text-sm leading-relaxed text-mute">{card.text}</p>
					</div>
				))}
			</div>
		</section>
	);
}

/** illustrative request/webhook pair — field names match pay.domovina.ai backend/src/intents */
const requestSnippet = (orderLabel: string) => `curl -X POST https://pay.domovina.ai/api/intents \\
  -H "x-mpt-key: $MPT_KEY" \\
  -H "content-type: application/json" \\
  -d '{
    "target_address": "0x9f2c…e41a",
    "amount_eur": 24.90,
    "label": "${orderLabel}"
  }'

→ {
  "sid": "k7q2m9",
  "memo": "mpt:0x9f2c…e41a?sid=k7q2m9",
  "iban": "…",
  "epc_qr_data": "BCD\\n002\\n1\\nSCT…",
  "checkout_url": ".../checkout/k7q2m9",
  "status_stream_url": ".../api/intents/k7q2m9/stream",
  "expires_at": "2026-10-10T12:15:00Z"
}`;

const webhookSnippet = `POST https://your-shop.example/webhooks/mpt
webhook-id: int_k7q2m9
webhook-timestamp: 1791633672
webhook-signature: v1,…

{
  "type": "intent.paid",
  "event_id": "int_k7q2m9",
  "occurred_at": "2026-10-10T12:01:12Z",
  "sid": "k7q2m9",
  "state": "paid",
  "amount_cents": 2490,
  "amount_received_cents": 2490,
  "overpaid_cents": 0,
  "currency": "EUR"
}`;

function Integrate({ dict, locale }: { dict: Dictionary; locale: Locale }) {
	const { integrate } = dict;
	return (
		<section id="integrate" className="relative z-10 mx-auto max-w-6xl scroll-mt-24 px-6 py-20">
			<SectionHeading title={integrate.title} subtitle={integrate.subtitle} />
			<div className="mt-12 grid gap-6 md:grid-cols-3">
				{integrate.steps.map((step) => (
					<div key={step.num} className={cardCls}>
						<span className="font-serif text-sm font-semibold text-gold">{step.num}</span>
						<h3 className="mt-3 font-semibold text-ink">{step.title}</h3>
						<p className="mt-3 text-sm leading-relaxed text-mute">{step.text}</p>
					</div>
				))}
			</div>
			<div className="mt-6 grid gap-6 lg:grid-cols-2">
				{[
					{ title: integrate.requestTitle, code: requestSnippet(integrate.orderLabel) },
					{ title: integrate.webhookTitle, code: webhookSnippet },
				].map((block) => (
					<div
						key={block.title}
						className="min-w-0 overflow-hidden rounded-[18px] border border-navy-800 shadow-[0_10px_30px_-18px_rgba(0,30,80,0.35)]"
						style={{ background: "#001631" }}
					>
						<p className="border-b border-white/10 px-5 py-2.5 text-[11px] font-bold uppercase tracking-wider text-[#8FA6C9]">
							{block.title}
						</p>
						<pre className="overflow-x-auto px-5 py-4 font-mono text-xs leading-relaxed text-[#E6ECF7]">
							<code>{block.code}</code>
						</pre>
					</div>
				))}
			</div>
			<p className="mt-6 text-center text-xs text-mute">{integrate.note}</p>
			<p className="mt-3 text-center text-sm">
				<a href={requestHref(dict)} className={textLinkCls}>
					{integrate.cta}
				</a>
			</p>
			<p className="mt-3 text-center text-sm">
				<Link href={`/${locale}/merchants`} className={textLinkCls}>
					{integrate.casesLink}
				</Link>
			</p>
		</section>
	);
}

function Audiences({ dict }: { dict: Dictionary }) {
	return (
		<section id="audiences" className="relative z-10 mx-auto max-w-6xl scroll-mt-24 px-6 py-20">
			<SectionHeading title={dict.audiences.title} subtitle={dict.audiences.subtitle} />
			<div className="mt-12 grid gap-6 md:grid-cols-3">
				{dict.audiences.items.map((item) => (
					<div key={item.title} className={`${cardCls} transition hover:border-gold`}>
						<h3 className="font-semibold text-ink">{item.title}</h3>
						<p className="mt-3 text-sm leading-relaxed text-mute">{item.text}</p>
					</div>
				))}
			</div>
		</section>
	);
}

function PricingTeaser({ dict, locale }: { dict: Dictionary; locale: Locale }) {
	return (
		<section className="relative z-10 mx-auto max-w-6xl px-6 py-10">
			<div className="flex flex-col items-start gap-6 rounded-[18px] border border-gold/40 bg-gold-soft/40 p-8 md:flex-row md:items-center md:justify-between">
				<div className="max-w-2xl">
					<h2 className="font-serif text-2xl font-semibold tracking-tight text-navy">{dict.pricingTeaser.title}</h2>
					<p className="mt-3 leading-relaxed text-mute">{dict.pricingTeaser.text}</p>
				</div>
				<Link href={`/${locale}/pricing`} className={`shrink-0 ${ghostButtonCls}`}>
					{dict.pricingTeaser.link} →
				</Link>
			</div>
		</section>
	);
}

function Trust({ dict }: { dict: Dictionary }) {
	return (
		<section id="trust" className="relative z-10 mx-auto max-w-6xl scroll-mt-24 px-6 py-20">
			<SectionHeading title={dict.trust.title} subtitle={dict.trust.subtitle} />
			<div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
				{dict.trust.items.map((item) => (
					<div key={item.title} className="rounded-[18px] border border-line bg-soft p-6">
						<h3 className="font-semibold text-ink">{item.title}</h3>
						<p className="mt-3 text-sm leading-relaxed text-mute">{item.text}</p>
					</div>
				))}
			</div>
		</section>
	);
}

function Status({ dict }: { dict: Dictionary }) {
	const { status } = dict;
	const columns = [
		{ ...status.live, dot: "bg-green", border: "border-green/30" },
		{ ...status.prep, dot: "bg-gold", border: "border-gold/40" },
		{ ...status.limits, dot: "bg-mute", border: "border-line" },
	];
	return (
		<section id="status" className="relative z-10 mx-auto max-w-6xl scroll-mt-24 px-6 py-20">
			<SectionHeading title={status.title} subtitle={status.subtitle} />
			<div className="mt-12 grid gap-6 lg:grid-cols-3">
				{columns.map((col) => (
					<div
						key={col.title}
						className={`rounded-[18px] border bg-white p-6 shadow-[0_10px_30px_-18px_rgba(0,30,80,0.22)] ${col.border}`}
					>
						<h3 className="flex items-center gap-2 font-semibold text-ink">
							<span aria-hidden className={`h-2.5 w-2.5 rounded-full ${col.dot}`} />
							{col.title}
						</h3>
						<ul className="mt-4 space-y-3 text-sm leading-relaxed text-mute">
							{col.items.map((item) => (
								<li key={item} className="flex gap-2.5">
									<span aria-hidden className={`mt-2 h-1.5 w-1.5 shrink-0 rounded-full ${col.dot}`} />
									<span>{item}</span>
								</li>
							))}
						</ul>
					</div>
				))}
			</div>
		</section>
	);
}
