"use client"

import Link from "next/link"
import { motion } from "framer-motion"
import {
  CsSection,
  CsDecision,
  CsList,
  CsInfoBar,
  CsFeature,
  CsBeforeAfter,
  CsArchStack,
  CsMetricBars,
  CsNextStudies,
} from "@/components/case-study"

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

// ─── HERO ────────────────────────────────────────────────────────────────────

function Hero() {
  return (
    <div className="relative overflow-hidden bg-neutral-950 min-h-[520px]">
      {/* Ambient glow */}
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute top-[-200px] right-[-300px] w-[900px] h-[700px]
          bg-[radial-gradient(closest-side,rgba(249,115,22,0.18),transparent_70%)]" />
      </div>

      <div className="relative max-w-[1000px] mx-auto px-6 pt-32 pb-16 md:pt-40 md:pb-20">

        {/* Breadcrumb */}
        <motion.div
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="flex items-center gap-3 mb-10 text-[11px] tracking-[0.22em] uppercase text-neutral-500"
        >
          <span>Case Study</span>
          <span className="w-1 h-1 rounded-full bg-neutral-700" />
          <span className="text-orange-400/80">Enterprise Systems</span>
          <span className="w-1 h-1 rounded-full bg-neutral-700" />
          <span>Mastercard · PartnerBank</span>
        </motion.div>

        {/* Title */}
        <motion.h1
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.55, delay: 0.05, ease: [0.22, 1, 0.36, 1] }}
          className="text-4xl md:text-5xl lg:text-[3.4rem] font-semibold tracking-[-0.04em] leading-[0.96] text-white max-w-3xl mb-8"
        >
          Modular Systems for{" "}
          <em className="not-italic text-orange-400">Enterprise</em>{" "}
          RFP Velocity.
        </motion.h1>

        {/* Lede */}
        <motion.p
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.12, ease: [0.22, 1, 0.36, 1] }}
          className="text-[17px] leading-relaxed text-neutral-400 max-w-2xl"
        >
          Decoupled core UX from brand and visual layers across PartnerBank —
          Mastercard&apos;s white-label digital banking platform — turning a rigid
          template system into a configurable architecture that materially
          improved demo turnaround during high-stakes RFP cycles.
        </motion.p>

      </div>

      {/* Bottom separator */}
      <div className="absolute bottom-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-white/10 to-transparent" />
    </div>
  )
}

// ─── PAGE ────────────────────────────────────────────────────────────────────

