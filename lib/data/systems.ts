import type { SystemItem } from "@/lib/types/content"

export const systemItems: SystemItem[] = [
  {
    category:    "Design System",
    title:       "Premium Fintech Design System UI Kit",
    description: "A reusable digital finance UI kit for dashboards, payments, cards, wallets, transactions, analytics, onboarding, account management, and financial insights.",
    image:       "/assets/images/work/fintech-ai-system.jpg",
    href:        "/systems/fintech-ai-interface",
    ctaLabel:    "Explore system",
    accent:      "linear-gradient(135deg, #050806 0%, #0b120d 58%, #00c853 100%)",
    tags:        ["Fintech", "UI Kit", "Mobile Wallet", "Payments", "Financial UX"],
    problem:     "Digital finance products need interfaces that are calm under density, precise around money movement, and explicit when risk or compliance changes the user decision. This system turns those requirements into reusable foundations, components, and financial UX patterns for web and mobile product teams.",
    stats: [
      { value: "64+", label: "component specimens" },
      { value: "16",  label: "financial color roles" },
      { value: "15",  label: "money movement patterns" },
      { value: "2",   label: "light and dark modes" },
    ],
    sections: [
      {
        heading: "Why Generic Systems Fall Short",
        body: "Most design systems are built for consumer products — where the worst outcome of a confusing interaction is abandonment. In fintech, the worst outcome is a mistaken transfer, a missed disclosure, or a user acting on AI-generated advice they didn't understand.\n\nThe interface patterns required for these contexts are absent from Tailwind, Material, or Radix. There's no 'irreversible action' component. No 'AI confidence' indicator. No 'regulatory disclosure' template. These had to be invented, tested, and documented as first-class primitives.",
      },
      {
        body: "In high-stakes interfaces, the design system's job isn't to speed up development — it's to prevent the class of errors that only manifest in production at scale. Patterns for risk, confidence, and compliance need to be boring and consistent by design.",
        type: "quote",
      },
      {
        heading: "Risk State Framework",
        body: "The system defines four risk tiers — informational, caution, high-risk, and critical-irreversible — each with consistent visual language, required copy patterns, and mandated interaction constraints. A critical-irreversible action must include a confirmation step with explicit consequence statement. This isn't a guideline — it's enforced at the component level.\n\nThe tier system emerged from working with compliance and legal teams on what constitutes adequate disclosure. Design translated regulatory requirement into interaction constraint, and the constraint became a component prop.",
      },
      {
        heading: "Designing for AI Explainability",
        body: "AI-surfaced recommendations in financial contexts carry a specific design burden: users need to be able to trust them, question them, and override them — all without feeling like they're fighting the product.\n\nThe system defines three explainability patterns. Summary-first: lead with the recommendation, expand to reasoning on demand. Confidence framing: surface uncertainty explicitly for high-stakes decisions, suppress it for routine ones. Override affordance: every AI recommendation must have a clear, non-stigmatising path to user override.",
      },
      {
        body: "AI features in regulated contexts aren't done when they work correctly — they're done when a compliance officer can look at the interface and confirm that the disclosure is adequate and the override path is present.",
        type: "callout",
      },
      {
        heading: "Compliance Integration",
        body: "Regulatory requirements vary by market and product type. Rather than building per-market component variants, the system uses a disclosure slot — a standardised space in every high-stakes flow where compliance copy renders based on jurisdiction configuration. Design owns the template; legal owns the copy; the component ensures neither can be omitted.\n\nThe slot pattern reduced time-to-compliance-sign-off from three weeks to under five days by eliminating the back-and-forth on where copy would appear and how it would be formatted.",
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
        description: "Wraps any action with risk-tier-aware confirmation logic. Tier prop drives copy templates, required acknowledgements, and confirmation step requirements.",
        tags:        ["Composable", "Tier-aware", "Compliance-ready"],
      },
      {
        name:        "AIRecommendation",
        description: "Renders an AI-generated suggestion with configurable confidence framing, expandable reasoning panel, and accessible override affordance.",
        tags:        ["Explainability", "Progressive disclosure", "Override-safe"],
      },
      {
        name:        "DisclosureSlot",
        description: "Jurisdiction-aware disclosure container. Renders compliance copy from configuration; errors in missing copy rather than silently omitting it.",
        tags:        ["Compliance", "i18n-ready", "Fail-loud"],
      },
      {
        name:        "ConfidenceIndicator",
        description: "Communicates model certainty using a tiered visual language — suppressed for routine tasks, explicit for high-stakes decisions.",
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
