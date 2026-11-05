import { describe, expect, it } from "vitest";
import {
	edges,
	nodes,
	scenarios,
	scenarioSubset,
	simulate,
	totalBalance,
	transitions,
} from "./mpt-machine";

describe("machine consistency", () => {
	it("every transition maps to an existing visual edge and existing nodes", () => {
		const nodeIds = new Set(nodes.map((n) => n.id));
		const edgeIds = new Set(edges.map((e) => e.id));
		for (const t of transitions) {
			expect(edgeIds.has(t.edge)).toBe(true);
			if (t.from !== null) expect(nodeIds.has(t.from)).toBe(true);
			if (t.to !== null) expect(nodeIds.has(t.to)).toBe(true);
		}
	});

	it("every visual edge connects existing nodes", () => {
		const nodeIds = new Set(nodes.map((n) => n.id));
		for (const e of edges) {
			expect(nodeIds.has(e.source)).toBe(true);
			expect(nodeIds.has(e.target)).toBe(true);
		}
	});

	it("every edge is exercised by at least one transition", () => {
		const used = new Set(transitions.map((t) => t.edge));
		for (const e of edges) expect(used.has(e.id)).toBe(true);
	});

	it("scenarios are proper subsets of the full graph", () => {
		const onramp = scenarioSubset(scenarios.find((s) => s.id === "onramp")!);
		expect(onramp.nodes.has("gnosisPay")).toBe(false);
		expect(onramp.nodes.has("merchant")).toBe(false);
		// since ADR 0025 the own wallet is funded through an own Monerium account,
		// never through a merchant's IBAN or Safe
		expect(onramp.nodes.has("ownMonerium")).toBe(true);
		expect(onramp.nodes.has("moneriumMpt")).toBe(false);
		expect(onramp.nodes.has("safeRelayer")).toBe(false);
		expect(onramp.edges.has("e-redeem")).toBe(false);
		expect(onramp.edges.has("e-gp-revolut")).toBe(false);

		const gp = scenarioSubset(scenarios.find((s) => s.id === "gnosis-pay")!);
		expect(gp.nodes.has("gnosisPay")).toBe(true);
		expect(gp.edges.has("e-gp-revolut")).toBe(true);
		expect(gp.edges.has("e-redeem")).toBe(false);
		expect(gp.edges.has("e-offramp")).toBe(false);

		const fullCircle = scenarioSubset(scenarios.find((s) => s.id === "full-circle")!);
		expect(fullCircle.nodes.has("bank")).toBe(true);
		expect(fullCircle.edges.has("e-offramp")).toBe(true);
	});
});

describe.each(scenarios)("scenario $id", (scenario) => {
	const steps = simulate(scenario);

	it("runs every step", () => {
		expect(steps).toHaveLength(scenario.steps.length);
	});

	it("the user pays 0 € at every single step", () => {
		for (const step of steps) expect(step.userFeesTotal).toBe(0);
	});

	it("money is conserved 1:1 — no leakage anywhere in the flow", () => {
		for (const step of steps) {
			expect(totalBalance(step.balances)).toBe(scenario.initialAmount);
		}
	});

	it("no balance ever goes negative", () => {
		for (const step of steps) {
			for (const value of Object.values(step.balances)) {
				expect(value).toBeGreaterThanOrEqual(0);
			}
		}
	});
});

describe("guard limits", () => {
	const guards = scenarios.find((s) => s.id === "guards")!;
	const steps = simulate(guards);

	it("rejects a card top-up below 10 € and a SEPA below 1 €", () => {
		const rejected = steps.filter((s) => s.status === "rejected");
		expect(rejected.map((s) => s.transition.id)).toEqual(["cardTopup", "sepaToMonerium"]);
	});

	it("a rejected step does not move any money", () => {
		const first = steps[0]; // cardTopup 9.99 — rejected
		expect(first.status).toBe("rejected");
		expect(first.balances.bank).toBe(guards.initialAmount);
		expect(first.balances.revolut).toBe(0);
	});

	it("valid amounts still complete the full rail afterwards", () => {
		const last = steps.at(-1)!;
		expect(last.status).toBe("ok");
		// the full rail now ends with Monerium's direct mint into the merchant's Safe
		expect(last.location).toBe("merchant");
		expect(last.balances.merchant).toBe(10);
	});
});

