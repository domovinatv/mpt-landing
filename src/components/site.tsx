import type { Metadata } from "next";
import Link from "next/link";
import type { Locale } from "@/i18n/config";
import { getDictionary, requestHref, type Dictionary } from "@/i18n/dictionaries";

/** airKUNA signature dark band: diagonal navy gradient with a gold radial glow */
export const navyBand = (glow: string) =>
	`radial-gradient(${glow}, rgba(227,175,53,.16), transparent 60%), linear-gradient(160deg, #001631, #002F6C 55%, #002250)`;

export const cardCls =
	"rounded-[18px] border border-line bg-white p-6 shadow-[0_10px_30px_-18px_rgba(0,30,80,0.22)]";

export const goldButtonCls =
	"inline-block rounded-full bg-gradient-to-br from-gold-light to-gold px-6 py-3 text-sm font-semibold text-[#3a2900] shadow-[0_8px_22px_-10px_rgba(200,145,42,0.7)] transition hover:-translate-y-0.5";

export const ghostButtonCls =
	"inline-block rounded-full border border-line bg-white px-6 py-3 text-sm font-semibold text-navy transition hover:border-gold";

export const textLinkCls =
	"font-medium text-navy underline decoration-gold/50 underline-offset-4 transition hover:text-navy-700";

export type PageKey = keyof Dictionary["pages"];

/** site-relative path of each page, without the locale prefix */
export const pagePaths: Record<PageKey, string> = {
	home: "",
	merchants: "/merchants",
	flow: "/flow",
	pricing: "/pricing",
	why: "/why",
};

/** "/pricing" → "/hr/pricing", "/#how" → "/hr#how"; external links and mailto pass through */
export const localHref = (locale: Locale, href: string) =>
	href.startsWith("/") ? `/${locale}${href.replace(/^\/(?=#|$)/, "")}` : href;

const isExternal = (href: string) => href.startsWith("http");
const externalProps = (href: string) =>
	isExternal(href) ? { target: "_blank", rel: "noopener noreferrer" } : {};

export function pageMetadata(locale: Locale, page: PageKey): Metadata {
	const dict = getDictionary(locale);
	const { title, description } = dict.pages[page];
	const path = pagePaths[page];
	return {
		metadataBase: new URL("https://mpt.hr"),
		title,
		description,
		alternates: {
			canonical: `/${locale}${path}`,
			languages: { hr: `/hr${path}`, en: `/en${path}`, "x-default": path || "/" },
		},
		openGraph: {
			title,
			description,
			url: `/${locale}${path}`,
			siteName: "Mint Pay Transfer",
			locale: locale === "hr" ? "hr_HR" : "en_US",
			type: "website",
			images: [{ url: "/og.png", width: 1200, height: 630, alt: "MPT — Mint Pay Transfer" }],
		},
		twitter: { card: "summary_large_image", images: ["/og.png"] },
	};
}

