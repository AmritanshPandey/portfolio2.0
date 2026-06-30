import Link from "next/link"
import { IconArrowUpRight, IconCalendar, IconClock } from "@tabler/icons-react"
import type { ArticleItem } from "@/lib/types/content"
import { cn } from "@/lib/utils"
import { articleItems } from "@/lib/data"
import { ArticleCard as RelatedArticleCard } from "@/components/shared/article-card"
import { Reveal, TextReveal } from "@/components/shared/motion"

export function CategoryPill({
  children,
  className,
}: {
  children: React.ReactNode
  className?: string
}) {
  return (
    <span
      className={cn(
        "inline-flex h-7 items-center rounded-full border border-border/60 bg-foreground/[0.03] px-3 text-[11px] font-semibold uppercase tracking-[0.16em] text-muted-foreground",
        className
      )}
    >
      {children}
    </span>
  )
}

export function ReadingMeta({
  date,
  readTime,
  className,
}: {
  date?: string
  readTime?: string
  className?: string
}) {
  if (!date && !readTime) return null

  return (
    <div className={cn("flex flex-wrap items-center gap-3 text-[13px] text-muted-foreground", className)}>
      {date ? (
        <span className="inline-flex items-center gap-1.5">
          <IconCalendar size={13} />
          {date}
        </span>
      ) : null}
      {readTime ? (
        <span className="inline-flex items-center gap-1.5">
          <IconClock size={13} />
          {readTime}
        </span>
      ) : null}
    </div>
  )
}

export function ArticleHeader({ article }: { article: ArticleItem }) {
  return (
    <header className="relative overflow-hidden border-b border-border/45 bg-background">
      <div
        aria-hidden
        className="absolute right-[-14%] top-14 h-80 w-80 rounded-full opacity-[0.10] blur-3xl dark:opacity-[0.16] md:h-[30rem] md:w-[30rem]"
        style={{ background: article.accent ?? "var(--accent)" }}
      />
      <div
        aria-hidden
        className="absolute inset-0 opacity-[0.32] dark:opacity-[0.18]"
        style={{
          backgroundImage:
            "linear-gradient(to right, var(--border) 1px, transparent 1px), linear-gradient(to bottom, var(--border) 1px, transparent 1px)",
          backgroundSize: "56px 56px",
          maskImage: "linear-gradient(to bottom, black, transparent 78%)",
          WebkitMaskImage: "linear-gradient(to bottom, black, transparent 78%)",
        }}
      />
      <div aria-hidden className="absolute inset-0 bg-[radial-gradient(circle_at_50%_0%,transparent_0%,var(--background)_68%)]" />

      <div className="relative mx-auto max-w-6xl px-6 pb-14 pt-28 md:pb-18 md:pt-36">
        <div className="min-w-0">
          <Reveal as="div" y={14} start="top 96%" className="mb-6 flex flex-wrap items-center gap-2">
            {article.category ? <CategoryPill>{article.category}</CategoryPill> : null}
            {article.date ? (
              <span className="inline-flex h-7 items-center rounded-full border border-border/55 bg-card/65 px-3 text-[11px] font-medium text-muted-foreground">
                {article.date}
              </span>
            ) : null}
            {article.readTime ? (
              <span className="inline-flex h-7 items-center rounded-full border border-border/55 bg-card/65 px-3 text-[11px] font-medium text-muted-foreground">
                {article.readTime}
              </span>
            ) : null}
          </Reveal>

          <TextReveal
            as="h1"
            start="top 96%"
            className="max-w-[930px] text-balance text-[40px] font-semibold leading-[1.04] tracking-[-0.02em] text-foreground md:text-[60px] lg:text-[68px]"
          >
            {article.title}
          </TextReveal>

          <Reveal as="p" y={20} delay={0.2} start="top 96%" className="mt-7 max-w-[68ch] text-[18px] leading-8 text-foreground/68 md:text-[21px] md:leading-9">
            {article.description}
          </Reveal>

          {article.tags && article.tags.length > 0 ? (
            <Reveal as="div" y={14} delay={0.3} start="top 96%" className="mt-8 flex flex-wrap gap-2 border-t border-border/55 pt-5">
              {article.tags.map((tag) => (
                <span
                  key={tag}
                  className="rounded-full border border-border/55 bg-card/60 px-3 py-1.5 text-[12px] font-medium text-muted-foreground"
                >
                  {tag}
                </span>
              ))}
            </Reveal>
          ) : null}
        </div>
      </div>
    </header>
  )
}

export function RelatedArticles({ currentHref }: { currentHref: string }) {
  const related = articleItems.filter((article) => article.href !== currentHref).slice(0, 3)

  if (related.length === 0) return null

  return (
    <section className="border-t border-border/45 bg-background" aria-labelledby="more-articles">
      <div className="mx-auto max-w-6xl px-6 py-16 md:py-20">
        <div className="mb-8 flex flex-wrap items-end justify-between gap-4 pt-5">
          <div>
            <p className="text-[12px] font-medium text-muted-foreground">More from the journal</p>
            <h2 id="more-articles" className="mt-2 text-[24px] font-semibold leading-tight text-foreground md:text-[30px]">
              Continue reading
            </h2>
          </div>
          <Link
            href="/articles"
            className="inline-flex items-center gap-2 text-sm font-medium text-muted-foreground transition-colors hover:text-accent"
          >
            All articles <IconArrowUpRight size={14} />
          </Link>
        </div>
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {related.map((article) => (
            <RelatedArticleCard
              key={article.href}
              title={article.title}
              description={article.description}
              href={article.href}
              date={article.date}
              readTime={article.readTime}
              category={article.category}
            />
          ))}
        </div>
      </div>
    </section>
  )
}

