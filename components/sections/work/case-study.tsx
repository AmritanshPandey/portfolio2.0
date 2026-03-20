"use client"

import { SectionSubgroup } from "@/components/shared/section-subgroup"
import { VerticalCard } from "@/components/shared/vertical-card"

export default function WorkSection() {

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

  return (
    <SectionSubgroup
      label="Case Studies"
      description="Fintech & commerce products solving real-world problems."
      variant="spacious"
    >

      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">

        {projects.map((project, index) => (
          <div
            key={index}
          >
            <VerticalCard
              href={project.href}
              image={project.image}
              title={project.title}
              description={project.description}
              category={project.category}
            />
          </div>
        ))}

      </div>

    </SectionSubgroup>
  )
}