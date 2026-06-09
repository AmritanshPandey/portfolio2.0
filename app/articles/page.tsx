import { articleItems } from "@/lib/data"
import { BlogGrid, CategoryPill, FeaturedArticleCard } from "@/components/articles/article-ui"

export default function ArticlesPage() {
  const featured = articleItems[0]
  const rest = articleItems.slice(1)
  const categories = Array.from(
    new Set(articleItems.map((article) => article.category).filter(Boolean))
  )

  return (
    <main className="min-h-screen bg-background">
      <section className="mx-auto max-w-6xl px-6 pb-12 pt-32 md:pb-16 md:pt-36">
        <div className="max-w-3xl">
          <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-orange-500">
            THINKING
          </p>
          <h1 className="mt-4 text-[38px] font-semibold leading-[1.08] text-foreground md:text-[58px]">
            Writing on product systems, UX decisions, and digital craft
          </h1>
          <p className="mt-6 max-w-2xl text-[16px] leading-8 text-muted-foreground md:text-[18px]">
            A collection of notes, essays, and breakdowns on designing scalable products, building systems, and making better decisions under constraints.
          </p>
        </div>

        {categories.length > 0 ? (
          <div className="mt-8 flex flex-wrap gap-2" aria-label="Article categories">
            <CategoryPill>All writing</CategoryPill>
            {categories.map((category) => (
              <CategoryPill key={category}>{category}</CategoryPill>
            ))}
          </div>
        ) : null}
      </section>

      {featured ? (
        <section className="mx-auto max-w-6xl px-6 pb-14" aria-labelledby="featured-article">
          <div className="mb-5 flex items-center gap-4">
            <div className="h-px w-6 bg-orange-500/70" />
            <h2 id="featured-article" className="text-[11px] font-semibold uppercase tracking-[0.18em] text-muted-foreground">
              Featured article
            </h2>
            <div className="h-px flex-1 bg-border/60" />
          </div>
          <FeaturedArticleCard article={featured} />
        </section>
      ) : null}

      <section className="mx-auto max-w-6xl px-6 pb-28" aria-labelledby="article-archive">
        <div className="mb-6 flex items-center gap-4">
          <div className="h-px w-6 bg-orange-500/70" />
          <h2 id="article-archive" className="text-[11px] font-semibold uppercase tracking-[0.18em] text-muted-foreground">
            Article archive
          </h2>
          <div className="h-px flex-1 bg-border/60" />
        </div>
        <BlogGrid articles={rest} />
      </section>
    </main>
  )
}
