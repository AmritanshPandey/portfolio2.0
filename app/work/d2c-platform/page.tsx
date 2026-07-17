import Image from "next/image"
import {
  CsHeroShell,
  CsSection,
  CsDecision,
  CsList,
  CsInfoBar,
  CsFeature,
  CsBeforeAfter,
  CsArchStack,
  CsMetricBars,
  CsTimeline,
  CsNextStudies,
  CsChapterNav,
  CsProvenance,
  CsSummary,
  CsPrinciples,
  CsOptions,
  CsQuote,
  CsReflection,
  BrowserFrame,
} from "@/components/case-study"
import { FadeIn } from "@/components/shared/fade-in"

// ─── CHAPTERS ────────────────────────────────────────────────────────────────

const CHAPTERS = [
  { id: "situation",        label: "Situation" },
  { id: "problem",          label: "Problem" },
  { id: "what-i-led",       label: "What I led" },
  { id: "principles",       label: "Principles" },
  { id: "architecture",     label: "Architecture" },
  { id: "key-decisions",    label: "Decisions" },
  { id: "core-flows",       label: "Core flows" },
  { id: "tokens",           label: "Tokens in action" },
  { id: "the-shift",        label: "The shift" },
  { id: "what-changed",     label: "What changed" },
  { id: "how-we-got-there", label: "Timeline" },
  { id: "reflection",       label: "Reflection" },
]

// ─── BRAND COLORS ─────────────────────────────────────────────────────────────
// The real storefront accents — this is the token layer that varies per brand.
const BRAND = {
  mamaearth: "#00AFEF",
  dermaco: "#217A6E",
  aqualogica: "#0066CC",
} as const

// ─── TIMELINE DATA ──────────────────────────────────────────────────────────

const TIMELINE = [
  { week: "Week 1–2",   label: "Discovery",           detail: "Stakeholder interviews, competitor audits, analytics review, and constraint mapping across all three brands." },
  { week: "Week 3–4",   label: "System Architecture",  detail: "Defined shared component boundaries, brand token structure, and MVP feature scope through a prioritization matrix." },
  { week: "Week 5–6",   label: "Design & Prototype",   detail: "Designed all core flows across three brands simultaneously using the shared system. Internal reviews with brand teams and engineering." },
  { week: "Week 7",     label: "Engineering Handoff",  detail: "Component-by-component spec delivery with edge case documentation, responsive specs, and interaction notes." },
  { week: "Week 8",     label: "Launch",               detail: "Staged release across Mamaearth, The Derma Co., and Aqualogica storefronts. Real-time monitoring and rapid iteration." },
  { week: "Post-Launch", label: "System Iteration",    detail: "Token architecture refactor, Storybook setup, and v2 roadmap scoped from live user behavior data and brand team feedback." },
]

// ─── HERO ────────────────────────────────────────────────────────────────────

/** Signature visual — one shared backbone, three brand token sets. */
function HeroAside() {
  const brands = [
    { name: "Mamaearth",     accent: BRAND.mamaearth,  token: "--brand-cyan", product: "Vitamin C" },
    { name: "The Derma Co.", accent: BRAND.dermaco,    token: "--brand-teal", product: "AHA · BHA" },
    { name: "Aqualogica",    accent: BRAND.aqualogica, token: "--brand-blue", product: "Glow+ Dew" },
  ]
  return (
    <div className="rounded-2xl border border-border bg-card/70 p-5 backdrop-blur-sm shadow-[0_12px_34px_-30px_rgba(0,0,0,0.38)] dark:shadow-[0_30px_70px_-40px_rgba(0,0,0,0.55)]">
      {/* Shared system base */}
      <div className="flex items-center justify-between rounded-xl border border-border/70 bg-muted/40 px-3.5 py-3 mb-3">
        <div className="flex items-center gap-2">
          <span className="grid h-6 w-6 place-items-center rounded-md bg-foreground text-[10px] font-bold text-background">S</span>
          <span className="text-[12px] font-medium text-foreground">Shared component system</span>
        </div>
        <span className="font-mono text-[10px] text-muted-foreground">PDP · Cart · Checkout</span>
      </div>

      {/* Fan-out connector */}
      <div className="flex justify-center text-muted-foreground/50">
        <svg width="100%" height="16" viewBox="0 0 220 16" className="max-w-[220px]" fill="none" stroke="currentColor" strokeWidth="1">
          <path d="M110 0 V6 M110 6 H40 V16 M110 6 H110 V16 M110 6 H180 V16" />
        </svg>
      </div>

      {/* Three brand skins */}
      <div className="grid grid-cols-3 gap-2">
        {brands.map(b => (
          <div key={b.name} className="rounded-xl border border-border/70 bg-background/60 p-2.5 flex flex-col gap-2">
            <div className="h-10 rounded-md" style={{ background: `linear-gradient(135deg, ${b.accent}, color-mix(in srgb, ${b.accent} 55%, #000))` }} />
            <div>
              <p className="text-[10px] font-semibold text-foreground leading-tight truncate">{b.name}</p>
              <p className="text-[9px] text-muted-foreground truncate">{b.product}</p>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="h-2.5 w-2.5 rounded-full shrink-0" style={{ background: b.accent }} />
              <span className="font-mono text-[8px] text-muted-foreground truncate">{b.token}</span>
            </div>
          </div>
        ))}
      </div>

      <p className="mt-4 pt-3 border-t border-border/60 text-[11px] text-muted-foreground">
        One backbone · three token sets · eight weeks
      </p>
    </div>
  )
}

