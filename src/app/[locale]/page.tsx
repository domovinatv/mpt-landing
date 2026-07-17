import Link from "next/link";
import { notFound } from "next/navigation";
import { isLocale } from "@/i18n/config";
import { getDictionary, type Dictionary } from "@/i18n/dictionaries";

export default async function LandingPage({
	params,
}: {
	params: Promise<{ locale: string }>;
}) {
	const { locale } = await params;
	if (!isLocale(locale)) notFound();
	const dict = getDictionary(locale);

	return (
		<main className="min-h-screen bg-[#060d0a] text-zinc-100 selection:bg-emerald-400/30">
			<BackgroundGlow />
			<Nav dict={dict} />
			<Hero dict={dict} />
			<Problem dict={dict} />
			<How dict={dict} />
			<Compare dict={dict} />
			<Cta dict={dict} />
			<Footer dict={dict} />
		</main>
	);
}

function BackgroundGlow() {
	return (
		<div aria-hidden className="pointer-events-none fixed inset-0 overflow-hidden">
			<div className="absolute -top-40 left-1/2 h-[34rem] w-[60rem] -translate-x-1/2 rounded-full bg-emerald-500/10 blur-3xl" />
			<div className="absolute bottom-0 right-0 h-96 w-96 rounded-full bg-teal-500/5 blur-3xl" />
		</div>
	);
}

function Nav({ dict }: { dict: Dictionary }) {
	return (
		<header className="relative z-10 mx-auto flex max-w-6xl items-center justify-between px-6 py-6">
			<a href="#" className="flex items-center gap-2.5">
				<Logo />
				<span className="text-lg font-semibold tracking-tight">
					MPT
					<span className="ml-2 hidden text-sm font-normal text-zinc-400 sm:inline">
						Mint Pay Transfer
					</span>
				</span>
			</a>
			<nav className="flex items-center gap-6 text-sm">
				<a href="#how" className="hidden text-zinc-300 transition hover:text-white sm:inline">
					{dict.nav.how}
				</a>
				<a href="#compare" className="hidden text-zinc-300 transition hover:text-white sm:inline">
					{dict.nav.compare}
				</a>
				<a href="#contact" className="hidden text-zinc-300 transition hover:text-white sm:inline">
					{dict.nav.contact}
				</a>
				<Link
					href={dict.langSwitch.href}
					aria-label={dict.langSwitch.ariaLabel}
					className="rounded-full border border-zinc-700 px-3 py-1 text-xs font-medium text-zinc-300 transition hover:border-emerald-400/60 hover:text-white"
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
			<rect width="32" height="32" rx="9" className="fill-emerald-400/15" />
			<path
				d="M8 21V11l5 6 5-6v10"
				stroke="#34d399"
				strokeWidth="2.4"
				strokeLinecap="round"
				strokeLinejoin="round"
			/>
			<path d="M22 16h4m0 0-2-2m2 2-2 2" stroke="#5eead4" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
		</svg>
	);
}

