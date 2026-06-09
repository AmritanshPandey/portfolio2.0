import type { WorkItem } from "@/lib/types/content"

// ─── SEQUENCE ────────────────────────────────────────────────────────────────
// Reorder slugs here to change the display order and size tier.
// Positions 0-1 -> large cards (top row)
// Positions 2-4 -> small cards (bottom row)

const SEQUENCE: string[] = [
  "agent-commerce",
  "white-label-rfp",
  "d2c-platform",
  "citizen-safety",
  "email-builder",
]

// ─── CASE STUDY DEFINITIONS ──────────────────────────────────────────────────

const ITEMS: Omit<WorkItem, "tier" | "order">[] = [
  {
    category: "AI Commerce / Mastercard",
    title: "Agent Pay: Designing trust for AI-led payments",
    description:
      "Built the UX research toolkit, multi-sensory trust framework, and the React + Claude AI demo the CPO used at Money20/20. The silent guardian framework keeps Mastercard invisible by default, then brings it forward at the moments where trust matters.",
    image: "/assets/images/work/agent-commerce.jpg",
    href: "/work/agent-commerce",
    metric: "Built the trust framework and React demo used by Mastercard's CPO at Money20/20.",
    tags: ["Trust UX", "AI Payments", "Prototype"],
  },
  {
    category: "Demo Systems / Mastercard",
    title: "PartnerBank: A demo system for global RFPs",
    description:
      "Built a configurable white-label design system so sales teams could tailor enterprise product demos without waiting on engineering.",
    image: "/assets/images/work/white-label-platform.jpg",
    href: "/work/white-label-rfp",
    metric: "Cut custom demo prep from days to same-day configuration.",
    tags: ["Demo Systems", "RFPs", "Scale"],
  },
  {
    category: "Commerce Infrastructure / Honasa",
    title: "Honasa: One commerce system for many D2C brands",
    description:
      "Created a shared commerce foundation for multiple D2C brands while keeping each brand's experience distinct.",
    image: "/assets/images/work/commerce-platform.jpg",
    href: "/work/d2c-platform",
    metric: "Shared checkout, catalog, and campaign patterns without flattening the brands.",
  },
  {
    category: "Design Systems / Mastercard",
    title: "Mastercard Email Builder: Moving teams out of HTML",
    description:
      "Owned the component architecture for Mastercard's global email builder. Defined what shipped, why it mattered, and how teams would use it.",
    image: "/assets/images/work/design-tokens.jpg",
    href: "/work/email-builder",
    metric: "50+ components and 28 templates so teams could ship on-brand emails without code.",
  },
  {
    category: "0→1 Product / Dror",
    title: "Dror: Building and pivoting a safety product",
    description:
      "Worked as PM, designer, and React frontend dev across two products in eleven months, from a consumer safety app to a B2B workplace safety pivot.",
    image: "/assets/images/work/fintech-ai-system.jpg",
    href: "/work/citizen-safety",
    metric: "Shipped two products, reached ₹1.98Cr revenue, and learned where PMF breaks.",
  },
]

// ─── DERIVED EXPORT ───────────────────────────────────────────────────────────

const slugOf = (href: string) => href.replace("/work/", "")

const itemsBySlug = Object.fromEntries(ITEMS.map((item) => [slugOf(item.href), item]))

export const workItems: WorkItem[] = SEQUENCE.map((slug, i) => ({
  ...itemsBySlug[slug],
  tier:  i < 2 ? "flagship" : "supporting",
  order: i + 1,
}))
