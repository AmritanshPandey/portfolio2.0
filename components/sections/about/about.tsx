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
    { icon: IconSparkles,    text: "Exploring how AI reshapes product behavior" },
    { icon: IconLayoutGrid,  text: "Designing systems that scale across products" },
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

        {/* GRID */}
        <div
          className={clsx(
            "absolute inset-0 [background-size:32px_32px]",
            isHigh
              ? "bg-[linear-gradient(to_right,rgba(0,0,0,0.08)_1px,transparent_1px),linear-gradient(to_bottom,rgba(0,0,0,0.08)_1px,transparent_1px)] dark:bg-[linear-gradient(to_right,rgba(255,255,255,0.10)_1px,transparent_1px),linear-gradient(to_bottom,rgba(255,255,255,0.10)_1px,transparent_1px)]"
              : "bg-[linear-gradient(to_right,rgba(0,0,0,0.05)_1px,transparent_1px),linear-gradient(to_bottom,rgba(0,0,0,0.05)_1px,transparent_1px)] dark:bg-[linear-gradient(to_right,rgba(255,255,255,0.06)_1px,transparent_1px),linear-gradient(to_bottom,rgba(255,255,255,0.06)_1px,transparent_1px)]",
            isHigh && "animate-[gridDrift_40s_linear_infinite]"
          )}
        />

        {/* GLOW */}
        {isHigh && (
          <div className="absolute inset-0 bg-[radial-gradient(500px_250px_at_85%_80%,rgba(255,120,40,0.05),transparent_65%)] dark:bg-[radial-gradient(420px_220px_at_85%_80%,rgba(255,120,40,0.18),transparent_70%)]" />
        )}

        {/* EDGE FADES */}
        <div className="absolute inset-0 bg-gradient-to-b from-white/80 via-transparent to-white/80 dark:from-black/80 dark:via-transparent dark:to-black/80" />
        <div className="absolute inset-0 bg-gradient-to-r from-white/70 via-transparent to-white/70 dark:from-black/70 dark:via-transparent dark:to-black/70" />
      </div>

      {/* ── CONTENT */}
      <div className="relative z-[1] max-w-7xl mx-auto px-6 py-16 md:py-20">

        {/* HEADER */}
        <div className="max-w-2xl mb-12 md:mb-14">
          <SectionHeader
            eyebrow="About"
            title="Who I am"
            description="A product designer who operates at the intersection of strategy, systems, and execution."
          />
        </div>

        {/* LAYOUT */}
        <div className="grid grid-cols-1 lg:grid-cols-[minmax(320px,0.85fr)_minmax(0,1.35fr)] xl:grid-cols-[minmax(360px,0.8fr)_minmax(0,1.4fr)] gap-6 lg:gap-10 items-center">

          {/* LEFT — carousel */}
          <div className="flex justify-center lg:justify-start">
            <PhotoCarousel />
          </div>

          {/* RIGHT — bio */}
          <div className="space-y-8 rounded-2xl bg-white/60 dark:bg-black/50 backdrop-blur-sm border border-border/40 p-6 md:p-8">

            {/* TEXT */}
            <div className="space-y-5">
              <p className="text-[17px] leading-[1.8] tracking-[-0.01em]">
                I&apos;ve spent 8 years at the intersection of product and design — building systems that ship at Mastercard, leading a startup through a COVID pivot, pushing back on VP-level decisions and winning, and coding the React demo that Mastercard&apos;s CPO used at Money20/20.
              </p>
              <p className="text-[17px] leading-[1.8] text-foreground/80">
                I care about the problem more than the deliverable. That tends to show in the work.
              </p>
              <p className="text-[16px] text-foreground/50 leading-[1.75]">
                Outside of work, I spend time traveling, cooking, and going on long bike rides.
              </p>
            </div>

            {/* DIVIDER */}
            <div className="border-t border-border/50" />

            {/* FOCUS */}
            <FocusList focus={focus} title="Focus areas" iconSize="xl" />

          </div>
        </div>

      </div>
    </section>
  )
}
