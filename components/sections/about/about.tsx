"use client"

import PhotoCarousel from "@/components/shared/photostack/photo-carousel"
import { SectionHeader } from "@/components/shared/section-header"
import {
  IconSparkles,
  IconLayoutGrid,
  IconShieldCheck,
  IconAdjustments,
} from "@tabler/icons-react"

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
      className="
        relative
        bg-[var(--bg2)]
        text-foreground
      "
    >

      {/* subtle depth */}
      <div className="
        pointer-events-none absolute inset-0
        bg-gradient-to-b
        from-transparent via-foreground/[0.02] to-transparent
        dark:via-white/[0.02]
      " />

      <div className="relative max-w-6xl mx-auto px-6 py-20 md:py-28">

        {/* HEADER */}
        <div className="mb-12 md:mb-16 max-w-2xl">
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
          gap-12 md:gap-24
          items-start
        ">

          {/* LEFT — PHOTO */}
          <div className="relative flex justify-center lg:justify-start pt-2 lg:pt-6">
            <PhotoCarousel />
          </div>

          {/* RIGHT */}
          <div className="space-y-10">

            {/* TEXT */}
            <div className="
              space-y-5
              text-base md:text-lg
              leading-relaxed
              text-foreground/80
              max-w-xl
            ">

              <p>
                I design products by breaking down complex problems into clear, scalable systems.
              </p>

              <p>
                My focus is on how products behave in the real world — how users act, where friction emerges, and how small decisions compound into larger outcomes.
              </p>

              <p className="text-foreground/60">
                Outside of work, I spend time traveling, cooking, and going on long bike rides. These help me reset, stay curious, and bring fresh perspective into my work.
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
                gap-x-10 gap-y-5
              ">

                {focus.map((item, index) => {
                  const Icon = item.icon

                  return (
                    <div
                      key={index}
                      className="flex items-start gap-3 group"
                    >

                      {/* ICON */}
                      <div className="
                        mt-[3px]
                        text-muted-foreground
                        group-hover:text-orange-500
                        transition-colors duration-300
                      ">
                        <Icon size={18} />
                      </div>

                      {/* TEXT */}
                      <p className="
                        text-sm md:text-base
                        leading-[1.6]
                        text-foreground/80
                      ">
                        {item.text}
                      </p>

                    </div>
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