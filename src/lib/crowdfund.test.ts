import { describe, expect, it } from "vitest";
import { CROWDFUND_PROD, CROWDFUND_SANDBOX, MAX_AMOUNT_EUR, parseAmountEur, weiToCents } from "./crowdfund";

describe("crowdfund", () => {
	it("parses amounts the way people type them", () => {
		expect(parseAmountEur("15")).toBe(15);
		expect(parseAmountEur("12,5")).toBe(12.5);
		expect(parseAmountEur(" 1 000 ")).toBe(1000);
		expect(parseAmountEur("0")).toBeNull();
		expect(parseAmountEur("1.234")).toBeNull();
		expect(parseAmountEur("-5")).toBeNull();
		expect(parseAmountEur(String(MAX_AMOUNT_EUR + 1))).toBeNull();
	});

	it("converts 18-decimal EURe to cents", () => {
		expect(weiToCents("25000000000000000000")).toBe(2500);
		expect(weiToCents("10005000000000000000")).toBe(1001);
		expect(weiToCents("bad")).toBe(0);
	});

	it("prod and sandbox are the same campaign on different tenants and chains", () => {
		expect(CROWDFUND_PROD.campaignId).toBe(CROWDFUND_SANDBOX.campaignId);
		expect(CROWDFUND_PROD.tenant).toBe("italk");
		expect(CROWDFUND_SANDBOX.tenant).toBe("italk-sandbox");
		expect(CROWDFUND_PROD.tenantKey).toBeNull();
		expect(CROWDFUND_SANDBOX.tenantKey).toMatch(/^pk_/);
		// payer tags are opt-in per tenant on the rail (ADR 0029): only italk has them
		expect(CROWDFUND_SANDBOX.payerTags).toBe(false);
	});
});
