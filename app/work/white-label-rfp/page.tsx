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
  CsNextStudies,
  CsChapterNav,
  CsProvenance,
  CsSummary,
  CsOptions,
  CsAnnotatedImage,
  CsQuote,
  CsReflection,
} from "@/components/case-study"
import { FadeIn } from "@/components/shared/fade-in"

// ─── CHAPTERS ────────────────────────────────────────────────────────────────

const CHAPTERS = [
  { id: "problem",           label: "Problem" },
  { id: "stakes",            label: "The stakes" },
  { id: "what-i-led",        label: "What I led" },
  { id: "architecture",      label: "Architecture" },
  { id: "key-decisions",     label: "Decisions" },
  { id: "inside-the-system", label: "Inside the system" },
  { id: "tokens",            label: "Tokens in action" },
  { id: "the-shift",         label: "The shift" },
  { id: "what-changed",      label: "What changed" },
  { id: "reflection",        label: "Reflection" },
]

// ─── HERO ────────────────────────────────────────────────────────────────────

/** Signature visual — the four-layer configurable architecture, distilled. */
function HeroAside() {
  const layers = [
    { num: "L1", title: "Core Banking UX",   meta: "stable flows",      accent: false },
    { num: "L2", title: "Component Library",  meta: "swappable parts",   accent: false },
    { num: "L3", title: "Brand Token Layer",  meta: "one config, one skin", accent: true },
    { num: "L4", title: "Demo Config Engine", meta: "deal-ready output", accent: false },
  ]
  return (
    <div className="rounded-2xl border border-border bg-card/70 p-5 backdrop-blur-sm shadow-[0_30px_70px_-40px_rgba(0,0,0,0.55)]">
      <div className="flex items-center justify-between mb-4">
        <p className="text-[10px] font-semibold uppercase tracking-[0.2em] text-muted-foreground">
          Configurable architecture
        </p>
        <span className="font-mono text-[10px] text-accent">4 layers</span>
      </div>
      <div className="flex flex-col gap-1.5">
        {layers.map(l => (
          <div
            key={l.num}
            className={`flex items-center gap-3 rounded-xl border px-3.5 py-3 transition-colors ${
              l.accent
                ? "border-accent/40 bg-accent/[0.07]"
                : "border-border/70 bg-muted/40"
            }`}
          >
            <span className={`font-mono text-[11px] shrink-0 ${l.accent ? "text-accent" : "text-muted-foreground"}`}>
              {l.num}
            </span>
            <span className="flex-1 min-w-0">
              <span className="block text-[13px] font-medium text-foreground leading-tight">{l.title}</span>
              <span className="block text-[11px] text-muted-foreground">{l.meta}</span>
            </span>
            {l.accent && <span className="h-1.5 w-1.5 rounded-full bg-accent shrink-0" />}
          </div>
        ))}
      </div>
      <div className="mt-4 pt-3 border-t border-border/60 flex items-center justify-between text-[11px]">
        <span className="text-muted-foreground">Brand changes never touch UX logic</span>
      </div>
    </div>
  )
}

