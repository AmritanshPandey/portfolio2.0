"use client"

import { useRef, useState } from "react"
import {
  motion,
  useAnimationFrame,
  useMotionTemplate,
  useMotionValue,
  useReducedMotion,
} from "framer-motion"
import type { ReactNode } from "react"

import { cn } from "@/lib/utils"
import { ConstellationNetwork } from "@/components/ui/backgrounds"
import { ScreenCard, type ScreenCrop } from "@/components/case-study/screen-card"

/**
 * A wall of frameless app screens arranged in straight columns that drift
 * slowly upward and loop forever — a calm, ambient "screens marquee" on a
 * full-bleed backdrop. Built on <ScreenCard>.
 *
 * `items` are dealt round-robin into columns; each column's strip is duplicated
 * so the upward scroll is seamless, and each column moves at a slightly
 * different pace. Hovering a column pauses just that column. Honours
 * reduced-motion (columns hold still).
 *
 * Drop a colour into `className` (e.g. "bg-muted") as a placeholder now, then
 * swap it for a `src` later — nothing else changes.
 */

export interface ScreenWallItem {
  src?: string
  alt?: string
  children?: ReactNode
  /** Screen aspect as "w/h". Default the iPhone 17 screen. */
  aspect?: string
  crop?: ScreenCrop
  reveal?: number
  /** Extra classes on the card (e.g. a bg-colour placeholder). */
  className?: string
}

export interface CsScreenWallProps {
  items: ScreenWallItem[]
  /** Ambient layer behind the wall. Default <ConstellationNetwork />; `false` for plain. */
  background?: ReactNode | false
  /** Break out to full viewport width (relies on `overflow-x-clip` on <main>). */
  bleed?: boolean
  /** Seconds for the base column to travel a full loop. Higher = slower. Default 72. */
  speed?: number
  className?: string
}

/** Max columns rendered; the last few are hidden on smaller screens. */
const COLUMN_COUNT = 5
/** Show 2 cols on mobile → 3 (sm) → 4 (lg) → 5 (xl). Hidden cols drop their
 *  items, which is fine for an ambient decorative wall. */
const COL_VISIBILITY = ["flex", "flex", "hidden sm:flex", "hidden lg:flex", "hidden xl:flex"]
/** Per-column loop-time multipliers — widely spread so each column moves at a
 *  visibly different pace (higher = slower). */
const COL_SPEED = [1, 1.55, 0.72, 1.85, 1.2]

const FADE_MASK =
  "linear-gradient(to bottom, transparent 0%, #000 9%, #000 91%, transparent 100%)"

/** One upward-scrolling column. Drives its own transform per frame so it can be
 *  paused on hover without restarting the loop. */
function MarqueeColumn({
  items,
  duration,
  className,
}: {
  items: ScreenWallItem[]
  duration: number
  className?: string
}) {
  const reduced = useReducedMotion()
  const [paused, setPaused] = useState(false)
  // Position in percent of the (doubled) strip. Wraps in [-50, 0] → seamless.
  const offset = useMotionValue(0)
  const transform = useMotionTemplate`translateY(${offset}%)`

  // Percent of the strip travelled per second (a full loop = -50%).
  const ratePerSecond = useRef(50 / duration)
  ratePerSecond.current = 50 / duration

  useAnimationFrame((_, delta) => {
    if (reduced || paused) return
    let next = offset.get() - ratePerSecond.current * (delta / 1000)
    if (next <= -50) next += 50
    offset.set(next)
  })

  // Duplicate so translateY(-50%) lands exactly on a repeat.
  const loop = [...items, ...items]

  return (
    <div
      className={cn("min-w-0 flex-1 flex-col", className)}
      onPointerEnter={() => setPaused(true)}
      onPointerLeave={() => setPaused(false)}
    >
      <motion.div className="will-change-transform" style={{ transform }}>
        {loop.map((item, j) => (
          <div key={j} className="mb-4 md:mb-6">
            <ScreenCard
              hover
              shadow={false}
              src={item.src}
              alt={item.alt}
              aspect={item.aspect}
              crop={item.crop}
              reveal={item.reveal}
              className={item.className}
            >
              {item.children}
            </ScreenCard>
          </div>
        ))}
      </motion.div>
    </div>
  )
}

export function CsScreenWall({
  items,
  background = <ConstellationNetwork />,
  bleed = true,
  speed = 72,
  className,
}: CsScreenWallProps) {
  // Deal items round-robin into columns.
  const columns: ScreenWallItem[][] = Array.from({ length: COLUMN_COUNT }, () => [])
  items.forEach((item, i) => columns[i % COLUMN_COUNT].push(item))

  const inner = (
    <div
      className={cn(
        "relative isolate h-[600px] overflow-hidden bg-background md:h-[740px]",
        className
      )}
    >
      {/* Ambient backdrop — behind everything, never eats pointer events */}
      {background !== false && (
        <div className="pointer-events-none absolute inset-0 z-0">{background}</div>
      )}

      {/* The columns — faded into the backdrop at top + bottom via a mask */}
      <div
        className="relative z-10 mx-auto flex h-full max-w-7xl gap-4 px-4 md:gap-6 md:px-6"
        style={{ maskImage: FADE_MASK, WebkitMaskImage: FADE_MASK }}
      >
        {columns.map((colItems, c) =>
          colItems.length === 0 ? null : (
            <MarqueeColumn
              key={c}
              items={colItems}
              duration={speed * COL_SPEED[c]}
              className={COL_VISIBILITY[c]}
            />
          )
        )}
      </div>
    </div>
  )

  if (!bleed) return inner

  return <div className="relative left-1/2 w-screen -translate-x-1/2">{inner}</div>
}
