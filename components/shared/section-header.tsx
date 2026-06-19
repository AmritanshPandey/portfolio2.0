import clsx from "clsx"
import { Reveal, TextReveal } from "@/components/shared/motion"

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
  animated?: boolean
  /** Accepted for caller compatibility; gradient-text word emphasis (shimmer)
   *  removed per DESIGN.md. Hierarchy now comes from size + weight. */
  accentIndex?: number
}

export function SectionHeader({
  title,
  description,
  variant = "default",
  as: Tag = "h2",
  animated = true,
}: SectionHeaderProps) {
  const variants = {
    default: { container: "max-w-[700px] space-y-4", title: "type-section-title" },
    compact: { container: "max-w-2xl space-y-4", title: "type-section-title" },
    hero: { container: "mb-10 md:mb-12 max-w-3xl space-y-5", title: "type-page-title" },
  }

  const styles = variants[variant]

  return (
    <div className={clsx(styles.container)}>
      {animated ? (
        <TextReveal
          as={Tag}
          className={clsx("text-neutral-900 dark:text-white", styles.title)}
        >
          {title}
        </TextReveal>
      ) : (
        <Tag className={clsx("text-neutral-900 dark:text-white", styles.title)}>
          {title}
        </Tag>
      )}

      {description && (
        animated ? (
          <Reveal as="p" y={18} delay={0.12} className="type-section-intro text-muted-foreground">
            {description}
          </Reveal>
        ) : (
          <p className="type-section-intro text-muted-foreground">
            {description}
          </p>
        )
      )}
    </div>
  )
}
