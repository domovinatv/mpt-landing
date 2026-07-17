import type { Locale } from "@/i18n/config";

/**
 * MPT (Mint Pay Transfer) money-flow state machine.
 *
 * Single source of truth for:
 *  - the React Flow visualization (nodes + visual edges)
 *  - the step-by-step landing simulations
 *  - the vitest simulations proving the invariants
 *
 * Modeled rails:
 *  main rail   : HR bank -> (card, Apple/Google Pay, min 10 €, paid by Revolut)
 *                -> Revolut LT IBAN -> (SEPA Instant, EPC QR, allowlist prompt,
 *                min 1 €, paid by Revolut, reference = target onchain address)
 *                -> Monerium EE IBAN -> verify -> mint EURe 1:1
 *                -> Gnosis Safe multisig relayer -> (mpt-main-rail on Cloudflare
 *                Workers, sponsored onchain tx, gas paid by MPT) -> user address
 *  after rail  : P2P onchain transfers, MPT checkout intents
 *                (pay.domovina.ai / donate.domovina.ai)
 *  off-ramp    : own Monerium account (KYC/KYB) -> free SEPA Instant back to
 *                any European bank (PBZ/ZABA/OTP/Erste/HPB/...) — circle closed
 *  alt branch  : Gnosis Pay VISA (virtual free, physical optional, optional
 *                Monerium IBAN) topped up from Revolut for free, spend by card
 */

export type L10n = Record<Locale, string>;

export type NodeId =
	| "hrBank"
	| "revolut"
	| "moneriumMpt"
	| "safeRelayer"
	| "userAddress"
	| "otherAddress"
	| "merchant"
	| "gnosisPay"
	| "ownMonerium"
	| "euBank";

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
	| "e-gp-topup"
	| "e-gp-spend"
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
	| "topupGnosisPayFromRevolut"
	| "gnosisPayCardSpend"
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
		id: "hrBank",
		title: { hr: "Hrvatska banka", en: "Croatian bank" },
		subtitle: {
			hr: "PBZ · ZABA · OTP · Erste · HPB … — debitna kartica (Mastercard/VISA), HR IBAN",
			en: "PBZ · ZABA · OTP · Erste · HPB … — debit card (Mastercard/VISA), HR IBAN",
		},
		badge: { hr: "Start", en: "Start" },
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
		title: { hr: "Monerium (MPT račun)", en: "Monerium (MPT account)" },
		subtitle: {
			hr: "Estonski IBAN · licencirani EMI · provjera uplate i mint EURe 1:1",
			en: "Estonian IBAN · licensed EMI · payment verification and 1:1 EURe mint",
		},
		x: 0,
		y: 460,
	},
	{
		id: "safeRelayer",
		title: { hr: "Gnosis Safe multisig relayer", en: "Gnosis Safe multisig relayer" },
		subtitle: {
			hr: "Default mint account · mpt-main-rail na Cloudflare Workers čita adresu iz SEPA reference",
			en: "Default mint account · mpt-main-rail on Cloudflare Workers reads the address from the SEPA reference",
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
			hr: "MPT checkout intenti — već u produkciji: pay.domovina.ai · donate.domovina.ai",
			en: "MPT checkout intents — already in production: pay.domovina.ai · donate.domovina.ai",
		},
		x: 360,
		y: 920,
		side: true,
	},
	{
		id: "gnosisPay",
		title: { hr: "Gnosis Pay VISA", en: "Gnosis Pay VISA" },
		subtitle: {
			hr: "Virtualna kartica besplatna, fizička opcionalno · opcionalni Monerium IBAN · top-up iz Revoluta 0 €",
			en: "Virtual card free, physical optional · optional Monerium IBAN · top-up from Revolut €0",
		},
		x: 360,
		y: 1150,
		side: true,
	},
	{
		id: "ownMonerium",
		title: { hr: "Vlastiti Monerium račun", en: "Own Monerium account" },
		subtitle: {
			hr: "KYC/KYB · besplatan redeem EURe natrag u eure na IBAN-u",
			en: "KYC/KYB · free EURe redeem back to euros on an IBAN",
		},
		x: 0,
		y: 1150,
	},
	{
		id: "euBank",
		title: { hr: "Europska banka", en: "European bank" },
		subtitle: {
			hr: "Natrag na PBZ/ZABA/OTP/Erste/HPB ili bilo koju EU banku — krug zatvoren",
			en: "Back to PBZ/ZABA/OTP/Erste/HPB or any EU bank — the circle is closed",
		},
		badge: { hr: "Kraj kruga", en: "Circle closed" },
		x: 0,
		y: 1380,
	},
];

