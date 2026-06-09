"use client"

import clsx from "clsx"
import { SectionHeader } from "./section-header"
import { SectionTransition } from "./section-transition"

type Bg = "default" | "muted" | "dark"

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
      bg-[oklch(0.985_0_0)] text-foreground
      dark:bg-[oklch(0.14_0_0)]
    `,

    muted: `
      bg-[oklch(0.945_0_0)] text-foreground
      dark:bg-[oklch(0.105_0_0)]
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

      {/* Sections are clean neutral surfaces. Ember is reserved for intent
          (CTAs, active states) per DESIGN.md's One Voice Rule — no ambient tint. */}

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