import Link from "next/link";
import { notFound } from "next/navigation";
import { isLocale, type Locale } from "@/i18n/config";
import { getDictionary, type Dictionary } from "@/i18n/dictionaries";
import SimulationPlayer from "@/components/SimulationPlayer";

/** airKUNA signature dark band: diagonal navy gradient with a gold radial glow */
const navyBand = (glow: string) =>
	`radial-gradient(${glow}, rgba(227,175,53,.16), transparent 60%), linear-gradient(160deg, #001631, #002F6C 55%, #002250)`;

export default async function LandingPage({
	params,
}: {
	params: Promise<{ locale: string }>;
}) {
	const { locale } = await params;
	if (!isLocale(locale)) notFound();
	const dict = getDictionary(locale);

	return (
		<main className="min-h-screen bg-paper text-ink selection:bg-gold-soft">
			<BackgroundGlow />
			<Nav dict={dict} />
			<Hero dict={dict} />
			<How dict={dict} />
			<Flow dict={dict} />
			<Simulations dict={dict} locale={locale} />
			<Why dict={dict} />
			<Status dict={dict} />
			<Cta dict={dict} />
			<Footer dict={dict} />
		</main>
	);
}

function BackgroundGlow() {
	return (
		<div aria-hidden className="pointer-events-none fixed inset-0 overflow-hidden">
			<div className="absolute -top-40 left-1/2 h-[34rem] w-[60rem] -translate-x-1/2 rounded-full bg-gold-light/10 blur-3xl" />
			<div className="absolute bottom-0 right-0 h-96 w-96 rounded-full bg-navy/5 blur-3xl" />
		</div>
	);
}

function Nav({ dict }: { dict: Dictionary }) {
	return (
		<header className="relative z-10 mx-auto flex max-w-6xl items-center justify-between px-6 py-6">
			<a href="#" className="flex items-center gap-2.5">
				<Logo />
				<span className="font-serif text-lg font-semibold tracking-tight text-navy">
					MPT
					<span className="ml-2 hidden font-sans text-sm font-normal text-mute sm:inline">
						Mint Pay Transfer
					</span>
				</span>
			</a>
			<nav className="flex items-center gap-5 text-sm lg:gap-6">
				{(["how", "flow", "sim", "why", "status"] as const).map((key) => (
					<a
						key={key}
						href={`#${key}`}
						className="hidden font-medium text-mute transition hover:text-navy md:inline"
					>
						{dict.nav[key]}
					</a>
				))}
				<a href="#contact" className="hidden font-medium text-mute transition hover:text-navy sm:inline">
					{dict.nav.contact}
				</a>
				<Link
					href={dict.langSwitch.href}
					aria-label={dict.langSwitch.ariaLabel}
					className="rounded-full border border-line bg-white px-3 py-1 text-xs font-medium text-navy transition hover:border-gold"
				>
					{dict.langSwitch.label}
				</Link>
			</nav>
		</header>
	);
}

function Logo() {
	return (
		<svg width="30" height="30" viewBox="0 0 32 32" fill="none" aria-hidden>
			<rect width="32" height="32" rx="9" fill="#002F6C" />
			<path
				d="M8 21V11l5 6 5-6v10"
				stroke="#FFFFFF"
				strokeWidth="2.4"
				strokeLinecap="round"
				strokeLinejoin="round"
			/>
			<path d="M22 16h4m0 0-2-2m2 2-2 2" stroke="#E3AF35" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
		</svg>
	);
}

function Hero({ dict }: { dict: Dictionary }) {
	return (
		<section className="relative z-10 mx-auto grid max-w-6xl items-center gap-14 px-6 pb-24 pt-16 lg:grid-cols-2 lg:pt-24">
			<div>
				<p className="mb-5 text-xs font-bold uppercase tracking-[0.18em] text-gold">
					{dict.hero.eyebrow}
				</p>
				<h1 className="font-serif text-4xl font-semibold leading-[1.05] tracking-tight text-navy sm:text-5xl lg:text-6xl">
					{dict.hero.title}{" "}
					<span className="bg-gradient-to-r from-gold-light to-gold bg-clip-text text-transparent">
						{dict.hero.titleAccent}
					</span>
				</h1>
				<p className="mt-6 max-w-xl text-lg leading-relaxed text-mute">{dict.hero.subtitle}</p>
				<div className="mt-9 flex flex-wrap gap-4">
					<a
						href="#how"
						className="rounded-full bg-gradient-to-br from-gold-light to-gold px-6 py-3 text-sm font-semibold text-[#3a2900] shadow-[0_8px_22px_-10px_rgba(200,145,42,0.7)] transition hover:-translate-y-0.5"
					>
						{dict.hero.ctaPrimary}
					</a>
					<a
						href="#contact"
						className="rounded-full border border-line bg-white px-6 py-3 text-sm font-semibold text-navy transition hover:border-gold"
					>
						{dict.hero.ctaSecondary}
					</a>
				</div>
			</div>
			<div className="relative">
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
								className="flex items-center justify-between border-b border-white/10 pb-3 text-sm last:border-0"
							>
								<span className="text-[#A9BBD8]">{row.label}</span>
								<span className="font-mono text-white">{row.value}</span>
							</div>
						))}
					</div>
				</div>
			</div>
		</section>
	);
}