function ArticleVisual({ article, featured = false }: { article: ArticleItem; featured?: boolean }) {
  const wash = article.accent ?? "linear-gradient(135deg,#10b981,#064e3b)"

  return (
    <div
      className={cn(
        "relative overflow-hidden rounded-2xl border border-white/[0.08] bg-neutral-950",
        featured ? "min-h-[260px] md:min-h-full" : "h-40"
      )}
    >
      {/* Accent wash — the article's own color as a pooled light, not a slab */}
      <div
        aria-hidden
        className="absolute inset-0 opacity-50"
        style={{
          background: wash,
          maskImage: "radial-gradient(130% 110% at 12% -10%, black 0%, transparent 64%)",
          WebkitMaskImage: "radial-gradient(130% 110% at 12% -10%, black 0%, transparent 64%)",
        }}
      />
      {/* Fine dot screen for tooth */}
      <div
        aria-hidden
        className="absolute inset-0 opacity-[0.12]"
        style={{
          backgroundImage: "radial-gradient(rgba(255,255,255,0.5) 1px, transparent 1px)",
          backgroundSize: "16px 16px",
        }}
      />
      {/* Oversized initial, cropped at the plate's edge */}
      <span
        aria-hidden
        className={cn(
          "absolute -bottom-7 right-1 select-none font-black leading-none text-white/[0.07]",
          featured ? "text-[180px]" : "text-[120px]"
        )}
      >
        {article.title[0]}
      </span>
      <div className="absolute inset-x-0 bottom-0 flex items-end justify-between gap-3 p-4">
        <div className="flex flex-wrap gap-1.5">
          {article.tags?.slice(0, featured ? 3 : 1).map((tag) => (
            <span
              key={tag}
              className="rounded-full border border-white/15 bg-black/30 px-2.5 py-1 text-[10px] font-medium text-white/80"
            >
              {tag}
            </span>
          ))}
        </div>
        {article.readTime ? (
          <span className="font-mono text-[10px] tracking-[0.08em] text-white/45">
            {article.readTime}
          </span>
        ) : null}
      </div>
    </div>
  )
}

export function FeaturedArticleCard({ article }: { article: ArticleItem }) {
  return (
    <Link
      href={article.href}
      data-cursor-card
      data-cursor-label="Read"
      className="group block rounded-2xl focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-4 focus-visible:ring-offset-background"
      aria-label={`Read featured article: ${article.title}`}
    >
      <article className="grid overflow-hidden rounded-2xl border border-border/60 bg-card transition duration-300 hover:-translate-y-1 hover:border-accent/30 md:grid-cols-[0.9fr_1.1fr]">
        <ArticleVisual article={article} featured />
        <div className="flex min-h-[300px] flex-col p-6 md:p-8 lg:p-10">
          <div className="flex flex-wrap items-center gap-3">
            <CategoryPill>Featured</CategoryPill>
            {article.category ? <CategoryPill>{article.category}</CategoryPill> : null}
          </div>
          <h2 className="mt-5 max-w-2xl text-2xl font-semibold leading-[1.15] text-foreground md:text-[34px]">
            {article.title}
          </h2>
          <p className="mt-4 max-w-[62ch] text-[15px] leading-7 text-muted-foreground">
            {article.description}
          </p>
          <div className="mt-auto flex flex-wrap items-center justify-between gap-4 border-t border-border/50 pt-6">
            <ReadingMeta date={article.date} readTime={article.readTime} />
            <span className="inline-flex items-center gap-2 text-sm font-medium text-accent transition group-hover:gap-3">
              Read article
              <IconArrowUpRight size={15} />
            </span>
          </div>
        </div>
      </article>
    </Link>
  )
}

export function ArticleCard({ article }: { article: ArticleItem }) {
  return (
    <Link
      href={article.href}
      data-cursor-card
      data-cursor-label="Read"
      className="group block h-full rounded-2xl focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-4 focus-visible:ring-offset-background"
      aria-label={`Read article: ${article.title}`}
    >
      <article className="flex h-full flex-col overflow-hidden rounded-2xl border border-border/60 bg-card transition duration-300 hover:-translate-y-1 hover:border-accent/30">
        <ArticleVisual article={article} />
        <div className="flex flex-1 flex-col p-5">
          <div className="flex flex-wrap items-center gap-2">
            {article.category ? <CategoryPill>{article.category}</CategoryPill> : null}
          </div>
          <h3 className="mt-4 text-[17px] font-semibold leading-[1.28] text-foreground transition group-hover:text-accent">
            {article.title}
          </h3>
          <p className="mt-3 line-clamp-3 text-[14px] leading-6 text-muted-foreground">
            {article.description}
          </p>
          <div className="mt-auto border-t border-border/45 pt-4">
            <ReadingMeta date={article.date} readTime={article.readTime} className="text-[12px]" />
          </div>
        </div>
      </article>
    </Link>
  )
}

export function BlogGrid({ articles }: { articles: ArticleItem[] }) {
  if (articles.length === 0) {
    return (
      <div className="rounded-2xl border border-border/60 bg-card p-8 text-center text-sm text-muted-foreground">
        No articles found.
      </div>
    )
  }

  return (
    <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
      {articles.map((article) => (
        <ArticleCard key={article.href} article={article} />
      ))}
    </div>
  )
}

export function ArticleProse({ children }: { children: React.ReactNode }) {
  return (
    <div className=" text-[17px] leading-[1.85] text-foreground/82">
      {children}
    </div>
  )
}
