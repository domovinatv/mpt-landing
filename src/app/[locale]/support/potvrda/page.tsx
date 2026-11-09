import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { isLocale } from "@/i18n/config";
import { I18nProvider } from "@/lib/i18n";
import { ReceiptPage } from "@/components/beta/receipt-page";
import { PageShell, pageMetadata } from "@/components/site";

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
	const { locale } = await params;
	if (!isLocale(locale)) notFound();
	return pageMetadata(locale, "supportReceipt");
}

/** Kopija energy.domovina.ai /beta/potvrda/ (docs/16). Podaci dolaze iz URL-a i preglednika, ne iz prerendera. */
export default async function Page({ params }: { params: Promise<{ locale: string }> }) {
	const { locale } = await params;
	if (!isLocale(locale)) notFound();
	return (
		<PageShell locale={locale} page="supportReceipt">
			<I18nProvider locale={locale}>
				<ReceiptPage />
			</I18nProvider>
		</PageShell>
	);
}
