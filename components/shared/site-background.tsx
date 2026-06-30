"use client"

import { usePathname } from "next/navigation"
import { HeroShaderGrid } from "@/components/shared/hero-shader-grid"

/**
 * Home-page interactive dot field — a standalone background layer that is
 * intentionally NOT owned by any section. It's pinned to the viewport (fixed,
 * full-bleed) and sits behind all content.
 *
 * Scoped to the home route only: it's mounted in the root layout (so it can
 * sit at body level and stay truly viewport-fixed), but other routes — the
 * showcase, case studies, articles — have their own backdrops and must not
 * inherit it, so we render nothing off "/".
 *
 * Although the layer spans the viewport, a bottom fade-out mask pools the dots
 * in the upper / hero region and dissolves them before the fold, so it reads as
 * a contained hero backdrop rather than an edge-to-edge page-wide grid. The
 * opaque section bands below scroll over it and stay clean.
 *
 * Decorative + pointer-events-none. Fine-pointer desktops only — the static
 * CSS fallback, reduced-motion handling, touch guard, WebGL fallback, and the
 * tab-hidden pause all live inside `HeroShaderGrid` — the hero's own isolated
 * copy of the shader, separate from the shared `ShaderGrid`.
 */

// Pool the dots toward the top and dissolve them before the fold, so the field
// reads as a contained hero backdrop instead of a full-page grid plane. Exported
// so the showcase can demo the hero background exactly as it ships.
export const POOL_MASK = "linear-gradient(to bottom, #000 0%, #000 50%, transparent 86%)"

export function SiteBackground() {
  const pathname = usePathname()
  if (pathname !== "/") return null

  return (
    <div
      aria-hidden
      className="pointer-events-none fixed inset-0 -z-10 hidden lg:block"
      style={{ maskImage: POOL_MASK, WebkitMaskImage: POOL_MASK }}
    >
      <HeroShaderGrid
        spacing={18}
        dotSize={0.07}
        radius={0.13}
        drag={1.35}
        maxDrag={0.01}
        fallbackOpacity={0.28}
      />
    </div>
  )
}
