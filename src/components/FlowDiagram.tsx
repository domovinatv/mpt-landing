"use client";

import { memo, useMemo } from "react";
import {
	Background,
	BaseEdge,
	EdgeLabelRenderer,
	Handle,
	MarkerType,
	Position,
	ReactFlow,
	getBezierPath,
	type Edge,
	type EdgeProps,
	type Node,
	type NodeProps,
} from "@xyflow/react";
import "@xyflow/react/dist/style.css";
import type { Locale } from "@/i18n/config";
import {
	edges as flowEdges,
	nodes as flowNodes,
	type EdgeId,
	type NodeId,
} from "@/lib/mpt-machine";

type MptNodeData = {
	title: string;
	subtitle: string;
	badge?: string;
	active: boolean;
	/** part of the selected scenario's subset — outlined even before the simulation runs */
	highlighted: boolean;
	dimmed: boolean;
	balance?: string;
};

const MptNode = memo(function MptNode({ data }: NodeProps<Node<MptNodeData>>) {
	return (
		<div
			className={`w-[260px] rounded-2xl border p-4 transition-all duration-300 ${
				data.active
					? "border-navy bg-soft shadow-[0_0_30px_rgba(0,47,108,0.3)]"
					: data.highlighted
						? "border-gold bg-gold-soft/40"
						: "border-line bg-white shadow-[0_10px_30px_-18px_rgba(0,30,80,0.22)]"
			} ${data.dimmed ? "opacity-50" : ""}`}
		>
			<Handle type="target" position={Position.Top} id="t" className="!bg-navy/40" />
			<Handle type="target" position={Position.Bottom} id="bt" className="!bg-navy/40" />
			<Handle type="source" position={Position.Bottom} id="b" className="!bg-navy/40" />
			<Handle type="source" position={Position.Right} id="r" className="!bg-navy/40" />
			<Handle type="target" position={Position.Right} id="rt" className="!bg-navy/40" />
			<Handle type="source" position={Position.Left} id="ls" className="!bg-navy/40" />
			<Handle type="source" position={Position.Top} id="ts" className="!bg-navy/40" />
			<Handle type="target" position={Position.Left} id="l" className="!bg-navy/40" />
			<div className="flex items-start justify-between gap-2">
				<p className="text-sm font-semibold text-ink">{data.title}</p>
				{data.badge && (
					<span className="shrink-0 rounded-full bg-gold-soft px-2 py-0.5 text-[10px] font-bold text-[#7a5a12]">
						{data.badge}
					</span>
				)}
			</div>
			<p className="mt-1.5 text-[11px] leading-snug text-mute">{data.subtitle}</p>
			{data.balance !== undefined && (
				<p className="mt-2 font-mono text-xs font-semibold text-navy">{data.balance}</p>
			)}
		</div>
	);
});

type MptEdgeData = {
	active: boolean;
	/** part of the selected scenario's subset — accent stroke even before the simulation runs */
	highlighted: boolean;
	dimmed: boolean;
	/** push the label off the edge midpoint (used to drop rail labels into open space) */
	labelOffsetY: number;
	/** place the label at this fraction of the source→target line instead of the path midpoint */
	labelT?: number;
};

const MptEdge = memo(function MptEdge({
	id,
	sourceX,
	sourceY,
	targetX,
	targetY,
	sourcePosition,
	targetPosition,
	style,
	label,
	data,
	markerEnd,
}: EdgeProps<Edge<MptEdgeData>>) {
	const [path, labelX, labelY] = getBezierPath({
		sourceX,
		sourceY,
		targetX,
		targetY,
		sourcePosition,
		targetPosition,
	});
	const active = data?.active ?? false;
	const highlighted = data?.highlighted ?? false;
	const dimmed = data?.dimmed ?? false;
	const offsetY = data?.labelOffsetY ?? 0;
	const t = data?.labelT;
	const lx = t !== undefined ? sourceX + (targetX - sourceX) * t : labelX;
	const ly = t !== undefined ? sourceY + (targetY - sourceY) * t : labelY;
	return (
		<>
			<BaseEdge id={id} path={path} style={style} markerEnd={markerEnd} />
			{label && (
				<EdgeLabelRenderer>
					<div
						style={{
							position: "absolute",
							transform: `translate(-50%, -50%) translate(${lx}px, ${ly + offsetY}px)`,
						}}
						className={`pointer-events-none max-w-[300px] rounded-lg border px-2 py-1 text-center text-[10px] leading-snug transition-opacity duration-300 ${
							active
								? "border-navy/50 bg-white text-navy"
								: highlighted
									? "border-gold/60 bg-white text-[#7a5a12]"
									: "border-line bg-white/90 text-mute"
						} ${dimmed ? "opacity-50" : ""}`}
					>
						{label}
					</div>
				</EdgeLabelRenderer>
			)}
		</>
	);
});

