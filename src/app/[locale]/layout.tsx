import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { Fraunces, Inter } from "next/font/google";
import { locales, isLocale, type Locale } from "@/i18n/config";
import { getDictionary } from "@/i18n/dictionaries";
import "../globals.css";

const inter = Inter({
	variable: "--font-inter",
	subsets: ["latin", "latin-ext"],
});

const fraunces = Fraunces({
	variable: "--font-fraunces",
	subsets: ["latin", "latin-ext"],
	axes: ["opsz"],
});

export function generateStaticParams() {
	return locales.map((locale) => ({ locale }));
}

export async function generateMetadata({
	params,
}: {
	params: Promise<{ locale: string }>;
}): Promise<Metadata> {
	const { locale } = await params;
	if (!isLocale(locale)) notFound();
	const dict = getDictionary(locale);
	return {
		metadataBase: new URL("https://mpt.hr"),
		title: dict.meta.title,
		description: dict.meta.description,
		alternates: {
			canonical: `/${locale}`,
			languages: { hr: "/hr", en: "/en" },
		},
		openGraph: {
			title: dict.meta.title,
			description: dict.meta.description,
			url: `/${locale}`,
			siteName: "Mint Pay Transfer",
			locale: locale === "hr" ? "hr_HR" : "en_US",
			type: "website",
		},
	};
}

export default async function LocaleLayout({
	children,
	params,
}: Readonly<{
	children: React.ReactNode;
	params: Promise<{ locale: string }>;
}>) {
	const { locale } = await params;
	if (!isLocale(locale)) notFound();
	return (
		<html lang={locale satisfies Locale}>
			<head>
				<link rel="icon" href="/favicon.svg" type="image/svg+xml"></link>
			</head>
			<body className={`${inter.variable} ${fraunces.variable} antialiased`}>{children}</body>
		</html>
	);
}
