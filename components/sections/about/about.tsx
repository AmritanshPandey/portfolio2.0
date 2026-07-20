"use client"

import { useCallback, useRef, type CSSProperties } from "react"
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

export default function AboutSection() {
  const sectionRef = useRef<HTMLElement>(null)
  const rafRef = useRef(0)
  const pointerRef = useRef({ x: "50%", y: "42%" })

  const focus = [
    { icon: IconBike,    text: "Long bike rides, the longer the better" },
    { icon: IconPlane,   text: "Going somewhere I haven't been" },
    { icon: IconChefHat, text: "Cooking for people I like" },
    { icon: IconCar,     text: "Collecting Hot Wheels" },
    { icon: IconBlocks,  text: "Building Lego, piece by piece" },
    { icon: IconSchool,  text: "Teaching and mentoring" },
  ]

  const moveGridLight = useCallback((e: React.PointerEvent<HTMLElement>) => {
    if (e.pointerType === "touch") return
    const section = sectionRef.current
    if (!section) return

    const rect = section.getBoundingClientRect()
    pointerRef.current = {
      x: `${((e.clientX - rect.left) / rect.width) * 100}%`,
      y: `${((e.clientY - rect.top) / rect.height) * 100}%`,
    }

    if (rafRef.current) return
    rafRef.current = requestAnimationFrame(() => {
      rafRef.current = 0
      section.style.setProperty("--about-grid-x", pointerRef.current.x)
      section.style.setProperty("--about-grid-y", pointerRef.current.y)
      section.style.setProperty("--about-grid-alpha", "1")
    })
  }, [])

  const releaseGridLight = useCallback(() => {
    if (rafRef.current) {
      cancelAnimationFrame(rafRef.current)
      rafRef.current = 0
    }
    sectionRef.current?.style.setProperty("--about-grid-alpha", "0")
  }, [])

  return (
    <section
      ref={sectionRef}
      id="about"
      className="bg-canvas-default relative overflow-hidden text-foreground"
      onPointerMove={moveGridLight}
      onPointerLeave={releaseGridLight}
      style={{
        "--about-grid-x": "50%",
        "--about-grid-y": "42%",
        "--about-grid-alpha": "0",
      } as CSSProperties}
    >

      {/* ENGRAVED SEAM, matches the band rhythm of <Section> above. */}
      <div aria-hidden className="pointer-events-none absolute inset-x-0 top-0 z-[1] h-px bg-black/[0.05] dark:bg-white/[0.06]" />
      <div aria-hidden className="pointer-events-none absolute inset-x-0 top-px z-[1] h-px bg-white/30 dark:bg-white/[0.02]" />

      {/* ── BACKGROUND */}
      <div className="pointer-events-none absolute inset-0 z-0 overflow-hidden">
        {/* Crisp premium grid: fine 24px cells with a quiet 96px major rhythm. */}
        <div
          aria-hidden
          className="absolute inset-0 opacity-40 dark:opacity-50"
          style={{
            backgroundImage: `
              linear-gradient(to right, rgba(12,12,12,0.055) 1px, transparent 1px),
              linear-gradient(to bottom, rgba(12,12,12,0.055) 1px, transparent 1px)
            `,
            backgroundSize: "24px 24px",
            maskImage:
              "linear-gradient(to right, transparent 0%, black 10%, black 90%, transparent 100%)",
            WebkitMaskImage:
              "linear-gradient(to right, transparent 0%, black 10%, black 90%, transparent 100%)",
          }}
        />
        <div
          aria-hidden
          className="absolute inset-0 opacity-38 dark:opacity-48"
          style={{
            backgroundImage: `
              linear-gradient(to right, rgba(12,12,12,0.115) 1px, transparent 1px),
              linear-gradient(to bottom, rgba(12,12,12,0.115) 1px, transparent 1px)
            `,
            backgroundSize: "96px 96px",
            maskImage:
              "linear-gradient(to bottom, transparent 0%, black 8%, black 78%, transparent 100%)",
            WebkitMaskImage:
              "linear-gradient(to bottom, transparent 0%, black 8%, black 78%, transparent 100%)",
          }}
        />
        <div
          aria-hidden
          className="absolute inset-0 hidden dark:block opacity-50"
          style={{
            backgroundImage: `
              linear-gradient(to right, rgba(255,255,255,0.055) 1px, transparent 1px),
              linear-gradient(to bottom, rgba(255,255,255,0.055) 1px, transparent 1px)
            `,
            backgroundSize: "24px 24px",
            maskImage:
              "linear-gradient(to right, transparent 0%, black 10%, black 90%, transparent 100%)",
            WebkitMaskImage:
              "linear-gradient(to right, transparent 0%, black 10%, black 90%, transparent 100%)",
          }}
        />
        <div
          aria-hidden
          className="absolute inset-0 hidden dark:block opacity-48"
          style={{
            backgroundImage: `
              linear-gradient(to right, rgba(255,255,255,0.115) 1px, transparent 1px),
              linear-gradient(to bottom, rgba(255,255,255,0.115) 1px, transparent 1px)
            `,
            backgroundSize: "96px 96px",
            maskImage:
              "linear-gradient(to bottom, transparent 0%, black 8%, black 78%, transparent 100%)",
            WebkitMaskImage:
              "linear-gradient(to bottom, transparent 0%, black 8%, black 78%, transparent 100%)",
          }}
        />
        <div
          aria-hidden
          className="absolute inset-0 opacity-20 dark:opacity-70"
          style={{
            background:
              "radial-gradient(ellipse 78% 58% at 50% 38%, transparent 0%, transparent 54%, rgba(0,0,0,0.22) 100%)",
          }}
        />
        <div
          aria-hidden
          className="absolute inset-0 transition-opacity duration-500"
          style={{
            opacity: "var(--about-grid-alpha)",
            background:
              "radial-gradient(circle 280px at var(--about-grid-x) var(--about-grid-y), rgba(12,12,12,0.075), rgba(16,185,129,0.05) 28%, transparent 68%)",
          }}
        />
        <div
          aria-hidden
          className="absolute inset-0 hidden transition-opacity duration-500 dark:block"
          style={{
            opacity: "var(--about-grid-alpha)",
            background:
              "radial-gradient(circle 280px at var(--about-grid-x) var(--about-grid-y), rgba(255,255,255,0.105), rgba(16,185,129,0.045) 28%, transparent 68%)",
          }}
        />

        {/* GLOW, faint ambient bloom for depth behind the glass card. Ember stays
            subtle (One Voice Rule); a neutral lift adds dimension, no 2nd accent. */}
        <div className="absolute inset-0 bg-[radial-gradient(640px_340px_at_86%_88%,rgba(16,185,129,0.07),transparent_66%)] dark:bg-[radial-gradient(560px_300px_at_86%_88%,rgba(16,185,129,0.17),transparent_70%)]" />
        <div className="absolute inset-0 bg-[radial-gradient(520px_320px_at_12%_6%,rgba(0,0,0,0.04),transparent_60%)] dark:bg-[radial-gradient(560px_340px_at_12%_6%,rgba(255,255,255,0.05),transparent_62%)]" />
      </div>

      {/* ── CONTENT */}
      <div className="relative z-[1] max-w-7xl mx-auto px-6 py-16 md:py-20">

        {/* HEADER */}
        <div className="max-w-2xl mb-12 md:mb-14">
          <SectionHeader
            eyebrow="About"
            title="Who I am"
            description="Curious, hands-on, drawn to systems."
          />
        </div>

        {/* LAYOUT */}
        <div className="grid grid-cols-1 lg:grid-cols-[minmax(320px,0.85fr)_minmax(0,1.35fr)] xl:grid-cols-[minmax(360px,0.8fr)_minmax(0,1.4fr)] gap-6 lg:gap-10 items-center">

          {/* LEFT, carousel */}
          <div className="flex justify-center lg:justify-start">
            <PhotoCarousel />
          </div>

          {/* RIGHT, bio (frosted glass over the grid + glow) */}
          <div className="space-y-8 rounded-2xl p-6 md:p-8
            border border-white/55 dark:border-white/10
            bg-white/45 dark:bg-white/[0.045]
            backdrop-blur-xl backdrop-saturate-150
            ring-1 ring-inset ring-white/40 dark:ring-white/[0.05]
            shadow-[0_12px_44px_-18px_rgba(0,0,0,0.28)] dark:shadow-[0_18px_54px_-22px_rgba(0,0,0,0.7)]">

            {/* TEXT */}
            <div className="space-y-5">
              <p className="type-prose text-foreground/82">
                I like figuring out how things work. That shows up in the job, but also in the rest of life: long routes, unfamiliar cities, cooking, Lego, and small collections that reward patience.
              </p>
              <p className="type-prose text-foreground/80">
                The same values keep coming back in my design work: clarity, systems, craft, and making decisions visible enough for others to build from. Teaching is the part I return to most, mentoring designers and watching ideas click.
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
