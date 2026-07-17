"use client";

import { memo, useMemo } from "react";
import {
	Background,
	Handle,
	Position,
	ReactFlow,
	type Edge,
	type Node,
	type NodeProps,
} from "@xyflow/react";
import "@xyflow/react/dist/style.css";
import type { Locale } from "@/i18n/config";
import { edges as flowEdges, nodes as flowNodes, type EdgeId, type NodeId } from "@/lib/mpt-machine";

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

const nodeTypes = { mpt: MptNode };

export interface FlowDiagramProps {
	locale: Locale;
	activeNode?: NodeId;
	activeEdge?: EdgeId;
	/** formatted balances per node, shown inside nodes during simulations */
	balances?: Partial<Record<NodeId, string>>;
}

export default function FlowDiagram({ locale, activeNode, activeEdge, balances }: FlowDiagramProps) {
	const nodes: Node<MptNodeData>[] = useMemo(
		() =>
			flowNodes.map((n) => ({
				id: n.id,
				type: "mpt",
				position: { x: n.x, y: n.y },
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
		[locale, activeNode, balances],
	);

	const edges: Edge[] = useMemo(
		() =>
			flowEdges.map((e) => {
				const active = e.id === activeEdge;
				return {
					id: e.id,
					source: e.source,
					target: e.target,
					sourceHandle: e.lateral ? "r" : "b",
					targetHandle: e.lateral ? "l" : "t",
					label: e.label[locale],
					animated: active,
					style: {
						stroke: active ? "#34d399" : "#3f3f46",
						strokeWidth: active ? 2.5 : 1.5,
					},
					labelStyle: {
						fill: active ? "#6ee7b7" : "#a1a1aa",
						fontSize: 10,
					},
					labelBgStyle: { fill: "#09120e", fillOpacity: 0.9 },
					labelBgPadding: [6, 3] as [number, number],
					labelBgBorderRadius: 6,
				};
			}),
		[locale, activeEdge],
	);

	return (
		<ReactFlow
			nodes={nodes}
			edges={edges}
			nodeTypes={nodeTypes}
			fitView
			fitViewOptions={{ padding: 0.06 }}
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
