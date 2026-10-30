import PhotoCarousel from "@/components/shared/photo-carousel"
import { SectionHeader } from "@/components/shared/section-header"

const OFF_THE_CLOCK = [
  "Long bike rides, the longer the better",
  "Going somewhere I haven't been",
  "Cooking for people I like",
  "Collecting Hot Wheels",
  "Building Lego, piece by piece",
  "Teaching and mentoring",
]

/**
 * About, set on the same sheet as everything else: a ruled header, a captioned
 * plate on the left, the bio set large as the page's editorial voice, and the
 * off-the-clock list as numbered line items.
 */
export default function AboutSection() {
  return (
    <section
      id="about"
      className="relative scroll-mt-[var(--nav-h)] bg-background text-foreground"
      // A longer breath before the personal close than between the sections
      // above it.
      style={{ paddingTop: "calc(var(--section-y) * 1.3)" }}
    >
      <div className="ledger">
        <div aria-hidden data-settle="rule" className="rule-ink" />

        <div className="mt-5 md:mt-6">
          <SectionHeader title="Who I am" description="Curious, hands-on, and usually mid-project." />
        </div>

        <div className="ledger-grid mt-12 gap-y-14 md:mt-20">
          <div data-settle className="col-span-12 md:col-span-5 lg:col-span-4">
            <PhotoCarousel />
          </div>

          <div className="col-span-12 md:col-span-7 lg:col-span-7 lg:col-start-6">
            <div data-settle className="space-y-6 text-[clamp(1.375rem,2.1vw,2.125rem)] font-[560] leading-[1.24] tracking-[-0.022em] text-foreground [font-variation-settings:'wdth'_104]">
              <p>I take things apart to see how they work, products included.</p>
              <p className="text-muted-foreground">
                Teaching is the part I return to most, and the best test of whether I understand something.
              </p>
            </div>

            <div data-settle style={{ ["--i" as string]: 1 }} className="mt-14 md:mt-20">
              <p className="ledger-label mb-3">Off the clock</p>
              <ol className="grid border-t border-border sm:grid-cols-2 sm:gap-x-[var(--col-gap)]">
                {OFF_THE_CLOCK.map((item, i) => (
                  <li
                    key={item}
                    className="grid grid-cols-[2.25rem_minmax(0,1fr)] items-baseline border-b border-border py-3.5"
                  >
                    <span className="ledger-label">{String(i + 1).padStart(2, "0")}</span>
                    <span className="text-[15px] leading-snug md:text-base">{item}</span>
                  </li>
                ))}
              </ol>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
