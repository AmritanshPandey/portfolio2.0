"use client"

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
      text: "Exploring how AI changes product behavior",
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
    <section id="about" className="bg-[var(--bg2)] relative">

      {/* subtle background depth */}
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-black/[0.015] to-transparent pointer-events-none" />

      <div className="max-w-7xl mx-auto px-6 py-20 md:py-28 relative">

        {/* HEADER */}

        <div className="mb-12 md:mb-16">
          <p className="text-[12px] font-semibold uppercase tracking-[0.2em] text-neutral-400">
            About
          </p>

          <h2 className="text-3xl md:text-5xl font-semibold mt-3 tracking-tight leading-[1.1]">
            About me
          </h2>
        </div>

        {/* CONTENT */}

        <div className="grid grid-cols-1 lg:grid-cols-[380px_1fr] gap-12 md:gap-28 items-start">

          {/* LEFT — PHOTO */}

          <div className="relative flex justify-center lg:justify-start pt-2 lg:pt-6">
            <PhotoCarousel />
          </div>

          {/* RIGHT — CONTENT */}

          <div className="space-y-10">

            {/* TEXT */}

            <div className="space-y-5 text-neutral-700 text-base md:text-lg leading-relaxed max-w-xl">

              <p>
                I'm a product designer who enjoys breaking down complex problems and turning them into clear, usable systems.
              </p>

              <p>
                I care about how things actually work in the real world, how users behave, where friction shows up, and how small design decisions influence larger outcomes.
              </p>

              <p className="text-neutral-600">
                Outside of work, I spend time traveling, cooking, and going on long bike rides. These help me reset, stay curious, and bring fresh perspective into my work.
              </p>

            </div>

            {/* FOCUS */}

            <div>

              <p className="text-base md:text-lg font-semibold mb-6">
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
                      <div className="mt-[3px] text-neutral-400 group-hover:text-red-600 transition-colors duration-300">
                        <Icon size={18} />
                      </div>

                      {/* TEXT */}
                      <p className="text-neutral-700 leading-[1.6] text-sm md:text-base">
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