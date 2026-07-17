"use client";

import { useEffect, useMemo, useRef, useState } from "react";
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
	const logRef = useRef<HTMLDivElement>(null);
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

	useEffect(() => {
		logRef.current?.scrollTo({ top: logRef.current.scrollHeight, behavior: "smooth" });
	}, [cursor]);

	const selectScenario = (id: string) => {
		setScenarioId(id);
		setCursor(-1);
		setPlaying(false);
	};

	const balances = useMemo(() => {
		if (!current) return undefined;
		const out: Partial<Record<NodeId, string>> = {};
		for (const [node, value] of Object.entries(current.balances)) {
			if (value > 0) out[node as NodeId] = eur(locale, value);
		}
		return out;
	}, [current, locale]);

	return (
		<div className="rounded-3xl border border-zinc-800 bg-zinc-950/60 p-4 sm:p-6">
			{/* scenario picker */}
			<p className="mb-3 text-xs font-medium uppercase tracking-wider text-zinc-500">
				{labels.pickScenario}
			</p>
			<div className="flex flex-wrap gap-2">
				{scenarios.map((s) => (
					<button
						key={s.id}
						onClick={() => selectScenario(s.id)}
						className={`rounded-full border px-4 py-1.5 text-xs font-medium transition ${
							s.id === scenarioId
								? "border-emerald-400 bg-emerald-400/10 text-emerald-300"
								: "border-zinc-700 text-zinc-400 hover:border-zinc-500 hover:text-zinc-200"
						}`}
					>
						{s.name[locale]}
					</button>
				))}
			</div>
			<p className="mt-3 text-sm leading-relaxed text-zinc-400">{scenario.description[locale]}</p>

			{/* controls */}
			<div className="mt-5 flex flex-wrap items-center gap-2">
				<button
					onClick={() => setCursor((c) => Math.max(c - 1, -1))}
					disabled={cursor < 0}
					className="rounded-full border border-zinc-700 px-4 py-2 text-xs font-semibold text-zinc-200 transition enabled:hover:border-zinc-500 disabled:opacity-40"
				>
					← {labels.prev}
				</button>
				<button
					onClick={() => setCursor((c) => Math.min(c + 1, steps.length - 1))}
					disabled={atEnd}
					className="rounded-full bg-emerald-400 px-4 py-2 text-xs font-semibold text-emerald-950 transition enabled:hover:bg-emerald-300 disabled:opacity-40"
				>
					{cursor < 0 ? labels.start : labels.next} →
				</button>
				<button
					onClick={() => setPlaying((p) => !p)}
					disabled={atEnd && !playing}
					className="rounded-full border border-emerald-400/40 px-4 py-2 text-xs font-semibold text-emerald-300 transition enabled:hover:bg-emerald-400/10 disabled:opacity-40"
				>
					{playing ? labels.pause : labels.autoplay}
				</button>
				<button
					onClick={() => {
						setCursor(-1);
						setPlaying(false);
					}}
					className="rounded-full border border-zinc-700 px-4 py-2 text-xs font-semibold text-zinc-400 transition hover:border-zinc-500"
				>
					{labels.reset}
				</button>
				<span className="ml-auto font-mono text-xs text-zinc-500">
					{labels.stepOf
						.replace("{i}", String(Math.max(cursor + 1, 0)))
						.replace("{n}", String(steps.length))}
				</span>
			</div>

			{/* diagram — full width; horizontal rail on wide screens, vertical on mobile */}
			<div className="mt-4 h-[1560px] w-full overflow-hidden rounded-2xl border border-zinc-800/80 bg-[#08110d] lg:h-[560px] 2xl:h-[640px]">
				<FlowDiagram
					locale={locale}
					orientation={orientation}
					activeNode={current?.status === "ok" ? current.location : undefined}
					activeEdge={current?.transition.edge}
					balances={balances}
					subsetNodes={subset.nodes}
					subsetEdges={subset.edges}
				/>
			</div>

			{/* log + fee counter */}
			<div className="mt-4 grid gap-4 lg:grid-cols-[minmax(0,1fr)_20rem]">
				<div
					ref={logRef}
					className="min-h-40 space-y-2 overflow-y-auto rounded-2xl border border-zinc-800/80 bg-[#08110d] p-3"
					style={{ maxHeight: "24rem" }}
				>
					{cursor < 0 && <p className="p-2 text-sm text-zinc-500">{labels.logEmpty}</p>}
					{steps.slice(0, cursor + 1).map((step) => (
						<div
							key={step.index}
							className={`rounded-xl border p-3 text-sm ${
								step.status === "rejected"
									? "border-red-400/30 bg-red-400/5"
									: step.index === cursor
										? "border-emerald-400/40 bg-emerald-400/5"
										: "border-zinc-800 bg-zinc-900/40"
							}`}
						>
							<div className="flex items-baseline justify-between gap-2">
								<p className="font-semibold text-zinc-100">
									<span className="mr-2 font-mono text-xs text-zinc-500">
										{String(step.index + 1).padStart(2, "0")}
									</span>
									{step.transition.label[locale]}
								</p>
								{step.transition.movesMoney && (
									<span
										className={`shrink-0 font-mono text-xs ${
											step.status === "rejected" ? "text-red-300 line-through" : "text-emerald-300"
										}`}
									>
										{eur(locale, step.amount)}
									</span>
								)}
							</div>
							<p className="mt-1 text-xs leading-relaxed text-zinc-400">
								{step.status === "rejected"
									? step.rejectReason?.[locale]
									: step.transition.description[locale]}
							</p>
							{step.status === "ok" && (
								<p className="mt-1.5 text-[11px] text-zinc-500">{step.transition.feeNote[locale]}</p>
							)}
						</div>
					))}
					{atEnd && cursor >= 0 && (
						<p className="p-2 text-center text-xs font-medium text-emerald-300">{labels.finished}</p>
					)}
				</div>

				<div className="flex flex-col gap-2 self-start">
					<div className="flex items-center justify-between rounded-2xl border border-emerald-400/20 bg-emerald-400/5 px-4 py-3">
						<span className="text-xs text-zinc-400">{labels.userFees}</span>
						<span className="font-mono text-lg font-bold text-emerald-300">
							{eur(locale, current?.userFeesTotal ?? 0)}
						</span>
					</div>
					{current && Object.keys(current.sponsoredBy).length > 0 && (
						<p className="text-[11px] leading-relaxed text-zinc-500">
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
