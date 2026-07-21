"use client"

import { motion } from "framer-motion"
import clsx from "clsx"
import { EASE, DURATION } from "@/lib/motion"

export interface CsSummaryProps {
  /** What was broken / what was changing. One or two sentences. */
  problem: string
  /** What *you* personally owned. Use direct verbs: Led, Defined, Prototyped. */
  role: string
  /** What changed after the work shipped. Honest — qualitative is fine. */
  outcome: string
  /** Optional label, e.g. "Executive summary" or "The short version". */
  label?: string
  className?: string
}

const ROWS = [
  { key: "problem", label: "The problem" },
  { key: "role", label: "My role" },
  { key: "outcome", label: "The outcome" },
] as const

/**
 * Executive summary — the 30-second read.
 *
 * Sits directly under the hero so a recruiter who never scrolls further still
 * leaves knowing the problem, what this person actually did, and what changed.
 * Complements the hero's meta cards: those carry *facts* (role, scope, team),
 * this carries the *story* in three lines.
 */
export function CsSummary({
  problem,
  role,
  outcome,
  label = "The short version",
  className,
}: CsSummaryProps) {
  const values = { problem, role, outcome }

  return (
    <motion.aside
      initial={{ opacity: 0, y: 16 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-60px" }}
      transition={{ duration: DURATION.base, ease: EASE }}
      aria-label="Executive summary"
      className={clsx(
        "relative overflow-hidden rounded-2xl border border-border/70 bg-foreground/[0.02] dark:bg-white/[0.025]",
        className
      )}
    >
      {/* One accent edge marks this as the orientation block, not body copy. */}
      <span aria-hidden className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-accent/50 via-accent/20 to-transparent" />

      <div className="px-6 py-5 md:px-7 md:py-6">
        <p className="mb-5 font-mono text-[10px] font-semibold uppercase tracking-[0.16em] text-muted-foreground">
          {label}
        </p>

        <dl className="grid gap-5 sm:grid-cols-3 sm:gap-6">
          {ROWS.map(({ key, label: rowLabel }) => (
            <div key={key} className="min-w-0">
              <dt className="mb-1.5 text-[11px] font-semibold uppercase tracking-[0.1em] text-accent/85">
                {rowLabel}
              </dt>
              <dd className="text-[13.5px] leading-relaxed text-foreground/75">
                {values[key]}
              </dd>
            </div>
          ))}
        </dl>
      </div>
    </motion.aside>
  )
}
