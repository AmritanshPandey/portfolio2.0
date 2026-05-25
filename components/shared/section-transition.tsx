import clsx from "clsx"

type Variant = "default" | "muted" | "highlight"

export function SectionTransition({
  eyebrow,
  text,
  variant = "default",
}: {
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
        {/* Divider */}
        <div className="relative h-[2px] w-20 rounded-full overflow-hidden">
          <div className="absolute inset-0 bg-border/60" />
          <div className="absolute left-0 top-0 h-full w-[70%] bg-gradient-to-r from-orange-500 to-orange-400" />
        </div>

        {eyebrow && (
          <p className="text-[11px] tracking-[0.2em] uppercase text-muted-foreground">
            {eyebrow}
          </p>
        )}

        <p className={clsx("leading-[1.65] tracking-tight", textStyles[variant])}>
          {text}
        </p>
      </div>
    </div>
  )
}
