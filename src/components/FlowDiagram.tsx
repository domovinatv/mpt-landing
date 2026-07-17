"use client";

import { memo, useMemo } from "react";
import {
	Background,
	BaseEdge,
	EdgeLabelRenderer,
	Handle,
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
	balance?: string;
};

const MptNode = memo(function MptNode({ data }: NodeProps<Node<MptNodeData>>) {
	return (
		<div
			className={`w-[260px] rounded-2xl border p-4 backdrop-blur transition-all duration-300 ${
				data.active
					? "border-emerald-400 bg-emerald-400/10 shadow-[0_0_30px_rgba(52,211,153,0.25)]"
					: "border-zinc-700/80 bg-zinc-900/80"
			}`}
		>
			<Handle type="target" position={Position.Top} id="t" className="!bg-emerald-400/60" />
			<Handle type="source" position={Position.Bottom} id="b" className="!bg-emerald-400/60" />
			<Handle type="source" position={Position.Right} id="r" className="!bg-emerald-400/60" />
			<Handle type="target" position={Position.Right} id="rt" className="!bg-emerald-400/60" />
			<Handle type="target" position={Position.Left} id="l" className="!bg-emerald-400/60" />
			<div className="flex items-start justify-between gap-2">
				<p className="text-sm font-semibold text-zinc-100">{data.title}</p>
				{data.badge && (
					<span className="shrink-0 rounded-full bg-emerald-400/15 px-2 py-0.5 text-[10px] font-medium text-emerald-300">
						{data.badge}
					</span>
				)}
			</div>
			<p className="mt-1.5 text-[11px] leading-snug text-zinc-400">{data.subtitle}</p>
			{data.balance !== undefined && (
				<p className="mt-2 font-mono text-xs font-semibold text-emerald-300">{data.balance}</p>
			)}
		</div>
	);
});

type MptEdgeData = {
	active: boolean;
	/** push the label off the edge midpoint (used to drop rail labels into open space) */
	labelOffsetY: number;
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
	const offsetY = data?.labelOffsetY ?? 0;
	return (
		<>
			<BaseEdge id={id} path={path} style={style} />
			{label && (
				<EdgeLabelRenderer>
					<div
						style={{
							position: "absolute",
							transform: `translate(-50%, -50%) translate(${labelX}px, ${labelY + offsetY}px)`,
						}}
						className={`pointer-events-none max-w-[300px] rounded-lg border px-2 py-1 text-center text-[10px] leading-snug ${
							active
								? "border-emerald-400/50 bg-[#09120e] text-emerald-300"
								: "border-zinc-800 bg-[#09120e]/90 text-zinc-400"
						}`}
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

/** left-to-right layout for wide screens; the main rail is one row, branches sit below */
const H_POS: Record<NodeId, { x: number; y: number }> = {
	hrBank: { x: 0, y: 60 },
	revolut: { x: 340, y: 60 },
	moneriumMpt: { x: 680, y: 60 },
	safeRelayer: { x: 1020, y: 60 },
	userAddress: { x: 1360, y: 60 },
	ownMonerium: { x: 1700, y: 60 },
	euBank: { x: 2040, y: 60 },
	gnosisPay: { x: 850, y: 430 },
	otherAddress: { x: 1190, y: 430 },
	merchant: { x: 1530, y: 430 },
};

/** edges that drop to the branch row in the horizontal layout (bottom → top) */
const H_BRANCH: Set<EdgeId> = new Set(["e-p2p", "e-checkout", "e-gp-topup"]);

/** single-column order for phones — everything stacked, near full-size nodes */
const V_ORDER: NodeId[] = [
	"hrBank",
	"revolut",
	"moneriumMpt",
	"safeRelayer",
	"userAddress",
	"otherAddress",
	"gnosisPay",
	"merchant",
	"ownMonerium",
	"euBank",
];

const V_POS: Record<NodeId, { x: number; y: number }> = Object.fromEntries(
	V_ORDER.map((id, i) => [id, { x: 20, y: i * 195 }]),
) as Record<NodeId, { x: number; y: number }>;

/** non-adjacent connections in the single column — drawn as right-side arcs, no label */
const V_ARC: Set<EdgeId> = new Set(["e-checkout", "e-gp-topup", "e-redeem"]);

export interface FlowDiagramProps {
	locale: Locale;
	orientation?: FlowOrientation;
	activeNode?: NodeId;
	activeEdge?: EdgeId;
	/** formatted balances per node, shown inside nodes during simulations */
	balances?: Partial<Record<NodeId, string>>;
}

export default function FlowDiagram({
	locale,
	orientation = "vertical",
	activeNode,
	activeEdge,
	balances,
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
					balance: balances?.[n.id],
				},
				draggable: false,
				connectable: false,
			})),
		[locale, horizontal, activeNode, balances],
	);

	const edges: Edge<MptEdgeData>[] = useMemo(
		() =>
			flowEdges.map((e) => {
				const active = e.id === activeEdge;
				if (horizontal) {
					const branch = H_BRANCH.has(e.id);
					return {
						id: e.id,
						type: "mpt" as const,
						source: e.source,
						target: e.target,
						// the rail flows left→right, branches drop down to the second row
						sourceHandle: branch ? "b" : "r",
						targetHandle: branch ? "t" : "l",
						label: e.label[locale],
						animated: active,
						data: {
							active,
							// drop rail labels below the cards, into the band between the two rows
							labelOffsetY: branch ? 0 : 96,
						},
						style: {
							stroke: active ? "#34d399" : "#3f3f46",
							strokeWidth: active ? 2.5 : 1.5,
						},
					};
				}
				// vertical single column: adjacent hops flow top→bottom with a label
				// between the cards; skip connections arc along the right side
				const arc = V_ARC.has(e.id);
				return {
					id: e.id,
					type: "mpt" as const,
					source: e.source,
					target: e.target,
					sourceHandle: arc ? "r" : "b",
					targetHandle: arc ? "rt" : "t",
					label: arc ? undefined : e.label[locale],
					animated: active,
					data: { active, labelOffsetY: 0 },
					style: {
						stroke: active ? "#34d399" : "#3f3f46",
						strokeWidth: active ? 2.5 : 1.5,
					},
				};
			}),
		[locale, horizontal, activeEdge],
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
			colorMode="dark"
			style={{ background: "transparent" }}
		>
			<Background color="#1c2b24" gap={28} />
		</ReactFlow>
	);
}
