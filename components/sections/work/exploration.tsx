import clsx from "clsx"
import { SectionSubgroup } from "@/components/shared/section-subgroup"
import { ExplorationCard } from "@/components/shared/exploration-card"
import { explorationItems } from "@/lib/data"

export default function ExplorationsSection() {
  return (
    <SectionSubgroup
      label="Side Projects"
      description="Personal experiments built outside of work to test ideas around systems, behavior, and decision-making."
      variant="spacious"
    >
      <section data-cursor-zone="exploration">
        <div className="grid grid-cols-1 md:grid-cols-5 gap-5 md:gap-6 md:auto-rows-[280px]">
          {explorationItems.map((item, index) => (
            <div key={index} className={clsx(item.span, "aspect-square md:aspect-auto")}>
              <ExplorationCard
                title={item.title}
                description={item.description}
                image={item.image}
                href={item.href}
                tags={item.tags}
              />
            </div>
          ))}
        </div>
      </section>
    </SectionSubgroup>
  )
}
