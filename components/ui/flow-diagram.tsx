"use client"

import {
  useCallback,
  useEffect,
  useLayoutEffect,
  useMemo,
  useRef,
  useState,
} from "react"

import { cn } from "@/lib/utils"
import { AppIcon, type IconComponent } from "@/components/ui/icon"

export type FlowStatus = "ok" | "warn" | "new"

export interface FlowNode {
  id: string
  title: string
  subtitle?: string
  status?: FlowStatus
  icon?: IconComponent
  /** Nested children — every node fans down to these. */
  children?: FlowNode[]
}

/** An extra edge as a [fromId, toId] pair — for cross-links. */
export type FlowEdge = [from: string, to: string]

export interface FlowDiagramProps {
  /** Root of the tree. */
  root: FlowNode
  /** Additional non-tree edges (cross-links), any id → any id. */
  links?: FlowEdge[]
  /** Horizontal px between sibling subtrees. */
  siblingGap?: number
  /** Vertical px between a node and its children row. */
  levelGap?: number
  className?: string
}

type Rect = { cx: number; top: number; bottom: number }

const STATUS_DOT: Record<FlowStatus, string> = {
  ok: "bg-emerald-500",
  warn: "bg-amber-500",
  new: "bg-sky-400",
}

/**
 * A sitemap / flow diagram: a root node branches into category columns, each a
 * vertical chain of nodes, joined by curved accent connectors. Nodes are real
 * DOM (responsive, themeable); the connectors are an SVG overlay measured from
 * the live node positions, with a soft accent glow and a one-time draw-in.
 * Hovering a node highlights its edges and dims the rest.
 *
 * Pass `links` for cross-links or sub-children that aren't part of a column's
 * straight chain.
 */
