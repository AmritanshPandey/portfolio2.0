"use client"

import { useEffect, useState } from "react"
import { AsciiFlowBackground } from "@/components/ui/ascii-flow-background"
import { staysStill } from "@/lib/motion-budget"

// Animated only where it will be smooth; the hero's dot field uses the same rule.
const LIVE_QUERY = "(min-width: 768px) and (pointer: fine) and (prefers-reduced-motion: no-preference)"

// Hangs from the header rule: a short fade under it, full strength behind the
// heading, dissolving into the page below.
const FADE = "linear-gradient(to bottom, transparent 0, #000 14px, #000 55%, transparent 100%)"

/**
 * The gallery header's ASCII field: graphite glyphs in the site's mono, the
 * brightest clusters lighting up in ultramarine, drifting at 30fps. Phones,
 * iPads, low battery and reduced motion get one still frame of it instead.
 */
export function GalleryAscii() {
  // Still until this device is known to animate it smoothly.
  const [still, setStill] = useState(true)

  useEffect(() => {
    const query = window.matchMedia(LIVE_QUERY)
    let cancelled = false
    const decide = async () => {
      const stay = await staysStill()
      if (!cancelled) setStill(stay || !query.matches)
    }
    const onChange = () => {
      if (query.matches) void decide()
      else setStill(true)
    }
    if (query.matches) void decide()
    query.addEventListener("change", onChange)
    return () => {
      cancelled = true
      query.removeEventListener("change", onChange)
    }
  }, [])

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
