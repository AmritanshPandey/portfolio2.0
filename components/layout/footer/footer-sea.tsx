"use client"

import { AsciiFlowBackground } from "@/components/ui/ascii-flow-background"
import { useAmbientMode } from "@/hooks/use-ambient-still"

// The horizon dissolves into the paper above it.
const FADE = "linear-gradient(to bottom, transparent 0, #000 42%)"

/**
 * The footer's ASCII sea: swell lines of graphite tildes in the site's mono,
 * rising and falling from a horizon down to the foot of the page, the highest
 * front crests glinting ultramarine. Live at 30fps on a desktop pointer while
 * on screen; phones, iPads, slow Safari, low battery and reduced motion get
 * one still frame. It waits to know which before building its canvas, so the
 * canvas is built once (the footer is below the fold, so nobody sees it wait).
 */
export function FooterSea() {
  const mode = useAmbientMode("desktop")

  return (
    <div
      aria-hidden
      data-footer-sea
      className="pointer-events-none relative h-[clamp(140px,15vw,240px)]"
      style={{ maskImage: FADE, WebkitMaskImage: FADE }}
    >
      {mode && (
        <AsciiFlowBackground
          shape="waves"
          still={mode === "still"}
          fps={30}
          cellSize={8}
          fontSize={13}
          fontVar="--ff-mono"
          colorLightVar="--graphite"
          colorDarkVar="--graphite"
          accentLightVar="--ultramarine"
          accentDarkVar="--ultramarine"
        />
      )}
    </div>
  )
}
