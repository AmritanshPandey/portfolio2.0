"use client"

import { FocusList } from "@/components/shared/focus-list"
import PhotoCarousel from "@/components/shared/photo-carousel"
import { SectionHeader } from "@/components/shared/section-header"
import {
  IconSparkles,
  IconLayoutGrid,
  IconShieldCheck,
  IconAdjustments,
} from "@tabler/icons-react"
import clsx from "clsx"
import { usePerformanceMode } from "@/hooks/use-performance-mode"

export default function AboutSection() {
  const { isHigh } = usePerformanceMode()

  const focus = [
    { icon: IconSparkles, text: "Exploring how AI reshapes product behavior" },
    { icon: IconLayoutGrid, text: "Designing systems that scale across products" },
    { icon: IconShieldCheck, text: "Building trust in high-stakes environments" },
    { icon: IconAdjustments, text: "Making better decisions under constraints" },
  ]

  return (
    <section
      id="about"
      className="relative overflow-hidden bg-white dark:bg-black text-foreground"
    >

      {/* ── BACKGROUND */}
      <div className="pointer-events-none absolute inset-0 z-[0] overflow-hidden">

        {/* GRID (FIXED) */}
        <div
          className={clsx(
            "absolute inset-0 [background-size:32px_32px]",

            isHigh
              ? "bg-[linear-gradient(to_right,rgba(0,0,0,0.08)_1px,transparent_1px),linear-gradient(to_bottom,rgba(0,0,0,0.08)_1px,transparent_1px)] dark:bg-[linear-gradient(to_right,rgba(255,255,255,0.10)_1px,transparent_1px),linear-gradient(to_bottom,rgba(255,255,255,0.10)_1px,transparent_1px)]"
              : "bg-[linear-gradient(to_right,rgba(0,0,0,0.05)_1px,transparent_1px),linear-gradient(to_bottom,rgba(0,0,0,0.05)_1px,transparent_1px)] dark:bg-[linear-gradient(to_right,rgba(255,255,255,0.06)_1px,transparent_1px),linear-gradient(to_bottom,rgba(255,255,255,0.06)_1px,transparent_1px)]",

            isHigh && "animate-[gridDrift_40s_linear_infinite]"
          )}
        />

        {/* NOISE */}
        {isHigh && (
          <div
            className="
              absolute inset-0
              opacity-[0.015] dark:opacity-[0.025]
              mix-blend-soft-light
            "
            style={{
              backgroundImage:
                "radial-gradient(rgba(0,0,0,0.4) 1px, transparent 1px)",
              backgroundSize: "3px 3px",
            }}
          />
        )}

        {/* GLOW */}
        {isHigh && (
          <div
            className="
              absolute inset-0
              bg-[radial-gradient(500px_250px_at_85%_80%,rgba(255,120,40,0.05),transparent_65%)]
              dark:bg-[radial-gradient(420px_220px_at_85%_80%,rgba(255,120,40,0.18),transparent_70%)]
            "
          />
        )}

        {/* EDGE FADE */}
        <div className="
          absolute inset-0
          bg-gradient-to-b
          from-white/80 via-transparent to-white/80
          dark:from-black/80 dark:via-transparent dark:to-black/80
        " />

        <div className="
          absolute inset-0
          bg-gradient-to-r
          from-white/70 via-transparent to-white/70
          dark:from-black/70 dark:via-transparent dark:to-black/70
        " />
      </div>

      {/* ── CONTENT */}
      <div className="relative z-[1] max-w-6xl mx-auto px-6 py-16 md:py-20">

        {/* HEADER */}
        <div className="max-w-2xl mb-12 md:mb-16">
          <SectionHeader
            eyebrow="About"
            title="Who I am"
            description="A product designer focused on systems, scale, and decision-making."
          />
        </div>

        {/* LAYOUT */}
        <div className="
          grid grid-cols-1
          lg:grid-cols-[420px_1fr]
          gap-16 md:gap-28
          items-center
        ">

          {/* LEFT */}
          <div className={clsx(!isHigh && "transform-none")}>
            <PhotoCarousel />
          </div>

          {/* RIGHT */}
          <div className="relative">

            {/* READABILITY LAYER */}
            <div
              className={clsx(
                "absolute -inset-6 -z-10 rounded-xl border",
                isHigh
                  ? "bg-white/70 dark:bg-black/60 backdrop-blur-md border-black/[0.04] dark:border-white/[0.06]"
                  : "bg-white/85 dark:bg-black/80 border-black/[0.04] dark:border-white/[0.06]"
              )}
            />

            <div className="space-y-8">

              {/* TEXT */}
              <div className="space-y-6 max-w-full">

                <p className="animate-fade-up text-[18px] leading-[1.75] tracking-[-0.01em]">
                  I design products by breaking down complex problems into clear, scalable systems.
                </p>

                <p className="animate-fade-up text-[18px] leading-[1.75] text-foreground/85">
                  My focus is on how products behave in the real world — how users act, where friction emerges, and how small decisions compound into larger outcomes.
                </p>

                <p className="animate-fade-up text-[18px] text-foreground/55 leading-[1.7]">
                  Outside of work, I spend time traveling, cooking, and going on long bike rides.
                </p>

              </div>

              {/* FOCUS */}
              <FocusList focus={focus} title="Focus areas" />

            </div>

          </div>

        </div>

      </div>
    </section>
  )
}