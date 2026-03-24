"use client"

import { SectionSubgroup } from "@/components/shared/section-subgroup"
import { VerticalCard } from "@/components/shared/vertical-card"

const projects = [
  {
    category: "Commerce Infrastructure",
    title: "Shared Commerce Platform for Multi-Brand D2C",
    description:
      "Unified three D2C brands into a single platform, reducing duplication while preserving brand differentiation at scale.",
    image: "/assets/images/work/commerce-platform.jpg",
    href: "/work/d2c-platform",
  },
  {
    category: "Enterprise Systems",
    title: "Modular White-Label Platform for Enterprise Sales",
    description:
      "Enabled rapid enterprise demo customization through a modular banking system, accelerating high-stakes RFP cycles.",
    image: "/assets/images/work/white-label-platform.jpg",
    href: "/work/white-label-rfp",
  },
  {
    category: "Fintech Infrastructure",
    title: "Transaction-Driven SME Credit Platform",
    description:
      "Designed a transaction-based credit model to improve SME loan decision speed and reduce underwriting friction.",
    image: "/assets/images/work/sme-credit-platform.jpg",
    href: "/work/sme-credit",
  },
]

export default function WorkSection() {
  const [featured, ...rest] = projects

  return (
    <SectionSubgroup
      label="Selected Work"
      description="Systems built across fintech and commerce to solve real constraints at scale."
      variant="spacious"
    >
      <section data-cursor-zone="work">
        <div className="flex flex-col gap-6">

          {/* Featured */}
          <VerticalCard
            href={featured.href}
            image={featured.image}
            title={featured.title}
            description={featured.description}
            category={featured.category}
            variant="featured"
          />

          {/* Grid */}
          <div className="grid md:grid-cols-2 gap-6">
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
      </section>
    </SectionSubgroup>
  )
}