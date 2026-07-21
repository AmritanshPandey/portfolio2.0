import clsx from "clsx"
import { SectionHeader } from "./section-header"
import { SectionTransition } from "./section-transition"
import { ShaderGrid } from "./shader-grid"

type Bg = "default" | "muted" | "dark" | "grid" | "squares" | "approach"

interface SectionProps {
  id?: string
  bg?: Bg
  children: React.ReactNode
  eyebrow?: string
  title?: string
  description?: string
  headerVariant?: "default" | "compact" | "hero" | "quiet"
  headerAnimated?: boolean
  transition?: string
  transitionEyebrow?: string
  transitionVariant?: "default" | "muted" | "highlight"
}

export function Section({
  id,
  bg = "default",
  children,
  eyebrow,
  title,
  description,
  headerVariant = "default",
  headerAnimated = true,
  transition,
  transitionEyebrow,
  transitionVariant = "default",
}: SectionProps) {

  // CLEAN BASE SURFACES — true-gray (chroma 0), no baked accent.
  // Sections read as distinct editorial bands via a deliberate tonal step:
  // `muted` always RECEDES (one step deeper than `default`) in both modes, so
  // cards (surface 0.18 dark / white light) keep popping on every band.
  const bgStyles = {
    default: `
      bg-canvas-default text-foreground
    `,

    muted: `
      bg-canvas-muted text-foreground
    `,

    // Clean `default` surface with an interactive dot-field backdrop,
    // rendered via <ShaderGrid> below when bg === "grid".
    grid: `
      bg-canvas-default text-foreground
    `,

    squares: `
      bg-canvas-default text-foreground
    `,

    approach: `
      bg-background text-foreground
    `,

    dark: `
      bg-neutral-950 text-white
    `,
  }

  const hasSquareGrid = bg === "squares"

  return (
    <section
      id={id}
      className={clsx(
        "relative w-full overflow-hidden transition-colors duration-500",
        bgStyles[bg]
      )}
    >

      {/* Interactive dot-field backdrop — only for the `grid` band. Decorative,
          pointer-events-none, and self-pausing when off-screen. */}
      {bg === "grid" && (
        <ShaderGrid
          spacing={18}
          dotSize={0.07}
          radius={0.13}
          drag={1.35}
          maxDrag={0.01}
          // Softer than the default so the dot field reads as a quiet texture
          // and never competes with the section's reading text (legibility first,
          // dots are decorative — per DESIGN.md).
          lightColor={[0, 0, 0, 0.2]}
          darkColor={[1, 1, 1, 0.26]}
        />
      )}

      {hasSquareGrid && (
        <div aria-hidden className="pointer-events-none absolute inset-0 overflow-hidden">
          <div
            className="absolute inset-0 opacity-[0.34] dark:hidden"
            style={{
              backgroundImage: [
                "linear-gradient(to right, rgba(0,0,0,0.105) 1px, transparent 1px)",
                "linear-gradient(to bottom, rgba(0,0,0,0.105) 1px, transparent 1px)",
                "linear-gradient(to right, rgba(0,0,0,0.045) 1px, transparent 1px)",
                "linear-gradient(to bottom, rgba(0,0,0,0.045) 1px, transparent 1px)",
              ].join(", "),
              backgroundSize: "96px 96px, 96px 96px, 24px 24px, 24px 24px",
              maskImage: "linear-gradient(to bottom, transparent 0%, black 10%, black 88%, transparent 100%)",
              WebkitMaskImage: "linear-gradient(to bottom, transparent 0%, black 10%, black 88%, transparent 100%)",
            }}
          />
          <div
            className="absolute inset-0 hidden opacity-[0.42] dark:block"
            style={{
              backgroundImage: [
                "linear-gradient(to right, rgba(255,255,255,0.12) 1px, transparent 1px)",
                "linear-gradient(to bottom, rgba(255,255,255,0.12) 1px, transparent 1px)",
                "linear-gradient(to right, rgba(255,255,255,0.05) 1px, transparent 1px)",
                "linear-gradient(to bottom, rgba(255,255,255,0.05) 1px, transparent 1px)",
              ].join(", "),
              backgroundSize: "96px 96px, 96px 96px, 24px 24px, 24px 24px",
              maskImage: "linear-gradient(to bottom, transparent 0%, black 10%, black 88%, transparent 100%)",
              WebkitMaskImage: "linear-gradient(to bottom, transparent 0%, black 10%, black 88%, transparent 100%)",
            }}
          />
        </div>
      )}

      {/* SURFACE + LIGHT ─────────────────────────────────────────────────────
          Three layers per band:
          1. Fine dot grain  — tactile surface, fades at seams
          2. Directional key — off-centre so it reads as a real light source
          3. Edge vignette   — dark-mode depth; content sits inside the band
          Muted bands also carry a warm emerald pool + faint counter-shadow. */}
      <div aria-hidden className="pointer-events-none absolute inset-0 overflow-hidden">

          {/* 1 ── DOT GRAIN ── */}
          {!hasSquareGrid && (
            <>
              <div
                className="absolute inset-0 dark:hidden"
                style={{
                  backgroundImage: `radial-gradient(circle, rgba(0,0,0,0.07) 0.75px, transparent 0.75px)`,
                  backgroundSize: `22px 22px`,
                  maskImage: `linear-gradient(to bottom, transparent 0%, black 9%, black 88%, transparent 100%)`,
                  WebkitMaskImage: `linear-gradient(to bottom, transparent 0%, black 9%, black 88%, transparent 100%)`,
                }}
              />
              <div
                className="absolute inset-0 hidden dark:block"
                style={{
                  backgroundImage: `radial-gradient(circle, rgba(255,255,255,0.04) 0.75px, transparent 0.75px)`,
                  backgroundSize: `22px 22px`,
                  maskImage: `linear-gradient(to bottom, transparent 0%, black 9%, black 88%, transparent 100%)`,
                  WebkitMaskImage: `linear-gradient(to bottom, transparent 0%, black 9%, black 88%, transparent 100%)`,
                }}
              />
            </>
          )}

          {/* 2 ── KEY LIGHT ── */}
          {/* Dark: slightly left-of-centre so it reads as a real directional source */}
          <div
            className="absolute inset-x-0 top-0 h-[500px] opacity-0 dark:opacity-100"
            style={{ background: "radial-gradient(55% 80% at 44% 0%, rgba(255,255,255,0.055) 0%, transparent 70%)" }}
          />
          {/* Light: gentle grounding shade at base */}
          <div
            className="absolute inset-x-0 bottom-0 h-[280px] dark:hidden"
            style={{ background: "linear-gradient(to top, rgba(0,0,0,0.03), transparent)" }}
          />

          {/* 3 ── EDGE VIGNETTE (dark only) ── */}
          {/* Left/right edges recede so content reads as lit from above, not floating on an infinite plane */}
          <div
            className="absolute inset-0 hidden dark:block"
            style={{ background: `linear-gradient(to right, rgba(0,0,0,0.14), transparent 13%, transparent 87%, rgba(0,0,0,0.14))` }}
          />
          {/* Bottom-right counter-gradient on default bands — second, dimmer fill light */}
          {(bg === "default" || bg === "grid" || bg === "squares") && (
            <div
              className="absolute inset-0 hidden dark:block"
              style={{ background: "radial-gradient(65% 45% at 88% 98%, rgba(255,255,255,0.02) 0%, transparent 70%)" }}
            />
          )}

          {/* 4 ── MUTED BAND ACCENT ── */}
          {bg === "muted" && (
            <>
              {/* Emerald pool — moved slightly inward so it bleeds across the seam naturally */}
              <div
                className="absolute -top-28 right-[-6%] h-[500px] w-[660px] dark:hidden"
                style={{ background: "radial-gradient(closest-side, rgba(16,185,129,0.06), transparent 70%)" }}
              />
              <div
                className="absolute -top-28 right-[-6%] hidden h-[500px] w-[660px] dark:block"
                style={{ background: "radial-gradient(closest-side, rgba(16,185,129,0.09), transparent 70%)" }}
              />
              {/* Faint counter-shadow at bottom-left for dimensionality (dark only) */}
              <div
                className="absolute -bottom-16 left-[-6%] hidden h-[380px] w-[520px] dark:block"
                style={{ background: "radial-gradient(closest-side, rgba(255,255,255,0.016), transparent 72%)" }}
              />
            </>
          )}

      </div>

      {/* ENGRAVED SEAM — borders do the dividing (DESIGN.md §Elevation).
          A hairline rule + a 1px highlight lip reads as a tactile letterpress
          edge between bands, not a faded glow. Full-bleed, top of each band. */}
      <div aria-hidden className="pointer-events-none absolute inset-x-0 top-0 h-px bg-black/[0.05] dark:bg-white/[0.06]" />
      <div aria-hidden className="pointer-events-none absolute inset-x-0 top-px h-px bg-white/30 dark:bg-white/[0.02]" />

      {/* CONTENT */}
      <div className="relative z-10 max-w-6xl mx-auto px-5 md:px-6 py-20 md:py-28">

        {title && (
          <SectionHeader
            eyebrow={eyebrow}
            title={title}
            description={description}
            variant={headerVariant}
            animated={headerAnimated}
          />
        )}

        <div className={title ? "mt-6 md:mt-8" : undefined}>
          {children}
        </div>

        {transition && (
          <SectionTransition
            eyebrow={transitionEyebrow}
            text={transition}
            variant={transitionVariant}
          />
        )}

      </div>

    </section>
  )
}