function Hero({ dict }: { dict: Dictionary }) {
	return (
		<section className="relative z-10 mx-auto grid max-w-6xl items-center gap-14 px-6 pb-24 pt-16 lg:grid-cols-2 lg:pt-24">
			<div>
				<p className="mb-5 inline-block rounded-full border border-emerald-400/20 bg-emerald-400/5 px-4 py-1.5 text-xs font-medium tracking-wide text-emerald-300">
					{dict.hero.eyebrow}
				</p>
				<h1 className="text-4xl font-semibold leading-tight tracking-tight sm:text-5xl lg:text-6xl">
					{dict.hero.title}{" "}
					<span className="bg-gradient-to-r from-emerald-300 to-teal-200 bg-clip-text text-transparent">
						{dict.hero.titleAccent}
					</span>
				</h1>
				<p className="mt-6 max-w-xl text-lg leading-relaxed text-zinc-400">{dict.hero.subtitle}</p>
				<div className="mt-9 flex flex-wrap gap-4">
					<a
						href="#how"
						className="rounded-full bg-emerald-400 px-6 py-3 text-sm font-semibold text-emerald-950 transition hover:bg-emerald-300"
					>
						{dict.hero.ctaPrimary}
					</a>
					<a
						href="#contact"
						className="rounded-full border border-zinc-700 px-6 py-3 text-sm font-semibold text-zinc-200 transition hover:border-zinc-500"
					>
						{dict.hero.ctaSecondary}
					</a>
				</div>
			</div>
			<div className="relative">
				<div className="rounded-3xl border border-zinc-800 bg-zinc-900/60 p-8 shadow-2xl shadow-emerald-950/40 backdrop-blur">
					<p className="text-sm text-zinc-400">{dict.hero.cardLabel}</p>
					<p className="mt-2 font-mono text-6xl font-bold tracking-tight text-emerald-300">
						{dict.hero.cardTotal}
					</p>
					<div className="mt-8 space-y-4">
						{dict.hero.cardRows.map((row) => (
							<div
								key={row.label}
								className="flex items-center justify-between border-b border-zinc-800 pb-3 text-sm last:border-0"
							>
								<span className="text-zinc-400">{row.label}</span>
								<span className="font-mono text-zinc-100">{row.value}</span>
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
		<div className="mx-auto max-w-2xl text-center">
			<h2 className="text-3xl font-semibold tracking-tight sm:text-4xl">{title}</h2>
			<p className="mt-4 text-lg leading-relaxed text-zinc-400">{subtitle}</p>
		</div>
	);
}

function Problem({ dict }: { dict: Dictionary }) {
	return (
		<section className="relative z-10 mx-auto max-w-6xl px-6 py-20">
			<SectionHeading title={dict.problem.title} subtitle={dict.problem.subtitle} />
			<div className="mt-12 grid gap-6 sm:grid-cols-3">
				{dict.problem.items.map((item) => (
					<div key={item.title} className="rounded-2xl border border-zinc-800 bg-zinc-900/40 p-6">
						<h3 className="font-semibold text-zinc-100">{item.title}</h3>
						<p className="mt-3 text-sm leading-relaxed text-zinc-400">{item.text}</p>
					</div>
				))}
			</div>
		</section>
	);
}

function How({ dict }: { dict: Dictionary }) {
	return (
		<section id="how" className="relative z-10 mx-auto max-w-6xl scroll-mt-24 px-6 py-20">
			<SectionHeading title={dict.how.title} subtitle={dict.how.subtitle} />
			<div className="mt-12 grid gap-6 sm:grid-cols-3">
				{dict.how.items.map((item, i) => (
					<div
						key={item.title}
						className="rounded-2xl border border-emerald-400/15 bg-emerald-400/[0.03] p-6"
					>
						<span className="font-mono text-sm text-emerald-400">0{i + 1}</span>
						<h3 className="mt-3 font-semibold text-zinc-100">{item.title}</h3>
						<p className="mt-3 text-sm leading-relaxed text-zinc-400">{item.text}</p>
					</div>
				))}
			</div>
			<p className="mt-10 text-center text-sm text-zinc-500">{dict.how.note}</p>
		</section>
	);
}

function Compare({ dict }: { dict: Dictionary }) {
	return (
		<section id="compare" className="relative z-10 mx-auto max-w-4xl scroll-mt-24 px-6 py-20">
			<SectionHeading title={dict.compare.title} subtitle={dict.compare.subtitle} />
			<div className="mt-12 overflow-x-auto">
				<table className="w-full min-w-[28rem] border-separate border-spacing-0 text-sm">
					<thead>
						<tr className="text-left text-zinc-400">
							<th className="pb-4 font-normal" />
							<th className="pb-4 font-medium">{dict.compare.colTraditional}</th>
							<th className="pb-4 font-semibold text-emerald-300">{dict.compare.colMpt}</th>
						</tr>
					</thead>
					<tbody>
						{dict.compare.rows.map((row) => (
							<tr key={row.label}>
								<td className="border-t border-zinc-800 py-4 text-zinc-400">{row.label}</td>
								<td className="border-t border-zinc-800 py-4 font-mono">{row.traditional}</td>
								<td className="border-t border-zinc-800 py-4 font-mono text-emerald-300">{row.mpt}</td>
							</tr>
						))}
						<tr>
							<td className="border-t-2 border-zinc-700 py-4 font-semibold text-zinc-100">
								{dict.compare.totalLabel}
							</td>
							<td className="border-t-2 border-zinc-700 py-4 font-mono font-semibold">
								{dict.compare.totalTraditional}
							</td>
							<td className="border-t-2 border-zinc-700 py-4 font-mono text-lg font-bold text-emerald-300">
								{dict.compare.totalMpt}
							</td>
						</tr>
					</tbody>
				</table>
			</div>
		</section>
	);
}

function Cta({ dict }: { dict: Dictionary }) {
	return (
		<section id="contact" className="relative z-10 mx-auto max-w-3xl scroll-mt-24 px-6 py-24 text-center">
			<div className="rounded-3xl border border-emerald-400/20 bg-gradient-to-b from-emerald-400/10 to-transparent px-8 py-14">
				<h2 className="text-3xl font-semibold tracking-tight">{dict.cta.title}</h2>
				<p className="mx-auto mt-4 max-w-xl text-lg text-zinc-400">{dict.cta.subtitle}</p>
				<a
					href={`mailto:${dict.cta.button}`}
					className="mt-8 inline-block rounded-full bg-emerald-400 px-7 py-3 text-sm font-semibold text-emerald-950 transition hover:bg-emerald-300"
				>
					{dict.cta.button}
				</a>
			</div>
		</section>
	);
}

function Footer({ dict }: { dict: Dictionary }) {
	return (
		<footer className="relative z-10 border-t border-zinc-800/80">
			<div className="mx-auto flex max-w-6xl flex-col items-center gap-3 px-6 py-10 text-center text-sm text-zinc-500">
				<div className="flex items-center gap-2">
					<Logo />
					<span className="font-semibold text-zinc-300">Mint Pay Transfer</span>
				</div>
				<p>{dict.footer.tagline}</p>
				<p className="text-xs text-zinc-600">
					© {new Date().getFullYear()} mpt.hr · {dict.footer.disclaimer}
				</p>
			</div>
		</footer>
	);
}
