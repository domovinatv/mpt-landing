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
 * Wide-screen layout: the circle is explicit — the rail flows left→right in the
 * top row, drops to the bottom row at the user's address, and the two return
 * edges (off-ramp to the bank, GP card top-up to Revolut) climb back up left.
 */
const H_POS: Record<NodeId, { x: number; y: number }> = {
	bank: { x: 0, y: 60 },
	revolut: { x: 360, y: 60 },
	moneriumMpt: { x: 720, y: 60 },
	safeRelayer: { x: 1080, y: 60 },
	userAddress: { x: 1440, y: 60 },
	otherAddress: { x: 1800, y: 430 },
	merchant: { x: 1080, y: 430 },
	gnosisPay: { x: 720, y: 430 },
	ownMonerium: { x: 360, y: 430 },
};

/** horizontal-layout edge routing: rail = left→right, drop = down from the rail, up = climb back left */
const H_KIND: Record<EdgeId, "rail" | "drop" | "up"> = {
	"e-card": "rail",
	"e-sepa": "rail",
	"e-mint": "rail",
	"e-relay": "rail",
	"e-p2p": "drop",
	"e-checkout": "drop",
	"e-gp-fund": "drop",
	"e-redeem": "drop",
	"e-gp-spend": "rail",
	"e-gp-revolut": "up",
	"e-offramp": "up",
};

/** single-column order for phones — everything stacked, near full-size nodes */
const V_ORDER: NodeId[] = [
	"bank",
	"revolut",
	"moneriumMpt",
	"safeRelayer",
	"userAddress",
	"otherAddress",
	"gnosisPay",
	"merchant",
	"ownMonerium",
];

const V_POS: Record<NodeId, { x: number; y: number }> = Object.fromEntries(
	V_ORDER.map((id, i) => [id, { x: 20, y: i * 195 }]),
) as Record<NodeId, { x: number; y: number }>;

/** non-adjacent connections in the single column — drawn as right-side arcs, no label */
const V_ARC: Set<EdgeId> = new Set([
	"e-checkout",
	"e-gp-fund",
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
					const kind = H_KIND[e.id];
					if (kind === "rail") {
						sourceHandle = "r";
						targetHandle = "l";
						labelOffsetY = 96; // drop rail labels into the band between the rows
					} else if (kind === "drop") {
						sourceHandle = "b";
						targetHandle = "t";
						labelT = 0.78; // pull fan-out labels toward their targets so they don't collide
					} else {
						sourceHandle = "ls";
						targetHandle = "bt";
					}
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
			fitViewOptions={{ padding: horizontal ? 0.04 : 0.02 }}
			minZoom={0.2}
			maxZoom={1.5}
			zoomOnScroll={false}
			preventScrolling={false}
			nodesDraggable={false}
			nodesConnectable={false}
			elementsSelectable={false}
			colorMode="light"
			style={{ background: "transparent" }}
		>
			<Background color="#DCE3EF" gap={28} />
		</ReactFlow>
	);
}
