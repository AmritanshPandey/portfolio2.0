import clsx from "clsx"
import type { ReactNode } from "react"

export interface CsSummaryProps {
  /** What was broken / what was changing. One or two sentences. */
  problem: ReactNode
  /** What *you* personally owned. Use direct verbs: Led, Defined, Prototyped. */
  role: ReactNode
  /** What changed after the work shipped. Honest — qualitative is fine. */
  outcome: ReactNode
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
 * The 30-second read, set as three ruled columns under an ink rule: a
 * recruiter who never scrolls further still leaves with the problem, what
 * this person did, and what changed.
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
    <aside aria-label="Executive summary" className={clsx("relative", className)}>
      <div aria-hidden data-settle="rule" className="rule-ink" />
      <p className="ledger-label mt-4">{label}</p>
      <dl className="mt-6 grid gap-8 sm:grid-cols-3 sm:gap-[var(--col-gap)]">
        {ROWS.map(({ key, label: rowLabel }, i) => (
          <div key={key} data-settle style={{ ["--i" as string]: i }} className="min-w-0 border-t border-border pt-4">
            <dt className="ledger-label mb-2 text-foreground">{rowLabel}</dt>
            <dd className="text-[15px] leading-[1.55] text-foreground/80">{values[key]}</dd>
          </div>
        ))}
      </dl>
    </aside>
  )
}
