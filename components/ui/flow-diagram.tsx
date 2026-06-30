"use client"

import {
  type PointerEvent as ReactPointerEvent,
  useCallback,
  useEffect,
  useLayoutEffect,
  useMemo,
  useRef,
  useState,
} from "react"

import { IconArrowUpRight } from "@tabler/icons-react"

import { cn } from "@/lib/utils"
import { AppIcon, type IconComponent } from "@/components/ui/icon"

export type FlowStatus = "ok" | "warn" | "new"

export interface FlowNode {
  id: string
  title: string
  subtitle?: string
  status?: FlowStatus
  icon?: IconComponent
  /** Labels the connector coming *into* this node from its parent. */
  edgeLabel?: string
  /** Optional link — renders an arrow affordance that navigates on click. */
  href?: string
  /** Nested children — every node fans down to these. */
  children?: FlowNode[]
}

/**
 * An extra (non-tree) edge. Either a `[fromId, toId]` tuple or an object form
 * `{ from, to, label? }` when the cross-link needs a label.
 */
export type FlowEdge =
  | [from: string, to: string]
  | { from: string; to: string; label?: string }

export interface FlowDiagramProps {
  /** Root of the tree. */
  root: FlowNode
  /** Additional non-tree edges (cross-links), any id → any id. */
  links?: FlowEdge[]
  /** Horizontal px between top-level column lanes. */
  columnGap?: number
  /** Vertical px between stacked nodes in a lane. */
  rowGap?: number
  /** Horizontal px each nesting level is indented within a lane. */
  indentStep?: number
  /** Container width (px) below which lanes stack vertically. */
  compactBelow?: number
  /** Allow repositioning nodes by holding and dragging with the cursor. */
  draggable?: boolean
  /** Show a small "how to explore" hint in the bottom-right corner. */
  showHelp?: boolean
  className?: string
}

type Rect = { cx: number; left: number; top: number; bottom: number }
type NormEdge = { from: string; to: string; label?: string; kind: "tree" | "link" }
type Side = "up" | "down" | "left" | "right"
type Port = { x: number; y: number; dir: Side }

const STATUS_DOT: Record<FlowStatus, string> = {
  ok: "bg-emerald-500",
  warn: "bg-amber-500",
  new: "bg-sky-400",
}

const STATUS_LABEL: Record<FlowStatus, string> = {
  ok: "Stable",
  warn: "Needs work",
  new: "New",
}

/** SVG `fill-*` utilities so connection dots can carry the child's status. */
const STATUS_FILL: Record<FlowStatus, string> = {
  ok: "fill-emerald-500",
  warn: "fill-amber-500",
  new: "fill-sky-400",
}

/** Tree edges (parent → child) for the whole tree, carrying each child's `edgeLabel`. */
function treeEdges(node: FlowNode): NormEdge[] {
  const out: NormEdge[] = []
  for (const child of node.children ?? []) {
    out.push({ from: node.id, to: child.id, label: child.edgeLabel, kind: "tree" })
    out.push(...treeEdges(child))
  }
  return out
}

/** A node's descendants in vertical-stack order, each tagged with its depth. */
function flattenWithDepth(node: FlowNode, depth = 1): { node: FlowNode; depth: number }[] {
  const out: { node: FlowNode; depth: number }[] = []
  for (const child of node.children ?? []) {
    out.push({ node: child, depth })
    out.push(...flattenWithDepth(child, depth + 1))
  }
  return out
}

/** Whether any node in the tree declares a status (drives the legend). */
function statusesUsed(node: FlowNode): Set<FlowStatus> {
  const set = new Set<FlowStatus>()
  const walk = (n: FlowNode) => {
    if (n.status) set.add(n.status)
    n.children?.forEach(walk)
  }
  walk(node)
  return set
}

function normalizeEdge(e: FlowEdge): NormEdge {
  return Array.isArray(e)
    ? { from: e[0], to: e[1], kind: "link" }
    : { from: e.from, to: e.to, label: e.label, kind: "link" }
}

