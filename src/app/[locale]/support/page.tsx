import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { isLocale } from "@/i18n/config";
import SupportPage from "@/components/SupportPage";
import { pageMetadata } from "@/components/site";

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
	const { locale } = await params;
	if (!isLocale(locale)) notFound();
	return pageMetadata(locale, "support");
}

export default async function Page({ params }: { params: Promise<{ locale: string }> }) {
	const { locale } = await params;
	if (!isLocale(locale)) notFound();
	return <SupportPage locale={locale} railKey="prod" />;
}
