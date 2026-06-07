import clsx from "clsx"

type Variant = "default" | "compact" | "hero"
type HeadingLevel = "h1" | "h2" | "h3"

interface SectionHeaderProps {
  /** Accepted for caller compatibility; no longer rendered.
   *  Per DESIGN.md, per-section uppercase tracked eyebrows are an anti-reference. */
  eyebrow?: string
  title: string
  description?: string
  variant?: Variant
  as?: HeadingLevel
  /** Accepted for caller compatibility; gradient-text word emphasis (shimmer)
   *  removed per DESIGN.md. Hierarchy now comes from size + weight. */
  accentIndex?: number
}

export function SectionHeader({
  title,
  description,
  variant = "default",
  as: Tag = "h2",
}: SectionHeaderProps) {
  const variants = {
    default: { container: "max-w-[700px] space-y-4", title: "text-3xl md:text-4xl lg:text-5xl", desc: "text-sm md:text-base" },
    compact: { container: "max-w-2xl space-y-4",      title: "text-3xl md:text-4xl lg:text-5xl", desc: "text-sm md:text-base" },
    hero:    { container: "mb-10 md:mb-12 max-w-3xl space-y-5", title: "text-4xl md:text-5xl lg:text-6xl", desc: "text-base md:text-lg" },
  }

  const styles = variants[variant]

  return (
    <div className={clsx(styles.container)}>
      <Tag className={clsx("font-semibold tracking-tight leading-[1.08] text-balance text-neutral-900 dark:text-white", styles.title)}>
        {title}
      </Tag>

      {description && (
        <p className={clsx("text-muted-foreground leading-[1.6] max-w-xl", styles.desc)}>
          {description}
        </p>
      )}
    </div>
  )
}
