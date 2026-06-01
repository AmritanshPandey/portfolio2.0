import clsx from "clsx"
import { Fragment } from "react"

type Variant = "default" | "compact" | "hero"
type HeadingLevel = "h1" | "h2" | "h3"

interface SectionHeaderProps {
  eyebrow?: string
  title: string
  description?: string
  variant?: Variant
  as?: HeadingLevel
  accentIndex?: number
}

export function SectionHeader({
  eyebrow,
  title,
  description,
  variant = "default",
  as: Tag = "h2",
  accentIndex = -1,
}: SectionHeaderProps) {
  const variants = {
    default: { container: "max-w-[700px] space-y-4", title: "text-3xl md:text-4xl lg:text-5xl", desc: "text-sm md:text-base" },
    compact: { container: "max-w-2xl space-y-4",      title: "text-3xl md:text-4xl lg:text-5xl", desc: "text-sm md:text-base" },
    hero:    { container: "mb-10 md:mb-12 max-w-3xl space-y-5", title: "text-4xl md:text-5xl lg:text-6xl", desc: "text-base md:text-lg" },
  }

  const styles = variants[variant]
  const words = title.split(" ")
  const resolvedAccent = accentIndex < 0 ? words.length + accentIndex : accentIndex

  return (
    <div className={clsx(styles.container)}>
      {eyebrow && (
        <div className="flex items-center gap-3">
          <div className="w-6 h-[1.5px] bg-orange-500/70 rounded-full" />
          <p className="text-[11px] tracking-[0.18em] font-medium uppercase text-muted-foreground">
            {eyebrow}
          </p>
        </div>
      )}

      <Tag className={clsx("font-semibold tracking-tight leading-[1.08] text-balance text-neutral-900 dark:text-white", styles.title)}>
        {words.map((word, i) => (
          <Fragment key={i}>
            <span className={i === resolvedAccent ? "shimmer-accent" : undefined}>
              {word}
            </span>
            {i < words.length - 1 ? " " : ""}
          </Fragment>
        ))}
      </Tag>

      {description && (
        <p className={clsx("text-muted-foreground leading-[1.6] max-w-xl", styles.desc)}>
          {description}
        </p>
      )}
    </div>
  )
}
