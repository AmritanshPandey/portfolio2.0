import Link from "next/link"
import { IconArrowUpRight } from "@tabler/icons-react"
import { SectionSubgroup } from "@/components/shared/section-subgroup"
import { articleItems } from "@/lib/data"
import { InsightsList } from "./insights-list"

export default function InsightsSection() {
  const featured = articleItems.filter((a) => a.featured && !a.hidden).slice(0, 5)

  return (
    <SectionSubgroup variant="spacious">
      <section data-cursor-zone="thinking">
        <InsightsList items={featured} />

        <div className="mt-8 md:mt-10">
          <Link
            href="/articles"
            className="group inline-flex items-center gap-2 text-sm font-medium text-foreground/60 transition-colors hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent/45 rounded-sm"
          >
            Browse all essays
            <IconArrowUpRight
              size={15}
              stroke={2}
              className="transition-transform duration-300 group-hover:-translate-y-[2px] group-hover:translate-x-[2px]"
            />
          </Link>
        </div>
      </section>
    </SectionSubgroup>
  )
}
