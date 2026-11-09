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
				"MPT (Mint Pay Transfer), proizvod tvrtke ITalk d.o.o., orkestrira plaćanja na Monerium računima trgovaca — kao RevenueCat, ali za SEPA → EURe. Monerium minta novac izravno u Safe trgovca, MPT javlja „paid“ za ~12 s i novac nikad ne drži. Kupac MPT-u ne plaća ništa.",
		},
		flow: {
			title: "Tok novca i simulacije — MPT",
			description:
				"Svaki korak MPT plaćanja: od SEPA uplate kupca do EURe koji Monerium minta izravno u Safe trgovca, s izmjerenim vremenima, naknadama i interaktivnim simulacijama.",
		},
		pricing: {
			title: "Cijene — MPT",
			description:
				"Kao RevenueCat: hostani MPT je besplatan do 2.500 € mjesečnog prometa, zatim 1%. Bez fiksne naknade po transakciji. Vlastiti MPT je besplatan (MIT). Kupac ne plaća ništa.",
		},
		merchants: {
			title: "Za trgovce — MPT",
			description:
				"Što trgovac treba za MPT, kako teče onboarding i što se točno dogodi kad uplata ne ide po planu: bez reference, manja, veća, dvostruka, zakašnjela ili odbijena uplata. Plus povrati, eure na računu i knjiženje.",
		},
		why: {
			title: "Zašto danas — MPT",
			description:
				"Fiksne naknade kartica i bankovnih naloga čine mikrouplate najskupljima. Usporedba naknada po kanalu i zašto rail bez fiksnog dijela ima smisla za lokalnu ekonomiju.",
		},
		support: {
			title: "Podrži MPT — crowdfunding MPT-a kroz MPT",
			description:
				"MPT je otvoren kod (MIT) koji razvija ITalk d.o.o. Podrži njegov razvoj uplatom iz banke — i usput vidi cijeli MPT tok uživo: zaprimljeno, paid, EURe na Safeu kampanje.",
		},
		supportSandbox: {
			title: "Podrži MPT (sandbox) — isti tok bez pravog novca",
			description:
				"Isprobaj crowdfunding MPT-a kroz MPT na Monerium sandboxu i Chiadu: isti kod i isti checkout, simulirana SEPA uplata, testni EURe.",
		},
	},
	nav: {
		how: "Kako radi",
		merchants: "Za trgovce",
		flow: "Tok novca",
		pricing: "Cijene",
		why: "Zašto danas",
		status: "Stanje",
		cta: "Zatraži integraciju",
		menu: "Izbornik",
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
			"MPT je ono što je RevenueCat za pretplate u aplikacijama — samo za SEPA plaćanja u EURe. Svaki trgovac ima vlastiti Monerium IBAN i Safe; Monerium minta EURe izravno u Safe trgovca, a MPT vodi checkout, reference, uparivanje uplata, webhookove i status uživo — novac nikad ne drži.",
		ctaPrimary: "Zatraži integraciju",
		ctaSecondary: "Pogledaj tok novca",
		cardLabel: "Izmjereno u produkciji · listopad 2026.",
		cardTotal: "~12 s",
		cardTotalNote: "od uplate u banci do statusa „paid“ kod trgovca (kupac koji je već plaćao s istog IBAN-a)",
		cardRows: [
			{ label: "Kupac vidi „zaprimljeno“", value: "~5 s" },
			{ label: "Naknada kupca (SEPA Instant iz Revoluta)", value: "0,00 €" },
			{ label: "Tko drži novac", value: "trgovac" },
		],
		cardFootnote: "Prvu uplatu s novog IBAN-a Monerium ručno pregleda — od nekoliko minuta do nekoliko sati. Jedini tenant s pravim novcem u produkciji je zasad ITalk d.o.o.; drugi trgovci uključuju se nakon Moneriumova KYB-a.",
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
				mpt: "checkout intenti, reference, uparivanje uplata, webhookovi, status uživo",
			},
			{ aspect: "Integracija", rc: "jedan SDK za obje trgovine", mpt: "jedan API za sve Monerium račune (tenante)" },
			{ aspect: "Cijena", rc: "besplatno do 2.500 $ mjesečno, zatim 1%", mpt: "besplatno do 2.500 € mjesečno, zatim 1%" },
		],
		cards: [
			{
				title: "Vlastiti Monerium račun po trgovcu",
				text: "Svaki tenant ima vlastiti KYB, IBAN, glavni Safe (2/3 multisig) i projektne Safe-ove povezane s njegovim Monerium profilom. Monerium minta izravno u Safe iz reference; uplatu bez reference rola ProjectRouter smije proslijediti samo na projektne Safe-ove koje su vlasnici odobrili — to provodi Zodiac Roles na lancu, ne MPT-ov kod.",
			},
			{
				title: "Jedna integracija, ista poslovna logika",
				text: "Checkout intent s EPC QR kodom, stanja pending → zaprimljeno → paid → expired, status uživo preko SSE-a i potpisani webhookovi s trajnim outboxom koji ponavlja isporuku do ~47 h.",
			},
			{
				title: "Otporno na stvarne uplate",
				text: "Uplata bez reference povezuje se s intentom po iznosu i vremenu ili kratkom kodu, manja uplata nikad nije „paid“, a svaka uplata koju rail ne može riješiti završava kao alarm — nikad tiho. Intent se plaćenim označi samo jednom; svaka dodatna uplata svejedno stiže trgovcu i javlja se webhookom.",
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
			"Tvoj backend kreira intent, kupac plati iz banke, Monerium minta u tvoj Safe, a ti dobiješ webhook kad je novac tamo. Javna dokumentacija API-ja je u izradi — dotad integraciju radimo zajedno.",
		steps: [
			{
				num: "01",
				title: "Kreiraj intent",
				text: "Pošalji iznos i Safe projekta povezan s tvojim Monerium računom. Dobiješ referencu (i kratki kod), EPC QR, checkout stranicu i URL za status uživo.",
			},
			{
				num: "02",
				title: "Kupac plati iz banke",
				text: "Kupac skenira QR i pošalje SEPA uplatu. Checkout preko SSE-a pokaže „zaprimljeno“ već nakon ~5 s.",
			},
			{
				num: "03",
				title: "Primi webhook",
				text: "intent.paid stiže kad Monerium obradi uplatu i EURe je u tvom Safeu (u produkciji ~12 s od uplate). Postoje i payment.received, payment.underpaid, payment.late, payment.rejected, forward.blocked i contribution.sepa.",
			},
		],
		requestTitle: "Zahtjev",
		webhookTitle: "Webhook",
		orderLabel: "Narudžba #1042",
		note: "Primjer je skraćen; adrese i ključevi su ilustrativni.",
		cta: "Javi se za integraciju i consulting",
		casesLink: "Što se dogodi kad uplata ne ide po planu →",
	},
	audiences: {
		title: "Za koga je MPT",
		subtitle: "Svatko tko prima uplate u eurima i želi ih primati bez kartične provizije — na vlastiti račun.",
		items: [
			{
				title: "Web trgovine",
				text: "Checkout s EPC QR kodom preko API-ja ili kao način plaćanja u trgovini. Shopify aplikacija je napisana i čeka puštanje i prvi test na stvarnoj trgovini; WooCommerce je u planu.",
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
				text: "IBAN i Safe-ovi pripadaju trgovcu. MPT nema ključ koji može pomaknuti novac izvan skupa Safe-ova koje su vlasnici odobrili: rola ProjectRouter smije samo EURe transfer na te Safe-ove, a to provodi Zodiac Roles na lancu.",
			},
			{
				title: "Provjerljivo",
				text: "Kod je otvoren (MIT), svaki mint i transfer je javno vidljiv onchain, a stanje sustava objavljujemo bez uljepšavanja — ispod.",
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
				text: "Najjeftiniji put: debitnom karticom hrvatske banke (PBZ, ZABA, OTP, Erste, HPB…) preko Apple Paya ili Google Paya kupac napuni Revolut (min. 10 €, Revolutov produktni limit), pa na checkoutu skenira EPC QR i pošalje SEPA Instant (min. 1 €) — kartičnu i SEPA transakciju plaća Revolut, kupac 0 €. Uplata izravno iz klasične hrvatske banke također radi, ali tada kupac plaća naknadu svoje banke za nalog. U referenci piše u koji Safe Monerium minta: gnosis:0x<Safe trgovca> sid:<intent>.",
			},
			{
				num: "02",
				title: "Uplata na IBAN trgovca, „zaprimljeno“ odmah — 0 €",
				text: "Uplata stiže na Monerium IBAN trgovca (vlastiti KYB; prvi tenant u produkciji je ITalk d.o.o.). Monerium kreira issue order (placed → pending → processed), a MPT već na prvi webhook poveže uplatu s intentom i checkout preko SSE-a pokaže „zaprimljeno“ — u produkciji ~5 s nakon što je kupac pritisnuo „Pošalji“.",
			},
			{
				num: "03",
				title: "Monerium minta izravno u Safe trgovca — 0 €",
				text: "Monerium minta EURe 1:1 izravno u Safe trgovca ili projekta iz reference, na Gnosis Chainu — medijan 9 s od uplate. Taj Safe mora biti povezan s Monerium profilom trgovca. MPT novac ne dira: kad Monerium javi da je uplata obrađena, intent postaje „paid“, a trgovac dobiva potpisani webhook — u produkciji ~12 s od uplate.",
			},
			{
				num: "04",
				title: "Ako se referenca izgubi — novac svejedno stiže",
				text: "Kad referenca izostane (Revolut nakon skeniranja QR koda opis često ispusti), Monerium minta na glavni Safe trgovca. Resolver uplatu poveže s otvorenim intentom istog trgovca po točnom iznosu i vremenu ili po kratkom kodu: ako je kandidat jednoznačan, rola ProjectRouter je automatski proslijedi na projektni Safe — samo na onaj koji su vlasnici (2/3) odobrili, a to provodi Zodiac Roles na lancu; gas plaća MPT. Inače novac ostaje parkiran na glavnom Safeu dok ga operater ili vlasnici ne vežu uz pravu narudžbu. Manja uplata od iznosa intenta nikad ne postaje „paid“.",
			},
		],
		notes: [
			{
				title: "Isti rail, i drugi smjerovi",
				text: "Vlastiti wallet korisnik puni preko vlastitog Monerium računa (ili računa kampanje), ne preko MPT-a: MPT od 15. 10. 2026. ne prosljeđuje uplate na proizvoljnu adresu. Iz walleta se plaća checkout ili rade P2P transferi sa sponzoriranim gasom, a off-ramp ide preko istog Monerium računa i besplatnog SEPA Instanta natrag u banku — krug se zatvara gdje je i počeo. Osobe od 30. 10. 2026. Monerium račun ne otvaraju u Moneriumovoj aplikaciji nego preko partnera. Sve je u simulacijama ispod.",
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
				"Potpisani webhookovi za trgovce (received · paid · underpaid · late · rejected · blocked · kampanje) s trajnim outboxom",
				"Izravni mint: Monerium minta u Safe trgovca ili projekta iz reference, MPT nema ključ koji pomiče novac s njega (od 15. 10. 2026.)",
				"Uplate bez reference: automatsko povezivanje s intentom (od 8. 10. 2026.), kratki kod intenta (od 20. 10. 2026.) i prosljeđivanje rolom ProjectRouter samo na projektne Safe-ove koje su vlasnici odobrili (od 19. 10. 2026.)",
				"Multi-tenant rail uključen: svaki tenant ima vlastiti Monerium račun i rail; jedini tenant s pravim novcem je zasad ITalk d.o.o.",
				"Nadzor Safea: alarm za svaki izlaz koji rail nije sam pokrenuo",
				"Nezavisni code reviewi s riješenim nalazima i CI na svakom PR-u",
			],
		},
		prep: {
			title: "U pripremi",
			items: [
				"Prvi vanjski trgovac s vlastitim Monerium računom — rail je spreman, čeka se trgovac koji završi Moneriumov KYB",
				"Shopify: MPT kao način plaćanja s QR kodom — aplikacija napisana, puštanje i prvi test na stvarnoj trgovini predstoje",
				"WooCommerce — plan",
				"Javna dokumentacija API-ja",
				"Gnosis Pay VISA grana — pre-pilot",
			],
		},
		limits: {
			title: "Poznata ograničenja",
			items: [
				"Prvu uplatu s novog IBAN-a Monerium zadržava na ručnom pregledu — od nekoliko minuta do nekoliko sati. Sljedeće uplate s istog IBAN-a prolaze za sekunde.",
				"Revolut nakon skeniranja QR koda često ispusti referencu — resolver i kratki kod to pokrivaju kad je kandidat jednoznačan, inače uplatu ručno veže operater ili vlasnici Safea.",
				"SEPA povrat (recall) nakon što je EURe već mintan nije automatiziran.",
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
					"Gas za prosljeđivanje uplata bez reference plaća MPT",
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
				a: "Ne. Puni iznos stiže u tvoj Safe; naknada se obračunava zasebno, mjesečno, prema ugovoru.",
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
	merchants: {
		eyebrow: "Za trgovce",
		title: "Što se dogodi kad…",
		subtitle:
			"Sve što trgovac pita prije integracije: što ti treba, kako teče onboarding i što MPT napravi u svakom slučaju koji nije savršena uplata. Ponašanje opisano ovdje je ono što kod danas radi, ne plan.",
		onboardingTitle: "Onboarding",
		onboardingSubtitle:
			"Trajanje najviše ovisi o Moneriumovom KYB-u. Tehnički dio radimo zajedno, a gas za prosljeđivanje uplata bez reference MPT plaća i puni sam — o tome ne brineš.",
		onboarding: [
			{
				num: "01",
				title: "Monerium račun",
				text: "Otvaraš poslovni račun kod Moneriuma i prolaziš njihov KYB. Dobivaš vlastiti IBAN; ugovor je između tebe i Moneriuma.",
			},
			{
				num: "02",
				title: "Glavni Safe i projektni Safe-ovi",
				text: "Glavni Safe (2 od 3 potpisa) je Moneriumov default wallet tvog računa. Za svaki projekt ili trgovinu imaš Safe povezan s tvojim Monerium profilom — u njega Monerium minta izravno, po referenci.",
			},
			{
				num: "03",
				title: "Jedan potpis",
				text: "Za uplate bez reference vlasnici glavnog Safea (2 od 3) potpisuju rolu ProjectRouter: smije samo EURe transfer, samo na tvoje projektne Safe-ove. Ograničenje provodi Zodiac Roles na lancu; novi projekt opet traži 2/3 potpis, a rolu možeš opozvati kad želiš.",
			},
			{
				num: "04",
				title: "Ključ, webhook i probna uplata",
				text: "Dobivaš API ključ, upisuješ URL za webhookove, i prolazimo probnu uplatu od kraja do kraja. Tek tada se uključuješ u produkciju.",
			},
		],
		casesTitle: "Uplate koje ne idu po planu",
		casesSubtitle:
			"Novac se ne pogađa i ne gubi: ili stigne u Safe projekta, ili ostane na tvom glavnom Safeu dok se ne riješi. Svaki ishod javlja se webhookom.",
		casesHead: { when: "Kad…", what: "MPT napravi", event: "Webhook" },
		cases: [
			{
				when: "Kupac plati točan iznos",
				what: "„Zaprimljeno“ na checkoutu ~5 s nakon što kupac pošalje uplatu, Monerium minta izravno u Safe projekta i status „paid“ ~12 s od uplate.",
				event: "payment.received → intent.paid",
			},
			{
				when: "Kupac prvi put plaća s tog IBAN-a",
				what: "Monerium prvu uplatu s novog IBAN-a ručno pregleda — od nekoliko minuta do nekoliko sati. API to unaprijed označi, pa checkout može kupcu reći da će potrajati. Sljedeće uplate s istog IBAN-a prolaze za sekunde.",
				event: "payment.received → intent.paid",
			},
			{
				when: "Referenca se izgubi",
				what: "Monerium minta na tvoj glavni Safe. Resolver traži tvoj otvoreni intent s točno tim iznosom u vremenskom prozoru oko uplate, ili po kratkom kodu. Jednoznačan kandidat → ProjectRouter ga proslijedi na projektni Safe i „paid“. Nema kandidata ili su različiti → novac ostaje na glavnom Safeu dok ga operater ili vlasnici ne vežu uz narudžbu.",
				event: "intent.paid ili forward.blocked",
			},
			{
				when: "Kupac uplati manje",
				what: "Novac stigne u tvoj Safe, ali intent ne postaje „paid“. Uplate se ne zbrajaju — o narudžbi (dopuna, povrat, otkaz) odlučuješ ti.",
				event: "payment.underpaid",
			},
			{
				when: "Kupac uplati više",
				what: "Intent postaje „paid“, cijeli iznos stigne u tvoj Safe, a webhook nosi koliko je preplaćeno. Razliku kupcu vraćaš ti.",
				event: "intent.paid (overpaid_cents)",
			},
			{
				when: "Kupac plati dvaput",
				what: "Intent je plaćen samo jednom; druga uplata svejedno stigne u tvoj Safe i javi se zasebno. Povrat radiš ti.",
				event: "payment.received",
			},
			{
				when: "Uplata stigne nakon isteka",
				what: "Novac stigne u tvoj Safe, intent ostaje istekao, a ti dobiješ zaseban događaj pa odlučuješ hoćeš li narudžbu ipak isporučiti.",
				event: "payment.late",
			},
			{
				when: "Monerium odbije uplatu",
				what: "Novac se ne minta i vraća se platitelju. Webhook nosi Moneriumov razlog.",
				event: "payment.rejected",
			},
			{
				when: "Uplata nije u eurima",
				what: "MPT radi samo s EUR. Uplata u drugoj valuti ne veže se automatski uz intent nego se rješava ručno.",
				event: "forward.blocked",
			},
			{
				when: "MPT ne radi",
				what: "Uplate i dalje stižu na tvoj IBAN i Safe — MPT ih ne može zaključati. Monerium ponavlja svoje obavijesti do 12 h, MPT naknadno povlači propuštene narudžbe, a webhookove prema tebi ponavlja do ~47 h.",
				event: "isporuka kasni, ne gubi se",
			},
		],
		moneyTitle: "Novac, povrati i knjiženje",
		money: [
			{
				title: "Kako dobiješ eure na račun",
				text: "U tvoj Safe stiže EURe — regulirani e-novac, 1:1 s eurom. U eure na poslovnom računu pretvaraš ga preko svog Monerium računa (redeem → SEPA na tvoj IBAN), kad i koliko želiš. MPT to ne radi umjesto tebe; Moneriumove naknade, ako ih tvoj ugovor predviđa, nisu dio MPT cijene.",
			},
			{
				title: "Povrat kupcu",
				text: "Povrate radiš ti, s vlastitog računa — webhook ti daje ime i IBAN platitelja. MPT danas nema API za povrate.",
			},
			{
				title: "Nema chargebacka kao kod kartice",
				text: "SEPA uplata nije kartična transakcija: kupac je ne može jednostrano osporiti preko kartične sheme. Banka može zatražiti povrat (SEPA recall) — takav zahtjev rješavamo s tobom, ručno.",
			},
			{
				title: "Knjiženje i porezi",
				text: "Za svaku uplatu imaš webhook s iznosom, vremenom, imenom i IBAN-om platitelja, a svaki mint i transfer ima javni onchain trag. MPT ne izdaje račune i ne fiskalizira. Kako knjižiti e-novac i vrijedi li za tebe fiskalizacija, provjeri sa svojim računovođom.",
			},
			{
				title: "Podaci tvojih kupaca",
				text: "Webhook nosi ime i IBAN platitelja — to su osobni podaci tvojih kupaca. Kako ih obrađujemo, dio je ugovora o integraciji.",
			},
			{
				title: "Gas i limiti",
				text: "Mint je Moneriumov; gas za prosljeđivanje uplata bez reference plaća MPT. Najviše 10.000 € po intentu; veći limiti po dogovoru (Enterprise).",
			},
		],
		missingTitle: "Što još nema",
		missingSubtitle: "Da ne bude iznenađenja nakon potpisa.",
		missing: [
			"Sučelje (dashboard) za trgovca — danas vidiš uplate preko webhookova i onchain",
			"API za povrate — povrate radiš sam",
			"Checkout stranica samo na hrvatskom",
			"Javna API dokumentacija i SDK — integraciju radimo zajedno",
			"WooCommerce dodatak; Shopify aplikacija čeka puštanje",
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
	support: {
		eyebrow: "Podrži MPT",
		title: "Financiraj MPT kroz MPT",
		subtitle:
			"MPT je otvoren kod (MIT) iza kojeg stoji jedan developer u ITalku. Uplatom iz banke podržavaš njegov razvoj — i usput vidiš cijeli MPT tok uživo, kao kupac kod trgovca: zaprimljeno, paid, EURe na Safeu kampanje.",
		sandboxEyebrow: "Podrži MPT · sandbox",
		sandboxTitle: "Isti tok, bez pravog novca",
		sandboxSubtitle:
			"Sandbox koristi isti kod, isti rail i isti checkout, ali Monerium sandbox i testni EURe na Chiadu. Na checkoutu gumb simulira SEPA uplatu, a sve iza toga je pravi put raila: Monerium nalog, webhook, mint, stanje uživo.",
		toSandbox: "Isprobaj bez pravog novca (sandbox)",
		toProd: "Natrag na pravu kampanju",
		howTitle: "Što se dogodi kad uplatiš",
		how: [
			{
				title: "Odabereš iznos",
				body: "Stranica stvori MPT payment intent na railu (tenant ITalk) — isti API koji trgovac zove iz svog checkouta.",
			},
			{
				title: "Platiš iz banke",
				body: "Railov checkout pokaže QR (EPC i HUB3 uplatnica) s Monerium IBAN-om ITalka i referencom gnosis:0x<Safe> sid:<intent>.",
			},
			{
				title: "Zaprimljeno → paid",
				body: "Monerium zaprimi SEPA uplatu, MPT je upari s intentom i checkout to pokaže uživo (~12 s do paid nakon zaprimanja). Prva uplata s novog IBAN-a može čekati Moneriumov pregled.",
			},
			{
				title: "EURe na Safeu kampanje",
				body: "Monerium minta EURe izravno u Safe kampanje (multisig 2/3). MPT novac ne drži, a svaka uplata je javno vidljiva na lancu.",
			},
		],
		useTitle: "Na što ide novac",
		use: [
			"Održavanje jezgre: intenti i webhookovi, povrati i dopunske uplate, istek intenta, resolver uplata bez reference.",
			"Sigurnost: nadogradnje ovisnosti i popravci iz vanjskog sigurnosnog pregleda.",
			"Infrastruktura: Cloudflare Workers i D1, gas za ProjectRouter.",
		],
		honestTitle: "Iskreno",
		honest: [
			"Primatelj je ITalk d.o.o. (Zagreb). Ovo je podrška razvoju, ne donacija u poreznom smislu: nije porezno priznata, a ITalk je knjiži kao prihod.",
			"Za uplatu ne dobivaš udio, prinos ni protuuslugu.",
			"MPT-u ne plaćaš ništa. Iz klasične hrvatske banke plaćaš svojoj banci naknadu za nalog (0,25–0,45 €); s Revoluta je uplata besplatna.",
			"Kod je otvoren (MIT): tko želi, istu stranicu i rail pokrene za svoj projekt. Za pogrešnu uplatu javi se na ms@mpt.hr.",
		],
		widget: {
			title: "Odaberi iznos",
			lead: "Nakon klika otvara se MPT checkout s QR kodom za uplatu iz banke i stanjem uživo.",
			amountLabel: "Iznos",
			customLabel: "Ili upiši svoj iznos",
			pay: "Podrži s {amount}",
			busy: "Otvaram checkout…",
			notReady:
				"Kampanja je u pripremi: Safe kampanje još nije izrađen i registriran na railu. Uplata će biti moguća čim bude.",
			notes: [
				"Uplata ide na Monerium IBAN ITalka, a Monerium minta EURe izravno u Safe kampanje.",
				"Checkout vrijedi 15 minuta; nakon toga ponovno odaberi iznos.",
			],
			payerTagNotice:
				"Uz uplatu se javno prikazuju inicijali i zadnja 4 znaka IBAN-a (npr. „M. S. ··1234”), nikad puno ime ni IBAN.",
			raisedLabel: "Prikupljeno",
			raisedSub: "{count} uplata · {chain}",
			raisedEmpty: "Zbroj se prikazuje kad kampanja krene.",
			loading: "Čitam lanac…",
			pending: "+ {amount} zaprimljeno, čeka mint",
			goal: "{pct} % od cilja {goal}",
			readError: "Stanje trenutno nije dostupno; pokušavam ponovno.",
			listTitle: "Zadnje uplate",
			listEmpty: "Još nema uplata. Budi prvi.",
			anonymous: "Uplata",
			stateMinted: "na lancu",
			stateReceived: "zaprimljeno",
			safeLink: "Safe kampanje ({chain})",
			errors: {
				not_campaign: "Kampanja još nije registrirana na railu. Pokušaj kasnije ili javi na ms@mpt.hr.",
				invalid_amount: "Iznos mora biti veći od 0 € i najviše {max} €.",
				too_many_open: "Trenutno je otvoreno previše uplata; pokušaj za nekoliko minuta.",
				network: "Rail nije dostupan; provjeri vezu i pokušaj ponovno.",
				unknown: "Nešto nije u redu s railom; pokušaj ponovno ili javi na ms@mpt.hr.",
			},
		},
	},
	cta: {
		title: "Želiš primati uplate preko MPT-a?",
		subtitle:
			"Opiši nam svoju trgovinu, udrugu ili projekt i javimo se s prijedlogom integracije. Ako želiš vlastiti MPT, pomažemo i s postavljanjem.",
		emailLead: "ili izravno na",
		community: { label: "Pitanja i zajednica: t.me/mpt_hr", href: "https://t.me/mpt_hr" },
		github: { label: "Kod na GitHubu", href: "https://github.com/domovinatv/pay.domovina.ai" },
		support: { label: "Podrži razvoj MPT-a", href: "/hr/support" },
	},
	footer: {
		columns: [
			{
				title: "Proizvod",
				links: [
					{ label: "Kako radi", href: "/#how" },
					{ label: "Integracija", href: "/#integrate" },
					{ label: "Za trgovce", href: "/merchants" },
					{ label: "Cijene", href: "/pricing" },
					{ label: "Tok novca i simulacije", href: "/flow" },
					{ label: "Zašto danas", href: "/why" },
					{ label: "Stanje", href: "/#status" },
					{ label: "Podrži MPT", href: "/support" },
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
		note: "Napomena: MPT rail i checkout intenti rade u produkciji (pay.domovina.ai); jedini tenant s pravim novcem je zasad ITalk d.o.o.; prvi vanjski tenanti, Shopify i Gnosis Pay grana iskreno su označeni kao u pripremi. MPT nije licencirana platna usluga — ITalk je non-custodial software provider koji ne prima ni ne drži novac kupaca, a regulirane funkcije (izdavanje e-novca, KYC/KYB) obavlja licencirani izdavatelj (Monerium, EMI / MiCA EMT). Ova stranica nije investicijski ni pravni savjet.",
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
				"MPT (Mint Pay Transfer), a product by ITalk d.o.o., orchestrates payments on merchants' Monerium accounts — like RevenueCat, but for SEPA → EURe. Monerium mints the money straight into the merchant's Safe, MPT reports “paid” in ~12 s and never holds it. The buyer pays MPT nothing.",
		},
		flow: {
			title: "Money flow and simulations — MPT",
			description:
				"Every step of an MPT payment: from the buyer's SEPA transfer to the EURe Monerium mints straight into the merchant's Safe, with measured timings, fees and interactive simulations.",
		},
		pricing: {
			title: "Pricing — MPT",
			description:
				"Like RevenueCat: hosted MPT is free up to €2,500 in monthly volume, then 1%. No fixed fee per transaction. Self-hosted MPT is free (MIT). The buyer pays nothing.",
		},
		merchants: {
			title: "For merchants — MPT",
			description:
				"What a merchant needs for MPT, how onboarding works and exactly what happens when a payment doesn't go to plan: no reference, too little, too much, twice, late or rejected. Plus refunds, euros in your account and bookkeeping.",
		},
		why: {
			title: "Why now — MPT",
			description:
				"Fixed card and bank-order fees make micropayments the most expensive ones. A fee comparison per channel and why a rail with no fixed component makes sense for a local economy.",
		},
		support: {
			title: "Support MPT — crowdfunding MPT through MPT",
			description:
				"MPT is open source (MIT), built by ITalk d.o.o. Support its development with a bank payment — and watch the whole MPT flow live: received, paid, EURe in the campaign Safe.",
		},
		supportSandbox: {
			title: "Support MPT (sandbox) — the same flow without real money",
			description:
				"Try crowdfunding MPT through MPT on Monerium's sandbox and Chiado: the same code and checkout, a simulated SEPA transfer, test EURe.",
		},
	},
	nav: {
		how: "How it works",
		merchants: "For merchants",
		flow: "Money flow",
		pricing: "Pricing",
		why: "Why now",
		status: "Status",
		cta: "Request integration",
		menu: "Menu",
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
			"MPT is what RevenueCat is for in-app subscriptions — only for SEPA payments in EURe. Every merchant has its own Monerium IBAN and Safe; Monerium mints EURe straight into the merchant's Safe, and MPT runs the checkout, references, payment matching, webhooks and live status — it never holds the money.",
		ctaPrimary: "Request integration",
		ctaSecondary: "See the money flow",
		cardLabel: "Measured in production · October 2026",
		cardTotal: "~12 s",
		cardTotalNote: "from the bank payment to “paid” at the merchant (a buyer who has paid from the same IBAN before)",
		cardRows: [
			{ label: "Buyer sees “received”", value: "~5 s" },
			{ label: "Buyer's fee (SEPA Instant from Revolut)", value: "€0.00" },
			{ label: "Who holds the money", value: "the merchant" },
		],
		cardFootnote: "Monerium reviews the first payment from a new IBAN by hand — from a few minutes to a few hours. For now the only tenant with real money in production is ITalk d.o.o.; further merchants switch on after Monerium's KYB.",
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
				mpt: "checkout intents, references, payment matching, webhooks, live status",
			},
			{ aspect: "Integration", rc: "one SDK for both stores", mpt: "one API for every Monerium account (tenant)" },
			{ aspect: "Price", rc: "free up to $2,500 a month, then 1%", mpt: "free up to €2,500 a month, then 1%" },
		],
		cards: [
			{
				title: "An own Monerium account per merchant",
				text: "Every tenant has its own KYB, IBAN, main Safe (a 2/3 multisig) and project Safes linked to its Monerium profile. Monerium mints straight into the Safe in the reference; a payment without a reference may be forwarded by the ProjectRouter role only to project Safes the owners approved — enforced onchain by Zodiac Roles, not by MPT's code.",
			},
			{
				title: "One integration, the same business logic",
				text: "A checkout intent with an EPC QR code, states pending → received → paid → expired, live status over SSE, and signed webhooks with a durable outbox that retries delivery for up to ~47 h.",
			},
			{
				title: "Built for real-world payments",
				text: "A payment without a reference is matched to an intent by amount and time or a short code, an underpayment never becomes “paid”, and every payment the rail can't resolve ends up as an alert — never silently. An intent is marked paid only once; any extra payment still reaches the merchant and is reported by webhook.",
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
			"Your backend creates an intent, the buyer pays from the bank, Monerium mints into your Safe, and you get a webhook once the money is there. Public API docs are in the works — until then we do the integration together.",
		steps: [
			{
				num: "01",
				title: "Create an intent",
				text: "Send the amount and a project Safe linked to your Monerium account. You get a reference (and a short code), an EPC QR, a checkout page and a live-status URL.",
			},
			{
				num: "02",
				title: "The buyer pays from the bank",
				text: "The buyer scans the QR and sends a SEPA transfer. The checkout shows “received” over SSE after ~5 s.",
			},
			{
				num: "03",
				title: "Receive the webhook",
				text: "intent.paid arrives once Monerium has processed the payment and the EURe is in your Safe (in production ~12 s after the payment). There are also payment.received, payment.underpaid, payment.late, payment.rejected, forward.blocked and contribution.sepa.",
			},
		],
		requestTitle: "Request",
		webhookTitle: "Webhook",
		orderLabel: "Order #1042",
		note: "The example is shortened; addresses and keys are illustrative.",
		cta: "Get in touch for integration and consulting",
		casesLink: "What happens when a payment doesn't go to plan →",
	},
	audiences: {
		title: "Who MPT is for",
		subtitle: "Anyone who takes payments in euros and wants them without card fees — straight to their own account.",
		items: [
			{
				title: "Online shops",
				text: "A checkout with an EPC QR code through the API or as a payment method in the shop. The Shopify app is written and awaiting release and its first test on a real store; WooCommerce is planned.",
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
				text: "The IBAN and Safes belong to the merchant. MPT has no key that can move money outside the set of Safes the owners approved: the ProjectRouter role may only make an EURe transfer to those Safes, enforced onchain by Zodiac Roles.",
			},
			{
				title: "Verifiable",
				text: "The code is open (MIT), every mint and transfer is publicly visible onchain, and we publish the state of the system without embellishment — below.",
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
				text: "The cheapest path: using a Croatian bank debit card (PBZ, ZABA, OTP, Erste, HPB…) via Apple Pay or Google Pay, the buyer tops up Revolut (min. €10, a Revolut product limit), then scans the EPC QR at checkout and sends a SEPA Instant (min. €1) — Revolut pays both the card and the SEPA transaction, the buyer pays €0. Paying straight from a classic Croatian bank works too, but then the buyer pays their bank's order fee. The reference tells Monerium which Safe to mint into: gnosis:0x<merchant Safe> sid:<intent>.",
			},
			{
				num: "02",
				title: "Payment to the merchant's IBAN, “received” right away — €0",
				text: "The payment lands on the merchant's Monerium IBAN (its own KYB; the first tenant in production is ITalk d.o.o.). Monerium creates an issue order (placed → pending → processed), and on the very first webhook MPT links the payment to the intent and the checkout shows “received” over SSE — in production ~5 s after the buyer pressed “Send”.",
			},
			{
				num: "03",
				title: "Monerium mints straight into the merchant's Safe — €0",
				text: "Monerium mints EURe 1:1 straight into the merchant's or project's Safe named in the reference, on Gnosis Chain — a median 9 s after the payment. That Safe must be linked to the merchant's Monerium profile. MPT never touches the money: once Monerium reports the payment processed, the intent flips to “paid” and the merchant gets a signed webhook — in production ~12 s after the payment.",
			},
			{
				num: "04",
				title: "If the reference gets lost — the money still arrives",
				text: "When the reference is missing (after scanning the QR code Revolut often drops the description), Monerium mints to the merchant's main Safe. The resolver links the payment to an open intent of the same merchant by exact amount and time or by the short code: if the candidate is unambiguous, the ProjectRouter role forwards it automatically to the project Safe — only one the owners (2/3) approved, enforced onchain by Zodiac Roles; MPT pays the gas. Otherwise the money stays parked in the main Safe until an operator or the owners link it to the right order. A payment smaller than the intent never becomes “paid”.",
			},
		],
		notes: [
			{
				title: "The same rail, other directions too",
				text: "A user funds their own wallet through their own Monerium account (or a campaign's), not through MPT: since 15 Oct 2026 MPT does not forward payments to an arbitrary address. From the wallet they pay a checkout or make P2P transfers with sponsored gas, and the off-ramp goes through the same Monerium account and a free SEPA Instant back to the bank — the circle closes where it began. Since 30 Oct 2026 individuals don't open a Monerium account in Monerium's app but through partners. It's all in the simulations below.",
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
				"Signed merchant webhooks (received · paid · underpaid · late · rejected · blocked · campaigns) with a durable outbox",
				"Direct mint: Monerium mints into the merchant's or project's Safe from the reference, and MPT has no key that can move money out of it (since 15 Oct 2026)",
				"Payments without a reference: automatic matching to an intent (since 8 Oct 2026), a short intent code (since 20 Oct 2026) and forwarding by the ProjectRouter role only to project Safes the owners approved (since 19 Oct 2026)",
				"Multi-tenant rail switched on: every tenant has its own Monerium account and rail; for now the only tenant with real money is ITalk d.o.o.",
				"Safe monitoring: an alert for every outflow the rail didn't start itself",
				"Independent code reviews with findings resolved, and CI on every PR",
			],
		},
		prep: {
			title: "In preparation",
			items: [
				"The first external merchant with its own Monerium account — the rail is ready, waiting for a merchant to complete Monerium's KYB",
				"Shopify: MPT as a payment method with a QR code — the app is written, release and the first test on a real store are upcoming",
				"WooCommerce — planned",
				"Public API documentation",
				"Gnosis Pay VISA branch — pre-pilot",
			],
		},
		limits: {
			title: "Known limitations",
			items: [
				"Monerium holds the first payment from a new IBAN for manual review — from a few minutes to several hours. Later payments from the same IBAN clear in seconds.",
				"After a QR scan Revolut often drops the reference — the resolver and the short code cover that when the candidate is unambiguous; otherwise an operator or the Safe's owners link the payment by hand.",
				"A SEPA recall after the EURe has already been minted is not automated.",
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
					"MPT pays the gas for forwarding payments without a reference",
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
				a: "No. The full amount reaches your Safe; the fee is billed separately, monthly, under the contract.",
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
	merchants: {
		eyebrow: "For merchants",
		title: "What happens when…",
		subtitle:
			"Everything a merchant asks before integrating: what you need, how onboarding works and what MPT does in every case that isn't a perfect payment. The behaviour described here is what the code does today, not a plan.",
		onboardingTitle: "Onboarding",
		onboardingSubtitle:
			"How long it takes depends mostly on Monerium's KYB. We do the technical part together, and MPT pays and tops up the gas for forwarding payments without a reference itself — you don't have to think about it.",
		onboarding: [
			{
				num: "01",
				title: "A Monerium account",
				text: "You open a business account with Monerium and go through their KYB. You get your own IBAN; the contract is between you and Monerium.",
			},
			{
				num: "02",
				title: "A main Safe and project Safes",
				text: "The main Safe (2 of 3 signatures) is the Monerium default wallet of your account. Every project or shop has a Safe linked to your Monerium profile — Monerium mints straight into it, by reference.",
			},
			{
				num: "03",
				title: "One signature",
				text: "For payments without a reference, the main Safe's owners (2 of 3) sign the ProjectRouter role: an EURe transfer only, to your project Safes only. Zodiac Roles enforces that onchain; a new project needs another 2/3 signature, and you can revoke the role whenever you want.",
			},
			{
				num: "04",
				title: "Key, webhook and a test payment",
				text: "You get an API key, enter your webhook URL, and we run a test payment end to end. Only then do you go live.",
			},
		],
		casesTitle: "Payments that don't go to plan",
		casesSubtitle:
			"Money is never guessed and never lost: it either reaches the project Safe or stays in your main Safe until it's resolved. Every outcome is reported by webhook.",
		casesHead: { when: "When…", what: "MPT does", event: "Webhook" },
		cases: [
			{
				when: "The buyer pays the exact amount",
				what: "“Received” on the checkout ~5 s after the buyer sends the payment, Monerium mints straight into the project Safe and “paid” ~12 s after the payment.",
				event: "payment.received → intent.paid",
			},
			{
				when: "The buyer pays from that IBAN for the first time",
				what: "Monerium reviews the first payment from a new IBAN by hand — from a few minutes to a few hours. The API flags this in advance, so the checkout can tell the buyer it will take a while. Later payments from the same IBAN clear in seconds.",
				event: "payment.received → intent.paid",
			},
			{
				when: "The reference gets lost",
				what: "Monerium mints to your main Safe. The resolver looks for your open intent with exactly that amount in a time window around the payment, or by the short code. One clear candidate → ProjectRouter forwards it to the project Safe and “paid”. No candidate or conflicting ones → the money stays in the main Safe until an operator or the owners link it to the order.",
				event: "intent.paid or forward.blocked",
			},
			{
				when: "The buyer pays too little",
				what: "The money reaches your Safe, but the intent does not become “paid”. Payments are not added up — you decide what happens to the order (top-up, refund, cancellation).",
				event: "payment.underpaid",
			},
			{
				when: "The buyer pays too much",
				what: "The intent becomes “paid”, the full amount reaches your Safe, and the webhook says how much was overpaid. You refund the difference.",
				event: "intent.paid (overpaid_cents)",
			},
			{
				when: "The buyer pays twice",
				what: "The intent is paid only once; the second payment still reaches your Safe and is reported separately. You handle the refund.",
				event: "payment.received",
			},
			{
				when: "The payment arrives after expiry",
				what: "The money reaches your Safe, the intent stays expired, and you get a separate event so you can decide whether to ship the order anyway.",
				event: "payment.late",
			},
			{
				when: "Monerium rejects the payment",
				what: "Nothing is minted and the money goes back to the payer. The webhook carries Monerium's reason.",
				event: "payment.rejected",
			},
			{
				when: "The payment isn't in euros",
				what: "MPT works with EUR only. A payment in another currency is not matched to an intent automatically; it is resolved by hand.",
				event: "forward.blocked",
			},
			{
				when: "MPT is down",
				what: "Payments keep landing on your IBAN and Safe — MPT cannot lock them. Monerium retries its notifications for up to 12 h, MPT pulls missed orders afterwards, and it retries webhooks to you for up to ~47 h.",
				event: "delivery is late, never lost",
			},
		],
		moneyTitle: "Money, refunds and bookkeeping",
		money: [
			{
				title: "How you get euros into your account",
				text: "Your Safe receives EURe — regulated e-money, 1:1 with the euro. You turn it into euros on your business account through your own Monerium account (redeem → SEPA to your IBAN), whenever and as much as you like. MPT doesn't do this for you; Monerium's fees, if your contract has any, are not part of MPT's price.",
			},
			{
				title: "Refunding a buyer",
				text: "You make refunds yourself, from your own account — the webhook gives you the payer's name and IBAN. MPT has no refund API today.",
			},
			{
				title: "No chargebacks like with cards",
				text: "A SEPA payment is not a card transaction: the buyer cannot dispute it unilaterally through a card scheme. A bank can request a return (SEPA recall) — we handle such a request with you, by hand.",
			},
			{
				title: "Bookkeeping and tax",
				text: "For every payment you have a webhook with the amount, time, and the payer's name and IBAN, and every mint and transfer leaves a public onchain trail. MPT doesn't issue invoices or handle fiscalisation. Check with your accountant how to book e-money and whether fiscalisation applies to you.",
			},
			{
				title: "Your buyers' data",
				text: "The webhook carries the payer's name and IBAN — personal data of your buyers. How we process it is part of the integration contract.",
			},
			{
				title: "Gas and limits",
				text: "The mint is Monerium's; MPT pays the gas for forwarding payments without a reference. At most €10,000 per intent; higher limits by agreement (Enterprise).",
			},
		],
		missingTitle: "What isn't there yet",
		missingSubtitle: "So there are no surprises after signing.",
		missing: [
			"A merchant dashboard — today you see payments through webhooks and onchain",
			"A refund API — you make refunds yourself",
			"The checkout page is in Croatian only",
			"Public API documentation and an SDK — we do the integration together",
			"A WooCommerce plugin; the Shopify app is awaiting release",
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
	support: {
		eyebrow: "Support MPT",
		title: "Fund MPT through MPT",
		subtitle:
			"MPT is open source (MIT), built by one developer at ITalk. A bank payment supports its development — and shows you the whole MPT flow live, just like a buyer at a merchant: received, paid, EURe in the campaign Safe.",
		sandboxEyebrow: "Support MPT · sandbox",
		sandboxTitle: "The same flow, no real money",
		sandboxSubtitle:
			"The sandbox runs the same code, rail and checkout, on Monerium's sandbox with test EURe on Chiado. A button on the checkout simulates the SEPA transfer; everything after it is the rail's real path: Monerium order, webhook, mint, live status.",
		toSandbox: "Try it without real money (sandbox)",
		toProd: "Back to the real campaign",
		howTitle: "What happens when you pay",
		how: [
			{
				title: "You pick an amount",
				body: "The page creates an MPT payment intent on the rail (tenant ITalk) — the same API a merchant calls from its checkout.",
			},
			{
				title: "You pay from your bank",
				body: "The rail's checkout shows a QR code (EPC and Croatian HUB3) with ITalk's Monerium IBAN and the reference gnosis:0x<Safe> sid:<intent>.",
			},
			{
				title: "Received → paid",
				body: "Monerium receives the SEPA transfer, MPT matches it to the intent and the checkout shows it live (~12 s to paid after receipt). A first payment from a new IBAN can wait for Monerium's review.",
			},
			{
				title: "EURe in the campaign Safe",
				body: "Monerium mints EURe straight into the campaign Safe (a 2-of-3 multisig). MPT never holds the money, and every payment is public on chain.",
			},
		],
		useTitle: "Where the money goes",
		use: [
			"Core maintenance: intents and webhooks, refunds and top-up payments, intent expiry, the resolver for payments without a reference.",
			"Security: dependency updates and fixes from an external security review.",
			"Infrastructure: Cloudflare Workers and D1, gas for the ProjectRouter.",
		],
		honestTitle: "Honestly",
		honest: [
			"The recipient is ITalk d.o.o. (Zagreb). This is support for development, not a donation in the tax sense: it is not tax-deductible and ITalk books it as revenue.",
			"A payment gives you no share, return or service in exchange.",
			"You pay MPT nothing. From a classic Croatian bank you pay your bank its transfer fee (€0.25–0.45); from Revolut the payment is free.",
			"The code is open (MIT): anyone can run this page and the rail for their own project. For a mistaken payment, write to ms@mpt.hr.",
		],
		widget: {
			title: "Pick an amount",
			lead: "The next click opens the MPT checkout with a QR code for a bank payment and live status.",
			amountLabel: "Amount",
			customLabel: "Or enter your own amount",
			pay: "Support with {amount}",
			busy: "Opening checkout…",
			notReady:
				"The campaign is being set up: its Safe is not yet created and registered on the rail. Payments open as soon as it is.",
			notes: [
				"The payment goes to ITalk's Monerium IBAN, and Monerium mints EURe straight into the campaign Safe.",
				"The checkout is valid for 15 minutes; after that, pick the amount again.",
			],
			payerTagNotice:
				"Each payment is shown publicly with initials and the last 4 characters of the IBAN (e.g. “M. S. ··1234”), never the full name or IBAN.",
			raisedLabel: "Raised",
			raisedSub: "{count} payments · {chain}",
			raisedEmpty: "The total shows once the campaign starts.",
			loading: "Reading the chain…",
			pending: "+ {amount} received, waiting for mint",
			goal: "{pct}% of the {goal} goal",
			readError: "Status is unavailable right now; retrying.",
			listTitle: "Latest payments",
			listEmpty: "No payments yet. Be the first.",
			anonymous: "Payment",
			stateMinted: "on chain",
			stateReceived: "received",
			safeLink: "Campaign Safe ({chain})",
			errors: {
				not_campaign: "The campaign is not registered on the rail yet. Try later or write to ms@mpt.hr.",
				invalid_amount: "The amount must be above €0 and at most €{max}.",
				too_many_open: "Too many open payments right now; try again in a few minutes.",
				network: "The rail is unreachable; check your connection and try again.",
				unknown: "Something is wrong with the rail; try again or write to ms@mpt.hr.",
			},
		},
	},
	cta: {
		title: "Want to accept payments through MPT?",
		subtitle:
			"Tell us about your shop, association or project and we'll come back with an integration proposal. If you want your own MPT, we help with the setup too.",
		emailLead: "or write directly to",
		community: { label: "Questions and community: t.me/mpt_hr", href: "https://t.me/mpt_hr" },
		github: { label: "Code on GitHub", href: "https://github.com/domovinatv/pay.domovina.ai" },
		support: { label: "Support MPT development", href: "/en/support" },
	},
	footer: {
		columns: [
			{
				title: "Product",
				links: [
					{ label: "How it works", href: "/#how" },
					{ label: "Integration", href: "/#integrate" },
					{ label: "For merchants", href: "/merchants" },
					{ label: "Pricing", href: "/pricing" },
					{ label: "Money flow & simulations", href: "/flow" },
					{ label: "Why now", href: "/why" },
					{ label: "Status", href: "/#status" },
					{ label: "Support MPT", href: "/support" },
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
		note: "Note: the MPT rail and checkout intents run in production (pay.domovina.ai); for now the only tenant with real money is ITalk d.o.o.; the first external tenants, Shopify and the Gnosis Pay branch are honestly labelled as in preparation. MPT is not a licensed payment service — ITalk is a non-custodial software provider that neither receives nor holds buyers' money, and regulated functions (e-money issuance, KYC/KYB) are performed by a licensed issuer (Monerium, EMI / MiCA EMT). This page is not investment or legal advice.",
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
