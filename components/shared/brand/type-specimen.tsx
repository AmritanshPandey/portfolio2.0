import { cn } from "@/lib/utils"

/**
 * TypeSpecimen — a brand-kit typography cell. A large "Aa" set in the display
 * family, the pairing label, and a live weights row where each sample is
 * rendered at the weight it names. CSS-only hover: the glyph tightens its
 * tracking on hover (motion-safe), no JS.
 */

const WEIGHTS = [
  { w: 400, label: "Regular" },
  { w: 500, label: "Medium" },
  { w: 600, label: "Semibold" },
  { w: 700, label: "Bold" },
] as const

export function TypeSpecimen({ className }: { className?: string }) {
  return (
    <div className={cn("flex h-full flex-col justify-between gap-4", className)}>
      <div className="flex items-start justify-between gap-4">
        <span
          className={cn(
            "select-none font-display font-bold leading-[0.85] tracking-tight text-foreground",
            "text-[clamp(3.5rem,9vw,6rem)]",
            "transition-[letter-spacing] duration-500 ease-[cubic-bezier(0.22,1,0.36,1)]",
            "motion-safe:group-hover/bento:tracking-[-0.04em]"
          )}
        >
          Aa
        </span>
        <span className="font-mono text-[10px] font-semibold uppercase tracking-[0.16em] text-muted-foreground">
          Display
        </span>
      </div>

      <div>
        <p className="text-sm font-semibold text-foreground">
          Bricolage Grotesque <span className="text-muted-foreground">+ Onest</span>
        </p>
        <p className="mt-0.5 text-xs text-muted-foreground">
          Display above 22px, body below it.
        </p>
        <div className="mt-3 flex flex-wrap items-baseline gap-x-4 gap-y-1.5">
          {WEIGHTS.map(({ w, label }) => (
            <span
              key={w}
              style={{ fontWeight: w }}
              className="text-base leading-none text-foreground/90"
              title={`${label} · ${w}`}
            >
              Ag
              <span className="ml-1 align-middle font-mono text-[10px] text-muted-foreground">
                {w}
              </span>
            </span>
          ))}
        </div>
      </div>
    </div>
  )
}
