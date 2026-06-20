import { Section } from "@/components/shared/section"
import { AdvisoryItem } from "@/components/shared/advisory-item"
import { IconBrandLinkedin } from "@tabler/icons-react"

import AboutSection from "@/components/sections/about/about"
import InsightsSection from "@/components/sections/articles/insights"
import ProductDesignApproachSection from "@/components/sections/thinking/product-design"
import Hero from "@/components/sections/hero/hero"

import { ProjectSection } from "./ProjectSection"
import { ProjectCard } from "./ProjectCard"
import { BuiltProductCard } from "./BuiltProductCard"
import { AdvisoryCard } from "./AdvisoryCard"
import { CraftGrid } from "./CraftGrid"

import { getModeConfig, getOrderedProjects } from "@/data/portfolio/helpers"
import { projectById } from "@/data/portfolio/projects"
import { labProducts } from "@/data/portfolio/lab"
import { advisoryCards } from "@/data/portfolio/advisory"
import { craftItems } from "@/data/portfolio/craft"
import type { PortfolioMode, SectionConfig } from "@/data/portfolio/types"
import { teachingItems, menteeItems } from "@/lib/data"

/* ============================================================================
   PortfolioPage — the shared engine.

   One renderer drives /, /design-lead and /pm. It reads the mode config, then
   walks the mode's ordered section list, rendering each band with the right
   content. Sections shared with the original home (approach, articles, about)
   delegate to the existing components so general mode stays visually identical.
   ============================================================================ */

/* ── Mentorship / teaching — reuses the existing about data, advisory-free ── */
function MentorshipBlock() {
  return (
    <div className="space-y-12">
      <div className="space-y-5">
        <p className="type-meta">Mentorship</p>
        <div className="inline-flex items-baseline gap-2 rounded-xl border border-accent/20 bg-accent/[0.08] px-4 py-2.5 dark:bg-accent/[0.10]">
          <span className="text-2xl font-semibold leading-none text-accent">4</span>
          <span className="text-sm leading-snug text-foreground/70">
            mentees now at{" "}
            <span className="font-medium text-foreground">Microsoft, Zomato, Aleph Alpha,</span> and{" "}
            <span className="font-medium text-foreground">Mastercard</span>
          </span>
        </div>
        <ul className="grid gap-x-10 gap-y-4 sm:grid-cols-2">
          {menteeItems.map((item) => (
            <li key={item.name}>
              <a
                href={item.link}
                target="_blank"
                rel="noopener noreferrer"
                className="group flex items-start gap-3 py-2"
              >
                <div className="mt-[6px] h-1.5 w-1.5 rounded-full bg-foreground/30 transition-all duration-300 group-hover:scale-125 group-hover:bg-accent" />
                <div className="flex flex-col leading-tight">
                  <span className="text-sm font-medium text-foreground">{item.name}</span>
                  <div className="flex items-center gap-2 text-sm text-foreground/60 transition-colors group-hover:text-foreground/80">
                    <span>{item.company}</span>
                    <IconBrandLinkedin
                      size={16}
                      className="opacity-40 transition-all duration-300 group-hover:text-[#0A66C2] group-hover:opacity-100"
                    />
                  </div>
                </div>
              </a>
            </li>
          ))}
        </ul>
      </div>

      <div className="space-y-5 border-t border-border/60 pt-8">
        <p className="type-meta">Teaching & Workshops</p>
        <div className="space-y-2">
          {teachingItems.map((item) => (
            <AdvisoryItem key={item.title} {...item} />
          ))}
        </div>
      </div>
    </div>
  )
}

/* ── Metrics & Impact — aggregated impact tiles for the PM mode ── */
const METRIC_PROJECT_IDS = ["agent-pay", "startup-arc", "email-builder", "partnerbank", "honasa"]

function MetricsBlock() {
  const tiles = METRIC_PROJECT_IDS.flatMap((id) => {
    const p = projectById[id]
    if (!p) return []
    return p.impactMetrics.slice(0, 1).map((m) => ({ ...m, source: p.shortTitle }))
  }).slice(0, 6)

  return (
    <div className="grid grid-cols-2 gap-3 md:grid-cols-3">
      {tiles.map((t) => (
        <div
          key={`${t.source}-${t.label}`}
          className="rounded-xl border border-black/[0.07] bg-white p-5 dark:border-white/[0.08] dark:bg-[oklch(0.18_0_0)]"
        >
          <p className="text-[1.9rem] font-bold leading-none tracking-[-0.02em] text-accent">
            {t.value}
          </p>
          <p className="mt-2 text-[13px] leading-snug text-foreground/70">{t.label}</p>
          <p className="mt-1 font-mono text-[10px] uppercase tracking-[0.12em] text-muted-foreground">
            {t.source}
          </p>
        </div>
      ))}
    </div>
  )
}

/* ── Section dispatcher ── */
function renderSection(section: SectionConfig, mode: PortfolioMode) {
  switch (section.key) {
    case "featured":
      return (
        <Section key={section.id} id={section.id} bg={section.bg} title={section.title} description={section.description}>
          <ProjectSection projects={getOrderedProjects(mode, "featured")} mode={mode} variant="featured" />
        </Section>
      )

    case "supporting":
      return (
        <Section key={section.id} id={section.id} bg={section.bg} title={section.title} description={section.description}>
          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 md:grid-cols-3">
            {getOrderedProjects(mode, "supporting").map((p) => (
              <ProjectCard key={p.id} project={p} mode={mode} variant="supporting" />
            ))}
          </div>
        </Section>
      )

    case "built":
      return (
        <Section key={section.id} id={section.id} bg={section.bg} title={section.title} description={section.description}>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {labProducts.slice(0, 4).map((product) => (
              <BuiltProductCard key={product.id} product={product} />
            ))}
          </div>
        </Section>
      )

    case "advisory":
      return (
        <Section key={section.id} id={section.id} bg={section.bg} title={section.title} description={section.description}>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {advisoryCards.map((item) => (
              <AdvisoryCard key={item.id} item={item} />
            ))}
          </div>
        </Section>
      )

    case "craft":
      return (
        <Section key={section.id} id={section.id} bg={section.bg} title={section.title} description={section.description}>
          <CraftGrid items={craftItems} />
        </Section>
      )

    case "mentorship":
      return (
        <Section key={section.id} id={section.id} bg={section.bg} title={section.title} description={section.description}>
          <MentorshipBlock />
        </Section>
      )

    case "metrics":
      return (
        <Section key={section.id} id={section.id} bg={section.bg} title={section.title} description={section.description}>
          <MetricsBlock />
        </Section>
      )

    case "approach":
      return (
        <Section key={section.id} id={section.id} bg={section.bg} title={section.title} description={section.description}>
          <ProductDesignApproachSection />
        </Section>
      )

    case "articles":
      return (
        <Section key={section.id} id={section.id} bg={section.bg} title={section.title} description={section.description}>
          <InsightsSection />
        </Section>
      )

    case "contact":
      // AboutSection is self-contained (own band + id="about").
      return <AboutSection key={section.id} />

    default:
      return null
  }
}

export function PortfolioPage({ mode }: { mode: PortfolioMode }) {
  const config = getModeConfig(mode)

  return (
    <>
      {/* One Hero for every profile — identical background + motion. General
          uses its default copy; the others pass their mode copy. */}
      {mode === "general" ? <Hero /> : <Hero content={config.hero} />}
      {config.sections.map((section) => renderSection(section, mode))}
    </>
  )
}
