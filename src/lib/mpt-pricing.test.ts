import { describe, expect, it } from "vitest";
import { getDictionary } from "../i18n/dictionaries";
import { MPT_FEE_PCT, MPT_FREE_MONTHLY_VOLUME, mptMonthlyFee } from "./mpt-pricing";

describe("MPT pricing", () => {
	it("is free up to the threshold, then a flat percentage of the excess", () => {
		expect(mptMonthlyFee(0)).toBe(0);
		expect(mptMonthlyFee(MPT_FREE_MONTHLY_VOLUME)).toBe(0);
		expect(mptMonthlyFee(12_500)).toBeCloseTo(100);
	});

	it("copy quotes the same numbers as the constants", () => {
		expect(MPT_FREE_MONTHLY_VOLUME).toBe(2500);
		expect(MPT_FEE_PCT).toBe(0.01);
		expect(getDictionary("hr").pricing.plans[0].priceNote).toContain("2.500 €");
		expect(getDictionary("hr").pricing.plans[0].priceNote).toContain("1%");
		expect(getDictionary("en").pricing.plans[0].priceNote).toContain("€2,500");
		expect(getDictionary("en").pricing.plans[0].priceNote).toContain("1%");
	});
});
