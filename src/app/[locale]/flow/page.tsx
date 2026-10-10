import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { isLocale } from "@/i18n/config";
import { getDictionary } from "@/i18n/dictionaries";
import SimulationPlayer from "@/components/SimulationPlayer";
import { cardCls, Cta, pageMetadata, PageShell, SectionHeading, textLinkCls } from "@/components/site";

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
	const { locale } = await params;
	if (!isLocale(locale)) notFound();
	return pageMetadata(locale, "flow");
}

export default async function FlowPage({ params }: { params: Promise<{ locale: string }> }) {
	const { locale } = await params;
	if (!isLocale(locale)) notFound();
	const dict = getDictionary(locale);
	const { flow, sim } = dict;

	return (
		<PageShell locale={locale} page="flow">
			<section className="relative z-10 mx-auto max-w-6xl px-6 pb-12 pt-12 lg:pt-16">
				<SectionHeading as="h1" title={flow.title} subtitle={flow.subtitle} />
				<div className="mt-12 grid gap-6 sm:grid-cols-2">
					{flow.steps.map((step) => (
						<div key={step.num} className={`${cardCls} transition hover:border-gold`}>
							<span className="font-serif text-sm font-semibold text-gold">{step.num}</span>
							<h2 className="mt-3 font-semibold text-ink">{step.title}</h2>
							<p className="mt-3 text-sm leading-relaxed text-mute">{step.text}</p>
						</div>
					))}
				</div>
				<div className="mt-6 grid gap-6 sm:grid-cols-2">
					{flow.notes.map((note) => (
						<div key={note.title} className="rounded-[18px] border border-line bg-soft p-6">
							<h2 className="font-semibold text-ink">{note.title}</h2>
							<p className="mt-3 text-sm leading-relaxed text-mute">{note.text}</p>
						</div>
					))}
				</div>
				<p className="mt-8 text-center text-sm text-mute">
					{flow.liveNote}{" "}
					{flow.liveLinks.map((link, i) => (
						<span key={link.href}>
							{i > 0 && " · "}
							<a href={link.href} target="_blank" rel="noopener noreferrer" className={textLinkCls}>
								{link.label}
							</a>
						</span>
					))}
				</p>
			</section>

			<section
				id="sim"
				className="relative z-10 mx-auto w-full max-w-[120rem] scroll-mt-24 px-4 py-20 sm:px-6 lg:px-10"
			>
				<SectionHeading title={sim.title} subtitle={sim.subtitle} />
				<div className="mt-12">
					<SimulationPlayer locale={locale} labels={sim.labels} />
				</div>
				<p className="mt-6 text-center text-sm text-mute">{sim.testsNote}</p>
			</section>

			<Cta dict={dict} />
		</PageShell>
	);
}
