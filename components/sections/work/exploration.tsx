import Link from "next/link"
import { SectionSubgroup } from "@/components/shared/section-subgroup"
import { explorationItems, systemItems } from "@/lib/data"
import { IconArrowUpRight } from "@tabler/icons-react"

export default function ExplorationsSection() {
  const cards = [
    ...systemItems.map((system) => ({
      href: system.href,
      eyebrow: system.category,
      title: "Fintech Interface System",
      description:
        "Reusable fintech patterns for risk states, money movement, AI guidance, disclosures, and tokens.",
      ctaLabel: system.ctaLabel,
      tags: ["Risk", "Payments", "AI UX"],
    })),
    ...explorationItems.map((item) => ({
      href: item.href,
      eyebrow: `Product Exploration${item.status ? ` / ${item.status}` : ""}`,
      title: "PlanR Execution System",
      description:
        "A live planning prototype that connects long-term goals to weekly execution, review loops, and visible progress.",
      ctaLabel: "View product",
      tags: ["Planning", "Execution", "Progress"],
    })),
  ]

  return (
    <SectionSubgroup variant="spacious">
      <section data-cursor-zone="exploration">
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          {cards.map((card) => (
            <Link
              key={card.href}
              href={card.href}
              data-cursor-card
              data-cursor-label="View"
              className="group/card block rounded-2xl focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent/45 focus-visible:ring-offset-2 focus-visible:ring-offset-background"
            >
              <div className="flex h-full min-h-[260px] flex-col rounded-2xl border border-border/65 bg-card p-6 transition-[transform,border-color,background-color] duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] hover:-translate-y-[2px] hover:border-foreground/20 hover:bg-foreground/[0.015] dark:hover:border-white/20 dark:hover:bg-white/[0.025] md:p-7">
                <p className="type-meta">{card.eyebrow}</p>

                <h3 className="mt-3 type-card-title text-foreground">
                  {card.title}
                </h3>

                <p className="mt-4 type-card-body text-foreground/58">
                  {card.description}
                </p>

                <div className="mt-5 flex flex-wrap gap-1.5">
                  {card.tags.map((tag) => (
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
                    {card.ctaLabel}
                  </span>
                  <IconArrowUpRight
                    size={15}
                    stroke={2}
                    className="text-foreground/32 transition-all duration-500 group-hover/card:text-foreground/80 group-hover/card:-translate-y-[2px] group-hover/card:translate-x-[2px]"
                  />
                </div>
              </div>
            </Link>
          ))}
        </div>
      </section>
    </SectionSubgroup>
  )
}
