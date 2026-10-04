import {
  CsHeroShell,
  CsSection,
  CsDecision,
  CsList,
  CsInfoBar,
  CsFeature,
  CsBeforeAfter,
  CsBrandSkinCompare,
  CsArchStack,
  CsNextStudies,
  CsChapterNav,
  CsProvenance,
  CsSummary,
  CsOptions,
  CsAnnotatedImage,
  CsReflection,
} from "@/components/case-study"
import { FadeIn } from "@/components/shared/fade-in"
import { AddLater } from "@/components/shared/add-later"
import type { BrandSkin } from "@/components/case-study"

// ─── BRAND SKINS ─────────────────────────────────────────────────────────────

const BRAND_SKINS: BrandSkin[] = [
  { id: "north",    bank: "North Bank",     primary: "#E11D48", deep: "#9F1239", radius: "12px", fontLabel: "Onest",       fontStack: "var(--ff-sans), ui-sans-serif, system-ui, sans-serif" },
  { id: "heritage", bank: "Heritage Trust", primary: "#8A6420", deep: "#6E4E12", radius: "4px",  fontLabel: "Serif",       fontStack: "\"Iowan Old Style\", Georgia, \"Times New Roman\", serif" },
  { id: "verde",    bank: "Verde Bank",     primary: "#25785C", deep: "#1C5A45", radius: "18px", fontLabel: "System sans", fontStack: "ui-sans-serif, system-ui, -apple-system, sans-serif" },
]

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
        <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-muted-foreground">
          Configurable architecture
        </p>
        <span className="font-mono text-[11px] text-accent">4 layers</span>
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
          Decoupled core UX from brand across PartnerBank, Mastercard&apos;s
          white-label banking platform, so a{" "}
          <strong className="font-medium text-foreground">rigid template</strong>{" "}
          became a{" "}
          <strong className="font-medium text-foreground">configurable system</strong>{" "}
          for RFP demos.
        </>
      }
      meta={{
        role:         "Design Lead",
        platform:     "Web · Banking Platform",
        scope:        "White-label RFP System",
        organisation: "Mastercard",
      }}
      readTime="5 min read"
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
          problem="Demos decide enterprise RFPs, but every new bank needed manual design work, so effort grew with every deal."
          role="Led the design side: decoupled core UX from brand, standardised the component library, and introduced token theming so a re-skin became a configuration pass."
          outcome={
            <>
              A four-layer configurable architecture that made prospect re-skins a config swap.{" "}
              <AddLater note="the measured change in demo turnaround. The site has said “same-day”, “10 days to 3 days” and “about 70%”; keep the one that’s true." />
            </>
          }
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
              PartnerBank demos decide enterprise RFPs with major banks, but the
              platform was built to look the same everywhere.
            </p>
          </div>
          <CsList items={[
            "Every RFP needed dedicated design effort",
            "Each bank wanted visual and structural changes, with nothing reusable",
            "Design effort grew one-for-one with deal volume",
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
          </div>

          <CsOptions
            question="Stay simple, or get fast?"
            options={[
              {
                title: "Preserve rigidity for system simplicity",
                body: "Keep the template model: one look, nothing to configure.",
                verdict:
                  "The cost didn't disappear. It moved into manual work on every RFP, at the worst moment in the deal.",
              },
              {
                title: "Introduce modular customization",
                body: "Separate brand from architecture so personalisation is configuration and effort compounds across deals.",
                verdict:
                  "Brand-layer customisation didn't weaken the system once it was modular, and demos got faster.",
                chosen: true,
              },
            ]}
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
              { num: "01", title: "Structural Audit", body: "Found the constraints that blocked fast customisation." },
              { num: "02", title: "Decouple Layers", body: "Split core UX from brand: two systems instead of one." },
              { num: "03", title: "Modular Components", body: "Turned banking modules into reusable, swappable parts." },
              { num: "04", title: "Token-Based Theming", body: "Made each brand a configuration, not a redesign." },
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
              Each layer has one job, so brand changes never touch UX logic.
            </p>
          </div>
          <CsArchStack layers={[
            { num: "L1", title: "Core Banking UX Layer", body: "Accounts, transactions, transfers, and statements. Unchanged across deals.", meta: ["flows", "interactions", "states"] },
            { num: "L2", title: "Modular Component Library", body: "Account card, transaction list, CTA block: primitives that compose into any screen.", meta: ["primitives", "variants", "compositions"] },
            { num: "L3", title: "Brand Token Layer", body: "Colour, type, radius, and elevation tokens that re-skin everything in one pass.", meta: ["color", "type", "elevation"], isCore: true },
            { num: "L4", title: "Demo Configuration Engine", body: "Combines tokens and components into a deal-ready demo.", meta: ["configure", "preview", "ship"] },
          ]} />
        </div>
      </CsSection>

      {/* Key Decisions (dark) */}
      <CsSection id="key-decisions" label="Key Decisions" variant="default">
        <div className="space-y-5">
          <CsDecision
            index={0}
            title="Banking screens as swappable parts"
            problem="Screens were tightly coupled, so one change for a prospect meant re-editing several pieces."
            decision="Broke every screen into independent units with variants and props."
            tradeoff="Two sprints of upfront work before the payoff showed in demo build times."
            impact="New deals composed screens from the library, which grew from 8 to 31 components in six months."
          />
          <CsDecision
            index={1}
            title="One config file, one brand skin"
            problem="Each prospect's brand was applied by hand across dozens of files: a redesign every deal."
            decision="Moved brand identity into one token configuration: colour, type, radius, elevation."
            tradeoff="The schema took more definition than expected, and some bespoke requests still needed manual overrides."
            impact="A new bank's re-skin became a configuration pass, so design stopped being the blocker."
          />
          <CsDecision
            index={2}
            title="Collapsing the time-critical steps"
            problem="Brand application and component selection, the two slowest steps, gated sales during live RFPs."
            decision="Built a configuration layer that does both in one pass from the prospect's parameters."
            tradeoff="One more layer for engineering to maintain, and highly bespoke requests still needed custom work."
            impact="The team could answer demo requests on timelines that weren't possible before, and sales cited it as a differentiator in competitive RFPs."
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
            body="Independent units with variants and props. Composition replaced replication."
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
            body="One brand layer for colour, type, and spacing applies a prospect's identity to every component at once."
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
            body="The two steps that gated sales became one repeatable pass."
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
              One banking screen, three token sets. Drag the divider: colour, radius, and type
              change; structure doesn&apos;t.
            </p>
          </div>

          <FadeIn>
            <CsBrandSkinCompare base={BRAND_SKINS[0]} alternates={BRAND_SKINS.slice(1)} />
          </FadeIn>

          <CsAnnotatedImage
            src="/assets/images/work/white-label-platform.jpg"
            alt="A configured PartnerBank demo with the system layers called out"
            caption="Representative visual, anonymised placeholder. Real prospect demos are confidential."
            annotations={[
              { x: 20, y: 22, title: "Brand token skin", text: "Colour, type, radius, and elevation from one config file." },
              { x: 66, y: 30, title: "Stable core UX", text: "The same proven flows in every deal." },
              { x: 34, y: 64, title: "Swappable modules", text: "Screens compose from banking primitives instead of being rebuilt." },
              { x: 80, y: 80, title: "Deal-ready output", text: "A demo sales can show without a design cycle." },
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
              summary: "Every bank started from one template and needed hand edits, so effort grew with deal volume.",
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
              summary: "Every bank inherits the system, and every improvement helps the next deal.",
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
              The new flexibility strengthened Mastercard&apos;s position in high-value RFP cycles.
            </p>
          </div>

          <AddLater block note="a before-and-after chart of demo turnaround with the real numbers. The old chart was labelled “illustrative” while the metric beside it said “measured”." />

          <div className="grid md:grid-cols-2 divide-x divide-border border-t border-b border-border">
            {[
              { num: "M.01", figure: "Template → Config", label: "A rigid template became a reusable configuration model." },
              { num: "M.02", figure: "Faster sales loop", label: "Demos kept pace with high-stakes negotiations." },
            ].map((m, i) => (
              <FadeIn key={m.num} delay={i * 0.08}>
                <div className="px-8 py-10">
                  <p className="font-mono text-[11px] text-muted-foreground tracking-[0.06em] mb-5">{m.num}</p>
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
          <CsReflection
            learned="Customisation and consistency aren't a trade-off; they're a layering problem. Once brand became a layer above components instead of a property of them, the system got fast without getting fragile."
            next="Scope the token schema with engineering before promising it. It took more definition than anyone expected, and that surprise cost credibility."
            validate="How far tokens stretch. The model holds only while bespoke overrides stay the exception."
          />
        </div>
      </CsSection>

      <CsNextStudies currentHref="/work/white-label-rfp" />

    </div>
  )
}
