import Link from "next/link"
import { IconArrowUpRight, IconCalendar, IconClock } from "@tabler/icons-react"
import type { ArticleItem } from "@/lib/types/content"
import { cn } from "@/lib/utils"

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
        className="pointer-events-none absolute inset-x-0 top-0 h-56 opacity-70"
        style={{ background: article.accent ?? "linear-gradient(135deg,#ea580c,#c2410c)" }}
      />
      <div
        className="pointer-events-none absolute inset-x-0 top-0 h-56"
        style={{
          backgroundImage: "radial-gradient(rgba(255,255,255,0.42) 1px, transparent 1px)",
          backgroundSize: "22px 22px",
          opacity: 0.12,
        }}
      />
      <div className="pointer-events-none absolute inset-x-0 top-0 h-56 bg-gradient-to-b from-black/10 via-background/40 to-background" />

      <div className="relative mx-auto max-w-5xl px-6 pb-14 pt-32 md:pb-16 md:pt-40">
        <div className="max-w-[760px]">
          <div className="flex flex-wrap items-center gap-3">
            {article.category ? <CategoryPill className="bg-background/70 backdrop-blur">{article.category}</CategoryPill> : null}
            <ReadingMeta date={article.date} readTime={article.readTime} />
          </div>

          <h1 className="mt-6 text-[34px] font-semibold leading-[1.08] text-foreground md:text-[52px]">
            {article.title}
          </h1>

          <p className="mt-5 max-w-[62ch] text-[17px] leading-8 text-muted-foreground md:text-[19px]">
            {article.description}
          </p>

          {article.tags && article.tags.length > 0 ? (
            <div className="mt-6 flex flex-wrap gap-2">
              {article.tags.map((tag) => (
                <CategoryPill key={tag}>{tag}</CategoryPill>
              ))}
            </div>
          ) : null}
        </div>
      </div>
    </header>
  )
}

function ArticleVisual({ article, featured = false }: { article: ArticleItem; featured?: boolean }) {
  return (
    <div
      className={cn(
        "relative overflow-hidden rounded-2xl border border-border/50 bg-muted",
        featured ? "min-h-[260px] md:min-h-full" : "h-40"
      )}
      style={{ background: article.accent ?? "linear-gradient(135deg,#f97316,#9a3412)" }}
    >
      <div
        className="absolute inset-0 opacity-[0.13]"
        style={{
          backgroundImage: "radial-gradient(rgba(255,255,255,0.55) 1px, transparent 1px)",
          backgroundSize: "18px 18px",
        }}
      />
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,transparent_35%,rgba(0,0,0,0.28)_100%)]" />
      <span className="absolute bottom-3 right-4 select-none text-[96px] font-black leading-none text-white/[0.055] md:text-[132px]">
        {article.title[0]}
      </span>
      <div className="absolute inset-x-0 bottom-0 p-4">
        <div className="flex flex-wrap gap-1.5">
          {article.tags?.slice(0, featured ? 3 : 1).map((tag) => (
            <span
              key={tag}
              className="rounded-full bg-black/25 px-2.5 py-1 text-[10px] font-semibold uppercase tracking-[0.12em] text-white/75 backdrop-blur-sm"
            >
              {tag}
            </span>
          ))}
        </div>
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
      className="group block rounded-2xl focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-orange-500 focus-visible:ring-offset-4 focus-visible:ring-offset-background"
      aria-label={`Read featured article: ${article.title}`}
    >
      <article className="grid overflow-hidden rounded-2xl border border-border/60 bg-card transition duration-300 hover:-translate-y-1 hover:border-orange-500/30 md:grid-cols-[0.9fr_1.1fr]">
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
            <span className="inline-flex items-center gap-2 text-sm font-medium text-orange-600 transition group-hover:gap-3 dark:text-orange-400">
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
      className="group block h-full rounded-2xl focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-orange-500 focus-visible:ring-offset-4 focus-visible:ring-offset-background"
      aria-label={`Read article: ${article.title}`}
    >
      <article className="flex h-full flex-col overflow-hidden rounded-2xl border border-border/60 bg-card transition duration-300 hover:-translate-y-1 hover:border-orange-500/30">
        <ArticleVisual article={article} />
        <div className="flex flex-1 flex-col p-5">
          <div className="flex flex-wrap items-center gap-2">
            {article.category ? <CategoryPill>{article.category}</CategoryPill> : null}
          </div>
          <h3 className="mt-4 text-[17px] font-semibold leading-[1.28] text-foreground transition group-hover:text-orange-600 dark:group-hover:text-orange-400">
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
    <div className="mx-auto max-w-[70ch] text-[17px] leading-[1.85] text-foreground/82">
      {children}
    </div>
  )
}
