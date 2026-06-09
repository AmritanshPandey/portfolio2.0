import clsx from "clsx"

type Variant = "default" | "muted" | "highlight"

export function SectionTransition({
  text,
  variant = "default",
}: {
  /** Accepted for caller compatibility; no longer rendered (per DESIGN.md). */
  eyebrow?: string
  text: string
  variant?: Variant
}) {
  const textStyles = {
    default: "type-section-intro text-foreground",
    muted: "type-section-intro text-muted-foreground",
    highlight: "type-subtitle text-foreground",
  }

  return (
    <div className="mt-6 md:mt-10">
      <div className="max-w-xl space-y-4">
        {/* Divider — neutral; ember is reserved for intent, not decoration */}
        <div className="h-px w-20 rounded-full bg-border" />

        <p className={clsx(textStyles[variant])}>
          {text}
        </p>
      </div>
    </div>
  )
}
