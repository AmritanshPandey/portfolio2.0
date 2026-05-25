import { SectionSubgroup } from "@/components/shared/section-subgroup"
import { VerticalCard } from "@/components/shared/vertical-card"
import { workItems } from "@/lib/data"

export default function WorkSection() {
  const flagship  = workItems
    .filter((p) => p.tier === "flagship")
    .sort((a, b) => a.order - b.order)

  const supporting = workItems
    .filter((p) => p.tier === "supporting")
    .sort((a, b) => a.order - b.order)

  const [hero, ...restFlagship] = flagship

  return (
    <SectionSubgroup
      label="Case Studies"
      description="Product explorations addressing complex business and user constraints across fintech, commerce, and early-stage startups."
      variant="spacious"
    >
      <section data-cursor-zone="work">
        <div className="flex flex-col gap-10">

          {/* ── FLAGSHIP ─────────────────────────────────────────────── */}
          <div className="flex flex-col gap-6">

            {/* First flagship — full-width hero card */}
            {hero && (
              <VerticalCard
                href={hero.href}
                image={hero.image}
                title={hero.title}
                description={hero.description}
                category={hero.category}
                metric={hero.metric}
                variant="featured"
              />
            )}

            {/* Remaining flagships — 2-col grid */}
            {restFlagship.length > 0 && (
              <div className="grid md:grid-cols-2 gap-6">
                {restFlagship.map((p) => (
                  <VerticalCard
                    key={p.href}
                    href={p.href}
                    image={p.image}
                    title={p.title}
                    description={p.description}
                    category={p.category}
                    metric={p.metric}
                  />
                ))}
              </div>
            )}
          </div>

          {/* ── SUPPORTING ───────────────────────────────────────────── */}
          {supporting.length > 0 && (
            <div className="flex flex-col gap-4">
              <p className="text-[10px] font-semibold uppercase tracking-[0.18em] text-foreground/40">
                Supporting Work
              </p>
              <div className="grid md:grid-cols-2 gap-6">
                {supporting.map((p) => (
                  <VerticalCard
                    key={p.href}
                    href={p.href}
                    image={p.image}
                    title={p.title}
                    description={p.description}
                    category={p.category}
                    metric={p.metric}
                  />
                ))}
              </div>
            </div>
          )}

        </div>
      </section>
    </SectionSubgroup>
  )
}
