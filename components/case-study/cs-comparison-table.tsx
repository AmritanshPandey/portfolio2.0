"use client"

import { motion } from "framer-motion"
import clsx from "clsx"
import { EASE, DURATION } from "@/lib/motion"

export interface CsComparisonRow {
  /** The dimension being compared, e.g. "Time to first demo". */
  criterion: string
  /** One cell per column, in the same order as `columns`. */
  values: string[]
}

export interface CsComparisonTableProps {
  columns: string[]
  rows: CsComparisonRow[]
  /** Index into `columns` marking the approach that was chosen. */
  highlight?: number
  caption?: string
  className?: string
}

/**
 * A real comparison table for structured trade-offs.
 *
 * CsOptions carries three approaches with reasoning; this is for when the
 * comparison is dense enough that prose stops being readable and a reader needs
 * to scan one criterion across every column.
 *
 * It's a real <table> with scope'd headers so it's navigable by screen reader,
 * and it scrolls inside its own container rather than pushing the page sideways
 * on mobile. The highlighted column is marked in its header text, not by tint
 * alone.
 */
export function CsComparisonTable({
  columns,
  rows,
  highlight,
  caption,
  className,
}: CsComparisonTableProps) {
  return (
    <motion.figure
      initial={{ opacity: 0, y: 16 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-60px" }}
      transition={{ duration: DURATION.base, ease: EASE }}
      className={clsx("w-full", className)}
    >
      {/* Wide tables scroll here, never on the page body. */}
      <div className="overflow-x-auto rounded-2xl border border-border/70">
        <table className="w-full min-w-[560px] border-collapse text-left">
          <thead>
            <tr className="border-b border-border/70">
              <th
                scope="col"
                className="px-5 py-3.5 font-mono text-[10px] font-semibold uppercase tracking-[0.14em] text-muted-foreground"
              >
                Criterion
              </th>
              {columns.map((c, i) => (
                <th
                  key={c}
                  scope="col"
                  className={clsx(
                    "px-5 py-3.5 text-[13px] font-medium",
                    i === highlight
                      ? "bg-accent/[0.05] text-accent"
                      : "text-foreground/80"
                  )}
                >
                  {c}
                  {i === highlight && (
                    <span className="ml-2 font-mono text-[9px] uppercase tracking-[0.12em] text-accent/80">
                      chosen
                    </span>
                  )}
                </th>
              ))}
            </tr>
          </thead>

          <tbody>
            {rows.map((r) => (
              <tr
                key={r.criterion}
                className="border-b border-border/50 last:border-b-0"
              >
                <th
                  scope="row"
                  className="px-5 py-4 align-top text-[13px] font-medium text-foreground/80"
                >
                  {r.criterion}
                </th>
                {r.values.map((v, i) => (
                  <td
                    key={`${r.criterion}-${columns[i] ?? i}`}
                    className={clsx(
                      "px-5 py-4 align-top text-[13px] leading-relaxed",
                      i === highlight
                        ? "bg-accent/[0.03] text-foreground/85"
                        : "text-muted-foreground"
                    )}
                  >
                    {v}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {caption && (
        <figcaption className="mt-3 text-[12.5px] leading-relaxed text-muted-foreground">
          {caption}
        </figcaption>
      )}
    </motion.figure>
  )
}
