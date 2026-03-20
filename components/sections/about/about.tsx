"use client"

import { SectionHeader } from "@/components/shared/section-header"
import PhotoCarousel from "@/components/shared/photostack/photo-carousel"
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
      text: "Exploring how AI shapes product behavior",
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
      text: "Making decisions under constraints",
    },
  ]

  return (
    <section
      id="about"
      className="relative bg-[var(--bg2)] overflow-hidden"
    >

      {/* subtle background depth */}
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-black/[0.02] to-transparent pointer-events-none" />

      <div className="relative max-w-7xl mx-auto px-6 py-24 md:py-28">

        {/* HEADER */}
        <SectionHeader
          eyebrow="About"
          title="About Me"
          description="How I think, work, and approach building products."
        />

        {/* CONTENT */}
        <div className="
          mt-16 md:mt-20
          grid lg:grid-cols-[340px_1fr]
          gap-12 md:gap-16
          items-start
        ">

          {/* LEFT — PHOTO */}
          <div className="flex justify-center lg:justify-start">
            <div className="relative rounded-2xl overflow-hidden">
              <PhotoCarousel />
            </div>
          </div>

          {/* RIGHT — CONTENT */}
          <div className="space-y-12">

            {/* TEXT */}
            <div className="
              space-y-5
              text-neutral-600
              text-sm md:text-base
              leading-[1.7]
              max-w-[560px]
            ">

              <p className="text-neutral-900 font-medium">
                I design products by simplifying complexity into systems people can understand and use.
              </p>

              <p>
                My work focuses on real-world behavior — how users think, where friction appears, and how small decisions shape larger outcomes.
              </p>

              <p className="text-neutral-500">
                Outside of work, I spend time traveling, cooking, and cycling — helping me reset and stay curious.
              </p>

            </div>

            {/* DIVIDER */}
            <div className="h-px w-full bg-neutral-200/70" />

            {/* FOCUS */}
            <div className="space-y-6">

              <p className="text-sm md:text-base font-semibold text-neutral-900">
                What I focus on
              </p>

              <div className="grid sm:grid-cols-2 gap-x-10 gap-y-5">

                {focus.map((item, index) => {
                  const Icon = item.icon

                  return (
                    <div
                      key={index}
                      className="flex items-start gap-3 group"
                    >

                      {/* ICON */}
                      <div
                        className="
                          mt-[2px]
                          text-neutral-400
                          transition-colors duration-200
                          group-hover:text-red-600
                        "
                      >
                        <Icon size={16} />
                      </div>

                      {/* TEXT */}
                      <p className="
                        text-neutral-700
                        text-sm md:text-base
                        leading-[1.6]
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