import { SectionSubgroup } from "@/components/shared/section-subgroup"
import { ServiceSheetCarousel } from "@/components/shared/service-sheet-carousel"
import type { ServiceCardItem } from "@/components/shared/service-card"
import { explorationItems, systemItems } from "@/lib/data"

export default function ExplorationsSection() {
  const explorationCards: ServiceCardItem[] = explorationItems.map((item, i) => ({
    id:          item.href,
    index:       String(i + 1).padStart(2, "0"),
    category:    item.status ?? "Exploration",
    title:       item.title,
    description: item.learned ?? item.description,
    image:       item.image,
    href:        item.href,
    tags:        item.tags.slice(0, 3),
  }))

  const systemCards: ServiceCardItem[] = systemItems.map((system, i) => ({
    id:          system.href,
    index:       String(explorationCards.length + i + 1).padStart(2, "0"),
    category:    system.category,
    title:       system.title,
    description: system.description,
    image:       system.image,
    href:        system.href,
    tags:        system.tags?.slice(0, 3) ?? ["Risk", "Payments", "AI UX"],
  }))

  const cards = [...explorationCards, ...systemCards]

  return (
    <SectionSubgroup variant="spacious">
      <section data-cursor-zone="exploration">
        <ServiceSheetCarousel
          items={cards}
          cardClassName="w-[84vw] max-w-[24rem] sm:w-[24rem] lg:h-[31rem]"
          itemLabel="exploration"
          controlsAlign="sectionHeader"
        />
      </section>
    </SectionSubgroup>
  )
}
