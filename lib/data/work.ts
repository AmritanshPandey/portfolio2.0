import type { WorkItem } from "@/lib/types/content"

// ─── SEQUENCE ────────────────────────────────────────────────────────────────
// Reorder slugs here to change display order.
// Role, problem (description) and outcome (metric) are taken from each case
// study's own summary; don't add a figure the case study doesn't state.
// `working` is taken from the key decision in the study, in its own words.

const SEQUENCE: string[] = [
  "white-label-rfp",
  "agent-commerce",
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
    byline: "Design lead at Mastercard",
    image: "/assets/images/work/white-label-platform.jpg",
    href: "/work/white-label-rfp",
    metric: "A per-deal demo went from about 10 days to about 3; the library grew from 8 to 31 components in six months.",
    tags: ["Demo Systems", "RFPs", "Scale"],
    featured: true,
    working: {
      pressure: "Each prospect's brand was applied by hand across dozens of files: a redesign every deal.",
      call: "Moved brand identity into one token configuration: colour, type, radius, elevation.",
      cost: "The schema took more definition than expected, and some bespoke requests still needed manual overrides.",
    },
  },
  {
    category: "Agentic Commerce / Mastercard",
    title: "Agent Pay: Mastercard's role in AI-led payments",
    description:
      "Agentic commerce removes the checkout screen, and with it the moment people see Mastercard and feel safe.",
    role: "Lead · Creative Studio",
    byline: "Lead, Creative Studio at Mastercard",
    image: "/assets/images/work/agent-commerce.jpg",
    href: "/work/agent-commerce",
    metric: "The silent guardian became Mastercard's direction for agentic commerce.",
    working: {
      pressure: "Brand wanted the logo present at every stage.",
      call: "Mastercard stays hidden by default and shows up at three moments: payment confirmation, identity verification, and completion.",
      cost: "Pushing back on the team that owns the brand meant arguing it as product strategy, not taste.",
    },
  },
  {
    category: "Commerce Infrastructure / Honasa",
    title: "Honasa: One commerce system for many D2C brands",
    description:
      "Three brands sold almost entirely through marketplaces and needed their own storefronts in eight weeks, with no design system.",
    role: "First in-house UX designer",
    byline: "First in-house UX designer at Honasa",
    image: "/assets/images/work/commerce-platform.jpg",
    href: "/work/d2c-platform",
    metric: "All three storefronts shipped in the window on one shared system, with no critical post-launch bugs.",
    working: {
      pressure: "Stakeholders wanted wishlists, recommendations, loyalty, and bundles in v1, which would miss the sale window.",
      call: "Kept only PDP, cart, checkout, and confirmation, with a written reason for every deferral.",
      cost: "Personalisation waited a quarter, which frustrated some stakeholders.",
    },
  },
  {
    category: "0→1 Product / Dror",
    title: "Dror: Building and pivoting a safety product",
    description:
      "A 10-person startup's consumer safety app lost its use case to COVID lockdowns before it could make money.",
    role: "Sole PM and designer",
    byline: "Sole PM and designer at DROR Labs (later Lythouse)",
    image: "/assets/images/work/fintech-ai-system.jpg",
    href: "/work/citizen-safety",
    metric: "The B2B pivot shipped in six weeks and reached ₹1.98Cr lifetime revenue.",
    working: {
      pressure: "V1 requests included community reporting, live tracking, emergency calls, and driving tools.",
      call: "Ship one action: one-tap SOS plus safety-circle setup. In a trust product, one failure loses the user.",
      cost: "A thinner V1 than stakeholders expected.",
    },
  },
  {
    category: "Design Systems / Mastercard",
    title: "Mastercard Email Builder: Moving teams out of HTML",
    description:
      "Custom emails needed HTML, so teams waited on agencies or fell back to outdated templates.",
    role: "Design System Lead",
    byline: "Design system lead at Mastercard",
    image: "/assets/images/work/design-tokens.jpg",
    href: "/work/email-builder",
    metric: "A no-code builder on 50+ Outlook-safe components and 28 templates, adopted Mastercard-wide.",
    working: {
      pressure: "Stakeholders wanted multi-column layouts, custom fonts, and dynamic CTAs that Outlook couldn't render reliably.",
      call: "Simplify the design instead of hacking around Outlook.",
      cost: "Saying no, repeatedly, with Global Brand backing the line.",
    },
  },
]

// ─── DERIVED EXPORT ───────────────────────────────────────────────────────────

const slugOf = (href: string) => href.replace("/work/", "")
const itemsBySlug = Object.fromEntries(ITEMS.map((item) => [slugOf(item.href), item]))

export const workItems: WorkItem[] = SEQUENCE.map((slug, i) => ({
  ...itemsBySlug[slug],
  order: i + 1,
}))
