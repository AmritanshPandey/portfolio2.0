"use client"

import { IconArrowRight } from "@tabler/icons-react"
import Image from "next/image"
import Link from "next/link"

export default function SystemsSection() {

  const systems = [
    {
      category: "Design Infrastructure",
      title: "Multi-Brand Theming & Token System",
      description:
        "Token-driven design system enabling dynamic theming, white-label customization, and scalable brand layering across shared product foundations.",
      image: "/assets/images/work/design-tokens.jpg",
      href: "/systems/theming-token-system",
    },
    {
      category: "Product System",
      title: "Fintech & AI Interface System",
      description:
        "Component library for regulated financial and intelligent products including risk states, disclosures, confidence indicators, and explainable UI patterns.",
      image: "/assets/images/work/fintech-ai-system.jpg",
      href: "/systems/fintech-ai-interface",
    },
  ]

  return (
    <section id="systems" className="bg-[var(--bg1)]">

      <div className="max-w-7xl mx-auto px-6 py-20">

        {/* Header */}

             <div className="mb-16 w-full">

          <p className="text-sm font-semibold uppercase tracking-[0.2em] text-neutral-500">
            Systems
          </p>

          <h2 className="text-4xl md:text-5xl font-semibold mt-4 tracking-tight leading-[1.1]">
            Product Infrastructure & Systems
          </h2>

        </div>


        {/* Grid */}

        <div className="grid md:grid-cols-2 gap-10">

          {systems.map((system, index) => (

            <Link href={system.href} key={index}>

              <div className="group bg-white border border-neutral-200 rounded-2xl overflow-hidden transition-all duration-300 hover:-translate-y-1 hover:shadow-lg cursor-pointer">

                {/* Image */}

                <div className="relative h-60 w-full overflow-hidden">

                  <Image
                    src={system.image}
                    alt={system.title}
                    fill
                    sizes="(max-width:768px) 100vw, 50vw"
                    className="object-cover transition-transform duration-500 group-hover:scale-105"
                  />

                </div>


                {/* Content */}

                <div className="p-8">

                  <p className="text-xs font-semibold uppercase tracking-[0.18em] text-neutral-500 mb-3">
                    {system.category}
                  </p>

                  <h3 className="text-2xl font-semibold leading-snug mb-4">
                    {system.title}
                  </h3>

                  <p className="text-neutral-600 leading-relaxed mb-6">
                    {system.description}
                  </p>

                  <div className="flex items-center gap-2 text-red-600 font-medium transition-all group-hover:gap-3">
                    Explore more
                    <IconArrowRight
                      size={18}
                      className="transition-transform group-hover:translate-x-1"
                    />
                  </div>

                </div>

              </div>

            </Link>

          ))}

        </div>

      </div>

    </section>
  )
}