"use client"

import { FocusList } from "@/components/shared/focus-list"
import PhotoCarousel from "@/components/shared/photo-carousel"
import { SectionHeader } from "@/components/shared/section-header"
import {
  IconBike,
  IconPlane,
  IconChefHat,
  IconCar,
  IconBlocks,
  IconSchool,
} from "@tabler/icons-react"
import clsx from "clsx"
import { usePerformanceMode } from "@/hooks/use-performance-mode"

export default function AboutSection() {
  const { isHigh } = usePerformanceMode()

  const focus = [
    { icon: IconBike,    text: "Long bike rides, the longer the better" },
    { icon: IconPlane,   text: "Going somewhere I haven't been" },
    { icon: IconChefHat, text: "Cooking for people I like" },
    { icon: IconCar,     text: "Collecting Hot Wheels" },
    { icon: IconBlocks,  text: "Building Lego, piece by piece" },
    { icon: IconSchool,  text: "Teaching and mentoring" },
  ]

  return (
    <section
      id="about"
      className="relative overflow-hidden bg-white dark:bg-black text-foreground"
    >

      {/* ENGRAVED SEAM — matches the band rhythm of <Section> above. */}
      <div aria-hidden className="pointer-events-none absolute inset-x-0 top-0 z-[1] h-px bg-black/[0.07] dark:bg-white/[0.08]" />
      <div aria-hidden className="pointer-events-none absolute inset-x-0 top-px z-[1] h-px bg-white/70 dark:bg-white/[0.03]" />

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

        {/* GLOW — subtle ambient bloom for depth. Ember stays faint (One Voice
            Rule); a neutral lift adds dimension without a second accent hue. */}
        <div className="pointer-events-none absolute inset-0">
          {/* warm bloom, lower-right — sits behind the glass card */}
          <div className="absolute inset-0 bg-[radial-gradient(640px_340px_at_86%_88%,rgba(249,115,22,0.07),transparent_66%)] dark:bg-[radial-gradient(560px_300px_at_86%_88%,rgba(249,115,22,0.17),transparent_70%)]" />
          {/* neutral lift, upper-left */}
          <div className="absolute inset-0 bg-[radial-gradient(520px_320px_at_12%_6%,rgba(0,0,0,0.04),transparent_60%)] dark:bg-[radial-gradient(560px_340px_at_12%_6%,rgba(255,255,255,0.05),transparent_62%)]" />
        </div>
        {/* on capable devices, a touch more warmth */}
        {isHigh && (
          <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(440px_240px_at_82%_78%,rgba(255,140,60,0.05),transparent_72%)] dark:bg-[radial-gradient(440px_240px_at_82%_78%,rgba(255,140,60,0.10),transparent_72%)]" />
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
            description="The work has its own pages. This one is the person behind it."
          />
        </div>

        {/* LAYOUT */}
        <div className="grid grid-cols-1 lg:grid-cols-[minmax(320px,0.85fr)_minmax(0,1.35fr)] xl:grid-cols-[minmax(360px,0.8fr)_minmax(0,1.4fr)] gap-6 lg:gap-10 items-center">

          {/* LEFT — carousel */}
          <div className="flex justify-center lg:justify-start">
            <PhotoCarousel />
          </div>

          {/* RIGHT — bio (frosted glass over the grid + glow) */}
          <div className="space-y-8 rounded-2xl p-6 md:p-8
            border border-white/55 dark:border-white/10
            bg-white/45 dark:bg-white/[0.045]
            backdrop-blur-xl backdrop-saturate-150
            ring-1 ring-inset ring-white/40 dark:ring-white/[0.05]
            shadow-[0_12px_44px_-18px_rgba(0,0,0,0.28)] dark:shadow-[0_18px_54px_-22px_rgba(0,0,0,0.7)]">

            {/* TEXT */}
            <div className="space-y-5">
              <p className="type-prose text-foreground/82">
                I&apos;m curious by default. New cities, long routes, unfamiliar food, and small systems all pull me in for the same reason: I like figuring out how things work.
              </p>
              <p className="type-prose text-foreground/80">
                Off the clock, I&apos;m usually riding somewhere, cooking for people I like, collecting Hot Wheels, or building Lego. Precise, hands-on things help me reset.
              </p>
              <p className="type-prose text-foreground/80">
                Teaching matters most. Mentoring people, helping someone get unstuck, and watching an idea click is work I never get tired of.
              </p>
              <p className="type-section-intro text-foreground/50">
                Quietly happiest with a full day outside, a long route ahead, and nowhere I need to be.
              </p>
            </div>

            {/* DIVIDER */}
            <div className="border-t border-border/50" />

            {/* FOCUS */}
            <FocusList focus={focus} title="Off the clock" iconSize="xl" />

          </div>
        </div>

      </div>
    </section>
  )
}
