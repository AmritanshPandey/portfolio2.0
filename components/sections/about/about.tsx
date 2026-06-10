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

export default function AboutSection() {
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
      className="relative overflow-hidden bg-white text-foreground dark:bg-black"
    >

      {/* ENGRAVED SEAM, matches the band rhythm of <Section> above. */}
      <div aria-hidden className="pointer-events-none absolute inset-x-0 top-0 z-[1] h-px bg-black/[0.07] dark:bg-white/[0.08]" />
      <div aria-hidden className="pointer-events-none absolute inset-x-0 top-px z-[1] h-px bg-white/70 dark:bg-white/[0.03]" />

      {/* ── CONTENT */}
      <div className="relative z-[1] max-w-7xl mx-auto px-6 py-16 md:py-20">

        {/* HEADER */}
        <div className="max-w-2xl mb-12 md:mb-14">
          <SectionHeader
            eyebrow="About"
            title="Who I am"
            description="The person behind the work: curious, hands-on, and drawn to systems that reveal how people make decisions."
          />
        </div>

        {/* LAYOUT */}
        <div className="grid grid-cols-1 lg:grid-cols-[minmax(320px,0.85fr)_minmax(0,1.35fr)] xl:grid-cols-[minmax(360px,0.8fr)_minmax(0,1.4fr)] gap-6 lg:gap-10 items-center">

          {/* LEFT, carousel */}
          <div className="flex justify-center lg:justify-start">
            <PhotoCarousel />
          </div>

          {/* RIGHT, bio */}
          <div className="space-y-8 rounded-2xl border border-border bg-card p-6 md:p-8">

            {/* TEXT */}
            <div className="space-y-5">
              <p className="type-prose text-foreground/82">
                I like figuring out how things work. That shows up in the job, but also in the rest of my life: long routes, unfamiliar cities, cooking, Lego, and small collections that reward patience.
              </p>
              <p className="type-prose text-foreground/80">
                The same values keep coming back in my design work: clarity, systems, learning, craft, and making decisions visible enough for other people to build from.
              </p>
              <p className="type-prose text-foreground/80">
                Teaching is the part I return to most. Mentoring designers, helping someone get unstuck, and watching an idea click still feels closely connected to the work itself.
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
