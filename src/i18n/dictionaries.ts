import type { Locale } from "./config";

const hr = {
	meta: {
		title: "Mint Pay Transfer — 0% naknade, od početka do kraja",
		description:
			"MPT je javni projekt koji pokazuje da su transferi novca bez ijedne naknade tehnički mogući — end-to-end, bez skrivenih troškova i bez marži na tečaj.",
	},
	nav: {
		how: "Kako radi",
		compare: "Usporedba",
		contact: "Kontakt",
	},
	hero: {
		eyebrow: "Mint Pay Transfer · javni demonstracijski projekt",
		title: "Slanje novca bez ijedne naknade.",
		titleAccent: "Od početka do kraja.",
		subtitle:
			"MPT javnosti pokazuje da su transferi s 0% naknada tehnički mogući — end-to-end. Bez naknade pošiljatelja, bez naknade primatelja, bez marže na tečaj.",
		ctaPrimary: "Saznaj kako",
		ctaSecondary: "Javi se",
		cardLabel: "Ukupni trošak transfera",
		cardRows: [
			{ label: "Naknada pošiljatelja", value: "0,00 €" },
			{ label: "Naknada primatelja", value: "0,00 €" },
			{ label: "Marža na tečaj", value: "0,00 %" },
		],
		cardTotal: "0,00 €",
	},
	problem: {
		title: "Svaki transfer danas negdje curi",
		subtitle:
			"Novac na putu od pošiljatelja do primatelja prolazi kroz lanac posrednika — i svaki uzme svoj dio.",
		items: [
			{
				title: "Naknade posrednika",
				text: "Kartične sheme, korespondentne banke i procesori naplaćuju svoju uslugu na svakom koraku lanca.",
			},
			{
				title: "Marže na tečaj",
				text: "Kod međuvalutnih transfera skriveno se gubi 1–4 % kroz tečaj koji nije srednji tržišni.",
			},
			{
				title: "Fiksni troškovi",
				text: "Fiksne naknade najviše pogađaju male iznose — poslati 10 € zna koštati više od 1 €.",
			},
		],
	},
	how: {
		title: "Kako je 0% moguće?",
		subtitle:
			"Trošak izvršenja jedne transakcije na modernoj platnoj infrastrukturi mjeri se u tisućinkama centa. MPT pokazuje da naknade nisu tehnička nužnost.",
		items: [
			{
				title: "Bez lanca posrednika",
				text: "Transfer ide izravno od pošiljatelja do primatelja — nema karika koje naplaćuju prolaz.",
			},
			{
				title: "Infrastruktura gotovo besplatna",
				text: "Moderni platni sustavi izvršavaju transakciju uz zanemariv trošak — nema razloga da korisnik plaća postotak.",
			},
			{
				title: "Otvoreno i provjerljivo",
				text: "Cijeli je projekt javan: implementacije i tehnička dokumentacija bit će objavljene i dostupne svima.",
			},
		],
		note: "Detaljan opis mehanizma i gotove implementacije objavljujemo uskoro.",
	},
	compare: {
		title: "100 € na putu",
		subtitle: "Što stigne primatelju kad pošaljete 100 € preko granice?",
		colTraditional: "Tipičan transfer",
		colMpt: "MPT",
		rows: [
			{ label: "Naknada pošiljatelja", traditional: "3–5 €", mpt: "0 €" },
			{ label: "Marža na tečaj", traditional: "1–4 €", mpt: "0 €" },
			{ label: "Naknada primatelja", traditional: "0–3 €", mpt: "0 €" },
		],
		totalLabel: "Primatelj dobije",
		totalTraditional: "88–96 €",
		totalMpt: "100,00 €",
	},
	cta: {
		title: "Projekt je otvoren javnosti",
		subtitle:
			"Zanima te kako radi, želiš doprinijeti ili samo pratiti razvoj? Javi se.",
		button: "kontakt@mpt.hr",
	},
	footer: {
		tagline: "Javni projekt koji pokazuje da su transferi bez naknada mogući.",
		disclaimer:
			"MPT je demonstracijski projekt, a ne licencirana platna usluga.",
	},
	langSwitch: { label: "EN", href: "/en", ariaLabel: "Switch to English" },
};

