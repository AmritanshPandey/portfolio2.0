"use client"

import { motion } from "framer-motion"
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
} from "@/components/case-study"

// ─── BRAND COLORS ─────────────────────────────────────────────────────────────
// The real storefront accents — this is the token layer that varies per brand.
const BRAND = {
  mamaearth: "#00AFEF",
  dermaco: "#217A6E",
  aqualogica: "#0066CC",
} as const

// ─── FADE-IN WRAPPER ────────────────────────────────────────────────────────

function FadeIn({ children, delay = 0, className = "" }: {
  children: React.ReactNode; delay?: number; className?: string
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 18 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-60px" }}
      transition={{ duration: 0.55, delay, ease: [0.22, 1, 0.36, 1] }}
      className={className}
    >
      {children}
    </motion.div>
  )
}

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
    <div className="rounded-2xl border border-border bg-card/70 p-5 backdrop-blur-sm shadow-[0_30px_70px_-40px_rgba(0,0,0,0.55)]">
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
      title={
        <>
          One System.{" "}
          <em className="not-italic text-accent">Three Brands.</em>{" "}
          Eight Weeks.
        </>
      }
      lede={
        <>
          Built and scaled first-party commerce experiences across Mamaearth,
          The Derma Co., and Aqualogica by establishing a shared component
          backbone with brand-level token overrides, shipping all three
          storefronts on a hard 8-week deadline.
        </>
      }
      asideLabel="Multi-brand model"
      asideCol="340px"
      aside={<HeroAside />}
    />
  )
}

// ─── PAGE ────────────────────────────────────────────────────────────────────

