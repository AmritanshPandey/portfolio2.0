"use client"

import { SectionSubgroup } from "@/components/shared/section-subgroup"
import { ExplorationCard } from "@/components/shared/exploration-card"

export default function ExplorationsSection() {

  const explorations = [
    {
      title: "Sneakers E-Commerce Platform",
      description:
        "Built a sneaker commerce app with discovery, drop mechanics, authentication, and cart optimization.",
      image: "/assets/images/work/sneaker-commerce.jpg",
      href: "/explorations/sneakers-commerce",
      tags: ["Web", "Design", "Development", "Next.js"],
      span: "md:col-span-3",
    },
    {
      title: "Weather-Based Skincare Planner",
      description:
        "Designed a skincare planner that adapts routines using weather, UV, AQI, and skin profile data.",
      image: "/assets/images/work/skincare-planner.jpg",
      href: "/explorations/weather-skincare",
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
      href: "/explorations/personal-execution-system",
      tags: ["Web", "Design", "Development", "Next.js"],
      span: "md:col-span-3",
    },
  ]

  return (
    <SectionSubgroup
      label="Explorations"
      description="Side projects and experimental systems exploring product, data, and decision-making"
      variant="spacious"
    >

      <div className="space-y-10 md:space-y-12">

        {/* GRID */}
        <div className="
          grid grid-cols-1 md:grid-cols-5
          gap-5 md:gap-6
          md:auto-rows-[280px]
        ">

          {explorations.map((item, index) => (

            <ExplorationCard
              key={index}
              title={item.title}
              description={item.description}
              image={item.image}
              href={item.href}
              tags={item.tags}
              span={item.span}
            />

          ))}

        </div>

      </div>

    </SectionSubgroup>
  )
}