function SectionHeading({ title, subtitle }: { title: string; subtitle: string }) {
	return (
		<div className="mx-auto max-w-3xl text-center">
			<h2 className="font-serif text-3xl font-semibold tracking-tight text-navy sm:text-4xl">
				{title}
			</h2>
			<p className="mt-4 text-lg leading-relaxed text-mute">{subtitle}</p>
		</div>
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
					<div
						key={card.title}
						className="rounded-[18px] border border-line bg-white p-6 shadow-[0_10px_30px_-18px_rgba(0,30,80,0.22)] transition hover:border-gold"
					>
						<h3 className="font-semibold text-ink">{card.title}</h3>
						<p className="mt-3 text-sm leading-relaxed text-mute">{card.text}</p>
					</div>
				))}
			</div>

			<p className="mt-8 text-center text-sm text-mute">
				<a
					href={how.codeLink.href}
					target="_blank"
					rel="noopener noreferrer"
					className="font-medium text-navy underline decoration-gold/50 underline-offset-4 transition hover:text-navy-700"
				>
					{how.codeLink.label}
				</a>
			</p>
		</section>
	);
}

function Flow({ dict }: { dict: Dictionary }) {
	return (
		<section id="flow" className="relative z-10 mx-auto max-w-6xl scroll-mt-24 px-6 py-20">
			<SectionHeading title={dict.flow.title} subtitle={dict.flow.subtitle} />
			<div className="mt-12 grid gap-6 sm:grid-cols-2">
				{dict.flow.steps.map((step) => (
					<div
						key={step.num}
						className="rounded-[18px] border border-line bg-white p-6 shadow-[0_10px_30px_-18px_rgba(0,30,80,0.22)] transition hover:border-gold"
					>
						<span className="font-serif text-sm font-semibold text-gold">{step.num}</span>
						<h3 className="mt-3 font-semibold text-ink">{step.title}</h3>
						<p className="mt-3 text-sm leading-relaxed text-mute">{step.text}</p>
					</div>
				))}
			</div>
			<div className="mt-6 grid gap-6 sm:grid-cols-2">
				{dict.flow.notes.map((note) => (
					<div key={note.title} className="rounded-[18px] border border-line bg-soft p-6">
						<h3 className="font-semibold text-ink">{note.title}</h3>
						<p className="mt-3 text-sm leading-relaxed text-mute">{note.text}</p>
					</div>
				))}
			</div>
			<p className="mt-8 text-center text-sm text-mute">
				{dict.flow.liveNote}{" "}
				{dict.flow.liveLinks.map((link, i) => (
					<span key={link.href}>
						{i > 0 && " · "}
						<a
							href={link.href}
							target="_blank"
							rel="noopener noreferrer"
							className="font-medium text-navy underline decoration-gold/50 underline-offset-4 transition hover:text-navy-700"
						>
							{link.label}
						</a>
					</span>
				))}
			</p>
		</section>
	);
}

const toneCls: Record<"win" | "leak" | "warn", string> = {
	win: "border-green/40 bg-green-soft/60 text-green",
	leak: "border-red/30 bg-red-soft/70 text-red",
	warn: "border-gold/40 bg-gold-soft/50 text-[#7a5a12]",
};

