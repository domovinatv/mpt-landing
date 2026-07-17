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
			<Flow dict={dict} />
			<Simulations dict={dict} locale={locale} />
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
			<nav className="flex items-center gap-6 text-sm">
				<a href="#flow" className="hidden font-medium text-mute transition hover:text-navy sm:inline">
					{dict.nav.flow}
				</a>
				<a href="#sim" className="hidden font-medium text-mute transition hover:text-navy sm:inline">
					{dict.nav.sim}
				</a>
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
						href="#flow"
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
			<div className="mt-6 rounded-[18px] border border-line bg-soft p-6">
				<h3 className="font-semibold text-ink">{dict.flow.altTitle}</h3>
				<p className="mt-3 text-sm leading-relaxed text-mute">{dict.flow.altText}</p>
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
					href={`mailto:${dict.cta.button}`}
					className="mt-8 inline-block rounded-full bg-gradient-to-br from-gold-light to-gold px-7 py-3 text-sm font-semibold text-[#3a2900] shadow-[0_8px_22px_-10px_rgba(200,145,42,0.7)] transition hover:-translate-y-0.5"
				>
					{dict.cta.button}
				</a>
			</div>
		</section>
	);
}

function Footer({ dict }: { dict: Dictionary }) {
	return (
		<footer className="relative z-10 border-t border-line">
			<div className="mx-auto flex max-w-6xl flex-col items-center gap-3 px-6 py-10 text-center text-sm text-mute">
				<div className="flex items-center gap-2">
					<Logo />
					<span className="font-serif font-semibold text-navy">Mint Pay Transfer</span>
				</div>
				<p>{dict.footer.tagline}</p>
				<p className="text-xs text-mute/80">
					© {new Date().getFullYear()} mpt.hr · {dict.footer.disclaimer}
				</p>
			</div>
		</footer>
	);
}
