import type { Locale } from "@/i18n/config";

/**
 * MPT (Mint Pay Transfer) money-flow state machine.
 *
 * Single source of truth for:
 *  - the React Flow visualization (nodes + visual edges)
 *  - the step-by-step landing simulations
 *  - the vitest simulations proving the invariants
 *
 * Verified against the reference implementation and its vendored docs:
 *  - pay.domovina.ai `docs/monerium-private.md` (Monerium Private API SSOT)
 *  - pay.domovina.ai `docs/plans/gnosis-pay-cards/` (Gnosis Pay integration plan)
 *  - pay.domovina.ai `backend/` (worker `pay-domovina-backend`: webhook receiver,
 *    reference parser `monerium/sid.ts`, Zodiac forward `router/safe.ts`,
 *    payment intents `intents/`)
 *
 * Modeled rails:
 *  main rail   : HR bank -> (card, Apple/Google Pay, min 10 € Revolut product
 *                limit, card tx paid by Revolut) -> Revolut LT IBAN
 *                -> (SEPA Instant, EPC QR, allowlist prompt, min 1 € Revolut
 *                product limit, paid by Revolut, reference `mpt:0x<addr>?sid=<id>`)
 *                -> Monerium EE IBAN (issue order: placed -> pending -> processed)
 *                -> 1:1 EURe mint to the MPT main-rail Safe (2/3 multisig,
 *                Monerium default wallet) -> backend worker `pay-domovina-backend`
 *                forwards via the Zodiac Roles module (EUReForwarder role,
 *                constrained router EOA pays gas) -> user address
 *  after rail  : P2P onchain transfers, MPT checkout intents
 *                (pending -> paid on onchain confirmation | expired;
 *                > 0 € and <= 10 000 € per intent) — production: pay.domovina.ai
 *  off-ramp    : own Monerium account (KYC/KYB) -> signed redeem -> free SEPA
 *                Instant back to any European bank — circle closed
 *  alt branch  : Gnosis Pay VISA (pre-pilot plan): GP deploys its OWN Safe per
 *                user (Two-Safe model, Delay + Roles modules), Sumsub KYC,
 *                virtual card free; funding = plain EURe transfer from the
 *                user's Safe over the existing sponsored rail
 */

export type L10n = Record<Locale, string>;

export type NodeId =
	| "bank"
	| "revolut"
	| "moneriumMpt"
	| "safeRelayer"
	| "userAddress"
	| "otherAddress"
	| "merchant"
	| "gnosisPay"
	| "ownMonerium";

export type FeePayer = "revolut" | "monerium" | "mpt" | "gnosispay" | "none";

export interface FlowNode {
	id: NodeId;
	title: L10n;
	subtitle: L10n;
	badge?: L10n;
	/** visual position in the diagram */
	x: number;
	y: number;
	side?: boolean; // right-branch node
}

export type EdgeId =
	| "e-card"
	| "e-sepa"
	| "e-mint"
	| "e-relay"
	| "e-p2p"
	| "e-checkout"
	| "e-gp-fund"
	| "e-gp-spend"
	| "e-gp-revolut"
	| "e-redeem"
	| "e-offramp";

export interface FlowEdge {
	id: EdgeId;
	source: NodeId;
	target: NodeId;
	label: L10n;
	lateral?: boolean; // leaves from the right handle, enters the left handle
}

export type TransitionId =
	| "cardTopup"
	| "scanEpcQr"
	| "confirmAllowlist"
	| "revolutInternalCheck"
	| "sepaToMonerium"
	| "moneriumVerify"
	| "mintEure"
	| "relaySponsoredTx"
	| "onchainTransfer"
	| "payCheckoutIntent"
	| "issueGnosisPayVisa"
	| "fundGnosisPay"
	| "gnosisPayCardSpend"
	| "topupRevolutFromGnosisPay"
	| "openMoneriumKyc"
	| "redeemEure"
	| "sepaInstantOfframp";

export interface Transition {
	id: TransitionId;
	/** where the money must be for this event; null = process event, moves nothing */
	from: NodeId | null;
	to: NodeId | null;
	/** visual edge to highlight while this event plays */
	edge: EdgeId;
	label: L10n;
	description: L10n;
	/** who covers the cost of this step — the user always pays 0 € */
	feePayer: FeePayer;
	feeNote: L10n;
	minAmount?: number;
	maxAmount?: number;
	/** process events don't move money (KYC, card issuance, checks, QR scan) */
	movesMoney: boolean;
}

export interface ScenarioStep {
	t: TransitionId;
	/** EUR amount for money-moving steps */
	amount?: number;
}

