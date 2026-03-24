"use client"

import { FocusList } from "@/components/shared/focus-list"
import PhotoCarousel from "@/components/shared/photostack/photo-carousel"
import { SectionHeader } from "@/components/shared/section-header"
import {
  IconSparkles,
  IconLayoutGrid,
  IconShieldCheck,
  IconAdjustments,
} from "@tabler/icons-react"
import { motion } from "framer-motion"

export default function AboutSection() {
  const focus = [
    {
      icon: IconSparkles,
      text: "Exploring how AI reshapes product behavior",
    },
    {
      icon: IconLayoutGrid,
      text: "Designing systems that scale across products",
    },
    {
      icon: IconShieldCheck,
      text: "Building trust in high-stakes environments",
    },
    {
      icon: IconAdjustments,
      text: "Making better decisions under constraints",
    },
  ]

  return (
    <section className="relative overflow-hidden bg-white dark:bg-black text-foreground">

      {/* ── GRID SYSTEM */}
      <div className="pointer-events-none absolute inset-0 z-[0] overflow-hidden">

        {/* GRID (LIGHT) */}
        <div
          className="
            absolute inset-0
            will-change-transform
            animate-[gridDrift_40s_linear_infinite]
            dark:hidden
          "
          style={{
            backgroundImage: `
              linear-gradient(to right, rgba(0,0,0,0.08) 1px, transparent 1px),
              linear-gradient(to bottom, rgba(0,0,0,0.08) 1px, transparent 1px)
            `,
            backgroundSize: "32px 32px",
          }}
        />

        {/* GRID (DARK) */}
        <div
          className="
            absolute inset-0 hidden dark:block
            will-change-transform
            animate-[gridDrift_40s_linear_infinite]
          "
          style={{
            backgroundImage: `
              linear-gradient(to right, rgba(255,255,255,0.10) 1px, transparent 1px),
              linear-gradient(to bottom, rgba(255,255,255,0.10) 1px, transparent 1px)
            `,
            backgroundSize: "32px 32px",
          }}
        />

        {/* ✨ NOISE (VERY SUBTLE) */}
        <div
          className="
            absolute inset-0
            opacity-[0.02] dark:opacity-[0.04]
            mix-blend-soft-light
          "
          style={{
            backgroundImage:
              "radial-gradient(rgba(0,0,0,0.4) 1px, transparent 1px)",
            backgroundSize: "3px 3px",
          }}
        />

        {/* ✨ GLOW (BOTTOM RIGHT — REFINED) */}
        <div
          className="
            absolute inset-0
            bg-[radial-gradient(500px_250px_at_85%_80%,rgba(255,120,40,0.04),transparent_70%)]
            dark:bg-[radial-gradient(500px_250px_at_85%_80%,rgba(255,120,40,0.06),transparent_70%)]
          "
        />

        {/* ✨ EDGE FADE (SOFT + BALANCED) */}
        <div
          className="
            absolute inset-0
            bg-gradient-to-b
            from-white/60 via-transparent to-white/60
            dark:from-black/60 dark:via-transparent dark:to-black/60
          "
        />

        <div
          className="
            absolute inset-0
            bg-gradient-to-r
            from-white/60 via-transparent to-white/60
            dark:from-black/60 dark:via-transparent dark:to-black/60
          "
        />
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
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <PhotoCarousel />
          </motion.div>

          {/* RIGHT */}
          <div className="relative">

            {/* ✨ READABILITY LAYER */}
            <div className="
              absolute -inset-6 -z-10 rounded-xl
              bg-white/70 dark:bg-black/60
              backdrop-blur-md
              border border-black/[0.04] dark:border-white/[0.06]
            " />

            <div className="space-y-8">

              {/* TEXT */}
              <div className=" space-y-6 max-w-full">

                <motion.p
                  initial={{ opacity: 0, y: 10 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.4 }}
                  className="text-[18px] leading-[1.75] tracking-[-0.01em]"
                >
                  I design products by breaking down complex problems into clear, scalable systems.
                </motion.p>

                <motion.p
                  initial={{ opacity: 0, y: 10 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.4, delay: 0.05 }}
                  className="text-[18px] leading-[1.75] text-foreground/85"
                >
                  My focus is on how products behave in the real world — how users act, where friction emerges, and how small decisions compound into larger outcomes.
                </motion.p>

                <motion.p
                  initial={{ opacity: 0, y: 10 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.4, delay: 0.1 }}
                  className="text-[18px] text-foreground/55 leading-[1.7]"
                >
                  Outside of work, I spend time traveling, cooking, and going on long bike rides.
                </motion.p>

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