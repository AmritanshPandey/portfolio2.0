import type { WorkItem } from "@/lib/types/content"

// ─── SEQUENCE ────────────────────────────────────────────────────────────────
// Reorder slugs here to change the display order and size tier.
// Positions 0–1  → large cards (top row)
// Positions 2–4  → small cards (bottom row)

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
    category: "AI Commerce · Mastercard",
    title: "Agent Pay — The Silent Guardian · Mastercard's Role in AI-led Payments",
    description:
      "Built the UX research toolkit, multi-sensory trust framework, and the React + Claude AI demo the CPO used at Money20/20. The silent guardian framework — Mastercard invisible by default, visible only at the three moments that matter — is now adopted company-wide.",
    image: "/assets/images/work/agent-commerce.jpg",
    href: "/work/agent-commerce",
    metric: "Silent guardian adopted · CPO demo used at Money20/20 · 6 research flows",
  },
  {
    category: "Design Systems · Mastercard",
    title: "Building a Scalable PartnerBank Design System for Global Product Demos and RFPs",
    description:
      "Built a configurable white-label design system enabling enterprise sales teams to rapidly tailor product narratives and demos for high-stakes RFPs without engineering dependency.",
    image: "/assets/images/work/white-label-platform.jpg",
    href: "/work/white-label-rfp",
    metric: "Reduced demo setup from days to hours across sales cycles",
  },
  {
    category: "Commerce Infrastructure · Honasa",
    title: "Multi-Brand Design System — Enabling Scalable D2C Growth at Honasa",
    description:
      "Architected a shared commerce foundation for multi-brand D2C operations — eliminating duplicated systems while preserving distinct brand experiences at scale.",
    image: "/assets/images/work/commerce-platform.jpg",
    href: "/work/d2c-platform",
    metric: "One platform powering multiple brand storefronts",
  },
  {
    category: "Design Systems · Mastercard",
    title: "Scaling Mastercard's Email System — From HTML Dependency to No-Code Infrastructure",
    description:
      "Owned the component architecture and design system for Mastercard's global email builder — defining what got built, why, and in what order. 50+ components, 28 templates, zero HTML required.",
    image: "/assets/images/work/design-tokens.jpg",
    href: "/work/email-builder",
    metric: "50+ components · 28 templates · Mastercard-wide adoption",
  },
  {
    category: "0→1 Product · Dror",
    title: "Building a Citizen Safety Platform from Scratch — and Pivoting It Under COVID",
    description:
      "Sole PM, designer, and React frontend dev across two products in eleven months — a consumer safety app, a COVID-forced pivot to B2B workplace safety, and a lesson about PMF you can't own.",
    image: "/assets/images/work/fintech-ai-system.jpg",
    href: "/work/citizen-safety",
    metric: "2 products shipped · ₹1.98Cr revenue · $494K raised",
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
