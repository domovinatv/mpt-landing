import type { Locale } from "./config";

/**
 * All page copy, hr + en. Internal hrefs are locale-less ("/pricing", "/#how")
 * and get the locale prefix in the components.
 *
 * MPT pricing numbers (2.500 € / 1%) mirror src/lib/mpt-pricing.ts;
 * market fee numbers mirror src/lib/market-fees.ts.
 */
const hr = {
	pages: {
		home: {
			title: "MPT — kupac plaća iz banke, novac stiže izravno trgovcu",
			description:
				"MPT (Mint Pay Transfer), proizvod tvrtke ITalk d.o.o., orkestrira plaćanja na Monerium računima trgovaca — kao RevenueCat, ali za SEPA → EURe. Novac stiže izravno trgovcu za ~12 s i MPT ga nikad ne drži. Kupac MPT-u ne plaća ništa.",
		},
		flow: {
			title: "Tok novca i simulacije — MPT",
			description:
				"Svaki korak MPT plaćanja: od SEPA uplate kupca do EURe forwarda na adresu trgovca, s izmjerenim vremenima, naknadama i interaktivnim simulacijama.",
		},
		pricing: {
			title: "Cijene — MPT",
			description:
				"Kao RevenueCat: hostani MPT je besplatan do 2.500 € mjesečnog prometa, zatim 1%. Bez fiksne naknade po transakciji. Vlastiti MPT je besplatan (MIT). Kupac ne plaća ništa.",
		},
		why: {
			title: "Zašto danas — MPT",
			description:
				"Fiksne naknade kartica i bankovnih naloga čine mikrouplate najskupljima. Usporedba naknada po kanalu i zašto rail bez fiksnog dijela ima smisla za lokalnu ekonomiju.",
		},
	},
	nav: {
		how: "Kako radi",
		flow: "Tok novca",
		pricing: "Cijene",
		why: "Zašto danas",
		status: "Stanje",
		cta: "Zatraži integraciju",
	},
	request: {
		label: "Zatraži integraciju",
		email: "ms@mpt.hr",
		subject: "MPT integracija",
		body: "Bok,\n\nzanima nas MPT.\n\nOrganizacija:\nWeb / platforma (Shopify, WooCommerce, vlastiti checkout…):\nOčekivani mjesečni promet:\nImamo li već Monerium račun (da / ne):\n\nHvala!",
	},
	hero: {
		eyebrow: "Mint Pay Transfer · proizvod tvrtke ITalk d.o.o.",
		title: "Kupac plaća iz banke.",
		titleAccent: "Novac stiže izravno trgovcu.",
		subtitle:
			"MPT je ono što je RevenueCat za pretplate u aplikacijama — samo za SEPA plaćanja u EURe. Svaki trgovac ima vlastiti Monerium IBAN i Safe; MPT vodi checkout, reference, routing, webhookove i status uživo, a novac nikad ne drži.",
		ctaPrimary: "Zatraži integraciju",
		ctaSecondary: "Pogledaj tok novca",
		cardLabel: "Izmjereno u produkciji · listopad 2026.",
		cardTotal: "~12 s",
		cardTotalNote: "od uplate u banci do statusa „paid“ kod trgovca",
		cardRows: [
			{ label: "Kupac vidi „zaprimljeno“", value: "~5 s" },
			{ label: "Naknada kupca (SEPA Instant iz Revoluta)", value: "0,00 €" },
			{ label: "Tko drži novac", value: "trgovac" },
		],
		cardFootnote: "Prvi tenant u produkciji: ITalk d.o.o. Drugi trgovci uključuju se nakon KYB-a.",
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
			{ aspect: "Cijena", rc: "besplatno do 2.500 $ mjesečno, zatim 1%", mpt: "besplatno do 2.500 € mjesečno, zatim 1%" },
		],
		cards: [
			{
				title: "Vlastiti Monerium račun po trgovcu",
				text: "Svaki tenant ima vlastiti KYB, IBAN, Safe (2/3 multisig) i listu odobrenih adresa. Novac koji je sletio na IBAN trgovca X može završiti samo na adresama trgovca X — to se provodi u kodu i onchain (Zodiac Roles).",
			},
			{
				title: "Jedna integracija, ista poslovna logika",
				text: "Checkout intent s EPC QR kodom, stanja pending → zaprimljeno → paid → expired, status uživo preko SSE-a i potpisani webhookovi s trajnim outboxom koji ponavlja isporuku do ~47 h.",
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
	},
	integrate: {
		title: "Integracija u tri koraka",
		subtitle:
			"Tvoj backend kreira intent, kupac plati iz banke, a ti dobiješ webhook kad je novac na tvojoj adresi. Javna dokumentacija API-ja je u izradi — dotad integraciju radimo zajedno.",
		steps: [
			{
				num: "01",
				title: "Kreiraj intent",
				text: "Pošalji iznos i jednu od svojih odobrenih adresa. Dobiješ referencu, EPC QR, checkout stranicu i URL za status uživo.",
			},
			{
				num: "02",
				title: "Kupac plati iz banke",
				text: "Kupac skenira QR i pošalje SEPA uplatu. Checkout preko SSE-a pokaže „zaprimljeno“ već nakon ~5 s.",
			},
			{
				num: "03",
				title: "Primi webhook",
				text: "intent.paid stiže kad je forward potvrđen onchain, ~12 s od uplate. Postoje i payment.received, payment.underpaid, payment.rejected i payment.late.",
			},
		],
		requestTitle: "Zahtjev",
		webhookTitle: "Webhook",
		orderLabel: "Narudžba #1042",
		note: "Primjer je skraćen; adrese i ključevi su ilustrativni.",
		cta: "Javi se za integraciju i consulting",
	},
	audiences: {
		title: "Za koga je MPT",
		subtitle: "Svatko tko prima uplate u eurima i želi ih primati bez kartične provizije — na vlastiti račun.",
		items: [
			{
				title: "Web trgovine",
				text: "Checkout s EPC QR kodom preko API-ja ili kao način plaćanja u trgovini. Shopify je spojen i čeka prvi test na stvarnoj trgovini; WooCommerce je u planu.",
			},
			{
				title: "Udruge, župe i projekti",
				text: "Donacije bez naknade za darovatelja i trajni QR za kampanje — jedan QR, mnogo uplata, svaka zasebno prijavljena. Kao na donate.domovina.ai.",
			},
			{
				title: "Developeri i fintech timovi",
				text: "Otvoreni kod (MIT): pokreni vlastiti MPT ili nas angažiraj za integraciju, postavljanje i consulting.",
			},
		],
	},
	pricingTeaser: {
		title: "Cijene kao RevenueCat: plaćaš tek kad rasteš",
		text: "Kupac MPT-u ne plaća ništa. Trgovac 0 € do 2.500 € mjesečnog prometa, zatim 1% — bez fiksne naknade po transakciji. Vlastiti MPT je besplatan.",
		link: "Pogledaj cijene",
	},
	trust: {
		title: "Što MPT jest, a što nije",
		subtitle: "Bez sitnih slova: tko što radi i tko odgovara za novac.",
		items: [
			{
				title: "Softver, ne platna institucija",
				text: "ITalk d.o.o. je non-custodial pružatelj softvera. MPT ne prima ni ne drži novac kupaca i nije licencirana platna usluga.",
			},
			{
				title: "Regulirano radi Monerium",
				text: "Izdavanje e-novca (EURe, EMI / MiCA EMT), IBAN i KYC/KYB trgovca obavlja licencirani izdavatelj Monerium, na ugovoru s trgovcem.",
			},
			{
				title: "Novac je trgovčev",
				text: "IBAN i Safe pripadaju trgovcu. MPT smije samo proslijediti EURe na adrese koje je trgovac odobrio — onchain ograničeno Zodiac Rolesom.",
			},
			{
				title: "Provjerljivo",
				text: "Kod je otvoren (MIT), svaki forward je javno vidljiv onchain, a stanje sustava objavljujemo bez uljepšavanja — ispod.",
			},
		],
	},
	flow: {
		title: "Dokumentirani tok novca",
		subtitle:
			"Svaki korak, svaki račun i svaki prijelaz — tko što radi, koliko traje i tko plaća koju naknadu.",
		steps: [
			{
				num: "01",
				title: "Kupac plaća iz svoje banke",
				text: "Najjeftiniji put: debitnom karticom hrvatske banke (PBZ, ZABA, OTP, Erste, HPB…) preko Apple Paya ili Google Paya kupac napuni Revolut (min. 10 €, Revolutov produktni limit), pa na checkoutu skenira EPC QR i pošalje SEPA Instant (min. 1 €) — kartičnu i SEPA transakciju plaća Revolut, kupac 0 €. Uplata izravno iz klasične hrvatske banke također radi, ali tada kupac plaća naknadu svoje banke za nalog. U referenci piše kome novac ide: mpt:0x<trgovac>?sid=<intent>.",
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
				text: "Kad referenca izostane (Revolut iOS je ponekad ispusti iz QR koda), resolver uplatu poveže s otvorenim intentom istog trgovca po točnom iznosu i vremenu: ako je kandidat jednoznačan, forward ide automatski; inače novac ostaje parkiran na Safeu trgovca dok ga operater ručno ne preusmjeri. Manja uplata od iznosa intenta nikad ne postaje „paid“.",
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
				"Checkout intenti s EPC QR kodom — do 10.000 € po intentu, valjanost zadano 15 min, najviše 24 h",
				"„Zaprimljeno“ odmah i status uživo preko SSE-a (od 5. 10. 2026.)",
				"Potpisani webhookovi za trgovce (received · paid · underpaid · rejected · late) s trajnim outboxom",
				"Uplate bez reference: automatsko povezivanje s intentom (od 8. 10. 2026.)",
				"Isplata samo na odobrene adrese tenanta — fail-closed (od 1. 8. 2026.)",
				"Nadzor Safea: alarm za svaki izlaz koji nije MPT-ov forward",
				"Nezavisni code reviewi s riješenim nalazima i CI na svakom PR-u",
			],
		},
		prep: {
			title: "U pripremi",
			items: [
				"Drugi tenanti s vlastitim Monerium računom — kod je u produkciji, uključuje se s prvim trgovcem koji završi KYB",
				"Shopify: MPT kao način plaćanja s QR kodom — kod spojen, prvi test na stvarnoj trgovini predstoji",
				"WooCommerce — plan",
				"Javna dokumentacija API-ja",
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
	pricing: {
		eyebrow: "Cijene",
		title: "Plaćaš tek kad rasteš",
		subtitle:
			"Isti model kao RevenueCat: besplatno do praga, zatim mali postotak prometa koji MPT orkestrira. Bez fiksne naknade po transakciji — zato se isplate i mikrouplate. Kupac MPT-u nikad ne plaća ništa.",
		plans: [
			{
				name: "Hostani MPT",
				price: "0 €",
				priceNote: "do 2.500 € mjesečnog prometa, zatim 1%",
				features: [
					"Sve funkcije: checkout intenti, EPC QR, status uživo, webhookovi",
					"Uplate bez reference — automatsko povezivanje s intentom",
					"Gas za forward plaća MPT",
					"Vlastiti Monerium IBAN i Safe — novac je uvijek tvoj",
				],
				cta: "Zatraži integraciju",
				kind: "request" as const,
				featured: true,
			},
			{
				name: "Enterprise",
				price: "Po dogovoru",
				priceNote: "za veći promet i posebne zahtjeve",
				features: [
					"Volumni popusti",
					"Integracija i consulting",
					"Prilagođeni limiti i SLA po dogovoru",
					"Izravna podrška",
				],
				cta: "Razgovarajmo",
				kind: "request" as const,
				featured: false,
			},
			{
				name: "Vlastiti MPT",
				price: "0 €",
				priceNote: "otvoreni kod, MIT licenca",
				features: [
					"Cijeli rail na GitHubu",
					"Sam vodiš infrastrukturu, Monerium račun i Safe",
					"Bez naknade ITalku",
					"Consulting za postavljanje na upit",
				],
				cta: "Kod na GitHubu",
				kind: "github" as const,
				featured: false,
			},
		],
		note: "Cjenik vrijedi za vanjske tenante hostanog MPT-a; prvi se uključuju nakon što završe KYB kod Moneriuma. Moneriumove naknade, ako ih predviđa tvoj ugovor s Moneriumom, nisu dio MPT cijene. Cijene su bez PDV-a.",
		faqTitle: "Česta pitanja",
		faq: [
			{
				q: "Što se računa kao promet?",
				a: "Zbroj uplata koje su u kalendarskom mjesecu kod tebe dobile status „paid“, uključujući one povezane bez reference. Uplate koje nisu stigle do tebe ne ulaze u promet.",
			},
			{
				q: "Plaća li kupac išta?",
				a: "MPT-u ne. Preko Revoluta su i kartični top-up i SEPA Instant besplatni; iz klasične hrvatske banke kupac plaća naknadu svoje banke za nalog (0,25–0,45 €).",
			},
			{
				q: "Uzima li MPT postotak iz same uplate?",
				a: "Ne. Puni iznos stiže na tvoju adresu; naknada se obračunava zasebno, mjesečno, prema ugovoru.",
			},
			{
				q: "Što ako jedan mjesec prijeđem 2.500 €, a sljedeći ne?",
				a: "Prag se gleda za svaki mjesec posebno: mjesec s prometom do 2.500 € je besplatan.",
			},
			{
				q: "Zašto postotak, a ne fiksna naknada po transakciji?",
				a: "Fiksni dio ubija mikrouplate — na 2 € kartica uzme 14%. Postotak bez fiksnog dijela znači da je uplata od 1 € jednako isplativa kao uplata od 1.000 €.",
			},
			{
				q: "Mogu li kasnije prijeći na vlastiti MPT?",
				a: "Da. IBAN i Safe su tvoji od prvog dana; vlastita instanca samo preuzima orkestraciju.",
			},
		],
	},
	why: {
		title: "Zašto ovo danas ima smisla",
		subtitle:
			"Svako kartično plaćanje u maloprodaji i svaki SEPA nalog iz klasične hrvatske banke nosi naknadu posrednika s fiksnim dijelom. MPT pokazuje da lokalna ekonomija može imati vlastiti platni rail: novac putuje izravno od platitelja do primatelja — bez postotka koji odlazi kartičnim shemama i procesorima, bez fiksnog bankovnog naloga — a svaki transfer ostavlja javni, provjerljivi trag.",
		tableHead: {
			channel: "Kanal",
			fee: "Tko plaća koliko",
			at1: "Na 1 €",
			at2: "Na 2 €",
			at5: "Na 5 €",
			at100: "Na 100 €",
		},
		channels: [
			{
				name: "MPT rail (EURe, Gnosis)",
				fee: "kupac 0 € · trgovac 0 € do 2.500 €/mj., zatim 1% · gas plaća MPT",
				at1: "0,00–0,01 € · 0–1%",
				at2: "0,00–0,02 € · 0–1%",
				at5: "0,00–0,05 € · 0–1%",
				at100: "0,00–1,00 € · 0–1%",
				tone: "win" as const,
			},
			{
				name: "Kartica (Stripe EEA)",
				fee: "1,5% + 0,25 € — plaća trgovac",
				at1: "0,27 € · 26,5%",
				at2: "0,28 € · 14%",
				at5: "0,33 € · 6,5%",
				at100: "1,75 € · 1,75%",
				tone: "leak" as const,
			},
			{
				name: "SEPA nalog (HR banke)",
				fee: "0,25–0,45 € fiksno — plaća kupac",
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
				text: "Na uplati od 2 € kartična naknada iznosi 14%, a fiksni bankovni nalog i do 22,5%. Male, česte uplate — upravo one od kojih živi lokalna maloprodaja — danas su najskuplje. Tek naknada bez fiksnog dijela čini mikrouplate isplativima.",
			},
			{
				title: "Novac ostaje u lokalnoj ekonomiji",
				text: "Postotak svake kartične transakcije odlazi shemama i procesorima izvan lokalnog kruga. Na MPT railu puni iznos stiže primatelju, a orkestracija se obračunava zasebno i manja je od kartične provizije na svakom iznosu.",
			},
			{
				title: "Rail kojim raspolažu sami",
				text: "Rail počiva na reguliranom e-novcu (EURe, licencirani izdavatelj Monerium) na računu i Safeu samog primatelja. Između platitelja i primatelja nema kartičnih shema ni procesora, a kod je otvoren — tko želi, vodi vlastiti MPT.",
			},
			{
				title: "Javni, provjerljivi trag",
				text: "Za razliku od gotovine i kartičnih obračuna, svaki transfer javno je vidljiv i auditabilan onchain — transparentnost za kupca, trgovca i zajednicu.",
			},
		],
		sourceNote:
			"Stope: Stripe EEA cjenik za domaće kartice (srpanj 2026.) i tipični fiksni SEPA nalozi klasičnih hrvatskih banaka (ZABA, PBZ, Erste, OTP, HPB). Izvor i metodologija:",
		sourceLink: {
			label: "lom.ff.hr/dokumenti/isplativost",
			href: "https://lom.ff.hr/dokumenti/isplativost",
		},
		calcLink: "Izračunaj za svoju trgovinu u kalkulatoru na stranici s cijenama",
	},
	savings: {
		title: "Kalkulator: koliko danas odlazi posrednicima",
		subtitle: "Ilustrativni izračun za jednog trgovca — kartična provizija, bankovni nalozi kupaca i MPT po cjeniku.",
		txPerDay: "Transakcija dnevno",
		avgAmount: "Prosječni iznos (€)",
		perTx: "Naknada po transakciji",
		daily: "Dnevno",
		monthly: "Mjesečno",
		yearly: "Godišnje",
		vsCard: "Kartica",
		vsSepa: "SEPA nalog",
		mpt: "MPT",
		note: "Kartica: 1,5% + 0,25 € po transakciji, plaća trgovac (Stripe EEA). SEPA: fiksni nalog 0,25–0,45 € po transakciji, plaća kupac (HR banke). MPT: 0 € do 2.500 € mjesečnog prometa, zatim 1%, plaća trgovac. Mjesec = 30 dana, godina = 365.",
	},
	sim: {
		title: "Simulacije korak po korak",
		subtitle:
			"Cijeli tok modeliran je kao state machine sa svim čvorovima, prijelazima i zaštitnim limitima. Odaberi scenarij — od plaćanja trgovcu iz banke do uplate bez reference — i prati novac korak po korak: dijagram pokazuje gdje je novac, dnevnik tko je što napravio i tko je platio.",
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
			"Opiši nam svoju trgovinu, udrugu ili projekt i javimo se s prijedlogom integracije. Ako želiš vlastiti MPT, pomažemo i s postavljanjem.",
		community: { label: "Pitanja i zajednica: t.me/mpt_hr", href: "https://t.me/mpt_hr" },
		github: { label: "Kod na GitHubu", href: "https://github.com/domovinatv/pay.domovina.ai" },
	},
	footer: {
		columns: [
			{
				title: "Proizvod",
				links: [
					{ label: "Kako radi", href: "/#how" },
					{ label: "Integracija", href: "/#integrate" },
					{ label: "Cijene", href: "/pricing" },
					{ label: "Tok novca i simulacije", href: "/flow" },
					{ label: "Zašto danas", href: "/why" },
					{ label: "Stanje", href: "/#status" },
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
				title: "Kontakt",
				links: [
					{ label: "ms@mpt.hr", href: "mailto:ms@mpt.hr" },
					{ label: "t.me/mpt_hr", href: "https://t.me/mpt_hr" },
					{ label: "ITalk d.o.o.", href: "https://italk.hr" },
					{ label: "airkuna.com", href: "https://airkuna.com" },
				],
			},
		],
		note: "Napomena: MPT rail i checkout intenti rade u produkciji (pay.domovina.ai) s prvim tenantom, ITalk d.o.o.; uključivanje drugih tenanata, Shopify i Gnosis Pay grana iskreno su označeni kao u pripremi. MPT nije licencirana platna usluga — ITalk je non-custodial software provider koji ne prima ni ne drži novac kupaca, a regulirane funkcije (izdavanje e-novca, KYC/KYB) obavlja licencirani izdavatelj (Monerium, EMI / MiCA EMT). Ova stranica nije investicijski ni pravni savjet.",
		imprintLead: "MPT (Mint Pay Transfer)",
		imprint:
			"je proizvod tvrtke ITalk d.o.o. za informacijske tehnologije · IX. Južna obala 20, 10000 Zagreb, Hrvatska · OIB: 54872935051 · MBS: 081042440 · EUID: HRSR.081042440 · Trgovački sud u Zagrebu · direktor: Matija Stepanić",
		copyright: "MPT / ITalk d.o.o.",
	},
	langSwitch: { label: "EN", target: "en" as Locale, ariaLabel: "Switch to English" },
};

const en: typeof hr = {
	pages: {
		home: {
			title: "MPT — the buyer pays from the bank, the money goes straight to the merchant",
			description:
				"MPT (Mint Pay Transfer), a product by ITalk d.o.o., orchestrates payments on merchants' Monerium accounts — like RevenueCat, but for SEPA → EURe. The money reaches the merchant in ~12 s and MPT never holds it. The buyer pays MPT nothing.",
		},
		flow: {
			title: "Money flow and simulations — MPT",
			description:
				"Every step of an MPT payment: from the buyer's SEPA transfer to the EURe forward to the merchant's address, with measured timings, fees and interactive simulations.",
		},
		pricing: {
			title: "Pricing — MPT",
			description:
				"Like RevenueCat: hosted MPT is free up to €2,500 in monthly volume, then 1%. No fixed fee per transaction. Self-hosted MPT is free (MIT). The buyer pays nothing.",
		},
		why: {
			title: "Why now — MPT",
			description:
				"Fixed card and bank-order fees make micropayments the most expensive ones. A fee comparison per channel and why a rail with no fixed component makes sense for a local economy.",
		},
	},
	nav: {
		how: "How it works",
		flow: "Money flow",
		pricing: "Pricing",
		why: "Why now",
		status: "Status",
		cta: "Request integration",
	},
	request: {
		label: "Request integration",
		email: "ms@mpt.hr",
		subject: "MPT integration",
		body: "Hi,\n\nwe're interested in MPT.\n\nOrganisation:\nWebsite / platform (Shopify, WooCommerce, custom checkout…):\nExpected monthly volume:\nDo we already have a Monerium account (yes / no):\n\nThanks!",
	},
	hero: {
		eyebrow: "Mint Pay Transfer · a product by ITalk d.o.o.",
		title: "The buyer pays from the bank.",
		titleAccent: "The money goes straight to the merchant.",
		subtitle:
			"MPT is what RevenueCat is for in-app subscriptions — only for SEPA payments in EURe. Every merchant has its own Monerium IBAN and Safe; MPT runs the checkout, references, routing, webhooks and live status, and never holds the money.",
		ctaPrimary: "Request integration",
		ctaSecondary: "See the money flow",
		cardLabel: "Measured in production · October 2026",
		cardTotal: "~12 s",
		cardTotalNote: "from the bank payment to “paid” at the merchant",
		cardRows: [
			{ label: "Buyer sees “received”", value: "~5 s" },
			{ label: "Buyer's fee (SEPA Instant from Revolut)", value: "€0.00" },
			{ label: "Who holds the money", value: "the merchant" },
		],
		cardFootnote: "First tenant in production: ITalk d.o.o. Further merchants switch on after KYB.",
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
			{ aspect: "Price", rc: "free up to $2,500 a month, then 1%", mpt: "free up to €2,500 a month, then 1%" },
		],
		cards: [
			{
				title: "An own Monerium account per merchant",
				text: "Every tenant has its own KYB, IBAN, Safe (a 2/3 multisig) and list of approved addresses. Money that lands on merchant X's IBAN can only end up at merchant X's addresses — enforced in code and onchain (Zodiac Roles).",
			},
			{
				title: "One integration, the same business logic",
				text: "A checkout intent with an EPC QR code, states pending → received → paid → expired, live status over SSE, and signed webhooks with a durable outbox that retries delivery for up to ~47 h.",
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
	},
	integrate: {
		title: "Integration in three steps",
		subtitle:
			"Your backend creates an intent, the buyer pays from the bank, and you get a webhook once the money is at your address. Public API docs are in the works — until then we do the integration together.",
		steps: [
			{
				num: "01",
				title: "Create an intent",
				text: "Send the amount and one of your approved addresses. You get a reference, an EPC QR, a checkout page and a live-status URL.",
			},
			{
				num: "02",
				title: "The buyer pays from the bank",
				text: "The buyer scans the QR and sends a SEPA transfer. The checkout shows “received” over SSE after ~5 s.",
			},
			{
				num: "03",
				title: "Receive the webhook",
				text: "intent.paid arrives once the forward is confirmed onchain, ~12 s after the payment. There are also payment.received, payment.underpaid, payment.rejected and payment.late.",
			},
		],
		requestTitle: "Request",
		webhookTitle: "Webhook",
		orderLabel: "Order #1042",
		note: "The example is shortened; addresses and keys are illustrative.",
		cta: "Get in touch for integration and consulting",
	},
	audiences: {
		title: "Who MPT is for",
		subtitle: "Anyone who takes payments in euros and wants them without card fees — straight to their own account.",
		items: [
			{
				title: "Online shops",
				text: "A checkout with an EPC QR code through the API or as a payment method in the shop. Shopify is merged and awaiting its first test on a real store; WooCommerce is planned.",
			},
			{
				title: "Associations, parishes and projects",
				text: "Donations with no fee for the donor and a permanent campaign QR — one QR, many payments, each reported separately. As on donate.domovina.ai.",
			},
			{
				title: "Developers and fintech teams",
				text: "Open source (MIT): run your own MPT, or hire us for integration, setup and consulting.",
			},
		],
	},
	pricingTeaser: {
		title: "Priced like RevenueCat: you pay only when you grow",
		text: "The buyer pays MPT nothing. The merchant pays €0 up to €2,500 in monthly volume, then 1% — no fixed fee per transaction. Self-hosted MPT is free.",
		link: "See pricing",
	},
	trust: {
		title: "What MPT is, and what it isn't",
		subtitle: "No fine print: who does what, and who is responsible for the money.",
		items: [
			{
				title: "Software, not a payment institution",
				text: "ITalk d.o.o. is a non-custodial software provider. MPT neither receives nor holds buyers' money and is not a licensed payment service.",
			},
			{
				title: "Monerium does the regulated part",
				text: "E-money issuance (EURe, EMI / MiCA EMT), the IBAN and the merchant's KYC/KYB are handled by the licensed issuer Monerium, under its contract with the merchant.",
			},
			{
				title: "The money is the merchant's",
				text: "The IBAN and Safe belong to the merchant. MPT may only forward EURe to addresses the merchant has approved — restricted onchain by Zodiac Roles.",
			},
			{
				title: "Verifiable",
				text: "The code is open (MIT), every forward is publicly visible onchain, and we publish the state of the system without embellishment — below.",
			},
		],
	},
	flow: {
		title: "The documented money flow",
		subtitle:
			"Every step, every account and every transition — who does what, how long it takes and who pays each fee.",
		steps: [
			{
				num: "01",
				title: "The buyer pays from their own bank",
				text: "The cheapest path: using a Croatian bank debit card (PBZ, ZABA, OTP, Erste, HPB…) via Apple Pay or Google Pay, the buyer tops up Revolut (min. €10, a Revolut product limit), then scans the EPC QR at checkout and sends a SEPA Instant (min. €1) — Revolut pays both the card and the SEPA transaction, the buyer pays €0. Paying straight from a classic Croatian bank works too, but then the buyer pays their bank's order fee. The reference says who the money is for: mpt:0x<merchant>?sid=<intent>.",
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
				text: "When the reference is missing (Revolut iOS sometimes drops it from the QR code), the resolver links the payment to an open intent of the same merchant by exact amount and time: if the candidate is unambiguous, the forward runs automatically; otherwise the money stays parked in the merchant's Safe until an operator reroutes it by hand. A payment smaller than the intent never becomes “paid”.",
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
				"Checkout intents with an EPC QR code — up to €10,000 per intent, valid 15 min by default, 24 h at most",
				"“Received” right away and live status over SSE (since 5 Oct 2026)",
				"Signed merchant webhooks (received · paid · underpaid · rejected · late) with a durable outbox",
				"Payments without a reference: automatic matching to an intent (since 8 Oct 2026)",
				"Payouts only to the tenant's approved addresses — fail-closed (since 1 Aug 2026)",
				"Safe monitoring: an alert for every outflow that isn't an MPT forward",
				"Independent code reviews with findings resolved, and CI on every PR",
			],
		},
		prep: {
			title: "In preparation",
			items: [
				"Further tenants with their own Monerium account — the code is in production and switches on with the first merchant to complete KYB",
				"Shopify: MPT as a payment method with a QR code — code merged, the first test on a real store is upcoming",
				"WooCommerce — planned",
				"Public API documentation",
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
	pricing: {
		eyebrow: "Pricing",
		title: "You pay only when you grow",
		subtitle:
			"The same model as RevenueCat: free up to a threshold, then a small percentage of the volume MPT orchestrates. No fixed fee per transaction — so micropayments pay off too. The buyer never pays MPT anything.",
		plans: [
			{
				name: "Hosted MPT",
				price: "€0",
				priceNote: "up to €2,500 in monthly volume, then 1%",
				features: [
					"Every feature: checkout intents, EPC QR, live status, webhooks",
					"Payments without a reference — automatic intent matching",
					"MPT pays the forward gas",
					"Your own Monerium IBAN and Safe — the money is always yours",
				],
				cta: "Request integration",
				kind: "request" as const,
				featured: true,
			},
			{
				name: "Enterprise",
				price: "Custom",
				priceNote: "for higher volume and special requirements",
				features: [
					"Volume discounts",
					"Integration and consulting",
					"Custom limits and SLA by agreement",
					"Direct support",
				],
				cta: "Let's talk",
				kind: "request" as const,
				featured: false,
			},
			{
				name: "Self-hosted MPT",
				price: "€0",
				priceNote: "open source, MIT license",
				features: [
					"The whole rail on GitHub",
					"You run the infrastructure, the Monerium account and the Safe",
					"No fee to ITalk",
					"Setup consulting on request",
				],
				cta: "Code on GitHub",
				kind: "github" as const,
				featured: false,
			},
		],
		note: "This pricing applies to external tenants of hosted MPT; the first ones switch on after completing KYB with Monerium. Monerium's own fees, if your contract with Monerium has any, are not part of the MPT price. Prices exclude VAT.",
		faqTitle: "Frequently asked questions",
		faq: [
			{
				q: "What counts as volume?",
				a: "The sum of payments that reached “paid” at your end within a calendar month, including those matched without a reference. Payments that never reached you don't count.",
			},
			{
				q: "Does the buyer pay anything?",
				a: "Not to MPT. Through Revolut both the card top-up and the SEPA Instant are free; from a classic Croatian bank the buyer pays their bank's order fee (€0.25–0.45).",
			},
			{
				q: "Does MPT take a cut out of the payment itself?",
				a: "No. The full amount reaches your address; the fee is billed separately, monthly, under the contract.",
			},
			{
				q: "What if I go over €2,500 one month and not the next?",
				a: "The threshold applies to each month separately: a month with up to €2,500 in volume is free.",
			},
			{
				q: "Why a percentage and not a fixed fee per transaction?",
				a: "A fixed component kills micropayments — on €2 a card takes 14%. A percentage with no fixed part makes a €1 payment as worthwhile as a €1,000 one.",
			},
			{
				q: "Can I move to a self-hosted MPT later?",
				a: "Yes. The IBAN and the Safe are yours from day one; your own instance simply takes over the orchestration.",
			},
		],
	},
	why: {
		title: "Why this makes sense today",
		subtitle:
			"Every retail card payment and every SEPA order from a classic Croatian bank carries an intermediary fee with a fixed component. MPT shows that a local economy can have a payment rail of its own: money travels directly from payer to payee — without the percentage flowing to card schemes and processors, without the fixed bank order fee — and every transfer leaves a public, verifiable trace.",
		tableHead: {
			channel: "Channel",
			fee: "Who pays how much",
			at1: "On €1",
			at2: "On €2",
			at5: "On €5",
			at100: "On €100",
		},
		channels: [
			{
				name: "MPT rail (EURe, Gnosis)",
				fee: "buyer €0 · merchant €0 up to €2,500/mo, then 1% · MPT pays gas",
				at1: "€0.00–0.01 · 0–1%",
				at2: "€0.00–0.02 · 0–1%",
				at5: "€0.00–0.05 · 0–1%",
				at100: "€0.00–1.00 · 0–1%",
				tone: "win" as const,
			},
			{
				name: "Card (Stripe EEA)",
				fee: "1.5% + €0.25 — paid by the merchant",
				at1: "€0.27 · 26.5%",
				at2: "€0.28 · 14%",
				at5: "€0.33 · 6.5%",
				at100: "€1.75 · 1.75%",
				tone: "leak" as const,
			},
			{
				name: "SEPA order (Croatian banks)",
				fee: "€0.25–0.45 fixed — paid by the buyer",
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
				text: "On a €2 payment the card fee is 14%, and the fixed bank order up to 22.5%. Small, frequent payments — exactly what local retail lives on — are the most expensive today. Only a fee with no fixed component makes micropayments viable.",
			},
			{
				title: "Money stays in the local economy",
				text: "A percentage of every card transaction leaves the local circle for schemes and processors. On the MPT rail the full amount reaches the payee, while orchestration is billed separately and is lower than the card fee at every amount.",
			},
			{
				title: "A rail they control themselves",
				text: "The rail is built on regulated e-money (EURe, issued by the licensed EMI Monerium) on the payee's own account and Safe. There are no card schemes or processors between payer and payee, and the code is open — anyone can run their own MPT.",
			},
			{
				title: "A public, verifiable trace",
				text: "Unlike cash and card settlements, every transfer is publicly visible and auditable onchain — transparency for the buyer, the merchant and the community.",
			},
		],
		sourceNote:
			"Rates: Stripe EEA pricing for domestic cards (July 2026) and typical fixed SEPA order fees at classic Croatian banks (ZABA, PBZ, Erste, OTP, HPB). Source and methodology:",
		sourceLink: {
			label: "lom.ff.hr/dokumenti/isplativost",
			href: "https://lom.ff.hr/dokumenti/isplativost",
		},
		calcLink: "Run the numbers for your shop in the calculator on the pricing page",
	},
	savings: {
		title: "Calculator: what goes to intermediaries today",
		subtitle: "An illustrative calculation for one merchant — card fees, the buyers' bank orders, and MPT at list price.",
		txPerDay: "Transactions per day",
		avgAmount: "Average amount (€)",
		perTx: "Fee per transaction",
		daily: "Daily",
		monthly: "Monthly",
		yearly: "Yearly",
		vsCard: "Card",
		vsSepa: "SEPA order",
		mpt: "MPT",
		note: "Card: 1.5% + €0.25 per transaction, paid by the merchant (Stripe EEA). SEPA: fixed order €0.25–0.45 per transaction, paid by the buyer (Croatian banks). MPT: €0 up to €2,500 in monthly volume, then 1%, paid by the merchant. Month = 30 days, year = 365.",
	},
	sim: {
		title: "Step-by-step simulations",
		subtitle:
			"The entire flow is modeled as a state machine with every node, transition and guard limit. Pick a scenario — from a buyer paying a merchant from the bank to a payment without a reference — and follow the money step by step: the diagram shows where the money is, the log shows who did what and who paid.",
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
			"The same state machine also powers automated tests: every scenario proves the buyer or user pays €0 and amounts are conserved 1:1 at every step.",
	},
	cta: {
		title: "Want to accept payments through MPT?",
		subtitle:
			"Tell us about your shop, association or project and we'll come back with an integration proposal. If you want your own MPT, we help with the setup too.",
		community: { label: "Questions and community: t.me/mpt_hr", href: "https://t.me/mpt_hr" },
		github: { label: "Code on GitHub", href: "https://github.com/domovinatv/pay.domovina.ai" },
	},
	footer: {
		columns: [
			{
				title: "Product",
				links: [
					{ label: "How it works", href: "/#how" },
					{ label: "Integration", href: "/#integrate" },
					{ label: "Pricing", href: "/pricing" },
					{ label: "Money flow & simulations", href: "/flow" },
					{ label: "Why now", href: "/why" },
					{ label: "Status", href: "/#status" },
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
				title: "Contact",
				links: [
					{ label: "ms@mpt.hr", href: "mailto:ms@mpt.hr" },
					{ label: "t.me/mpt_hr", href: "https://t.me/mpt_hr" },
					{ label: "ITalk d.o.o.", href: "https://italk.hr" },
					{ label: "airkuna.com", href: "https://airkuna.com" },
				],
			},
		],
		note: "Note: the MPT rail and checkout intents run in production (pay.domovina.ai) with the first tenant, ITalk d.o.o.; onboarding further tenants, Shopify and the Gnosis Pay branch are honestly labelled as in preparation. MPT is not a licensed payment service — ITalk is a non-custodial software provider that neither receives nor holds buyers' money, and regulated functions (e-money issuance, KYC/KYB) are performed by a licensed issuer (Monerium, EMI / MiCA EMT). This page is not investment or legal advice.",
		imprintLead: "MPT (Mint Pay Transfer)",
		imprint:
			"is a product of ITalk d.o.o. za informacijske tehnologije · IX. Južna obala 20, 10000 Zagreb, Croatia · OIB: 54872935051 · MBS: 081042440 · EUID: HRSR.081042440 · Commercial Court in Zagreb · director: Matija Stepanić",
		copyright: "MPT / ITalk d.o.o.",
	},
	langSwitch: { label: "HR", target: "hr", ariaLabel: "Prebaci na hrvatski" },
};

export type Dictionary = typeof hr;

const dictionaries: Record<Locale, Dictionary> = { hr, en };

export function getDictionary(locale: Locale): Dictionary {
	return dictionaries[locale];
}

/** mailto: link for the primary "request integration" CTA, with a prefilled template */
export function requestHref(dict: Dictionary): string {
	const { email, subject, body } = dict.request;
	return `mailto:${email}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
}
