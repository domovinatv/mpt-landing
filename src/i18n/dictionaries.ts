import type { Locale } from "./config";

const hr = {
	meta: {
		title: "Mint Pay Transfer — 0% naknade, od početka do kraja",
		description:
			"MPT je javni projekt koji dokumentira i pokazuje da su transferi novca bez ijedne naknade tehnički mogući — end-to-end, s vizualizacijom toka novca i simulacijama korak po korak.",
	},
	nav: {
		flow: "Tok novca",
		sim: "Simulacije",
		contact: "Kontakt",
	},
	hero: {
		eyebrow: "Mint Pay Transfer · javni demonstracijski projekt",
		title: "Slanje novca bez ijedne naknade.",
		titleAccent: "Od početka do kraja.",
		subtitle:
			"MPT javnosti pokazuje da su transferi s 0% naknada tehnički mogući — end-to-end. Cijeli tok novca dokumentiran je tekstualno i vizualno, sa simulacijama korak po korak.",
		ctaPrimary: "Pogledaj tok novca",
		ctaSecondary: "Javi se",
		cardLabel: "Ukupni trošak transfera",
		cardRows: [
			{ label: "Naknada pošiljatelja", value: "0,00 €" },
			{ label: "Naknada primatelja", value: "0,00 €" },
			{ label: "Marža na tečaj", value: "0,00 %" },
		],
		cardTotal: "0,00 €",
	},
	flow: {
		title: "Dokumentirani tok novca",
		subtitle:
			"Svaki korak, svaki račun i svaki prijelaz — tko što radi, koji su minimalni iznosi i tko plaća koju naknadu. Korisnik na svakom koraku plaća 0 €.",
		steps: [
			{
				num: "01",
				title: "Kartični top-up na Revolut — 0 €",
				text: "Debitnom karticom hrvatske banke (PBZ, ZABA, OTP, Erste, HPB…) preko Apple Paya ili Google Paya korisnik prebaci min. 10 € na svoj Revolut. S hrvatskog IBAN-a ode 10 € i na litavski IBAN stigne 10 € — kartičnu transakciju plaća Revolut kroz svoj marketing.",
			},
			{
				num: "02",
				title: "SEPA Instant prema Moneriumu — 0 €",
				text: "Iz Revoluta ide SEPA plaćanje (po defaultu SEPA Instant, uz skeniranje EPC QR koda). Revolut pita želi li korisnik primatelja dodati na listu dozvoljenih računa, napravi interne provjere i pošalje min. 1 € na Moneriumov estonski IBAN — SEPA transakciju plaća Revolut. U referenci plaćanja piše onchain adresa na koju novac dalje treba otići.",
			},
			{
				num: "03",
				title: "Mint EURe i MPT relayer — 0 €",
				text: "Monerium provjeri uplatu i minta EURe 1:1 na default account — Gnosis Safe multisig relayer. mpt-main-rail (Cloudflare Workers) pročita adresu iz reference i preusmjeri EURe jeftinom sponzoriranom onchain transakcijom na korisnikovu Gnosis adresu — gas plaća MPT.",
			},
			{
				num: "04",
				title: "EURe kod korisnika i zatvaranje kruga — 0 €",
				text: "Korisnik slobodno raspolaže EURe: onchain transakcije, MPT checkout intenti ili off-ramp — otvori vlastiti Monerium račun (KYC/KYB) i Monerium besplatnim SEPA Instantom vrati novac na PBZ/ZABA/OTP/Erste/HPB ili bilo koju europsku banku. Krug je zatvoren, end-to-end 0 €.",
			},
		],
		altTitle: "Alternativna grana: Gnosis Pay VISA",
		altText:
			"Gnosis Pay izdaje vlastite VISA kartice — virtualne besplatno, fizičke opcionalno, uz opcionalni Monerium IBAN. Korisnik karticu doda u Revolut i top-up napravi izravno iz Revoluta — opet 0 € za korisnika, bez Monerium koraka.",
		liveNote: "Sve navedeno već je implementirano i radi u produkciji:",
		liveLinks: [
			{ label: "pay.domovina.ai", href: "https://pay.domovina.ai" },
			{ label: "donate.domovina.ai", href: "https://donate.domovina.ai" },
		],
	},
	sim: {
		title: "Simulacije korak po korak",
		subtitle:
			"Cijeli tok modeliran je kao state machine sa svim čvorovima, prijelazima i zaštitnim limitima. Odaberi scenarij i prati novac korak po korak — dijagram pokazuje gdje je novac, dnevnik tko je što napravio i tko je platio.",
		labels: {
			pickScenario: "Scenarij",
			start: "Kreni",
			next: "Sljedeći korak",
			prev: "Natrag",
			autoplay: "▶ Auto",
			pause: "⏸ Pauza",
			reset: "Reset",
			stepOf: "Korak {i} / {n}",
			userFees: "Naknade koje je platio korisnik",
			sponsoredBy: "Troškove koraka pokrili:",
			sponsorNames: {
				revolut: "Revolut",
				monerium: "Monerium",
				mpt: "MPT",
				gnosispay: "Gnosis Pay",
			},
			finished: "Scenarij dovršen — korisnik je platio 0,00 €.",
			logEmpty: "Pritisni Kreni ili ▶ Auto za pokretanje simulacije.",
		},
		testsNote:
			"Isti state machine pokreće i automatske testove: svaki scenarij dokazuje da korisnik plaća 0 € i da se iznosi čuvaju 1:1 na svakom koraku.",
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
			"MPT is a public project documenting and demonstrating that zero-fee money transfers are technically possible — end-to-end, with a visualized money flow and step-by-step simulations.",
	},
	nav: {
		flow: "Money flow",
		sim: "Simulations",
		contact: "Contact",
	},
	hero: {
		eyebrow: "Mint Pay Transfer · a public demonstration project",
		title: "Send money with zero fees.",
		titleAccent: "End to end.",
		subtitle:
			"MPT shows the public that transfers with 0% fees are technically possible — end-to-end. The entire money flow is documented textually and visually, with step-by-step simulations.",
		ctaPrimary: "See the money flow",
		ctaSecondary: "Get in touch",
		cardLabel: "Total transfer cost",
		cardRows: [
			{ label: "Sender fee", value: "€0.00" },
			{ label: "Recipient fee", value: "€0.00" },
			{ label: "FX markup", value: "0.00%" },
		],
		cardTotal: "€0.00",
	},
	flow: {
		title: "The documented money flow",
		subtitle:
			"Every step, every account and every transition — who does what, what the minimum amounts are and who pays each fee. The user pays €0 at every step.",
		steps: [
			{
				num: "01",
				title: "Card top-up to Revolut — €0",
				text: "Using a Croatian bank debit card (PBZ, ZABA, OTP, Erste, HPB…) via Apple Pay or Google Pay, the user moves min. €10 to their Revolut. €10 leaves the Croatian IBAN and €10 arrives on the Lithuanian IBAN — Revolut pays the card transaction as part of its marketing.",
			},
			{
				num: "02",
				title: "SEPA Instant to Monerium — €0",
				text: "From Revolut a SEPA payment goes out (SEPA Instant by default, with EPC QR code scanning). Revolut asks whether to add the payee to the allowed-recipients list, runs internal checks and sends min. €1 to Monerium's Estonian IBAN — Revolut pays the SEPA transaction. The payment reference carries the onchain address the money should continue to.",
			},
			{
				num: "03",
				title: "EURe mint and the MPT relayer — €0",
				text: "Monerium verifies the payment and mints EURe 1:1 to the default account — a Gnosis Safe multisig relayer. mpt-main-rail (Cloudflare Workers) reads the address from the reference and reroutes the EURe via a cheap sponsored onchain transaction to the user's Gnosis address — MPT pays the gas.",
			},
			{
				num: "04",
				title: "EURe with the user and closing the circle — €0",
				text: "The user freely controls the EURe: onchain transactions, MPT checkout intents, or the off-ramp — open an own Monerium account (KYC/KYB) and Monerium returns the money by free SEPA Instant to PBZ/ZABA/OTP/Erste/HPB or any European bank. The circle is closed, end-to-end €0.",
			},
		],
		altTitle: "Alternative branch: Gnosis Pay VISA",
		altText:
			"Gnosis Pay issues its own VISA cards — virtual ones free, physical optional, with an optional Monerium IBAN. The user adds the card to Revolut and tops it up straight from Revolut — again €0 for the user, with no Monerium hop.",
		liveNote: "All of this is already implemented and running in production:",
		liveLinks: [
			{ label: "pay.domovina.ai", href: "https://pay.domovina.ai" },
			{ label: "donate.domovina.ai", href: "https://donate.domovina.ai" },
		],
	},
	sim: {
		title: "Step-by-step simulations",
		subtitle:
			"The entire flow is modeled as a state machine with every node, transition and guard limit. Pick a scenario and follow the money step by step — the diagram shows where the money is, the log shows who did what and who paid.",
		labels: {
			pickScenario: "Scenario",
			start: "Start",
			next: "Next step",
			prev: "Back",
			autoplay: "▶ Auto",
			pause: "⏸ Pause",
			reset: "Reset",
			stepOf: "Step {i} / {n}",
			userFees: "Fees paid by the user",
			sponsoredBy: "Step costs covered by:",
			sponsorNames: {
				revolut: "Revolut",
				monerium: "Monerium",
				mpt: "MPT",
				gnosispay: "Gnosis Pay",
			},
			finished: "Scenario complete — the user paid €0.00.",
			logEmpty: "Press Start or ▶ Auto to run the simulation.",
		},
		testsNote:
			"The same state machine also powers automated tests: every scenario proves the user pays €0 and amounts are conserved 1:1 at every step.",
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
