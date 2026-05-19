export interface WorkItem {
  category: string
  title: string
  description: string
  image: string
  href: string
  /** Short outcome / impact line shown on the card (e.g. "Used by 12 banking partners") */
  metric?: string
  /** The item with featured: true renders as the wide "featured" VerticalCard variant. Exactly one item should be featured. */
  featured: boolean
}

export interface ExplorationItem {
  title: string
  description: string
  image: string
  href: string
  tags: string[]
  /** Tailwind col-span class for the 5-column mosaic grid. Rows must sum to 5 (e.g. "md:col-span-3" + "md:col-span-2"). */
  span: string
}

export interface SystemItem {
  category: string
  title: string
  description: string
  image: string
  href: string
  ctaLabel: string
}

export interface ArticleItem {
  title: string
  description: string
  href: string
  image: string
  date?: string
  category?: string
  /** CSS gradient string used as the article cover — overrides image */
  accent?: string
  /** true = show in the homepage Insights section (capped at 4) */
  featured: boolean
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