const nodeTypes = { mpt: MptNode };
const edgeTypes = { mpt: MptEdge };

export type FlowOrientation = "vertical" | "horizontal";

/**
 * Wide-screen layout. Middle row: the checkout rail, left→right — bank → Revolut →
 * the merchant's Monerium IBAN → Monerium mints straight into the merchant's Safe.
 * Above it: the detour for payments without a reference (mint to the tenant's main
 * Safe, then ProjectRouter to the project Safe). Bottom row: the user's own wallet,
 * funded through an own Monerium account, and the branches that leave from it; the
 * return edges (off-ramp to the bank, GP card top-up to Revolut) climb back up.
 */
const H_POS: Record<NodeId, { x: number; y: number }> = {
	bank: { x: 0, y: 60 },
	revolut: { x: 360, y: 60 },
	moneriumMpt: { x: 720, y: 60 },
	safeRelayer: { x: 1080, y: -300 },
	merchant: { x: 1440, y: 60 },
	ownMonerium: { x: 360, y: 470 },
	userAddress: { x: 720, y: 470 },
	gnosisPay: { x: 1080, y: 470 },
	otherAddress: { x: 1440, y: 470 },
};

type HRoute = {
	source: string;
	target: string;
	labelOffsetY?: number;
	labelT?: number;
};

/** horizontal-layout edge routing: which handles each edge uses and where its label sits */
const H_ROUTE: Record<EdgeId, HRoute> = {
	"e-card": { source: "r", target: "l", labelOffsetY: 96 },
	"e-sepa": { source: "r", target: "l", labelOffsetY: 96 },
	// direct mint: the empty slot between Monerium and the merchant is the point
	"e-mint": { source: "r", target: "l" },
	"e-mint-main": { source: "ts", target: "l" },
	"e-forward": { source: "r", target: "t" },
	"e-own-sepa": { source: "b", target: "t" },
	"e-own-mint": { source: "r", target: "l", labelOffsetY: -95 },
	"e-redeem": { source: "b", target: "bt", labelT: 0.5, labelOffsetY: 100 },
	"e-offramp": { source: "ls", target: "bt" },
	"e-p2p": { source: "b", target: "bt", labelT: 0.5, labelOffsetY: 100 },
	"e-checkout": { source: "ts", target: "bt", labelT: 0.62 },
	"e-gp-fund": { source: "r", target: "l", labelOffsetY: -95 },
	"e-gp-spend": { source: "r", target: "bt", labelT: 0.55 },
	"e-gp-revolut": { source: "ts", target: "bt", labelT: 0.3 },
};

/** single-column order for phones — everything stacked, near full-size nodes */
const V_ORDER: NodeId[] = [
	"bank",
	"revolut",
	"moneriumMpt",
	"safeRelayer",
	"merchant",
	"ownMonerium",
	"userAddress",
	"otherAddress",
	"gnosisPay",
];

const V_POS: Record<NodeId, { x: number; y: number }> = Object.fromEntries(
	V_ORDER.map((id, i) => [id, { x: 20, y: i * 195 }]),
) as Record<NodeId, { x: number; y: number }>;

/** non-adjacent connections in the single column — drawn as right-side arcs, no label */
const V_ARC: Set<EdgeId> = new Set([
	"e-mint",
	"e-own-sepa",
	"e-checkout",
	"e-gp-fund",
	"e-gp-spend",
	"e-redeem",
	"e-gp-revolut",
	"e-offramp",
]);

