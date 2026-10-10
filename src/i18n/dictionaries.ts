import type { Locale } from "./config";

const hr = {
	meta: {
		title: "MPT — kupac plaća iz banke, novac stiže izravno trgovcu",
		description:
			"MPT (Mint Pay Transfer), proizvod tvrtke ITalk d.o.o., orkestrira plaćanja na Monerium računima trgovaca — kao RevenueCat, ali za SEPA → EURe. Kupac plaća iz banke s 0 € naknade, novac stiže izravno trgovcu za ~12 s, a MPT ga nikad ne drži. U produkciji na pay.domovina.ai.",
	},
	nav: {
		how: "Kako radi",
		flow: "Tok novca",
		sim: "Simulacije",
		why: "Zašto danas",
		status: "Stanje",
		contact: "Kontakt",
	},
	hero: {
		eyebrow: "Mint Pay Transfer · proizvod tvrtke ITalk d.o.o.",
		title: "Kupac plaća iz banke.",
		titleAccent: "Novac stiže izravno trgovcu.",
		subtitle:
			"MPT je orkestrator za Monerium račune trgovaca — ono što je RevenueCat za pretplate u aplikacijama, MPT je za SEPA plaćanja u EURe. Svaki trgovac ima vlastiti IBAN i Safe; MPT vodi checkout, reference, routing, webhookove i status uživo, a novac nikad ne drži. Kupac plaća 0 € naknade.",
		ctaPrimary: "Kako MPT radi",
		ctaSecondary: "Javi se",
		cardLabel: "Izmjereno u produkciji · listopad 2026.",
		cardTotal: "~12 s",
		cardTotalNote: "od uplate u banci do statusa „paid“ kod trgovca",
		cardRows: [
			{ label: "Kupac vidi „zaprimljeno“", value: "~5 s" },
			{ label: "Naknada kupca", value: "0,00 €" },
			{ label: "Tko drži novac", value: "trgovac" },
		],
	},
	how: {
		title: "Orkestrator, ne posrednik",
		subtitle:
			"RevenueCat ne prima novac od App Storea — vodi poslovnu logiku pretplata za tisuće aplikacija. MPT na isti način ne prima novac kupaca: vodi poslovnu logiku plaćanja za više Monerium računa, a svaki od njih pripada trgovcu.",
		compareHead: { aspect: "", rc: "RevenueCat (pretplate u aplikacijama)", mpt: "MPT (SEPA → EURe)" },
		compareRows: [
			{
				aspect: "Tko naplaćuje i izdaje novac",
				rc: "App Store / Google Play",
				mpt: "Monerium — licencirani izdavatelj e-novca, na računu trgovca",
			},
			{ aspect: "Kod koga je novac", rc: "developer", mpt: "trgovac — vlastiti IBAN i Safe" },
			{
				aspect: "Što radi orkestrator",
				rc: "status pretplata, entitlementi, webhookovi",
				mpt: "checkout intenti, reference, routing, webhookovi, status uživo",
			},
			{ aspect: "Integracija", rc: "jedan SDK za obje trgovine", mpt: "jedan API za sve Monerium račune (tenante)" },
		],
		cards: [
			{
				title: "Vlastiti Monerium račun po trgovcu",
				text: "Svaki tenant ima vlastiti KYB, IBAN, Safe (2/3 multisig) i listu odobrenih adresa. Novac koji je sletio na IBAN trgovca X može završiti samo na adresama trgovca X — to se provodi u kodu i onchain (Zodiac Roles).",
			},
			{
				title: "Jedna integracija, ista poslovna logika",
				text: "Checkout intent s EPC QR kodom, stanja pending → zaprimljeno → paid → expired, status uživo preko SSE-a i webhookovi (received · paid · rejected · late) s trajnim outboxom koji ponavlja isporuku do ~47 h.",
			},
			{
				title: "Otporno na stvarne uplate",
				text: "Uplata bez reference povezuje se s intentom po iznosu i vremenu, manja uplata nikad nije „paid“, a svaki forward koji ne prođe završava kao alarm — nikad tiho. Isti intent ne može se platiti dvaput.",
			},
			{
				title: "Otvoreni kod — imaj svoj MPT",
				text: "Cijeli rail je na GitHubu pod MIT licencom. Tko želi, pokrene vlastitu instancu; tko ne želi voditi infrastrukturu, koristi hostani MPT — kao što većina aplikacija koristi RevenueCat umjesto vlastitog backenda za pretplate.",
			},
		],
		codeLink: { label: "github.com/domovinatv/pay.domovina.ai", href: "https://github.com/domovinatv/pay.domovina.ai" },
	},
	flow: {
		title: "Dokumentirani tok novca",
		subtitle:
			"Svaki korak, svaki račun i svaki prijelaz — tko što radi, koliko traje i tko plaća koju naknadu. Kupac na svakom koraku plaća 0 €.",
		steps: [
			{
				num: "01",
				title: "Kupac plaća iz svoje banke — 0 €",
				text: "Debitnom karticom hrvatske banke (PBZ, ZABA, OTP, Erste, HPB…) preko Apple Paya ili Google Paya kupac napuni Revolut (min. 10 €, Revolutov produktni limit), pa na checkoutu skenira EPC QR i pošalje SEPA Instant (min. 1 €). Kartičnu i SEPA transakciju plaća Revolut. U referenci piše kome novac ide: mpt:0x<trgovac>?sid=<intent>.",
			},
			{
				num: "02",
				title: "Uplata na IBAN trgovca, „zaprimljeno“ odmah — 0 €",
				text: "Uplata stiže na Monerium IBAN trgovca (vlastiti KYB; prvi tenant u produkciji je ITalk d.o.o.). Monerium kreira issue order (placed → pending → processed), a MPT već na prvi webhook poveže uplatu s intentom i checkout preko SSE-a pokaže „zaprimljeno“ — u produkciji ~5 s nakon što je kupac pritisnuo „Pošalji“.",
			},
			{
				num: "03",
				title: "Mint EURe i forward trgovcu — 0 €",
				text: "Monerium minta EURe 1:1 na Safe trgovca (2/3 multisig) na Gnosis Chainu — medijan 9 s od uplate. MPT backend (Cloudflare Workers) izvrši forward kroz Zodiac Roles modul (rola smije samo EURe.transfer) na adresu iz reference — fail-closed, samo na odobrene adrese tog trgovca; gas plaća MPT-ov router. Intent postaje „paid“ na onchain potvrdi, ~12 s od uplate, a trgovac dobiva webhook.",
			},
			{
				num: "04",
				title: "Ako se referenca izgubi — novac svejedno stiže",
				text: "Revolut iOS ponekad ispusti referencu iz QR koda. Resolver tada uplatu poveže s otvorenim intentom istog trgovca po točnom iznosu i vremenu: ako je kandidat jednoznačan, forward ide automatski; inače novac ostaje parkiran na Safeu trgovca dok ga operater ručno ne preusmjeri. Manja uplata od iznosa intenta nikad ne postaje „paid“.",
			},
		],
		notes: [
			{
				title: "Isti rail, i drugi smjerovi",
				text: "Isti rail puni i korisnikov vlastiti wallet (on-ramp), iz kojeg se plaća checkout ili rade P2P transferi sa sponzoriranim gasom. Off-ramp ide preko vlastitog Monerium računa i besplatnog SEPA Instanta natrag u banku — krug se zatvara gdje je i počeo. Sve je u simulacijama ispod.",
			},
			{
				title: "Alternativna grana: Gnosis Pay VISA (u pripremi)",
				text: "Gnosis Pay korisniku deploya vlastiti GP Safe (Delay + Roles moduli) i izdaje besplatnu virtualnu VISA karticu — uz obavezan Sumsub KYC. Punjenje kartice je običan EURe transfer s korisnikove adrese, a Apple Pay / Google Pay rade u Hrvatskoj. GP VISA karticom Revolut se može besplatno napuniti natrag. Integracija je u pre-pilot pripremi.",
			},
		],
		liveNote: "Checkout intenti i rail rade u produkciji; kod je otvoren:",
		liveLinks: [
			{ label: "pay.domovina.ai", href: "https://pay.domovina.ai" },
			{ label: "donate.domovina.ai", href: "https://donate.domovina.ai" },
			{ label: "GitHub", href: "https://github.com/domovinatv/pay.domovina.ai" },
		],
	},
	status: {
		title: "Što radi danas, a što je u pripremi",
		subtitle:
			"Bez uljepšavanja: „u produkciji“ znači izmjereno na stvarnim uplatama. Sve ostalo je jasno označeno.",
		live: {
			title: "U produkciji",
			items: [
				"Checkout intenti s EPC QR kodom — do 10.000 € po intentu, valjanost 15 min do 24 h",
				"„Zaprimljeno“ odmah i status uživo preko SSE-a (od 5. 10. 2026.)",
				"Webhookovi za trgovce (received · paid · rejected · late) s trajnim outboxom",
				"Uplate bez reference: automatsko povezivanje s intentom (od 8. 10. 2026.)",
				"Isplata samo na odobrene adrese tenanta — fail-closed (od 1. 8. 2026.)",
				"Nadzor Safea: alarm za svaki izlaz koji nije MPT-ov forward",
				"Nezavisni code reviewi — svih 17 kritičnih i visokih nalaza drugog kruga riješeno 10. 10. 2026.; CI na svakom PR-u",
			],
		},
		prep: {
			title: "U pripremi",
			items: [
				"Drugi tenanti s vlastitim Monerium računom — kod je u produkciji, uključuje se s prvim trgovcem koji završi KYB",
				"Shopify: MPT kao način plaćanja s QR kodom — kod spojen, prvi test na stvarnoj trgovini predstoji",
				"WooCommerce — plan",
				"Gnosis Pay VISA grana — pre-pilot",
				"Potpisivanje forwarda izvan clouda (M-of-N kvorum uređaja) — prijedlog",
			],
		},
		limits: {
			title: "Poznata ograničenja",
			items: [
				"Prvu uplatu s novog IBAN-a Monerium zadržava na ručnom pregledu — od nekoliko minuta do nekoliko sati. Sljedeće uplate s istog IBAN-a prolaze za sekunde.",
				"Revolut iOS ponekad ispusti referencu iz QR koda — resolver to pokriva kad je kandidat jednoznačan, inače uplatu ručno preusmjeri operater.",
				"SEPA povrat (recall) nakon što je EURe već proslijeđen nije automatiziran.",
			],
		},
	},
	why: {
		title: "Zašto ovo danas ima smisla",
		subtitle:
			"Svako kartično plaćanje u maloprodaji i svaki SEPA nalog iz klasične hrvatske banke nosi naknadu posrednika. MPT pokazuje da lokalna ekonomija može imati suvereni platni sustav: novac putuje izravno od platitelja do primatelja — bez postotka koji odlazi kartičnim shemama i procesorima, bez fiksnog bankovnog naloga — a svaki transfer ostavlja javni, provjerljivi trag.",
		tableHead: {
			channel: "Kanal",
			fee: "Naknada po transakciji",
			at1: "Na 1 €",
			at2: "Na 2 €",
			at5: "Na 5 €",
			at100: "Na 100 €",
		},
		channels: [
			{
				name: "MPT rail (EURe, Gnosis)",
				fee: "0 € za kupca (gas ~0,001 €, sponzoriran)",
				at1: "0,00 € · 0%",
				at2: "0,00 € · 0%",
				at5: "0,00 € · 0%",
				at100: "0,00 € · 0%",
				tone: "win" as const,
			},
			{
				name: "Kartica (Stripe EEA)",
				fee: "1,5% + 0,25 €",
				at1: "0,27 € · 26,5%",
				at2: "0,28 € · 14%",
				at5: "0,33 € · 6,5%",
				at100: "1,75 € · 1,75%",
				tone: "leak" as const,
			},
			{
				name: "SEPA nalog (HR banke)",
				fee: "0,25–0,45 € fiksno — plaća pošiljatelj",
				at1: "do 0,45 € · do 45%",
				at2: "do 0,45 € · do 22,5%",
				at5: "do 0,45 € · do 9%",
				at100: "do 0,45 € · 0,45%",
				tone: "warn" as const,
			},
		],
		points: [
			{
				title: "Fiksna naknada ubija mikrouplate",
				text: "Na uplati od 2 € kartična naknada iznosi 14%, a fiksni bankovni nalog i do 22,5%. Male, česte uplate — upravo one od kojih živi lokalna maloprodaja — danas su najskuplje. Jedino transfer bez fiksnog dijela ni na jednoj strani čini mikrouplate isplativima.",
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
		note: "Kartica: 1,5% + 0,25 € po transakciji (Stripe EEA). SEPA: fiksni nalog 0,25–0,45 € po transakciji (HR banke, plaća pošiljatelj). Mjesec = 30 dana, godina = 365.",
	},
	sim: {
		title: "Simulacije korak po korak",
		subtitle:
			"Cijeli tok modeliran je kao state machine sa svim čvorovima, prijelazima i zaštitnim limitima. Odaberi scenarij — od plaćanja trgovcu iz banke do uplate bez reference — i prati novac korak po korak — dijagram pokazuje gdje je novac, dnevnik tko je što napravio i tko je platio.",
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
			todayAmount: "Iznos transakcije",
			todayCard: "Kartica (1,5% + 0,25 €)",
			todaySepa: "SEPA nalog HR banke",
			todayUpTo: "do",
		},
		testsNote:
			"Isti state machine pokreće i automatske testove: svaki scenarij dokazuje da kupac odnosno korisnik plaća 0 € i da se iznosi čuvaju 1:1 na svakom koraku.",
	},
	cta: {
		title: "Želiš primati uplate preko MPT-a?",
		subtitle:
			"Trgovine, udruge, župe i projekti — svatko s vlastitim Monerium računom, a MPT vodi ostalo. Ili pokreni vlastiti MPT: kod je otvoren. Razgovor se vodi javno u Telegram grupi, gdje nas možeš dobiti i osobno.",
		button: { label: "Pridruži se: t.me/mpt_hr", href: "https://t.me/mpt_hr" },
		secondary: { label: "ili e-poštom: ms@mpt.hr", href: "mailto:ms@mpt.hr" },
	},
	footer: {
		columns: [
			{
				title: "Proizvod",
				links: [
					{ label: "Kako radi", href: "#how" },
					{ label: "Tok novca", href: "#flow" },
					{ label: "Simulacije", href: "#sim" },
					{ label: "Zašto danas", href: "#why" },
					{ label: "Stanje", href: "#status" },
					{ label: "Kontakt", href: "#contact" },
				],
			},
			{
				title: "Produkcija i kod",
				links: [
					{ label: "pay.domovina.ai", href: "https://pay.domovina.ai" },
					{ label: "donate.domovina.ai", href: "https://donate.domovina.ai" },
					{ label: "GitHub (MIT)", href: "https://github.com/domovinatv/pay.domovina.ai" },
				],
			},
			{
				title: "Tvrtka",
				links: [
					{ label: "airkuna.com", href: "https://airkuna.com" },
					{ label: "ITalk d.o.o.", href: "https://italk.hr" },
				],
			},
		],
		note: "Napomena: MPT rail i checkout intenti rade u produkciji (pay.domovina.ai) s prvim tenantom, ITalk d.o.o.; uključivanje drugih tenanata, Shopify i Gnosis Pay grana iskreno su označeni kao u pripremi. MPT nije licencirana platna usluga — ITalk je non-custodial software provider koji ne prima ni ne drži novac kupaca, a regulirane funkcije (izdavanje e-novca, KYC/KYB) obavlja licencirani izdavatelj (Monerium, EMI / MiCA EMT). Ova stranica nije investicijski ni pravni savjet.",
		imprintLead: "MPT (Mint Pay Transfer)",
		imprint:
			"je proizvod tvrtke ITalk d.o.o. za informacijske tehnologije · IX. Južna obala 20, 10000 Zagreb, Hrvatska · OIB: 54872935051 · MBS: 081042440 · EUID: HRSR.081042440 · Trgovački sud u Zagrebu · direktor: Matija Stepanić",
		imprintLinks: [
			{ label: "t.me/mpt_hr", href: "https://t.me/mpt_hr" },
			{ label: "ms@mpt.hr", href: "mailto:ms@mpt.hr" },
			{ label: "italk.hr", href: "https://italk.hr" },
		],
		copyright: "MPT / ITalk d.o.o.",
	},
	langSwitch: { label: "EN", href: "/en", ariaLabel: "Switch to English" },
};

const en: typeof hr = {
	meta: {
		title: "MPT — the buyer pays from the bank, the money goes straight to the merchant",
		description:
			"MPT (Mint Pay Transfer), a product by ITalk d.o.o., orchestrates payments on merchants' Monerium accounts — like RevenueCat, but for SEPA → EURe. The buyer pays from the bank with €0 in fees, the money reaches the merchant in ~12 s, and MPT never holds it. In production at pay.domovina.ai.",
	},
	nav: {
		how: "How it works",
		flow: "Money flow",
		sim: "Simulations",
		why: "Why now",
		status: "Status",
		contact: "Contact",
	},
	hero: {
		eyebrow: "Mint Pay Transfer · a product by ITalk d.o.o.",
		title: "The buyer pays from the bank.",
		titleAccent: "The money goes straight to the merchant.",
		subtitle:
			"MPT is an orchestrator for merchants' Monerium accounts — what RevenueCat is for in-app subscriptions, MPT is for SEPA payments in EURe. Every merchant has its own IBAN and Safe; MPT runs the checkout, references, routing, webhooks and live status, and never holds the money. The buyer pays €0 in fees.",
		ctaPrimary: "How MPT works",
		ctaSecondary: "Get in touch",
		cardLabel: "Measured in production · October 2026",
		cardTotal: "~12 s",
		cardTotalNote: "from the bank payment to “paid” at the merchant",
		cardRows: [
			{ label: "Buyer sees “received”", value: "~5 s" },
			{ label: "Buyer's fee", value: "€0.00" },
			{ label: "Who holds the money", value: "the merchant" },
		],
	},
	how: {
		title: "An orchestrator, not an intermediary",
		subtitle:
			"RevenueCat never receives money from the App Store — it runs the subscription business logic for thousands of apps. In the same way, MPT never receives buyers' money: it runs the payment business logic for many Monerium accounts, each of which belongs to a merchant.",
		compareHead: { aspect: "", rc: "RevenueCat (in-app subscriptions)", mpt: "MPT (SEPA → EURe)" },
		compareRows: [
			{
				aspect: "Who charges and issues the money",
				rc: "App Store / Google Play",
				mpt: "Monerium — a licensed e-money issuer, on the merchant's account",
			},
			{ aspect: "Who holds the money", rc: "the developer", mpt: "the merchant — its own IBAN and Safe" },
			{
				aspect: "What the orchestrator does",
				rc: "subscription status, entitlements, webhooks",
				mpt: "checkout intents, references, routing, webhooks, live status",
			},
			{ aspect: "Integration", rc: "one SDK for both stores", mpt: "one API for every Monerium account (tenant)" },
		],
		cards: [
			{
				title: "An own Monerium account per merchant",
				text: "Every tenant has its own KYB, IBAN, Safe (a 2/3 multisig) and list of approved addresses. Money that lands on merchant X's IBAN can only end up at merchant X's addresses — enforced in code and onchain (Zodiac Roles).",
			},
			{
				title: "One integration, the same business logic",
				text: "A checkout intent with an EPC QR code, states pending → received → paid → expired, live status over SSE, and webhooks (received · paid · rejected · late) with a durable outbox that retries delivery for up to ~47 h.",
			},
			{
				title: "Built for real-world payments",
				text: "A payment without a reference is matched to an intent by amount and time, an underpayment never becomes “paid”, and every forward that fails ends up as an alert — never silently. The same intent cannot be paid twice.",
			},
			{
				title: "Open source — run your own MPT",
				text: "The whole rail is on GitHub under the MIT license. Anyone can run their own instance; those who'd rather not operate infrastructure use the hosted MPT — just as most apps use RevenueCat instead of building their own subscription backend.",
			},
		],
		codeLink: { label: "github.com/domovinatv/pay.domovina.ai", href: "https://github.com/domovinatv/pay.domovina.ai" },
	},
	flow: {
		title: "The documented money flow",
		subtitle:
			"Every step, every account and every transition — who does what, how long it takes and who pays each fee. The buyer pays €0 at every step.",
		steps: [
			{
				num: "01",
				title: "The buyer pays from their own bank — €0",
				text: "Using a Croatian bank debit card (PBZ, ZABA, OTP, Erste, HPB…) via Apple Pay or Google Pay, the buyer tops up Revolut (min. €10, a Revolut product limit), then scans the EPC QR at checkout and sends a SEPA Instant (min. €1). Revolut pays both the card and the SEPA transaction. The reference says who the money is for: mpt:0x<merchant>?sid=<intent>.",
			},
			{
				num: "02",
				title: "Payment to the merchant's IBAN, “received” right away — €0",
				text: "The payment lands on the merchant's Monerium IBAN (its own KYB; the first tenant in production is ITalk d.o.o.). Monerium creates an issue order (placed → pending → processed), and on the very first webhook MPT links the payment to the intent and the checkout shows “received” over SSE — in production ~5 s after the buyer pressed “Send”.",
			},
			{
				num: "03",
				title: "EURe mint and forward to the merchant — €0",
				text: "Monerium mints EURe 1:1 to the merchant's Safe (a 2/3 multisig) on Gnosis Chain — a median 9 s after the payment. The MPT backend (Cloudflare Workers) forwards through the Zodiac Roles module (the role may only call EURe.transfer) to the address in the reference — fail-closed, to that merchant's approved addresses only; MPT's router pays the gas. The intent flips to “paid” on onchain confirmation, ~12 s after the payment, and the merchant gets a webhook.",
			},
			{
				num: "04",
				title: "If the reference gets lost — the money still arrives",
				text: "Revolut iOS sometimes drops the reference from the QR code. The resolver then links the payment to an open intent of the same merchant by exact amount and time: if the candidate is unambiguous, the forward runs automatically; otherwise the money stays parked in the merchant's Safe until an operator reroutes it by hand. A payment smaller than the intent never becomes “paid”.",
			},
		],
		notes: [
			{
				title: "The same rail, other directions too",
				text: "The same rail also funds a user's own wallet (on-ramp), from which they pay a checkout or make P2P transfers with sponsored gas. The off-ramp goes through an own Monerium account and a free SEPA Instant back to the bank — the circle closes where it started. It's all in the simulations below.",
			},
			{
				title: "Alternative branch: Gnosis Pay VISA (in preparation)",
				text: "Gnosis Pay deploys the user's own GP Safe (Delay + Roles modules) and issues a free virtual VISA card — with mandatory Sumsub KYC. Funding the card is a plain EURe transfer from the user's address, and Apple Pay / Google Pay work in Croatia. The GP VISA can top Revolut back up for free. The integration is in pre-pilot preparation.",
			},
		],
		liveNote: "Checkout intents and the rail run in production; the code is open:",
		liveLinks: [
			{ label: "pay.domovina.ai", href: "https://pay.domovina.ai" },
			{ label: "donate.domovina.ai", href: "https://donate.domovina.ai" },
			{ label: "GitHub", href: "https://github.com/domovinatv/pay.domovina.ai" },
		],
	},
	status: {
		title: "What works today, and what's in preparation",
		subtitle:
			"No embellishment: “in production” means measured on real payments. Everything else is clearly labelled.",
		live: {
			title: "In production",
			items: [
				"Checkout intents with an EPC QR code — up to €10,000 per intent, valid 15 min to 24 h",
				"“Received” right away and live status over SSE (since 5 Oct 2026)",
				"Merchant webhooks (received · paid · rejected · late) with a durable outbox",
				"Payments without a reference: automatic matching to an intent (since 8 Oct 2026)",
				"Payouts only to the tenant's approved addresses — fail-closed (since 1 Aug 2026)",
				"Safe monitoring: an alert for every outflow that isn't an MPT forward",
				"Independent code reviews — all 17 critical and high findings of the second round fixed on 10 Oct 2026; CI on every PR",
			],
		},
		prep: {
			title: "In preparation",
			items: [
				"Further tenants with their own Monerium account — the code is in production and switches on with the first merchant to complete KYB",
				"Shopify: MPT as a payment method with a QR code — code merged, the first test on a real store is upcoming",
				"WooCommerce — planned",
				"Gnosis Pay VISA branch — pre-pilot",
				"Signing forwards outside the cloud (an M-of-N device quorum) — proposal",
			],
		},
		limits: {
			title: "Known limitations",
			items: [
				"Monerium holds the first payment from a new IBAN for manual review — from a few minutes to several hours. Later payments from the same IBAN clear in seconds.",
				"Revolut iOS sometimes drops the reference from the QR code — the resolver covers this when the candidate is unambiguous; otherwise an operator reroutes the payment by hand.",
				"A SEPA recall after the EURe has already been forwarded is not automated.",
			],
		},
	},
	why: {
		title: "Why this makes sense today",
		subtitle:
			"Every retail card payment and every SEPA order from a classic Croatian bank carries an intermediary fee. MPT shows that a local economy can have a sovereign payment system: money travels directly from payer to payee — without the percentage flowing to card schemes and processors, without the fixed bank order fee — and every transfer leaves a public, verifiable trace.",
		tableHead: {
			channel: "Channel",
			fee: "Fee per transaction",
			at1: "On €1",
			at2: "On €2",
			at5: "On €5",
			at100: "On €100",
		},
		channels: [
			{
				name: "MPT rail (EURe, Gnosis)",
				fee: "€0 for the buyer (gas ~€0.001, sponsored)",
				at1: "€0.00 · 0%",
				at2: "€0.00 · 0%",
				at5: "€0.00 · 0%",
				at100: "€0.00 · 0%",
				tone: "win" as const,
			},
			{
				name: "Card (Stripe EEA)",
				fee: "1.5% + €0.25",
				at1: "€0.27 · 26.5%",
				at2: "€0.28 · 14%",
				at5: "€0.33 · 6.5%",
				at100: "€1.75 · 1.75%",
				tone: "leak" as const,
			},
			{
				name: "SEPA order (Croatian banks)",
				fee: "€0.25–0.45 fixed — paid by the sender",
				at1: "up to €0.45 · up to 45%",
				at2: "up to €0.45 · up to 22.5%",
				at5: "up to €0.45 · up to 9%",
				at100: "up to €0.45 · 0.45%",
				tone: "warn" as const,
			},
		],
		points: [
			{
				title: "Fixed fees kill micropayments",
				text: "On a €2 payment the card fee is 14%, and the fixed bank order up to 22.5%. Small, frequent payments — exactly what local retail lives on — are the most expensive today. Only a transfer with no fixed component on either side makes micropayments viable.",
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
		note: "Card: 1.5% + €0.25 per transaction (Stripe EEA). SEPA: fixed order €0.25–0.45 per transaction (Croatian banks, paid by the sender). Month = 30 days, year = 365.",
	},
	sim: {
		title: "Step-by-step simulations",
		subtitle:
			"The entire flow is modeled as a state machine with every node, transition and guard limit. Pick a scenario — from a buyer paying a merchant from the bank to a payment without a reference — and follow the money step by step — the diagram shows where the money is, the log shows who did what and who paid.",
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
			todayAmount: "Transaction amount",
			todayCard: "Card (1.5% + €0.25)",
			todaySepa: "Croatian bank SEPA order",
			todayUpTo: "up to",
		},
		testsNote:
			"The same state machine also powers automated tests: every scenario proves the user pays €0 and amounts are conserved 1:1 at every step.",
	},
	cta: {
		title: "Want to accept payments through MPT?",
		subtitle:
			"Shops, associations, parishes and projects — each with its own Monerium account, while MPT runs the rest. Or run your own MPT: the code is open. The conversation happens in the open in our Telegram group, where you can reach us directly too.",
		button: { label: "Join us: t.me/mpt_hr", href: "https://t.me/mpt_hr" },
		secondary: { label: "or by email: ms@mpt.hr", href: "mailto:ms@mpt.hr" },
	},
	footer: {
		columns: [
			{
				title: "Product",
				links: [
					{ label: "How it works", href: "#how" },
					{ label: "Money flow", href: "#flow" },
					{ label: "Simulations", href: "#sim" },
					{ label: "Why now", href: "#why" },
					{ label: "Status", href: "#status" },
					{ label: "Contact", href: "#contact" },
				],
			},
			{
				title: "Production & code",
				links: [
					{ label: "pay.domovina.ai", href: "https://pay.domovina.ai" },
					{ label: "donate.domovina.ai", href: "https://donate.domovina.ai" },
					{ label: "GitHub (MIT)", href: "https://github.com/domovinatv/pay.domovina.ai" },
				],
			},
			{
				title: "Company",
				links: [
					{ label: "airkuna.com", href: "https://airkuna.com" },
					{ label: "ITalk d.o.o.", href: "https://italk.hr" },
				],
			},
		],
		note: "Note: the MPT rail and checkout intents run in production (pay.domovina.ai) with the first tenant, ITalk d.o.o.; onboarding further tenants, Shopify and the Gnosis Pay branch are honestly labelled as in preparation. MPT is not a licensed payment service — ITalk is a non-custodial software provider that neither receives nor holds buyers' money, and regulated functions (e-money issuance, KYC/KYB) are performed by a licensed issuer (Monerium, EMI / MiCA EMT). This page is not investment or legal advice.",
		imprintLead: "MPT (Mint Pay Transfer)",
		imprint:
			"is a product of ITalk d.o.o. za informacijske tehnologije · IX. Južna obala 20, 10000 Zagreb, Croatia · OIB: 54872935051 · MBS: 081042440 · EUID: HRSR.081042440 · Commercial Court in Zagreb · director: Matija Stepanić",
		imprintLinks: [
			{ label: "t.me/mpt_hr", href: "https://t.me/mpt_hr" },
			{ label: "ms@mpt.hr", href: "mailto:ms@mpt.hr" },
			{ label: "italk.hr", href: "https://italk.hr" },
		],
		copyright: "MPT / ITalk d.o.o.",
	},
	langSwitch: { label: "HR", href: "/hr", ariaLabel: "Prebaci na hrvatski" },
};

export type Dictionary = typeof hr;

const dictionaries: Record<Locale, Dictionary> = { hr, en };

export function getDictionary(locale: Locale): Dictionary {
	return dictionaries[locale];
}
