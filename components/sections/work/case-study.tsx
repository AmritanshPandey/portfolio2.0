import { SectionSubgroup } from "@/components/shared/section-subgroup"
import { VerticalCard } from "@/components/shared/vertical-card"
import { workItems } from "@/lib/data"

export default function WorkSection() {
  // Order is controlled by SEQUENCE in lib/data/work.ts.
  // First 2 render large, remaining render small.
  const sorted = [...workItems].sort((a, b) => a.order - b.order)
  const large  = sorted.slice(0, 2)
  const small  = sorted.slice(2)

  return (
    <SectionSubgroup
      label="Case Studies"
      description="Product explorations addressing complex business and user constraints across fintech, commerce, and early-stage startups."
      variant="spacious"
    >
      <section data-cursor-zone="work">
        <div className="flex flex-col gap-4">

          {/* ── LARGE CARDS — top 2 ─────────────────────────────────── */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {large.map((p) => (
              <VerticalCard
                key={p.href}
                href={p.href}
                image={p.image}
                title={p.title}
                category={p.category}
                metric={p.metric}
                index={p.order}
                imageHeight="h-56"
              />
            ))}
          </div>

          {/* ── SMALL CARDS — remaining ──────────────────────────────── */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {small.map((p) => (
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
