import { SectionSubgroup } from "@/components/shared/section-subgroup"
import { ArticleCard } from "@/components/shared/article-card"
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
        <div className="grid md:grid-cols-2 gap-6 md:gap-8">
          {featured.map((article) => (
            <ArticleCard
              key={article.href}
              title={article.title}
              description={article.description}
              href={article.href}
              date={article.date}
              category={article.category}
            />
          ))}
        </div>

        <div className="h-px w-full mt-12 md:mt-14 bg-gradient-to-r from-transparent via-border/70 to-transparent" />
      </section>
    </SectionSubgroup>
  )
}
