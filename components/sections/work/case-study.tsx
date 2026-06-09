import { SectionSubgroup } from "@/components/shared/section-subgroup"
import { VerticalCard } from "@/components/shared/vertical-card"
import { workItems } from "@/lib/data"

export default function WorkSection() {
  // Order is controlled by SEQUENCE in lib/data/work.ts.
  // Top 2 render large (first row); the other 3 render smaller (second row).
  const sorted = [...workItems].sort((a, b) => a.order - b.order)
  const large  = sorted.slice(0, 2)
  const small  = sorted.slice(2)

  return (
    <SectionSubgroup
      variant="spacious"
    >
      <section data-cursor-zone="work">
        <div className="flex flex-col gap-5 md:gap-6">

          {/* First row: top 2 large cards */}
          <div className="grid grid-cols-1 gap-5 md:grid-cols-2 md:gap-6">
            {large.map((p) => (
              <VerticalCard
                key={p.href}
                href={p.href}
                image={p.image}
                title={p.title}
                category={p.metadata ?? p.category}
                description={p.description}
                tags={p.tags}
                ctaLabel="View case study"
                index={p.order}
                variant="featured"
                showImage={false}
                imageHeight="h-56"
                thinkingBlock={p.thinkingBlock}
              />
            ))}
          </div>

          {/* Second row: supporting cards */}
          <div className="grid grid-cols-1 gap-5 md:grid-cols-2 md:gap-6 lg:grid-cols-3">
            {small.map((p) => (
              <VerticalCard
                key={p.href}
                href={p.href}
                image={p.image}
                title={p.title}
                category={p.metadata ?? p.category}
                description={p.metric}
                tags={undefined}
                ctaLabel="View case study"
                index={p.order}
                showImage={false}
                imageHeight="h-36"
                proofRow={p.proofRow}
              />
            ))}
          </div>

        </div>
      </section>
    </SectionSubgroup>
  )
}
