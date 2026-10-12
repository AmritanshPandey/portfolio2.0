import clsx from "clsx"
import { ReadingProgress } from "@/components/shared/reading-progress"
import type { ReactNode } from "react"

// ─── TYPES ───────────────────────────────────────────────────────────────────

interface Breadcrumb {
  kind: string
  category: string
  client?: string
}

export interface CsHeroShellProps {
  // Navigation context (backwards-compat)
  breadcrumb: Breadcrumb
  // Copy
  title: ReactNode
  lede: ReactNode
  badge?: ReactNode
  // Accent-colored descriptor tags above the title (replaces breadcrumb visually when set)
  keywords?: string[]
  // Meta fields rendered as a ruled two-column table
  meta?: Record<string, string>
  // Footer bar
  readTime?: string
  publishedDate?: string
  topics?: string[]
  // Visual slot — untouched
  aside?: ReactNode
  asideLabel?: string
  /** Kept for call-site compatibility; the aside takes the right-hand columns. */
  asideCol?: string
  // Extra content (backwards-compat — renders below meta)
  children?: ReactNode
  className?: string
}

// ─── LABELS ──────────────────────────────────────────────────────────────────

const META_LABELS: Record<string, string> = {
  role:          "Role",
  duration:      "Duration",
  platform:      "Platform",
  team:          "Team",
  brandsUnified: "Brands Unified",
  organisation:  "Organisation",
  organization:  "Organization",
  scope:         "Scope",
  industry:      "Industry",
  year:          "Year",
  stack:         "Stack",
}

function toLabel(key: string): string {
  return META_LABELS[key] ?? key.replace(/([A-Z])/g, " $1").replace(/^./, (s) => s.toUpperCase())
}

// ─── COMPONENT ───────────────────────────────────────────────────────────────

/**
 * Ledger case-study hero: the keyword line and a drawn rule, the title across
 * the whole sheet, then the lede and a ruled meta table on the left with the
 * project's bespoke visual on the right. No glows, no icon cards; the hero
 * lands with the same CSS rise as the home statement (legible if it never runs).
 */
export function CsHeroShell({
  breadcrumb,
  title,
  lede,
  badge,
  aside,
  asideLabel,
  children,
  className,
  keywords,
  meta,
  readTime,
  publishedDate,
  topics,
}: CsHeroShellProps) {
  const hasAside    = Boolean(aside)
  const metaEntries = meta ? Object.entries(meta).filter(([, v]) => Boolean(v)) : []
  const hasMeta     = metaEntries.length > 0
  const footerParts = [
    readTime,
    publishedDate ? `Published: ${publishedDate}` : null,
    topics && topics.length > 0 ? topics.join(" · ") : null,
  ].filter(Boolean)

  const metaTable = hasMeta && (
    <dl data-hero-fade className="border-t border-border">
      {metaEntries.map(([key, value]) => (
        <div key={key} className="grid grid-cols-[minmax(0,2fr)_minmax(0,3fr)] gap-x-4 border-b border-border py-3">
          <dt className="ledger-label pt-[2px]">{toLabel(key)}</dt>
          <dd className="text-[15px] font-medium leading-snug text-foreground">{value}</dd>
        </div>
      ))}
    </dl>
  )

  return (
    <div className={clsx("relative bg-background", className)}>
      <ReadingProgress />

      <div
        data-cs-hero-inner
        className="ledger pb-16 md:pb-24"
        style={{ paddingTop: "calc(var(--nav-h) + clamp(40px, 6vw, 104px))" }}
      >
        {/* Keyword line, or the breadcrumb when there are no keywords. */}
        <div data-hero-fade className="flex flex-wrap items-baseline justify-between gap-x-6 gap-y-2 pb-4">
          {keywords && keywords.length > 0 ? (
            <p className="ledger-label text-foreground">{keywords.join(" · ")}</p>
          ) : (
            <nav className="ledger-label flex flex-wrap items-baseline gap-x-3 text-foreground">
              <span>{breadcrumb.kind}</span>
              <span aria-hidden>·</span>
              <span>{breadcrumb.category}</span>
              {breadcrumb.client && (
                <>
                  <span aria-hidden>·</span>
                  <span>{breadcrumb.client}</span>
                </>
              )}
            </nav>
          )}
          {badge && (
            <span className="ledger-label inline-flex items-center gap-2">
              <span aria-hidden className="h-[7px] w-[7px] bg-accent" />
              {badge}
            </span>
          )}
        </div>

        <div aria-hidden data-hero-rule className="rule-ink" />

        <h1
          data-cs-hero-title
          data-hero-line="1"
          className="type-hero-internal mt-6 max-w-[17ch] text-foreground md:mt-10"
        >
          {title}
        </h1>

        <div data-cs-hero-grid className="ledger-grid mt-12 gap-y-12 md:mt-16">
          <div className="col-span-12 min-w-0 lg:col-span-6">
            <div
              data-cs-hero-lede
              data-hero-fade
              className="max-w-[48ch] text-[clamp(1.125rem,1.4vw,1.375rem)] leading-[1.45] tracking-[-0.01em] text-muted-foreground [&_strong]:font-semibold [&_strong]:text-foreground"
            >
              {lede}
            </div>

            {footerParts.length > 0 && (
              <p data-hero-fade className="ledger-label mt-6">
                {footerParts.join("  ·  ")}
              </p>
            )}

            {hasAside && hasMeta && <div className="mt-10">{metaTable}</div>}

            {children && <div data-hero-fade className="mt-8">{children}</div>}
          </div>

          <div data-cs-hero-aside data-hero-card className="col-span-12 min-w-0 lg:col-span-5 lg:col-start-8">
            {hasAside ? (
              <>
                {asideLabel && <p className="ledger-label mb-4">{asideLabel}</p>}
                {aside}
              </>
            ) : (
              metaTable
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