describe("terminal states", () => {
	it("full-circle ends with the full amount back at the SAME bank it started from", () => {
		const fullCircle = scenarios.find((s) => s.id === "full-circle")!;
		const last = simulate(fullCircle).at(-1)!;
		expect(last.location).toBe("bank");
		expect(last.balances.bank).toBe(fullCircle.initialAmount);
	});

	it("onramp ends with EURe on the user's Gnosis address", () => {
		const onramp = scenarios.find((s) => s.id === "onramp")!;
		const last = simulate(onramp).at(-1)!;
		expect(last.location).toBe("userAddress");
		expect(last.balances.userAddress).toBe(onramp.initialAmount);
	});

	it("sepa-checkout: Monerium mints straight into the merchant's Safe — no forward, the buyer never holds EURe", () => {
		const scenario = scenarios.find((s) => s.id === "sepa-checkout")!;
		const steps = simulate(scenario);
		const last = steps.at(-1)!;
		expect(last.location).toBe("merchant");
		expect(last.balances.merchant).toBe(scenario.initialAmount);
		expect(last.transition.id).toBe("mintEure");
		expect(last.transition.feePayer).toBe("monerium");
		const subset = scenarioSubset(scenario);
		expect(subset.nodes.has("userAddress")).toBe(false);
		expect(subset.nodes.has("safeRelayer")).toBe(false);
		expect(subset.edges.has("e-mint")).toBe(true);
		expect(subset.edges.has("e-forward")).toBe(false);
		expect(subset.edges.has("e-checkout")).toBe(false);
	});

	it("stray pays the merchant from the tenant's main Safe via ProjectRouter — the buyer never holds EURe", () => {
		const scenario = scenarios.find((s) => s.id === "stray")!;
		const steps = simulate(scenario);
		const last = steps.at(-1)!;
		expect(last.location).toBe("merchant");
		expect(last.balances.merchant).toBe(scenario.initialAmount);
		expect(last.transition.id).toBe("forwardToPayee");
		const subset = scenarioSubset(scenario);
		expect(subset.nodes.has("userAddress")).toBe(false);
		expect(subset.edges.has("e-forward")).toBe(true);
		expect(subset.edges.has("e-mint-main")).toBe(true);
		expect(subset.edges.has("e-mint")).toBe(false);
		expect(subset.edges.has("e-checkout")).toBe(false);
	});

	it("no transition moves money from a merchant's IBAN or Safe to a user's address (ADR 0025)", () => {
		for (const t of transitions) {
			if (!t.movesMoney) continue;
			if (t.from === "moneriumMpt" || t.from === "safeRelayer") {
				expect(t.to).not.toBe("userAddress");
				expect(t.to).not.toBe("otherAddress");
			}
		}
	});

	it("the main Safe only pays out to a merchant / project Safe, with MPT paying the gas", () => {
		const outflows = transitions.filter((t) => t.movesMoney && t.from === "safeRelayer");
		expect(outflows.length).toBeGreaterThan(0);
		for (const t of outflows) {
			expect(t.to).toBe("merchant");
			expect(t.feePayer).toBe("mpt");
		}
	});

	it("a payment without a reference is resolved before it is forwarded", () => {
		const stray = simulate(scenarios.find((s) => s.id === "stray")!);
		const ids = stray.map((s) => s.transition.id);
		expect(ids).toContain("sepaNoReference");
		expect(ids).not.toContain("sepaToMonerium");
		expect(ids.indexOf("strayResolve")).toBeLessThan(ids.indexOf("forwardToPayee"));
	});

	it("a payment no intent matches is parked in the Safe, never guessed, then rerouted by the operator", () => {
		const steps = simulate(scenarios.find((s) => s.id === "parked")!);
		const ids = steps.map((s) => s.transition.id);
		expect(ids).not.toContain("strayResolve");
		expect(ids).not.toContain("checkoutReceived");
		const parked = steps.find((s) => s.transition.id === "strayPark")!;
		expect(parked.location).toBe("safeRelayer");
		expect(parked.balances.merchant).toBe(0);
		const last = steps.at(-1)!;
		expect(last.transition.id).toBe("operatorReroute");
		expect(last.balances.merchant).toBe(20);
	});

	it("a short payment still reaches the merchant, then fires payment.underpaid", () => {
		const steps = simulate(scenarios.find((s) => s.id === "underpaid")!);
		const last = steps.at(-1)!;
		expect(last.transition.id).toBe("underpaidNotice");
		expect(last.balances.merchant).toBe(20);
		expect(steps.every((s) => s.status === "ok")).toBe(true);
	});

	it("the merchant flow is the default (first) scenario", () => {
		expect(scenarios[0].id).toBe("sepa-checkout");
	});

	it("gnosis-pay branch funds the GP Safe, spends at the POS and tops Revolut back up", () => {
		const gp = scenarios.find((s) => s.id === "gnosis-pay")!;
		const steps = simulate(gp);
		const last = steps.at(-1)!;
		expect(last.balances.merchant).toBe(12.5);
		expect(last.balances.gnosisPay).toBe(0);
		expect(last.balances.revolut).toBe(12.5);
		expect(last.location).toBe("revolut");
		const fund = steps.find((s) => s.transition.id === "fundGnosisPay")!;
		expect(fund.transition.from).toBe("userAddress");
	});

	it("checkout intents reject amounts above the €10,000 code guard", () => {
		const oversized = {
			id: "oversized-intent",
			name: { hr: "test", en: "test" },
			description: { hr: "test", en: "test" },
			initialAmount: 20000,
			steps: [
				{ t: "openMoneriumKyc" as const },
				{ t: "cardTopup" as const, amount: 20000 },
				{ t: "sepaToOwnMonerium" as const, amount: 20000 },
				{ t: "mintToOwnAddress" as const, amount: 20000 },
				{ t: "payCheckoutIntent" as const, amount: 10001 },
				{ t: "payCheckoutIntent" as const, amount: 10000 },
			],
		};
		const steps = simulate(oversized);
		const rejected = steps.filter((s) => s.status === "rejected");
		expect(rejected).toHaveLength(1);
		expect(rejected[0].transition.id).toBe("payCheckoutIntent");
		expect(rejected[0].amount).toBe(10001);
		expect(steps.at(-1)!.balances.merchant).toBe(10000);
	});
});
