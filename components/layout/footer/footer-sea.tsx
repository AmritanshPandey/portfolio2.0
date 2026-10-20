"use client"

import { AsciiFlowBackground } from "@/components/ui/ascii-flow-background"
import { useAmbientStill } from "@/hooks/use-ambient-still"

// The horizon dissolves into the paper above it.
const FADE = "linear-gradient(to bottom, transparent 0, #000 42%)"

/**
 * The footer's ASCII sea: swell lines of graphite tildes in the site's mono,
 * rising and falling from a horizon down to the foot of the page, the highest
 * front crests glinting ultramarine. Light enough to run anywhere: live at
 * 30fps on any screen, phones included, while on screen; reduced motion and a
 * low battery get one still frame.
 */
export function FooterSea() {
  const still = useAmbientStill("anywhere")

  return (
    <div
      aria-hidden
      data-footer-sea
      className="pointer-events-none relative h-[clamp(140px,15vw,240px)]"
      style={{ maskImage: FADE, WebkitMaskImage: FADE }}
    >
      <AsciiFlowBackground
        shape="waves"
        still={still}
        fps={30}
        cellSize={8}
        fontSize={13}
        fontVar="--ff-mono"
        colorLightVar="--graphite"
        colorDarkVar="--graphite"
        accentLightVar="--ultramarine"
        accentDarkVar="--ultramarine"
      />
    </div>
  )
}
