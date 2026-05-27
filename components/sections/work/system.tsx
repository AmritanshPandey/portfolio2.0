"use client"

import { SectionSubgroup } from "@/components/shared/section-subgroup"
import { VerticalCard } from "@/components/shared/vertical-card"
import { systemItems } from "@/lib/data"

export default function SystemsSection() {
  return (
    <SectionSubgroup
      label="Systems"
      description="Scalable foundations that bring consistency, flexibility, and better decision-making to product ecosystems."
      variant="spacious"
    >
      <section data-cursor-zone="systems">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {systemItems.map((system, index) => (
            <VerticalCard
              key={system.href}
              href={system.href}
              image={system.image}
              title={system.title}
              category={system.category}
              ctaLabel={system.ctaLabel}
              tags={system.tags}
              index={index}
              imageHeight="h-52"
            />
          ))}
        </div>
      </section>
    </SectionSubgroup>
  )
}