export interface Scenario {
	id: string;
	name: L10n;
	description: L10n;
	/** starting balance on the HR bank account */
	initialAmount: number;
	steps: ScenarioStep[];
}

export interface SimStep {
	index: number;
	transition: Transition;
	amount: number;
	status: "ok" | "rejected";
	rejectReason?: L10n;
	/** where the money sits after this step */
	location: NodeId;
	balances: Record<NodeId, number>;
	userFeesTotal: number;
	sponsoredBy: Partial<Record<FeePayer, number>>;
}

// ---------------------------------------------------------------------------
// Nodes
// ---------------------------------------------------------------------------

export const nodes: FlowNode[] = [
	{
		id: "bank",
		title: { hr: "Banka u eurozoni", en: "Eurozone bank" },
		subtitle: {
			hr: "PBZ · ZABA · OTP · Erste · HPB … ili bilo koja banka s IBAN-om u eurozoni · debitna kartica (Mastercard/VISA)",
			en: "PBZ · ZABA · OTP · Erste · HPB … or any bank with an IBAN in the eurozone · debit card (Mastercard/VISA)",
		},
		badge: { hr: "Početak i kraj", en: "Start & end" },
		x: 0,
		y: 0,
	},
	{
		id: "revolut",
		title: { hr: "Revolut", en: "Revolut" },
		subtitle: {
			hr: "Litavski IBAN · kartični top-up i SEPA Instant — oboje plaća Revolut",
			en: "Lithuanian IBAN · card top-up and SEPA Instant — both paid by Revolut",
		},
		x: 0,
		y: 230,
	},
	{
		id: "moneriumMpt",
		title: { hr: "Monerium (MPT IBAN)", en: "Monerium (MPT IBAN)" },
		subtitle: {
			hr: "Estonski IBAN · licencirani EMI · issue order: placed → pending → processed",
			en: "Estonian IBAN · licensed EMI · issue order: placed → pending → processed",
		},
		x: 0,
		y: 460,
	},
	{
		id: "safeRelayer",
		title: { hr: "MPT main-rail Safe", en: "MPT main-rail Safe" },
		subtitle: {
			hr: "2/3 multisig, Moneriumov default wallet · backend worker forwarda kroz Zodiac Roles modul",
			en: "2/3 multisig, Monerium default wallet · backend worker forwards via the Zodiac Roles module",
		},
		badge: { hr: "MPT rail", en: "MPT rail" },
		x: 0,
		y: 690,
	},
	{
		id: "userAddress",
		title: { hr: "Korisnikova Gnosis adresa", en: "User's Gnosis address" },
		subtitle: {
			hr: "EURe u samoskrbništvu · onchain transakcije, checkout, kartica ili off-ramp",
			en: "Self-custodied EURe · onchain transfers, checkout, card or off-ramp",
		},
		badge: { hr: "EURe", en: "EURe" },
		x: 0,
		y: 920,
	},
	{
		id: "otherAddress",
		title: { hr: "Druga onchain adresa", en: "Another onchain address" },
		subtitle: {
			hr: "P2P transferi na Gnosis Chainu — gas dijelić centa",
			en: "P2P transfers on Gnosis Chain — gas is a fraction of a cent",
		},
		x: 360,
		y: 690,
		side: true,
	},
	{
		id: "merchant",
		title: { hr: "Trgovac / primatelj", en: "Merchant / payee" },
		subtitle: {
			hr: "MPT checkout intenti (pending → paid → expired) — produkcija: pay.domovina.ai",
			en: "MPT checkout intents (pending → paid → expired) — production: pay.domovina.ai",
		},
		x: 360,
		y: 920,
		side: true,
	},
	{
		id: "gnosisPay",
		title: { hr: "Gnosis Pay VISA (GP Safe)", en: "Gnosis Pay VISA (GP Safe)" },
		subtitle: {
			hr: "GP deploya vlastiti Safe (Delay + Roles moduli) · virtualna kartica besplatna · Sumsub KYC · Apple/Google Pay u HR — integracija u pripremi",
			en: "GP deploys its own Safe (Delay + Roles modules) · virtual card free · Sumsub KYC · Apple/Google Pay in HR — integration in preparation",
		},
		x: 360,
		y: 1150,
		side: true,
	},
	{
		id: "ownMonerium",
		title: { hr: "Vlastiti Monerium račun", en: "Own Monerium account" },
		subtitle: {
			hr: "KYC/KYB · potpisani redeem — EURe natrag u eure 1:1 (≥ 15.000 € traži dokument)",
			en: "KYC/KYB · signed redeem — EURe back to euros 1:1 (≥ €15,000 needs a document)",
		},
		x: 0,
		y: 1150,
	},
];