export interface FlowDiagramProps {
	locale: Locale;
	orientation?: FlowOrientation;
	activeNode?: NodeId;
	activeEdge?: EdgeId;
	/** formatted balances per node, shown inside nodes during simulations */
	balances?: Partial<Record<NodeId, string>>;
	/**
	 * the subset of the graph the selected scenario exercises; everything
	 * outside it renders at half opacity so scenarios read as subsets
	 */
	subsetNodes?: Set<NodeId>;
	subsetEdges?: Set<EdgeId>;
}

export default function FlowDiagram({
	locale,
	orientation = "vertical",
	activeNode,
	activeEdge,
	balances,
	subsetNodes,
	subsetEdges,
}: FlowDiagramProps) {
	const horizontal = orientation === "horizontal";

	const nodes: Node<MptNodeData>[] = useMemo(
		() =>
			flowNodes.map((n) => ({
				id: n.id,
				type: "mpt",
				position: horizontal ? H_POS[n.id] : V_POS[n.id],
				data: {
					title: n.title[locale],
					subtitle: n.subtitle[locale],
					badge: n.badge?.[locale],
					active: n.id === activeNode,
					highlighted: subsetNodes !== undefined && subsetNodes.has(n.id),
					dimmed: subsetNodes !== undefined && !subsetNodes.has(n.id),
					balance: balances?.[n.id],
				},
				draggable: false,
				connectable: false,
			})),
		[locale, horizontal, activeNode, balances, subsetNodes],
	);

	const edges: Edge<MptEdgeData>[] = useMemo(
		() =>
			flowEdges.map((e) => {
				const active = e.id === activeEdge;
				const highlighted = subsetEdges !== undefined && subsetEdges.has(e.id);
				const dimmed = subsetEdges !== undefined && !subsetEdges.has(e.id);
				let sourceHandle: string;
				let targetHandle: string;
				let label: string | undefined = e.label[locale];
				let labelOffsetY = 0;
				let labelT: number | undefined;
				if (horizontal) {
					const route = H_ROUTE[e.id];
					sourceHandle = route.source;
					targetHandle = route.target;
					labelOffsetY = route.labelOffsetY ?? 0;
					labelT = route.labelT;
				} else if (V_ARC.has(e.id)) {
					// skip connections arc along the right side of the single column
					sourceHandle = "r";
					targetHandle = "rt";
					label = undefined;
				} else {
					sourceHandle = "b";
					targetHandle = "t";
				}
				return {
					id: e.id,
					type: "mpt" as const,
					source: e.source,
					target: e.target,
					sourceHandle,
					targetHandle,
					label,
					animated: active,
					data: { active, highlighted, dimmed, labelOffsetY, labelT },
					markerEnd: {
						type: MarkerType.ArrowClosed,
						color: active ? "#002F6C" : highlighted ? "#C8912A" : "#9AA9C2",
						width: 22,
						height: 22,
					},
					style: {
						stroke: active ? "#002F6C" : highlighted ? "#C8912A" : "#9AA9C2",
						strokeWidth: active ? 2.5 : highlighted ? 2 : 1.5,
						opacity: dimmed ? 0.5 : 1,
						transition: "opacity 300ms",
					},
				};
			}),
		[locale, horizontal, activeEdge, subsetEdges],
	);

	return (
		<ReactFlow
			key={orientation}
			nodes={nodes}
			edges={edges}
			nodeTypes={nodeTypes}
			edgeTypes={edgeTypes}
			fitView
			fitViewOptions={{ padding: horizontal ? 0.08 : 0.02 }}
			minZoom={0.2}
			maxZoom={1.5}
			zoomOnScroll={false}
			preventScrolling={false}
			nodesDraggable={false}
			nodesConnectable={false}
			elementsSelectable={false}
			proOptions={{ hideAttribution: true }}
			colorMode="light"
			style={{ background: "transparent" }}
		>
			<Background color="#DCE3EF" gap={28} />
		</ReactFlow>
	);
}
