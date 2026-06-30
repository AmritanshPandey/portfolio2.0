"use client"

import { useCallback, useId, useLayoutEffect, useMemo, useRef, useState } from "react"
import {
  AnimatePresence,
  motion,
  useAnimationFrame,
  useReducedMotion,
} from "framer-motion"

import { cn } from "@/lib/utils"
import { EASE, DURATION } from "@/lib/motion"
import {
  buildDefaultPath,
  clientToSvg,
  getPoint,
  handleKey,
  moveAnchor,
  setPoint,
  toPathD,
  type Cubic,
  type HandleId,
  type PathState,
} from "./bezier"

const VIEW_W = 1048
const VIEW_H = 594

/** The seed curve — split into sub-segments so there are extra handles. */
const ORIGINAL_SEGMENTS: Cubic[] = [
  {
    p0: { x: 0.597656, y: 50.924805 },
    p1: { x: 17.4612, y: 143.2965 },
    p2: { x: 97.8522, y: 293.141 },
    p3: { x: 284.508, y: 353.548 },
  },
  {
    p0: { x: 284.508, y: 353.548 },
    p1: { x: 440.828, y: 399.056 },
    p2: { x: 583.839, y: 294.067 },
    p3: { x: 500.618, y: 184.7492 },
  },
  {
    p0: { x: 500.618, y: 184.7492 },
    p1: { x: 417.397, y: 75.4309 },
    p2: { x: 238.217, y: 282.098 },
    p3: { x: 499.258, y: 441.668 },
  },
  {
    p0: { x: 499.258, y: 441.668 },
    p1: { x: 551.913, y: 477.802 },
    p2: { x: 817.468, y: 561.26 },
    p3: { x: 1046.43, y: 565.235 },
  },
]

const SPLITS_PER_SEGMENT = 2
const DEFAULT_PATH = buildDefaultPath(ORIGINAL_SEGMENTS, SPLITS_PER_SEGMENT)

const DEFAULT_TEXT =
  "Product thinking, end to end — discovery, systems, interface, and the craft in between."

/** Gap appended to each repetition so the loop has breathing room. */
const GAP = "  ·  "

export interface CurvedMarqueeProps {
  /** The text that flows along the curve. */
  text?: string
  /**
   * "line" — text on a hairline curve (default).
   * "ribbon" — text on a filled band that follows the curve.
   */
  variant?: "line" | "ribbon"
  /** Fill of the ribbon band (variant="ribbon"). */
  ribbonColor?: string
  /**
   * Split the path into two strands so that where it crosses itself one passes
   * cleanly under the other (a background "casing" cuts the gap). Defaults on —
   * set false for a single continuous marquee on a non-crossing path.
   */
  weave?: boolean
  /** Background colour the casing paints with — should match the surface behind. */
  casingColor?: string
  /** Show the edit toggle + drag handles. Off = pure decoration. */
  editable?: boolean
  /** Scroll speed in SVG units per second. */
  speed?: number
  fontSize?: number
  /** Opacity of the flowing text — line variant only (0–1). */
  textOpacity?: number
  className?: string
  defaultPath?: PathState
}

