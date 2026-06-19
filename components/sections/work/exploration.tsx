import { SectionSubgroup } from "@/components/shared/section-subgroup"
import { Reveal } from "@/components/shared/motion"
import { explorationItems, systemItems } from "@/lib/data"
import { ExplorationProductCard, type ExplorationCardData } from "./exploration-product-card"

export default function ExplorationsSection() {
  const cards: ExplorationCardData[] = [
    ...systemItems.map((system) => ({
      href:        system.href,
      eyebrow:     system.category,
      title:       "Fintech Interface System",
      description: "Reusable fintech patterns for risk states, money movement, AI guidance, disclosures, and tokens.",
      ctaLabel:    system.ctaLabel,
      tags:        ["Risk", "Payments", "AI UX"],
      image:       system.image,
    })),
    ...explorationItems.map((item) => ({
      href:        item.href,
      eyebrow:     "Product Exploration",
      title:       item.title,
      description: "A live planning prototype that connects long-term goals to weekly execution, review loops, and visible progress.",
      ctaLabel:    "View product",
      tags:        item.tags.slice(0, 3),
      image:       item.image,
      status:      item.status,
      learned:     item.learned,
    })),
  ]

  return (
    <SectionSubgroup variant="spacious">
      <section data-cursor-zone="exploration">
        <Reveal stagger={0.12} y={30} className="flex flex-col gap-5">
          {cards.map((card) => (
            <ExplorationProductCard key={card.href} card={card} />
          ))}
        </Reveal>
      </section>
    </SectionSubgroup>
  )
}
