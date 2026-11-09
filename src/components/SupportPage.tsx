import Link from "next/link";
import type { Locale } from "@/i18n/config";
import { getDictionary } from "@/i18n/dictionaries";
import { I18nProvider } from "@/lib/i18n";
import { CAMPAIGN_PROD, CAMPAIGN_SANDBOX } from "@/lib/beta-projects";
import { CampaignSection } from "@/components/beta/beta-page";
import { Cta, PageShell, cardCls, textLinkCls } from "@/components/site";

/**
 * /support (pravi novac, tenant italk) i /support/sandbox (Monerium sandbox, Chiado).
 * Kod koji miče novac je kopija energy.domovina.ai /beta/ (components/beta, lib/*);
 * ovdje je samo okvir stranice i MPT copy (dictionaries.support).
 */
export default function SupportPage({ locale, railKey }: { locale: Locale; railKey: "prod" | "sandbox" }) {
	const dict = getDictionary(locale);
	const { support } = dict;
	const sandbox = railKey === "sandbox";
	const project = sandbox ? CAMPAIGN_SANDBOX : CAMPAIGN_PROD;

	const intro = (
		<>
			<p className="text-xs font-bold uppercase tracking-[0.18em] text-gold">
				{sandbox ? support.sandboxEyebrow : support.eyebrow}
			</p>
			<h1 className="mt-3 font-serif text-3xl font-semibold tracking-tight text-navy sm:text-4xl">
				{sandbox ? support.sandboxTitle : support.title}
			</h1>
			<p className="mt-4 leading-relaxed text-mute">{sandbox ? support.sandboxSubtitle : support.subtitle}</p>
			{!sandbox && (
				<>
					<h2 className="mt-6 text-xs font-bold uppercase tracking-[0.18em] text-navy">{support.useTitle}</h2>
					<ul className="mt-2 space-y-1.5 text-sm leading-relaxed text-mute">
						{support.use.map((item) => (
							<li key={item} className="flex gap-2.5">
								<span aria-hidden className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-gold" />
								<span>{item}</span>
							</li>
						))}
					</ul>
				</>
			)}
			<p className="mt-5 text-sm">
				<Link href={`/${locale}${sandbox ? "/support" : "/support/sandbox"}`} className={textLinkCls}>
					{sandbox ? support.toProd : support.toSandbox}
				</Link>
			</p>
		</>
	);

	return (
		<PageShell locale={locale} page={sandbox ? "supportSandbox" : "support"}>
			<I18nProvider locale={locale}>
				<div className="relative z-10 mx-auto max-w-[110rem] px-4 pb-8 pt-8 sm:px-6 lg:pt-12">
					{sandbox && (
						<p className="mb-4 w-fit rounded-full border border-gold bg-gold-soft px-4 py-1.5 text-xs font-bold uppercase tracking-[0.18em] text-navy">
							Sandbox · Chiado · test EURe
						</p>
					)}
					<CampaignSection project={project} intro={intro} />
				</div>
			</I18nProvider>

			<section className="relative z-10 mx-auto max-w-6xl px-6 py-12">
				<h2 className="text-center font-serif text-3xl font-semibold tracking-tight text-navy">{support.howTitle}</h2>
				<ol className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
					{support.how.map((step, i) => (
						<li key={step.title} className={cardCls}>
							<span className="flex h-8 w-8 items-center justify-center rounded-full bg-navy text-sm font-semibold text-white">
								{i + 1}
							</span>
							<h3 className="mt-4 font-semibold text-ink">{step.title}</h3>
							<p className="mt-2 break-words text-sm leading-relaxed text-mute">{step.body}</p>
						</li>
					))}
				</ol>
			</section>

			{!sandbox && (
				<section className="relative z-10 mx-auto max-w-3xl px-6 py-8">
					<div className={cardCls}>
						<h2 className="font-serif text-2xl font-semibold tracking-tight text-navy">{support.honestTitle}</h2>
						<ul className="mt-4 space-y-2.5 text-sm leading-relaxed text-mute">
							{support.honest.map((item) => (
								<li key={item} className="flex gap-2.5">
									<span aria-hidden className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-gold" />
									<span>{item}</span>
								</li>
							))}
						</ul>
					</div>
				</section>
			)}

			<Cta dict={dict} />
		</PageShell>
	);
}
