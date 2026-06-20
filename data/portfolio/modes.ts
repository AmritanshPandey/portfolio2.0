import type { ModeConfig, PortfolioMode } from "./types"

/* ============================================================================
   PORTFOLIO MODES — the engine's content configuration.

   Each mode reuses the same components and project database; only hero copy,
   nav labels, mega-menu, section order and emphasis change. Edit ordering or
   labels here — never in the pages.

   Section `id`s are shared anchor names across modes so the navbar/scroll-spy
   stay consistent: work · built · stories · craft · advisory · mentorship ·
   insights · approach · metrics · contact.
   ============================================================================ */

const RESUME = "/resume.pdf"

export const portfolioModes: Record<PortfolioMode, ModeConfig> = {
  /* ───────────────────────── GENERAL ───────────────────────── */
  general: {
    mode: "general",
    label: "General",
    routePath: "/",
    resumeHref: RESUME,
    hero: {
      eyebrow: "Product Thinker · Mastercard · 7 yrs in product",
      lines: ["Designing fintech", "experiences", "that scale globally."],
      introLead: "At Mastercard's Creative Studio,",
      intro: "designing systems and platforms that power global banking partnerships.",
      primaryCta: { label: "View work", href: "#work" },
      secondaryCta: { label: "Resume", href: RESUME },
      proof: [
        "Agent Pay — demoed at Money20/20",
        "PartnerBank — same-day RFP demos",
        "7 years building fintech end to end",
      ],
      tags: ["Fintech", "Systems Builder"],
    },
    nav: [
      { label: "Featured Work", href: "#work" },
      { label: "Product Stories", href: "#stories" },
      { label: "Built Products", href: "#built" },
      { label: "Advisory", href: "#advisory" },
      { label: "Articles", href: "#insights" },
    ],
    megaMenu: [
      {
        heading: "Featured Work",
        items: [
          { label: "Agent Pay", href: "/work/agent-commerce" },
          { label: "Email Builder", href: "/work/email-builder" },
          { label: "PartnerBank", href: "/work/white-label-rfp" },
        ],
      },
      {
        heading: "Product Stories",
        items: [
          { label: "Honasa / Mamaearth", href: "/work/d2c-platform" },
          { label: "Failed vs Scaled", href: "/work/citizen-safety" },
          { label: "Lythouse", href: "#stories" },
        ],
      },
      {
        heading: "Lab · Advisory",
        items: [
          { label: "Built Products", href: "#built" },
          { label: "Advisory", href: "#advisory" },
          { label: "Articles", href: "/articles" },
        ],
      },
    ],
    skills: [
      "Product thinking",
      "Design leadership",
      "Frontend execution",
      "Advisory",
      "Mentorship",
      "0→1 experience",
      "Business impact",
    ],
    sections: [
      {
        key: "featured",
        id: "work",
        title: "Featured Work",
        description:
          "Case studies across AI payments, design systems, and enterprise platforms.",
        bg: "default",
        projectIds: ["agent-pay", "email-builder", "partnerbank"],
      },
      {
        key: "built",
        id: "built",
        title: "Built Products & Prototypes",
        description:
          "Working software, not just screens — frontend fluency as an execution advantage.",
        bg: "muted",
      },
      {
        key: "supporting",
        id: "stories",
        title: "Supporting Product Stories",
        description: "More of the arc — commerce systems and hard-won 0→1 lessons.",
        bg: "default",
        projectIds: ["lythouse", "honasa", "startup-arc"],
      },
      {
        key: "craft",
        id: "craft",
        title: "Visual Craft Explorations",
        description: "Self-directed UI, product, and system explorations.",
        bg: "muted",
      },
      {
        key: "approach",
        id: "approach",
        title: "Approach",
        description:
          "A practical operating model for moving from ambiguity to a decision teams can build from.",
        bg: "default",
      },
      {
        key: "articles",
        id: "insights",
        title: "Insights",
        description:
          "Short essays on systems, incentives, risk, AI trust, and decision-making.",
        bg: "muted",
      },
      {
        key: "advisory",
        id: "advisory",
        title: "Advisory & Startup Foundations",
        description:
          "Fractional and advisory work with founders and early teams.",
        bg: "default",
      },
      {
        key: "mentorship",
        id: "mentorship",
        title: "Mentorship & Teaching",
        description:
          "Designers and students I've mentored, and the programs I've taught.",
        bg: "muted",
      },
      {
        key: "contact",
        id: "contact",
        title: "",
        description: "",
        bg: "default",
      },
    ],
  },

  /* ──────────────────────── DESIGN LEAD ─────────────────────── */
  designLead: {
    mode: "designLead",
    label: "Design Lead",
    routePath: "/design-lead",
    resumeHref: RESUME,
    hero: {
      eyebrow: "Design Lead · Fintech Systems · Mastercard",
      lines: ["Scalable fintech,", "design systems,", "and working prototypes."],
      introLead: "Product-minded Design Lead",
      intro:
        "— building design systems, scalable UX, and the prototypes that prove them.",
      primaryCta: { label: "View case studies", href: "#work" },
      secondaryCta: { label: "Resume", href: RESUME },
      proof: [
        "Email Builder — 50+ components, 28 templates",
        "PartnerBank — a design system for global RFPs",
        "Frontend fluency — prototypes that ship",
      ],
      tags: ["Design Systems", "UX Craft"],
    },
    nav: [
      { label: "Featured Case Studies", href: "#work" },
      { label: "Built Products", href: "#built" },
      { label: "Visual Craft", href: "#craft" },
      { label: "Mentorship", href: "#mentorship" },
      { label: "Advisory", href: "#advisory" },
    ],
    megaMenu: [
      {
        heading: "Featured Case Studies",
        items: [
          { label: "Email Builder", href: "/work/email-builder" },
          { label: "PartnerBank Design System", href: "/work/white-label-rfp" },
          { label: "Agent Pay", href: "/work/agent-commerce" },
        ],
      },
      {
        heading: "Design Stories",
        items: [
          { label: "Honasa / Mamaearth", href: "/work/d2c-platform" },
          { label: "Lythouse", href: "#stories" },
          { label: "Failed vs Scaled", href: "/work/citizen-safety" },
        ],
      },
      {
        heading: "Lab · Craft",
        items: [
          { label: "Built Products", href: "#built" },
          { label: "Visual Craft", href: "#craft" },
          { label: "Mentorship", href: "#mentorship" },
        ],
      },
    ],
    skills: [
      "Design systems",
      "UX craft",
      "Visual polish",
      "Reusable components",
      "Governance",
      "Stakeholder alignment",
      "Design quality at scale",
      "Prototyping",
      "Frontend fluency",
    ],
    sections: [
      {
        key: "featured",
        id: "work",
        title: "Featured Case Studies",
        description:
          "Design systems and scalable fintech UX — craft you can govern and reuse.",
        bg: "default",
        projectIds: ["email-builder", "partnerbank", "agent-pay"],
      },
      {
        key: "built",
        id: "built",
        title: "Built Products & Prototypes",
        description:
          "Frontend fluency as a design execution advantage — real, interactive builds.",
        bg: "muted",
      },
      {
        key: "craft",
        id: "craft",
        title: "Visual Craft Explorations",
        description: "UI concepts, dashboards, and design-system components.",
        bg: "default",
      },
      {
        key: "supporting",
        id: "stories",
        title: "Supporting Stories",
        description: "Multi-brand commerce systems and product lessons.",
        bg: "muted",
        projectIds: ["honasa", "lythouse", "startup-arc"],
      },
      {
        key: "mentorship",
        id: "mentorship",
        title: "Mentorship & Teaching",
        description:
          "Enabling other designers — critique, workshops, and career growth.",
        bg: "default",
      },
      {
        key: "advisory",
        id: "advisory",
        title: "Advisory & Startup Foundations",
        description: "Fractional product and design guidance for early teams.",
        bg: "muted",
      },
      {
        key: "articles",
        id: "insights",
        title: "Writing & Perspective",
        description: "Essays on systems, craft, and designing under uncertainty.",
        bg: "default",
      },
      { key: "contact", id: "contact", title: "", description: "", bg: "muted" },
    ],
  },

  /* ─────────────────────────── PM ───────────────────────────── */
  pm: {
    mode: "pm",
    label: "Product",
    routePath: "/pm",
    resumeHref: RESUME,
    hero: {
      eyebrow: "Product · 0→1 · Metrics-driven",
      lines: ["From ambiguous problems", "to product decisions", "and measurable outcomes."],
      introLead: "Product-focused builder",
      intro:
        "— turning ambiguity into roadmaps, prototypes, and outcomes you can measure.",
      primaryCta: { label: "View product work", href: "#work" },
      secondaryCta: { label: "Resume", href: RESUME },
      proof: [
        "Agent Pay — 0→1 to a Money20/20 stage demo",
        "₹1.98Cr — revenue across two 0→1 products",
        "Demos that move sales and partner decisions",
      ],
      tags: ["Product Strategy", "0→1"],
    },
    nav: [
      { label: "Product Case Studies", href: "#work" },
      { label: "0→1 Work", href: "#built" },
      { label: "Product Decisions", href: "#stories" },
      { label: "Metrics & Impact", href: "#metrics" },
      { label: "Advisory", href: "#advisory" },
    ],
    megaMenu: [
      {
        heading: "Product Case Studies",
        items: [
          { label: "Agent Pay", href: "/work/agent-commerce" },
          { label: "Lythouse", href: "#work" },
          { label: "PartnerBank", href: "/work/white-label-rfp" },
        ],
      },
      {
        heading: "Product Stories",
        items: [
          { label: "Email Builder", href: "/work/email-builder" },
          { label: "Honasa / Mamaearth", href: "/work/d2c-platform" },
          { label: "Failed vs Scaled", href: "/work/citizen-safety" },
        ],
      },
      {
        heading: "0→1 · Metrics",
        items: [
          { label: "0→1 Work", href: "#built" },
          { label: "Metrics & Impact", href: "#metrics" },
          { label: "Advisory", href: "#advisory" },
        ],
      },
    ],
    skills: [
      "Product decisions",
      "Tradeoffs",
      "Metrics",
      "Roadmap thinking",
      "0→1 execution",
      "Business impact",
      "Stakeholder alignment",
      "Experimentation",
    ],
    sections: [
      {
        key: "featured",
        id: "work",
        title: "Product Case Studies",
        description:
          "Ambiguous problems turned into decisions, prototypes, and measurable outcomes.",
        bg: "default",
        projectIds: ["agent-pay", "lythouse", "partnerbank"],
      },
      {
        key: "supporting",
        id: "stories",
        title: "Product Stories",
        description: "Decisions, tradeoffs, and the systems behind them.",
        bg: "muted",
        projectIds: ["email-builder", "honasa", "startup-arc"],
      },
      {
        key: "built",
        id: "built",
        title: "0→1 Work & Prototypes",
        description:
          "Things built to learn fast — prototypes that de-risk the next decision.",
        bg: "default",
      },
      {
        key: "metrics",
        id: "metrics",
        title: "Metrics & Impact",
        description: "Outcomes I've moved, stated plainly.",
        bg: "muted",
      },
      {
        key: "advisory",
        id: "advisory",
        title: "Advisory & Startup Foundations",
        description: "Fractional product guidance and early-stage roadmap support.",
        bg: "default",
      },
      {
        key: "articles",
        id: "insights",
        title: "Product Writing",
        description:
          "Essays on tradeoffs, incentives, 0→1 vs scale, and decision-making.",
        bg: "muted",
      },
      { key: "contact", id: "contact", title: "", description: "", bg: "default" },
    ],
  },
}
