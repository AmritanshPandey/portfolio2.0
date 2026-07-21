export interface WorkItem {
  category: string
  title: string
  description: string
  image: string
  href: string
  tags?: string[]
  featured?: boolean
  /** Short outcome / impact line shown on the "More case studies" cards. */
  metric?: string
  order: number
}

export interface ExplorationItem {
  title: string
  description: string
  question?: string
  tested?: string
  built?: string
  learned?: string
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
   * "image-layout"     flexible group: single / 2-col / 2-row / 3-col / 3-featured / 2x2 / bento
   * "full-bleed"       wide story block with overlay or outside copy
   */
  type?: "default" | "quote" | "callout"
       | "image-full" | "image-captioned" | "image-compare"
       | "image-grid" | "image-float" | "image-device"
       | "image-layout" | "full-bleed"

  // ── shared image fields ───────────────────────────────────────────────
  /** Primary image src (image-full / image-captioned / image-float / image-device) */
  src?:     string
  alt?:     string
  /** Caption rendered below the image */
  caption?: string
  /** Attribution / source credit shown after caption */
  source?:  string
  /** Optional label above full-bleed copy. */
  eyebrow?: string
  /** Optional full-bleed title. Falls back to heading when omitted. */
  title?: string
  /** Optional full-bleed subtitle. */
  subtitle?: string

  // ── image-compare ────────────────────────────────────────────────────
  before?: { src: string; label?: string; alt?: string }
  after?:  { src: string; label?: string; alt?: string }

  // ── image-grid / image-layout ─────────────────────────────────────────
  /** colSpan / rowSpan apply only to the "bento" layout. fit/aspect override the image-layout defaults. */
  images?:  {
    src: string
    caption?: string
    alt?: string
    fit?: "cover" | "contain"
    aspect?: "auto" | "16/10" | "16/9" | "4/3" | "3/2" | "1/1"
    colSpan?: 1 | 2 | 3
    rowSpan?: 1 | 2
  }[]
  columns?: 2 | 3

  // ── image-layout ───────────────────────────────────────────────────────
  /** Arrangement for the "image-layout" type. */
  layout?: "single" | "2-col" | "2-row" | "3-col" | "3-featured" | "2x2" | "bento"
  /** Spacing between images in "image-layout" (default "md"). */
  gap?: "sm" | "md" | "lg"
  /** Default object fit for fixed-aspect image-layout cells. */
  fit?: "cover" | "contain"
  /** Default aspect ratio for image-layout cells or full-bleed blocks. */
  aspect?: "auto" | "screen" | "16/10" | "16/9" | "4/3" | "3/2" | "1/1"

  // ── full-bleed ────────────────────────────────────────────────────────
  copyMode?: "overlay" | "outside"
  copyPlacement?: "top" | "bottom"
  typography?: "article" | "case" | "page"
  align?: "left" | "center"
  priority?: boolean

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
  /** true = keep the route resolving but drop it from every listing, the
   *  homepage, and the sitemap. Used to retire content without deleting it.
   *  Pair with `robots: { index: false }` on the route's layout. */
  hidden?: boolean
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
