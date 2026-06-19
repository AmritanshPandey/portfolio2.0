import {
  createElement,
  type ElementType,
  type ReactNode,
} from "react"

/* ─────────────────────────────────────────────────────────────────────────
   Reveal — scroll-entry rise for blocks.

   Content renders immediately. These props are kept for call-site
   compatibility after removing the old JS animation runtime.
───────────────────────────────────────────────────────────────────────── */

interface RevealProps {
  children: ReactNode
  className?: string
  as?: ElementType
  /** Vertical travel in px. */
  y?: number
  delay?: number
  duration?: number
  /** Stagger (s) between direct children. 0 = animate the wrapper whole. */
  stagger?: number
  /** Kept for call-site compatibility. */
  start?: string
  /** Anything else (aria-*, role, id, …) is forwarded to the rendered element. */
  [key: string]: unknown
}

export function Reveal({
  children,
  className,
  as = "div",
  y = 26,
  delay = 0,
  duration = 0.9,
  stagger = 0,
  start = "top 86%",
  ...rest
}: RevealProps) {
  void y
  void delay
  void duration
  void stagger
  void start

  return createElement(as, { className, ...rest }, children)
}

/* ─────────────────────────────────────────────────────────────────────────
   TextReveal — static heading renderer kept for call-site compatibility.
───────────────────────────────────────────────────────────────────────── */

interface TextRevealProps {
  children: ReactNode
  className?: string
  as?: ElementType
  delay?: number
  start?: string
  /** Per-line stagger in seconds. */
  stagger?: number
  /** Anything else (aria-*, role, id, …) is forwarded to the rendered element. */
  [key: string]: unknown
}

export function TextReveal({
  children,
  className,
  as = "h2",
  delay = 0,
  start = "top 88%",
  stagger = 0.09,
  ...rest
}: TextRevealProps) {
  void delay
  void start
  void stagger

  return createElement(as, { className, ...rest }, children)
}

/* ─────────────────────────────────────────────────────────────────────────
   Grain — one quiet film-grain wash over the whole canvas.

   A static SVG turbulence tile: no animation, no blend mode, near-free to
   composite, identical in Safari. It keeps large dark surfaces from
   reading as flat digital black.
───────────────────────────────────────────────────────────────────────── */

const GRAIN_URI =
  "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='160' height='160'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='2' stitchTiles='stitch'/%3E%3CfeColorMatrix type='saturate' values='0'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E"

export function Grain() {
  return (
    <div
      aria-hidden
      className="pointer-events-none fixed inset-0 z-[70] opacity-[0.035] dark:opacity-[0.05]"
      style={{ backgroundImage: `url("${GRAIN_URI}")`, backgroundSize: "160px 160px" }}
    />
  )
}
