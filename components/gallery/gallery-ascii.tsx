"use client"

import { AsciiFlowBackground } from "@/components/ui/ascii-flow-background"
import { useAmbientStill } from "@/hooks/use-ambient-still"

// Hangs from the header rule: a short fade under it, full strength behind the
// heading, dissolving into the page below.
const FADE = "linear-gradient(to bottom, transparent 0, #000 14px, #000 55%, transparent 100%)"

/**
 * The gallery header's ASCII field: graphite glyphs in the site's mono, the
 * brightest clusters lighting up in ultramarine, drifting at 30fps. Phones,
 * iPads, low battery and reduced motion get one still frame of it instead.
 */
export function GalleryAscii() {
  const still = useAmbientStill()

  return (
    <div
      aria-hidden
      data-gallery-ascii
      className="pointer-events-none absolute inset-y-0 left-[calc(50%-50vw)] right-[calc(50%-50vw)] -z-10"
      style={{ maskImage: FADE, WebkitMaskImage: FADE }}
    >
      <div className="gallery-ascii-side absolute inset-0">
        <AsciiFlowBackground
          still={still}
          fps={30}
          maxDpr={1.5}
          cellSize={12}
          fontSize={11}
          opacity={0.6}
          speed={0.7}
          fontVar="--ff-mono"
          colorLightVar="--graphite"
          colorDarkVar="--graphite"
          accentLightVar="--ultramarine"
          accentDarkVar="--ultramarine"
        />
      </div>
    </div>
  )
}
