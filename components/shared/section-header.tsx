import clsx from "clsx"

type Variant = "default" | "compact" | "hero" | "quiet"
type HeadingLevel = "h1" | "h2" | "h3"

interface SectionHeaderProps {
  /** Accepted for caller compatibility; not rendered (no eyebrow labels). */
  eyebrow?: string
  title: string
  description?: string
  variant?: Variant
  as?: HeadingLevel
  /** When true, the title and intro settle in as they scroll into view. */
  animated?: boolean
  /** Accepted for caller compatibility; gradient emphasis is retired. */
  accentIndex?: number
}

/**
 * Ledger section header: the title hangs from the left edge of the grid; the
 * intro sits against it on the right, top-aligned, so the pair reads as a
 * caption to the heading rather than a subtitle under it.
 */
export function SectionHeader({
  title,
  description,
  variant = "default",
  as: Tag = "h2",
  animated = true,
}: SectionHeaderProps) {
  const quiet = variant === "quiet"
  const settle = animated ? { "data-settle": "" } : {}
  // The title rises out of a slot rather than fading in (see globals.css).
  const settleTitle = animated ? { "data-settle": "title" } : {}

  return (
    <div className="ledger-grid gap-y-5">
      <Tag
        {...settleTitle}
        className={clsx(
          "col-span-12 text-foreground",
          quiet
            ? "md:col-span-7 text-[clamp(1.75rem,3.2vw,3rem)] font-[750] leading-[0.98] tracking-[-0.03em] [font-variation-settings:'wdth'_110]"
            : variant === "hero"
              ? "type-page-title md:col-span-9"
              : "type-section-title md:col-span-8",
        )}
      >
        {title}
      </Tag>

      {description && (
        <p
          {...settle}
          style={{ ["--i" as string]: 1 }}
          className={clsx(
            "type-section-intro col-span-12 text-muted-foreground md:col-span-4 md:col-start-9 md:pt-2",
          )}
        >
          {description}
        </p>
      )}
    </div>
  )
}
