"use client"

import { SectionSubgroup } from "@/components/shared/section-subgroup"
import { HorizontalCard } from "@/components/shared/horizontal-card"

const systems = [
  {
    category: "Design System",
    title: "Multi-Brand Theming & Token System",
    description:
      "Defined a token architecture to support white-label theming, enabling multiple brands to scale on a shared product foundation without duplication.",
    image: "/assets/images/work/design-tokens.jpg",
    href: "/systems/theming-token-system",
  },
  {
    category: "Product System",
    title: "Fintech & AI Interface System",
    description:
      "Built interface patterns for regulated and AI-driven products, addressing risk states, disclosures, and explainability under real constraints.",
    image: "/assets/images/work/fintech-ai-system.jpg",
    href: "/systems/fintech-ai-interface",
  },
]

export default function SystemsSection() {
  return (
    <SectionSubgroup
      label="Systems"
      description="Foundational systems that enable scale, consistency, and better decision-making."
      variant="spacious"
    >
      <div className="flex flex-col gap-6">
        {systems.map((system, index) => (
          <HorizontalCard
            key={system.href}
            index={index}
            href={system.href}
            image={system.image}
            title={system.title}
            description={system.description}
            category={system.category}
            ctaLabel="Explore system"
          />
        ))}
      </div>
    </SectionSubgroup>
  )
}