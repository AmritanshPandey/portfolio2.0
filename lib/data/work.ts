import type { WorkItem } from "@/lib/types/content"

// ─── SEQUENCE ────────────────────────────────────────────────────────────────
// Reorder slugs here to change display order.
// Positions 0-1 → featured (larger title in WorkIndex).

const SEQUENCE: string[] = [
  "agent-commerce",
  "white-label-rfp",
  "d2c-platform",
  "citizen-safety",
  "email-builder",
]

// ─── CASE STUDY DEFINITIONS ──────────────────────────────────────────────────

const ITEMS: Omit<WorkItem, "order">[] = [
  {
    category: "AI Commerce / Mastercard",
    title: "Agent Pay: Designing trust for AI-led payments",
    description:
      "Built the trust framework and React demo used in a CPO-led Money20/20 showcase.",
    image: "/assets/images/work/agent-commerce.jpg",
    href: "/work/agent-commerce",
    metric: "CPO-led Money20/20 demo for AI-led payments.",
    tags: ["Trust UX", "AI Payments", "Prototype"],
    featured: true,
  },
  {
    category: "Demo Systems / Mastercard",
    title: "PartnerBank: A demo system for global RFPs",
    description:
      "Cut custom demo prep from days to same-day configuration.",
    image: "/assets/images/work/white-label-platform.jpg",
    href: "/work/white-label-rfp",
    metric: "Days → same-day demo turnaround.",
    tags: ["Demo Systems", "RFPs", "Scale"],
    featured: true,
  },
  {
    category: "Commerce Infrastructure / Honasa",
    title: "Honasa: One commerce system for many D2C brands",
    description:
      "Shared checkout, catalog, and campaign patterns without flattening the brands.",
    image: "/assets/images/work/commerce-platform.jpg",
    href: "/work/d2c-platform",
    metric: "3 brands on a shared commerce foundation.",
  },
  {
    category: "0→1 Product / Dror",
    title: "Dror: Building and pivoting a safety product",
    description:
      "Shipped two products, reached ₹1.98Cr revenue, and learned where PMF breaks.",
    image: "/assets/images/work/fintech-ai-system.jpg",
    href: "/work/citizen-safety",
    metric: "₹1.98Cr revenue across two 0→1 products.",
  },
  {
    category: "Design Systems / Mastercard",
    title: "Mastercard Email Builder: Moving teams out of HTML",
    description:
      "50+ components and 28 templates helped teams ship on-brand emails without code.",
    image: "/assets/images/work/design-tokens.jpg",
    href: "/work/email-builder",
    metric: "50+ components / 28 templates shipped.",
  },
]

// ─── DERIVED EXPORT ───────────────────────────────────────────────────────────

const slugOf = (href: string) => href.replace("/work/", "")
const itemsBySlug = Object.fromEntries(ITEMS.map((item) => [slugOf(item.href), item]))

export const workItems: WorkItem[] = SEQUENCE.map((slug, i) => ({
  ...itemsBySlug[slug],
  order: i + 1,
}))
