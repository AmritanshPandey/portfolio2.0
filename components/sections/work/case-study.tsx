"use client"

import { SectionSubgroup } from "@/components/shared/section-subgroup"
import { VerticalCard } from "@/components/shared/vertical-card"

const projects = [
  {
    category: "AI Commerce",
    title: "Agent-Driven Commerce Platform",
    description:
      "Conceptualized an agent-driven commerce system to explore adaptive decision-making across pricing, discovery, and fulfillment, driven by real-time signals and user behavior.",
    image: "/assets/images/work/agent-commerce.jpg",
    href: "/work/agent-commerce",
  },
  {
    category: "Enterprise Systems",
    title: "Modular White-Label Platform for Enterprise RFPs",
    description:
      "Designed a configurable platform inspired by enterprise RFP workflows, enabling rapid demo customization and scalable configurations in high-stakes sales environments.",
    image: "/assets/images/work/white-label-platform.jpg",
    href: "/work/white-label-rfp",
  },
  {
    category: "Commerce Infrastructure",
    title: "Shared Commerce Platform for Multi-Brand D2C",
    description:
      "Modeled a shared commerce system based on multi-brand D2C operations, reducing duplication while preserving brand differentiation at scale.",
    image: "/assets/images/work/commerce-platform.jpg",
    href: "/work/d2c-platform",
  }
]

export default function WorkSection() {
  const [featured, ...rest] = projects

  return (
    <SectionSubgroup
      label="Case Studies"
      description="Product explorations addressing complex business and user constraints across fintech and commerce."
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