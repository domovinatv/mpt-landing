"use client";

import { useEffect, useMemo, useState } from "react";
import type { Locale } from "@/i18n/config";
import {
	scenarios,
	scenarioSubset,
	simulate,
	type FeePayer,
	type NodeId,
	type SimStep,
} from "@/lib/mpt-machine";
import FlowDiagram, { type FlowOrientation } from "./FlowDiagram";

export interface SimulationPlayerLabels {
	pickScenario: string;
	start: string;
	next: string;
	prev: string;
	autoplay: string;
	pause: string;
	reset: string;
	stepOf: string; // "Korak {i} / {n}"
	userFees: string;
	sponsoredBy: string;
	sponsorNames: Record<Exclude<FeePayer, "none">, string>;
	finished: string;
	logEmpty: string;
}

const eur = (locale: Locale, value: number) =>
	new Intl.NumberFormat(locale === "hr" ? "hr-HR" : "en-IE", {
		style: "currency",
		currency: "EUR",
	}).format(value);

function useOrientation(): FlowOrientation {
	const [wide, setWide] = useState(false);
	useEffect(() => {
		const mq = window.matchMedia("(min-width: 1024px)");
		const update = () => setWide(mq.matches);
		update();
		mq.addEventListener("change", update);
		return () => mq.removeEventListener("change", update);
	}, []);
	return wide ? "horizontal" : "vertical";
}