export default function Page() {
  return (
    <div className="min-h-screen">

      <Hero />

      {/* Project info bar */}
      <CsInfoBar cells={[
        { label: "Client",        value: "Mastercard",       sub: "PartnerBank platform" },
        { label: "Role",          value: "Design Lead",      sub: "Influence without authority" },
        { label: "Timeline",      value: "2023 – 2024",      sub: "Ongoing system evolution" },
        { label: "Cross-functional", value: "Product · Eng · Sales", sub: "Enterprise alignment" },
        { label: "Scope",         value: "White-label DBP",  sub: "RFP enablement" },
      ]} />

      {/* Context */}
      <CsSection label="The Problem">
        <div className="space-y-8">
          <div className="space-y-4">
            <h2 className="text-2xl md:text-3xl font-semibold text-foreground leading-snug tracking-tight">
              A system built for consistency, not customization.
            </h2>
            <p className="text-[15px] leading-relaxed text-muted-foreground max-w-xl">
              PartnerBank is Mastercard&apos;s white-label digital banking platform,
              deployed into enterprise RFP cycles with major financial institutions.
              Product demos were a critical lever in winning these deals.
            </p>
            <p className="text-[15px] leading-relaxed text-muted-foreground max-w-xl">
              But the underlying system was optimized for visual consistency. Every
              new banking prospect required manual visual adjustments and design
              effort, slowing demo turnaround during the exact moments when sales
              responsiveness mattered most.
            </p>
          </div>
          <CsList items={[
            "Custom demo creation was slow — each RFP was a bottleneck that required dedicated design effort",
            "Every bank required both visual and structural personalization, with no reusable foundation",
            "Design effort scaled linearly with RFP volume — zero leverage across deals",
            "Sales responsiveness directly impacted competitive positioning in revenue-critical negotiations",
          ]} />
        </div>
      </CsSection>

      {/* Stakes */}
      <CsSection label="The Stakes" variant="muted">
        <div className="space-y-8">
          <div className="space-y-3">
            <h2 className="text-2xl md:text-3xl font-semibold text-foreground leading-snug tracking-tight">
              Rigidity vs. revenue velocity.
            </h2>
            <p className="text-[15px] leading-relaxed text-muted-foreground max-w-xl">
              Enterprise RFP cycles are time-sensitive and highly competitive. The team faced
              a clear trade-off — preserve system simplicity, or introduce modular customization
              to keep up with sales motion.
            </p>
          </div>

          {/* Tradeoff cards */}
          <FadeIn>
            <div className="grid md:grid-cols-[1fr_56px_1fr] gap-0 rounded-2xl overflow-hidden">
              <div className="p-7 bg-card border border-border flex flex-col gap-3">
                <p className="text-[10px] font-semibold uppercase tracking-[0.2em] text-muted-foreground">Option A · Status Quo</p>
                <p className="text-[18px] font-medium text-foreground leading-snug">Preserve rigidity for system simplicity.</p>
                <p className="text-[13px] text-muted-foreground leading-relaxed">Keep the template model. Accept the linear cost of manual personalization on every RFP.</p>
              </div>
              <div className="flex items-center justify-center bg-muted border-y border-border text-muted-foreground text-[20px] italic font-serif">vs</div>
              <div className="p-7 bg-orange-500 flex flex-col gap-3">
                <p className="text-[10px] font-semibold uppercase tracking-[0.2em] text-orange-950/60">Option B · Evolve</p>
                <p className="text-[18px] font-medium text-orange-950 leading-snug">Introduce modular customization to support revenue velocity.</p>
                <p className="text-[13px] text-orange-950/70 leading-relaxed">Decouple brand from architecture. Make personalization configurable. Compound effort across deals.</p>
              </div>
            </div>
          </FadeIn>

          {/* Position */}
          <FadeIn>
            <div className="pt-8 border-t border-border grid md:grid-cols-[200px_1fr] gap-6 items-start">
              <p className="text-[10px] font-semibold uppercase tracking-[0.2em] text-muted-foreground mt-1">My Position</p>
              <p className="text-[22px] font-medium text-foreground leading-[1.35] tracking-tight">
                Customization at the brand layer would not compromise system integrity — if properly
                modularized — and would{" "}
                <em className="not-italic text-orange-500">materially improve</em>{" "}
                enterprise sales responsiveness.
              </p>
            </div>
          </FadeIn>
        </div>
      </CsSection>

      {/* Approach */}
      <CsSection label="What I Led">
        <div className="space-y-8">
          <h2 className="text-2xl md:text-3xl font-semibold text-foreground leading-snug tracking-tight">
            From template to configurable architecture.
          </h2>
          <div className="grid grid-cols-2 md:grid-cols-4 border-t border-border">
            {[
              { num: "01", title: "Structural Audit", body: "Identified the structural constraints baked into the existing system that blocked rapid customization." },
              { num: "02", title: "Decouple Layers", body: "Separated the core UX architecture from the brand and visual layers — two systems instead of one." },
              { num: "03", title: "Modular Components", body: "Standardized banking modules into reusable component configurations swappable across deals." },
              { num: "04", title: "Token-Based Theming", body: "Introduced design tokens so each brand could be re-skinned via configuration, not redesign." },
            ].map((step, i) => (
              <FadeIn key={step.num} delay={i * 0.07}>
                <div className={`p-6 border-b border-border ${i < 3 ? "border-r" : ""} h-full`}>
                  <p className="text-[11px] font-mono text-orange-500 tracking-[0.08em] mb-4">{step.num}</p>
                  <p className="text-[16px] font-semibold text-foreground mb-3 tracking-tight">{step.title}</p>
                  <p className="text-[13px] text-muted-foreground leading-relaxed">{step.body}</p>
                </div>
              </FadeIn>
            ))}
          </div>
        </div>
      </CsSection>

      {/* Architecture */}
      <CsSection label="System Architecture" variant="dark">
        <div className="space-y-8">
          <div className="grid md:grid-cols-2 gap-8 items-end mb-2">
            <h2 className="text-2xl md:text-3xl font-semibold text-white leading-snug tracking-tight">
              A four-layer architecture.
            </h2>
            <p className="text-[15px] text-neutral-400 leading-relaxed">
              Each layer has one job. Brand changes never touch UX logic; demo configuration
              never breaks core components. Decoupling is what made the system fast.
            </p>
          </div>
          <CsArchStack layers={[
            { num: "L1", title: "Core Banking UX Layer", body: "Stable, opinionated patterns for accounts, transactions, transfers, and statements — unchanged across deals.", meta: ["flows", "interactions", "states"] },
            { num: "L2", title: "Modular Component Library", body: "Banking primitives — account card, transaction list, CTA block, hero — composable into any screen layout.", meta: ["primitives", "variants", "compositions"] },
            { num: "L3", title: "Brand Token Layer", body: "Color, typography, radius, and elevation tokens that re-skin every component in one configuration pass.", meta: ["color", "type", "elevation"], isCore: true },
            { num: "L4", title: "Demo Configuration Engine", body: "Sales-facing layer that assembles brand tokens + component selections into a deal-ready demo for any prospect.", meta: ["configure", "preview", "ship"] },
          ]} />
        </div>
        <div className="h-px w-full bg-white/[0.06] mt-20" />
      </CsSection>

      {/* Key Decisions (dark) */}
      <CsSection label="Key Decisions" variant="dark">
        <div className="space-y-5">
          <CsDecision
            index={0}
            title="Component Modularity: Banking Screens as Swappable Parts"
            problem="Every screen was tightly coupled — changing one element for a prospect required manually re-editing multiple interconnected pieces, with no way to reuse work across deals."
            decision="Decomposed every screen into independent units: header, account card, transaction list, CTA block — each with variants and props. Screens became compositions, not one-off templates."
            tradeoff="Required upfront investment in component architecture that wasn't immediately visible to stakeholders. Took two sprints before the compounding benefit became apparent in demo build times."
            impact="New deals could compose screens from the existing library rather than starting from scratch. Primitive count grew from 8 to 31 components over six months, each reused across multiple prospects."
          />
          <CsDecision
            index={1}
            title="Brand Token Layer: One Config File, One Brand Skin"
            problem="Each prospect's brand identity was applied by hand — editing hex values, font references, and spacing across dozens of component files. It was effectively a redesign for every deal."
            decision="Centralized brand identity into a single token configuration: color, typography, radius, elevation. Any prospect's visual identity could be applied to the entire component library in a single config pass."
            tradeoff="The token schema had to be comprehensive enough to cover edge cases across all components, which required more upfront definition work than stakeholders expected. Some bespoke brand requests couldn't be tokenized and still required manual overrides."
            impact="Prospect onboarding dropped from multi-day design effort to a configuration pass. Sales could request a re-skinned demo for a new bank on short notice without design being a blocker."
          />
          <CsDecision
            index={2}
            title="Demo Configuration Engine: Collapsing the Time-Critical Zone"
            problem="The two slowest steps — brand application and component selection — were the ones that gated the sales team during live RFP cycles. Any delay in this zone directly impacted deal competitiveness."
            decision="Built a configuration layer that combined brand token application and component assembly into a single pass. Sales could specify prospect parameters; the system produced a deal-ready demo configuration without requiring per-deal design cycles."
            tradeoff="The configuration engine introduced a new layer of system complexity that required engineering time to maintain. Some highly bespoke prospect requests still fell outside what the engine could handle and required custom work."
            impact="Per-RFP design effort reduced substantially. The team could respond to enterprise demos on compressed timelines that were previously impossible, which sales cited as a meaningful differentiator in several competitive RFPs."
          />
        </div>
        <div className="h-px w-full bg-white/[0.06] mt-16" />
      </CsSection>

      {/* Feature deep dives */}
      <CsSection label="Inside the System">
        <div className="space-y-20">
          <h2 className="text-2xl md:text-3xl font-semibold text-foreground leading-snug tracking-tight">
            Three shifts that made the system configurable.
          </h2>

          {/* Feature 1 — Component Modularity */}
          <CsFeature
            tag="01 / Component Modularity"
            title="Banking screens, broken into swappable parts."
            body="Every screen was decomposed into independent, reusable units — header, account card, transaction list, CTA block — each with variants and props. Composition replaced replication."
            details={[
              { label: "Primitives", text: "Account Card · Transaction List · CTA Block" },
              { label: "Composition", text: "Page templates assembled per RFP" },
            ]}
            visual={
              <svg viewBox="0 0 400 300" className="w-full h-full overflow-visible">
                {/* Assembled screen */}
                <g transform="translate(40,40)">
                  <rect width="140" height="220" rx="10" fill="hsl(var(--card))" stroke="hsl(var(--border))" />
                  <rect x="14" y="14" width="112" height="20" rx="3" fill="hsl(var(--muted))" />
                  <rect x="14" y="46" width="112" height="56" rx="6" fill="rgba(249,115,22,0.12)" stroke="rgb(249,115,22)" strokeWidth="1" />
                  <rect x="14" y="114" width="112" height="12" rx="3" fill="hsl(var(--muted))" />
                  <rect x="14" y="132" width="112" height="12" rx="3" fill="hsl(var(--muted))" />
                  <rect x="14" y="150" width="112" height="12" rx="3" fill="hsl(var(--muted))" />
                  <rect x="14" y="178" width="112" height="28" rx="6" fill="hsl(var(--foreground))" />
                  <text x="70" y="198" textAnchor="middle" fontSize="9" fill="hsl(var(--background))" fontWeight="500" letterSpacing="0.06em">CTA</text>
                </g>
                {/* Arrow */}
                <g stroke="hsl(var(--muted-foreground))" fill="none" strokeWidth="1" opacity="0.5">
                  <path d="M 200 150 L 240 150" />
                  <path d="M 234 145 L 240 150 L 234 155" />
                </g>
                {/* Components */}
                <g transform="translate(252,30)" fill="hsl(var(--muted-foreground))" fontSize="10" letterSpacing="0.06em">
                  <rect width="120" height="30" rx="6" fill="hsl(var(--card))" stroke="hsl(var(--border))" strokeWidth="1" />
                  <text x="14" y="19">Header</text>
                  <g transform="translate(0,44)">
                    <rect width="120" height="44" rx="6" fill="hsl(var(--card))" stroke="rgb(249,115,22)" strokeWidth="1" />
                    <text x="14" y="20" fill="rgb(249,115,22)" fontWeight="500">Account Card</text>
                    <text x="14" y="34" fontSize="9" opacity="0.5">variant: balance</text>
                  </g>
                  <g transform="translate(0,102)">
                    <rect width="120" height="60" rx="6" fill="hsl(var(--card))" stroke="hsl(var(--border))" strokeWidth="1" />
                    <text x="14" y="19">Transaction List</text>
                    <text x="14" y="34" fontSize="9" opacity="0.5">variant: compact</text>
                    <text x="14" y="48" fontSize="9" opacity="0.5">rows: 5</text>
                  </g>
                  <g transform="translate(0,176)">
                    <rect width="120" height="30" rx="6" fill="hsl(var(--card))" stroke="hsl(var(--border))" strokeWidth="1" />
                    <text x="14" y="19">CTA Block</text>
                  </g>
                </g>
              </svg>
            }
          />

          {/* Feature 2 — Token layer */}
          <CsFeature
            tag="02 / Brand Token Layer"
            title="One theme file, one brand skin."
            body="Color, type, and spacing tokens were centralized into a single brand layer. A new prospect's visual identity could be applied to every component in the library through a configuration pass — no component-level redesign required."
            details={[
              { label: "Tokens", text: "Color · Type · Radius · Elevation" },
              { label: "Effort", text: "Manual redesign → config swap" },
            ]}
            reverse
            visual={
              <svg viewBox="0 0 400 300" className="w-full h-full overflow-visible">
                <text x="20" y="32" fontFamily="monospace" fontSize="10" fill="hsl(var(--muted-foreground))" letterSpacing="0.08em">SAME COMPONENT · DIFFERENT TOKENS</text>
                {[
                  { x: 20,  color: "rgb(249,115,22)", label: "brand-a" },
                  { x: 145, color: "rgb(212,162,76)",  label: "brand-b" },
                  { x: 270, color: "rgb(77,168,138)",  label: "brand-c" },
                ].map(b => (
                  <g key={b.label} transform={`translate(${b.x},80)`}>
                    <rect width="110" height="64" rx="10" fill={b.color} />
                    <rect x="14" y="14" width="50" height="6" rx="3" fill="rgba(255,255,255,0.4)" />
                    <rect x="14" y="28" width="80" height="8" rx="3" fill="white" />
                    <rect x="14" y="44" width="60" height="6" rx="3" fill="rgba(255,255,255,0.6)" />
                    <text x="55" y="166" textAnchor="middle" fontFamily="monospace" fontSize="9" fill="hsl(var(--muted-foreground))">{b.label}</text>
                  </g>
                ))}
                <g transform="translate(20,220)">
                  <rect width="360" height="56" rx="10" fill="hsl(var(--card))" stroke="hsl(var(--border))" strokeWidth="1" />
                  <text x="20" y="22" fontFamily="monospace" fontSize="11" fill="hsl(var(--muted-foreground))">color.primary:</text>
                  <circle cx="138" cy="18" r="6" fill="rgb(249,115,22)" />
                  <text x="150" y="22" fontFamily="monospace" fontSize="11" fill="hsl(var(--foreground))">var(--brand)</text>
                  <text x="20" y="42" fontFamily="monospace" fontSize="11" fill="hsl(var(--muted-foreground))">typography.head:</text>
                  <text x="150" y="42" fontFamily="monospace" fontSize="11" fill="hsl(var(--foreground))">var(--type-display)</text>
                </g>
              </svg>
            }
          />

          {/* Feature 3 — Config engine */}
          <CsFeature
            tag="03 / Demo Configuration Engine"
            title="Time compressed where it mattered."
            body="The configuration engine collapsed the brand-application and component-selection steps — the two phases that previously gated the sales team — into a fast, repeatable configuration pass."
            details={[
              { label: "Compressed", text: "Brand config + component selection" },
              { label: "Result", text: "Sales got a deal-ready demo faster" },
            ]}
            visual={
              <svg viewBox="0 0 400 300" className="w-full h-full overflow-visible">
                <g fontSize="11" fontWeight="500" fill="hsl(var(--foreground))">
                  {[
                    { x: 20,  y: 60, num: "01", label: "RFP Received", accent: false },
                    { x: 154, y: 60, num: "02", label: "Brand Config", accent: true },
                    { x: 288, y: 60, num: "03", label: "Components",  accent: true },
                    { x: 88,  y: 170, num: "04", label: "Demo Build",  accent: false },
                    { x: 220, y: 170, num: "05", label: "Sales Pitch", accent: false },
                  ].map(s => (
                    <g key={s.num} transform={`translate(${s.x},${s.y})`}>
                      <rect width="92" height="48" rx="8" fill="hsl(var(--card))" stroke={s.accent ? "rgb(249,115,22)" : "hsl(var(--border))"} strokeWidth="1" />
                      <text x="14" y="20" fontSize="9" letterSpacing="2" fill={s.accent ? "rgb(249,115,22)" : "hsl(var(--muted-foreground))"}>{s.num}</text>
                      <text x="14" y="36" fill={s.accent ? "rgb(249,115,22)" : "hsl(var(--foreground))"}>{s.label}</text>
                    </g>
                  ))}
                </g>
                <g stroke="hsl(var(--muted-foreground))" strokeWidth="1" fill="none" opacity="0.4">
                  <path d="M 112 84 L 154 84" />
                  <path d="M 246 84 L 288 84" />
                  <path d="M 334 108 C 334 140 180 140 180 168" />
                  <path d="M 180 194 L 220 194" />
                </g>
                <rect x="148" y="34" width="240" height="98" rx="14" fill="none" stroke="rgb(249,115,22)" strokeDasharray="3 5" opacity="0.45" />
                <text x="268" y="26" textAnchor="middle" fontFamily="monospace" fontSize="10" fill="rgb(249,115,22)" letterSpacing="0.08em">TIME-CRITICAL ZONE</text>
              </svg>
            }
          />
        </div>
      </CsSection>

      {/* Token demo */}
      <CsSection label="Tokens in Action" variant="muted">
        <div className="space-y-8">
          <div className="grid md:grid-cols-2 gap-6 items-end">
            <h2 className="text-2xl md:text-3xl font-semibold text-foreground leading-snug tracking-tight">
              Same component. Three brand skins.
            </h2>
            <p className="text-[15px] text-muted-foreground leading-relaxed">
              A single banking card component, themed through three different token configurations.
              No structural change. No new design work. Just configuration.
            </p>
          </div>

          <FadeIn>
            <div className="grid md:grid-cols-3 gap-5">
              {[
                { brand: "Brand · A", primary: "#FF7A1A", gradient: "from-orange-500 to-orange-700", bank: "North Bank", num: "•••• 4287", type: "Premier · Debit", radius: "12px", font: "Inter" },
                { brand: "Brand · B", primary: "#D4A24C", gradient: "from-[#D4A24C] to-[#8B6508]", bank: "Heritage Trust", num: "•••• 9120", type: "Private · Credit", radius: "8px", font: "Instrument" },
                { brand: "Brand · C", primary: "#4DA88A", gradient: "from-[#4DA88A] to-[#2F6F5A]", bank: "Verde Bank", num: "•••• 7503", type: "Everyday · Debit", radius: "14px", font: "Inter" },
              ].map((t) => (
                <div key={t.brand} className="rounded-2xl border border-border bg-card p-6 flex flex-col gap-5 hover:-translate-y-0.5 transition-transform duration-300">
                  <div className="flex items-center justify-between">
                    <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-foreground">{t.brand}</p>
                    <div className="w-7 h-7 rounded-lg border border-border" style={{ background: t.primary }} />
                  </div>

                  {/* Mini card */}
                  <div className={`bg-gradient-to-br ${t.gradient} rounded-xl p-4 flex flex-col justify-between h-24 relative overflow-hidden`}>
                    <div className="absolute inset-0 bg-[radial-gradient(circle_at_80%_20%,rgba(255,255,255,0.15),transparent_60%)]" />
                    <div className="flex justify-between items-start relative">
                      <span className="text-[10px] font-medium text-white/85 uppercase tracking-[0.14em]">{t.bank}</span>
                      <div className="w-6 h-4 bg-white/25 rounded-[3px]" />
                    </div>
                    <div className="relative">
                      <p className="font-mono text-[13px] text-white tracking-[0.08em] mb-1">{t.num}</p>
                      <p className="text-[9px] text-white/80 uppercase tracking-[0.16em]">{t.type}</p>
                    </div>
                  </div>

                  {/* Token list */}
                  <div className="rounded-lg bg-muted/60 border border-border/50 p-3 font-mono text-[11px] flex flex-col gap-2">
                    {[["primary", t.primary], ["radius", t.radius], ["font", t.font]].map(([k, v]) => (
                      <div key={k} className="flex justify-between">
                        <span className="text-muted-foreground">{k}</span>
                        <span className="text-foreground">{v}</span>
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
      <CsSection label="The Shift">
        <div className="space-y-8">
          <h2 className="text-2xl md:text-3xl font-semibold text-foreground leading-snug tracking-tight">
            From static template to configurable system.
          </h2>
          <CsBeforeAfter
            before={{
              strongText: "Linear effort per RFP.",
              summary: "Every new bank started from the same template and required hands-on visual edits — design effort scaled 1-for-1 with deal volume.",
              visual: (
                <svg viewBox="0 0 360 260" className="w-full h-full overflow-visible">
                  <g transform="translate(120,20)">
                    <rect width="120" height="52" rx="10" fill="hsl(var(--muted))" stroke="hsl(var(--border))" strokeDasharray="3 4" />
                    <text x="60" y="22" textAnchor="middle" fontFamily="monospace" fontSize="9" fill="hsl(var(--muted-foreground))" letterSpacing="0.06em">SINGLE TEMPLATE</text>
                    <text x="60" y="38" textAnchor="middle" fontSize="11" fontWeight="500" fill="hsl(var(--foreground))">Static UI</text>
                  </g>
                  <g stroke="hsl(var(--border))" fill="none">
                    <path d="M 180 72 C 180 110 80 110 80 150" />
                    <path d="M 180 72 L 180 150" />
                    <path d="M 180 72 C 180 110 280 110 280 150" />
                  </g>
                  {[40, 140, 240].map((x, i) => (
                    <g key={x} transform={`translate(${x},150)`}>
                      <rect width="80" height="90" rx="10" fill="hsl(var(--card))" stroke="hsl(var(--border))" />
                      <rect x="10" y="12" width="60" height="5" rx="3" fill="hsl(var(--muted))" />
                      <rect x="10" y="23" width="50" height="5" rx="3" fill="hsl(var(--muted))" />
                      <text x="40" y="72" textAnchor="middle" fontSize="8" fill="hsl(var(--muted-foreground))" letterSpacing="0.06em">BANK {i + 1}</text>
                      <text x="40" y="83" textAnchor="middle" fontFamily="monospace" fontSize="7" fill="hsl(var(--muted-foreground))">manual edits</text>
                    </g>
                  ))}
                </svg>
              ),
            }}
            after={{
              strongText: "Compounding effort.",
              summary: "Every new bank inherits the system. Brand + component configuration replaces manual redesign — and every improvement benefits every future deal.",
              visual: (
                <svg viewBox="0 0 360 260" className="w-full h-full overflow-visible">
                  <g transform="translate(110,20)">
                    <rect width="140" height="52" rx="10" fill="rgba(249,115,22,0.12)" stroke="rgb(249,115,22)" strokeWidth="1" />
                    <text x="70" y="22" textAnchor="middle" fontFamily="monospace" fontSize="9" fill="rgb(249,115,22)" letterSpacing="0.06em">CONFIG ENGINE</text>
                    <text x="70" y="38" textAnchor="middle" fontSize="11" fontWeight="500" fill="hsl(var(--foreground))">Tokens + Components</text>
                  </g>
                  <g stroke="rgb(249,115,22)" fill="none" opacity="0.7">
                    <path d="M 180 72 C 180 110 80 110 80 150" />
                    <path d="M 180 72 L 180 150" />
                    <path d="M 180 72 C 180 110 280 110 280 150" />
                  </g>
                  {[
                    { x: 40,  color: "rgb(249,115,22)", label: "BANK A" },
                    { x: 140, color: "rgb(212,162,76)",  label: "BANK B" },
                    { x: 240, color: "rgb(77,168,138)",  label: "BANK C" },
                  ].map(b => (
                    <g key={b.label} transform={`translate(${b.x},150)`}>
                      <rect width="80" height="90" rx="10" fill={b.color} />
                      <rect x="10" y="12" width="60" height="5" rx="3" fill="rgba(255,255,255,0.5)" />
                      <rect x="10" y="23" width="50" height="5" rx="3" fill="white" />
                      <text x="40" y="72" textAnchor="middle" fontSize="8" fill="white" letterSpacing="0.06em">{b.label}</text>
                      <text x="40" y="83" textAnchor="middle" fontFamily="monospace" fontSize="7" fill="rgba(255,255,255,0.7)">config swap</text>
                    </g>
                  ))}
                </svg>
              ),
            }}
          />
        </div>
      </CsSection>

      {/* Outcomes */}
      <CsSection label="What Changed" variant="dark">
        <div className="space-y-10">
          <div className="grid md:grid-cols-2 gap-8 items-end">
            <h2 className="text-2xl md:text-3xl font-semibold text-white leading-snug tracking-tight">
              A system built for sales velocity.
            </h2>
            <p className="text-[15px] text-neutral-400 leading-relaxed">
              Enterprise deals close cross-functionally, but the system&apos;s new flexibility materially
              strengthened Mastercard&apos;s competitive positioning in high-value RFP cycles.
            </p>
          </div>

          <CsMetricBars
            sectionLabel="Per-RFP demo turnaround"
            title="Illustrative reduction in design effort."
            bars={[
              { label: "Before", width: 100, displayValue: "~ 10 days", isBefore: true },
              { label: "After",  width: 30,  displayValue: "~ 3 days" },
            ]}
          />

          <div className="grid md:grid-cols-3 divide-x divide-white/[0.08] border-t border-b border-white/[0.08]">
            {[
              { num: "M.01", figure: "~70%", label: "Reduction in per-RFP design effort, measured against the prior template workflow." },
              { num: "M.02", figure: "Template → Config", label: "Shifted the platform from a rigid template to a scalable configuration model." },
              { num: "M.03", figure: "Faster Sales Loop", label: "Materially improved demo responsiveness during high-stakes enterprise negotiations." },
            ].map((m, i) => (
              <FadeIn key={m.num} delay={i * 0.08}>
                <div className="px-8 py-10">
                  <p className="font-mono text-[11px] text-neutral-500 tracking-[0.06em] mb-5">{m.num}</p>
                  <p className="text-[clamp(28px,3vw,42px)] font-medium text-white tracking-tight leading-none mb-4 text-orange-400">{m.figure}</p>
                  <p className="text-[14px] text-neutral-400 leading-relaxed max-w-[240px]">{m.label}</p>
                </div>
              </FadeIn>
            ))}
          </div>
        </div>
        <div className="h-px w-full bg-white/[0.06] mt-16" />
      </CsSection>

      {/* Reflection */}
      <CsSection label="Key Reflection">
        <blockquote className="border-l-2 border-orange-500/60 pl-6 max-w-2xl">
          <p className="text-xl md:text-2xl font-medium text-foreground leading-[1.5]">
            Customization and consistency aren&apos;t a trade-off — they&apos;re a{" "}
            <em className="not-italic text-orange-500">layering problem</em>. The system became fast
            the moment we stopped treating{" "}
            <em className="not-italic text-orange-500">brand</em> as a property of components and
            started treating it as a layer above them.
          </p>
        </blockquote>
      </CsSection>

      <CsNextStudies currentHref="/work/white-label-rfp" />

    </div>
  )
}
