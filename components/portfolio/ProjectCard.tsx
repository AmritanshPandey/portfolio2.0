import Image from "next/image"
import Link from "next/link"
import clsx from "clsx"
import { IconArrowUpRight, IconLock } from "@tabler/icons-react"
import type { PortfolioMode, PortfolioProject } from "@/data/portfolio/types"
import { getProjectSummary } from "@/data/portfolio/helpers"

/* ----------------------------------------------------------------------------
   ProjectCard — reusable case-study card.

   variant="featured"   → large, highly visual (3 across).
   variant="supporting" → smaller, denser (3 across), image-light.

   Summary is mode-aware via getProjectSummary(); role/status/impact/tags come
   straight off the single project record. Placeholder projects render a
   disabled CTA instead of a dead link.
---------------------------------------------------------------------------- */

type Variant = "featured" | "supporting"

interface Props {
  project: PortfolioProject
  mode: PortfolioMode
  variant?: Variant
}

export function ProjectCard({ project, mode, variant = "featured" }: Props) {
  const summary = getProjectSummary(project, mode)
  const ready = project.caseStudyReady !== false
  const featured = variant === "featured"

  const inner = (
    <article
      className={clsx(
        "group relative flex h-full flex-col overflow-hidden rounded-2xl",
        "border border-black/[0.07] dark:border-white/[0.08]",
        "bg-white dark:bg-[oklch(0.18_0_0)]",
        "shadow-[0_1px_2px_rgba(0,0,0,0.04)]",
        "transition-[transform,box-shadow,border-color] duration-500 ease-[cubic-bezier(0.22,1,0.36,1)]",
        ready &&
          "hover:-translate-y-1 hover:border-accent/40 hover:shadow-[0_18px_44px_rgba(0,0,0,0.14)]",
      )}
    >
      {/* THUMBNAIL */}
      <div
        className={clsx(
          "relative w-full overflow-hidden bg-muted/40",
          featured ? "aspect-[16/10]" : "aspect-[16/9]",
        )}
      >
        <Image
          src={project.visuals.image}
          alt={project.visuals.alt ?? project.title}
          fill
          sizes={featured ? "(max-width: 768px) 100vw, 33vw" : "(max-width: 768px) 100vw, 33vw"}
          className={clsx(
            "object-cover transition-transform duration-700 ease-[cubic-bezier(0.22,1,0.36,1)]",
            ready && "group-hover:scale-[1.04]",
          )}
        />
        <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/30 via-transparent to-transparent" />
        {/* Type badge */}
        <span className="absolute left-3 top-3 rounded-full bg-black/55 px-2.5 py-1 text-[10px] font-medium uppercase tracking-[0.12em] text-white backdrop-blur-sm">
          {project.type}
        </span>
        {project.placeholder && (
          <span className="absolute right-3 top-3 rounded-full bg-amber-500/90 px-2.5 py-1 text-[10px] font-semibold uppercase tracking-[0.1em] text-black">
            Draft
          </span>
        )}
      </div>

      {/* BODY */}
      <div className={clsx("flex flex-1 flex-col", featured ? "p-5 md:p-6" : "p-4 md:p-5")}>
        {/* Role + timeframe */}
        <div className="mb-2 flex items-center gap-2 font-mono text-[10px] uppercase tracking-[0.12em] text-muted-foreground">
          <span className="truncate">{project.role}</span>
          <span className="opacity-40">·</span>
          <span className="shrink-0">{project.timeframe}</span>
        </div>

        <h3
          className={clsx(
            "font-bold leading-[1.12] tracking-[-0.02em] text-foreground",
            featured ? "text-[clamp(1.15rem,1.7vw,1.4rem)]" : "text-[1.05rem]",
          )}
        >
          {project.shortTitle}
        </h3>

        <p
          className={clsx(
            "mt-2 text-foreground/55",
            featured ? "text-[13.5px] leading-relaxed" : "text-[13px] leading-relaxed line-clamp-3",
          )}
        >
          {summary}
        </p>

        {/* Impact tiles — featured only */}
        {featured && project.impactMetrics.length > 0 && (
          <div className="mt-4 grid grid-cols-2 gap-2">
            {project.impactMetrics.slice(0, 2).map((m) => (
              <div
                key={m.label}
                className="rounded-lg border border-black/[0.06] bg-muted/40 px-3 py-2 dark:border-white/[0.06]"
              >
                <p className="text-[15px] font-semibold leading-none text-accent">{m.value}</p>
                <p className="mt-1 text-[11px] leading-tight text-muted-foreground">{m.label}</p>
              </div>
            ))}
          </div>
        )}

        {/* Tags */}
        <div className="mt-4 flex flex-wrap gap-1.5">
          {project.tags.slice(0, featured ? 4 : 3).map((tag) => (
            <span
              key={tag}
              className="rounded-full border border-black/[0.06] bg-muted/30 px-2.5 py-1 text-[11px] text-foreground/60 dark:border-white/[0.06]"
            >
              {tag}
            </span>
          ))}
        </div>

        {/* CTA */}
        <div className="mt-5 flex items-center gap-1.5 pt-1 text-[13px] font-medium">
          {ready ? (
            <>
              <span className="text-foreground/70 transition-colors group-hover:text-foreground">
                {featured ? "Read case study" : "View"}
              </span>
              <IconArrowUpRight
                size={15}
                stroke={2}
                className="text-foreground/50 transition-transform duration-300 group-hover:-translate-y-[2px] group-hover:translate-x-[2px] group-hover:text-accent"
              />
            </>
          ) : (
            <span className="inline-flex items-center gap-1.5 text-muted-foreground">
              <IconLock size={13} stroke={2} />
              Case study coming soon
            </span>
          )}
        </div>
      </div>
    </article>
  )

  if (!ready) return <div className="h-full">{inner}</div>

  return (
    <Link
      href={project.caseStudyUrl}
      data-cursor-image={project.visuals.image}
      className="block h-full rounded-2xl focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent/45 focus-visible:ring-offset-2 focus-visible:ring-offset-background"
    >
      {inner}
    </Link>
  )
}
