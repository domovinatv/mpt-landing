import { describe, expect, it } from "vitest";
import {
	edges,
	nodes,
	scenarios,
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
		expect(first.balances.hrBank).toBe(guards.initialAmount);
		expect(first.balances.revolut).toBe(0);
	});

	it("valid amounts still complete the full rail afterwards", () => {
		const last = steps.at(-1)!;
		expect(last.status).toBe("ok");
		expect(last.location).toBe("userAddress");
		expect(last.balances.userAddress).toBe(10);
	});
});

describe("terminal states", () => {
	it("full-circle ends with the full amount back at a European bank", () => {
		const fullCircle = scenarios.find((s) => s.id === "full-circle")!;
		const last = simulate(fullCircle).at(-1)!;
		expect(last.location).toBe("euBank");
		expect(last.balances.euBank).toBe(fullCircle.initialAmount);
	});

	it("onramp ends with EURe on the user's Gnosis address", () => {
		const onramp = scenarios.find((s) => s.id === "onramp")!;
		const last = simulate(onramp).at(-1)!;
		expect(last.location).toBe("userAddress");
		expect(last.balances.userAddress).toBe(onramp.initialAmount);
	});

	it("gnosis-pay branch spends from the card without touching Monerium", () => {
		const gp = scenarios.find((s) => s.id === "gnosis-pay")!;
		const steps = simulate(gp);
		const last = steps.at(-1)!;
		expect(last.balances.merchant).toBe(12.5);
		expect(last.balances.gnosisPay).toBe(12.5);
		for (const step of steps) {
			expect(step.balances.moneriumMpt).toBe(0);
			expect(step.balances.safeRelayer).toBe(0);
		}
	});
});
