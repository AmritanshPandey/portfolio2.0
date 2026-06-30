"use client"

import { motion } from "framer-motion"
import clsx from "clsx"
import { IconArrowRight } from "@tabler/icons-react"

export interface CsResultStat {
  /** The headline figure, e.g. "121%", "3x", "200+". */
  value: string
  /** Short label sitting beside the figure. */
  label: string
  /** Supporting sentence under the rule. */
  text: string
  /** Tint the card with the brand accent (mint) instead of the plain surface. */
  highlight?: boolean
}

export interface CsResultsProps {
  /** Small uppercase label above the heading. */
  eyebrow?: string
  /** Narrative headline — can carry the result + the "how" in one statement. */
  heading: string
  /** Optional call-to-action pill, pinned top-right beside the heading. */
  cta?: { label: string; href?: string }
  /** Stat cards — rendered in a row (stacks on mobile). */
  stats: CsResultStat[]
  className?: string
}

/**
 * A results / proof block for case studies: an eyebrow + narrative heading with
 * an optional CTA pinned top-right, above a row of stat cards (figure · label ·
 * supporting line). Highlighted cards pick up a soft accent tint.
 */
export function CsResults({ eyebrow, heading, cta, stats, className }: CsResultsProps) {
  return (
    <div className={clsx("w-full", className)}>
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-80px" }}
        transition={{ duration: 0.55, ease: [0.22, 1, 0.36, 1] }}
        className="flex flex-col gap-6 md:flex-row md:items-start md:justify-between md:gap-10"
      >
        <div>
          {eyebrow && (
            <p className="mb-4 font-mono text-[11px] font-semibold uppercase tracking-[0.18em] text-muted-foreground">
              {eyebrow}
            </p>
          )}
          <h2 className="max-w-[36ch] text-pretty text-2xl font-semibold leading-[1.2] tracking-tight text-foreground md:text-[2rem]">
            {heading}
          </h2>
        </div>

        {cta && <CtaPill {...cta} />}
      </motion.div>

      {/* Stat cards */}
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-80px" }}
        transition={{ duration: 0.55, delay: 0.08, ease: [0.22, 1, 0.36, 1] }}
        className="mt-10 grid grid-cols-1 gap-4 sm:grid-cols-3"
      >
        {stats.map((s) => (
          <div
            key={s.label}
            className={clsx(
              "rounded-[1.5rem] p-6 ring-1",
              s.highlight
                ? "bg-accent/10 ring-accent/25 dark:bg-accent/[0.16]"
                : "bg-card ring-border/60"
            )}
          >
            <div className="flex items-baseline gap-3">
              <span
                className={clsx(
                  "text-4xl font-semibold tracking-tight md:text-5xl",
                  s.highlight ? "text-accent" : "text-foreground"
                )}
              >
                {s.value}
              </span>
              <span className="text-sm font-medium text-muted-foreground">
                {s.label}
              </span>
            </div>
            <div className="my-5 h-px bg-border/60" />
            <p className="text-[13.5px] leading-relaxed text-muted-foreground">
              {s.text}
            </p>
          </div>
        ))}
      </motion.div>
    </div>
  )
}

function CtaPill({ label, href }: { label: string; href?: string }) {
  const className = clsx(
    "inline-flex shrink-0 items-center gap-2 self-start rounded-full bg-foreground px-5 py-3",
    "text-[11px] font-semibold uppercase tracking-[0.16em] text-background",
    "transition-[transform,opacity] duration-300 hover:-translate-y-0.5 hover:opacity-90",
    "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2 focus-visible:ring-offset-background"
  )

  const inner = (
    <>
      {label}
      <IconArrowRight className="size-3.5" stroke={2.5} />
    </>
  )

  return href ? (
    <a href={href} className={className}>
      {inner}
    </a>
  ) : (
    <button type="button" className={className}>
      {inner}
    </button>
  )
}
