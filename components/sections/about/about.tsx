"use client"

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
    <section
      id="about"
      className="relative bg-[var(--bg2)] text-foreground overflow-hidden"
    >

      {/* ambient glow */}
      <div className="
        pointer-events-none absolute inset-0
        bg-[radial-gradient(600px_300px_at_0%_0%,rgba(249,115,22,0.05),transparent_70%)]
        dark:bg-[radial-gradient(600px_300px_at_0%_0%,rgba(249,115,22,0.08),transparent_70%)]
      " />

      <div className="relative max-w-6xl mx-auto px-6 py-20 md:py-28">

        {/* HEADER */}
        <div className="mb-14 md:mb-20 max-w-2xl">
          <SectionHeader
            eyebrow="About"
            title="Who I am"
            description="A product designer focused on systems, scale, and decision-making."
          />
        </div>

        {/* CONTENT */}
        <div className="
          grid grid-cols-1
          lg:grid-cols-[380px_1fr]
          gap-14 md:gap-24
          items-start
        ">

          {/* LEFT — PHOTO */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="relative flex justify-center lg:justify-start pt-2 lg:pt-6"
          >
            <PhotoCarousel />
          </motion.div>

          {/* RIGHT */}
          <div className="space-y-12">

            {/* TEXT */}
            <div className="
              space-y-6
              text-base md:text-lg
              leading-relaxed
              text-foreground
              max-w-xl
            ">

              <p>
                I design products by breaking down complex problems into clear, scalable systems.
              </p>

              <p>
                My focus is on how products behave in the real world — how users act, where friction emerges, and how small decisions compound into larger outcomes.
              </p>

              {/* ✅ FIX: better muted contrast */}
              <p className="text-foreground/70">
                Outside of work, I spend time traveling, cooking, and going on long bike rides — these help me reset and bring fresh perspective into my work.
              </p>

            </div>

            {/* FOCUS */}
            <div>

              <p className="
                text-base md:text-lg
                font-semibold
                mb-6
                text-foreground
              ">
                Focus areas
              </p>

              <div className="
                grid sm:grid-cols-2
                gap-x-10 gap-y-6
              ">

                {focus.map((item, index) => {
                  const Icon = item.icon

                  return (
                    <motion.div
                      key={index}
                      initial={{ opacity: 0, y: 20 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      transition={{
                        duration: 0.4,
                        delay: index * 0.05,
                      }}
                      className="
                        group relative flex items-start gap-3
                        transition-all duration-300
                        md:hover:translate-x-[4px]
                      "
                    >

                      {/* hover bg */}
                      <div className="
                        absolute -inset-2 rounded-lg
                        opacity-0 group-hover:opacity-100
                        transition-opacity duration-300

                        bg-gradient-to-r 
                        from-orange-500/[0.08] 
                        to-transparent
                        dark:from-orange-400/[0.12]
                      " />

                      {/* ICON */}
                      <div className="
                        relative mt-[3px]

                        /* ✅ FIX: stronger base */
                        text-foreground/60

                        transition-all duration-300

                        /* ✅ FIX: proper accent */
                        group-hover:text-orange-600
                        dark:group-hover:text-orange-400

                        group-hover:-translate-y-[1px]

                        /* ✨ subtle glow = perceived brightness */
                        group-hover:drop-shadow-[0_0_6px_rgba(255,120,40,0.35)]
                      ">
                        <Icon size={18} />
                      </div>

                      {/* TEXT */}
                      <p className="
                        relative text-sm md:text-base
                        leading-[1.6]

                        /* ✅ FIX: readable default */
                        text-foreground/85
                      ">
                        {item.text}
                      </p>

                    </motion.div>
                  )
                })}

              </div>

            </div>

          </div>

        </div>

      </div>

    </section>
  )
}