import { SectionSubgroup } from "@/components/shared/section-subgroup"
import { explorationItems, systemItems } from "@/lib/data"
import { ExplorationProductCard, type ExplorationCardData } from "./exploration-product-card"

export default function ExplorationsSection() {
  const cards: ExplorationCardData[] = [
    ...systemItems.map((system) => ({
      href: system.href,
      eyebrow: system.category,
      title: "Fintech Interface System",
      description:
        "Reusable fintech patterns for risk states, money movement, AI guidance, disclosures, and tokens.",
      ctaLabel: system.ctaLabel,
      tags: ["Risk", "Payments", "AI UX"],
    })),
    ...explorationItems.map((item) => ({
      href: item.href,
      eyebrow: `Product Exploration${item.status ? ` / ${item.status}` : ""}`,
      title: "PlanR Execution System",
      description:
        "A live planning prototype that connects long-term goals to weekly execution, review loops, and visible progress.",
      ctaLabel: "View product",
      tags: ["Planning", "Execution", "Progress"],
    })),
  ]

  return (
    <SectionSubgroup variant="spacious">
      <section data-cursor-zone="exploration">
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          {cards.map((card) => (
            <ExplorationProductCard key={card.href} card={card} />
          ))}
        </div>
      </section>
    </SectionSubgroup>
  )
}
