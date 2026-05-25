import type { SystemItem } from "@/lib/types/content"

export const systemItems: SystemItem[] = [
  {
    category:    "Design System",
    title:       "Multi-Brand Theming & Token System",
    description: "Established a token architecture that lets multiple brands share one product foundation — with full visual differentiation and zero duplication across teams.",
    image:       "/assets/images/work/design-tokens.jpg",
    href:        "/systems/theming-token-system",
    ctaLabel:    "Explore system",
    accent:      "linear-gradient(135deg, #f97316 0%, #ea580c 50%, #c2410c 100%)",
    tags:        ["Design Tokens", "Multi-Brand", "Theming", "System Architecture"],
    problem:     "Seven brands. One product codebase. Every team maintaining their own component forks — and diverging faster than they could be reconciled. Each brand release was a manual exercise in propagating changes through dozens of isolated files. The inconsistency was invisible at the component level and catastrophic at the product level.",
    stats: [
      { value: "7",   label: "brands on one system" },
      { value: "340+", label: "tokens defined" },
      { value: "60%", label: "reduction in brand-switch time" },
      { value: "0",   label: "duplicated component forks" },
    ],
    sections: [
      {
        heading: "The Fragmentation Problem",
        body: "When each brand maintains its own component library, the first consequence is drift. Buttons look similar but aren't — border radius here, shadow there, hover state that nobody documented. Then one team fixes a bug in their fork and four other brands keep the bug. Then a new engineer joins and asks which library to use and gets five different answers.\n\nThe root cause isn't the brands — it's the absence of a shared source of truth. Design tokens are that source: a named layer of decisions that sits above any individual brand and makes the distinctions between brands explicit and manageable.",
      },
      {
        body: "A token system's value isn't the tokens — it's the contract they create between design and engineering. When the same name resolves correctly in every context, teams stop duplicating decisions and start building on them.",
        type: "quote",
      },
      {
        heading: "Three-Layer Token Architecture",
        body: "The system is structured in three layers. Global tokens define the raw palette — every colour, size, and spacing value the system will ever use. Semantic tokens map global values to purpose: `color.text.primary` or `color.surface.warning`. Brand tokens override semantic tokens at the theme level — so Brand A's primary becomes `#1a56db` and Brand B's becomes `#7c3aed`, but both resolve the same semantic names.\n\nThis layering means UI components reference only semantic tokens. Switching brand is switching which theme file loads — not which components are used.",
      },
      {
        heading: "Rolling Out Across Teams",
        body: "Migration strategy mattered as much as the architecture. Teams couldn't drop existing components overnight. The rollout used a deprecation-first approach: parallel tokens with the old naming convention were marked deprecated, new semantic names introduced, and a six-week window gave teams time to migrate at their own pace.\n\nThe constraint that made this work was tooling: a token linter added to every PR pipeline flagged deprecated token usage before it merged. The migration became self-enforcing.",
      },
      {
        body: "Linting tokens at the PR level was the decision that compressed the migration from estimated quarters to six weeks. Infrastructure that makes the right thing easy and the wrong thing visible is worth more than any amount of documentation.",
        type: "callout",
      },
      {
        heading: "Outcomes",
        body: "After the migration, a full brand switch — previously a multi-day exercise involving manual file updates across teams — became a one-line theme import. New brand onboarding dropped from three weeks to under four days. Teams stopped maintaining forks and started contributing back to the shared system, because contributing back had lower friction than maintaining a divergent copy.",
      },
    ],
    visuals: [
      {
        kind:   "token-tree",
        title:  "Token Layer Architecture",
        layers: [
          {
            name:    "Global Tokens",
            desc:    "Raw values — the full palette and scale",
            example: "blue-600 = #2563eb",
            color:   "#64748b",
          },
          {
            name:    "Semantic Tokens",
            desc:    "Named by intent, not value",
            example: "color.action.primary → blue-600",
            color:   "#f97316",
          },
          {
            name:    "Brand Tokens",
            desc:    "Per-brand overrides of semantic layer",
            example: "brand-a.action.primary → indigo-700",
            color:   "#8b5cf6",
          },
          {
            name:    "Component Tokens",
            desc:    "Component-scoped aliases (optional)",
            example: "button.bg → color.action.primary",
            color:   "#10b981",
          },
        ],
      },
      {
        kind:  "swatches",
        title: "Semantic Colour Roles",
        groups: [
          {
            label:  "Action",
            colors: [
              { name: "Primary",   hex: "#ea580c" },
              { name: "Secondary", hex: "#fed7aa" },
              { name: "Hover",     hex: "#c2410c" },
            ],
          },
          {
            label:  "Surface",
            colors: [
              { name: "Default",  hex: "#ffffff", light: true },
              { name: "Subtle",   hex: "#f8fafc", light: true },
              { name: "Elevated", hex: "#f1f5f9", light: true },
            ],
          },
          {
            label:  "Feedback",
            colors: [
              { name: "Success", hex: "#10b981" },
              { name: "Warning", hex: "#f59e0b" },
              { name: "Error",   hex: "#ef4444" },
            ],
          },
        ],
      },
    ],
    components: [
      {
        name:        "ThemeProvider",
        description: "Wraps the app and resolves the active brand token set. Supports runtime switching with no re-renders.",
        tags:        ["React Context", "SSR-safe", "Zero flicker"],
      },
      {
        name:        "TokenAudit CLI",
        description: "Scans a codebase for deprecated token usage and generates a migration report with suggested replacements.",
        tags:        ["Node.js", "CI integration", "Auto-fix"],
      },
      {
        name:        "BrandConfig Schema",
        description: "JSON schema defining what a valid brand override file must contain. Prevents misconfigured themes from shipping.",
        tags:        ["JSON Schema", "Validation", "Brand onboarding"],
      },
      {
        name:        "DesignToken Linter",
        description: "ESLint plugin that flags hardcoded colour and spacing values, enforcing token usage at the PR level.",
        tags:        ["ESLint", "Stylelint", "Pre-commit"],
      },
    ],
    takeaways: [
      "Three-layer token architecture (global → semantic → brand) makes brand switching a theme swap, not a migration",
      "Tooling that enforces the right pattern at PR time compresses adoption timelines from months to weeks",
      "Deprecation-first rollouts allow gradual migration without blocking existing teams",
      "The system's value is the contract it creates, not the tokens themselves",
    ],
  },

  {
    category:    "Product System",
    title:       "Fintech & AI Interface System",
    description: "Defined interface patterns for regulated fintech and AI-driven products — covering risk states, compliance disclosures, and explainability under real production constraints.",
    image:       "/assets/images/work/fintech-ai-system.jpg",
    href:        "/systems/fintech-ai-interface",
    ctaLabel:    "Explore system",
    accent:      "linear-gradient(135deg, #0ea5e9 0%, #0284c7 50%, #075985 100%)",
    tags:        ["Fintech", "AI Design", "Risk States", "Compliance", "Explainability"],
    problem:     "Financial and AI interfaces share a problem generic design systems don't solve: consequence. A poorly labelled risk state isn't a UX issue — it's a liability. An AI recommendation without appropriate confidence framing isn't a copy problem — it's a trust failure waiting to happen. Off-the-shelf component libraries weren't built for these edge cases. We had to define them from scratch.",
    stats: [
      { value: "12",   label: "banking partners live" },
      { value: "40+",  label: "interface patterns defined" },
      { value: "100%", label: "compliance audit pass rate" },
      { value: "3×",   label: "faster regulated feature delivery" },
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
