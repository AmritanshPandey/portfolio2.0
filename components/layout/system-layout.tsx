import Link from "next/link"
import { notFound } from "next/navigation"
import { IconArrowUpRight } from "@tabler/icons-react"
import { systemItems } from "@/lib/data"
import type {
  SystemVisual,
  SystemSection,
  SystemComponent,
  SystemStat,
} from "@/lib/types/content"

// ─── helpers ─────────────────────────────────────────────────────────────────

function getSystem(slug: string) {
  return systemItems.find(s => s.href === `/systems/${slug}`) ?? null
}

// ─── Hero ─────────────────────────────────────────────────────────────────────

function SystemHero({
  title,
  description,
  category,
  tags,
  accent,
  stats,
}: {
  title:        string
  description:  string
  category:     string
  tags?:        string[]
  accent?:      string
  stats?:       SystemStat[]
}) {
  return (
    <div
      className="relative w-full min-h-[480px] md:min-h-[540px] flex items-end"
      style={{ background: accent ?? "linear-gradient(135deg,#0ea5e9,#075985)" }}
    >
      {/* Dot-grid texture */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          backgroundImage: "radial-gradient(rgba(255,255,255,0.4) 1px, transparent 1px)",
          backgroundSize:  "22px 22px",
          opacity:         0.12,
        }}
      />

      {/* Overlays */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,transparent_30%,rgba(0,0,0,0.35)_100%)]" />
      <div className="absolute inset-x-0 bottom-0 h-1/2 bg-gradient-to-t from-black/50 to-transparent" />

      {/* Large background letter */}
      <span
        className="absolute top-1/2 right-12 -translate-y-1/2 font-black leading-none select-none pointer-events-none hidden md:block"
        style={{ fontSize: "220px", color: "rgba(255,255,255,0.04)" }}
      >
        {title[0]}
      </span>

      {/* Content */}
      <div className="relative z-10 w-full max-w-5xl mx-auto px-6 pb-14 pt-32 space-y-5">
        {/* Category + tags */}
        <div className="flex flex-wrap items-center gap-3">
          <span
            className="text-[11px] font-bold uppercase tracking-[0.2em] px-3 py-1 rounded-full"
            style={{ background: "rgba(255,255,255,0.15)", color: "rgba(255,255,255,0.9)" }}
          >
            {category}
          </span>
          {tags?.map(tag => (
            <span
              key={tag}
              className="text-[10px] font-semibold uppercase tracking-widest px-2.5 py-1 rounded"
              style={{ background: "rgba(0,0,0,0.25)", color: "rgba(255,255,255,0.65)" }}
            >
              {tag}
            </span>
          ))}
        </div>

        {/* Title */}
        <h1 className="text-3xl md:text-[2.6rem] font-bold tracking-tight leading-[1.1] text-white max-w-2xl">
          {title}
        </h1>

        {/* Description */}
        <p className="text-[17px] text-white/70 leading-relaxed max-w-xl">
          {description}
        </p>

        {/* Stats row */}
        {stats && stats.length > 0 && (
          <div className="flex flex-wrap gap-8 pt-4 border-t border-white/15">
            {stats.map(s => (
              <div key={s.label}>
                <p className="text-2xl md:text-3xl font-bold text-white">{s.value}</p>
                <p className="text-[12px] text-white/55 mt-0.5">{s.label}</p>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

// ─── Section renderers ────────────────────────────────────────────────────────

function PullQuote({ body }: { body: string }) {
  return (
    <blockquote className="my-10 relative pl-6">
      <div className="absolute left-0 top-0 bottom-0 w-[3px] rounded-full bg-sky-500" />
      <p className="text-[1.25rem] md:text-[1.35rem] font-medium leading-[1.6] text-foreground/85 italic">
        &ldquo;{body}&rdquo;
      </p>
    </blockquote>
  )
}

function Callout({ body }: { body: string }) {
  return (
    <div className="my-8 rounded-xl border border-sky-500/20 bg-sky-500/[0.04] p-5 md:p-6 relative overflow-hidden">
      <div className="absolute left-0 top-0 bottom-0 w-[3px] bg-sky-500/60 rounded-l-xl" />
      <p className="text-[14px] md:text-[15px] leading-[1.7] text-foreground/80 pl-2">
        {body}
      </p>
    </div>
  )
}

function ProseSection({ section }: { section: SystemSection }) {
  const paragraphs = section.body.split("\n\n").filter(Boolean)
  return (
    <div className="space-y-4">
      {section.heading && (
        <h2 className="text-[1.2rem] md:text-[1.3rem] font-semibold tracking-tight text-foreground mt-10 mb-4 flex items-center gap-3">
          <span className="w-4 h-[2px] bg-sky-500 rounded-full flex-shrink-0" />
          {section.heading}
        </h2>
      )}
      {paragraphs.map((para, i) => (
        <p key={i} className="text-[16px] md:text-[17px] leading-[1.8] text-foreground/80">
          {para}
        </p>
      ))}
    </div>
  )
}

function SectionBlock({ section }: { section: SystemSection }) {
  if (section.type === "quote")   return <PullQuote body={section.body} />
  if (section.type === "callout") return <Callout   body={section.body} />
  return <ProseSection section={section} />
}

// ─── Visuals ─────────────────────────────────────────────────────────────────

function TokenTreeVisual({ title, layers }: Extract<SystemVisual, { kind: "token-tree" }>) {
  return (
    <div className="my-10 rounded-2xl border border-border/50 overflow-hidden">
      <div className="px-6 py-4 border-b border-border/50 flex items-center gap-3">
        <div className="w-4 h-[2px] bg-sky-500 rounded-full" />
        <p className="text-[11px] font-bold uppercase tracking-[0.2em] text-sky-600 dark:text-sky-400">
          {title}
        </p>
      </div>
      <div className="divide-y divide-border/40">
        {layers.map((layer, i) => (
          <div key={i} className="px-6 py-4 flex items-start gap-4">
            <div
              className="w-2.5 h-2.5 rounded-full flex-shrink-0 mt-1.5"
              style={{ backgroundColor: layer.color }}
            />
            <div className="flex-1 min-w-0">
              <div className="flex items-baseline gap-3 flex-wrap">
                <p className="text-[13px] font-semibold text-foreground">{layer.name}</p>
                <code className="text-[11px] font-mono text-muted-foreground bg-muted/50 px-2 py-0.5 rounded">
                  {layer.example}
                </code>
              </div>
              <p className="text-[13px] text-muted-foreground mt-0.5">{layer.desc}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

function SwatchesVisual({ title, groups }: Extract<SystemVisual, { kind: "swatches" }>) {
  return (
    <div className="my-10 rounded-2xl border border-border/50 overflow-hidden">
      <div className="px-6 py-4 border-b border-border/50 flex items-center gap-3">
        <div className="w-4 h-[2px] bg-sky-500 rounded-full" />
        <p className="text-[11px] font-bold uppercase tracking-[0.2em] text-sky-600 dark:text-sky-400">
          {title}
        </p>
      </div>
      <div className="px-6 py-5 space-y-5">
        {groups.map(group => (
          <div key={group.label}>
            <p className="text-[11px] font-semibold uppercase tracking-[0.15em] text-muted-foreground mb-2.5">
              {group.label}
            </p>
            <div className="flex flex-wrap gap-2">
              {group.colors.map(color => (
                <div key={color.name} className="flex flex-col items-center gap-1.5">
                  <div
                    className="w-14 h-10 rounded-lg border border-border/40"
                    style={{ backgroundColor: color.hex }}
                  />
                  <p className="text-[10px] text-center text-muted-foreground leading-tight">
                    {color.name}
                    <br />
                    <span className="font-mono">{color.hex}</span>
                  </p>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

function TypeScaleVisual({ title, steps }: Extract<SystemVisual, { kind: "type-scale" }>) {
  return (
    <div className="my-10 rounded-2xl border border-border/50 overflow-hidden">
      <div className="px-6 py-4 border-b border-border/50 flex items-center gap-3">
        <div className="w-4 h-[2px] bg-sky-500 rounded-full" />
        <p className="text-[11px] font-bold uppercase tracking-[0.2em] text-sky-600 dark:text-sky-400">
          {title}
        </p>
      </div>
      <div className="divide-y divide-border/30">
        {steps.map((step, i) => (
          <div key={i} className="px-6 py-4 flex items-baseline gap-6">
            <div className="w-20 flex-shrink-0">
              <p className="text-[10px] font-semibold uppercase tracking-[0.12em] text-muted-foreground">
                {step.label}
              </p>
              <p className="text-[10px] font-mono text-muted-foreground/60 mt-0.5">
                {step.size} / {step.weight}
              </p>
            </div>
            <p
              className="text-foreground/90 truncate"
              style={{ fontSize: step.size, fontWeight: step.weight }}
            >
              {step.sample}
            </p>
          </div>
        ))}
      </div>
    </div>
  )
}

function StatesVisual({ title, states }: Extract<SystemVisual, { kind: "states" }>) {
  return (
    <div className="my-10 rounded-2xl border border-border/50 overflow-hidden">
      <div className="px-6 py-4 border-b border-border/50 flex items-center gap-3">
        <div className="w-4 h-[2px] bg-sky-500 rounded-full" />
        <p className="text-[11px] font-bold uppercase tracking-[0.2em] text-sky-600 dark:text-sky-400">
          {title}
        </p>
      </div>
      <div className="divide-y divide-border/30">
        {states.map((state, i) => (
          <div key={i} className="flex items-start gap-4 px-6 py-4">
            <div
              className="flex-shrink-0 px-3 py-1.5 rounded-md text-[11px] font-semibold whitespace-nowrap"
              style={{ backgroundColor: state.bg, color: state.text }}
            >
              {state.label}
            </div>
            <p className="text-[13px] text-muted-foreground leading-relaxed">
              {state.description}
            </p>
          </div>
        ))}
      </div>
    </div>
  )
}

function VisualBlock({ visual }: { visual: SystemVisual }) {
  if (visual.kind === "token-tree") return <TokenTreeVisual {...visual} />
  if (visual.kind === "swatches")   return <SwatchesVisual  {...visual} />
  if (visual.kind === "type-scale") return <TypeScaleVisual {...visual} />
  if (visual.kind === "states")     return <StatesVisual    {...visual} />
  return null
}

// ─── Components grid ─────────────────────────────────────────────────────────

function ComponentCard({ comp }: { comp: SystemComponent }) {
  return (
    <div className="rounded-xl border border-border/40 p-5 space-y-2.5">
      <p className="text-[14px] font-semibold text-foreground font-mono">{comp.name}</p>
      <p className="text-[13px] text-muted-foreground leading-relaxed">{comp.description}</p>
      {comp.tags && comp.tags.length > 0 && (
        <div className="flex flex-wrap gap-1.5 pt-1">
          {comp.tags.map(tag => (
            <span
              key={tag}
              className="text-[10px] font-semibold uppercase tracking-[0.12em] px-2 py-0.5 rounded bg-muted/60 text-muted-foreground"
            >
              {tag}
            </span>
          ))}
        </div>
      )}
    </div>
  )
}

// ─── Takeaways ────────────────────────────────────────────────────────────────

function Takeaways({ items }: { items: string[] }) {
  return (
    <div className="my-12 rounded-2xl border border-border/50 bg-foreground/[0.02] dark:bg-white/[0.02] overflow-hidden">
      <div className="px-6 py-4 border-b border-border/50 flex items-center gap-3">
        <div className="w-4 h-[2px] bg-sky-500 rounded-full" />
        <p className="text-[11px] font-bold uppercase tracking-[0.2em] text-sky-600 dark:text-sky-400">
          Key Takeaways
        </p>
      </div>
      <div className="px-6 py-5 space-y-3">
        {items.map((item, i) => (
          <div key={i} className="flex gap-4 items-start">
            <span className="text-[11px] font-mono font-bold text-sky-500/70 mt-1 w-5 flex-shrink-0">
              {String(i + 1).padStart(2, "0")}
            </span>
            <p className="text-[14px] md:text-[15px] leading-[1.65] text-foreground/75">
              {item}
            </p>
          </div>
        ))}
      </div>
    </div>
  )
}

// ─── Related systems ──────────────────────────────────────────────────────────

function RelatedCard({
  title, description, href, accent, category,
}: {
  title: string; description: string; href: string
  accent?: string; category?: string
}) {
  return (
    <Link
      href={href}
      className="group flex flex-col rounded-xl overflow-hidden border border-border/40 hover:border-sky-500/25 transition-all duration-300 hover:-translate-y-1"
    >
      <div
        className="relative h-28 flex-shrink-0"
        style={{ background: accent ?? "linear-gradient(135deg,#0ea5e9,#075985)" }}
      >
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            backgroundImage: "radial-gradient(rgba(255,255,255,0.4) 1px, transparent 1px)",
            backgroundSize:  "14px 14px",
            opacity:         0.1,
          }}
        />
      </div>
      <div className="p-4 bg-background flex-1">
        <span className="text-[10px] font-semibold uppercase tracking-[0.16em] text-muted-foreground">
          {category ?? "System"}
        </span>
        <p className="text-[13px] font-medium leading-snug mt-1.5 mb-1 group-hover:text-sky-600 dark:group-hover:text-sky-400 transition-colors line-clamp-2">
          {title}
        </p>
        <p className="text-[12px] text-muted-foreground line-clamp-2 leading-relaxed">
          {description}
        </p>
      </div>
    </Link>
  )
}

// ─── Main export ──────────────────────────────────────────────────────────────

export function SystemLayout({ slug }: { slug: string }) {
  const system  = getSystem(slug)
  if (!system) notFound()

  const related = systemItems.filter(s => s.href !== system.href)

  return (
    <main>
      {/* Hero */}
      <SystemHero
        title={system.title}
        description={system.description}
        category={system.category}
        tags={system.tags}
        accent={system.accent}
        stats={system.stats}
      />

      {/* Body */}
      <div className="max-w-4xl mx-auto px-6 py-14">

        {/* Problem statement */}
        {system.problem && (
          <p className="text-[18px] md:text-[19px] leading-[1.75] font-medium text-foreground/90 mb-10 pb-10 border-b border-border/40">
            {system.problem}
          </p>
        )}

        {/* Sections + visuals interleaved */}
        {system.sections?.map((section, i) => (
          <SectionBlock key={i} section={section} />
        ))}

        {/* Standalone visuals (if any not already inline) */}
        {system.visuals && system.visuals.length > 0 && (
          <div className="mt-10">
            {system.visuals.map((v, i) => (
              <VisualBlock key={i} visual={v} />
            ))}
          </div>
        )}

        {/* Components */}
        {system.components && system.components.length > 0 && (
          <div className="mt-12">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-4 h-[2px] bg-sky-500 rounded-full" />
              <p className="text-[11px] font-bold uppercase tracking-[0.2em] text-muted-foreground">
                System Components
              </p>
            </div>
            <div className="grid sm:grid-cols-2 gap-4">
              {system.components.map(comp => (
                <ComponentCard key={comp.name} comp={comp} />
              ))}
            </div>
          </div>
        )}

        {/* Takeaways */}
        {system.takeaways && system.takeaways.length > 0 && (
          <Takeaways items={system.takeaways} />
        )}
      </div>

      {/* Related */}
      {related.length > 0 && (
        <div className="border-t border-border/40 bg-foreground/[0.015] dark:bg-white/[0.015]">
          <div className="max-w-4xl mx-auto px-6 py-14">
            <div className="flex items-center gap-3 mb-7">
              <div className="w-4 h-[2px] bg-sky-500 rounded-full" />
              <p className="text-[11px] font-bold uppercase tracking-[0.2em] text-muted-foreground">
                More Systems
              </p>
            </div>
            <div className="grid sm:grid-cols-2 gap-4">
              {related.map(s => (
                <RelatedCard
                  key={s.href}
                  title={s.title}
                  description={s.description}
                  href={s.href}
                  accent={s.accent}
                  category={s.category}
                />
              ))}
            </div>

            <div className="mt-10 text-center">
              <Link
                href="/work"
                className="inline-flex items-center gap-2 text-sm font-medium text-muted-foreground hover:text-sky-600 dark:hover:text-sky-400 transition-colors"
              >
                All work
                <IconArrowUpRight size={14} />
              </Link>
            </div>
          </div>
        </div>
      )}
    </main>
  )
}