const en: typeof hr = {
	meta: {
		title: "Mint Pay Transfer — 0% fees, end to end",
		description:
			"MPT is a public project demonstrating that money transfers with zero fees are technically possible — end-to-end, with no hidden costs and no FX markup.",
	},
	nav: {
		how: "How it works",
		compare: "Comparison",
		contact: "Contact",
	},
	hero: {
		eyebrow: "Mint Pay Transfer · a public demonstration project",
		title: "Send money with zero fees.",
		titleAccent: "End to end.",
		subtitle:
			"MPT shows the public that transfers with 0% fees are technically possible — end-to-end. No sender fee, no recipient fee, no FX markup.",
		ctaPrimary: "See how",
		ctaSecondary: "Get in touch",
		cardLabel: "Total transfer cost",
		cardRows: [
			{ label: "Sender fee", value: "€0.00" },
			{ label: "Recipient fee", value: "€0.00" },
			{ label: "FX markup", value: "0.00%" },
		],
		cardTotal: "€0.00",
	},
	problem: {
		title: "Every transfer leaks somewhere today",
		subtitle:
			"Money travels from sender to recipient through a chain of intermediaries — and each takes a cut.",
		items: [
			{
				title: "Intermediary fees",
				text: "Card schemes, correspondent banks and processors charge for their service at every step of the chain.",
			},
			{
				title: "FX markups",
				text: "On cross-currency transfers, 1–4% is silently lost through exchange rates that aren't mid-market.",
			},
			{
				title: "Fixed costs",
				text: "Flat fees hit small amounts hardest — sending €10 can cost more than €1.",
			},
		],
	},
	how: {
		title: "How is 0% possible?",
		subtitle:
			"Executing a single transaction on modern payment infrastructure costs fractions of a cent. MPT demonstrates that fees are not a technical necessity.",
		items: [
			{
				title: "No chain of intermediaries",
				text: "The transfer goes directly from sender to recipient — no links charging for passage.",
			},
			{
				title: "Near-free infrastructure",
				text: "Modern payment systems execute a transaction at negligible cost — there's no reason for users to pay a percentage.",
			},
			{
				title: "Open and verifiable",
				text: "The whole project is public: implementations and technical documentation will be published and available to everyone.",
			},
		],
		note: "A detailed description of the mechanism and working implementations are coming soon.",
	},
	compare: {
		title: "€100 on its way",
		subtitle: "What reaches the recipient when you send €100 across a border?",
		colTraditional: "Typical transfer",
		colMpt: "MPT",
		rows: [
			{ label: "Sender fee", traditional: "€3–5", mpt: "€0" },
			{ label: "FX markup", traditional: "€1–4", mpt: "€0" },
			{ label: "Recipient fee", traditional: "€0–3", mpt: "€0" },
		],
		totalLabel: "Recipient receives",
		totalTraditional: "€88–96",
		totalMpt: "€100.00",
	},
	cta: {
		title: "The project is open to the public",
		subtitle:
			"Curious how it works, want to contribute, or just follow along? Get in touch.",
		button: "kontakt@mpt.hr",
	},
	footer: {
		tagline: "A public project demonstrating that zero-fee transfers are possible.",
		disclaimer: "MPT is a demonstration project, not a licensed payment service.",
	},
	langSwitch: { label: "HR", href: "/hr", ariaLabel: "Prebaci na hrvatski" },
};

export type Dictionary = typeof hr;

const dictionaries: Record<Locale, Dictionary> = { hr, en };

export function getDictionary(locale: Locale): Dictionary {
	return dictionaries[locale];
}
