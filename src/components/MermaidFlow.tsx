"use client";

import { useEffect, useMemo, useRef } from "react";
import type { Locale } from "@/i18n/config";
import {
	edges as flowEdges,
	nodes as flowNodes,
	type EdgeId,
	type NodeId,
} from "@/lib/mpt-machine";

export interface MermaidFlowProps {
	locale: Locale;
	activeNode?: NodeId;
	activeEdge?: EdgeId;
	balances?: Partial<Record<NodeId, string>>;
	subsetNodes?: Set<NodeId>;
	subsetEdges?: Set<EdgeId>;
}

/** airKUNA-toned mermaid classes: dimmed < subset (gold) < active (navy) */
const CLASS_DEFS = [
	"classDef base fill:#ffffff,stroke:#E5E8EF,stroke-width:1.5px,color:#14202E",
	"classDef dim fill:#F5F7FB,stroke:#E9EDF4,stroke-width:1px,color:#9AA9C2",
	"classDef sub fill:#FBF3DD,stroke:#C8912A,stroke-width:1.5px,color:#14202E",
	"classDef act fill:#EAF0FA,stroke:#002F6C,stroke-width:2.5px,color:#002F6C",
].join("\n");

let renderSeq = 0;

/**
 * Phone rendering of the money-flow graph: a mermaid `flowchart TB` generated
 * from the same mpt-machine nodes/edges as the React Flow diagram. Node labels
 * carry title + live balance; edge labels are omitted (the log tells the story)
 * so the column stays narrow. Mermaid is imported dynamically so desktop
 * visitors never download it.
 */
export default function MermaidFlow({
	locale,
	activeNode,
	activeEdge,
	balances,
	subsetNodes,
	subsetEdges,
}: MermaidFlowProps) {
	const ref = useRef<HTMLDivElement>(null);

	const src = useMemo(() => {
		const nodeLines = flowNodes.map((n) => {
			const balance = balances?.[n.id];
			const label = balance ? `<b>${n.title[locale]}</b><br/>${balance}` : `<b>${n.title[locale]}</b>`;
			const cls =
				n.id === activeNode
					? "act"
					: subsetNodes !== undefined && subsetNodes.has(n.id)
						? "sub"
						: subsetNodes !== undefined
							? "dim"
							: "base";
			return `${n.id}["${label}"]:::${cls}`;
		});
		const edgeLines = flowEdges.map((e) => `${e.source} --> ${e.target}`);
		const linkStyles = flowEdges.map((e, i) => {
			const style =
				e.id === activeEdge
					? "stroke:#002F6C,stroke-width:2.5px"
					: subsetEdges !== undefined && subsetEdges.has(e.id)
						? "stroke:#C8912A,stroke-width:2px"
						: "stroke:#C6CEDD,stroke-width:1.5px";
			return `linkStyle ${i} ${style}`;
		});
		return ["flowchart TB", ...nodeLines, ...edgeLines, CLASS_DEFS, ...linkStyles].join("\n");
	}, [locale, activeNode, activeEdge, balances, subsetNodes, subsetEdges]);

	useEffect(() => {
		let cancelled = false;
		(async () => {
			const mermaid = (await import("mermaid")).default;
			mermaid.initialize({
				startOnLoad: false,
				theme: "base",
				themeVariables: {
					fontFamily: "Inter, system-ui, sans-serif",
					fontSize: "14px",
					lineColor: "#9AA9C2",
				},
				flowchart: { useMaxWidth: true, htmlLabels: true },
			});
			try {
				const { svg } = await mermaid.render(`mpt-mobile-${renderSeq++}`, src);
				if (!cancelled && ref.current) ref.current.innerHTML = svg;
			} catch {
				// a transient render error must not take the page down; the next
				// state change re-renders from scratch
			}
		})();
		return () => {
			cancelled = true;
		};
	}, [src]);

	return <div ref={ref} className="p-3 [&_svg]:h-auto [&_svg]:w-full" />;
}