function Hero() {
  return (
    <CsHeroShell
      breadcrumb={{ kind: "Case Study", category: "D2C Commerce", client: "Honasa Consumer" }}
      keywords={["First In-House UX Designer", "0→1 Commerce Foundations", "Multi-Brand Scale"]}
      title={
        <>
          One System.{" "}
          <em className="not-italic text-accent">Three Brands.</em>{" "}
          Eight Weeks.
        </>
      }
      lede={
        <>
          Built and scaled first-party commerce experiences across Mamaearth,{" "}
          <strong className="font-medium text-foreground">The Derma Co., and Aqualogica</strong>{" "}
          by establishing <strong className="font-medium text-foreground">reusable UX foundations</strong>,{" "}
          shared commerce patterns, and{" "}
          <strong className="font-medium text-foreground">scalable product systems</strong>{" "}
          under rapid growth constraints.
        </>
      }
      meta={{
        role:         "First In-House UX Designer",
        platform:     "Web + Mobile",
        scope:        "Multi-Brand Commerce",
        organisation: "Honasa Consumer Limited",
      }}
      readTime="12 min read"
      publishedDate="June 2022"
      topics={["Systems", "Process", "Outcome"]}
      asideLabel="Multi-brand model"
      asideCol="340px"
      aside={<HeroAside />}
    />
  )
}

// ─── CORE FLOW VISUALS ──────────────────────────────────────────────────────

