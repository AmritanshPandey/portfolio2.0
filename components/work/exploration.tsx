"use client"

import Image from "next/image"
import Link from "next/link"

export default function ExplorationsSection() {

  const explorations = [
    {
      title: "Sneakers E-Commerce Platform",
      description:
        "Built a sneaker commerce app with discovery, drop mechanics, authentication, and cart optimization.",
      image: "/assets/images/work/sneaker-commerce.jpg",
      href: "/explorations/sneaker-commerce",
      tags: ["Web", "Design", "Development", "Next.js"],
      span: "md:col-span-3",
    },
    {
      title: "Weather-Based Skincare Planner",
      description:
        "Designed a skincare planner that adapts routines using weather, UV, AQI, and skin profile data.",
      image: "/assets/images/work/skincare-planner.jpg",
      href: "/explorations/skincare-planner",
      tags: ["Web", "Design", "Development", "Next.js"],
      span: "md:col-span-2",
    },
    {
      title: "AI Decision Engine",
      description:
        "Built an AI-assisted decision engine using weighted scoring and scenario simulation.",
      image: "/assets/images/work/ai-decision-engine.jpg",
      href: "/explorations/ai-decision-engine",
      tags: ["Web", "Design", "Development", "Next.js"],
      span: "md:col-span-2",
    },
    {
      title: "Personal Execution System",
      description:
        "Designed a system for structuring goals into measurable sprints and dependency-aware tasks.",
      image: "/assets/images/work/execution-system.jpg",
      href: "/explorations/execution-system",
      tags: ["Web", "Design", "Development", "Next.js"],
      span: "md:col-span-3",
    },
  ]

  return (
    <section id="explorations" className="bg-[var(--bg2)]">

      <div className="max-w-7xl mx-auto px-6 py-20">

        {/* Header */}

        <div className="mb-16">

          <p className="text-sm font-semibold uppercase tracking-[0.2em] text-neutral-500">
            Explorations
          </p>

          <h2 className="text-4xl md:text-5xl font-semibold mt-4 tracking-tight leading-[1.1]">
            Product Explorations
          </h2>

        </div>


        {/* Grid */}

        <div className="grid grid-cols-1 md:grid-cols-5 gap-8 md:auto-rows-[420px]">

          {explorations.map((item, index) => (

            <Link
              key={index}
              href={item.href}
              className={`group relative rounded-2xl overflow-hidden aspect-square md:aspect-auto ${item.span}`}
            >

              {/* Image */}

              <Image
                src={item.image}
                alt={item.title}
                fill
                sizes="(max-width:768px) 100vw, 60vw"
                className="object-cover transition-transform duration-500 group-hover:scale-105"
              />

              {/* Overlay */}

              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent" />

              {/* Content */}

              <div className="absolute bottom-0 p-8 md:p-10 text-white">

                <h3 className="text-xl md:text-2xl font-semibold mb-3">
                  {item.title}
                </h3>

                <p className="text-sm md:text-base text-white/85 leading-relaxed max-w-md mb-4">
                  {item.description}
                </p>

                {/* Tags */}

                <div className="flex flex-wrap gap-2">

                  {item.tags.map((tag, i) => (

                    <span
                      key={i}
                      className="text-xs px-3 py-1.5 rounded-full bg-white/10 backdrop-blur-md border border-white/20 text-white shadow-sm"
                    >
                      {tag}
                    </span>

                  ))}

                </div>

              </div>

            </Link>

          ))}

        </div>

      </div>

    </section>
  )
}