/**
 * A sitemap / flow diagram: a root node branches into column lanes, each a true
 * parent→child tree rendered as an indented stack, joined by directed accent
 * connectors. Nodes are real DOM (responsive, themeable, keyboard-focusable);
 * the connectors are an SVG overlay measured from live node positions, with a
 * soft accent glow, arrowheads, optional edge labels, and a one-time draw-in.
 * Hovering or focusing a node highlights its edges and dims the rest. Below
 * `compactBelow` the lanes stack vertically for small screens.
 *
 * Pass `links` for cross-links beyond the tree edges; use `edgeLabel` on a node
 * to label the connector coming into it from its parent.
 */
export function FlowDiagram({
  root,
  links,
  columnGap = 24,
  rowGap = 28,
  indentStep = 18,
  compactBelow = 640,
  draggable = false,
  showHelp = false,
  className,
}: FlowDiagramProps) {
  const containerRef = useRef<HTMLDivElement>(null)
  const nodeEls = useRef(new Map<string, HTMLDivElement>())
  const [rects, setRects] = useState<Record<string, Rect>>({})
  const [compact, setCompact] = useState(false)
  const [hovered, setHovered] = useState<string | null>(null)
  const [pinned, setPinned] = useState<string | null>(null)
  const [statusFilter, setStatusFilter] = useState<FlowStatus | null>(null)
  const [offsets, setOffsets] = useState<Record<string, { x: number; y: number }>>({})
  const [drawn, setDrawn] = useState(false)
  const [animate, setAnimate] = useState(true)

  // Active drag gesture + a flag to swallow the click that ends a real drag.
  const drag = useRef<{
    id: string
    startX: number
    startY: number
    baseX: number
    baseY: number
    moved: boolean
  } | null>(null)
  const suppressClick = useRef(false)

  const register = useCallback((id: string, el: HTMLDivElement | null) => {
    if (el) nodeEls.current.set(id, el)
    else nodeEls.current.delete(id)
  }, [])

  const columns = useMemo(() => root.children ?? [], [root])
  const legend = useMemo(() => statusesUsed(root), [root])

  // All edges: true parent→child tree edges plus any cross-links.
  const edges = useMemo<NormEdge[]>(() => {
    const out = treeEdges(root)
    if (links) out.push(...links.map(normalizeEdge))
    return out
  }, [root, links])

  // Tree lookups for path/subtree highlighting and status-colored dots.
  const { nodeIndex, parentOf, childrenOf } = useMemo(() => {
    const nodeIndex = new Map<string, FlowNode>()
    const parentOf = new Map<string, string>()
    const childrenOf = new Map<string, string[]>()
    const walk = (n: FlowNode) => {
      nodeIndex.set(n.id, n)
      const kids = n.children ?? []
      childrenOf.set(n.id, kids.map((k) => k.id))
      for (const k of kids) {
        parentOf.set(k.id, n.id)
        walk(k)
      }
    }
    walk(root)
    return { nodeIndex, parentOf, childrenOf }
  }, [root])

  // The node whose branch is emphasized: hover previews over a persistent pin.
  const activeId = hovered ?? pinned

  // Inclusive chain from a node up to the root (its "spine").
  const ancestorsInclusive = useCallback(
    (id: string) => {
      const out = [id]
      let cur = parentOf.get(id)
      while (cur) {
        out.push(cur)
        cur = parentOf.get(cur)
      }
      return out
    },
    [parentOf]
  )

  // Every node beneath a node (DFS over the tree).
  const descendants = useCallback(
    (id: string) => {
      const out: string[] = []
      const stack = [...(childrenOf.get(id) ?? [])]
      while (stack.length) {
        const cur = stack.pop()!
        out.push(cur)
        stack.push(...(childrenOf.get(cur) ?? []))
      }
      return out
    },
    [childrenOf]
  )

  // Path-to-root ∪ subtree of the active node.
  const relatedNodes = useMemo(() => {
    if (activeId == null) return null
    return new Set<string>([...ancestorsInclusive(activeId), ...descendants(activeId)])
  }, [activeId, ancestorsInclusive, descendants])

  // What's highlighted: the active branch, else a status filter, else nothing.
  const highlightSet = useMemo(() => {
    if (relatedNodes) return relatedNodes
    if (statusFilter)
      return new Set([...nodeIndex.values()].filter((n) => n.status === statusFilter).map((n) => n.id))
    return null
  }, [relatedNodes, statusFilter, nodeIndex])

  // Edges along the active node's spine — used for the calm flow pulse.
  const spineEdges = useMemo(() => {
    if (activeId == null) return null
    return new Set(ancestorsInclusive(activeId))
  }, [activeId, ancestorsInclusive])

  const measure = useCallback(() => {
    const c = containerRef.current
    if (!c) return
    const cr = c.getBoundingClientRect()
    const next: Record<string, Rect> = {}
    nodeEls.current.forEach((el, id) => {
      const r = el.getBoundingClientRect()
      next[id] = {
        cx: r.left - cr.left + r.width / 2,
        left: r.left - cr.left,
        top: r.top - cr.top,
        bottom: r.bottom - cr.top,
      }
    })
    setRects(next)
  }, [])

  useLayoutEffect(() => {
    // Measuring laid-out DOM into state is the intended use here (positions for
    // the SVG connectors). The layout reflows on `compact`, so re-measure then.
    // eslint-disable-next-line react-hooks/set-state-in-effect
    measure()
    const ro = new ResizeObserver(() => measure())
    if (containerRef.current) ro.observe(containerRef.current)
    nodeEls.current.forEach((el) => ro.observe(el))
    window.addEventListener("resize", measure)
    return () => {
      ro.disconnect()
      window.removeEventListener("resize", measure)
    }
  }, [measure, edges, compact])

  // Re-measure connectors after a node is dragged (transforms don't trip the
  // ResizeObserver).
  useLayoutEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    measure()
  }, [offsets, measure])

  // Stack lanes vertically on small viewports. Uses a media query (not the
  // measured width) so it's correct even when the diagram sizes to its content.
  useEffect(() => {
    const mq = window.matchMedia(`(max-width: ${compactBelow}px)`)
    const sync = () => setCompact(mq.matches)
    sync()
    mq.addEventListener("change", sync)
    return () => mq.removeEventListener("change", sync)
  }, [compactBelow])

  // Switching layout mode invalidates pixel offsets — start clean.
  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setOffsets({})
  }, [compact])

  // Clicking anywhere outside a node clears the pinned branch.
  useEffect(() => {
    if (pinned == null) return
    const onDown = (e: PointerEvent) => {
      const target = e.target as Node | null
      if (!target) return
      for (const el of nodeEls.current.values()) {
        if (el.contains(target)) return
      }
      setPinned(null)
    }
    document.addEventListener("pointerdown", onDown)
    return () => document.removeEventListener("pointerdown", onDown)
  }, [pinned])

  // One-time draw-in once positions are known (respect reduced motion).
  useEffect(() => {
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches
    if (reduced) {
      // Show connectors immediately, no draw-in animation.
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setAnimate(false)
      setDrawn(true)
      return
    }
    const id = requestAnimationFrame(() => requestAnimationFrame(() => setDrawn(true)))
    return () => cancelAnimationFrame(id)
  }, [])

  const lineTransition = animate
    ? "stroke-dashoffset 0.7s cubic-bezier(0.22,1,0.36,1), stroke-opacity 0.25s ease"
    : "stroke-opacity 0.25s ease"

  const togglePin = (id: string) => setPinned((p) => (p === id ? null : id))

  // Dragging is disabled in the compact (phone) layout: the stacked tree isn't
  // suited to free positioning and `touch-none` nodes would block page scroll.
  // Tablets / touch screens wider than `compactBelow` keep drag via pointers.
  const dragEnabled = draggable && !compact

  // Pointer-drag a node. Uses pointer capture so move/up keep firing on the
  // card even when the cursor leaves it; a small threshold separates a drag
  // from a click (so dragging never toggles the pin).
  const onNodePointerDown = (e: ReactPointerEvent<HTMLDivElement>, id: string) => {
    if (!dragEnabled || e.button !== 0) return
    const base = offsets[id] ?? { x: 0, y: 0 }
    drag.current = { id, startX: e.clientX, startY: e.clientY, baseX: base.x, baseY: base.y, moved: false }
    e.currentTarget.setPointerCapture(e.pointerId)
  }
  const onNodePointerMove = (e: ReactPointerEvent<HTMLDivElement>) => {
    const d = drag.current
    if (!d) return
    const dx = e.clientX - d.startX
    const dy = e.clientY - d.startY
    if (!d.moved && Math.abs(dx) + Math.abs(dy) > 4) d.moved = true
    // Round to whole pixels — a sub-pixel transform composites the card and
    // renders its text blurry.
    if (d.moved)
      setOffsets((o) => ({
        ...o,
        [d.id]: { x: Math.round(d.baseX + dx), y: Math.round(d.baseY + dy) },
      }))
  }
  const onNodePointerUp = () => {
    if (drag.current?.moved) suppressClick.current = true
    drag.current = null
  }
  const resetNode = (id: string) =>
    setOffsets((o) => {
      if (!(id in o)) return o
      const next = { ...o }
      delete next[id]
      return next
    })
  const resetAll = () => setOffsets({})
  const hasOffsets = Object.keys(offsets).length > 0

  // Compact stacks everything into one indented file-tree, so it needs a wider
  // indent for the elbow connectors' horizontal stubs to read.
  const indent = compact ? 28 : indentStep

  const renderCard = (node: FlowNode, variant: "root" | "header" | "node", depth = 0) => {
    const inBranch = relatedNodes?.has(node.id) ?? false
    const dim = highlightSet != null && !highlightSet.has(node.id)
    const isPinned = pinned === node.id
    const off = offsets[node.id]

    return (
      <div
        key={node.id}
        ref={(el) => register(node.id, el)}
        tabIndex={0}
        role="button"
        aria-pressed={isPinned}
        onMouseEnter={() => setHovered(node.id)}
        onMouseLeave={() => setHovered(null)}
        onFocus={() => setHovered(node.id)}
        onBlur={() => setHovered(null)}
        onClick={() => {
          if (suppressClick.current) {
            suppressClick.current = false
            return
          }
          togglePin(node.id)
        }}
        onKeyDown={(e) => {
          if (e.key === "Enter" || e.key === " ") {
            e.preventDefault()
            togglePin(node.id)
          }
        }}
        onPointerDown={dragEnabled ? (e) => onNodePointerDown(e, node.id) : undefined}
        onPointerMove={dragEnabled ? onNodePointerMove : undefined}
        onPointerUp={dragEnabled ? onNodePointerUp : undefined}
        onDoubleClick={
          dragEnabled
            ? () => {
                // Deterministic "reset this node": clear its drag offset and any
                // pin the constituent clicks may have toggled.
                resetNode(node.id)
                setPinned(null)
              }
            : undefined
        }
        style={{
          ...(depth > 0 ? { marginLeft: depth * indent } : null),
          ...(off ? { transform: `translate(${off.x}px, ${off.y}px)`, zIndex: 30 } : null),
        }}
        className={cn(
          "relative flex items-center gap-2.5 rounded-xl px-3.5 py-2.5 text-left duration-200 ease-out",
          "outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2 focus-visible:ring-offset-background",
          // Exclude `transform` from the transition when draggable so the box —
          // and the measured connector endpoints — track position instantly.
          dragEnabled
            ? "cursor-grab touch-none transition-[opacity,box-shadow] active:cursor-grabbing"
            : "cursor-pointer transition-all",
          variant === "root"
            ? "bg-gradient-to-b from-accent to-accent/85 text-background shadow-[var(--shadow-md)] ring-1 ring-accent/40"
            : cn(
                "bg-card ring-1 ring-foreground/10 shadow-sm hover:shadow-md hover:ring-accent/40",
                !dragEnabled && "hover:-translate-y-0.5"
              ),
          variant === "header" && "min-w-[136px]",
          variant === "node" && "min-w-[120px]",
          dim && "opacity-[0.18]",
          inBranch && variant !== "root" && "ring-accent/50",
          isPinned && variant !== "root" && "ring-accent ring-2"
        )}
      >
        {node.icon && (
          <span
            className={cn(
              "flex size-7 shrink-0 items-center justify-center rounded-lg",
              variant === "root" ? "bg-background/20 text-background" : "bg-muted text-foreground/80"
            )}
          >
            <AppIcon icon={node.icon} size="md" />
          </span>
        )}
        <div className="min-w-0">
          <p
            className={cn(
              "truncate text-[13px] font-semibold leading-tight",
              variant === "root" ? "text-background" : "text-foreground"
            )}
          >
            {node.title}
          </p>
          {node.subtitle && (
            <p
              className={cn(
                "truncate text-[10.5px] leading-tight",
                variant === "root" ? "text-background/80" : "text-foreground/65"
              )}
            >
              {node.subtitle}
            </p>
          )}
        </div>
        {node.href && (
          <a
            href={node.href}
            aria-label={`Open ${node.title}`}
            onClick={(e) => e.stopPropagation()}
            onKeyDown={(e) => e.stopPropagation()}
            className={cn(
              "ml-auto shrink-0 rounded-md p-0.5 outline-none transition-colors focus-visible:ring-2 focus-visible:ring-accent",
              variant === "root"
                ? "text-background/70 hover:text-background"
                : "text-muted-foreground hover:text-foreground"
            )}
          >
            <IconArrowUpRight size={14} strokeWidth={2} />
          </a>
        )}
        {node.status && (
          <span
            className={cn(
              "absolute -right-1 -top-1 size-2.5 rounded-full ring-2 ring-background",
              STATUS_DOT[node.status]
            )}
          />
        )}
      </div>
    )
  }

  // Resolve drawable edges once per render (path + label position + emphasis).
  const paths = edges
    .map((e, i) => {
      const pa = rects[e.from]
      const pb = rects[e.to]
      if (!pa || !pb) return null
      const isTree = e.kind === "tree"
      // An edge is emphasized when it's inside the active branch (both ends in
      // the path∪subtree) or, for a cross-link, incident to the active node.
      const active = isTree
        ? relatedNodes != null && relatedNodes.has(e.from) && relatedNodes.has(e.to)
        : activeId != null && (e.from === activeId || e.to === activeId)
      const op = highlightSet != null && !active ? 0.06 : active ? 1 : 0.42
      // Labels read at near-full strength at rest (the line stays subtle).
      const labelOp = highlightSet != null && !active ? 0.12 : active ? 1 : 0.92
      const onSpine =
        isTree && spineEdges != null && spineEdges.has(e.from) && spineEdges.has(e.to)
      const toStatus = nodeIndex.get(e.to)?.status
      const dashed = e.kind === "link"

      let d: string
      let mx: number
      let my: number
      let dotX: number
      let dotY: number
      if (compact) {
        // Indented file-tree elbow: drop a vertical spine from the parent's left
        // gutter, then a rounded corner into the child's left edge.
        const gx = pa.left + 14
        const cy = (pb.top + pb.bottom) / 2
        const r = Math.min(8, Math.max(0, (cy - pa.bottom) / 2), Math.max(0, pb.left - gx))
        d = `M ${gx} ${pa.bottom} V ${cy - r} Q ${gx} ${cy} ${gx + r} ${cy} H ${pb.left}`
        mx = (gx + pb.left) / 2
        my = cy
        dotX = pb.left
        dotY = cy
      } else {
        // Anchor each end to the side facing the other box, then curve between
        // those ports so lines leave/enter perpendicular to the chosen side.
        const paCy = (pa.top + pa.bottom) / 2
        const pbCy = (pb.top + pb.bottom) / 2
        const paRight = pa.cx * 2 - pa.left
        const pbRight = pb.cx * 2 - pb.left
        const dx = pb.cx - pa.cx

        let p0: Port
        let p1: Port
        if (e.from === root.id) {
          // Top-level fan: out the parent's bottom, into the child's top.
          p0 = { x: pa.cx, y: pa.bottom, dir: "down" }
          p1 = { x: pb.cx, y: pb.top, dir: "up" }
        } else if (pb.top >= pa.bottom - 4) {
          // Child sits below the parent: exit the bottom, enter the near side.
          p0 = { x: pa.cx, y: pa.bottom, dir: "down" }
          if (dx > 6) p1 = { x: pb.left, y: pbCy, dir: "left" }
          else if (dx < -6) p1 = { x: pbRight, y: pbCy, dir: "right" }
          else p1 = { x: pb.cx, y: pb.top, dir: "up" }
        } else if (dx >= 0) {
          // Same row / cross-link to the right: right side → left side.
          p0 = { x: paRight, y: paCy, dir: "right" }
          p1 = { x: pb.left, y: pbCy, dir: "left" }
        } else {
          // Same row / cross-link to the left: left side → right side.
          p0 = { x: pa.left, y: paCy, dir: "left" }
          p1 = { x: pbRight, y: pbCy, dir: "right" }
        }

        const dist = Math.hypot(p1.x - p0.x, p1.y - p0.y)
        const k = Math.max(20, dist * 0.32)
        const ctrlPt = (p: Port) =>
          p.dir === "down"
            ? { x: p.x, y: p.y + k }
            : p.dir === "up"
              ? { x: p.x, y: p.y - k }
              : p.dir === "left"
                ? { x: p.x - k, y: p.y }
                : { x: p.x + k, y: p.y }
        const c0 = ctrlPt(p0)
        const c1 = ctrlPt(p1)
        d = `M ${p0.x} ${p0.y} C ${c0.x} ${c0.y} ${c1.x} ${c1.y} ${p1.x} ${p1.y}`
        // Cubic value at t=0.5 for an accurate label anchor.
        mx = 0.125 * p0.x + 0.375 * c0.x + 0.375 * c1.x + 0.125 * p1.x
        my = 0.125 * p0.y + 0.375 * c0.y + 0.375 * c1.y + 0.125 * p1.y
        dotX = p1.x
        dotY = p1.y
      }
      return { key: i, d, op, labelOp, active, onSpine, toStatus, label: e.label, mx, my, dotX, dotY, dashed }
    })
    .filter((p): p is NonNullable<typeof p> => p !== null)

  return (
    <div className={cn("flex flex-col", className)}>
      {animate && (
        <style>{"@keyframes flow-diagram-dash{to{stroke-dashoffset:-16}}"}</style>
      )}

      <div ref={containerRef} className="relative">
        {/* Connector overlay — measured from live node positions */}
        <svg className="pointer-events-none absolute inset-0 h-full w-full overflow-visible" aria-hidden>
          <defs>
            <filter id="flow-glow" x="-20%" y="-20%" width="140%" height="140%">
              <feGaussianBlur stdDeviation="2.6" />
            </filter>
            <linearGradient id="flow-stroke" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="var(--accent)" stopOpacity="1" />
              <stop offset="100%" stopColor="var(--accent)" stopOpacity="0.45" />
            </linearGradient>
            <marker
              id="flow-arrow"
              viewBox="0 0 10 10"
              refX="8"
              refY="5"
              markerWidth="6"
              markerHeight="6"
              orient="auto-start-reverse"
            >
              <path d="M 0 0 L 10 5 L 0 10 z" fill="var(--accent)" />
            </marker>
          </defs>

          {/* soft glow underlay */}
          <g filter="url(#flow-glow)">
            {paths.map((p) => (
              <path
                key={`g-${p.key}`}
                d={p.d}
                fill="none"
                stroke="var(--accent)"
                strokeWidth={p.active ? 3 : 2}
                strokeLinecap="round"
                strokeOpacity={p.op * 0.5}
                pathLength={1}
                strokeDasharray={1}
                strokeDashoffset={drawn ? 0 : 1}
                style={{ transition: lineTransition }}
              />
            ))}
          </g>

          {/* crisp directed lines */}
          {paths.map((p) => (
            <path
              key={`c-${p.key}`}
              d={p.d}
              fill="none"
              stroke="url(#flow-stroke)"
              strokeWidth={p.active ? 1.75 : 1.25}
              strokeLinecap="round"
              strokeOpacity={p.op}
              markerEnd="url(#flow-arrow)"
              pathLength={1}
              strokeDasharray={p.dashed ? "5 4" : 1}
              strokeDashoffset={drawn ? 0 : 1}
              style={{ transition: lineTransition }}
            />
          ))}

          {/* animated flow pulse along the active node's spine (path to root) */}
          {animate &&
            drawn &&
            paths
              .filter((p) => p.onSpine)
              .map((p) => (
                <path
                  key={`f-${p.key}`}
                  d={p.d}
                  fill="none"
                  stroke="var(--accent)"
                  strokeWidth={2.25}
                  strokeLinecap="round"
                  strokeDasharray="2 6"
                  style={{ animation: "flow-diagram-dash 0.6s linear infinite" }}
                />
              ))}

          {/* connection dots where an edge lands on a node — tinted by status */}
          {paths.map((p) => (
            <circle
              key={`dot-${p.key}`}
              cx={p.dotX}
              cy={p.dotY}
              r={2.2}
              className={p.toStatus ? STATUS_FILL[p.toStatus] : "fill-[var(--accent)]"}
              opacity={drawn ? (highlightSet != null && !p.active ? 0.08 : 0.9) : 0}
              style={{ transition: "opacity 0.4s ease" }}
            />
          ))}
        </svg>

        {/* Edge labels — HTML layer for crisp, themeable text */}
        {paths.map((p) =>
          p.label ? (
            <span
              key={`lbl-${p.key}`}
              className="pointer-events-none absolute z-20 -translate-x-1/2 -translate-y-1/2 whitespace-nowrap rounded-full bg-card px-2 py-0.5 text-[10px] font-medium text-foreground/80 ring-1 ring-foreground/10 shadow-sm"
              style={{ left: p.mx, top: p.my, opacity: p.labelOp, transition: "opacity 0.25s ease" }}
            >
              {p.label}
            </span>
          ) : null
        )}

        {/* Nodes */}
        {compact ? (
          // One indented file-tree (root → columns → descendants), all stacked.
          <div className="relative z-10 flex flex-col items-start" style={{ rowGap }}>
            {renderCard(root, "root", 0)}
            {columns.flatMap((col) => [
              renderCard(col, "header", 1),
              ...flattenWithDepth(col, 2).map(({ node, depth }) => renderCard(node, "node", depth)),
            ])}
          </div>
        ) : (
          // Root over a row of indented tree lanes.
          <div className="relative z-10 flex flex-col items-center">
            {renderCard(root, "root")}
            <div
              className="flex items-start justify-center"
              style={{ marginTop: rowGap + 24, columnGap }}
            >
              {columns.map((col) => (
                <div key={col.id} className="flex flex-col items-start" style={{ rowGap }}>
                  {renderCard(col, "header")}
                  {flattenWithDepth(col).map(({ node, depth }) => renderCard(node, "node", depth))}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Viewer hint — bottom-right corner */}
        {showHelp && (
          <div className="pointer-events-auto absolute bottom-2 right-2 z-30 select-none rounded-lg border border-border/60 bg-card/80 px-2.5 py-2 text-[10px] leading-relaxed text-muted-foreground shadow-sm backdrop-blur-sm">
            <p className="mb-1 text-[9px] font-semibold uppercase tracking-[0.12em] text-muted-foreground/60">
              How to explore
            </p>
            <ul className="space-y-0.5">
              {compact ? (
                <li>
                  <span className="font-medium text-foreground/80">Tap</span> — highlight a branch
                </li>
              ) : (
                <>
                  <li>
                    <span className="font-medium text-foreground/80">Hover</span> — trace a path
                  </li>
                  <li>
                    <span className="font-medium text-foreground/80">Click</span> — pin a branch
                  </li>
                  {dragEnabled && (
                    <li>
                      <span className="font-medium text-foreground/80">Drag</span> — move a node
                    </li>
                  )}
                  {dragEnabled && (
                    <li>
                      <span className="font-medium text-foreground/80">Double-click</span> — reset a node
                    </li>
                  )}
                </>
              )}
            </ul>
            {dragEnabled && hasOffsets && (
              <button
                type="button"
                onClick={resetAll}
                className="mt-1.5 rounded text-[10px] font-medium text-accent outline-none hover:underline focus-visible:ring-2 focus-visible:ring-accent"
              >
                Reset layout
              </button>
            )}
          </div>
        )}
      </div>

      {/* Status legend — click an item to highlight only that status */}
      {legend.size > 0 && (
        <div className="mt-5 flex flex-wrap items-center justify-center gap-x-2 gap-y-1.5">
          {(["ok", "warn", "new"] as const)
            .filter((s) => legend.has(s))
            .map((s) => {
              const on = statusFilter === s
              return (
                <button
                  key={s}
                  type="button"
                  aria-pressed={on}
                  onClick={() => setStatusFilter((cur) => (cur === s ? null : s))}
                  className={cn(
                    "flex items-center gap-1.5 rounded-full px-2 py-0.5 text-[11px] outline-none transition-colors",
                    "focus-visible:ring-2 focus-visible:ring-accent",
                    on
                      ? "bg-muted text-foreground ring-1 ring-accent/40"
                      : "text-muted-foreground hover:text-foreground"
                  )}
                >
                  <span className={cn("size-2 rounded-full", STATUS_DOT[s])} />
                  {STATUS_LABEL[s]}
                </button>
              )
            })}
        </div>
      )}
    </div>
  )
}