function PdpVisual() {
  const proofItems = [
    { label: "Ingredient proof", value: "Persistent drawer" },
    { label: "Trust badges", value: "Reusable system block" },
    { label: "Sticky CTA", value: "Always within reach" },
  ]

  return (
    <div className="relative h-full w-full overflow-hidden rounded-xl">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_22%_14%,rgba(244,63,94,0.10),transparent_34%),linear-gradient(135deg,rgba(0,0,0,0.025),transparent_48%)] dark:bg-[radial-gradient(circle_at_22%_14%,rgba(244,63,94,0.16),transparent_36%),linear-gradient(135deg,rgba(255,255,255,0.04),transparent_48%)]" />
      <div className="absolute inset-0 bg-[linear-gradient(to_right,var(--border)_1px,transparent_1px),linear-gradient(to_bottom,var(--border)_1px,transparent_1px)] bg-[size:40px_40px] opacity-[0.11] dark:opacity-[0.08]" />

      <div className="relative grid h-full grid-rows-[auto_1fr_auto] gap-3 p-3">
        <div className="flex items-center justify-between">
          <div>
            <p className="font-mono text-[10px] font-semibold uppercase tracking-[0.18em] text-muted-foreground">
              PDP focus
            </p>
            <p className="mt-1 text-sm font-medium text-foreground">
              Purchase proof moved above checkout
            </p>
          </div>
          <div className="rounded-full border border-accent/30 bg-accent/10 px-3 py-1.5 text-right">
            <p className="text-lg font-semibold leading-none text-accent">68%</p>
            <p className="mt-0.5 text-[9px] text-muted-foreground">pre-checkout</p>
          </div>
        </div>

        <div className="grid min-h-0 grid-cols-[0.95fr_1.25fr] gap-3">
          <div className="relative overflow-hidden rounded-2xl border border-border bg-background/78 p-4 shadow-[0_18px_48px_-36px_rgba(0,0,0,0.5)] backdrop-blur-sm">
            <div className="absolute inset-x-0 top-0 h-1 bg-accent" />
            <div className="relative h-full rounded-xl bg-muted/70 p-3">
              <div className="flex h-full items-center justify-center rounded-lg bg-background/80">
                <div className="h-20 w-20 rounded-full border border-accent/55 bg-accent/10 shadow-[0_0_40px_rgba(244,63,94,0.10)]" />
              </div>
            </div>
          </div>

          <div className="grid min-h-0 grid-rows-[auto_1fr] gap-3">
            <div className="rounded-2xl border border-border bg-background/78 p-4 backdrop-blur-sm">
              <div className="mb-3 flex items-start justify-between gap-4">
                <div className="space-y-2">
                  <div className="h-2.5 w-36 rounded-full bg-foreground" />
                  <div className="h-2 w-24 rounded-full bg-muted-foreground/45" />
                </div>
                <span className="rounded-full border border-accent/35 bg-accent/10 px-2.5 py-1 text-[10px] font-medium text-accent">
                  PDP
                </span>
              </div>

              <div className="grid grid-cols-4 gap-1.5">
                {["Browse", "PDP", "Cart", "Pay"].map((step, index) => (
                  <div key={step} className="space-y-1.5">
                    <div
                      className={`h-8 rounded-lg border ${
                        index === 1
                          ? "border-accent bg-accent/15"
                          : "border-border bg-muted/70"
                      }`}
                    />
                    <p className={`text-center text-[9px] ${index === 1 ? "text-accent" : "text-muted-foreground"}`}>
                      {step}
                    </p>
                  </div>
                ))}
              </div>
            </div>

            <div className="grid min-h-0 grid-cols-3 gap-2">
              {proofItems.map(item => (
                <div
                  key={item.label}
                  className="flex min-w-0 flex-col justify-between rounded-2xl border border-border bg-background/72 p-3 backdrop-blur-sm"
                >
                  <div>
                    <div className="mb-2 h-1.5 w-9 rounded-full bg-accent" />
                    <p className="text-[11px] font-medium leading-snug text-foreground">
                      {item.label}
                    </p>
                  </div>
                  <p className="mt-2 text-[10px] leading-snug text-muted-foreground">
                    {item.value}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="rounded-2xl border border-border bg-background/82 p-2 backdrop-blur-sm">
          <div className="flex items-center justify-between gap-3">
            <div className="pl-2">
              <div className="h-2 w-24 rounded-full bg-muted-foreground/45" />
              <div className="mt-1.5 h-2 w-16 rounded-full bg-muted-foreground/25" />
            </div>
            <div className="min-h-10 flex-1 rounded-xl bg-foreground px-4 py-3">
              <div className="mx-auto h-2 w-28 rounded-full bg-background" />
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

function CartVisual() {
  const themes = [
    { name: "Mamaearth", accent: BRAND.mamaearth, tint: "rgba(0,175,239,0.14)", radius: "14px" },
    { name: "Derma Co.", accent: BRAND.dermaco, tint: "rgba(33,122,110,0.14)", radius: "8px" },
    { name: "Aqualogica", accent: BRAND.aqualogica, tint: "rgba(0,102,204,0.14)", radius: "12px" },
  ]

  return (
    <div className="relative h-full w-full overflow-hidden rounded-xl">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_8%,rgba(244,63,94,0.10),transparent_34%),linear-gradient(180deg,rgba(0,0,0,0.025),transparent)] dark:bg-[radial-gradient(circle_at_50%_8%,rgba(244,63,94,0.15),transparent_38%),linear-gradient(180deg,rgba(255,255,255,0.04),transparent)]" />

      <div className="relative grid h-full grid-cols-[1.1fr_0.9fr] gap-4 p-3">
        <div className="flex min-h-0 flex-col justify-between rounded-3xl border border-border bg-background/82 p-4 shadow-[0_20px_56px_-40px_rgba(0,0,0,0.55)] backdrop-blur-sm">
          <div className="flex items-center justify-between border-b border-border/70 pb-3">
            <div>
              <p className="font-mono text-[10px] font-semibold uppercase tracking-[0.18em] text-muted-foreground">
                Shared cart component
              </p>
              <p className="mt-1 text-sm font-medium text-foreground">
                One structure, many skins
              </p>
            </div>
            <span className="rounded-full bg-accent/10 px-3 py-1 text-[10px] font-medium text-accent">
              v1 component
            </span>
          </div>

          <div className="grid min-h-0 gap-2 py-3">
            {[0, 1].map(item => (
              <div key={item} className="grid grid-cols-[48px_1fr_auto] items-center gap-3 rounded-2xl border border-border bg-card/75 p-3">
                <div className="h-12 rounded-xl bg-muted" />
                <div className="space-y-2">
                  <div className="h-2.5 w-36 rounded-full bg-foreground/80" />
                  <div className="h-2 w-24 rounded-full bg-muted-foreground/45" />
                </div>
                <div className="flex items-center gap-1.5 rounded-full border border-border bg-background px-2 py-1">
                  <span className="h-3 w-3 rounded bg-muted" />
                  <span className="h-3 w-4 rounded bg-accent" />
                </div>
              </div>
            ))}
          </div>

          <div className="grid grid-cols-[1fr_auto] gap-3">
            <div className="rounded-2xl border border-border bg-card/75 p-3">
              <div className="mb-2 h-2 w-20 rounded-full bg-muted-foreground/35" />
              <div className="h-2 w-32 rounded-full bg-muted-foreground/20" />
            </div>
            <div className="grid min-w-32 place-items-center rounded-2xl bg-accent px-5">
              <div className="h-2 w-20 rounded-full bg-white/85" />
            </div>
          </div>
        </div>

        <div className="grid min-h-0 gap-2.5">
          {themes.map(theme => (
            <div
              key={theme.name}
              className="grid grid-cols-[auto_1fr] items-center gap-3 rounded-2xl border border-border bg-background/72 p-3 backdrop-blur-sm"
              style={{
                ["--brand" as string]: theme.accent,
                ["--brand-soft" as string]: theme.tint,
                borderRadius: theme.radius,
              }}
            >
              <div className="h-10 w-10 rounded-xl bg-[var(--brand-soft)] ring-1 ring-[var(--brand)]/25" />
              <div className="min-w-0">
                <div className="mb-2 flex items-center justify-between gap-2">
                  <p className="truncate text-[11px] font-semibold" style={{ color: theme.accent }}>
                    {theme.name}
                  </p>
                  <span className="h-2.5 w-8 rounded-full bg-[var(--brand)]" />
                </div>
                <div className="grid grid-cols-3 gap-1.5">
                  <div className="h-7 rounded-lg bg-[var(--brand)]" />
                  <div className="h-7 rounded-lg border border-border bg-card/80" />
                  <div className="h-7 rounded-lg bg-[var(--brand-soft)]" />
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

function CheckoutVisual() {
  const before = ["01", "02", "03", "04", "05", "06"]
  const after = [
    { label: "Delivery", detail: "Address autocomplete" },
    { label: "Payment", detail: "UPI · Cards · COD" },
    { label: "Confirm", detail: "Review + place" },
  ]

  return (
    <div className="relative h-full w-full overflow-hidden rounded-xl">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_18%_20%,rgba(244,63,94,0.10),transparent_34%),linear-gradient(135deg,rgba(0,0,0,0.03),transparent_50%)] dark:bg-[radial-gradient(circle_at_18%_20%,rgba(244,63,94,0.15),transparent_36%),linear-gradient(135deg,rgba(255,255,255,0.04),transparent_50%)]" />

      <div className="relative grid h-full grid-rows-[auto_1fr] gap-4 p-3">
        <div className="grid grid-cols-[1fr_auto] items-center gap-4 rounded-2xl border border-border bg-background/78 p-4 backdrop-blur-sm">
          <div>
            <p className="font-mono text-[10px] font-semibold uppercase tracking-[0.18em] text-muted-foreground">
              Checkout compression
            </p>
            <p className="mt-1 text-sm font-medium text-foreground">
              The form became one focused page.
            </p>
          </div>
          <div className="rounded-full border border-accent/30 bg-accent/10 px-3 py-1.5 text-sm font-semibold text-accent">
            6 → 3
          </div>
        </div>

        <div className="grid min-h-0 grid-cols-[0.9fr_1.1fr] gap-3">
          <div className="flex min-h-0 flex-col justify-between rounded-2xl border border-border bg-background/68 p-4">
            <p className="font-mono text-[10px] uppercase tracking-[0.16em] text-muted-foreground">
              Before · six steps
            </p>
            <div className="grid grid-cols-3 gap-2">
              {before.map(step => (
                <div key={step} className="grid h-14 place-items-center rounded-xl border border-border bg-muted/50 text-[11px] text-muted-foreground">
                  {step}
                </div>
              ))}
            </div>
            <p className="text-xs leading-snug text-muted-foreground">
              More screens, more waiting, more abandonment before completion.
            </p>
          </div>

          <div className="flex min-h-0 flex-col justify-between rounded-2xl border border-accent/35 bg-accent/8 p-4">
            <p className="font-mono text-[10px] uppercase tracking-[0.16em] text-accent">
              After · three decisions
            </p>
            <div className="grid gap-2.5">
              {after.map((step, index) => (
                <div
                  key={step.label}
                  className={`grid grid-cols-[44px_1fr] items-center gap-3 rounded-2xl border p-3 ${
                    index === 0
                      ? "border-accent bg-background/82"
                      : "border-border bg-background/68"
                  }`}
                >
                  <div className={`grid h-10 w-10 place-items-center rounded-xl font-mono text-[11px] ${
                    index === 0 ? "bg-accent text-white" : "bg-muted text-muted-foreground"
                  }`}>
                    0{index + 1}
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-foreground">{step.label}</p>
                    <p className="mt-0.5 text-[11px] text-muted-foreground">{step.detail}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

// ─── PAGE ────────────────────────────────────────────────────────────────────

export default function Page() {
  return (
    <div className="min-h-screen">

      <CsChapterNav chapters={CHAPTERS} />

      <Hero />

      {/* Project info bar */}
      <CsInfoBar cells={[
        { label: "Organisation", value: "Honasa Consumer",   sub: "Mamaearth parent co." },
        { label: "Role",         value: "First UX Designer", sub: "0→1 commerce foundations" },
        { label: "Timeline",     value: "8 Weeks",           sub: "Hard seasonal deadline" },
        { label: "Platform",     value: "Web + Mobile",      sub: "All three brands" },
        { label: "Scope",        value: "Multi-Brand D2C",   sub: "PDP · Cart · Checkout" },
      ]} />

      {/* 30-second read */}
      <div className="mx-auto max-w-5xl px-6 pt-14 md:px-8">
        <div className="mb-5 flex flex-wrap gap-2">
          <CsProvenance kind="shipped" label="Shipped to production, 2022" />
        </div>
        <CsSummary
          problem="Three brands sold almost entirely through Amazon and Nykaa: their commissions, their customer data, their algorithms. Honasa needed owned storefronts before the next seasonal sale, with no design system, no process, and eight weeks."
          role="First in-house UX designer. Ran the compressed research sprint, defined the shared architecture and token schema, designed PDP, cart, and checkout across all three brands in parallel, and owned the engineering handoff."
          outcome="All three storefronts shipped inside the window with no post-launch critical bugs. The next brand onboarded in three weeks instead of eight, and the system documentation became the onboarding material for the designers who followed."
        />
      </div>

      {/* Situation */}
      <CsSection id="situation" label="The Situation" withDivider={false}>
        <div className="space-y-8">
          <div className="space-y-4">
            <h2 className="type-case-title text-foreground">
              Three brands, no owned channel, and a tight window.
            </h2>
            <p className="text-[15px] leading-relaxed text-muted-foreground max-w-xl">
              Honasa Consumer operated Mamaearth, The Derma Co., and Aqualogica almost
              entirely through third-party marketplaces. Every sale funnelled through
              Amazon or Nykaa, taking their commission and their customer data with it.
            </p>
            <p className="text-[15px] leading-relaxed text-muted-foreground max-w-xl">
              I joined as the first in-house UX designer with a mandate to build owned
              D2C storefronts before the next seasonal sale window. No design system,
              no shared components, no prior UX process, and eight weeks on the clock.
            </p>
          </div>
          <CsList items={[
            "Revenue generated almost entirely through third-party marketplaces; margin pressure was compounding",
            "No customer data ownership, the brands couldn&apos;t identify repeat buyers on their own platform",
            "Three brands with distinct visual identities but identical commerce logic and a shared backend",
            "No existing design process, component library, or handoff workflow across the portfolio",
          ]} />
        </div>
      </CsSection>

      {/* The problem */}
      <CsSection id="problem" label="The Problem" variant="muted">
        <div className="space-y-8">
          <div className="space-y-3">
            <h2 className="type-case-title text-foreground">
              Build three storefronts with one team.
            </h2>
            <p className="text-[15px] leading-relaxed text-muted-foreground max-w-xl">
              The real design problem wasn&apos;t the UI, it was the math. Two designers,
              four engineers, three brands, and an 8-week window. Building each storefront
              independently was impossible. The only viable path was a system that
              made brand identity a configuration layer above shared commerce logic.
            </p>
          </div>

          {/* Constraint grid */}
          <FadeIn>
            <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-4">
              {[
                { num: "C1", label: "No Precedent",      body: "Zero existing process, design system, or component library to build on." },
                { num: "C2", label: "Three Brand Voices", body: "Distinct visual identities and customer expectations, all non-negotiable." },
                { num: "C3", label: "8-Week Hard Launch", body: "A seasonal sale window set the deadline. There was no flexibility." },
                { num: "C4", label: "Tiny Team",          body: "2 designers supporting 4 engineers across three parallel brand builds." },
                { num: "C5", label: "Speed vs. Quality",  body: "Every decision forced a tradeoff between craft and the clock." },
                { num: "C6", label: "Marketplace Risk",   body: "Delayed launch meant another quarter of full marketplace dependency." },
              ].map((c, i) => (
                <FadeIn key={c.num} delay={i * 0.05}>
                  <div className="rounded-2xl border border-border bg-card p-5">
                    <p className="text-[10px] font-mono text-accent tracking-[0.1em] mb-3">{c.num}</p>
                    <p className="text-[14px] font-semibold text-foreground mb-2 tracking-tight">{c.label}</p>
                    <p className="text-[13px] text-muted-foreground leading-relaxed">{c.body}</p>
                  </div>
                </FadeIn>
              ))}
            </div>
          </FadeIn>

          <CsQuote
            quote="All three brands shared identical commerce logic. They diverged only in visual language."
            attribution="The insight that unlocked the architecture"
            role="From the five-day research sprint"
          />

          <CsOptions
            question="Two designers, four engineers, three brands, eight weeks. The math only worked one way."
            options={[
              {
                title: "Three independent storefronts",
                body: "Give each brand its own build, its own components, and full freedom over layout and behaviour.",
                verdict:
                  "Three times the design and engineering effort, and every future improvement replicated three times. Impossible inside the seasonal window, and a maintenance trap after it.",
              },
              {
                title: "One backbone, three token skins",
                body: "Shared commerce logic and components, with brand identity applied as a token layer above them.",
                verdict:
                  "Brand teams gave up bespoke layouts in v1, which caused real friction. But it was the only architecture two designers could ship in eight weeks, and improvements now compound across all three brands.",
                chosen: true,
              },
            ]}
          />
        </div>
      </CsSection>

      {/* What I led */}
      <CsSection id="what-i-led" label="What I Led">
        <div className="space-y-8">
          <h2 className="type-case-title text-foreground">
            From blank slate to shipped system.
          </h2>
          <div className="grid grid-cols-2 md:grid-cols-4 border-t border-border">
            {[
              { num: "01", title: "Research Sprint",    body: "5-day compressed discovery: marketplace analytics, competitor audits, customer interviews, brand constraint sessions." },
              { num: "02", title: "System Architecture", body: "Defined shared component boundaries, brand token schema, and the MVP scope that would actually ship in the time available." },
              { num: "03", title: "Parallel Design",    body: "Designed all core flows, PDP, cart, checkout, post-purchase, across three brands simultaneously using the shared system." },
              { num: "04", title: "Handoff & Launch",   body: "Delivered annotated specs, responsive guidelines, and edge case docs per component. Staged release across all three brands." },
            ].map((step, i) => (
              <FadeIn key={step.num} delay={i * 0.07}>
                <div className={`p-6 border-b border-border ${i < 3 ? "border-r" : ""} h-full`}>
                  <p className="text-[11px] font-mono text-accent tracking-[0.08em] mb-4">{step.num}</p>
                  <p className="text-[16px] font-semibold text-foreground mb-3 tracking-tight">{step.title}</p>
                  <p className="text-[13px] text-muted-foreground leading-relaxed">{step.body}</p>
                </div>
              </FadeIn>
            ))}
          </div>
        </div>
      </CsSection>

      {/* Principles */}
      <CsSection id="principles" label="Operating Principles" variant="muted">
        <div className="space-y-8">
          <h2 className="type-case-title text-foreground">
            The rules that made eight weeks possible.
          </h2>
          <CsPrinciples
            intro="With no precedent and no slack in the schedule, these were the calls that decided what got built and what got cut."
            principles={[
              {
                title: "Separate what varies from what doesn't",
                body: "The three brands differed in visual language and nothing else. Everything stable went into the shared backbone; everything that varied became a token.",
                applied: "Commerce logic shipped once. Brand identity became a configuration.",
              },
              {
                title: "Ship the revenue-critical flows, defer the rest",
                body: "Every requested feature was mapped against its revenue contribution. If it did not move a purchase forward, it moved to v2.",
                applied: "V1 was PDP, cart, checkout, and order confirmation. Wishlists and loyalty waited a quarter.",
              },
              {
                title: "Make trust a system component, not a brand one-off",
                body: "Ingredient transparency drove purchases, so it could not live as a hardcoded special case that only one brand got right.",
                applied: "Trust badges, ingredient highlights, and certifications shipped as shared PDP components.",
              },
              {
                title: "Document every deferral",
                body: "Cutting scope without a written rationale reads as neglect. Cutting it with one reads as a roadmap.",
                applied: "The deferred list became the v2 roadmap, funded off the back of v1 results.",
              },
            ]}
          />
        </div>
      </CsSection>

      {/* System architecture (dark) */}
      <CsSection id="architecture" label="System Architecture" variant="dark">
        <div className="space-y-8">
          <div className="grid md:grid-cols-[3fr_2fr] gap-10 items-start mb-2">
            <h2 className="type-case-title text-foreground">
              A shared backbone, a configurable surface.
            </h2>
            <p className="text-[15px] text-muted-foreground leading-relaxed pt-1">
              Commerce logic is stable and shared. Brand identity is a token layer
              above it. Decoupling these two is what made three brands buildable
              by two designers in eight weeks.
            </p>
          </div>
          <CsArchStack layers={[
            {
              num: "L1",
              title: "Core Commerce Logic",
              body: "PDP, cart, checkout, and post-purchase flows, stable, shared, and independent of any brand identity. Same logic powers all three storefronts.",
              meta: ["PDP", "Cart", "Checkout"],
            },
            {
              num: "L2",
              title: "Shared Component Library",
              body: "Commerce primitives, product card, line item, quantity control, CTA, composable into any flow. One set of components, theming handled by the layer above.",
              meta: ["primitives", "variants", "responsive"],
            },
            {
              num: "L3",
              title: "Brand Token Layer",
              body: "Color, typography, radius, and elevation tokens. Applying a new brand skin means updating a single configuration, no component-level redesign.",
              meta: ["color", "type", "elevation"],
              isCore: true,
            },
            {
              num: "L4",
              title: "Brand Storefront",
              body: "Each brand gets its own storefront surface: campaign imagery, hero art direction, promotional layouts, brand-specific only where it genuinely matters.",
              meta: ["Mamaearth", "Derma Co.", "Aqualogica"],
            },
          ]} />
        </div>
      </CsSection>

      {/* Key decisions (dark) */}
      <CsSection id="key-decisions" label="Key Decisions" variant="muted">
        <div className="space-y-5">
          <CsDecision
            index={0}
            title="MVP Scoping: Revenue-Critical Flows Only"
            problem="Stakeholders wanted wishlists, product recommendations, loyalty programs, and bundle offers in v1. Delivering all of this would push the launch past the sale window."
            decision="Mapped every requested feature against its estimated revenue contribution. Kept only PDP, cart, checkout, and order confirmation. Documented the rationale for every deferral explicitly."
            tradeoff="Delayed personalization and discovery features by one quarter, which frustrated some stakeholders initially. But core flows shipped on time with high quality and no post-launch critical bugs."
            impact="On-time launch across all three brands. The deferred feature list became the v2 roadmap, funded directly off the back of v1 results."
          />
          <CsDecision
            index={1}
            title="Trust Signals as System-Level Components"
            problem="Research showed ingredient transparency was a primary purchase driver for Mamaearth customers. Other brands hadn&apos;t thought about this systematically, risking inconsistent trust signals across the portfolio."
            decision="Built ingredient highlights, trust badges, and certification displays as reusable PDP components available to all brands, not hardcoded per brand as one-offs."
            tradeoff="Required more upfront component design time and engineering spec work. But avoided brand-specific components that would be impossible to audit or improve across the portfolio."
            impact="All three brands adopted trust components in v1. Mamaearth saw measurable improvement in PDP-to-cart conversion. Other brands adopted the pattern in subsequent releases independently."
          />
        </div>
      </CsSection>

      {/* Feature deep dives */}
      <CsSection id="core-flows" label="Core Flows">
        <div className="space-y-20">
          <h2 className="type-case-title text-foreground">
            Where the design decisions showed up.
          </h2>

          {/* PDP */}
          <CsFeature
            stacked
            tag="01 / Product Detail Page"
            title="The purchase decision happens here."
            body="Research showed 68% of drop-offs happened at the PDP, not checkout as originally assumed. Design energy went into ingredient transparency, trust signals, and a sticky CTA that reduced scroll-to-purchase friction."
            details={[
              { label: "Key Focus", text: "Ingredient panel · Trust badges · Sticky CTA" },
              { label: "Insight",   text: "68% of drop-off happened before checkout" },
            ]}
            visual={<PdpVisual />}
          />

          {/* Cart */}
          <CsFeature
            stacked
            tag="02 / Cart"
            title="A single cart component, themed three ways."
            body="The cart unified product thumbnails, quantity controls, and cross-sell slots into a cohesive component that could be themed per brand without structural changes. One build, three appearances."
            details={[
              { label: "Structure", text: "Thumbnail · Quantity · Cross-sell · Summary" },
              { label: "Theming",   text: "Brand token swap, no structural duplication" },
            ]}
            visual={<CartVisual />}
          />

          {/* Checkout */}
          <CsFeature
            stacked
            tag="03 / Checkout Flow"
            title="From six steps to three."
            body="Single-page checkout reduced form steps from 6 to 3 across all brands, with address autocomplete and persistent order summary reducing cognitive load at the highest-drop-off stage."
            details={[
              { label: "Reduction", text: "6 form steps → 3 across all brands" },
              { label: "Key UX",    text: "Address autocomplete · Persistent summary" },
            ]}
            visual={<CheckoutVisual />}
          />
        </div>
      </CsSection>

      {/* Tokens in Action */}
      <CsSection id="tokens" label="Tokens in Action" variant="muted">
        <div className="space-y-8">
          <div className="grid md:grid-cols-2 gap-6 items-end">
            <h2 className="type-case-title text-foreground">
              Same system. Three distinct brands.
            </h2>
            <p className="text-[15px] text-muted-foreground leading-relaxed">
              A single product card component, configured through three brand token
              sets. No structural change, just a token swap.
            </p>
          </div>

          <FadeIn>
            <div className="grid md:grid-cols-3 gap-5">
              {[
                { brand: "Mamaearth",     primary: BRAND.mamaearth,  radius: "14px", font: "DM Sans", tagline: "Natural · Toxin Free" },
                { brand: "The Derma Co.", primary: BRAND.dermaco,    radius: "8px",  font: "Inter",   tagline: "Clinically Tested" },
                { brand: "Aqualogica",    primary: BRAND.aqualogica, radius: "12px", font: "Figtree", tagline: "Glow · Hydrate" },
              ].map(t => (
                <div key={t.brand} className="rounded-2xl border border-border bg-card p-6 flex flex-col gap-5 hover:-translate-y-0.5 transition-transform duration-300">
                  <div className="flex items-center justify-between">
                    <p className="text-[11px] font-semibold tracking-[0.12em] text-foreground">{t.brand}</p>
                    <div className="w-7 h-7 rounded-lg border border-border" style={{ background: t.primary }} />
                  </div>

                  {/* Mini product card */}
                  <div className="rounded-xl overflow-hidden border border-border">
                    <div className="h-24 flex items-center justify-center relative" style={{ background: `linear-gradient(135deg, ${t.primary}, color-mix(in srgb, ${t.primary} 58%, #000))` }}>
                      <div className="absolute inset-0 bg-[radial-gradient(circle_at_70%_20%,rgba(255,255,255,0.2),transparent_60%)]" />
                      <div className="w-12 h-12 rounded-full bg-white/20 backdrop-blur-sm border border-white/30" />
                    </div>
                    <div className="p-3 bg-card">
                      <div className="h-2.5 w-24 rounded-full mb-1.5" style={{ background: `${t.primary}33` }} />
                      <div className="h-2 w-16 rounded-full bg-muted mb-3" />
                      <div className="flex items-center justify-between">
                        <span className="text-[11px] font-semibold text-foreground">₹ 549</span>
                        <div className="h-7 w-20 rounded-lg flex items-center justify-center text-[10px] text-white font-medium" style={{ background: t.primary }}>Add to Cart</div>
                      </div>
                    </div>
                  </div>

                  {/* Token list */}
                  <div className="rounded-lg bg-muted/60 border border-border/50 p-3 font-mono text-[11px] flex flex-col gap-2">
                    {[["primary", t.primary], ["radius", t.radius], ["font", t.font], ["tagline", t.tagline]].map(([k, v]) => (
                      <div key={k} className="flex justify-between">
                        <span className="text-muted-foreground">{k}</span>
                        <span className="text-foreground truncate max-w-[120px] text-right">{v}</span>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </FadeIn>

          <BrowserFrame url="Storefront · representative placeholder" tone="light">
            <Image
              src="/assets/images/work/skincare-planner.jpg"
              alt="A product detail page assembled from the shared commerce system"
              width={1400}
              height={875}
              className="h-auto w-full"
            />
          </BrowserFrame>
        </div>
      </CsSection>

      {/* Before / After */}
      <CsSection id="the-shift" label="The Shift">
        <div className="space-y-8">
          <h2 className="type-case-title text-foreground">
            From marketplace dependency to owned channel.
          </h2>
          <CsBeforeAfter
            before={{
              strongText: "Revenue without ownership.",
              summary: "All sales through Amazon and Nykaa, their commissions, their customer data, their discovery algorithms. The brands were growing but building on rented ground.",
              visual: (
                <svg viewBox="0 0 360 260" className="w-full h-full overflow-visible">
                  {/* Central marketplace */}
                  <g transform="translate(100,20)">
                    <rect width="160" height="52" rx="10" fill="var(--surface-2)" stroke="var(--text-muted)" strokeOpacity="0.4" strokeDasharray="3 4" />
                    <text x="80" y="22" textAnchor="middle" fontFamily="monospace" fontSize="9" fill="var(--text-muted)" letterSpacing="0.06em">3RD PARTY</text>
                    <text x="80" y="38" textAnchor="middle" fontSize="12" fontWeight="600" fill="var(--foreground)">Amazon · Nykaa</text>
                  </g>
                  {/* Brands feeding into marketplace */}
                  <g stroke="var(--text-muted)" fill="none" opacity="0.55">
                    <path d="M 80 150 L 140 72" />
                    <path d="M 180 150 L 180 72" />
                    <path d="M 280 150 L 220 72" />
                  </g>
                  {["Mamaearth", "Derma Co.", "Aqualogica"].map((name, i) => (
                    <g key={name} transform={`translate(${40 + i * 100},150)`}>
                      <rect width="80" height="80" rx="10" fill="var(--surface-1)" stroke="var(--text-muted)" strokeOpacity="0.4" />
                      <rect x="10" y="12" width="60" height="5" rx="3" fill="var(--text-muted)" opacity="0.28" />
                      <rect x="10" y="23" width="40" height="5" rx="3" fill="var(--text-muted)" opacity="0.28" />
                      <text x="40" y="62" textAnchor="middle" fontSize="8" fill="var(--foreground)" opacity="0.72" letterSpacing="0.04em">{name}</text>
                      <text x="40" y="73" textAnchor="middle" fontFamily="monospace" fontSize="7" fill="var(--text-muted)">no data</text>
                    </g>
                  ))}
                </svg>
              ),
            }}
            after={{
              strongText: "Owned channel, owned data.",
              summary: "All three brands on first-party storefronts. Purchase data, customer identity, and repeat-buyer relationships owned by Honasa, with a shared system that makes every future improvement compound across brands.",
              visual: (
                <svg viewBox="0 0 360 260" className="w-full h-full overflow-visible">
                  {/* Shared system */}
                  <g transform="translate(110,20)">
                    <rect width="140" height="52" rx="10" fill="rgba(244,63,94,0.12)" stroke="rgb(244,63,94)" strokeWidth="1" />
                    <text x="70" y="22" textAnchor="middle" fontFamily="monospace" fontSize="9" fill="rgb(244,63,94)" letterSpacing="0.06em">SHARED SYSTEM</text>
                    <text x="70" y="38" textAnchor="middle" fontSize="12" fontWeight="600" fill="var(--foreground)">Token + Components</text>
                  </g>
                  <g stroke="rgb(244,63,94)" fill="none" opacity="0.7">
                    <path d="M 80 150 L 140 72" />
                    <path d="M 180 150 L 180 72" />
                    <path d="M 280 150 L 220 72" />
                  </g>
                  {[
                    { name: "Mamaearth",    color: BRAND.mamaearth },
                    { name: "Derma Co.",    color: BRAND.dermaco },
                    { name: "Aqualogica",   color: BRAND.aqualogica },
                  ].map((b, i) => (
                    <g key={b.name} transform={`translate(${40 + i * 100},150)`}>
                      <rect width="80" height="80" rx="10" fill={b.color} />
                      <rect x="10" y="12" width="60" height="5" rx="3" fill="rgba(255,255,255,0.5)" />
                      <rect x="10" y="23" width="40" height="5" rx="3" fill="white" />
                      <text x="40" y="62" textAnchor="middle" fontSize="8" fill="white" letterSpacing="0.04em">{b.name}</text>
                      <text x="40" y="73" textAnchor="middle" fontFamily="monospace" fontSize="7" fill="rgba(255,255,255,0.7)">owned data</text>
                    </g>
                  ))}
                </svg>
              ),
            }}
          />
        </div>
      </CsSection>

      {/* Outcomes (dark) */}
      <CsSection id="what-changed" label="What Changed" variant="dark">
        <div className="space-y-10">
          <div className="grid md:grid-cols-2 gap-8 items-end">
            <h2 className="type-case-title text-foreground">
              A system that kept paying back.
            </h2>
            <p className="text-[15px] text-muted-foreground leading-relaxed">
              The 8-week launch was just the start. The shared architecture
              made every subsequent brand addition and improvement faster than the one before.
            </p>
          </div>

          <CsMetricBars
            sectionLabel="New brand onboarding time"
            title="Time to launch a new brand on the system."
            bars={[
              { label: "Initial (v1)",  width: 100, displayValue: "8 weeks",   isBefore: true },
              { label: "Next brand",    width: 37,  displayValue: "3 weeks" },
            ]}
          />

          <div className="grid md:grid-cols-3 divide-x divide-border border-t border-b border-border">
            {[
              { num: "M.01", figure: "8 weeks",       label: "All three brand storefronts shipped within the seasonal sale deadline, with no post-launch critical bugs." },
              { num: "M.02", figure: "3 weeks",        label: "Aqualogica Glow onboarded onto the system, down from 8 weeks for the initial three brands." },
              { num: "M.03", figure: "Zero ramp-up",   label: "Two designers onboarded in Q2 with no from-scratch ramp, the system documentation became onboarding material." },
            ].map((m, i) => (
              <FadeIn key={m.num} delay={i * 0.08}>
                <div className="px-8 py-10">
                  <p className="font-mono text-[11px] text-muted-foreground/60 tracking-[0.06em] mb-5">{m.num}</p>
                  <p className="text-[clamp(28px,3vw,42px)] font-medium text-accent tracking-tight leading-none mb-4">{m.figure}</p>
                  <p className="text-[14px] text-muted-foreground leading-relaxed max-w-[240px]">{m.label}</p>
                </div>
              </FadeIn>
            ))}
          </div>
        </div>
      </CsSection>

      {/* Timeline */}
      <CsSection id="how-we-got-there" label="How We Got There">
        <div className="space-y-8">
          <h2 className="type-case-title text-foreground">
            Eight weeks, end to end.
          </h2>
          <CsTimeline items={TIMELINE} />
        </div>
      </CsSection>

      {/* Reflection */}
      <CsSection id="reflection" label="Key Reflection">
        <div className="space-y-12">
          <blockquote className="pl-6 max-w-2xl">
            <p className="text-xl md:text-2xl font-medium text-foreground leading-[1.5]">
              Scalable systems aren&apos;t built by adding features, they&apos;re built by ruthlessly
              separating{" "}
              <em className="not-italic text-accent">what varies</em>{" "}
              from what doesn&apos;t, and making that separation{" "}
              <em className="not-italic text-accent">explicit at the very start</em>.
            </p>
          </blockquote>

          <CsReflection
            learned="Scalable systems are built by separating what varies from what doesn't, and making that separation explicit on day one. Every hard call in this project, the shared backbone, the token layer, the deferred features, was that one principle applied under pressure."
            next="Set up Storybook and the final token architecture before launch instead of after it. The post-launch refactor cost a cycle that a week of upfront infrastructure work would have avoided."
            validate="How long the no-bespoke-layouts rule survives. The friction with brand teams was manageable during the deadline, but the system has not yet weathered a brand team with time, budget, and a strong opinion."
          />
        </div>
      </CsSection>

      <CsNextStudies currentHref="/work/d2c-platform" />

    </div>
  )
}