export function PageShell({
	locale,
	page,
	children,
}: {
	locale: Locale;
	page: PageKey;
	children: React.ReactNode;
}) {
	const dict = getDictionary(locale);
	return (
		<main className="min-h-screen bg-paper text-ink selection:bg-gold-soft">
			<BackgroundGlow />
			<Nav dict={dict} locale={locale} page={page} />
			{children}
			<Footer dict={dict} locale={locale} />
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

function Nav({ dict, locale, page }: { dict: Dictionary; locale: Locale; page: PageKey }) {
	const links: { key: Exclude<keyof Dictionary["nav"], "cta" | "menu">; href: string; page?: PageKey }[] = [
		{ key: "how", href: "/#how" },
		{ key: "merchants", href: "/merchants", page: "merchants" },
		{ key: "flow", href: "/flow", page: "flow" },
		{ key: "pricing", href: "/pricing", page: "pricing" },
		{ key: "why", href: "/why", page: "why" },
		{ key: "status", href: "/#status" },
	];
	return (
		<header className="relative z-30 mx-auto flex max-w-6xl items-center justify-between gap-4 px-6 py-6">
			<Link href={`/${locale}`} className="flex shrink-0 items-center gap-2.5">
				<Logo />
				<span className="font-serif text-lg font-semibold tracking-tight text-navy">
					MPT
					<span className="ml-2 hidden font-sans text-sm font-normal text-mute xl:inline">
						Mint Pay Transfer
					</span>
				</span>
			</Link>
			<nav className="flex items-center gap-5 text-sm lg:gap-6">
				{links.map((link) => (
					<Link
						key={link.key}
						href={localHref(locale, link.href)}
						aria-current={link.page === page ? "page" : undefined}
						className={`hidden font-medium transition hover:text-navy lg:inline ${
							link.page === page ? "text-navy" : "text-mute"
						}`}
					>
						{dict.nav[link.key]}
					</Link>
				))}
				<a
					href={requestHref(dict)}
					className="hidden rounded-full bg-navy px-4 py-2 text-xs font-semibold text-white transition hover:bg-navy-700 sm:inline-block"
				>
					{dict.nav.cta}
				</a>
				<Link
					href={`/${dict.langSwitch.target}${pagePaths[page]}`}
					aria-label={dict.langSwitch.ariaLabel}
					className="rounded-full border border-line bg-white px-3 py-1 text-xs font-medium text-navy transition hover:border-gold"
				>
					{dict.langSwitch.label}
				</Link>
				{/* below lg the inline links are hidden — a no-JS <details> menu carries them */}
				<details className="group relative lg:hidden">
					<summary
						aria-label={dict.nav.menu}
						className="flex h-8 w-8 cursor-pointer list-none items-center justify-center rounded-full border border-line bg-white text-navy transition hover:border-gold [&::-webkit-details-marker]:hidden"
					>
						<svg width="14" height="14" viewBox="0 0 14 14" aria-hidden className="group-open:hidden">
							<path d="M1 3h12M1 7h12M1 11h12" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
						</svg>
						<svg width="14" height="14" viewBox="0 0 14 14" aria-hidden className="hidden group-open:block">
							<path d="M2 2l10 10M12 2 2 12" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
						</svg>
					</summary>
					<div className="absolute right-0 top-11 z-20 w-60 rounded-[18px] border border-line bg-white p-2 shadow-[0_24px_60px_-28px_rgba(0,30,80,0.45)]">
						{links.map((link) => (
							<Link
								key={link.key}
								href={localHref(locale, link.href)}
								aria-current={link.page === page ? "page" : undefined}
								className={`block rounded-xl px-4 py-2.5 font-medium transition hover:bg-soft ${
									link.page === page ? "text-navy" : "text-mute"
								}`}
							>
								{dict.nav[link.key]}
							</Link>
						))}
						<a
							href={requestHref(dict)}
							className="mt-1 block rounded-xl bg-navy px-4 py-2.5 text-center font-semibold text-white transition hover:bg-navy-700"
						>
							{dict.nav.cta}
						</a>
					</div>
				</details>
			</nav>
		</header>
	);
}

export function Logo() {
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

export function SectionHeading({
	title,
	subtitle,
	eyebrow,
	as: Tag = "h2",
}: {
	title: string;
	subtitle: string;
	eyebrow?: string;
	as?: "h1" | "h2";
}) {
	return (
		<div className="mx-auto max-w-3xl text-center">
			{eyebrow && (
				<p className="mb-4 text-xs font-bold uppercase tracking-[0.18em] text-gold">{eyebrow}</p>
			)}
			<Tag className="font-serif text-3xl font-semibold tracking-tight text-navy sm:text-4xl">{title}</Tag>
			<p className="mt-4 text-lg leading-relaxed text-mute">{subtitle}</p>
		</div>
	);
}

/** closing navy CTA band, shared by every page */
export function Cta({ dict }: { dict: Dictionary }) {
	return (
		<section id="contact" className="relative z-10 mx-auto max-w-3xl scroll-mt-24 px-6 py-24 text-center">
			<div
				className="rounded-[26px] border border-navy-800 px-8 py-14 shadow-[0_24px_60px_-28px_rgba(0,30,80,0.45)]"
				style={{ background: navyBand("520px 320px at 78% 8%") }}
			>
				<h2 className="font-serif text-3xl font-semibold tracking-tight text-white">{dict.cta.title}</h2>
				<p className="mx-auto mt-4 max-w-xl text-lg text-[#C9D6EC]">{dict.cta.subtitle}</p>
				<a href={requestHref(dict)} className={`mt-8 px-7 ${goldButtonCls}`}>
					{dict.request.label}
				</a>
				{/* mailto does nothing without a mail client, so the address is spelled out */}
				<p className="mt-4 text-sm text-[#C9D6EC]">
					{dict.cta.emailLead}{" "}
					<a
						href={`mailto:${dict.request.email}`}
						className="font-semibold text-white underline decoration-[#3f5a86] underline-offset-4"
					>
						{dict.request.email}
					</a>
				</p>
				<p className="mt-5 text-sm text-[#8FA6C9]">
					{[dict.cta.community, dict.cta.github].map((link, i) => (
						<span key={link.href}>
							{i > 0 && " · "}
							<a
								href={link.href}
								{...externalProps(link.href)}
								className="underline decoration-[#3f5a86] underline-offset-4 transition hover:text-white"
							>
								{link.label}
							</a>
						</span>
					))}
				</p>
			</div>
		</section>
	);
}

function Footer({ dict, locale }: { dict: Dictionary; locale: Locale }) {
	return (
		<footer className="relative z-10 border-t border-line">
			<div className="mx-auto max-w-6xl px-6 pb-10 pt-14 text-sm text-mute">
				<div className="flex flex-wrap items-start justify-between gap-10">
					<Link href={`/${locale}`} className="flex items-center gap-2.5">
						<Logo />
						<span className="font-serif text-lg font-semibold tracking-tight text-navy">
							Mint Pay Transfer
						</span>
					</Link>
					<div className="flex flex-wrap gap-10">
						{dict.footer.columns.map((col) => (
							<div key={col.title} className="min-w-32">
								<p className="font-semibold text-navy">{col.title}</p>
								<ul className="mt-2 space-y-1.5">
									{col.links.map((link) => (
										<li key={link.href}>
											<a
												href={localHref(locale, link.href)}
												{...externalProps(link.href)}
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
						<span className="font-semibold text-navy">{dict.footer.imprintLead}</span> {dict.footer.imprint}
					</p>
					<p>
						© {new Date().getFullYear()} {dict.footer.copyright}
					</p>
				</div>
			</div>
		</footer>
	);
}