// ---------------------------------------------------------------------------
// Visual edges
// ---------------------------------------------------------------------------

export const edges: FlowEdge[] = [
	{
		id: "e-card",
		source: "bank",
		target: "revolut",
		label: {
			hr: "Apple Pay / Google Pay · min 10 € (Revolutov limit) · 0 € (plaća Revolut)",
			en: "Apple Pay / Google Pay · min €10 (Revolut limit) · €0 (Revolut pays)",
		},
	},
	{
		id: "e-sepa",
		source: "revolut",
		target: "moneriumMpt",
		label: {
			hr: "SEPA Instant · EPC QR · referenca mpt:0x…?sid=… · 0 € (plaća Revolut)",
			en: "SEPA Instant · EPC QR · reference mpt:0x…?sid=… · €0 (Revolut pays)",
		},
	},
	{
		id: "e-mint",
		source: "moneriumMpt",
		target: "safeRelayer",
		label: {
			hr: "issue order processed · mint EURe 1:1 (~5–15 s)",
			en: "issue order processed · 1:1 EURe mint (~5–15 s)",
		},
	},
	{
		id: "e-relay",
		source: "safeRelayer",
		target: "userAddress",
		label: {
			hr: "Zodiac Roles forward · gas plaća MPT router",
			en: "Zodiac Roles forward · gas paid by the MPT router",
		},
	},
	{
		id: "e-p2p",
		source: "userAddress",
		target: "otherAddress",
		label: { hr: "onchain transferi", en: "onchain transfers" },
		lateral: true,
	},
	{
		id: "e-checkout",
		source: "userAddress",
		target: "merchant",
		label: {
			hr: "checkout intent · paid na onchain potvrdi",
			en: "checkout intent · paid on onchain confirmation",
		},
		lateral: true,
	},
	{
		id: "e-gp-fund",
		source: "userAddress",
		target: "gnosisPay",
		label: {
			hr: "punjenje kartice = EURe transfer na GP Safe · 0 €",
			en: "card funding = EURe transfer to the GP Safe · €0",
		},
		lateral: true,
	},
	{
		id: "e-gp-spend",
		source: "gnosisPay",
		target: "merchant",
		label: {
			hr: "VISA autorizacija kroz Roles modul (< 2 s)",
			en: "VISA authorization via the Roles module (< 2 s)",
		},
		lateral: true,
	},
	{
		id: "e-gp-revolut",
		source: "gnosisPay",
		target: "revolut",
		label: {
			hr: "top-up Revoluta GP VISA karticom · 0 €",
			en: "Revolut top-up with the GP VISA card · €0",
		},
		lateral: true,
	},
	{
		id: "e-redeem",
		source: "userAddress",
		target: "ownMonerium",
		label: { hr: "KYC/KYB · potpisani redeem EURe", en: "KYC/KYB · signed EURe redeem" },
	},
	{
		id: "e-offramp",
		source: "ownMonerium",
		target: "bank",
		label: {
			hr: "besplatni SEPA Instant off-ramp natrag u banku · 0 € (plaća Monerium)",
			en: "free SEPA Instant off-ramp back to the bank · €0 (Monerium pays)",
		},
	},
];

// ---------------------------------------------------------------------------
// Transitions (the state machine)
// ---------------------------------------------------------------------------

