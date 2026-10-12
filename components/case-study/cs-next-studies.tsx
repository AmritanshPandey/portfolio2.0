import Link from "next/link"
import { IconArrowRight, IconArrowUpRight } from "@tabler/icons-react"
import { workItems } from "@/lib/data"

/** Keep reading: the other case studies as ruled line items. */
export function CsNextStudies({ currentHref }: { currentHref: string }) {
  const nextStudies = [...workItems]
    .sort((a, b) => a.order - b.order)
    .filter((item) => item.href !== currentHref)
    .slice(0, 3)

  if (nextStudies.length === 0) return null

  return (
    <section className="relative bg-background text-foreground" style={{ paddingTop: "var(--section-y)" }}>
      <div className="ledger">
        <div aria-hidden data-settle="rule" className="rule-ink" />
        <div className="mt-5 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between md:mt-6">
          <div>
            <p className="ledger-label mb-3">Keep reading</p>
            <h2 className="type-section-title text-foreground">More case studies</h2>
          </div>
          <Link href="/#work" className="group inline-flex min-h-11 items-center gap-2 text-[15px] font-semibold link-underline">
            All case studies
            <IconArrowRight size={15} stroke={2} aria-hidden className="transition-transform duration-300 group-hover:translate-x-0.5" />
          </Link>
        </div>

        <div className="work-index mt-12 md:mt-16">
          {nextStudies.map((item, i) => (
            <Link
              key={item.href}
              href={item.href}
              data-settle
              style={{ ["--i" as string]: i }}
              className="work-row group ledger-grid items-baseline gap-y-2 border-t border-border py-6 last:border-b md:py-8"
            >
              <p className="ledger-label col-span-12 md:col-span-3">
                <span className="mr-4 text-foreground transition-colors duration-300 group-hover:text-accent">
                  {String(i + 1).padStart(2, "0")}
                </span>
                {item.category}
              </p>
              <h3 className="col-span-11 text-[clamp(1.375rem,2.4vw,2.25rem)] font-[760] leading-[1.04] tracking-[-0.03em] [font-variation-settings:'wdth'_106] md:col-span-6 text-balance">
                {item.title}
              </h3>
              <IconArrowUpRight
                size={20}
                stroke={1.75}
                aria-hidden
                className="col-span-1 justify-self-end transition-transform duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:translate-x-1 group-hover:-translate-y-1 md:col-start-12 md:row-start-1"
              />
              {item.metric && (
                <p className="col-span-12 text-[15px] text-muted-foreground md:col-span-6 md:col-start-4">{item.metric}</p>
              )}
            </Link>
          ))}
        </div>
      </div>
    </section>
  )
}
