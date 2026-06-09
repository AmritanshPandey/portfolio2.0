import type { SystemItem } from "@/lib/types/content"

export const systemItems: SystemItem[] = [
  {
    category:    "Design System",
    title:       "Fintech Design System UI Kit",
    description: "A reusable finance UI kit for dashboards, payments, wallets, cards, transactions, onboarding, and account management.",
    image:       "/assets/images/work/fintech-ai-system.jpg",
    href:        "/systems/fintech-ai-interface",
    ctaLabel:    "Explore system",
    accent:      "linear-gradient(135deg, #050806 0%, #0b120d 58%, #00c853 100%)",
    tags:        ["Fintech", "UI Kit", "Mobile Wallet", "Payments", "Financial UX"],
    problem:     "Finance products need dense screens, clear money movement, and careful handling of risk. This system turns those needs into reusable foundations, components, and UX patterns for web and mobile teams.",
    stats: [
      { value: "64+", label: "component specimens" },
      { value: "16",  label: "financial color roles" },
      { value: "15",  label: "money movement patterns" },
      { value: "2",   label: "light and dark modes" },
    ],
    sections: [
      {
        heading: "Why Generic Systems Fall Short",
        body: "Most design systems are built for low-risk consumer products. In fintech, a confusing interaction can mean a mistaken transfer, a missed disclosure, or a user following AI advice they did not understand.\n\nTailwind, Material, and Radix do not define patterns for this level of risk. There is no default component for an irreversible action, AI confidence, or regulatory disclosure. Those patterns had to be defined, tested, and documented as part of the kit.",
      },
      {
        body: "In high-stakes interfaces, the system's job is not only speed. It should prevent mistakes that are expensive to find in production. Risk, confidence, and compliance patterns need to be predictable by design.",
        type: "quote",
      },
      {
        heading: "Risk State Framework",
        body: "The system defines four risk tiers: informational, caution, high-risk, and critical-irreversible. Each tier has required copy, visual treatment, and interaction rules. A critical action needs a confirmation step and a clear consequence statement. That rule lives in the component, not only in documentation.\n\nThe tier model came from working with compliance and legal teams on what counted as adequate disclosure. The regulatory need became an interaction constraint, then a component prop.",
      },
      {
        heading: "Designing for AI Explainability",
        body: "AI recommendations in finance need a clear way to be checked. Users should see the recommendation, understand why it appeared when the stakes are high, and be able to override it without friction.\n\nThe system defines three patterns. Summary first: show the recommendation before the reasoning. Confidence framing: show uncertainty when the decision carries risk. Override affordance: every AI recommendation needs a clear path for the user to choose differently.",
      },
      {
        body: "AI features in regulated contexts are not done when the model works. They are done when the interface shows the disclosure clearly and gives the user a visible way to override the recommendation.",
        type: "callout",
      },
      {
        heading: "Compliance Integration",
        body: "Regulatory copy changes by market and product type. Instead of creating separate components for every market, the system uses a disclosure slot in each high-risk flow. Design owns the placement and structure. Legal owns the copy. The component makes sure the slot cannot be skipped.\n\nThis reduced compliance sign-off from three weeks to under five days because teams no longer debated where the copy would go or how it would be formatted.",
      },
    ],
    visuals: [
      {
        kind:   "states",
        title:  "Risk Tier Interface States",
        states: [
          {
            label:       "Informational",
            bg:          "#eff6ff",
            text:        "#1d4ed8",
            description: "Low-stakes context. Provides additional information without requiring action.",
          },
          {
            label:       "Caution",
            bg:          "#fffbeb",
            text:        "#92400e",
            description: "Moderate consequence. Prompts user to confirm intent before proceeding.",
          },
          {
            label:       "High Risk",
            bg:          "#fff1f2",
            text:        "#9f1239",
            description: "Significant financial impact. Requires explicit acknowledgement of consequence.",
          },
          {
            label:       "Critical · Irreversible",
            bg:          "#1c1917",
            text:        "#fef2f2",
            description: "Cannot be undone. Mandates typed confirmation and consequence disclosure.",
          },
        ],
      },
      {
        kind:  "type-scale",
        title: "Information Hierarchy Scale",
        steps: [
          { label: "Display",    size: "2rem",       weight: "700", sample: "Transfer Confirmed" },
          { label: "Heading",    size: "1.25rem",    weight: "600", sample: "Account Summary" },
          { label: "Body",       size: "1rem",       weight: "400", sample: "Your balance as of today" },
          { label: "Caption",    size: "0.8125rem",  weight: "400", sample: "Updated 2 minutes ago" },
          { label: "Disclaimer", size: "0.6875rem",  weight: "400", sample: "Subject to regulatory approval" },
        ],
      },
    ],
    components: [
      {
        name:        "RiskGate",
        description: "Wraps risky actions with confirmation rules based on tier, including copy, acknowledgement, and required confirmation steps.",
        tags:        ["Composable", "Tier-aware", "Compliance-ready"],
      },
      {
        name:        "AIRecommendation",
        description: "Shows an AI suggestion with confidence framing, optional reasoning, and a clear override path.",
        tags:        ["Explainability", "Progressive disclosure", "Override-safe"],
      },
      {
        name:        "DisclosureSlot",
        description: "Shows disclosure copy from market configuration and errors when required copy is missing.",
        tags:        ["Compliance", "i18n-ready", "Fail-loud"],
      },
      {
        name:        "ConfidenceIndicator",
        description: "Shows model certainty only when the decision needs it, with stronger treatment for high-risk choices.",
        tags:        ["AI UX", "Context-sensitive", "Accessible"],
      },
    ],
    takeaways: [
      "Risk states require component-level enforcement, not just design guidelines",
      "AI explainability patterns must be designed for the stakes of the task, not the capability of the model",
      "A disclosure slot pattern separates design ownership from legal copy ownership while guaranteeing neither can be omitted",
      "Compliance sign-off speed is a design metric in regulated product contexts",
    ],
  },
]
