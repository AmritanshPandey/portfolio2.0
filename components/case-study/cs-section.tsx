import clsx from "clsx"
import type { ReactNode } from "react"

type Variant = "default" | "muted" | "dark" | "ink"

interface Props {
  /** Kept for call-site compatibility; section headings are rendered by each page. */
  label?: string
  children: ReactNode
  /** Every section sits on the same sheet, except "ink": the night band
   *  (.ink-band), used once per case study for its key decision moment, as
   *  the home page uses it for the Systems section. "muted" and "dark" are
   *  kept for call-site compatibility and render as the sheet. */
  variant?: Variant
  /** Deprecated — section separation comes from the rule. */
  withDivider?: boolean
  /** Anchor target for in-page links. */
  id?: string
}

/**
 * A case-study section: a hairline across the sheet, then a reading column
 * that starts at column 4 of the grid, leaving the left rail open, so the
 * case study shares the home page's asymmetric sheet.
 */
export function CsSection({ children, id, variant }: Props) {
  return (
    <section
      id={id}
      className={clsx(
        "relative w-full bg-background text-foreground",
        id && "scroll-mt-24",
        variant === "ink" && "ink-band",
      )}
    >
      <div className="ledger">
        <div aria-hidden className="rule-hair" />
        <div className="ledger-grid py-16 md:py-24">
          <div className="col-span-12 min-w-0 lg:col-span-9 lg:col-start-4 xl:col-span-8 xl:col-start-4">
            {children}
          </div>
        </div>
      </div>
    </section>
  )
}
