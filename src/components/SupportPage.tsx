import Link from "next/link";
import type { Locale } from "@/i18n/config";
import { getDictionary } from "@/i18n/dictionaries";
import SupportWidget from "@/components/SupportWidget";
import { Cta, PageShell, SectionHeading, cardCls, textLinkCls } from "@/components/site";

/** /support (pravi novac, tenant italk) i /support/sandbox (Monerium sandbox, Chiado) — isti kod, drugi rail. */
export default function SupportPage({ locale, railKey }: { locale: Locale; railKey: "prod" | "sandbox" }) {
	const dict = getDictionary(locale);
	const { support } = dict;
	const sandbox = railKey === "sandbox";

	return (
		<PageShell locale={locale} page={sandbox ? "supportSandbox" : "support"}>
			<section className="relative z-10 mx-auto max-w-6xl px-6 pb-10 pt-12 lg:pt-16">
				<SectionHeading
					as="h1"
					eyebrow={sandbox ? support.sandboxEyebrow : support.eyebrow}
					title={sandbox ? support.sandboxTitle : support.title}
					subtitle={sandbox ? support.sandboxSubtitle : support.subtitle}
				/>
				<p className="mt-5 text-center text-sm">
					<Link href={`/${locale}${sandbox ? "/support" : "/support/sandbox"}`} className={textLinkCls}>
						{sandbox ? support.toProd : support.toSandbox}
					</Link>
				</p>
				{sandbox && (
					<p className="mx-auto mt-6 max-w-fit rounded-full border border-gold bg-gold-soft px-4 py-1.5 text-xs font-bold uppercase tracking-[0.18em] text-navy">
						Sandbox · Chiado · test EURe
					</p>
				)}
			</section>

			<section className="relative z-10 mx-auto max-w-6xl px-6 pb-12">
				<SupportWidget railKey={railKey} copy={support.widget} locale={locale} />
			</section>

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
				<section className="relative z-10 mx-auto grid max-w-6xl gap-6 px-6 py-12 lg:grid-cols-2">
					{[
						{ title: support.useTitle, items: support.use },
						{ title: support.honestTitle, items: support.honest },
					].map((box) => (
						<div key={box.title} className={cardCls}>
							<h2 className="font-serif text-2xl font-semibold tracking-tight text-navy">{box.title}</h2>
							<ul className="mt-4 space-y-2.5 text-sm leading-relaxed text-mute">
								{box.items.map((item) => (
									<li key={item} className="flex gap-2.5">
										<span aria-hidden className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-gold" />
										<span>{item}</span>
									</li>
								))}
							</ul>
						</div>
					))}
				</section>
			)}

			<Cta dict={dict} />
		</PageShell>
	);
}