export function FlowDiagram({
  root,
  links,
  siblingGap = 48,
  levelGap = 64,
  className,
}: FlowDiagramProps) {
  const containerRef = useRef<HTMLDivElement>(null)
  const nodeEls = useRef(new Map<string, HTMLDivElement>())
  const [rects, setRects] = useState<Record<string, Rect>>({})
  const [hovered, setHovered] = useState<string | null>(null)
  const [drawn, setDrawn] = useState(false)
  const [animate, setAnimate] = useState(true)

  const register = useCallback((id: string, el: HTMLDivElement | null) => {
    if (el) nodeEls.current.set(id, el)
    else nodeEls.current.delete(id)
  }, [])

  // Derive the full edge list: every node → each of its children, plus links.
  const edges = useMemo<FlowEdge[]>(() => {
    const out: FlowEdge[] = []
    const walk = (node: FlowNode) => {
      for (const child of node.children ?? []) {
        out.push([node.id, child.id])
        walk(child)
      }
    }
    walk(root)
    if (links) out.push(...links)
    return out
  }, [root, links])

  const incoming = useMemo(() => new Set(edges.map(([, b]) => b)), [edges])

  const isConnected = useCallback(
    (id: string) =>
      hovered != null &&
      (hovered === id ||
        edges.some(([a, b]) => (a === id && b === hovered) || (b === id && a === hovered))),
    [hovered, edges]
  )

  const measure = useCallback(() => {
    const c = containerRef.current
    if (!c) return
    const cr = c.getBoundingClientRect()
    const next: Record<string, Rect> = {}
    nodeEls.current.forEach((el, id) => {
      const r = el.getBoundingClientRect()
      next[id] = {
        cx: r.left - cr.left + r.width / 2,
        top: r.top - cr.top,
        bottom: r.bottom - cr.top,
      }
    })
    setRects(next)
  }, [])

  useLayoutEffect(() => {
    // Measuring laid-out DOM into state is the intended use here (positions for
    // the SVG connectors).
    measure()
    const ro = new ResizeObserver(() => measure())
    if (containerRef.current) ro.observe(containerRef.current)
    nodeEls.current.forEach((el) => ro.observe(el))
    window.addEventListener("resize", measure)
    return () => {
      ro.disconnect()
      window.removeEventListener("resize", measure)
    }
  }, [measure, edges])

  // One-time draw-in once positions are known (respect reduced motion).
  useEffect(() => {
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches
    if (reduced) {
      // Show connectors immediately, no draw-in animation.
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

  const renderCard = (node: FlowNode, variant: "root" | "header" | "node") => {
    const connected = isConnected(node.id)
    const dim = hovered != null && !connected

    return (
      <div
        key={node.id}
        ref={(el) => register(node.id, el)}
        onMouseEnter={() => setHovered(node.id)}
        onMouseLeave={() => setHovered(null)}
        className={cn(
          "relative flex items-center gap-2.5 rounded-xl px-3.5 py-2.5 text-left transition-all duration-200 ease-out",
          variant === "root"
            ? "bg-gradient-to-b from-accent to-accent/85 text-background shadow-[var(--shadow-md)] ring-1 ring-accent/40"
            : "bg-card ring-1 ring-foreground/10 shadow-sm hover:-translate-y-0.5 hover:shadow-md hover:ring-accent/40",
          variant === "header" && "min-w-[136px]",
          variant === "node" && "min-w-[120px]",
          dim && "opacity-40",
          connected && variant !== "root" && "ring-accent/50"
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
                variant === "root" ? "text-background/70" : "text-muted-foreground"
              )}
            >
              {node.subtitle}
            </p>
          )}
        </div>
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

  // Resolve drawable edges once per render.
  const paths = edges
    .map(([a, b], i) => {
      const pa = rects[a]
      const pb = rects[b]
      if (!pa || !pb) return null
      const x1 = pa.cx
      const y1 = pa.bottom
      const x2 = pb.cx
      const y2 = pb.top
      const k = Math.max(24, Math.abs(y2 - y1) * 0.6)
      const d = `M ${x1} ${y1} C ${x1} ${y1 + k} ${x2} ${y2 - k} ${x2} ${y2}`
      const active = hovered != null && (a === hovered || b === hovered)
      const op = hovered != null && !active ? 0.1 : active ? 1 : 0.42
      return { key: i, d, op, active }
    })
    .filter((p): p is NonNullable<typeof p> => p !== null)

  return (
    <div ref={containerRef} className={cn("relative", className)}>
      {/* Connector overlay — measured from live node positions */}
      <svg className="pointer-events-none absolute inset-0 h-full w-full" aria-hidden>
        <defs>
          <filter id="flow-glow" x="-20%" y="-20%" width="140%" height="140%">
            <feGaussianBlur stdDeviation="2.6" />
          </filter>
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

        {/* crisp lines */}
        {paths.map((p) => (
          <path
            key={`c-${p.key}`}
            d={p.d}
            fill="none"
            stroke="var(--accent)"
            strokeWidth={p.active ? 1.75 : 1.25}
            strokeLinecap="round"
            strokeOpacity={p.op}
            pathLength={1}
            strokeDasharray={1}
            strokeDashoffset={drawn ? 0 : 1}
            style={{ transition: lineTransition }}
          />
        ))}

        {/* connection dots where an edge lands on a node */}
        {[...incoming].map((id) => {
          const r = rects[id]
          if (!r) return null
          const faded = hovered != null && !isConnected(id)
          return (
            <circle
              key={`dot-${id}`}
              cx={r.cx}
              cy={r.top}
              r={2.2}
              fill="var(--accent)"
              opacity={drawn ? (faded ? 0.15 : 0.9) : 0}
              style={{ transition: "opacity 0.4s ease" }}
            />
          )
        })}
      </svg>

      {/* Nodes — recursive org-chart tree */}
      <div className="relative z-10 flex justify-center">
        {renderSubtree(root)}
      </div>
    </div>
  )

  function renderSubtree(node: FlowNode) {
    const variant: "root" | "header" | "node" =
      node.id === root.id ? "root" : node.children?.length ? "header" : "node"
    return (
      <div key={node.id} className="flex flex-col items-center">
        {renderCard(node, variant)}
        {node.children?.length ? (
          <div
            className="flex items-start"
            style={{ marginTop: levelGap, columnGap: siblingGap }}
          >
            {node.children.map((child) => renderSubtree(child))}
          </div>
        ) : null}
      </div>
    )
  }
}
