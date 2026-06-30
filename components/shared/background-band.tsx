import type { ReactNode } from "react"

import { cn } from "@/lib/utils"

const GROUND_GRADIENT =
  "linear-gradient(to bottom, var(--background) 0%, transparent 22%, transparent 78%, var(--background) 100%)"

export interface BackgroundBandProps {
  /** The background layer, e.g. <ConstellationNetwork />. Rendered behind content,
   *  non-interactive, filling the band. */
  bg: ReactNode
  /** Foreground content, centred and above the background. */
  children?: ReactNode
  /** Tailwind height classes for the band. */
  height?: string
  /** Break out to the full viewport width (relies on `overflow-x-clip` on <main>). */
  bleed?: boolean
  /** Fade the band into the page background at top + bottom. */
  ground?: boolean
  /** Extra classes on the inner box. */
  className?: string
}

/**
 * A full-width section that hosts one of the reusable backgrounds. Handles the
 * three things every band needs so callers don't re-type them: the viewport
 * breakout, the background layer (absolute + pointer-events-none + behind
 * content), and the top/bottom grounding gradient. Server-safe — the canvas
 * passed as `bg` is the only client part.
 *
 * @example
 * <BackgroundBand bg={<ConstellationNetwork />}>
 *   <h2>Section title</h2>
 * </BackgroundBand>
 */
export function BackgroundBand({
  bg,
  children,
  height = "h-72 md:h-96",
  bleed = true,
  ground = true,
  className,
}: BackgroundBandProps) {
  const inner = (
    <div
      className={cn(
        "relative isolate flex items-center justify-center overflow-hidden bg-background",
        height,
        className
      )}
    >
      {/* Background — behind everything, never eats pointer events */}
      <div className="pointer-events-none absolute inset-0 z-0">{bg}</div>

      {/* Ground the band into the page background, top + bottom */}
      {ground && (
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0 z-10"
          style={{ background: GROUND_GRADIENT }}
        />
      )}

      {/* Foreground content */}
      {children && <div className="relative z-20">{children}</div>}
    </div>
  )

  if (!bleed) return inner

  return <div className="relative left-1/2 w-screen -translate-x-1/2">{inner}</div>
}