export const transitions: Transition[] = [
	{
		id: "cardTopup",
		from: "bank",
		to: "revolut",
		edge: "e-card",
		label: { hr: "Kartični top-up na Revolut", en: "Card top-up to Revolut" },
		description: {
			hr: "Debitnom karticom svoje banke (Mastercard/VISA) — hrvatske ili bilo koje eurozonske — preko Apple Paya ili Google Paya korisnik napuni Revolut. S IBAN-a banke odlazi puni iznos i puni iznos stiže na litavski IBAN. Minimum od 10 € je Revolutovo produktno pravilo.",
			en: "Using their bank's debit card (Mastercard/VISA) — Croatian or any eurozone bank — via Apple Pay or Google Pay, the user tops up Revolut. The full amount leaves the bank's IBAN and the full amount arrives on the Lithuanian IBAN. The €10 minimum is a Revolut product rule.",
		},
		feePayer: "revolut",
		feeNote: {
			hr: "Kartičnu transakciju plaća Revolut (trošak preuzima kroz svoj marketing).",
			en: "Revolut pays the card transaction (absorbed as marketing cost).",
		},
		minAmount: 10,
		movesMoney: true,
	},
	{
		id: "scanEpcQr",
		from: "revolut",
		to: "revolut",
		edge: "e-sepa",
		label: { hr: "Skeniranje EPC QR koda", en: "Scan the EPC QR code" },
		description: {
			hr: "U Revolutu korisnik skenira EPC QR kod (EPC069-12, strogi 10-linijski format usklađen baš s Revolutovim skenerom) ili ručno unese IBAN. SEPA plaćanje je po defaultu SEPA Instant.",
			en: "In Revolut the user scans the EPC QR code (EPC069-12, the strict 10-line layout tuned for Revolut's scanner) or enters the IBAN manually. SEPA payments default to SEPA Instant.",
		},
		feePayer: "none",
		feeNote: { hr: "Procesni korak — ništa se ne naplaćuje.", en: "Process step — nothing is charged." },
		movesMoney: false,
	},
	{
		id: "confirmAllowlist",
		from: "revolut",
		to: "revolut",
		edge: "e-sepa",
		label: { hr: "Potvrda liste dozvoljenih primatelja", en: "Confirm the recipient allowlist" },
		description: {
			hr: "Revolut pita korisnika želi li primatelja dodati na listu dozvoljenih računa na koje se šalje novac — korisnik potvrdi.",
			en: "Revolut asks the user whether to add the payee to the list of allowed recipient accounts — the user confirms.",
		},
		feePayer: "none",
		feeNote: { hr: "Procesni korak — ništa se ne naplaćuje.", en: "Process step — nothing is charged." },
		movesMoney: false,
	},
	{
		id: "revolutInternalCheck",
		from: "revolut",
		to: "revolut",
		edge: "e-sepa",
		label: { hr: "Revolutove interne provjere", en: "Revolut internal checks" },
		description: {
			hr: "Revolut radi interne provjere transakcije i, ako je sve u redu, šalje plaćanje prema Moneriumu.",
			en: "Revolut runs its internal checks on the transaction and, if everything passes, sends the payment towards Monerium.",
		},
		feePayer: "none",
		feeNote: { hr: "Procesni korak — ništa se ne naplaćuje.", en: "Process step — nothing is charged." },
		movesMoney: false,
	},
	{
		id: "sepaToMonerium",
		from: "revolut",
		to: "moneriumMpt",
		edge: "e-sepa",
		label: { hr: "SEPA Instant prema Moneriumu", en: "SEPA Instant to Monerium" },
		description: {
			hr: "SEPA Instant na Moneriumov estonski IBAN. U referenci plaćanja piše kamo novac dalje ide: mpt:0x<adresa>?sid=<id> (podržani su i gnosis:0x…, cmp:0x… za kampanje i gola 0x adresa). SEPA charset pretvara '=' u '.', pa parser tolerira oba oblika. Minimum od 1 € je Revolutovo pravilo.",
			en: "SEPA Instant to Monerium's Estonian IBAN. The payment reference says where the money goes next: mpt:0x<address>?sid=<id> (gnosis:0x…, cmp:0x… for campaigns and a bare 0x address are also supported). The SEPA charset maps '=' to '.', so the parser tolerates both forms. The €1 minimum is a Revolut rule.",
		},
		feePayer: "revolut",
		feeNote: { hr: "SEPA transakciju plaća Revolut.", en: "Revolut pays the SEPA transaction." },
		minAmount: 1,
		movesMoney: true,
	},
	{
		id: "moneriumVerify",
		from: "moneriumMpt",
		to: "moneriumMpt",
		edge: "e-mint",
		label: { hr: "Monerium obrađuje issue order", en: "Monerium processes the issue order" },
		description: {
			hr: "Kad SEPA stigne na IBAN, Monerium automatski kreira issue order (placed → pending → processed). Webhook order.created stiže backendu 4–5 s nakon SEPA Instant uplate.",
			en: "When the SEPA arrives on the IBAN, Monerium automatically creates an issue order (placed → pending → processed). The order.created webhook reaches the backend 4–5 s after the SEPA Instant payment.",
		},
		feePayer: "none",
		feeNote: { hr: "Procesni korak — ništa se ne naplaćuje.", en: "Process step — nothing is charged." },
		movesMoney: false,
	},
	{
		id: "mintEure",
		from: "moneriumMpt",
		to: "safeRelayer",
		edge: "e-mint",
		label: { hr: "Mint EURe 1:1", en: "1:1 EURe mint" },
		description: {
			hr: "Monerium minta EURe (1:1 s eurom) na svoj default wallet — MPT main-rail Safe (2/3 multisig) na Gnosis Chainu. Onchain mint se potvrdi tipično 5–15 s nakon uplate.",
			en: "Monerium mints EURe (1:1 with the euro) to its default wallet — the MPT main-rail Safe (a 2/3 multisig) on Gnosis Chain. The onchain mint confirms typically 5–15 s after the payment.",
		},
		feePayer: "monerium",
		feeNote: { hr: "Mint je besplatan.", en: "Minting is free." },
		movesMoney: true,
	},
	{
		id: "relaySponsoredTx",
		from: "safeRelayer",
		to: "userAddress",
		edge: "e-relay",
		label: { hr: "Backend forwarda EURe s Safea", en: "The backend forwards the EURe from the Safe" },
		description: {
			hr: "Backend worker (pay-domovina-backend na Cloudflare Workers) na webhook 'processed' pročita adresu iz reference i izvrši transfer kroz Zodiac Roles modul (rola EUReForwarder — smije samo EURe.transfer). Potpisuje ograničeni router EOA koji plaća gas. Ako referenca nema adresu, sredstva ostaju parkirana na Safeu.",
			en: "On the 'processed' webhook, the backend worker (pay-domovina-backend on Cloudflare Workers) reads the address from the reference and executes the transfer through the Zodiac Roles module (EUReForwarder role — allowed only EURe.transfer). A constrained router EOA signs and pays the gas. If the reference carries no address, the funds stay parked in the Safe.",
		},
		feePayer: "mpt",
		feeNote: { hr: "Gas plaća MPT-ov router EOA — dijelić centa.", en: "Gas is paid by the MPT router EOA — a fraction of a cent." },
		movesMoney: true,
	},
	{
		id: "onchainTransfer",
		from: "userAddress",
		to: "otherAddress",
		edge: "e-p2p",
		label: { hr: "Onchain transfer", en: "Onchain transfer" },
		description: {
			hr: "Korisnik slobodno raspolaže EURe — može raditi više onchain transakcija na Gnosis Chainu prema bilo kojoj adresi. Wallet relayer sponzorira gas (limit 5 besplatnih dnevno po potpisniku).",
			en: "The user freely controls the EURe — multiple onchain transactions on Gnosis Chain to any address. The wallet relayer sponsors gas (limit of 5 free per signer per day).",
		},
		feePayer: "mpt",
		feeNote: {
			hr: "Gas sponzorira MPT wallet relayer — dijelić centa.",
			en: "Gas sponsored by the MPT wallet relayer — a fraction of a cent.",
		},
		movesMoney: true,
	},
	{
		id: "payCheckoutIntent",
		from: "userAddress",
		to: "merchant",
		edge: "e-checkout",
		label: { hr: "Plaćanje checkout intenta", en: "Pay a checkout intent" },
		description: {
			hr: "Checkout intent (stanja pending → paid → expired) veže iznos, primatelja i sid. Guardovi u kodu: iznos > 0 €, max 10.000 € po intentu, TTL default 15 min. 'Paid' se upisuje tek na onchain potvrdi transfera. U produkciji na pay.domovina.ai.",
			en: "A checkout intent (states pending → paid → expired) binds the amount, payee and sid. Code guards: amount > €0, max €10,000 per intent, default TTL 15 min. 'Paid' is recorded only on onchain confirmation of the transfer. In production at pay.domovina.ai.",
		},
		feePayer: "none",
		feeNote: { hr: "Bez naknade za korisnika.", en: "No fee for the user." },
		maxAmount: 10000,
		movesMoney: true,
	},
	{
		id: "issueGnosisPayVisa",
		from: null,
		to: null,
		edge: "e-gp-fund",
		label: { hr: "Izdavanje Gnosis Pay VISA kartice", en: "Gnosis Pay VISA card issuance" },
		description: {
			hr: "Gnosis Pay deploya korisniku VLASTITI GP Safe (vlasništvo spaljeno, kontrola kroz Delay modul uz 3-min cooldown) i izdaje besplatnu virtualnu VISA karticu (max 5, instantno aktivirana). Obavezan je GP-ov Sumsub KYC; opcionalan osobni Monerium IBAN. Apple Pay / Google Pay rade u HR (ručni unos kartice). Status: pre-pilot integracija u pripremi.",
			en: "Gnosis Pay deploys the user's OWN GP Safe (ownership burned, control via the Delay module with a 3-min cooldown) and issues a free virtual VISA card (max 5, instantly activated). GP's Sumsub KYC is mandatory; a personal Monerium IBAN is optional. Apple Pay / Google Pay work in Croatia (manual card entry). Status: pre-pilot integration in preparation.",
		},
		feePayer: "gnosispay",
		feeNote: { hr: "Virtualna kartica se izdaje besplatno.", en: "The virtual card is issued for free." },
		movesMoney: false,
	},
	{
		id: "fundGnosisPay",
		from: "userAddress",
		to: "gnosisPay",
		edge: "e-gp-fund",
		label: { hr: "Punjenje Gnosis Pay kartice", en: "Fund the Gnosis Pay card" },
		description: {
			hr: "Punjenje kartice je običan EURe transfer s korisnikove adrese na GP Safe — ide postojećim sponzoriranim railom bez ijedne izmjene. Povlačenje natrag je gasless uz 3-min delay.",
			en: "Funding the card is a plain EURe transfer from the user's address to the GP Safe — over the existing sponsored rail with no changes. Withdrawing back is gasless with a 3-min delay.",
		},
		feePayer: "mpt",
		feeNote: { hr: "Gas sponzorira MPT relayer — za korisnika 0 €.", en: "Gas sponsored by the MPT relayer — €0 for the user." },
		movesMoney: true,
	},
	{
		id: "gnosisPayCardSpend",
		from: "gnosisPay",
		to: "merchant",
		edge: "e-gp-spend",
		label: { hr: "Plaćanje Gnosis Pay VISA karticom", en: "Pay with the Gnosis Pay VISA card" },
		description: {
			hr: "VISA autorizacija ide kroz Roles modul (scoped spender) — instantno onchain, ukupno < 2 s na POS-u; clearing prema trgovcu 24–48 h. Dnevni limit default 350 EURe (raspon 1–8000).",
			en: "The VISA authorization goes through the Roles module (scoped spender) — instant onchain, < 2 s total at the POS; merchant clearing in 24–48 h. Daily limit defaults to 350 EURe (range 1–8000).",
		},
		feePayer: "gnosispay",
		feeNote: { hr: "Bez naknade za korisnika.", en: "No fee for the user." },
		movesMoney: true,
	},
	{
		id: "topupRevolutFromGnosisPay",
		from: "gnosisPay",
		to: "revolut",
		edge: "e-gp-revolut",
		label: { hr: "Top-up Revoluta GP VISA karticom", en: "Revolut top-up with the GP VISA card" },
		description: {
			hr: "Gnosis Pay VISA je obična VISA debitna kartica — korisnik je doda u Revolut i njome besplatno napuni Revolut. Time se krug može vrtjeti i kroz karticu: EURe s GP Safea natrag u Revolut, bez ijedne naknade.",
			en: "The Gnosis Pay VISA is a regular VISA debit card — the user adds it to Revolut and tops Revolut up with it for free. The circle can thus also spin through the card: EURe from the GP Safe back into Revolut, with no fee.",
		},
		feePayer: "revolut",
		feeNote: {
			hr: "Kartični top-up plaća Revolut — za korisnika 0 €.",
			en: "Revolut pays the card top-up — €0 for the user.",
		},
		minAmount: 10,
		movesMoney: true,
	},
	{
		id: "openMoneriumKyc",
		from: null,
		to: null,
		edge: "e-redeem",
		label: { hr: "Otvaranje vlastitog Monerium računa", en: "Open an own Monerium account" },
		description: {
			hr: "Za off-ramp korisnik otvori vlastiti Monerium račun uz KYC/KYB provjeru i poveže svoju adresu (potpisom fiksne poruke o vlasništvu adrese).",
			en: "For the off-ramp the user opens their own Monerium account with KYC/KYB verification and links their address (by signing the fixed address-ownership message).",
		},
		feePayer: "none",
		feeNote: { hr: "Otvaranje računa je besplatno.", en: "Opening the account is free." },
		movesMoney: false,
	},
	{
		id: "redeemEure",
		from: "userAddress",
		to: "ownMonerium",
		edge: "e-redeem",
		label: { hr: "Potpisani redeem EURe", en: "Signed EURe redeem" },
		description: {
			hr: "Korisnik potpiše redeem nalog porukom iz svojeg walleta (EOA ili smart account preko EIP-1271) — EURe se otkupljuje 1:1 natrag u eure. Nalozi od 15.000 € i više traže popratni dokument.",
			en: "The user signs the redeem order with a message from their wallet (EOA or smart account via EIP-1271) — EURe is redeemed 1:1 back into euros. Orders of €15,000 and above require a supporting document.",
		},
		feePayer: "monerium",
		feeNote: { hr: "Redeem je besplatan.", en: "Redeem is free." },
		movesMoney: true,
	},
	{
		id: "sepaInstantOfframp",
		from: "ownMonerium",
		to: "bank",
		edge: "e-offramp",
		label: { hr: "Besplatni SEPA Instant off-ramp", en: "Free SEPA Instant off-ramp" },
		description: {
			hr: "Monerium napravi besplatnu SEPA Instant uplatu natrag na istu banku s koje je krug krenuo — ili bilo koju drugu banku s IBAN-om u eurozoni. Krug završava u točki u kojoj je i počeo.",
			en: "Monerium makes a free SEPA Instant payment back to the same bank the circle started from — or any other bank with a eurozone IBAN. The circle ends exactly where it began.",
		},
		feePayer: "monerium",
		feeNote: { hr: "SEPA Instant off-ramp plaća Monerium — besplatan je.", en: "Monerium pays the SEPA Instant off-ramp — it is free." },
		movesMoney: true,
	},
];

