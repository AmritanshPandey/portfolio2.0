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
    metadata: "AI Commerce / Mastercard",
    category: "AI Commerce / Mastercard",
    title: "Agent Pay: Designing trust for AI-led payments",
    description:
      "Built the trust framework and React demo used in a CPO-led Money20/20 showcase.",
    image: "/assets/images/work/agent-commerce.jpg",
    href: "/work/agent-commerce",
    metric: "CPO-led Money20/20 demo for AI-led payments.",
    tags: ["Trust UX", "AI Payments", "Prototype"],
    featured: true,
    thinkingBlock: {
      constraint: "Users needed confidence before approving AI-led payments.",
      decision: "Designed trust cues, confirmation moments, and transparent payment states.",
      outcome: "Created a demo-ready framework for explaining Mastercard's role in agentic commerce.",
    },
  },
  {
    metadata: "Demo Systems / Mastercard",
    category: "Demo Systems / Mastercard",
    title: "PartnerBank: A demo system for global RFPs",
    description:
      "Cut custom demo prep from days to same-day configuration.",
    image: "/assets/images/work/white-label-platform.jpg",
    href: "/work/white-label-rfp",
    metric: "Cut custom demo prep from days to same-day configuration.",
    tags: ["Demo Systems", "RFPs", "Scale"],
    featured: true,
    thinkingBlock: {
      constraint: "Enterprise demos needed speed, flexibility, and market-specific customization.",
      decision: "Built configurable product flows and reusable banking scenarios.",
      outcome: "Enabled same-day RFP demo configuration across global sales conversations.",
    },
  },
  {
    metadata: "Commerce Infrastructure / Honasa",
    category: "Commerce Infrastructure / Honasa",
    title: "Honasa: One commerce system for many D2C brands",
    description:
      "Shared checkout, catalog, and campaign patterns without flattening the brands.",
    image: "/assets/images/work/commerce-platform.jpg",
    href: "/work/d2c-platform",
    metric: "Shared checkout, catalog, and campaign patterns without flattening the brands.",
    proofRow: "3 brands / Shared commerce foundation",
  },
  {
    metadata: "Design Systems / Mastercard",
    category: "Design Systems / Mastercard",
    title: "Mastercard Email Builder: Moving teams out of HTML",
    description:
      "50+ components and 28 templates helped teams ship on-brand emails without code.",
    image: "/assets/images/work/design-tokens.jpg",
    href: "/work/email-builder",
    metric: "50+ components and 28 templates helped teams ship on-brand emails without code.",
    proofRow: "50+ components / 28 templates",
  },
  {
    metadata: "0→1 Product / Dror",
    category: "0→1 Product / Dror",
    title: "Dror: Building and pivoting a safety product",
    description:
      "Shipped two products, reached ₹1.98Cr revenue, and learned where PMF breaks.",
    image: "/assets/images/work/fintech-ai-system.jpg",
    href: "/work/citizen-safety",
    metric: "Shipped two products, reached ₹1.98Cr revenue, and learned where PMF breaks.",
    proofRow: "₹1.98Cr revenue / 0→1 product learning",
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
