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
    default:   "text-foreground text-lg md:text-xl",
    muted:     "text-muted-foreground text-base md:text-lg",
    highlight: "text-foreground text-xl md:text-2xl font-medium",
  }

  return (
    <div className="mt-6 md:mt-10">
      <div className="max-w-xl space-y-5">
        {/* Divider — neutral; ember is reserved for intent, not decoration */}
        <div className="h-px w-20 rounded-full bg-border" />

        <p className={clsx("leading-[1.65] tracking-tight", textStyles[variant])}>
          {text}
        </p>
      </div>
    </div>
  )
}
