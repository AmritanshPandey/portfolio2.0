import clsx from "clsx"
import type { ReactNode } from "react"

/**
 * One chapter of a study (docs/superpowers/specs/2026-11-14-study-template-design.md).
 * Its reference and label hang in the left rail, the title and a short lede
 * sit in the reading column, and the visual below gets the whole sheet: the
 * picture carries the chapter, the words caption it.
 *
 * A labelled, anchored chapter registers with the place tracker through
 * `data-chapter`. `ink` sets the chapter on the night band, which a study uses
 * once, for the call it turned on.
 */
export function StudyChapter({
  id,
  index,
  label,
  title,
  lede,
  ink = false,
  aside,
  children,
}: {
  id: string
  /** 1-based position, shown as the two-digit reference. */
  index: number
  label: string
  title: ReactNode
  lede?: ReactNode
  ink?: boolean
  /** A visual set beside the title and lede (from column 7), for a chapter
   *  whose picture is as tall as its words. */
  aside?: ReactNode
  children?: ReactNode
}) {
  return (
    <section
      id={id}
      data-chapter=""
      data-chapter-label={label}
      className={clsx("relative w-full scroll-mt-24 bg-background text-foreground", ink && "ink-band")}
    >
      <div className="ledger">
        <div aria-hidden className={ink ? "h-px" : "rule-hair"} />
        <div className="ledger-grid gap-y-5 pt-16 md:pt-20">
          <p data-settle className={clsx("ledger-label col-span-12 lg:pt-3", aside ? "" : "lg:col-span-3")}>
            {String(index).padStart(2, "0")} · {label}
          </p>
          <div className={clsx("col-span-12 min-w-0", aside ? "lg:col-span-5" : "lg:col-span-9 lg:col-start-4")}>
            <h2 data-settle="title" className="type-case-title max-w-[20ch] text-balance text-foreground">
              {title}
            </h2>
            {lede && (
              <p
                data-settle
                style={{ ["--i" as string]: 1 }}
                className="mt-5 max-w-[58ch] text-[17px] leading-[1.6] text-muted-foreground"
              >
                {lede}
              </p>
            )}
          </div>
          {aside && (
            <div className="col-span-12 min-w-0 pb-4 pt-6 lg:col-span-6 lg:col-start-7 lg:pt-0">{aside}</div>
          )}
        </div>
        {children && <div className="space-y-16 pt-12 md:space-y-20 md:pt-14">{children}</div>}
        <div aria-hidden className="h-16 md:h-20" />
      </div>
    </section>
  )
}

/**
 * A visual with its mono caption. `wide` takes the whole sheet; `column` the
 * reading column from column 4, leaving the rail open.
 */
export function StudyFigure({
  caption,
  width = "wide",
  children,
  className,
}: {
  caption?: ReactNode
  width?: "wide" | "column"
  children: ReactNode
  className?: string
}) {
  return (
    <figure className={clsx(width === "column" && "ledger-offset", className)}>
      <div className="min-w-0">{children}</div>
      {caption && (
        <figcaption className="ledger-label mt-4 max-w-[72ch]">{caption}</figcaption>
      )}
    </figure>
  )
}

/**
 * One screen in "The work": a short reference, a line on what to look for,
 * then the screen as large as the sheet allows.
 */
export function StudyScreen({
  refLabel,
  title,
  note,
  children,
}: {
  refLabel: string
  title: ReactNode
  note?: ReactNode
  children: ReactNode
}) {
  return (
    <div>
      <div className="ledger-grid gap-y-2 pb-8">
        <p className="ledger-label col-span-12 lg:col-span-3 lg:pt-1">{refLabel}</p>
        <div className="col-span-12 lg:col-span-7 lg:col-start-4">
          <p className="text-[clamp(1.25rem,1.9vw,1.75rem)] font-[700] leading-tight tracking-[-0.02em] text-foreground">{title}</p>
          {note && <p className="mt-2 max-w-[58ch] text-[15px] leading-relaxed text-muted-foreground">{note}</p>}
        </div>
      </div>
      {children}
    </div>
  )
}
