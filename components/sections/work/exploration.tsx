import Link from "next/link"
import { SectionSubgroup } from "@/components/shared/section-subgroup"
import { explorationItems } from "@/lib/data"
import { IconArrowUpRight } from "@tabler/icons-react"

export default function ExplorationsSection() {
  return (
    <SectionSubgroup
      label="Explorations"
      description="Personal builds that start with a product question, test a system idea, and leave behind a clearer point of view."
      variant="spacious"
    >
      <section data-cursor-zone="exploration">
        <div className="grid grid-cols-1 gap-4">
          {explorationItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              data-cursor-card
              data-cursor-label="View"
              className="group/card block rounded-2xl focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-orange-500/45 focus-visible:ring-offset-2 focus-visible:ring-offset-background"
            >
              <div className="rounded-2xl border border-border/65 bg-card p-6 transition-[transform,border-color,background-color] duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] hover:-translate-y-[2px] hover:border-foreground/20 hover:bg-foreground/[0.015] dark:hover:border-white/20 dark:hover:bg-white/[0.025] md:p-8">
                <div className="grid gap-8 lg:grid-cols-[0.85fr_1.15fr]">
                  <div className="flex flex-col">
                    <p className="type-meta">
                      Product Exploration{item.status ? ` / ${item.status}` : ""}
                    </p>
                    <h3 className="mt-3 type-card-title-featured text-foreground">
                      {item.title}
                    </h3>
                    <p className="mt-4 type-card-body-featured max-w-xl text-foreground/58">
                      {item.description}
                    </p>
                    <div className="mt-5 flex flex-wrap gap-1.5">
                      {item.tags.map((tag) => (
                        <span
                          key={tag}
                          className="rounded-full border border-border/35 bg-muted/25 px-2 py-0.5 text-[10px] font-medium leading-[1.45] text-foreground/42"
                        >
                          {tag}
                        </span>
                      ))}
                    </div>
                    <div className="mt-auto flex items-center justify-between border-t border-border/45 pt-6">
                      <span className="type-cta text-foreground/50 transition-colors duration-500 group-hover/card:text-foreground/82">
                        View product
                      </span>
                      <IconArrowUpRight
                        size={15}
                        stroke={2}
                        className="text-foreground/32 transition-all duration-500 group-hover/card:text-foreground/80 group-hover/card:-translate-y-[2px] group-hover/card:translate-x-[2px]"
                      />
                    </div>
                  </div>

                  <dl className="grid gap-px overflow-hidden rounded-xl border border-border/55 bg-border/55 sm:grid-cols-2">
                    {[
                      ["Question", item.question],
                      ["Tested", item.tested],
                      ["Built", item.built],
                      ["Learned", item.learned],
                    ].map(([label, value]) => (
                      <div key={label} className="bg-card p-5">
                        <dt className="type-meta mb-2">{label}</dt>
                        <dd className="text-[13px] leading-relaxed text-foreground/60">
                          {value}
                        </dd>
                      </div>
                    ))}
                  </dl>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </section>
    </SectionSubgroup>
  )
}
