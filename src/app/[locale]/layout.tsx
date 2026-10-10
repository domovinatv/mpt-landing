import { notFound } from "next/navigation";
import { Fraunces, Inter } from "next/font/google";
import { locales, isLocale, type Locale } from "@/i18n/config";
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
