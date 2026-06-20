/* ============================================================================
   Portfolio engine — shared types.

   One config-driven engine renders three audience modes (general, designLead,
   pm) from a single project database. Same visual system + components; only the
   content, ordering, labels, CTAs and emphasis change per mode.
   ============================================================================ */

export type PortfolioMode = "general" | "designLead" | "pm"

/** Where a project sits in the visual hierarchy. */
export type ProjectStatus = "featured" | "supporting" | "advisory" | "lab" | "craft"

/** A single quantified outcome rendered as an impact tile on a card. */
export interface ImpactMetric {
  value: string
  label: string
}

export interface ProjectVisual {
  image: string
  alt?: string
}

/**
 * A case-study project, defined ONCE. Per-mode summaries let the same project
 * speak to each audience without duplicating the record.
 */
export interface PortfolioProject {
  id: string
  slug: string
  title: string
  shortTitle: string
  company: string
  role: string
  timeframe: string
  /** e.g. "AI Commerce", "Design System", "0→1 Product". */
  type: string
  defaultSummary: string
  designLeadSummary: string
  pmSummary: string
  tags: string[]
  impactMetrics: ImpactMetric[]
  visuals: ProjectVisual
  caseStudyUrl: string
  /** false → CTA shown but disabled because the detail page isn't live yet. */
  caseStudyReady?: boolean
  status: ProjectStatus
  /** true → content is scaffolded TODO copy, not final. */
  placeholder?: boolean
}

/** A compact advisory / fractional engagement. Role label must not overclaim. */
export interface AdvisoryCard {
  id: string
  title: string
  /** Explicit, honest role — e.g. "Fractional Product & Design Advisor". */
  role: string
  summary: string
  logo?: string
  link?: string
  placeholder?: boolean
}

/** A frontend-built product / prototype (the "Lab"). */
export interface LabProduct {
  id: string
  title: string
  summary: string
  /** Tech / discipline tags. */
  stack: string[]
  status: "Live" | "Concept" | "In Development" | "Demo"
  image?: string
  href?: string
  placeholder?: boolean
}

/** A visual craft exploration shown as a thumbnail. */
export interface CraftItem {
  id: string
  title: string
  category: string
  image: string
  href?: string
  placeholder?: boolean
}

/** Every section the engine knows how to render. */
export type SectionKey =
  | "featured"
  | "built"
  | "supporting"
  | "advisory"
  | "craft"
  | "mentorship"
  | "articles"
  | "approach"
  | "metrics"
  | "contact"

export interface SectionConfig {
  key: SectionKey
  /** DOM id / scroll anchor for this band on the mode page. */
  id: string
  title: string
  description: string
  bg?: "default" | "muted" | "grid"
  /** Project sections only: which project ids to render, in order. */
  projectIds?: string[]
}

export interface MegaMenuColumn {
  heading: string
  items: { label: string; href: string }[]
}

export interface NavLink {
  label: string
  /** Hash anchor on the mode page (e.g. "#featured"). */
  href: string
}

export interface HeroConfig {
  eyebrow: string
  /** Three-line display heading; the middle line is emphasised. */
  lines: [string, string, string]
  introLead: string
  intro: string
  primaryCta: { label: string; href: string }
  secondaryCta: { label: string; href: string }
  /** Short, checkable proof points under the hero. */
  proof: string[]
  /** Pills on the hero portrait. */
  tags: [string, string]
}

export interface ModeConfig {
  mode: PortfolioMode
  /** Human label, e.g. "Design Lead". */
  label: string
  routePath: string
  hero: HeroConfig
  nav: NavLink[]
  megaMenu: MegaMenuColumn[]
  sections: SectionConfig[]
  /** Emphasised skills/themes for this audience. */
  skills: string[]
  resumeHref: string
}
