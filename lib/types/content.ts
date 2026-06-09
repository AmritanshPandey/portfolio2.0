export interface WorkItem {
  /** Metadata shown above the title. */
  metadata?: string
  category: string
  title: string
  description: string
  image: string
  href: string
  tags?: string[]
  featured?: boolean
  thinkingBlock?: {
    constraint: string
    decision: string
    outcome: string
  }
  proofRow?: string
  /** Short outcome / impact line shown on the card (e.g. "Used by 12 banking partners") */
  metric?: string
  /**
   * "flagship" - primary case studies rendered with more visual weight.
   * First flagship gets the full-width hero treatment; others sit in a 2-col row.
   * "supporting" - secondary work rendered in a compact 2-col row below flagships.
   */
  tier: "flagship" | "supporting"
  /** Render order within the tier (lower = first). */
  order: number
}

export interface ExplorationItem {
  title: string
  description: string
  image: string
  href: string
  tags: string[]
  /** Tailwind col-span class for the 5-column mosaic grid. Rows must sum to 5 (e.g. "md:col-span-3" + "md:col-span-2"). */
  span: string
  /** Optional project status shown as a badge. */
  status?: "Concept" | "In Development" | "Live"
}

export interface SystemStat {
  value: string
  label: string
}

export interface SystemComponent {
  name:        string
  description: string
  tags?:       string[]
}

/** Inline visual blocks rendered as live CSS demos inside the system page */
export type SystemVisual =
  | { kind: "token-tree";  title: string; layers: { name: string; desc: string; example: string; color: string }[] }
  | { kind: "swatches";    title: string; groups: { label: string; colors: { name: string; hex: string; light?: boolean }[] }[] }
  | { kind: "type-scale";  title: string; steps: { label: string; size: string; weight: string; sample: string }[] }
  | { kind: "states";      title: string; states: { label: string; bg: string; text: string; description: string }[] }

export interface SystemSection {
  heading?: string
  body:     string
  type?:    "default" | "quote" | "callout"
}

export interface SystemItem {
  category:    string
  title:       string
  description: string
  image:       string
  href:        string
  ctaLabel:    string
  // ── rich content ──
  accent?:     string
  tags?:       string[]
  problem?:    string
  sections?:   SystemSection[]
  visuals?:    SystemVisual[]
  components?: SystemComponent[]
  stats?:      SystemStat[]
  takeaways?:  string[]
}

export interface ArticleSection {
  heading?: string
  /** Body text (required for prose/quote/callout; optional for image-* types) */
  body?: string
  /**
   * "quote"            pull-quote with left border
   * "callout"          highlight box
   * "image-full"       wide bleed image, breaks past prose column
   * "image-captioned"  prose-width image with caption + optional source credit
   * "image-compare"    two images side by side with before/after labels
   * "image-grid"       2- or 3-column image grid
   * "image-float"      image floated left/right, body text flows alongside
   * "image-device"     image inside a browser or phone frame mockup
   */
  type?: "default" | "quote" | "callout"
       | "image-full" | "image-captioned" | "image-compare"
       | "image-grid" | "image-float" | "image-device"

  // ── shared image fields ───────────────────────────────────────────────
  /** Primary image src (image-full / image-captioned / image-float / image-device) */
  src?:     string
  alt?:     string
  /** Caption rendered below the image */
  caption?: string
  /** Attribution / source credit shown after caption */
  source?:  string

  // ── image-compare ────────────────────────────────────────────────────
  before?: { src: string; label?: string; alt?: string }
  after?:  { src: string; label?: string; alt?: string }

  // ── image-grid ───────────────────────────────────────────────────────
  images?:  { src: string; caption?: string; alt?: string }[]
  columns?: 2 | 3

  // ── image-float ──────────────────────────────────────────────────────
  /** Which side the image sits on (default "left") */
  side?: "left" | "right"

  // ── image-device ─────────────────────────────────────────────────────
  device?:    "browser" | "phone"
  /** Fake URL shown in the browser address bar */
  deviceUrl?: string
}

export interface ArticleItem {
  title: string
  description: string
  href: string
  image: string
  date?: string
  readTime?: string
  category?: string
  tags?: string[]
  /** CSS gradient string used as the article cover, overrides image */
  accent?: string
  /** true = show in the homepage Insights section (capped at 4) */
  featured: boolean
  // Full article content, optional and used by detail pages.
  intro?: string
  sections?: ArticleSection[]
  takeaways?: string[]
}

export interface LeadershipItem {
  number: string
  title: string
  desc: string
}

export interface AdvisoryOrgItem {
  title: string
  desc: string
  logo: string
  link: string
}

export interface MenteeItem {
  name: string
  company: string
  link: string
}