function Hero() {
  return (
    <CsHeroShell
      breadcrumb={{ kind: "Case Study", category: "Enterprise Systems", client: "Mastercard · PartnerBank" }}
      keywords={["Enterprise Systems", "RFP Enablement", "Design Lead"]}
      title={
        <>
          Modular Systems for{" "}
          <em className="not-italic text-accent">Enterprise</em>{" "}
          RFP Velocity.
        </>
      }
      lede={
        <>
          Decoupled core UX from brand and visual layers across PartnerBank,
          Mastercard&apos;s white-label digital banking platform. A{" "}
          <strong className="font-medium text-foreground">rigid template system</strong>{" "}
          became a{" "}
          <strong className="font-medium text-foreground">configurable architecture</strong>{" "}
          for faster demo turnaround during high-stakes RFP cycles.
        </>
      }
      meta={{
        role:         "Design Lead",
        platform:     "Web · Banking Platform",
        scope:        "White-label RFP System",
        organisation: "Mastercard",
      }}
      readTime="10 min read"
      publishedDate="2023–2024"
      topics={["Enterprise", "Systems", "RFP", "Scale"]}
      asideLabel="System model"
      asideCol="320px"
      aside={<HeroAside />}
    />
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
        { label: "Client",        value: "Mastercard",       sub: "PartnerBank platform" },
        { label: "Role",          value: "Design Lead",      sub: "Influence without authority" },
        { label: "Timeline",      value: "2023 – 2024",      sub: "Ongoing system evolution" },
        { label: "Cross-functional", value: "Product · Eng · Sales", sub: "Enterprise alignment" },
        { label: "Scope",         value: "White-label DBP",  sub: "RFP enablement" },
      ]} />

      {/* 30-second read */}
      <div className="mx-auto max-w-5xl px-6 pt-14 md:px-8">
        <div className="mb-5 flex flex-wrap gap-2">
          <CsProvenance kind="shipped" label="In production, live RFP cycles" />
          <CsProvenance kind="anonymised" label="Bank brands anonymised" />
        </div>
        <CsSummary
          problem="PartnerBank demos win or lose enterprise RFPs, but the platform was built for visual consistency, not customization. Every prospect needed manual visual work, so design effort scaled one-for-one with deal volume at exactly the moments speed mattered most."
          role="Led the design side of the shift: audited the structural constraints, decoupled core UX from brand, standardised the modular component library, and introduced the token-based theming that made re-skins a configuration pass."
          outcome="A four-layer configurable architecture. Prospect onboarding went from a multi-day design effort to a config swap, roughly 70% less per-RFP design work, and sales cited the faster demos as a differentiator in competitive cycles."
        />
      </div>

      {/* Context */}
      <CsSection id="problem" label="The Problem" withDivider={false}>
        <div className="space-y-8">
          <div className="space-y-4">
            <h2 className="type-case-title text-foreground">
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
            "Custom demo creation was slow, each RFP was a bottleneck that required dedicated design effort",
            "Every bank required both visual and structural personalization, with no reusable foundation",
            "Design effort scaled linearly with RFP volume, with no reuse across deals",
            "Sales responsiveness directly impacted competitive positioning in revenue-critical negotiations",
          ]} />
        </div>
      </CsSection>

      {/* Stakes */}
      <CsSection id="stakes" label="The Stakes" variant="muted">
        <div className="space-y-8">
          <div className="space-y-3">
            <h2 className="type-case-title text-foreground">
              Rigidity vs. revenue velocity.
            </h2>
            <p className="text-[15px] leading-relaxed text-muted-foreground max-w-xl">
              Enterprise RFP cycles are time-sensitive and highly competitive. The team faced
              a clear trade-off, preserve system simplicity, or introduce modular customization
              to keep up with sales motion.
            </p>
          </div>

          <CsOptions
            question="The platform could stay simple or get fast. The team had to pick which one it was optimising for."
            options={[
              {
                title: "Preserve rigidity for system simplicity",
                body: "Keep the template model exactly as it was. One codebase, one look, no configuration surface to maintain.",
                verdict:
                  "Simplicity here was a false economy: the cost did not disappear, it moved into manual personalization on every single RFP, at the worst possible moment in the deal.",
              },
              {
                title: "Introduce modular customization",
                body: "Decouple brand from architecture, make personalization configurable, and let the effort compound across deals.",
                verdict:
                  "Customization at the brand layer did not compromise system integrity once properly modularized, and it materially improved sales responsiveness.",
                chosen: true,
              },
            ]}
          />

          <CsQuote
            quote="Customization at the brand layer would not compromise system integrity, if properly modularized, and would materially improve enterprise sales responsiveness."
            attribution="My position going in"
            role="Design Lead, arguing for the evolution"
          />
        </div>
      </CsSection>

      {/* Approach */}
      <CsSection id="what-i-led" label="What I Led">
        <div className="space-y-8">
          <h2 className="type-case-title text-foreground">
            From template to configurable architecture.
          </h2>
          <div className="grid grid-cols-2 md:grid-cols-4 border-t border-border">
            {[
              { num: "01", title: "Structural Audit", body: "Identified the structural constraints baked into the existing system that blocked rapid customization." },
              { num: "02", title: "Decouple Layers", body: "Separated the core UX architecture from the brand and visual layers, two systems instead of one." },
              { num: "03", title: "Modular Components", body: "Standardized banking modules into reusable component configurations swappable across deals." },
              { num: "04", title: "Token-Based Theming", body: "Introduced design tokens so each brand could be re-skinned via configuration, not redesign." },
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

      {/* Architecture */}
      <CsSection id="architecture" label="System Architecture" variant="muted">
        <div className="space-y-8">
          <div className="grid md:grid-cols-[3fr_2fr] gap-10 items-start mb-2">
            <h2 className="type-case-title text-foreground">
              A four-layer architecture.
            </h2>
            <p className="text-[15px] text-muted-foreground leading-relaxed">
              Each layer has one job. Brand changes never touch UX logic; demo configuration
              never breaks core components. Decoupling is what made the system fast.
            </p>
          </div>
          <CsArchStack layers={[
            { num: "L1", title: "Core Banking UX Layer", body: "Stable, opinionated patterns for accounts, transactions, transfers, and statements, unchanged across deals.", meta: ["flows", "interactions", "states"] },
            { num: "L2", title: "Modular Component Library", body: "Banking primitives, account card, transaction list, CTA block, hero, composable into any screen layout.", meta: ["primitives", "variants", "compositions"] },
            { num: "L3", title: "Brand Token Layer", body: "Color, typography, radius, and elevation tokens that re-skin every component in one configuration pass.", meta: ["color", "type", "elevation"], isCore: true },
            { num: "L4", title: "Demo Configuration Engine", body: "Sales-facing layer that assembles brand tokens + component selections into a deal-ready demo for any prospect.", meta: ["configure", "preview", "ship"] },
          ]} />
        </div>
      </CsSection>

      {/* Key Decisions (dark) */}
      <CsSection id="key-decisions" label="Key Decisions" variant="default">
        <div className="space-y-5">
          <CsDecision
            index={0}
            title="Component Modularity: Banking Screens as Swappable Parts"
            problem="Every screen was tightly coupled, changing one element for a prospect required manually re-editing multiple interconnected pieces, with no way to reuse work across deals."
            decision="Decomposed every screen into independent units: header, account card, transaction list, CTA block, each with variants and props. Screens became compositions, not one-off templates."
            tradeoff="Required upfront investment in component architecture that wasn't immediately visible to stakeholders. Took two sprints before the compounding benefit became apparent in demo build times."
            impact="New deals could compose screens from the existing library rather than starting from scratch. Primitive count grew from 8 to 31 components over six months, each reused across multiple prospects."
          />
          <CsDecision
            index={1}
            title="Brand Token Layer: One Config File, One Brand Skin"
            problem="Each prospect's brand identity was applied by hand, editing hex values, font references, and spacing across dozens of component files. It was effectively a redesign for every deal."
            decision="Centralized brand identity into a single token configuration: color, typography, radius, elevation. Any prospect's visual identity could be applied to the entire component library in a single config pass."
            tradeoff="The token schema had to be comprehensive enough to cover edge cases across all components, which required more upfront definition work than stakeholders expected. Some bespoke brand requests couldn't be tokenized and still required manual overrides."
            impact="Prospect onboarding dropped from multi-day design effort to a configuration pass. Sales could request a re-skinned demo for a new bank on short notice without design being a blocker."
          />
          <CsDecision
            index={2}
            title="Demo Configuration Engine: Collapsing the Time-Critical Zone"
            problem="The two slowest steps, brand application and component selection, were the ones that gated the sales team during live RFP cycles. Any delay in this zone directly impacted deal competitiveness."
            decision="Built a configuration layer that combined brand token application and component assembly into a single pass. Sales could specify prospect parameters; the system produced a deal-ready demo configuration without requiring per-deal design cycles."
            tradeoff="The configuration engine introduced a new layer of system complexity that required engineering time to maintain. Some highly bespoke prospect requests still fell outside what the engine could handle and required custom work."
            impact="Per-RFP design effort reduced substantially. The team could respond to enterprise demos on compressed timelines that were previously impossible, which sales cited as a meaningful differentiator in several competitive RFPs."
          />
        </div>
      </CsSection>

      {/* Feature deep dives */}
      <CsSection id="inside-the-system" label="Inside the System">
        <div className="space-y-20">
          <h2 className="type-case-title text-foreground">
            Three shifts that made the system configurable.
          </h2>

          {/* Feature 1, Component Modularity */}
          <CsFeature
            tag="01 / Component Modularity"
            title="Banking screens, broken into swappable parts."
            body="Every screen was decomposed into independent, reusable units, header, account card, transaction list, CTA block, each with variants and props. Composition replaced replication."
            details={[
              { label: "Primitives", text: "Account Card · Transaction List · CTA Block" },
              { label: "Composition", text: "Page templates assembled per RFP" },
            ]}
            visual={
              <svg viewBox="0 0 400 300" className="w-full h-full overflow-visible">
                {/* Assembled screen */}
                <g transform="translate(40,40)">
                  <rect width="140" height="220" rx="10" fill="var(--surface-1)" stroke="var(--border)" />
                  <rect x="14" y="14" width="112" height="20" rx="3" fill="var(--surface-2)" />
                  <rect x="14" y="46" width="112" height="56" rx="6" fill="rgba(244,63,94,0.12)" stroke="rgb(244,63,94)" strokeWidth="1" />
                  <rect x="14" y="114" width="112" height="12" rx="3" fill="var(--surface-2)" />
                  <rect x="14" y="132" width="112" height="12" rx="3" fill="var(--surface-2)" />
                  <rect x="14" y="150" width="112" height="12" rx="3" fill="var(--surface-2)" />
                  <rect x="14" y="178" width="112" height="28" rx="6" fill="var(--foreground)" />
                  <text x="70" y="198" textAnchor="middle" fontSize="9" fill="var(--background)" fontWeight="500" letterSpacing="0.06em">CTA</text>
                </g>
                {/* Arrow */}
                <g stroke="var(--text-muted)" fill="none" strokeWidth="1" opacity="0.5">
                  <path d="M 200 150 L 240 150" />
                  <path d="M 234 145 L 240 150 L 234 155" />
                </g>
                {/* Components */}
                <g transform="translate(252,30)" fill="var(--text-muted)" fontSize="10" letterSpacing="0.06em">
                  <rect width="120" height="30" rx="6" fill="var(--surface-1)" stroke="var(--border)" strokeWidth="1" />
                  <text x="14" y="19">Header</text>
                  <g transform="translate(0,44)">
                    <rect width="120" height="44" rx="6" fill="var(--surface-1)" stroke="rgb(244,63,94)" strokeWidth="1" />
                    <text x="14" y="20" fill="rgb(244,63,94)" fontWeight="500">Account Card</text>
                    <text x="14" y="34" fontSize="9" opacity="0.5">variant: balance</text>
                  </g>
                  <g transform="translate(0,102)">
                    <rect width="120" height="60" rx="6" fill="var(--surface-1)" stroke="var(--border)" strokeWidth="1" />
                    <text x="14" y="19">Transaction List</text>
                    <text x="14" y="34" fontSize="9" opacity="0.5">variant: compact</text>
                    <text x="14" y="48" fontSize="9" opacity="0.5">rows: 5</text>
                  </g>
                  <g transform="translate(0,176)">
                    <rect width="120" height="30" rx="6" fill="var(--surface-1)" stroke="var(--border)" strokeWidth="1" />
                    <text x="14" y="19">CTA Block</text>
                  </g>
                </g>
              </svg>
            }
          />

          {/* Feature 2, Token layer */}
          <CsFeature
            tag="02 / Brand Token Layer"
            title="One theme file, one brand skin."
            body="Color, type, and spacing tokens were centralized into a single brand layer. A new prospect's visual identity could be applied to every component in the library through a configuration pass, no component-level redesign required."
            details={[
              { label: "Tokens", text: "Color · Type · Radius · Elevation" },
              { label: "Effort", text: "Manual redesign → config swap" },
            ]}
            reverse
            visual={
              <svg viewBox="0 0 400 300" className="w-full h-full overflow-visible">
                <text x="20" y="32" fontFamily="monospace" fontSize="10" fill="var(--text-muted)" letterSpacing="0.08em">SAME COMPONENT · DIFFERENT TOKENS</text>
                {[
                  { x: 20,  color: "rgb(244,63,94)", label: "brand-a" },
                  { x: 145, color: "rgb(212,162,76)",  label: "brand-b" },
                  { x: 270, color: "rgb(77,168,138)",  label: "brand-c" },
                ].map(b => (
                  <g key={b.label} transform={`translate(${b.x},80)`}>
                    <rect width="110" height="64" rx="10" fill={b.color} />
                    <rect x="14" y="14" width="50" height="6" rx="3" fill="rgba(255,255,255,0.4)" />
                    <rect x="14" y="28" width="80" height="8" rx="3" fill="white" />
                    <rect x="14" y="44" width="60" height="6" rx="3" fill="rgba(255,255,255,0.6)" />
                    <text x="55" y="166" textAnchor="middle" fontFamily="monospace" fontSize="9" fill="var(--text-muted)">{b.label}</text>
                  </g>
                ))}
                <g transform="translate(20,220)">
                  <rect width="360" height="56" rx="10" fill="var(--surface-1)" stroke="var(--border)" strokeWidth="1" />
                  <text x="20" y="22" fontFamily="monospace" fontSize="11" fill="var(--text-muted)">color.primary:</text>
                  <circle cx="138" cy="18" r="6" fill="rgb(244,63,94)" />
                  <text x="150" y="22" fontFamily="monospace" fontSize="11" fill="var(--foreground)">var(--brand)</text>
                  <text x="20" y="42" fontFamily="monospace" fontSize="11" fill="var(--text-muted)">typography.head:</text>
                  <text x="150" y="42" fontFamily="monospace" fontSize="11" fill="var(--foreground)">var(--type-display)</text>
                </g>
              </svg>
            }
          />

          {/* Feature 3, Config engine */}
          <CsFeature
            tag="03 / Demo Configuration Engine"
            title="Time compressed where it mattered."
            body="The configuration engine collapsed the brand-application and component-selection steps, the two phases that previously gated the sales team, into a fast, repeatable configuration pass."
            details={[
              { label: "Compressed", text: "Brand config + component selection" },
              { label: "Result", text: "Sales got a deal-ready demo faster" },
            ]}
            visual={
              <svg viewBox="0 0 400 300" className="w-full h-full overflow-visible">
                <g fontSize="11" fontWeight="500" fill="var(--foreground)">
                  {[
                    { x: 20,  y: 60, num: "01", label: "RFP Received", accent: false },
                    { x: 154, y: 60, num: "02", label: "Brand Config", accent: true },
                    { x: 288, y: 60, num: "03", label: "Components",  accent: true },
                    { x: 88,  y: 170, num: "04", label: "Demo Build",  accent: false },
                    { x: 220, y: 170, num: "05", label: "Sales Pitch", accent: false },
                  ].map(s => (
                    <g key={s.num} transform={`translate(${s.x},${s.y})`}>
                      <rect width="92" height="48" rx="8" fill="var(--surface-1)" stroke={s.accent ? "rgb(244,63,94)" : "var(--border)"} strokeWidth="1" />
                      <text x="14" y="20" fontSize="9" letterSpacing="2" fill={s.accent ? "rgb(244,63,94)" : "var(--text-muted)"}>{s.num}</text>
                      <text x="14" y="36" fill={s.accent ? "rgb(244,63,94)" : "var(--foreground)"}>{s.label}</text>
                    </g>
                  ))}
                </g>
                <g stroke="var(--text-muted)" strokeWidth="1" fill="none" opacity="0.4">
                  <path d="M 112 84 L 154 84" />
                  <path d="M 246 84 L 288 84" />
                  <path d="M 334 108 C 334 140 180 140 180 168" />
                  <path d="M 180 194 L 220 194" />
                </g>
                <rect x="148" y="34" width="240" height="98" rx="14" fill="none" stroke="rgb(244,63,94)" strokeDasharray="3 5" opacity="0.45" />
                <text x="268" y="26" textAnchor="middle" fontFamily="monospace" fontSize="10" fill="rgb(244,63,94)" letterSpacing="0.08em">TIME-CRITICAL ZONE</text>
              </svg>
            }
          />
        </div>
      </CsSection>

      {/* Token demo */}
      <CsSection id="tokens" label="Tokens in Action" variant="muted">
        <div className="space-y-8">
          <div className="grid md:grid-cols-[3fr_2fr] gap-10 items-start">
            <h2 className="type-case-title text-foreground">
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
                { brand: "Brand · A", primary: "#F43F5E", gradient: "from-accent to-rose-700", bank: "North Bank", num: "•••• 4287", type: "Premier · Debit", radius: "12px", font: "Inter" },
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

          <CsAnnotatedImage
            src="/assets/images/work/white-label-platform.jpg"
            alt="A configured PartnerBank demo with the system layers called out"
            caption="Representative visual, anonymised placeholder. Real prospect demos are confidential."
            annotations={[
              { x: 20, y: 22, title: "Brand token skin", text: "Colour, type, radius, and elevation come from one config file. Swapping it re-skins every component in a single pass." },
              { x: 66, y: 30, title: "Stable core UX", text: "Accounts, transactions, transfers, and statements never change across deals. Prospects evaluate a proven flow, not a prototype." },
              { x: 34, y: 64, title: "Swappable modules", text: "Screens are compositions of banking primitives with variants and props, so a new prospect composes instead of rebuilding." },
              { x: 80, y: 80, title: "Deal-ready output", text: "The configuration engine assembles tokens and components into a demo sales can show without a design cycle." },
            ]}
          />
        </div>
      </CsSection>

      {/* Before / After */}
      <CsSection id="the-shift" label="The Shift">
        <div className="space-y-8">
          <h2 className="type-case-title text-foreground">
            From static template to configurable system.
          </h2>
          <CsBeforeAfter
            before={{
              strongText: "Linear effort per RFP.",
              summary: "Every new bank started from the same template and required hands-on visual edits, design effort scaled 1-for-1 with deal volume.",
              visual: (
                <svg viewBox="0 0 360 260" className="w-full h-full overflow-visible">
                  <g transform="translate(120,20)">
                    <rect width="120" height="52" rx="10" fill="var(--surface-2)" stroke="var(--border)" strokeDasharray="3 4" />
                    <text x="60" y="22" textAnchor="middle" fontFamily="monospace" fontSize="9" fill="var(--text-muted)" letterSpacing="0.06em">SINGLE TEMPLATE</text>
                    <text x="60" y="38" textAnchor="middle" fontSize="11" fontWeight="500" fill="var(--foreground)">Static UI</text>
                  </g>
                  <g stroke="var(--border)" fill="none">
                    <path d="M 180 72 C 180 110 80 110 80 150" />
                    <path d="M 180 72 L 180 150" />
                    <path d="M 180 72 C 180 110 280 110 280 150" />
                  </g>
                  {[40, 140, 240].map((x, i) => (
                    <g key={x} transform={`translate(${x},150)`}>
                      <rect width="80" height="90" rx="10" fill="var(--surface-1)" stroke="var(--border)" />
                      <rect x="10" y="12" width="60" height="5" rx="3" fill="var(--surface-2)" />
                      <rect x="10" y="23" width="50" height="5" rx="3" fill="var(--surface-2)" />
                      <text x="40" y="72" textAnchor="middle" fontSize="8" fill="var(--text-muted)" letterSpacing="0.06em">BANK {i + 1}</text>
                      <text x="40" y="83" textAnchor="middle" fontFamily="monospace" fontSize="7" fill="var(--text-muted)">manual edits</text>
                    </g>
                  ))}
                </svg>
              ),
            }}
            after={{
              strongText: "Compounding effort.",
              summary: "Every new bank inherits the system. Brand + component configuration replaces manual redesign, and every improvement benefits every future deal.",
              visual: (
                <svg viewBox="0 0 360 260" className="w-full h-full overflow-visible">
                  <g transform="translate(110,20)">
                    <rect width="140" height="52" rx="10" fill="rgba(244,63,94,0.12)" stroke="rgb(244,63,94)" strokeWidth="1" />
                    <text x="70" y="22" textAnchor="middle" fontFamily="monospace" fontSize="9" fill="rgb(244,63,94)" letterSpacing="0.06em">CONFIG ENGINE</text>
                    <text x="70" y="38" textAnchor="middle" fontSize="11" fontWeight="500" fill="var(--foreground)">Tokens + Components</text>
                  </g>
                  <g stroke="rgb(244,63,94)" fill="none" opacity="0.7">
                    <path d="M 180 72 C 180 110 80 110 80 150" />
                    <path d="M 180 72 L 180 150" />
                    <path d="M 180 72 C 180 110 280 110 280 150" />
                  </g>
                  {[
                    { x: 40,  color: "rgb(244,63,94)", label: "BANK A" },
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
      <CsSection id="what-changed" label="What Changed" variant="dark">
        <div className="space-y-10">
          <div className="grid md:grid-cols-[3fr_2fr] gap-10 items-start">
            <h2 className="type-case-title text-foreground">
              A system built for sales velocity.
            </h2>
            <p className="text-[15px] text-muted-foreground leading-relaxed">
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

          <div className="grid md:grid-cols-3 divide-x divide-border border-t border-b border-border">
            {[
              { num: "M.01", figure: "~70%", label: "Reduction in per-RFP design effort, measured against the prior template workflow." },
              { num: "M.02", figure: "Template → Config", label: "Shifted the platform from a rigid template to a reusable configuration model." },
              { num: "M.03", figure: "Faster Sales Loop", label: "Materially improved demo responsiveness during high-stakes enterprise negotiations." },
            ].map((m, i) => (
              <FadeIn key={m.num} delay={i * 0.08}>
                <div className="px-8 py-10">
                  <p className="font-mono text-[11px] text-muted-foreground/60 tracking-[0.06em] mb-5">{m.num}</p>
                  <p className="text-[clamp(28px,3vw,42px)] font-medium tracking-tight leading-none mb-4 text-accent">{m.figure}</p>
                  <p className="text-[14px] text-muted-foreground leading-relaxed max-w-[240px]">{m.label}</p>
                </div>
              </FadeIn>
            ))}
          </div>
        </div>
      </CsSection>

      {/* Reflection */}
      <CsSection id="reflection" label="Key Reflection">
        <div className="space-y-12">
          <blockquote className="border-l-2 border-accent/60 pl-6 max-w-2xl">
            <p className="text-xl md:text-2xl font-medium text-foreground leading-[1.5]">
              Customization and consistency aren&apos;t a trade-off, they&apos;re a{" "}
              <em className="not-italic text-accent">layering problem</em>. The system became fast
              the moment we stopped treating{" "}
              <em className="not-italic text-accent">brand</em> as a property of components and
              started treating it as a layer above them.
            </p>
          </blockquote>

          <CsReflection
            learned="I stopped treating brand as a property of components and started treating it as a layer above them. Once that layering clicked, the customization-versus-consistency argument dissolved: each layer got one job, and the system got fast without getting fragile."
            next="Scope the token schema with engineering before promising it to stakeholders. Making it comprehensive enough to cover every component took more upfront definition work than anyone expected, and that surprise cost credibility the architecture then had to win back."
            validate="How far tokenization stretches. Some bespoke brand requests still fall outside the schema and need manual overrides, and the model only holds if those stay the exception rather than quietly becoming the norm."
          />
        </div>
      </CsSection>

      <CsNextStudies currentHref="/work/white-label-rfp" />

    </div>
  )
}
