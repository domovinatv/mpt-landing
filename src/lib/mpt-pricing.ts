/**
 * MPT's own price for merchants (hosted MPT), modelled on RevenueCat's
 * "free up to $2,500 monthly tracked revenue, then 1%" (Matija, 2026-10-10).
 *
 * Volume = the sum of payments that reached "paid" at the merchant in one
 * calendar month. The buyer never pays MPT anything; self-hosted MPT is free (MIT).
 * Copy that quotes these numbers lives in src/i18n/dictionaries.ts — keep in sync.
 */

export const MPT_FREE_MONTHLY_VOLUME = 2500;
export const MPT_FEE_PCT = 0.01;

/** MPT fee for one calendar month of volume on the hosted plan */
export const mptMonthlyFee = (monthlyVolume: number) =>
	Math.max(0, monthlyVolume - MPT_FREE_MONTHLY_VOLUME) * MPT_FEE_PCT;
