import { SectionSubgroup } from "@/components/shared/section-subgroup"
import { HorizontalCard } from "@/components/shared/horizontal-card"
import { VerticalCard } from "@/components/shared/vertical-card"
import { workItems } from "@/lib/data"

export default function WorkSection() {
  // Order is controlled by SEQUENCE in lib/data/work.ts.
  // The first item is the flagship (full-width feature); the rest form the grid.
  const sorted = [...workItems].sort((a, b) => a.order - b.order)
  const [flagship, ...rest] = sorted

  return (
    <SectionSubgroup
      label="Case Studies"
      description="Product explorations addressing complex business and user constraints across fintech, commerce, and early-stage startups."
      variant="spacious"
    >
      <section data-cursor-zone="work">
        <div className="flex flex-col gap-4">

          {/* ── FLAGSHIP — single full-width feature ─────────────────── */}
          {flagship && (
            <HorizontalCard
              href={flagship.href}
              image={flagship.image}
              title={flagship.title}
              description={flagship.description}
              category={flagship.category}
              ctaLabel="Read case study"
              index={0}
            />
          )}

          {/* ── SUPPORTING — grid of the rest ────────────────────────── */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {rest.map((p) => (
              <VerticalCard
                key={p.href}
                href={p.href}
                image={p.image}
                title={p.title}
                category={p.category}
                metric={p.metric}
                index={p.order}
                imageHeight="h-36"
              />
            ))}
          </div>

        </div>
      </section>
    </SectionSubgroup>
  )
}