export default function Page() {
  return (
    <div className="min-h-screen">

      <Hero />

      {/* Project info bar */}
      <CsInfoBar cells={[
        { label: "Organisation", value: "Honasa Consumer",   sub: "Mamaearth parent co." },
        { label: "Role",         value: "First UX Designer", sub: "0→1 commerce foundations" },
        { label: "Timeline",     value: "8 Weeks",           sub: "Hard seasonal deadline" },
        { label: "Platform",     value: "Web + Mobile",      sub: "All three brands" },
        { label: "Scope",        value: "Multi-Brand D2C",   sub: "PDP · Cart · Checkout" },
      ]} />

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

          {/* Research insight */}
          <FadeIn>
            <div className="pt-8 border-t border-border grid md:grid-cols-[200px_1fr] gap-6 items-start">
              <p className="text-[10px] font-semibold uppercase tracking-[0.2em] text-muted-foreground mt-1">Key Insight</p>
              <p className="text-[22px] font-medium text-foreground leading-[1.35] tracking-tight">
                All three brands shared identical commerce logic, they diverged
                only in visual language. That meant a{" "}
                <em className="not-italic text-accent">single shared backbone</em>{" "}
                with a brand token layer was the only architecture that could
                ship three storefronts in eight weeks.
              </p>
            </div>
          </FadeIn>
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

      {/* System architecture (dark) */}
      <CsSection id="architecture" label="System Architecture" variant="dark">
        <div className="space-y-8">
          <div className="grid md:grid-cols-2 gap-8 items-end mb-2">
            <h2 className="type-case-title text-foreground">
              A shared backbone, a configurable surface.
            </h2>
            <p className="text-[15px] text-muted-foreground leading-relaxed">
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
      <CsSection id="key-decisions" label="Key Decisions" variant="dark">
        <div className="space-y-5">
          <CsDecision
            index={0}
            title="Shared Commerce Backbone with Brand Token Overrides"
            problem="Building separate commerce experiences per brand would mean 3× the design and engineering effort. Any future improvement would need to be replicated three times, creating compounding maintenance cost."
            decision="Designed a single component library where all commerce logic, PDP, cart, checkout, post-purchase, lives in shared components. Brand identity is applied through a token layer covering colors, typography, and imagery only."
            tradeoff="Reduced flexibility in early stages. Brand teams couldn&apos;t request bespoke layouts. This created friction initially but was essential for long-term maintainability and the only way the 8-week deadline was achievable."
            impact="All three storefronts shipped in 8 weeks with one designer and two engineers per brand sprint. Changes to core flows now propagate to all brands simultaneously."
          />
          <CsDecision
            index={1}
            title="MVP Scoping: Revenue-Critical Flows Only"
            problem="Stakeholders wanted wishlists, product recommendations, loyalty programs, and bundle offers in v1. Delivering all of this would push the launch past the sale window."
            decision="Mapped every requested feature against its estimated revenue contribution. Kept only PDP, cart, checkout, and order confirmation. Documented the rationale for every deferral explicitly."
            tradeoff="Delayed personalization and discovery features by one quarter, which frustrated some stakeholders initially. But core flows shipped on time with high quality and no post-launch critical bugs."
            impact="On-time launch across all three brands. The deferred feature list became the v2 roadmap, funded directly off the back of v1 results."
          />
          <CsDecision
            index={2}
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
            tag="01 / Product Detail Page"
            title="The purchase decision happens here."
            body="Research showed 68% of drop-offs happened at the PDP, not checkout as originally assumed. Design energy went into ingredient transparency, trust signals, and a sticky CTA that reduced scroll-to-purchase friction."
            details={[
              { label: "Key Focus", text: "Ingredient panel · Trust badges · Sticky CTA" },
              { label: "Insight",   text: "68% of drop-off happened before checkout" },
            ]}
            visual={
              <svg viewBox="0 0 400 300" className="w-full h-full overflow-visible">
                {/* Phone frame */}
                <rect x="120" y="10" width="160" height="280" rx="20" fill="var(--surface-1)" stroke="var(--border)" />
                {/* Status bar */}
                <rect x="140" y="24" width="120" height="6" rx="3" fill="var(--surface-2)" />
                {/* Product image placeholder */}
                <rect x="134" y="40" width="132" height="80" rx="8" fill="var(--surface-2)" />
                <circle cx="200" cy="80" r="20" fill="rgba(249,115,22,0.12)" stroke="rgb(249,115,22)" strokeWidth="1" />
                {/* Product name */}
                <rect x="134" y="132" width="90" height="8" rx="3" fill="var(--foreground)" />
                <rect x="134" y="146" width="60" height="6" rx="3" fill="var(--text-muted)" />
                {/* Trust badge row */}
                <g transform="translate(134,162)">
                  {[0, 38, 76].map(x => (
                    <g key={x} transform={`translate(${x},0)`}>
                      <rect width="32" height="20" rx="4" fill="rgba(249,115,22,0.1)" stroke="rgb(249,115,22)" strokeWidth="0.75" />
                    </g>
                  ))}
                </g>
                {/* Ingredient panel indicator */}
                <rect x="134" y="192" width="132" height="28" rx="6" fill="var(--surface-2)" stroke="var(--border)" />
                <rect x="144" y="200" width="70" height="5" rx="2" fill="var(--text-muted)" />
                <rect x="144" y="209" width="50" height="5" rx="2" fill="var(--surface-2)" />
                {/* Sticky CTA */}
                <rect x="134" y="256" width="132" height="24" rx="8" fill="var(--foreground)" />
                <rect x="160" y="264" width="80" height="6" rx="3" fill="var(--background)" />
                {/* Label */}
                <text x="320" y="85" fontFamily="monospace" fontSize="9" fill="var(--text-muted)" letterSpacing="0.08em">STICKY</text>
                <text x="320" y="97" fontFamily="monospace" fontSize="9" fill="var(--text-muted)" letterSpacing="0.08em">CTA</text>
                <path d="M 314 90 L 290 268" stroke="var(--text-muted)" strokeWidth="0.75" fill="none" opacity="0.4" />
              </svg>
            }
          />

          {/* Cart */}
          <CsFeature
            tag="02 / Cart"
            title="A single cart component, themed three ways."
            body="The cart unified product thumbnails, quantity controls, and cross-sell slots into a cohesive component that could be themed per brand without structural changes. One build, three appearances."
            details={[
              { label: "Structure", text: "Thumbnail · Quantity · Cross-sell · Summary" },
              { label: "Theming",   text: "Brand token swap, no structural duplication" },
            ]}
            reverse
            visual={
              <svg viewBox="0 0 400 300" className="w-full h-full overflow-visible">
                <text x="20" y="26" fontFamily="monospace" fontSize="9" fill="var(--text-muted)" letterSpacing="0.08em">SAME COMPONENT · DIFFERENT TOKENS</text>
                {[
                  { x: 20,  color: BRAND.mamaearth,  label: "Mamaearth" },
                  { x: 150, color: BRAND.dermaco,    label: "Derma Co." },
                  { x: 280, color: BRAND.aqualogica, label: "Aqualogica" },
                ].map(b => (
                  <g key={b.label} transform={`translate(${b.x},40)`}>
                    <rect width="110" height="240" rx="14" fill="var(--surface-1)" stroke="var(--border)" />
                    {/* Cart header */}
                    <rect x="12" y="14" width="50" height="6" rx="3" fill={b.color} opacity="0.6" />
                    {/* Line items */}
                    {[0, 1].map(i => (
                      <g key={i} transform={`translate(12,${34 + i * 60})`}>
                        <rect width="86" height="50" rx="8" fill="var(--surface-2)" />
                        <rect x="8" y="8" width="24" height="34" rx="5" fill={b.color} opacity="0.15" />
                        <rect x="40" y="12" width="38" height="5" rx="3" fill="var(--foreground)" />
                        <rect x="40" y="22" width="28" height="4" rx="2" fill="var(--text-muted)" />
                        <rect x="40" y="33" width="20" height="11" rx="3" fill={b.color} />
                      </g>
                    ))}
                    {/* Checkout CTA */}
                    <rect x="12" y="164" width="86" height="28" rx="8" fill={b.color} />
                    {/* Cross-sell */}
                    <rect x="12" y="200" width="86" height="28" rx="8" fill="var(--surface-2)" />
                    <text x="55" y="220" textAnchor="middle" fontFamily="monospace" fontSize="8" fill="var(--text-muted)">you may like</text>
                    {/* Brand label */}
                    <text x="55" y="252" textAnchor="middle" fontSize="9" fontWeight="500" fill={b.color}>{b.label}</text>
                  </g>
                ))}
              </svg>
            }
          />

          {/* Checkout */}
          <CsFeature
            tag="03 / Checkout Flow"
            title="From six steps to three."
            body="Single-page checkout reduced form steps from 6 to 3 across all brands, with address autocomplete and persistent order summary reducing cognitive load at the highest-drop-off stage."
            details={[
              { label: "Reduction", text: "6 form steps → 3 across all brands" },
              { label: "Key UX",    text: "Address autocomplete · Persistent summary" },
            ]}
            visual={
              <svg viewBox="0 0 400 300" className="w-full h-full overflow-visible">
                <g fontSize="10" fontWeight="500" fill="var(--foreground)" fontFamily="sans-serif">
                  {/* Before: 6 steps (collapsed) */}
                  <text x="20" y="30" fontFamily="monospace" fontSize="9" fill="var(--text-muted)" letterSpacing="0.08em">BEFORE · 6 STEPS</text>
                  {[0,1,2,3,4,5].map(i => (
                    <g key={i} transform={`translate(${20 + i * 56},44)`}>
                      <rect width="48" height="32" rx="6" fill="var(--surface-2)" stroke="var(--border)" />
                      <text x="24" y="21" textAnchor="middle" fontSize="9" fill="var(--text-muted)">{`0${i+1}`}</text>
                    </g>
                  ))}
                  <path d="M 36 64 L 68 64" stroke="var(--text-muted)" strokeWidth="1" fill="none" opacity="0.3" />
                  <path d="M 92 64 L 124 64" stroke="var(--text-muted)" strokeWidth="1" fill="none" opacity="0.3" />
                  <path d="M 148 64 L 180 64" stroke="var(--text-muted)" strokeWidth="1" fill="none" opacity="0.3" />
                  <path d="M 204 64 L 236 64" stroke="var(--text-muted)" strokeWidth="1" fill="none" opacity="0.3" />
                  <path d="M 260 64 L 292 64" stroke="var(--text-muted)" strokeWidth="1" fill="none" opacity="0.3" />
                </g>

                {/* Divider */}
                <line x1="20" y1="110" x2="380" y2="110" stroke="var(--border)" strokeWidth="1" />

                {/* After: 3 steps */}
                <text x="20" y="136" fontFamily="monospace" fontSize="9" fill="rgb(249,115,22)" letterSpacing="0.08em">AFTER · 3 STEPS</text>
                {[
                  { label: "Delivery", detail: "Address autocomplete" },
                  { label: "Payment",  detail: "UPI · Cards · COD" },
                  { label: "Confirm",  detail: "Review + place" },
                ].map((step, i) => (
                  <g key={step.label} transform={`translate(${20 + i * 124},148)`}>
                    <rect width="112" height="72" rx="10" fill="var(--surface-1)" stroke={i === 0 ? "rgb(249,115,22)" : "var(--border)"} strokeWidth={i === 0 ? 1.5 : 1} />
                    <text x="56" y="28" textAnchor="middle" fontSize="9" fontFamily="monospace" fill={i === 0 ? "rgb(249,115,22)" : "var(--text-muted)"}>{`0${i+1}`}</text>
                    <text x="56" y="46" textAnchor="middle" fontSize="11" fontWeight="600" fill="var(--foreground)">{step.label}</text>
                    <text x="56" y="60" textAnchor="middle" fontSize="9" fill="var(--text-muted)">{step.detail}</text>
                  </g>
                ))}
                <path d="M 132 184 L 144 184" stroke="rgb(249,115,22)" strokeWidth="1" fill="none" opacity="0.6" />
                <path d="M 256 184 L 268 184" stroke="rgb(249,115,22)" strokeWidth="1" fill="none" opacity="0.6" />
              </svg>
            }
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
                    <rect width="140" height="52" rx="10" fill="rgba(249,115,22,0.12)" stroke="rgb(249,115,22)" strokeWidth="1" />
                    <text x="70" y="22" textAnchor="middle" fontFamily="monospace" fontSize="9" fill="rgb(249,115,22)" letterSpacing="0.06em">SHARED SYSTEM</text>
                    <text x="70" y="38" textAnchor="middle" fontSize="12" fontWeight="600" fill="var(--foreground)">Token + Components</text>
                  </g>
                  <g stroke="rgb(249,115,22)" fill="none" opacity="0.7">
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
        <blockquote className="pl-6 max-w-2xl">
          <p className="text-xl md:text-2xl font-medium text-foreground leading-[1.5]">
            Scalable systems aren&apos;t built by adding features, they&apos;re built by ruthlessly
            separating{" "}
            <em className="not-italic text-accent">what varies</em>{" "}
            from what doesn&apos;t, and making that separation{" "}
            <em className="not-italic text-accent">explicit at the very start</em>.
          </p>
        </blockquote>
      </CsSection>

      <CsNextStudies currentHref="/work/d2c-platform" />

    </div>
  )
}
