import type { WorkItem } from "@/lib/types/content"

// ─── SEQUENCE ────────────────────────────────────────────────────────────────
// Reorder slugs here to change display order.
// Role, problem (description) and outcome (metric) are taken from each case
// study's own summary; don't add a figure the case study doesn't state.

const SEQUENCE: string[] = [
  "white-label-rfp",
  "d2c-platform",
  "citizen-safety",
  "email-builder",
]

// ─── CASE STUDY DEFINITIONS ──────────────────────────────────────────────────

const ITEMS: Omit<WorkItem, "order">[] = [
  {
    category: "Demo Systems / Mastercard",
    title: "PartnerBank: A demo system for global RFPs",
    description:
      "Demos decide enterprise RFPs, but every new bank needed manual design work, so effort grew with every deal.",
    role: "Design Lead",
    image: "/assets/images/work/white-label-platform.jpg",
    href: "/work/white-label-rfp",
    metric: "A per-deal demo went from about 10 days to about 3; the library grew from 8 to 31 components in six months.",
    tags: ["Demo Systems", "RFPs", "Scale"],
    featured: true,
  },
  {
    category: "Commerce Infrastructure / Honasa",
    title: "Honasa: One commerce system for many D2C brands",
    description:
      "Three brands sold almost entirely through marketplaces and needed their own storefronts in eight weeks, with no design system.",
    role: "First in-house UX designer",
    image: "/assets/images/work/commerce-platform.jpg",
    href: "/work/d2c-platform",
    metric: "All three storefronts shipped in the window on one shared system, with no critical post-launch bugs.",
  },
  {
    category: "0→1 Product / Dror",
    title: "Dror: Building and pivoting a safety product",
    description:
      "A 10-person startup's consumer safety app lost its use case to COVID lockdowns before it could make money.",
    role: "Sole PM and designer",
    image: "/assets/images/work/fintech-ai-system.jpg",
    href: "/work/citizen-safety",
    metric: "The B2B pivot shipped in six weeks and reached ₹1.98Cr lifetime revenue.",
  },
  {
    category: "Design Systems / Mastercard",
    title: "Mastercard Email Builder: Moving teams out of HTML",
    description:
      "Custom emails needed HTML, so teams waited on agencies or fell back to outdated templates.",
    role: "Design System Lead",
    image: "/assets/images/work/design-tokens.jpg",
    href: "/work/email-builder",
    metric: "A no-code builder on 50+ Outlook-safe components and 28 templates, adopted Mastercard-wide.",
  },
]

// ─── DERIVED EXPORT ───────────────────────────────────────────────────────────

const slugOf = (href: string) => href.replace("/work/", "")
const itemsBySlug = Object.fromEntries(ITEMS.map((item) => [slugOf(item.href), item]))

export const workItems: WorkItem[] = SEQUENCE.map((slug, i) => ({
  ...itemsBySlug[slug],
  order: i + 1,
}))
