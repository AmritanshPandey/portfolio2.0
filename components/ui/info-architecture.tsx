"use client"

import {
  useCallback,
  useEffect,
  useLayoutEffect,
  useMemo,
  useRef,
  useState,
  type CSSProperties,
  type ReactNode,
} from "react"

import { cn } from "@/lib/utils"

/**
 * One node in an information-architecture tree. The whole diagram is described
 * with plain nested objects — to edit the IA you only edit this data.
 */
export interface IaNode {
  /** The label shown on the node. */
  label: string
  /** Optional secondary line under the label. */
  note?: string
  /** Render this branch collapsed initially (click the node to expand). */
  collapsed?: boolean
  /** Nested children — branches fan away from the center. */
  children?: IaNode[]
}

export interface InfoArchitectureProps {
  /** The center node, e.g. "Home". */
  center: IaNode
  /** A tree that fans upward from the center, e.g. "Host" / "Seller". */
  up?: IaNode
  /** A tree that fans downward from the center, e.g. "Guest" / "Buyer". */
  down?: IaNode
  /** Override the accent color (any CSS color). Defaults to the theme accent. */
  accentColor?: string
  /** Vertical px between a node and its children row. */
  levelGap?: number
  /** Horizontal px between sibling nodes. */
  siblingGap?: number
  className?: string
}

type Dir = "up" | "down" | "center"
type Rect = { cx: number; top: number; bottom: number }

type Item = {
  id: string
  node: IaNode
  parentId: string | null
  dir: Dir
  depth: number
  childIds: string[]
}

const ACCENT = "var(--ia-accent, var(--accent))"

/** Flatten the three inputs into an id-keyed model shared by render + edges. */
function buildModel(center: IaNode, up?: IaNode, down?: IaNode): Map<string, Item> {
  const items = new Map<string, Item>()

  const add = (node: IaNode, parentId: string | null, dir: Dir, depth: number, id: string) => {
    const childIds: string[] = []
    items.set(id, { id, node, parentId, dir, depth, childIds })
    node.children?.forEach((child, i) => {
      const cid = `${id}.${i}`
      add(child, id, dir, depth + 1, cid)
      childIds.push(cid)
    })
  }

  add(center, null, "center", 0, "c")
  if (up) add(up, "c", "up", 0, "u")
  if (down) add(down, "c", "down", 0, "d")
  return items
}

/**
 * A bidirectional information-architecture / sitemap diagram. A center node
 * branches into an `up` tree and a `down` tree, each auto-laid-out with
 * flexbox (parents center over their children). Right-angle "elbow" connectors
 * are an SVG overlay measured from live node positions, with a soft accent glow
 * and a one-time draw-in. Any node with children is collapsible (click / Enter);
 * hovering or focusing a node highlights its edges and dims the rest.
 *
 * The entire structure is data-driven — edit the `center` / `up` / `down`
 * `IaNode` trees to change the IA.
 */
