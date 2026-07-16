"use client"

import { motion } from "framer-motion"
import clsx from "clsx"
import { EASE, DURATION } from "@/lib/motion"

export interface CsReflectionProps {
  /** What actually changed in how you think. The honest part. */
  learned: string
  /** What you'd do differently with hindsight. */
  next?: string
  /** What still needs proving — the open question. */
  validate?: string
  className?: string
}

/**
 * The closing reflection — the maturity signal.
 *
 * Design leaders and admissions readers look for whether someone can name what
 * they'd change. Kept as three plain labelled passages rather than cards: this
 * is the one place in a case study where the writing should carry it, and a
 * grid of tiles would make honesty look like a template.
 */
export function CsReflection({ learned, next, validate, className }: CsReflectionProps) {
  const rows = [
    { label: "What it changed in how I work", value: learned },
    ...(next ? [{ label: "What I'd do differently", value: next }] : []),
    ...(validate ? [{ label: "What still needs proving", value: validate }] : []),
  ]

  return (
    <div className={clsx("relative", className)}>
      <span
        aria-hidden
        className="absolute left-0 top-0 h-full w-px bg-gradient-to-b from-accent/40 via-border to-transparent"
      />

      <div className="space-y-8 pl-6 md:pl-8">
        {rows.map((r, i) => (
          <motion.div
            key={r.label}
            initial={{ opacity: 0, y: 14 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-60px" }}
            transition={{ duration: DURATION.base, delay: i * 0.07, ease: EASE }}
          >
            <p className="mb-2.5 font-mono text-[10px] font-semibold uppercase tracking-[0.16em] text-accent/85">
              {r.label}
            </p>
            <p className="max-w-[64ch] text-[15px] leading-[1.75] text-foreground/75">
              {r.value}
            </p>
          </motion.div>
        ))}
      </div>
    </div>
  )
}