export const transitionById = Object.fromEntries(transitions.map((t) => [t.id, t])) as Record<
	TransitionId,
	Transition
>;

// ---------------------------------------------------------------------------
// Scenarios — the N simulations
// ---------------------------------------------------------------------------

/** the common on-ramp prefix used by most scenarios */
const onramp = (amount: number): ScenarioStep[] => [
	{ t: "cardTopup", amount },
	{ t: "scanEpcQr" },
	{ t: "confirmAllowlist" },
	{ t: "revolutInternalCheck" },
	{ t: "sepaToMonerium", amount },
	{ t: "moneriumVerify" },
	{ t: "mintEure", amount },
	{ t: "relaySponsoredTx", amount },
];

export const scenarios: Scenario[] = [
	{
		id: "onramp",
		name: { hr: "1 · On-ramp: banka → EURe", en: "1 · On-ramp: bank → EURe" },
		description: {
			hr: "Osnovni tok: 10 € s hrvatske banke do EURe na korisnikovoj Gnosis adresi — svaki korak 0 € za korisnika.",
			en: "The core flow: €10 from a Croatian bank to EURe on the user's Gnosis address — every step €0 for the user.",
		},
		initialAmount: 10,
		steps: onramp(10),
	},
	{
		id: "full-circle",
		name: { hr: "2 · Puni krug: banka → banka", en: "2 · Full circle: bank → bank" },
		description: {
			hr: "Cijeli krug: on-ramp, KYC na vlastitom Monerium računu, potpisani redeem i besplatni SEPA Instant off-ramp natrag u istu banku iz koje je krug krenuo. 50 € ode — 50 € se vrati.",
			en: "The whole circle: on-ramp, KYC on an own Monerium account, a signed redeem and a free SEPA Instant off-ramp back to the very bank the circle started from. €50 leaves — €50 comes back.",
		},
		initialAmount: 50,
		steps: [
			...onramp(50),
			{ t: "openMoneriumKyc" },
			{ t: "redeemEure", amount: 50 },
			{ t: "sepaInstantOfframp", amount: 50 },
		],
	},
	{
		id: "p2p",
		name: { hr: "3 · Onchain P2P transferi", en: "3 · Onchain P2P transfers" },
		description: {
			hr: "Nakon on-rampa korisnik radi više onchain transakcija — 20 € i 10 € na druge adrese, 20 € ostaje.",
			en: "After the on-ramp the user makes multiple onchain transactions — €20 and €10 to other addresses, €20 remains.",
		},
		initialAmount: 50,
		steps: [
			...onramp(50),
			{ t: "onchainTransfer", amount: 20 },
			{ t: "onchainTransfer", amount: 10 },
		],
	},
	{
		id: "checkout",
		name: { hr: "4 · MPT checkout intent", en: "4 · MPT checkout intent" },
		description: {
			hr: "Plaćanje trgovcu preko MPT checkout intenta (pending → paid na onchain potvrdi) — u produkciji na pay.domovina.ai.",
			en: "Paying a merchant through an MPT checkout intent (pending → paid on onchain confirmation) — in production at pay.domovina.ai.",
		},
		initialAmount: 25,
		steps: [...onramp(25), { t: "payCheckoutIntent", amount: 25 }],
	},
	{
		id: "gnosis-pay",
		name: { hr: "5 · Gnosis Pay VISA grana", en: "5 · Gnosis Pay VISA branch" },
		description: {
			hr: "Alternativna grana (u pripremi): besplatna virtualna VISA na vlastitom GP Safeu, punjenje EURe transferom, plaćanje na POS-u — a ostatkom se karticom besplatno napuni Revolut i krug se vrti dalje.",
			en: "The alternative branch (in preparation): a free virtual VISA on the user's own GP Safe, funded by an EURe transfer, a POS payment — and the rest tops Revolut back up via the card for free, so the circle keeps spinning.",
		},
		initialAmount: 25,
		steps: [
			...onramp(25),
			{ t: "issueGnosisPayVisa" },
			{ t: "fundGnosisPay", amount: 25 },
			{ t: "gnosisPayCardSpend", amount: 12.5 },
			{ t: "topupRevolutFromGnosisPay", amount: 12.5 },
		],
	},
	{
		id: "guards",
		name: { hr: "6 · Zaštitni limiti (guardovi)", en: "6 · Guard limits" },
		description: {
			hr: "Što odbijaju pravila: kartični top-up ispod 10 € i SEPA ispod 1 € (Revolutovi produktni limiti) se odbijaju, zatim ispravni iznosi prolaze. MPT-ov vlastiti guard: intent max 10.000 €.",
			en: "What the rules reject: a card top-up below €10 and a SEPA below €1 (Revolut product limits) get rejected, then valid amounts pass. MPT's own guard: intents max €10,000.",
		},
		initialAmount: 10,
		steps: [
			{ t: "cardTopup", amount: 9.99 },
			{ t: "cardTopup", amount: 10 },
			{ t: "scanEpcQr" },
			{ t: "confirmAllowlist" },
			{ t: "revolutInternalCheck" },
			{ t: "sepaToMonerium", amount: 0.5 },
			{ t: "sepaToMonerium", amount: 10 },
			{ t: "moneriumVerify" },
			{ t: "mintEure", amount: 10 },
			{ t: "relaySponsoredTx", amount: 10 },
		],
	},
];

