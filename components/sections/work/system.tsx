"use client"

import { SectionSubgroup } from "@/components/shared/section-subgroup"
import { HorizontalCard } from "@/components/shared/horizontal-card"
import { systemItems } from "@/lib/data"

export default function SystemsSection() {
  return (
    <SectionSubgroup
      label="Systems"
      description="Scalable foundations that bring consistency, flexibility, and better decision-making to product ecosystems."
      variant="spacious"
    >
      <section data-cursor-zone="systems">
        <div className="flex flex-col gap-6">
          {systemItems.map((system, index) => (
            <HorizontalCard
              key={system.href}
              index={index}
              href={system.href}
              image={system.image}
              title={system.title}
              description={system.description}
              category={system.category}
              ctaLabel={system.ctaLabel}
            />
          ))}
        </div>
      </section>
    </SectionSubgroup>
  )
}
