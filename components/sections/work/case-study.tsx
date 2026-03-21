"use client"

import { SectionSubgroup } from "@/components/shared/section-subgroup"
import { VerticalCard } from "@/components/shared/vertical-card"

const projects = [
  {
    category: "Commerce Platform",
    title: "Shared Commerce Platform for Multi-Brand D2C",
    description:
      "Unified three D2C brands on a shared platform while preserving brand identity.",
    image: "/assets/images/work/commerce-platform.jpg",
    href: "/work/d2c-platform",
  },
  {
    category: "Enterprise Platform",
    title: "Modular White-Label Platform for Enterprise Sales",
    description:
      "Built a configurable banking system enabling rapid demo customization for enterprise sales.",
    image: "/assets/images/work/white-label-platform.jpg",
    href: "/work/white-label-rfp",
  },
  {
    category: "Fintech Platform",
    title: "Transaction-Driven SME Credit Platform",
    description:
      "Designed a lending model using transaction data to enable faster SME credit decisions.",
    image: "/assets/images/work/sme-credit-platform.jpg",
    href: "/work/sme-credit",
  },
]

export default function WorkSection() {
  const [featured, ...rest] = projects

  return (
    <SectionSubgroup
      label="Case Studies"
      description="Fintech & commerce products solving real-world problems."
      variant="spacious"
    >
      <div className="flex flex-col gap-5">

        {/* Featured card — full width, horizontal layout on desktop */}
        <VerticalCard
          href={featured.href}
          image={featured.image}
          title={featured.title}
          description={featured.description}
          category={featured.category}
          variant="featured"
        />

        {/* Remaining 2 cards — equal 2-col grid */}
        <div className="grid md:grid-cols-2 gap-5">
          {rest.map((project) => (
            <VerticalCard
              key={project.href}
              href={project.href}
              image={project.image}
              title={project.title}
              description={project.description}
              category={project.category}
            />
          ))}
        </div>

      </div>
    </SectionSubgroup>
  )
}