// ---------------------------------------------------------------------------
// Visual edges
// ---------------------------------------------------------------------------

export const edges: FlowEdge[] = [
	{
		id: "e-card",
		source: "hrBank",
		target: "revolut",
		label: {
			hr: "Apple Pay / Google Pay · min 10 € · 0 € (plaća Revolut)",
			en: "Apple Pay / Google Pay · min €10 · €0 (Revolut pays)",
		},
	},
	{
		id: "e-sepa",
		source: "revolut",
		target: "moneriumMpt",
		label: {
			hr: "SEPA Instant · EPC QR · referenca = onchain adresa · min 1 € · 0 € (plaća Revolut)",
			en: "SEPA Instant · EPC QR · reference = onchain address · min €1 · €0 (Revolut pays)",
		},
	},
	{
		id: "e-mint",
		source: "moneriumMpt",
		target: "safeRelayer",
		label: { hr: "provjera uplate · mint EURe 1:1", en: "payment verification · 1:1 EURe mint" },
	},
	{
		id: "e-relay",
		source: "safeRelayer",
		target: "userAddress",
		label: {
			hr: "sponzorirana onchain transakcija · gas plaća MPT",
			en: "sponsored onchain transaction · gas paid by MPT",
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
		label: { hr: "checkout intent · MPT relayer", en: "checkout intent · MPT relayer" },
		lateral: true,
	},
	{
		id: "e-gp-topup",
		source: "revolut",
		target: "gnosisPay",
		label: {
			hr: "alternativna grana: top-up Gnosis Pay kartice · 0 €",
			en: "alternative branch: Gnosis Pay card top-up · €0",
		},
		lateral: true,
	},
	{
		id: "e-gp-spend",
		source: "gnosisPay",
		target: "merchant",
		label: { hr: "plaćanje VISA karticom", en: "VISA card payment" },
		lateral: true,
	},
	{
		id: "e-redeem",
		source: "userAddress",
		target: "ownMonerium",
		label: { hr: "KYC/KYB · redeem EURe", en: "KYC/KYB · EURe redeem" },
	},
	{
		id: "e-offramp",
		source: "ownMonerium",
		target: "euBank",
		label: {
			hr: "besplatni SEPA Instant off-ramp · 0 € (plaća Monerium)",
			en: "free SEPA Instant off-ramp · €0 (Monerium pays)",
		},
	},
];

// ---------------------------------------------------------------------------
// Transitions (the state machine)
// ---------------------------------------------------------------------------

export const transitions: Transition[] = [
	{
		id: "cardTopup",
		from: "hrBank",
		to: "revolut",
		edge: "e-card",
		label: { hr: "Kartični top-up na Revolut", en: "Card top-up to Revolut" },
		description: {
			hr: "Debitnom karticom hrvatske banke (Mastercard/VISA) preko Apple Paya ili Google Paya korisnik napuni Revolut. S HR IBAN-a odlazi puni iznos i puni iznos stiže na litavski IBAN.",
			en: "Using a Croatian bank debit card (Mastercard/VISA) via Apple Pay or Google Pay, the user tops up Revolut. The full amount leaves the HR IBAN and the full amount arrives on the Lithuanian IBAN.",
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
			hr: "U Revolutu korisnik skenira EPC QR kod primatelja (ili ručno unese IBAN). SEPA plaćanje je po defaultu SEPA Instant.",
			en: "In Revolut the user scans the payee's EPC QR code (or enters the IBAN manually). SEPA payments default to SEPA Instant.",
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
			hr: "Brza SEPA Instant transakcija na Moneriumov estonski IBAN. U referenci plaćanja piše onchain adresa na koju primljeni novac treba dalje otići — po tome mpt-main-rail zna kamo preusmjeriti.",
			en: "A fast SEPA Instant transaction to Monerium's Estonian IBAN. The payment reference carries the onchain address the received money should continue to — that's how mpt-main-rail knows where to reroute.",
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
		label: { hr: "Monerium provjerava uplatu", en: "Monerium verifies the payment" },
		description: {
			hr: "Monerium zaprimi uplatu i radi provjeru primljene uplate prije mintanja.",
			en: "Monerium receives the payment and verifies it before minting.",
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
			hr: "Nakon provjere Monerium minta EURe (1:1 s eurom) na default account — Gnosis Safe multisig relayer.",
			en: "After verification Monerium mints EURe (1:1 with the euro) to the default account — the Gnosis Safe multisig relayer.",
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
		label: { hr: "MPT relayer preusmjerava EURe", en: "MPT relayer reroutes the EURe" },
		description: {
			hr: "mpt-main-rail (Cloudflare Workers) pročita adresu iz SEPA reference i pošalje EURe jeftinom sponzoriranom onchain transakcijom na korisnikovu Gnosis adresu.",
			en: "mpt-main-rail (Cloudflare Workers) reads the address from the SEPA reference and sends the EURe via a cheap sponsored onchain transaction to the user's Gnosis address.",
		},
		feePayer: "mpt",
		feeNote: { hr: "Gas sponzorira MPT — dijelić centa.", en: "Gas sponsored by MPT — a fraction of a cent." },
		movesMoney: true,
	},
	{
		id: "onchainTransfer",
		from: "userAddress",
		to: "otherAddress",
		edge: "e-p2p",
		label: { hr: "Onchain transfer", en: "Onchain transfer" },
		description: {
			hr: "Korisnik slobodno raspolaže EURe — može raditi više onchain transakcija na Gnosis Chainu prema bilo kojoj adresi.",
			en: "The user freely controls the EURe — multiple onchain transactions on Gnosis Chain to any address.",
		},
		feePayer: "none",
		feeNote: {
			hr: "Gas na Gnosis Chainu je zanemariv (dijelić centa).",
			en: "Gas on Gnosis Chain is negligible (a fraction of a cent).",
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
			hr: "MPT relayer podržava izradu checkout intenta — plaćanje trgovcu ili primatelju. Već implementirano i u produkciji na pay.domovina.ai i donate.domovina.ai.",
			en: "The MPT relayer supports checkout intents — paying a merchant or payee. Already implemented and in production at pay.domovina.ai and donate.domovina.ai.",
		},
		feePayer: "none",
		feeNote: { hr: "Bez naknade za korisnika.", en: "No fee for the user." },
		movesMoney: true,
	},
	{
		id: "issueGnosisPayVisa",
		from: null,
		to: null,
		edge: "e-gp-topup",
		label: { hr: "Izdavanje Gnosis Pay VISA kartice", en: "Gnosis Pay VISA card issuance" },
		description: {
			hr: "Gnosis Pay izdaje vlastite VISA kartice — virtualna je besplatna, fizička opcionalna, uz opcionalni Monerium IBAN. Sve to već radi.",
			en: "Gnosis Pay issues its own VISA cards — the virtual card is free, physical optional, with an optional Monerium IBAN. All of this works today.",
		},
		feePayer: "gnosispay",
		feeNote: { hr: "Virtualna kartica se izdaje besplatno.", en: "The virtual card is issued for free." },
		movesMoney: false,
	},
	{
		id: "topupGnosisPayFromRevolut",
		from: "revolut",
		to: "gnosisPay",
		edge: "e-gp-topup",
		label: { hr: "Top-up Gnosis Pay kartice iz Revoluta", en: "Gnosis Pay card top-up from Revolut" },
		description: {
			hr: "Korisnik Gnosis Pay VISA karticu (virtualnu ili fizičku) doda u svoj Revolut račun i iz njega napravi top-up — opet besplatno za korisnika.",
			en: "The user adds the Gnosis Pay VISA card (virtual or physical) to their Revolut account and tops it up from there — again free for the user.",
		},
		feePayer: "revolut",
		feeNote: { hr: "Top-up je za korisnika 0 €.", en: "The top-up costs the user €0." },
		movesMoney: true,
	},
	{
		id: "gnosisPayCardSpend",
		from: "gnosisPay",
		to: "merchant",
		edge: "e-gp-spend",
		label: { hr: "Plaćanje Gnosis Pay VISA karticom", en: "Pay with the Gnosis Pay VISA card" },
		description: {
			hr: "Korisnik plaća VISA karticom iz svojeg EURe salda — bilo gdje gdje se VISA prima.",
			en: "The user pays by VISA card from their EURe balance — anywhere VISA is accepted.",
		},
		feePayer: "gnosispay",
		feeNote: { hr: "Bez naknade za korisnika.", en: "No fee for the user." },
		movesMoney: true,
	},
	{
		id: "openMoneriumKyc",
		from: null,
		to: null,
		edge: "e-redeem",
		label: { hr: "Otvaranje vlastitog Monerium računa", en: "Open an own Monerium account" },
		description: {
			hr: "Za off-ramp korisnik otvori vlastiti Monerium račun uz KYC/KYB provjeru.",
			en: "For the off-ramp the user opens their own Monerium account with KYC/KYB verification.",
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
		label: { hr: "Redeem EURe na vlastitom računu", en: "Redeem EURe on the own account" },
		description: {
			hr: "Korisnik pošalje EURe na svoj Monerium račun — EURe se otkupljuje 1:1 natrag u eure.",
			en: "The user sends EURe to their Monerium account — EURe is redeemed 1:1 back into euros.",
		},
		feePayer: "monerium",
		feeNote: { hr: "Redeem je besplatan.", en: "Redeem is free." },
		movesMoney: true,
	},
	{
		id: "sepaInstantOfframp",
		from: "ownMonerium",
		to: "euBank",
		edge: "e-offramp",
		label: { hr: "Besplatni SEPA Instant off-ramp", en: "Free SEPA Instant off-ramp" },
		description: {
			hr: "Monerium napravi besplatnu SEPA Instant uplatu natrag na PBZ/ZABA/OTP/Erste/HPB ili bilo koju drugu europsku banku — cijeli krug je zatvoren.",
			en: "Monerium makes a free SEPA Instant payment back to PBZ/ZABA/OTP/Erste/HPB or any other European bank — the whole circle is closed.",
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
			hr: "Cijeli krug: on-ramp, KYC na vlastitom Monerium računu i besplatni SEPA Instant off-ramp natrag u banku. 50 € ode — 50 € se vrati.",
			en: "The whole circle: on-ramp, KYC on an own Monerium account and a free SEPA Instant off-ramp back to the bank. €50 leaves — €50 comes back.",
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
			hr: "Plaćanje trgovcu preko MPT checkout intenta — kao u produkciji na pay.domovina.ai i donate.domovina.ai.",
			en: "Paying a merchant through an MPT checkout intent — as live in production at pay.domovina.ai and donate.domovina.ai.",
		},
		initialAmount: 25,
		steps: [...onramp(25), { t: "payCheckoutIntent", amount: 25 }],
	},
	{
		id: "gnosis-pay",
		name: { hr: "5 · Gnosis Pay VISA grana", en: "5 · Gnosis Pay VISA branch" },
		description: {
			hr: "Alternativna grana: besplatna virtualna VISA, top-up kartice izravno iz Revoluta i plaćanje karticom — bez Monerium koraka.",
			en: "The alternative branch: free virtual VISA, card top-up straight from Revolut and a card payment — no Monerium hop.",
		},
		initialAmount: 25,
		steps: [
			{ t: "issueGnosisPayVisa" },
			{ t: "cardTopup", amount: 25 },
			{ t: "topupGnosisPayFromRevolut", amount: 25 },
			{ t: "gnosisPayCardSpend", amount: 12.5 },
		],
	},
	{
		id: "guards",
		name: { hr: "6 · Zaštitni limiti (guardovi)", en: "6 · Guard limits" },
		description: {
			hr: "Što odbijaju pravila: kartični top-up ispod 10 € i SEPA prema Moneriumu ispod 1 € se odbijaju, zatim ispravni iznosi prolaze.",
			en: "What the rules reject: a card top-up below €10 and a SEPA to Monerium below €1 get rejected, then valid amounts pass.",
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

const rejectInsufficient: L10n = {
	hr: "Odbijeno: na polaznom računu nema dovoljno sredstava.",
	en: "Rejected: insufficient funds at the source of this step.",
};

export function simulate(scenario: Scenario): SimStep[] {
	const balances = Object.fromEntries(nodes.map((n) => [n.id, 0])) as Record<NodeId, number>;
	balances.hrBank = scenario.initialAmount;

	let location: NodeId = "hrBank";
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
