"use client"

import clsx from "clsx"
import { SectionHeader } from "./section-header"
import { SectionTransition } from "./section-transition"
import { ShaderGrid } from "./shader-grid"

type Bg = "default" | "muted" | "dark" | "grid"

interface SectionProps {
  id?: string
  bg?: Bg
  children: React.ReactNode
  eyebrow?: string
  title?: string
  description?: string
  headerVariant?: "default" | "compact" | "hero"
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
      bg-[oklch(0.98_0_0)] text-foreground
      dark:bg-[oklch(0.14_0_0)]
    `,

    muted: `
      bg-[oklch(0.965_0_0)] text-foreground
      dark:bg-[oklch(0.105_0_0)]
    `,

    // Clean `default` surface with an interactive dot-field backdrop,
    // rendered via <ShaderGrid> below when bg === "grid".
    grid: `
      bg-[oklch(0.98_0_0)] text-foreground
      dark:bg-[oklch(0.14_0_0)]
    `,

    dark: `
      bg-neutral-950 text-white
    `,
  }

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

      {/* STUDIO LIGHT — every band carries one quiet light source so large
          surfaces never read as flat digital fills. Dark mode: a soft key
          light pooling from the top edge. Light mode: a gentle grounding
          shade at the base. The receded `muted` bands additionally get a
          low warm pool — the "one warm light on the work" of the North Star,
          kept at whisper level so ember stays the voice of intent. */}
      <div aria-hidden className="pointer-events-none absolute inset-0 overflow-hidden">
        <div
          className="absolute inset-x-0 top-0 h-[440px] opacity-0 dark:opacity-100"
          style={{ background: "radial-gradient(62% 100% at 50% 0%, rgba(255,255,255,0.04) 0%, transparent 72%)" }}
        />
        <div
          className="absolute inset-x-0 bottom-0 h-[260px] dark:hidden"
          style={{ background: "linear-gradient(to top, rgba(0,0,0,0.028), transparent)" }}
        />
        {bg === "muted" && (
          <>
            <div
              className="absolute -top-44 right-[-12%] h-[560px] w-[760px] dark:hidden"
              style={{ background: "radial-gradient(closest-side, rgba(244,63,94,0.045), transparent 72%)" }}
            />
            <div
              className="absolute -top-44 right-[-12%] hidden h-[560px] w-[760px] dark:block"
              style={{ background: "radial-gradient(closest-side, rgba(244,63,94,0.065), transparent 72%)" }}
            />
          </>
        )}
      </div>

      {/* ENGRAVED SEAM — borders do the dividing (DESIGN.md §Elevation).
          A hairline rule + a 1px highlight lip reads as a tactile letterpress
          edge between bands, not a faded glow. Full-bleed, top of each band. */}
      <div aria-hidden className="pointer-events-none absolute inset-x-0 top-0 h-px bg-black/[0.07] dark:bg-white/[0.08]" />
      <div aria-hidden className="pointer-events-none absolute inset-x-0 top-px h-px bg-white/70 dark:bg-white/[0.03]" />

      {/* CONTENT */}
      <div className="relative max-w-6xl mx-auto px-5 md:px-6 py-20 md:py-28">

        {title && (
          <SectionHeader
            eyebrow={eyebrow}
            title={title}
            description={description}
            variant={headerVariant}
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