export function InfoArchitecture({
  center,
  up,
  down,
  accentColor,
  levelGap = 46,
  siblingGap = 18,
  className,
}: InfoArchitectureProps) {
  const containerRef = useRef<HTMLDivElement>(null)
  const nodeEls = useRef(new Map<string, HTMLDivElement>())
  const [rects, setRects] = useState<Record<string, Rect>>({})
  const [collapsed, setCollapsed] = useState<Set<string>>(new Set())
  const [hovered, setHovered] = useState<string | null>(null)
  const [drawn, setDrawn] = useState(false)
  const [animate, setAnimate] = useState(true)

  const items = useMemo(() => buildModel(center, up, down), [center, up, down])

  // Seed initial collapsed state from `collapsed: true` flags in the data.
  useEffect(() => {
    const seed = new Set<string>()
    items.forEach((it) => {
      if (it.node.collapsed) seed.add(it.id)
    })
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setCollapsed(seed)
  }, [items])

  const register = useCallback((id: string, el: HTMLDivElement | null) => {
    if (el) nodeEls.current.set(id, el)
    else nodeEls.current.delete(id)
  }, [])

  const edges = useMemo(() => {
    const out: { from: string; to: string; dir: Dir }[] = []
    items.forEach((it) => {
      if (it.parentId) out.push({ from: it.parentId, to: it.id, dir: it.dir })
    })
    return out
  }, [items])

  // A node is hidden when any ancestor is collapsed.
  const isHidden = useCallback(
    (id: string) => {
      let cur = items.get(id)?.parentId
      while (cur) {
        if (collapsed.has(cur)) return true
        cur = items.get(cur)?.parentId
      }
      return false
    },
    [items, collapsed]
  )

  const isConnected = useCallback(
    (id: string) =>
      hovered != null &&
      (hovered === id ||
        edges.some((e) => (e.from === id && e.to === hovered) || (e.to === id && e.from === hovered))),
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

  const collapsedKey = useMemo(() => [...collapsed].sort().join("|"), [collapsed])

  useLayoutEffect(() => {
    // Measuring laid-out DOM into state is the intended use here (positions for
    // the SVG connectors). Re-runs when the tree or collapse state changes.
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
  }, [measure, items, collapsedKey])

  // One-time draw-in once positions are known (respect reduced motion).
  useEffect(() => {
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches
    if (reduced) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setAnimate(false)
      setDrawn(true)
      return
    }
    const id = requestAnimationFrame(() => requestAnimationFrame(() => setDrawn(true)))
    return () => cancelAnimationFrame(id)
  }, [])

  const toggle = useCallback((id: string) => {
    setCollapsed((prev) => {
      const next = new Set(prev)
      if (next.has(id)) next.delete(id)
      else next.add(id)
      return next
    })
  }, [])

  const lineTransition = animate
    ? "stroke-dashoffset 0.7s cubic-bezier(0.22,1,0.36,1), stroke-opacity 0.25s ease"
    : "stroke-opacity 0.25s ease"

  const renderNode = (it: Item) => {
    const hasChildren = it.childIds.length > 0
    const isCollapsed = collapsed.has(it.id)
    const connected = isConnected(it.id)
    const dim = hovered != null && !connected
    const role =
      it.dir === "center" ? "center" : it.depth === 0 ? "group" : it.depth === 1 ? "section" : "node"

    return (
      <div
        ref={(el) => register(it.id, el)}
        role="button"
        tabIndex={0}
        aria-expanded={hasChildren ? !isCollapsed : undefined}
        onMouseEnter={() => setHovered(it.id)}
        onMouseLeave={() => setHovered(null)}
        onFocus={() => setHovered(it.id)}
        onBlur={() => setHovered(null)}
        onClick={hasChildren ? () => toggle(it.id) : undefined}
        onKeyDown={
          hasChildren
            ? (e) => {
                if (e.key === "Enter" || e.key === " ") {
                  e.preventDefault()
                  toggle(it.id)
                }
              }
            : undefined
        }
        className={cn(
          "relative whitespace-nowrap rounded-md text-center leading-tight outline-none transition-all duration-200",
          "focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-offset-background",
          hasChildren && "cursor-pointer",
          role === "center" && "px-3 py-1.5 text-[13px] font-semibold text-white shadow-[var(--shadow-md)]",
          role === "group" && "px-2 py-0.5 text-[13px] font-semibold",
          role === "section" && "px-2 py-0.5 text-[12.5px] font-semibold text-foreground hover:text-foreground",
          role === "node" && "px-2 py-0.5 text-[12px] text-muted-foreground hover:text-foreground",
          dim && "opacity-40"
        )}
        style={{
          ...(role === "center" ? { backgroundColor: ACCENT } : null),
          ...(role === "group" ? { color: ACCENT } : null),
          ...({ "--tw-ring-color": ACCENT } as CSSProperties),
        }}
      >
        <span>{it.node.label}</span>
        {it.node.note && (
          <span className="mt-0.5 block text-[10px] font-normal text-muted-foreground/80">
            {it.node.note}
          </span>
        )}
        {hasChildren && isCollapsed && (
          <span
            className="ml-1 inline-block rounded-full px-1.5 text-[9px] font-semibold align-middle"
            style={{
              color: ACCENT,
              backgroundColor: `color-mix(in oklab, ${ACCENT} 16%, transparent)`,
            }}
          >
            +{it.childIds.length}
          </span>
        )}
      </div>
    )
  }

  const renderBranch = (id: string): ReactNode => {
    const it = items.get(id)
    if (!it) return null
    const isCollapsed = collapsed.has(id)
    const kids =
      !isCollapsed && it.childIds.length > 0 ? (
        <div
          className="flex"
          style={{ gap: siblingGap, alignItems: it.dir === "up" ? "flex-end" : "flex-start" }}
        >
          {it.childIds.map((cid) => renderBranch(cid))}
        </div>
      ) : null
    const node = renderNode(it)

    return (
      <div key={id} className="flex flex-col items-center" style={{ gap: levelGap }}>
        {it.dir === "up" ? (
          <>
            {kids}
            {node}
          </>
        ) : (
          <>
            {node}
            {kids}
          </>
        )}
      </div>
    )
  }

  const paths = edges
    .map((e, i) => {
      if (isHidden(e.to)) return null
      const pf = rects[e.from]
      const pt = rects[e.to]
      if (!pf || !pt) return null
      const goesDown = e.dir !== "up"
      const sx = pf.cx
      const sy = goesDown ? pf.bottom : pf.top
      const ex = pt.cx
      const ey = goesDown ? pt.top : pt.bottom
      const midY = (sy + ey) / 2
      const d = `M ${sx} ${sy} L ${sx} ${midY} L ${ex} ${midY} L ${ex} ${ey}`
      const active = hovered != null && (e.from === hovered || e.to === hovered)
      const op = hovered != null && !active ? 0.12 : active ? 1 : 0.5
      return { key: i, d, op, active, ex, ey }
    })
    .filter((p): p is NonNullable<typeof p> => p !== null)

  return (
    <div
      ref={containerRef}
      className={cn("relative", className)}
      style={accentColor ? ({ "--ia-accent": accentColor } as CSSProperties) : undefined}
    >
      {/* Connector overlay — measured from live node positions */}
      <svg className="pointer-events-none absolute inset-0 h-full w-full" aria-hidden>
        <defs>
          <filter id="ia-glow" x="-20%" y="-20%" width="140%" height="140%">
            <feGaussianBlur stdDeviation="2.4" />
          </filter>
        </defs>

        {/* soft glow underlay */}
        <g filter="url(#ia-glow)">
          {paths.map((p) => (
            <path
              key={`g-${p.key}`}
              d={p.d}
              fill="none"
              stroke={ACCENT}
              strokeWidth={p.active ? 2.5 : 1.75}
              strokeLinejoin="round"
              strokeLinecap="round"
              strokeOpacity={p.op * 0.4}
              pathLength={1}
              strokeDasharray={1}
              strokeDashoffset={drawn ? 0 : 1}
              style={{ transition: lineTransition }}
            />
          ))}
        </g>

        {/* crisp elbow lines */}
        {paths.map((p) => (
          <path
            key={`c-${p.key}`}
            d={p.d}
            fill="none"
            stroke={ACCENT}
            strokeWidth={p.active ? 1.5 : 1}
            strokeLinejoin="round"
            strokeLinecap="round"
            strokeOpacity={p.op}
            pathLength={1}
            strokeDasharray={1}
            strokeDashoffset={drawn ? 0 : 1}
            style={{ transition: lineTransition }}
          />
        ))}

        {/* endpoint dots where an edge lands on a node */}
        {paths.map((p) => (
          <circle
            key={`d-${p.key}`}
            cx={p.ex}
            cy={p.ey}
            r={2}
            fill={ACCENT}
            opacity={drawn ? p.op : 0}
            style={{ transition: "opacity 0.4s ease" }}
          />
        ))}
      </svg>

      {/* Nodes — up tree, center, down tree, stacked and centered */}
      <div className="relative z-10 flex flex-col items-center" style={{ gap: levelGap }}>
        {up && renderBranch("u")}
        {renderBranch("c")}
        {down && renderBranch("d")}
      </div>
    </div>
  )
}
