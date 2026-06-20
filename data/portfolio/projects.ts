import type { PortfolioProject } from "./types"

/* ============================================================================
   PROJECT DATABASE — single source of truth.

   Every project is defined once here. The three per-mode summaries reframe the
   SAME real facts for each audience; impactMetrics are pulled from the existing
   case studies (lib/data/work.ts). Add or edit a project here and it updates
   across /, /design-lead and /pm automatically.

   Real projects map to existing case-study routes:
     agent-pay     → /work/agent-commerce
     partnerbank   → /work/white-label-rfp
     email-builder → /work/email-builder
     honasa        → /work/d2c-platform
     startup-arc   → /work/citizen-safety  (Dror — "Failed vs Scaled" frame)

   Placeholders (mark `placeholder: true`, greppable TODO) await real content.
   ============================================================================ */

export const projects: PortfolioProject[] = [
  {
    id: "agent-pay",
    slug: "agent-commerce",
    title: "Agent Pay: Designing trust for AI-led payments",
    shortTitle: "Agent Pay",
    company: "Mastercard",
    role: "Product Designer · Prototyping",
    timeframe: "2024 — 2025",
    type: "AI Commerce",
    defaultSummary:
      "Built the trust framework and React demo behind a CPO-led Money20/20 showcase for AI-initiated payments.",
    designLeadSummary:
      "Defined the trust-UX language for agent-led payments — disclosure, consent and control states — then shipped it as a working React prototype the CPO demoed on stage.",
    pmSummary:
      "Turned an ambiguous agentic-commerce bet into a demoable product: framed the trust problem, prioritised the consent flow, and validated it in front of partners at Money20/20.",
    tags: ["Trust UX", "AI Payments", "0→1", "Prototype"],
    impactMetrics: [
      { value: "Money20/20", label: "CPO-led stage demo" },
      { value: "0→1", label: "Trust framework" },
    ],
    visuals: { image: "/assets/images/work/agent-commerce.jpg", alt: "Agent Pay trust framework" },
    caseStudyUrl: "/work/agent-commerce",
    caseStudyReady: true,
    status: "featured",
  },
  {
    id: "email-builder",
    slug: "email-builder",
    title: "Mastercard Email Builder: Moving teams out of HTML",
    shortTitle: "Email Builder",
    company: "Mastercard",
    role: "Design Systems",
    timeframe: "2023 — 2024",
    type: "Design System",
    defaultSummary:
      "A component-driven builder — 50+ components and 28 templates — that let teams ship on-brand emails without writing code.",
    designLeadSummary:
      "Designed and governed a 50+ component library and 28 templates with reusable tokens, so non-designers could assemble on-brand email without touching HTML — design quality made repeatable at scale.",
    pmSummary:
      "Removed a recurring bottleneck: teams were blocked on hand-coded email. Shipped a builder that scaled output (50+ components, 28 templates) and cut dependency on design and engineering.",
    tags: ["Design Systems", "Tokens", "Governance", "Components"],
    impactMetrics: [
      { value: "50+", label: "Components" },
      { value: "28", label: "Templates shipped" },
    ],
    visuals: { image: "/assets/images/work/design-tokens.jpg", alt: "Email Builder design system" },
    caseStudyUrl: "/work/email-builder",
    caseStudyReady: true,
    status: "featured",
  },
  {
    id: "partnerbank",
    slug: "white-label-rfp",
    title: "PartnerBank: A demo system for global RFPs",
    shortTitle: "PartnerBank",
    company: "Mastercard",
    role: "Design Systems · Prototyping",
    timeframe: "2023 — 2024",
    type: "Demo System",
    defaultSummary:
      "A configurable demo platform that cut custom RFP prep from days to same-day turnaround.",
    designLeadSummary:
      "Architected a white-label demo system with a reusable component model and theming layer, so a single design foundation could be re-skinned per bank — same-day instead of bespoke builds.",
    pmSummary:
      "Identified that bespoke RFP demos were burning days of effort per deal. Built a configurable platform that delivered same-day demos and directly supported sales motion.",
    tags: ["Demo Systems", "RFPs", "Scale", "Theming"],
    impactMetrics: [
      { value: "Same-day", label: "RFP demo turnaround" },
      { value: "Days saved", label: "per RFP" },
    ],
    visuals: { image: "/assets/images/work/white-label-platform.jpg", alt: "PartnerBank demo system" },
    caseStudyUrl: "/work/white-label-rfp",
    caseStudyReady: true,
    status: "featured",
  },
  {
    id: "lythouse",
    slug: "lythouse",
    // TODO(amritansh): real content — title, company, role, summaries, metrics, image, case study.
    title: "Lythouse: [TODO — product one-liner]",
    shortTitle: "Lythouse",
    company: "Lythouse",
    role: "Product · Design",
    timeframe: "TODO",
    type: "Product",
    defaultSummary:
      "TODO(amritansh): short product story — what Lythouse is and the outcome you drove.",
    designLeadSummary:
      "TODO(amritansh): design-lead angle — systems, craft, or UX scale on Lythouse.",
    pmSummary:
      "TODO(amritansh): PM angle — the problem, the decision, the metric moved on Lythouse.",
    tags: ["TODO", "Product"],
    impactMetrics: [{ value: "TODO", label: "key metric" }],
    visuals: { image: "/assets/images/work/fintech-ai-system.jpg", alt: "Lythouse" },
    caseStudyUrl: "/work/lythouse",
    caseStudyReady: false,
    status: "featured",
    placeholder: true,
  },
  {
    id: "honasa",
    slug: "d2c-platform",
    title: "Honasa: One commerce system for many D2C brands",
    shortTitle: "Honasa / Mamaearth",
    company: "Honasa Consumer (Mamaearth)",
    role: "Product Designer",
    timeframe: "2021 — 2022",
    type: "Commerce Infrastructure",
    defaultSummary:
      "Shared checkout, catalog and campaign patterns across three D2C brands — without flattening their identities.",
    designLeadSummary:
      "Unified three D2C storefronts onto one commerce design foundation: shared checkout, catalog and campaign components with per-brand theming so each brand kept its voice.",
    pmSummary:
      "Consolidated fragmented brand storefronts onto a shared commerce platform — three brands on one foundation, reducing duplicated build and speeding campaign launches.",
    tags: ["D2C", "Commerce", "Multi-brand", "Systems"],
    impactMetrics: [
      { value: "3 brands", label: "one commerce system" },
      { value: "Shared", label: "checkout & catalog" },
    ],
    visuals: { image: "/assets/images/work/commerce-platform.jpg", alt: "Honasa commerce system" },
    caseStudyUrl: "/work/d2c-platform",
    caseStudyReady: true,
    status: "supporting",
  },
  {
    id: "startup-arc",
    slug: "citizen-safety",
    title: "Failed vs Scaled: Lessons from two 0→1 products",
    shortTitle: "Failed vs Scaled",
    company: "Dror · DUIT · PickMyWork",
    role: "Founding Product & Design",
    timeframe: "College — early career",
    type: "0→1 Product Lessons",
    defaultSummary:
      "Shipped two early-stage products, reached ₹1.98Cr revenue, and learned first-hand where product–market fit breaks.",
    designLeadSummary:
      "Two 0→1 builds, two outcomes: a reflection on the design and product decisions that scaled one and stalled another — framed as product learning, not a résumé line.",
    pmSummary:
      "A candid PM teardown of two 0→1 bets (one scaled to ₹1.98Cr, one didn't): the demand signals, tradeoffs and PMF breakpoints I'd read differently today.",
    tags: ["0→1", "PMF", "Startup Lessons"],
    impactMetrics: [
      { value: "₹1.98Cr", label: "revenue (scaled)" },
      { value: "2", label: "0→1 products" },
    ],
    visuals: { image: "/assets/images/work/fintech-ai-system.jpg", alt: "Startup lessons" },
    caseStudyUrl: "/work/citizen-safety",
    caseStudyReady: true,
    status: "supporting",
  },
]

export const projectById: Record<string, PortfolioProject> = Object.fromEntries(
  projects.map((p) => [p.id, p]),
)
