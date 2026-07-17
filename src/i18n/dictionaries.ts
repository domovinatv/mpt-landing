import type { Locale } from "./config";

const hr = {
	meta: {
		title: "Mint Pay Transfer — 0% naknade, od početka do kraja",
		description:
			"MPT je javni projekt koji dokumentira i pokazuje da su transferi novca bez ijedne naknade tehnički mogući — end-to-end, s vizualizacijom toka novca i simulacijama korak po korak.",
	},
	nav: {
		flow: "Tok novca",
		why: "Zašto danas",
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
				text: "Debitnom karticom hrvatske banke (PBZ, ZABA, OTP, Erste, HPB…) preko Apple Paya ili Google Paya korisnik napuni Revolut (min. 10 €, Revolutov produktni limit). S hrvatskog IBAN-a ode puni iznos i puni iznos stigne na litavski IBAN — kartičnu transakciju plaća Revolut kroz svoj marketing.",
			},
			{
				num: "02",
				title: "SEPA Instant prema Moneriumu — 0 €",
				text: "Iz Revoluta ide SEPA Instant (uz skeniranje EPC QR koda; Revolut pita želi li korisnik primatelja na listu dozvoljenih računa, napravi interne provjere) na Moneriumov estonski IBAN — SEPA transakciju plaća Revolut. U referenci plaćanja piše kamo novac dalje ide: mpt:0x<adresa>?sid=<id>. Monerium na uplatu automatski kreira issue order (placed → pending → processed) — webhook stiže backendu za 4–5 sekundi.",
			},
			{
				num: "03",
				title: "Mint EURe i MPT forward — 0 €",
				text: "Monerium minta EURe 1:1 na svoj default wallet — MPT main-rail Safe (2/3 multisig) na Gnosis Chainu. Backend worker (Cloudflare Workers) na webhook pročita adresu iz reference i izvrši transfer kroz Zodiac Roles modul (rola smije isključivo EURe.transfer) — potpisuje ograničeni router EOA koji plaća gas. Bez adrese u referenci sredstva ostaju sigurno parkirana na Safeu.",
			},
			{
				num: "04",
				title: "EURe kod korisnika i zatvaranje kruga — 0 €",
				text: "Korisnik slobodno raspolaže EURe: onchain transakcije (gas sponzoriran), MPT checkout intenti (pending → paid na onchain potvrdi, max 10.000 € po intentu) ili off-ramp — otvori vlastiti Monerium račun (KYC/KYB), potpiše redeem i Monerium besplatnim SEPA Instantom vrati novac na istu banku iz koje je krug krenuo (ili bilo koju drugu s IBAN-om u eurozoni). Krug završava gdje je i počeo, end-to-end 0 €.",
			},
		],
		altTitle: "Alternativna grana: Gnosis Pay VISA (u pripremi)",
		altText:
			"Gnosis Pay korisniku deploya vlastiti GP Safe (Delay + Roles moduli) i izdaje besplatnu virtualnu VISA karticu — uz obavezan Sumsub KYC i opcionalni osobni Monerium IBAN. Punjenje kartice je običan EURe transfer s korisnikove adrese preko postojećeg sponzoriranog raila, a Apple Pay / Google Pay rade u Hrvatskoj. Budući da je GP VISA obična debitna kartica, njome se Revolut može besplatno napuniti natrag — krug se vrti i kroz karticu. Integracija je u pre-pilot pripremi.",
		liveNote:
			"MPT rail i checkout intenti rade u produkciji na pay.domovina.ai; donate.domovina.ai je statični QR ulaz na isti rail:",
		liveLinks: [
			{ label: "pay.domovina.ai", href: "https://pay.domovina.ai" },
			{ label: "donate.domovina.ai", href: "https://donate.domovina.ai" },
		],
	},
	why: {
		title: "Zašto ovo danas ima smisla",
		subtitle:
			"Svako kartično plaćanje u maloprodaji i svaki SEPA nalog iz klasične hrvatske banke nosi naknadu posrednika. MPT pokazuje da lokalna ekonomija može imati suvereni platni sustav: novac putuje izravno od platitelja do primatelja — bez postotka koji odlazi kartičnim shemama i procesorima, bez fiksnog bankovnog naloga — a svaki transfer ostavlja javni, provjerljivi trag.",
		tableHead: {
			channel: "Kanal",
			fee: "Naknada po transakciji",
			at2: "Na 2 €",
			at5: "Na 5 €",
			at100: "Na 100 €",
		},
		channels: [
			{
				name: "MPT rail (EURe, Gnosis)",
				fee: "0 € za korisnika (gas ~0,001 €, sponzoriran)",
				at2: "0,00 € · 0%",
				at5: "0,00 € · 0%",
				at100: "0,00 € · 0%",
				tone: "win" as const,
			},
			{
				name: "Kartica (Stripe EEA)",
				fee: "1,5% + 0,25 €",
				at2: "0,28 € · 14%",
				at5: "0,33 € · 6,5%",
				at100: "1,75 € · 1,75%",
				tone: "leak" as const,
			},
			{
				name: "SEPA nalog (HR banke)",
				fee: "0,25–0,40 € fiksno — plaća pošiljatelj",
				at2: "0,40 € · do 20%",
				at5: "0,40 € · do 8%",
				at100: "0,40 € · 0,4%",
				tone: "warn" as const,
			},
		],
		points: [
			{
				title: "Fiksna naknada ubija mikrouplate",
				text: "Na uplati od 2 € kartična naknada iznosi 14%, a fiksni bankovni nalog i do 20%. Male, česte uplate — upravo one od kojih živi lokalna maloprodaja — danas su najskuplje. Jedino transfer bez fiksnog dijela ni na jednoj strani čini mikrouplate isplativima.",
			},
			{
				title: "Novac ostaje u lokalnoj ekonomiji",
				text: "Postotak svake kartične transakcije odlazi shemama i procesorima izvan lokalnog kruga. Na MPT railu puni iznos stiže primatelju — razlika koja se na tisućama transakcija akumulira u ozbiljan novac koji ostaje trgovcu i zajednici.",
			},
			{
				title: "Suverenost bez posrednika",
				text: "Rail počiva na reguliranom e-novcu (EURe, licencirani izdavatelj Monerium) u samoskrbništvu korisnika. Između platitelja i primatelja nema posrednika koji naplaćuje maržu — lokalna ekonomija dobiva platni sustav kojim sama raspolaže.",
			},
			{
				title: "Javni, provjerljivi trag",
				text: "Za razliku od gotovine i kartičnih obračuna, svaki transfer javno je vidljiv i auditabilan onchain — transparentnost za kupca, trgovca i zajednicu, bez odricanja od samoskrbništva.",
			},
		],
		sourceNote:
			"Stope: Stripe EEA cjenik za domaće kartice (srpanj 2026.) i tipični fiksni SEPA nalozi klasičnih hrvatskih banaka (ZABA, PBZ, Erste, OTP, HPB). Izvor i metodologija:",
		sourceLink: {
			label: "lom.ff.hr/dokumenti/isplativost",
			href: "https://lom.ff.hr/dokumenti/isplativost",
		},
	},
	savings: {
		title: "Potencijalna ušteda hrvatske maloprodaje",
		subtitle: "Ilustrativni izračun — naknade koje posrednici danas uzmu, a na MPT railu ne postoje.",
		txPerDay: "Transakcija dnevno",
		avgAmount: "Prosječni iznos (€)",
		perTx: "Naknada po transakciji",
		daily: "Dnevno",
		monthly: "Mjesečno",
		yearly: "Godišnje",
		vsCard: "vs. kartica",
		vsSepa: "vs. SEPA nalog",
		upTo: "do",
		note: "Kartica: 1,5% + 0,25 € po transakciji (Stripe EEA). SEPA: fiksni nalog do 0,40 € (HR banke, plaća pošiljatelj). Mjesec = 30 dana, godina = 365.",
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
			todayCompare: "Ista uplata danas — naknada posrednika",
			todayCard: "Kartica (1,5% + 0,25 €)",
			todaySepa: "SEPA nalog HR banke",
			todayUpTo: "do",
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
		why: "Why now",
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
				text: "Using a Croatian bank debit card (PBZ, ZABA, OTP, Erste, HPB…) via Apple Pay or Google Pay, the user tops up Revolut (min. €10, a Revolut product limit). The full amount leaves the Croatian IBAN and the full amount arrives on the Lithuanian IBAN — Revolut pays the card transaction as part of its marketing.",
			},
			{
				num: "02",
				title: "SEPA Instant to Monerium — €0",
				text: "From Revolut a SEPA Instant goes out (with EPC QR scanning; Revolut asks whether to add the payee to the allowed-recipients list and runs internal checks) to Monerium's Estonian IBAN — Revolut pays the SEPA transaction. The payment reference says where the money goes next: mpt:0x<address>?sid=<id>. On arrival Monerium automatically creates an issue order (placed → pending → processed) — the webhook reaches the backend in 4–5 seconds.",
			},
			{
				num: "03",
				title: "EURe mint and the MPT forward — €0",
				text: "Monerium mints EURe 1:1 to its default wallet — the MPT main-rail Safe (a 2/3 multisig) on Gnosis Chain. On the webhook, the backend worker (Cloudflare Workers) reads the address from the reference and executes the transfer through the Zodiac Roles module (the role may only call EURe.transfer) — a constrained router EOA signs and pays the gas. With no address in the reference, the funds stay safely parked in the Safe.",
			},
			{
				num: "04",
				title: "EURe with the user and closing the circle — €0",
				text: "The user freely controls the EURe: onchain transactions (gas sponsored), MPT checkout intents (pending → paid on onchain confirmation, max €10,000 per intent), or the off-ramp — open an own Monerium account (KYC/KYB), sign a redeem and Monerium returns the money by free SEPA Instant to the very bank the circle started from (or any other bank with a eurozone IBAN). The circle ends where it began, end-to-end €0.",
			},
		],
		altTitle: "Alternative branch: Gnosis Pay VISA (in preparation)",
		altText:
			"Gnosis Pay deploys the user's own GP Safe (Delay + Roles modules) and issues a free virtual VISA card — with mandatory Sumsub KYC and an optional personal Monerium IBAN. Funding the card is a plain EURe transfer from the user's address over the existing sponsored rail, and Apple Pay / Google Pay work in Croatia. Since the GP VISA is a regular debit card, it can also top Revolut back up for free — the circle spins through the card too. The integration is in pre-pilot preparation.",
		liveNote:
			"The MPT rail and checkout intents run in production at pay.domovina.ai; donate.domovina.ai is a static QR entry to the same rail:",
		liveLinks: [
			{ label: "pay.domovina.ai", href: "https://pay.domovina.ai" },
			{ label: "donate.domovina.ai", href: "https://donate.domovina.ai" },
		],
	},
	why: {
		title: "Why this makes sense today",
		subtitle:
			"Every retail card payment and every SEPA order from a classic Croatian bank carries an intermediary fee. MPT shows that a local economy can have a sovereign payment system: money travels directly from payer to payee — without the percentage flowing to card schemes and processors, without the fixed bank order fee — and every transfer leaves a public, verifiable trace.",
		tableHead: {
			channel: "Channel",
			fee: "Fee per transaction",
			at2: "On €2",
			at5: "On €5",
			at100: "On €100",
		},
		channels: [
			{
				name: "MPT rail (EURe, Gnosis)",
				fee: "€0 for the user (gas ~€0.001, sponsored)",
				at2: "€0.00 · 0%",
				at5: "€0.00 · 0%",
				at100: "€0.00 · 0%",
				tone: "win" as const,
			},
			{
				name: "Card (Stripe EEA)",
				fee: "1.5% + €0.25",
				at2: "€0.28 · 14%",
				at5: "€0.33 · 6.5%",
				at100: "€1.75 · 1.75%",
				tone: "leak" as const,
			},
			{
				name: "SEPA order (Croatian banks)",
				fee: "€0.25–0.40 fixed — paid by the sender",
				at2: "€0.40 · up to 20%",
				at5: "€0.40 · up to 8%",
				at100: "€0.40 · 0.4%",
				tone: "warn" as const,
			},
		],
		points: [
			{
				title: "Fixed fees kill micropayments",
				text: "On a €2 payment the card fee is 14%, and the fixed bank order up to 20%. Small, frequent payments — exactly what local retail lives on — are the most expensive today. Only a transfer with no fixed component on either side makes micropayments viable.",
			},
			{
				title: "Money stays in the local economy",
				text: "A percentage of every card transaction leaves the local circle for schemes and processors. On the MPT rail the full amount reaches the payee — a difference that, over thousands of transactions, accumulates into serious money that stays with the merchant and the community.",
			},
			{
				title: "Sovereignty without intermediaries",
				text: "The rail is built on regulated e-money (EURe, issued by the licensed EMI Monerium) in the user's self-custody. There is no intermediary between payer and payee charging a margin — the local economy gets a payment system of its own.",
			},
			{
				title: "A public, verifiable trace",
				text: "Unlike cash and card settlements, every transfer is publicly visible and auditable onchain — transparency for the buyer, the merchant and the community, without giving up self-custody.",
			},
		],
		sourceNote:
			"Rates: Stripe EEA pricing for domestic cards (July 2026) and typical fixed SEPA order fees at classic Croatian banks (ZABA, PBZ, Erste, OTP, HPB). Source and methodology:",
		sourceLink: {
			label: "lom.ff.hr/dokumenti/isplativost",
			href: "https://lom.ff.hr/dokumenti/isplativost",
		},
	},
	savings: {
		title: "Potential savings for Croatian retail",
		subtitle: "An illustrative calculation — the fees intermediaries take today that don't exist on the MPT rail.",
		txPerDay: "Transactions per day",
		avgAmount: "Average amount (€)",
		perTx: "Fee per transaction",
		daily: "Daily",
		monthly: "Monthly",
		yearly: "Yearly",
		vsCard: "vs. card",
		vsSepa: "vs. SEPA order",
		upTo: "up to",
		note: "Card: 1.5% + €0.25 per transaction (Stripe EEA). SEPA: fixed order up to €0.40 (Croatian banks, paid by the sender). Month = 30 days, year = 365.",
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
			todayCompare: "The same payment today — intermediary fee",
			todayCard: "Card (1.5% + €0.25)",
			todaySepa: "Croatian bank SEPA order",
			todayUpTo: "up to",
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