function Why({ dict }: { dict: Dictionary }) {
	return (
		<section id="why" className="relative z-10 mx-auto max-w-6xl scroll-mt-24 px-6 py-20">
			<SectionHeading title={dict.why.title} subtitle={dict.why.subtitle} />

			{/* channel fee comparison — numbers from the isplativost analysis */}
			<div className="mt-12 overflow-x-auto rounded-[18px] border border-line bg-white shadow-[0_10px_30px_-18px_rgba(0,30,80,0.22)]">
				<table className="w-full min-w-[640px] text-sm">
					<thead>
						<tr className="border-b border-line text-left text-[11px] font-bold uppercase tracking-wider text-mute">
							<th className="px-5 py-3">{dict.why.tableHead.channel}</th>
							<th className="px-5 py-3">{dict.why.tableHead.fee}</th>
							<th className="px-5 py-3">{dict.why.tableHead.at1}</th>
							<th className="px-5 py-3">{dict.why.tableHead.at2}</th>
							<th className="px-5 py-3">{dict.why.tableHead.at5}</th>
							<th className="px-5 py-3">{dict.why.tableHead.at100}</th>
						</tr>
					</thead>
					<tbody>
						{dict.why.channels.map((ch) => (
							<tr key={ch.name} className="border-b border-line last:border-0">
								<td className="px-5 py-4 font-semibold text-ink">{ch.name}</td>
								<td className="px-5 py-4 text-mute">{ch.fee}</td>
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
				{dict.why.points.map((point) => (
					<div
						key={point.title}
						className="rounded-[18px] border border-line bg-white p-6 shadow-[0_10px_30px_-18px_rgba(0,30,80,0.22)] transition hover:border-gold"
					>
						<h3 className="font-semibold text-ink">{point.title}</h3>
						<p className="mt-3 text-sm leading-relaxed text-mute">{point.text}</p>
					</div>
				))}
			</div>

			<p className="mt-8 text-center text-xs text-mute">
				{dict.why.sourceNote}{" "}
				<a
					href={dict.why.sourceLink.href}
					target="_blank"
					rel="noopener noreferrer"
					className="font-medium text-navy underline decoration-gold/50 underline-offset-4 transition hover:text-navy-700"
				>
					{dict.why.sourceLink.label}
				</a>
			</p>
		</section>
	);
}

function Simulations({ dict, locale }: { dict: Dictionary; locale: Locale }) {
	return (
		<section id="sim" className="relative z-10 mx-auto w-full max-w-[120rem] scroll-mt-24 px-4 py-20 sm:px-6 lg:px-10">
			<SectionHeading title={dict.sim.title} subtitle={dict.sim.subtitle} />
			<div className="mt-12">
				<SimulationPlayer locale={locale} labels={dict.sim.labels} />
			</div>
			<p className="mt-6 text-center text-sm text-mute">{dict.sim.testsNote}</p>
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

function Cta({ dict }: { dict: Dictionary }) {
	return (
		<section id="contact" className="relative z-10 mx-auto max-w-3xl scroll-mt-24 px-6 py-24 text-center">
			<div
				className="rounded-[26px] border border-navy-800 px-8 py-14 shadow-[0_24px_60px_-28px_rgba(0,30,80,0.45)]"
				style={{ background: navyBand("520px 320px at 78% 8%") }}
			>
				<h2 className="font-serif text-3xl font-semibold tracking-tight text-white">
					{dict.cta.title}
				</h2>
				<p className="mx-auto mt-4 max-w-xl text-lg text-[#C9D6EC]">{dict.cta.subtitle}</p>
				<a
					href={dict.cta.button.href}
					target="_blank"
					rel="noopener noreferrer"
					className="mt-8 inline-block rounded-full bg-gradient-to-br from-gold-light to-gold px-7 py-3 text-sm font-semibold text-[#3a2900] shadow-[0_8px_22px_-10px_rgba(200,145,42,0.7)] transition hover:-translate-y-0.5"
				>
					{dict.cta.button.label}
				</a>
				<p className="mt-4 text-sm text-[#8FA6C9]">
					<a href={dict.cta.secondary.href} className="underline decoration-[#3f5a86] underline-offset-4 transition hover:text-white">
						{dict.cta.secondary.label}
					</a>
				</p>
			</div>
		</section>
	);
}

function Footer({ dict }: { dict: Dictionary }) {
	const external = (href: string) => href.startsWith("http");
	return (
		<footer className="relative z-10 border-t border-line">
			<div className="mx-auto max-w-6xl px-6 pb-10 pt-14 text-sm text-mute">
				<div className="flex flex-wrap items-start justify-between gap-10">
					<a href="#" className="flex items-center gap-2.5">
						<Logo />
						<span className="font-serif text-lg font-semibold tracking-tight text-navy">
							Mint Pay Transfer
						</span>
					</a>
					<div className="flex flex-wrap gap-10">
						{dict.footer.columns.map((col) => (
							<div key={col.title} className="min-w-32">
								<p className="font-semibold text-navy">{col.title}</p>
								<ul className="mt-2 space-y-1.5">
									{col.links.map((link) => (
										<li key={link.href}>
											<a
												href={link.href}
												{...(external(link.href)
													? { target: "_blank", rel: "noopener noreferrer" }
													: {})}
												className="transition hover:text-navy"
											>
												{link.label}
											</a>
										</li>
									))}
								</ul>
							</div>
						))}
					</div>
				</div>
				<div className="mt-10 space-y-4 border-t border-line pt-6 text-xs leading-relaxed text-mute/90">
					<p>{dict.footer.note}</p>
					<p>
						<span className="font-semibold text-navy">{dict.footer.imprintLead}</span>{" "}
						{dict.footer.imprint}
						{dict.footer.imprintLinks.map((link) => (
							<span key={link.href}>
								{" · "}
								<a
									href={link.href}
									{...(external(link.href) ? { target: "_blank", rel: "noopener noreferrer" } : {})}
									className="font-medium text-navy underline decoration-gold/50 underline-offset-4 transition hover:text-navy-700"
								>
									{link.label}
								</a>
							</span>
						))}
					</p>
					<p>
						© {new Date().getFullYear()} {dict.footer.copyright}
					</p>
				</div>
			</div>
		</footer>
	);
}
