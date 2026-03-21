"use client"

import { SectionSubgroup } from "@/components/shared/section-subgroup"
import { HorizontalCard } from "@/components/shared/horizontal-card"

const systems = [
  {
    category: "Design Infrastructure",
    title: "Multi-Brand Theming & Token System",
    description:
      "Token-driven system enabling dynamic theming, white-label customization, and scalable brand layering across shared product foundations.",
    image: "/assets/images/work/design-tokens.jpg",
    href: "/systems/theming-token-system",
  },
  {
    category: "Product System",
    title: "Fintech & AI Interface System",
    description:
      "Component system for regulated financial and intelligent products, including risk states, disclosures, and explainable UI patterns.",
    image: "/assets/images/work/fintech-ai-system.jpg",
    href: "/systems/fintech-ai-interface",
  },
]

export default function SystemsSection() {
  return (
    <SectionSubgroup
      label="Systems & Infrastructure"
      description="Enabling consistency, scalability, and better product decisions."
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