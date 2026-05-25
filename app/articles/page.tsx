import Link from "next/link"
import { IconArrowUpRight, IconClock } from "@tabler/icons-react"
import { articleItems } from "@/lib/data"
import type { ArticleItem } from "@/lib/types/content"

// ─── Dot-grid noise overlay reused across cards ──────────────────────────────

function DotGrid({ opacity = 0.18 }: { opacity?: number }) {
  return (
    <div
      className="absolute inset-0 pointer-events-none"
      style={{
        opacity,
        backgroundImage: "radial-gradient(rgba(255,255,255,0.55) 1px, transparent 1px)",
        backgroundSize:  "18px 18px",
      }}
    />
  )
}

// ─── Featured hero card (full-width, side-by-side) ───────────────────────────

function HeroCard({ article }: { article: ArticleItem }) {
  return (
    <Link
      href={article.href}
      className="group block"
      data-cursor-card
      data-cursor-label="Read"
    >
      <div className="grid md:grid-cols-[1fr_1fr] rounded-2xl overflow-hidden border border-border/40 hover:border-orange-500/25 transition-colors duration-400">

        {/* Gradient visual */}
        <div
          className="relative h-56 md:h-auto min-h-[300px] flex items-end p-7"
          style={{ background: article.accent }}
        >
          <DotGrid />

          {/* Radial vignette */}
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,transparent_40%,rgba(0,0,0,0.25)_100%)]" />

          {/* Corner tag */}
          <div className="absolute top-5 left-5 z-10">
            <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-white/50">
              Featured
            </span>
          </div>

          {/* Large background letter */}
          <span
            className="absolute bottom-3 right-5 text-[140px] font-black leading-none select-none pointer-events-none"
            style={{ color: "rgba(255,255,255,0.06)" }}
          >
            {article.title[0]}
          </span>

          {/* Tag pills */}
          <div className="relative z-10 flex flex-wrap gap-1.5">
            {article.tags?.slice(0, 2).map(tag => (
              <span
                key={tag}
                className="text-[10px] font-semibold uppercase tracking-wider px-2.5 py-1 rounded-full"
                style={{ background: "rgba(0,0,0,0.25)", color: "rgba(255,255,255,0.75)" }}
              >
                {tag}
              </span>
            ))}
          </div>
        </div>

        {/* Content */}
        <div className="p-8 md:p-10 flex flex-col justify-between bg-background">
          <div>
            <span className="text-[11px] font-semibold uppercase tracking-[0.18em] text-muted-foreground">
              {article.category ?? "Article"}
            </span>

            <h2 className="text-2xl md:text-[1.75rem] font-semibold tracking-tight leading-[1.2] mt-2 mb-4 group-hover:text-orange-600 dark:group-hover:text-orange-400 transition-colors duration-200">
              {article.title}
            </h2>

            <p className="text-[15px] text-muted-foreground leading-relaxed">
              {article.description}
            </p>
          </div>

          <div className="flex items-center justify-between mt-8 pt-6 border-t border-border/40">
            <div className="flex items-center gap-4 text-sm text-muted-foreground">
              {article.readTime && (
                <span className="flex items-center gap-1.5">
                  <IconClock size={13} />
                  {article.readTime}
                </span>
              )}
              {article.date && <span>{article.date}</span>}
            </div>

            <span className="flex items-center gap-1.5 text-sm font-medium text-orange-600 dark:text-orange-400 group-hover:gap-2.5 transition-all duration-200">
              Read
              <IconArrowUpRight size={15} stroke={2} />
            </span>
          </div>
        </div>
      </div>
    </Link>
  )
}

// ─── Standard grid card ───────────────────────────────────────────────────────

function ArticleGridCard({ article }: { article: ArticleItem }) {
  return (
    <Link
      href={article.href}
      className="group flex flex-col rounded-2xl overflow-hidden border border-border/40 hover:border-orange-500/25 transition-all duration-300 hover:-translate-y-1"
      data-cursor-card
      data-cursor-label="Read"
    >
      {/* Gradient thumbnail */}
      <div
        className="relative h-44 flex-shrink-0 flex items-end p-4"
        style={{ background: article.accent }}
      >
        <DotGrid opacity={0.14} />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_bottom_left,transparent_50%,rgba(0,0,0,0.2)_100%)]" />

        {article.tags?.[0] && (
          <span
            className="relative z-10 text-[10px] font-bold uppercase tracking-widest px-2 py-0.5 rounded"
            style={{ background: "rgba(0,0,0,0.28)", color: "rgba(255,255,255,0.8)" }}
          >
            {article.tags[0]}
          </span>
        )}
      </div>

      {/* Text */}
      <div className="flex flex-col flex-1 p-5 bg-background">
        <span className="text-[10px] font-semibold uppercase tracking-[0.18em] text-muted-foreground mb-2">
          {article.category ?? "Article"}
        </span>

        <h3 className="text-[14px] font-medium leading-[1.35] mb-2.5 group-hover:text-orange-600 dark:group-hover:text-orange-400 transition-colors duration-200 flex-1">
          {article.title}
        </h3>

        <p className="text-[13px] text-muted-foreground leading-relaxed line-clamp-2 mb-4">
          {article.description}
        </p>

        <div className="flex items-center gap-3 text-xs text-muted-foreground pt-3 border-t border-border/30">
          {article.readTime && (
            <span className="flex items-center gap-1">
              <IconClock size={11} />
              {article.readTime}
            </span>
          )}
          {article.date && <span>{article.date}</span>}
        </div>
      </div>
    </Link>
  )
}

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function ArticlesPage() {
  const hero = articleItems[0]
  const rest = articleItems.slice(1)

  return (
    <main className="min-h-screen bg-background">

      {/* ── Header ─────────────────────────────────────────────────────────── */}
      <div className="max-w-6xl mx-auto px-6 pt-32 pb-14">
        <div className="max-w-2xl space-y-4">
          <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-orange-500">
            Writing
          </p>
          <h1 className="text-4xl md:text-5xl font-semibold tracking-tight leading-[1.1]">
            Perspectives on product,<br className="hidden md:block" /> design &amp; systems.
          </h1>
          <p className="text-lg text-muted-foreground leading-relaxed max-w-lg">
            Thinking out loud on the problems I find most interesting.
          </p>
        </div>
      </div>

      {/* ── Featured hero ──────────────────────────────────────────────────── */}
      <div className="max-w-6xl mx-auto px-6 mb-12">
        <HeroCard article={hero} />
      </div>

      {/* ── Divider ────────────────────────────────────────────────────────── */}
      <div className="max-w-6xl mx-auto px-6 mb-10 flex items-center gap-4">
        <div className="w-5 h-[1.5px] bg-orange-500/60 rounded-full" />
        <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-muted-foreground">
          More Articles
        </p>
        <div className="flex-1 h-px bg-border/50" />
      </div>

      {/* ── Grid ───────────────────────────────────────────────────────────── */}
      <div className="max-w-6xl mx-auto px-6 pb-28">
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {rest.map(article => (
            <ArticleGridCard key={article.href} article={article} />
          ))}
        </div>
      </div>

    </main>
  )
}