export function CurvedMarquee({
  text = DEFAULT_TEXT,
  variant = "line",
  ribbonColor = "var(--accent)",
  weave = true,
  casingColor = "var(--background)",
  editable = true,
  speed = 60,
  fontSize = 15,
  textOpacity = 0.5,
  className,
  defaultPath = DEFAULT_PATH,
}: CurvedMarqueeProps) {
  const isRibbon = variant === "ribbon"
  const strokeWidth = isRibbon ? fontSize * 1.7 : 1
  // Casing must be wide enough to hide the under-strand's text at the crossing.
  const casingWidth = (isRibbon ? strokeWidth : fontSize) + 8

  const uid = useId().replace(/[:]/g, "")
  const idA = `cm-a-${uid}`
  const idB = `cm-b-${uid}`

  const svgRef = useRef<SVGSVGElement>(null)
  const pathRefA = useRef<SVGPathElement>(null)
  const pathRefB = useRef<SVGPathElement>(null)
  const tpRefA = useRef<SVGTextPathElement>(null)
  const tpRefB = useRef<SVGTextPathElement>(null)
  const measureRef = useRef<SVGTextElement>(null)
  const draggingRef = useRef<HandleId | null>(null)
  const offsetA = useRef(0)
  const offsetB = useRef(0)

  const [editing, setEditing] = useState(false)
  const [path, setPath] = useState<PathState>(defaultPath)
  const [unit, setUnit] = useState(0)
  const [copiesA, setCopiesA] = useState(6)
  const [copiesB, setCopiesB] = useState(6)

  const reduceMotion = useReducedMotion()

  const fullD = useMemo(() => toPathD(path), [path])

  // Split the path into an "under" strand and an "over" strand. The over strand
  // is drawn last (with a casing beneath it) so it passes over at the crossing.
  const { dA, dB } = useMemo(() => {
    if (!weave || path.segments.length < 2) return { dA: fullD, dB: null as string | null }
    const k = Math.max(1, Math.round(path.segments.length / 2))
    const under: PathState = { start: path.start, segments: path.segments.slice(0, k) }
    const over: PathState = {
      start: path.segments[k - 1].end,
      segments: path.segments.slice(k),
    }
    return { dA: toPathD(under), dB: toPathD(over) }
  }, [weave, path, fullD])

  const unitText = useMemo(() => text + GAP, [text])
  const repeatedA = useMemo(
    () => Array.from({ length: copiesA }, () => unitText).join(""),
    [unitText, copiesA]
  )
  const repeatedB = useMemo(
    () => Array.from({ length: copiesB }, () => unitText).join(""),
    [unitText, copiesB]
  )

  const anchors = useMemo<HandleId[]>(
    () => [
      { type: "start" },
      ...path.segments.map((_, i) => ({ type: "end", seg: i }) as HandleId),
    ],
    [path.segments]
  )

  const controlPoints = useMemo<HandleId[]>(
    () =>
      path.segments.flatMap(
        (_, i) =>
          [
            { type: "c1", seg: i },
            { type: "c2", seg: i },
          ] as HandleId[]
      ),
    [path.segments]
  )

  const guides = useMemo(
    () =>
      path.segments.flatMap((s, i) => {
        const prevAnchor = i === 0 ? path.start : path.segments[i - 1].end
        return [
          { a: prevAnchor, b: s.c1 },
          { a: s.end, b: s.c2 },
        ]
      }),
    [path]
  )

  // Measure one repetition's advance width, then size each strand's copy count
  // to cover its own length so the marquee tiles seamlessly.
  useLayoutEffect(() => {
    const m = measureRef.current
    if (!m) return
    const u = m.getComputedTextLength()
    if (!u) return
    setUnit(u)
    const lenA = pathRefA.current?.getTotalLength() ?? VIEW_W
    setCopiesA(Math.max(2, Math.ceil(lenA / u) + 2))
    const lenB = pathRefB.current?.getTotalLength() ?? 0
    setCopiesB(Math.max(2, Math.ceil(lenB / u) + 2))
  }, [unitText, fontSize, dA, dB])

  // Scroll each strand by advancing its startOffset, wrapping by one period
  // (unit) so it loops without a jump. Skipped under reduced motion.
  useAnimationFrame((_, delta) => {
    if (reduceMotion || unit === 0) return
    const step = (speed * delta) / 1000
    if (tpRefA.current) {
      offsetA.current -= step
      if (offsetA.current <= -unit) offsetA.current += unit
      tpRefA.current.setAttribute("startOffset", String(offsetA.current))
    }
    if (tpRefB.current) {
      offsetB.current -= step
      if (offsetB.current <= -unit) offsetB.current += unit
      tpRefB.current.setAttribute("startOffset", String(offsetB.current))
    }
  })

  const handlePointerDown = useCallback(
    (e: React.PointerEvent<SVGCircleElement>, id: HandleId) => {
      e.preventDefault()
      e.stopPropagation()
      e.currentTarget.setPointerCapture(e.pointerId)
      draggingRef.current = id
    },
    []
  )

  const handlePointerMove = useCallback((e: React.PointerEvent<SVGCircleElement>) => {
    const id = draggingRef.current
    if (!id || !svgRef.current) return
    const p = clientToSvg(svgRef.current, e.clientX, e.clientY, VIEW_W, VIEW_H)
    setPath((prev) =>
      id.type === "c1" || id.type === "c2"
        ? setPoint(prev, id, p)
        : moveAnchor(prev, id, p)
    )
  }, [])

  const handlePointerUp = useCallback((e: React.PointerEvent<SVGCircleElement>) => {
    draggingRef.current = null
    try {
      e.currentTarget.releasePointerCapture(e.pointerId)
    } catch {}
  }, [])

  const ribbonStroke = isRibbon ? ribbonColor : "var(--border)"
  const textClass = isRibbon ? "font-medium" : "font-normal [baseline-shift:-20%]"
  const textStyle = {
    fill: isRibbon ? "var(--background)" : "var(--foreground)",
    opacity: isRibbon ? 1 : textOpacity,
  }

  return (
    <div className={cn("relative w-full", className)}>
      <svg
        ref={svgRef}
        className="block h-full w-full"
        viewBox={`0 0 ${VIEW_W} ${VIEW_H}`}
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        style={{ touchAction: editing ? "none" : "auto" }}
      >
        {/* Hidden specimen used only to measure one repetition's length. */}
        <text
          ref={measureRef}
          x={0}
          y={-100}
          aria-hidden
          style={{ fontSize, fontFamily: "inherit", visibility: "hidden" }}
        >
          {unitText}
        </text>

        {/* Strand A — drawn first, so it passes UNDER at the crossing. */}
        <path
          id={idA}
          ref={pathRefA}
          fill="none"
          stroke={ribbonStroke}
          strokeWidth={strokeWidth}
          strokeLinecap={isRibbon ? "round" : "butt"}
          strokeLinejoin="round"
          d={dA}
        />
        <text aria-hidden dominantBaseline={isRibbon ? "central" : undefined} style={{ fontSize, fontFamily: "inherit" }}>
          <textPath ref={tpRefA} href={`#${idA}`} startOffset={0} className={textClass} style={textStyle}>
            {repeatedA}
          </textPath>
        </text>

        {/* Strand B — a casing cuts the gap, then the band + text ride OVER. */}
        {dB && (
          <>
            <path
              fill="none"
              stroke={casingColor}
              strokeWidth={casingWidth}
              strokeLinecap="round"
              strokeLinejoin="round"
              d={dB}
            />
            <path
              id={idB}
              ref={pathRefB}
              fill="none"
              stroke={ribbonStroke}
              strokeWidth={strokeWidth}
              strokeLinecap={isRibbon ? "round" : "butt"}
              strokeLinejoin="round"
              d={dB}
            />
            <text aria-hidden dominantBaseline={isRibbon ? "central" : undefined} style={{ fontSize, fontFamily: "inherit" }}>
              <textPath ref={tpRefB} href={`#${idB}`} startOffset={0} className={textClass} style={textStyle}>
                {repeatedB}
              </textPath>
            </text>
          </>
        )}

        {editable && editing && (
          <g>
            <path
              d={fullD}
              fill="none"
              stroke="var(--accent)"
              strokeWidth={1.5}
              strokeDasharray="3 5"
              strokeOpacity={0.7}
              style={{ pointerEvents: "none" }}
            />

            {guides.map((g, i) => (
              <line
                key={`guide-${i}`}
                x1={g.a.x}
                y1={g.a.y}
                x2={g.b.x}
                y2={g.b.y}
                stroke="var(--accent)"
                strokeWidth={1}
                strokeDasharray="3 4"
                strokeOpacity={0.5}
                style={{ pointerEvents: "none" }}
              />
            ))}

            {/* Off-line control points: hollow emerald dots. */}
            {controlPoints.map((id) => {
              const p = getPoint(path, id)
              return (
                <circle
                  key={handleKey(id)}
                  cx={p.x}
                  cy={p.y}
                  r={3}
                  fill="var(--card)"
                  stroke="var(--accent)"
                  strokeWidth={1.5}
                  aria-label={`Control point ${handleKey(id)}`}
                  style={{ cursor: "grab", touchAction: "none" }}
                  onPointerDown={(e) => handlePointerDown(e, id)}
                  onPointerMove={handlePointerMove}
                  onPointerUp={handlePointerUp}
                />
              )
            })}

            {/* On-line anchors: solid emerald dots. */}
            {anchors.map((id) => {
              const p = getPoint(path, id)
              return (
                <circle
                  key={handleKey(id)}
                  cx={p.x}
                  cy={p.y}
                  r={3.5}
                  fill="var(--accent)"
                  stroke="var(--background)"
                  strokeWidth={1}
                  aria-label={`Anchor ${handleKey(id)}`}
                  style={{ cursor: "grab", touchAction: "none" }}
                  onPointerDown={(e) => handlePointerDown(e, id)}
                  onPointerMove={handlePointerMove}
                  onPointerUp={handlePointerUp}
                />
              )
            })}
          </g>
        )}
      </svg>

      {editable && (
        <AnimatePresence mode="popLayout" initial={false}>
          {editing ? (
            <motion.button
              key="done"
              layoutId={`cm-toggle-${uid}`}
              type="button"
              onClick={() => setEditing(false)}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ layout: { duration: DURATION.fast, ease: EASE } }}
              className="absolute inset-x-0 top-4 mx-auto w-fit rounded-full bg-accent px-5 py-2 text-sm font-medium text-white shadow-sm ring-1 ring-accent/20 transition-colors hover:brightness-110"
            >
              <motion.span
                layoutId={`cm-toggle-text-${uid}`}
                initial={{ opacity: 0, filter: "blur(4px)" }}
                animate={{ opacity: 1, filter: "blur(0px)" }}
                transition={{ duration: DURATION.fast, ease: EASE }}
              >
                Done editing
              </motion.span>
            </motion.button>
          ) : (
            <motion.button
              key="edit"
              layoutId={`cm-toggle-${uid}`}
              type="button"
              onClick={() => setEditing(true)}
              initial={{ opacity: 0, filter: "blur(4px)" }}
              animate={{ opacity: 1, filter: "blur(0px)" }}
              exit={{ opacity: 0 }}
              transition={{ layout: { duration: DURATION.fast, ease: EASE } }}
              className="absolute inset-x-0 top-4 mx-auto w-fit rounded-full bg-card px-5 py-2 text-sm font-medium text-foreground shadow-sm ring-1 ring-border transition-colors hover:bg-muted"
            >
              <motion.span
                layoutId={`cm-toggle-text-${uid}`}
                initial={{ opacity: 0, filter: "blur(10px)" }}
                animate={{ opacity: 1, filter: "blur(0px)" }}
                transition={{ duration: DURATION.base, ease: EASE }}
              >
                Edit path
              </motion.span>
            </motion.button>
          )}
        </AnimatePresence>
      )}
    </div>
  )
}

export default CurvedMarquee
