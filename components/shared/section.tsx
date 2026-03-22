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

  // 🎯 CLEAN BASE SURFACES (no baked orange)
  const bgStyles = {
    default: `
      bg-[oklch(0.985_0_0)] text-foreground
      dark:bg-[oklch(0.14_0_0)]
    `,

    muted: `
      bg-[oklch(0.965_0.003_85)] text-foreground
      dark:bg-[oklch(0.16_0.002_260)]
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

      {/* ✨ AMBIENT LIGHT (this replaces heavy tinting) */}
      <div className="pointer-events-none absolute inset-0">

        {/* LIGHT MODE */}
        <div className="
          absolute inset-0
          bg-[radial-gradient(900px_400px_at_20%_0%,rgba(249,115,22,0.05),transparent_60%)]
          opacity-70
          dark:hidden
        " />

        {/* DARK MODE */}
        <div className="
          hidden dark:block absolute inset-0
          bg-[radial-gradient(900px_400px_at_20%_0%,rgba(249,115,22,0.08),transparent_60%)]
        " />

      </div>

      {/* CONTENT */}
      <div className="relative max-w-6xl mx-auto px-5 md:px-6 py-16 md:py-20">

        {title && (
          <SectionHeader
            eyebrow={eyebrow}
            title={title}
            description={description}
            variant={headerVariant}
          />
        )}

        <div className="mt-6 md:mt-8">
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

      {/* 🔥 PREMIUM SEPARATOR (soft, not harsh) */}
      <div className="
        absolute bottom-0 left-0 w-full h-px
        bg-gradient-to-r
        from-transparent via-foreground/10 to-transparent
        dark:via-white/10
      " />

    </section>
  )
}