export default function SimulationPlayer({
	locale,
	labels,
}: {
	locale: Locale;
	labels: SimulationPlayerLabels;
}) {
	const [scenarioId, setScenarioId] = useState(scenarios[0].id);
	const [cursor, setCursor] = useState(-1); // -1 = before the first step
	const [playing, setPlaying] = useState(false);
	const orientation = useOrientation();

	const scenario = scenarios.find((s) => s.id === scenarioId)!;
	const steps = useMemo(() => simulate(scenario), [scenario]);
	const subset = useMemo(() => scenarioSubset(scenario), [scenario]);
	const current: SimStep | undefined = cursor >= 0 ? steps[cursor] : undefined;
	const atEnd = cursor >= steps.length - 1;

	useEffect(() => {
		if (!playing) return;
		if (atEnd) {
			setPlaying(false);
			return;
		}
		const id = setInterval(() => setCursor((c) => Math.min(c + 1, steps.length - 1)), 1700);
		return () => clearInterval(id);
	}, [playing, atEnd, steps.length]);

	const selectScenario = (id: string) => {
		setScenarioId(id);
		setCursor(-1);
		setPlaying(false);
	};

	const balances = useMemo(() => {
		// before the first step all the money sits on the bank account
		if (!current) return { bank: eur(locale, scenario.initialAmount) };
		const out: Partial<Record<NodeId, string>> = {};
		for (const [node, value] of Object.entries(current.balances)) {
			if (value > 0) out[node as NodeId] = eur(locale, value);
		}
		return out;
	}, [current, locale, scenario.initialAmount]);

	return (
		<div className="rounded-[18px] border border-line bg-white p-4 shadow-[0_10px_30px_-18px_rgba(0,30,80,0.22)] sm:p-6">
			{/* scenario picker */}
			<p className="mb-3 text-xs font-bold uppercase tracking-[0.18em] text-gold">
				{labels.pickScenario}
			</p>
			<div className="flex flex-wrap gap-2">
				{scenarios.map((s) => (
					<button
						key={s.id}
						onClick={() => selectScenario(s.id)}
						className={`rounded-full border px-4 py-1.5 text-xs font-medium transition ${
							s.id === scenarioId
								? "border-gold bg-gold-soft text-[#7a5a12]"
								: "border-line text-mute hover:border-gold hover:text-ink"
						}`}
					>
						{s.name[locale]}
					</button>
				))}
			</div>
			<p className="mt-3 text-sm leading-relaxed text-mute">{scenario.description[locale]}</p>

			{/* controls */}
			<div className="mt-5 flex flex-wrap items-center gap-2">
				<button
					onClick={() => setCursor((c) => Math.max(c - 1, -1))}
					disabled={cursor < 0}
					className="rounded-full border border-line px-4 py-2 text-xs font-semibold text-ink transition enabled:hover:border-gold disabled:opacity-40"
				>
					← {labels.prev}
				</button>
				<button
					onClick={() => setCursor((c) => Math.min(c + 1, steps.length - 1))}
					disabled={atEnd}
					className="rounded-full bg-gradient-to-br from-gold-light to-gold px-4 py-2 text-xs font-semibold text-[#3a2900] shadow-[0_8px_22px_-10px_rgba(200,145,42,0.7)] transition enabled:hover:-translate-y-0.5 disabled:opacity-40"
				>
					{cursor < 0 ? labels.start : labels.next} →
				</button>
				<button
					onClick={() => setPlaying((p) => !p)}
					disabled={atEnd && !playing}
					className="rounded-full border border-gold/50 px-4 py-2 text-xs font-semibold text-gold transition enabled:hover:bg-gold-soft/60 disabled:opacity-40"
				>
					{playing ? labels.pause : labels.autoplay}
				</button>
				<button
					onClick={() => {
						setCursor(-1);
						setPlaying(false);
					}}
					className="rounded-full border border-line px-4 py-2 text-xs font-semibold text-mute transition hover:border-gold"
				>
					{labels.reset}
				</button>
				<span className="ml-auto font-mono text-xs text-mute">
					{labels.stepOf
						.replace("{i}", String(Math.max(cursor + 1, 0)))
						.replace("{n}", String(steps.length))}
				</span>
			</div>

			{/* diagram — full width; horizontal rail on wide screens, vertical on mobile */}
			<div className="mt-4 h-[1560px] w-full overflow-hidden rounded-2xl border border-line bg-soft lg:h-[560px] 2xl:h-[640px]">
				<FlowDiagram
					locale={locale}
					orientation={orientation}
					activeNode={current ? (current.status === "ok" ? current.location : undefined) : "bank"}
					activeEdge={current?.transition.edge}
					balances={balances}
					subsetNodes={subset.nodes}
					subsetEdges={subset.edges}
				/>
			</div>

			{/* log + fee counter */}
			<div className="mt-4 grid gap-4 lg:grid-cols-[minmax(0,1fr)_20rem]">
				{/* newest step first — it stays in a fixed spot right below the diagram
				    while the simulation plays, so no scrolling is needed to follow it */}
				<div className="min-h-40 space-y-2 rounded-2xl border border-line bg-soft p-3">
					{cursor < 0 && <p className="p-2 text-sm text-mute">{labels.logEmpty}</p>}
					{atEnd && cursor >= 0 && (
						<p className="p-2 text-center text-xs font-medium text-green">{labels.finished}</p>
					)}
					{steps.slice(0, cursor + 1).reverse().map((step) => (
						<div
							key={step.index}
							className={`rounded-xl border p-3 text-sm ${
								step.status === "rejected"
									? "border-red/30 bg-red-soft"
									: step.index === cursor
										? "border-gold bg-gold-soft/50"
										: "border-line bg-white"
							}`}
						>
							<div className="flex items-baseline justify-between gap-2">
								<p className="font-semibold text-ink">
									<span className="mr-2 font-mono text-xs text-mute">
										{String(step.index + 1).padStart(2, "0")}
									</span>
									{step.transition.label[locale]}
								</p>
								{step.transition.movesMoney && (
									<span
										className={`shrink-0 font-mono text-xs ${
											step.status === "rejected" ? "text-red line-through" : "text-green"
										}`}
									>
										{eur(locale, step.amount)}
									</span>
								)}
							</div>
							<p className="mt-1 text-xs leading-relaxed text-mute">
								{step.status === "rejected"
									? step.rejectReason?.[locale]
									: step.transition.description[locale]}
							</p>
							{step.status === "ok" && (
								<p className="mt-1.5 text-[11px] text-mute/80">{step.transition.feeNote[locale]}</p>
							)}
						</div>
					))}
				</div>

				<div className="flex flex-col gap-2 self-start">
					<div className="flex items-center justify-between rounded-2xl border border-gold/40 bg-gold-soft/50 px-4 py-3">
						<span className="text-xs text-mute">{labels.userFees}</span>
						<span className="font-mono text-lg font-bold text-navy">
							{eur(locale, current?.userFeesTotal ?? 0)}
						</span>
					</div>
					{current && Object.keys(current.sponsoredBy).length > 0 && (
						<p className="text-[11px] leading-relaxed text-mute">
							{labels.sponsoredBy}{" "}
							{Object.entries(current.sponsoredBy)
								.map(
									([payer, count]) =>
										`${labels.sponsorNames[payer as Exclude<FeePayer, "none">]} ×${count}`,
								)
								.join(" · ")}
						</p>
					)}
				</div>
			</div>
		</div>
	);
}