// ---------------------------------------------------------------------------
// Simulator
// ---------------------------------------------------------------------------

const rejectBelowMin: L10n = {
	hr: "Odbijeno: iznos je ispod minimalnog limita za ovaj korak.",
	en: "Rejected: the amount is below this step's minimum limit.",
};

const rejectAboveMax: L10n = {
	hr: "Odbijeno: iznos je iznad maksimalnog limita za ovaj korak.",
	en: "Rejected: the amount is above this step's maximum limit.",
};

const rejectInsufficient: L10n = {
	hr: "Odbijeno: na polaznom računu nema dovoljno sredstava.",
	en: "Rejected: insufficient funds at the source of this step.",
};

export function simulate(scenario: Scenario): SimStep[] {
	const balances = Object.fromEntries(nodes.map((n) => [n.id, 0])) as Record<NodeId, number>;
	balances.bank = scenario.initialAmount;

	let location: NodeId = "bank";
	const sponsoredBy: Partial<Record<FeePayer, number>> = {};
	const steps: SimStep[] = [];

	for (const [index, s] of scenario.steps.entries()) {
		const t = transitionById[s.t];
		const amount = s.amount ?? 0;
		let status: SimStep["status"] = "ok";
		let rejectReason: L10n | undefined;

		if (t.movesMoney) {
			if (t.from === null || t.to === null) {
				throw new Error(`transition ${t.id} moves money but has no from/to`);
			}
			if (t.minAmount !== undefined && amount < t.minAmount) {
				status = "rejected";
				rejectReason = rejectBelowMin;
			} else if (t.maxAmount !== undefined && amount > t.maxAmount) {
				status = "rejected";
				rejectReason = rejectAboveMax;
			} else if (balances[t.from] + 1e-9 < amount) {
				status = "rejected";
				rejectReason = rejectInsufficient;
			} else {
				balances[t.from] = Math.round((balances[t.from] - amount) * 100) / 100;
				balances[t.to] = Math.round((balances[t.to] + amount) * 100) / 100;
				location = t.to;
			}
		} else if (t.from !== null && t.from !== location) {
			throw new Error(
				`scenario ${scenario.id}: step ${index} (${t.id}) expects money at ${t.from} but it is at ${location}`,
			);
		}

		if (status === "ok" && t.feePayer !== "none") {
			sponsoredBy[t.feePayer] = (sponsoredBy[t.feePayer] ?? 0) + 1;
		}

		steps.push({
			index,
			transition: t,
			amount,
			status,
			rejectReason,
			location,
			balances: { ...balances },
			userFeesTotal: 0, // the invariant this whole project demonstrates
			sponsoredBy: { ...sponsoredBy },
		});
	}

	return steps;
}

/** sum of all balances — must stay equal to initialAmount at every step (1:1, no leakage) */
export function totalBalance(balances: Record<NodeId, number>): number {
	return Math.round(Object.values(balances).reduce((a, b) => a + b, 0) * 100) / 100;
}

/**
 * The subset of the full directed graph a scenario actually exercises —
 * everything else is rendered dimmed so scenarios read as subsets of the whole.
 */
export function scenarioSubset(scenario: Scenario): { nodes: Set<NodeId>; edges: Set<EdgeId> } {
	const nodeSet = new Set<NodeId>();
	const edgeSet = new Set<EdgeId>();
	for (const s of scenario.steps) {
		const t = transitionById[s.t];
		edgeSet.add(t.edge);
		if (t.from) nodeSet.add(t.from);
		if (t.to) nodeSet.add(t.to);
	}
	return { nodes: nodeSet, edges: edgeSet };
}
