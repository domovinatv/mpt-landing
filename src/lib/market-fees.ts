/**
 * Market-fee constants for the "what would this cost today" comparisons.
 *
 * Source: cost-effectiveness analysis "Isplativost" (lom.ff.hr/dokumenti/isplativost,
 * vendored in ~/git/ss/ss-novcanik-prototip/docs/compliance/isplativost-wallet.md):
 *  - card: Stripe EEA domestic card pricing, July 2026 — 1.5% + €0.25 per transaction
 *  - SEPA: typical fixed per-order SENDER fee at classic Croatian banks
 *    (ZABA, PBZ, Erste, OTP, HPB) — €0.25–0.45 per transaction, depending on
 *    package/channel (range per Matija, 2026-07: real single-transaction costs)
 *
 * These are comparison inputs only — the MPT rail itself charges the user €0.
 * The fixed component is what kills micropayments: on a €2 payment the card fee
 * is 14% and the bank order up to 20%.
 */

export const CARD_FEE_PCT = 0.015;
export const CARD_FEE_FIXED = 0.25;

export const SEPA_FEE_MIN = 0.25;
export const SEPA_FEE_MAX = 0.45;

/** card-processor fee on a single payment (Stripe EEA domestic) */
export const cardFee = (amount: number) => amount * CARD_FEE_PCT + CARD_FEE_FIXED;

/** upper-bound HR bank fixed order fee on a single payment */
export const sepaFeeMax = (_amount: number) => SEPA_FEE_MAX;
