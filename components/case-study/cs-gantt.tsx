"use client"

import { motion } from "framer-motion"
import type { ReactNode } from "react"

import { cn } from "@/lib/utils"
import { EASE } from "@/lib/motion"

/**
 * A project-timeline / Gantt chart for case studies — a date axis with a NOW
 * marker, task bars laid out in lanes, and an optional caption. Bars can be
 * "active" (accent gradient + glow) or neutral.
 *
 * Dates are ISO strings ("2026-02-02"), parsed as UTC so positions are
 * deterministic (no Date.now → SSR-safe). Tokens only, theme-aware, and the
 * chart scrolls horizontally on narrow screens.
 */

export type GanttStatus = "default" | "active"

export interface GanttTask {
  label: string
  /** ISO date "YYYY-MM-DD". */
  start: string
  end: string
  /** Which row this bar sits in. Tasks sharing a lane stack on one row. */
  lane?: number
  status?: GanttStatus
}

export interface CsGanttProps {
  tasks: GanttTask[]
  /** Axis bounds (ISO). Default: min/max of the tasks. */
  start?: string
  end?: string
  /** NOW marker (ISO). Omit to hide it. */
  now?: string
  /** Days between axis ticks. Default 14. */
  tickStepDays?: number
  /** Large supporting line under the chart. */
  caption?: ReactNode
  className?: string
}

const MONTHS = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"]
const DAY = 86_400_000
const ROW_H = 52
const BAR_H = 40

const ms = (iso: string) => Date.parse(`${iso}T00:00:00Z`)
const fmt = (t: number) => {
  const d = new Date(t)
  return `${MONTHS[d.getUTCMonth()]} ${String(d.getUTCDate()).padStart(2, "0")}`
}

export function CsGantt({
  tasks,
  start,
  end,
  now,
  tickStepDays = 14,
  caption,
  className,
}: CsGanttProps) {
  const starts = tasks.map((t) => ms(t.start))
  const ends = tasks.map((t) => ms(t.end))
  const min = start ? ms(start) : Math.min(...starts)
  const max = end ? ms(end) : Math.max(...ends)
  const range = Math.max(1, max - min)

  const pct = (t: number) => ((t - min) / range) * 100

  // Lanes → rows. Tasks without an explicit lane each get their own.
  const laneOf = tasks.map((t, i) => t.lane ?? 1000 + i)
  const lanes = Array.from(new Set(laneOf)).sort((a, b) => a - b)
  const rowOf = (i: number) => lanes.indexOf(laneOf[i])
  const bodyH = lanes.length * ROW_H

  // Axis ticks, stepping by tickStepDays from the start.
  const ticks: number[] = []
  for (let t = min; t <= max + DAY; t += tickStepDays * DAY) ticks.push(Math.min(t, max))

  const nowMs = now ? ms(now) : null
  const nowPct = nowMs !== null ? pct(nowMs) : null

  return (
    <div className={className}>
      <div className="overflow-x-auto rounded-2xl border border-border/50 bg-gradient-to-b from-muted/30 to-transparent p-5 md:p-6 [scrollbar-width:thin]">
        <div className="relative min-w-[760px]">
          {/* Axis */}
          <div className="relative mb-3 h-5">
            {ticks.map((t, i) => (
              <span
                key={i}
                className="absolute -translate-x-1/2 whitespace-nowrap text-[11px] font-medium tabular-nums text-muted-foreground/70"
                style={{ left: `${pct(t)}%` }}
              >
                {fmt(t)}
              </span>
            ))}

            {nowPct !== null && (
              <span
                className="absolute top-0 z-20 -translate-x-1/2 rounded-full bg-accent px-2 py-0.5 text-[10px] font-bold uppercase tracking-wide text-accent-foreground shadow-[0_4px_12px_-2px_var(--accent)]"
                style={{ left: `${nowPct}%` }}
              >
                Now
              </span>
            )}
          </div>

          {/* Chart body */}
          <div className="relative" style={{ height: bodyH }}>
            {/* Gridlines */}
            {ticks.map((t, i) => (
              <span
                key={i}
                aria-hidden
                className="absolute inset-y-0 w-px bg-border/40"
                style={{ left: `${pct(t)}%` }}
              />
            ))}

            {/* NOW line */}
            {nowPct !== null && (
              <span
                aria-hidden
                className="absolute inset-y-0 z-10 w-px bg-accent/70 shadow-[0_0_10px_0_var(--accent)]"
                style={{ left: `${nowPct}%` }}
              />
            )}

            {/* Bars */}
            {tasks.map((task, i) => {
              const left = pct(ms(task.start))
              const width = pct(ms(task.end)) - left
              const top = rowOf(i) * ROW_H + (ROW_H - BAR_H) / 2
              const active = task.status === "active"

              return (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, x: -8 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true, margin: "-60px" }}
                  transition={{ duration: 0.45, delay: i * 0.07, ease: EASE }}
                  className={cn(
                    "group absolute z-[5] flex items-center overflow-hidden rounded-lg px-4",
                    "ring-1 transition-shadow duration-300",
                    active
                      ? "bg-gradient-to-r from-accent/70 to-accent text-accent-foreground ring-accent/40 shadow-[0_8px_28px_-8px_var(--accent)]"
                      : "bg-muted/70 text-foreground ring-border/60 backdrop-blur-sm"
                  )}
                  style={{ left: `${left}%`, width: `${width}%`, top, height: BAR_H }}
                >
                  <span className="truncate text-[13px] font-medium">{task.label}</span>
                  {active && (
                    <span
                      aria-hidden
                      className="pointer-events-none absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent opacity-0 transition-opacity duration-500 group-hover:opacity-100"
                    />
                  )}
                </motion.div>
              )
            })}
          </div>
        </div>
      </div>

      {caption && (
        <motion.p
          initial={{ opacity: 0, y: 12 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-60px" }}
          transition={{ duration: 0.5, ease: EASE }}
          className="mt-8 max-w-2xl text-[clamp(22px,2.4vw,32px)] font-medium leading-[1.2] tracking-tight text-foreground/90"
        >
          {caption}
        </motion.p>
      )}
    </div>
  )
}
