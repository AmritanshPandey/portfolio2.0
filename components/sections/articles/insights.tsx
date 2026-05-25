import { SectionSubgroup } from "@/components/shared/section-subgroup"
import { ArticleCard } from "@/components/shared/article-card"
import Link from "next/link"
import { IconArrowUpRight } from "@tabler/icons-react"
import { articleItems } from "@/lib/data"

export default function InsightsSection() {
  const featured = articleItems.filter((a) => a.featured).slice(0, 4)

  return (
    <SectionSubgroup
      label="Insights"
      description="Writing on product, systems, and decision-making."
      variant="spacious"
    >
      <section data-cursor-zone="thinking">
        <div className="space-y-12 md:space-y-14">
          <div className="grid md:grid-cols-2 gap-6 md:gap-8">
            {featured.map((article) => (
              <ArticleCard
                key={article.href}
                title={article.title}
                description={article.description}
                href={article.href}
                image={article.image}
                date={article.date}
                category={article.category}
                accent={article.accent}
              />
            ))}
          </div>

          <div className="flex justify-start">
            <Link
              href="/articles"
              className="group relative inline-flex items-center gap-2 text-sm font-medium text-foreground/70 transition-colors duration-150 hover:text-foreground"
            >
              <span className="relative">
                <span className="relative z-10">View all writing</span>
                <span className="absolute left-0 -bottom-[2px] h-[1px] w-full bg-gradient-to-r from-foreground/60 to-foreground/10 origin-left scale-x-0 transition-transform duration-200 group-hover:scale-x-100" />
              </span>
              <IconArrowUpRight size={16} className="opacity-50 transition-all duration-150 group-hover:opacity-100 group-hover:translate-x-[2px] group-hover:-translate-y-[2px]" />
            </Link>
          </div>
        </div>

        <div className="h-px w-full mt-12 md:mt-14 bg-gradient-to-r from-transparent via-border/70 to-transparent" />
      </section>
    </SectionSubgroup>
  )
}
