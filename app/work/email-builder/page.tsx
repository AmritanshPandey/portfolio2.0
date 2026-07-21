import {
  CsHeroShell,
  CsSection,
  CsDecision,
  CsInfoBar,
  CsArchStack,
  CsMetricBars,
  CsNextStudies,
  CsChapterNav,
  CsProvenance,
  CsSummary,
  CsPrinciples,
  CsOptions,
  CsComparisonTable,
  CsAnnotatedImage,
  CsQuote,
  CsReflection,
} from "@/components/case-study"
import { FadeIn } from "@/components/shared/fade-in"

// ─── CHAPTERS ────────────────────────────────────────────────────────────────

const CHAPTERS = [
  { id: "problem",          label: "Problem" },
  { id: "my-role",          label: "My role" },
  { id: "principles",       label: "Principles" },
  { id: "key-decisions",    label: "Decisions" },
  { id: "architecture",     label: "Architecture" },
  { id: "outlook-problem",  label: "The Outlook problem" },
  { id: "template-library", label: "Template library" },
  { id: "the-shift",        label: "The shift" },
  { id: "what-changed",     label: "What changed" },
  { id: "reflection",       label: "Reflection" },
]

// ─── EMAIL CLIENT COMPAT DATA ────────────────────────────────────────────────

const EMAIL_CLIENTS = [
  { name: "Outlook Desktop", status: "problem", issue: "No div support · tables only · breaks modern CSS" },
  { name: "Outlook Web",     status: "problem", issue: "Inconsistent font rendering · dark mode issues" },
  { name: "Apple Mail",      status: "partial", issue: "Good HTML5 support · dark mode needs extra handling" },
  { name: "Gmail",           status: "ok",      issue: "Strips head styles · inline CSS required" },
  { name: "iOS Mail",        status: "ok",      issue: "Reliable · good responsive support" },
  { name: "Samsung Mail",    status: "partial", issue: "Variable rendering across Android versions" },
]

const STATUS_DOT: Record<string, string> = {
  ok:      "bg-accent",
  partial: "bg-accent",
  problem: "bg-red-500",
}
const STATUS_BG: Record<string, string> = {
  ok:      "bg-card border-border",
  partial: "bg-accent/8 border-accent/40",
  problem: "bg-red-500/8 border-red-400/40",
}
const STATUS_TEXT: Record<string, string> = {
  ok:      "text-muted-foreground",
  partial: "text-accent",
  problem: "text-red-700 dark:text-red-400",
}

// ─── CONSTRAINT TABLE DATA ───────────────────────────────────────────────────

const CONSTRAINT_ROWS = [
  {
    criterion: "Layout",
    values: [
      "CSS div-based flexible layouts",
      "No div support, breaks entirely in Outlook Desktop",
      "Table-based layouts, rigid but universal and reliable",
    ],
  },
  {
    criterion: "Buttons",
    values: [
      "CSS-styled dynamic buttons",
      "CSS buttons partially ignored, inconsistent borders and padding",
      "VML-backed buttons, renders consistently across all versions",
    ],
  },
  {
    criterion: "Typography",
    values: [
      "Web fonts (brand typeface)",
      "Web fonts not supported, fallback to system fonts only",
      "Email-safe font stack with brand-aligned fallbacks",
    ],
  },
  {
    criterion: "Dark mode",
    values: [
      "Dark mode-aware design",
      "Outlook inverts colours unpredictably in dark mode",
      "Tested colour pairs that remain legible in both modes",
    ],
  },
  {
    criterion: "Responsive",
    values: [
      "Responsive fluid layouts",
      "Max-width and media queries inconsistently applied",
      "Fixed-width core (600px) with mobile-only breakpoint handling",
    ],
  },
  {
    criterion: "Motion",
    values: [
      "HTML5 video embeds",
      "Not supported, blank space or broken placeholder",
      "Animated GIF with static fallback image, works everywhere",
    ],
  },
]

// ─── HERO ────────────────────────────────────────────────────────────────────

/** Signature visual — the real constraint: email-client compatibility. */
function HeroAside() {
  return (
    <div>
      <div className="grid grid-cols-2 gap-1.5">
        {EMAIL_CLIENTS.map(c => (
          <div key={c.name} className={`rounded-xl p-3 border ${STATUS_BG[c.status]}`}>
            <div className="flex items-center gap-2 mb-1">
              <div className={`w-2 h-2 rounded-full shrink-0 ${STATUS_DOT[c.status]}`} />
              <span className="text-[12px] font-medium text-foreground">{c.name}</span>
            </div>
            <p className={`text-[10px] leading-relaxed ${STATUS_TEXT[c.status]}`}>{c.issue}</p>
          </div>
        ))}
      </div>
      <p className="text-[10px] text-muted-foreground/80 mt-3 leading-relaxed">
        Every design decision was filtered through: &ldquo;Will this render in Outlook Desktop?&rdquo;
      </p>
    </div>
  )
}

function Hero() {
  return (
    <CsHeroShell
      breadcrumb={{ kind: "Case Study", category: "Design Systems", client: "Mastercard · Creative Studio" }}
      keywords={["Design System Lead", "Email Infrastructure", "No-Code Tooling"]}
      title={
        <>
          From{" "}
          <em className="not-italic text-accent">HTML dependency</em>{" "}
          to no-code email infrastructure.
        </>
      }
      lede={
        <>
          Owned the component architecture and design system for Mastercard&apos;s
          global email builder, defining{" "}
          <strong className="font-medium text-foreground">what got built, why, and in what order</strong>.
          The constraint wasn&apos;t brand. It was{" "}
          <strong className="font-medium text-foreground">Outlook</strong>.
        </>
      }
      meta={{
        role:         "Design System Lead",
        platform:     "Email · Multi-client",
        scope:        "50+ Components · 28 Templates",
        organisation: "Mastercard",
      }}
      readTime="12 min read"
      publishedDate="2023"
      topics={["Design Systems", "Infrastructure", "Email", "Scale"]}
      asideLabel="The real constraint, client compatibility"
      asideCol="340px"
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

      <CsInfoBar cells={[
        { label: "Client",     value: "Mastercard",          sub: "Creative Studio" },
        { label: "Role",       value: "Design System Lead",  sub: "Component architecture + governance" },
        { label: "Duration",   value: "6–8 months",          sub: "+ ongoing feedback iterations" },
        { label: "System",     value: "50+ components",      sub: "28 templates · 9 categories" },
        { label: "Constraint", value: "Outlook Desktop",     sub: "Drove every design decision" },
        { label: "Adoption",   value: "Mastercard-wide",     sub: "Backed by Global Brand team" },
      ]} />

      {/* 30-second read */}
      <div className="mx-auto max-w-5xl px-6 pt-14 md:px-8">
        <div className="mb-5 flex flex-wrap gap-2">
          <CsProvenance kind="shipped" label="In production, Mastercard-wide" />
          <CsProvenance kind="anonymised" label="Visuals anonymised" />
        </div>
        <CsSummary
          problem="Custom emails needed HTML knowledge, so teams either waited on agencies or fell back to outdated generic templates. After the rebrand, the gap between the new identity and email communication was visible to everyone."
          role="Owned the component architecture, design standards, governance model, and roadmap. A senior engineer owned the HTML and builder code; another designer owned the builder dashboard UX."
          outcome="A no-code builder on 50+ Outlook-safe components and 28 templates, adopted Mastercard-wide with Global Brand's backing. Teams that avoided custom emails now build them without touching HTML."
        />
      </div>

      {/* Problem */}
      <CsSection id="problem" label="The Problem" withDivider={false}>
        <div className="space-y-6">
          <h2 className="type-case-title text-foreground">
            Mastercard&apos;s brand evolved. Its email system hadn&apos;t.
          </h2>

          <FadeIn>
            <div className="grid md:grid-cols-2 gap-4">
              <div className="rounded-2xl border border-border bg-card p-7">
                <p className="text-[10px] font-semibold uppercase tracking-[0.18em] text-muted-foreground mb-4">Operational problem</p>
                <p className="text-[14px] text-muted-foreground leading-relaxed">
                  Custom emails required HTML knowledge. Teams either depended on agencies,
                  which was slow, expensive, and inconsistent, or avoided custom emails altogether and defaulted
                  to outdated generic templates. After the Mastercard.com rebrand, the gap between
                  the updated digital identity and downstream email communication became immediately visible.
                </p>
              </div>
              <div className="rounded-2xl border border-border bg-card p-7">
                <p className="text-[10px] font-semibold uppercase tracking-[0.18em] text-muted-foreground mb-4">Technical problem</p>
                <p className="text-[14px] text-muted-foreground leading-relaxed">
                  Even when teams had HTML skills, Outlook Desktop&apos;s lack of modern CSS support
                  meant hand-coded emails regularly broke. Div-based layouts failed. Dynamic buttons
                  required workarounds. Font handling was inconsistent. No standard, no governance,
                  and no system to prevent it from happening again.
                </p>
              </div>
            </div>
          </FadeIn>

          <FadeIn>
            <div className="rounded-2xl border border-border bg-muted/40 px-8 py-6">
              <p className="text-[10px] font-semibold uppercase tracking-[0.18em] text-muted-foreground mb-3">The central tension</p>
              <p className="text-[16px] text-foreground leading-relaxed max-w-2xl">
                Teams wanted richer, more branded communication. Outlook Desktop, still dominant
                across enterprise, couldn&apos;t render it. The design system had to make the best
                possible email within the worst possible constraint.{" "}
                <em className="not-italic font-medium">Simplicity wasn&apos;t a design preference. It was an engineering requirement.</em>
              </p>
            </div>
          </FadeIn>
        </div>
      </CsSection>

      {/* My Role */}
      <CsSection id="my-role" label="My Role" variant="muted">
        <div className="space-y-8">
          <div className="space-y-3">
            <h2 className="type-case-title text-foreground">
              Three people. Three clear ownership boundaries.
            </h2>
            <p className="text-[15px] text-muted-foreground leading-relaxed max-w-xl">
              I didn&apos;t build the builder UI and I didn&apos;t write the HTML. I owned what went
              inside both, the component architecture, design standards, governance model, and
              prioritisation of what to build next.
            </p>
          </div>

          <FadeIn>
            <div className="grid md:grid-cols-3 rounded-2xl overflow-hidden border border-border">

              {/* Engineer */}
              <div className="p-7 border-r border-border">
                <p className="text-[10px] font-semibold uppercase tracking-[0.16em] text-muted-foreground mb-1">Senior Engineer</p>
                <p className="text-[16px] font-semibold text-foreground mb-5 tracking-tight">HTML + Builder Code</p>
                <ul className="flex flex-col gap-3">
                  {[
                    "HTML email implementation",
                    "Builder platform development",
                    "Email client compatibility fixes",
                    "Outlook-specific workarounds",
                    "Responsive email coding",
                  ].map(item => (
                    <li key={item} className="flex gap-2.5 text-[13px] text-muted-foreground">
                      <span className="text-border mt-0.5 shrink-0">·</span>{item}
                    </li>
                  ))}
                </ul>
              </div>

              {/* You, highlighted */}
              <div className="p-7 bg-accent/[0.08] border-r border-accent/25">
                <p className="text-[10px] font-semibold uppercase tracking-[0.16em] text-accent mb-1">You, Design System Lead</p>
                <p className="text-[16px] font-semibold text-accent mb-5 tracking-tight">Component Architecture + Governance</p>
                <ul className="flex flex-col gap-3">
                  {[
                    "Defined what components to build and why",
                    "Modular architecture decision",
                    "Design standards and governance",
                    "User research and feedback loops",
                    "Prioritisation of roadmap",
                    "UX guidance and strategy",
                    "Simplicity-over-complexity calls",
                    "Global Brand alignment",
                  ].map(item => (
                    <li key={item} className="flex gap-2.5 text-[13px] text-accent">
                      <span className="text-accent mt-0.5 shrink-0">✓</span>{item}
                    </li>
                  ))}
                </ul>
              </div>

              {/* Designer */}
              <div className="p-7">
                <p className="text-[10px] font-semibold uppercase tracking-[0.16em] text-muted-foreground mb-1">Designer</p>
                <p className="text-[16px] font-semibold text-foreground mb-5 tracking-tight">Builder Dashboard UX</p>
                <ul className="flex flex-col gap-3">
                  {[
                    "Builder interface design",
                    "User flows within the tool",
                    "Template selection experience",
                    "Dashboard and preview UX",
                    "Authoring interaction patterns",
                  ].map(item => (
                    <li key={item} className="flex gap-2.5 text-[13px] text-muted-foreground">
                      <span className="text-border mt-0.5 shrink-0">·</span>{item}
                    </li>
                  ))}
                </ul>
              </div>

            </div>
          </FadeIn>
        </div>
      </CsSection>

      {/* Principles */}
      <CsSection id="principles" label="Design Principles">
        <div className="space-y-8">
          <h2 className="type-case-title text-foreground">
            Four rules that settled every argument.
          </h2>
          <CsPrinciples
            intro="When a stakeholder pushed for more and the engineering said less, these were the rules we went back to instead of opinion."
            principles={[
              {
                title: "Outlook Desktop is the floor, not an edge case",
                body: "The dominant enterprise client gets designed for first. Anything that breaks there does not ship, however good it looks everywhere else.",
                applied: "Every component in the library renders in Outlook Desktop before it earns a place in the system.",
              },
              {
                title: "Components, not templates",
                body: "A template is a dead end: every brand update means re-editing it. A component propagates. The effort compounds instead of repeating.",
                applied: "A brand update touches one component and flows through all 28 templates.",
              },
              {
                title: "Simple enough for anyone beats powerful for a few",
                body: "The adoption problem was intimidation, not capability. A tool that solves for power users and scares everyone else has failed at its actual job.",
                applied: "Select a component, fill in content, ship. No code, no design tool, no vendor.",
              },
              {
                title: "Governance only works with authority behind it",
                body: "A design system without organisational backing erodes one exception at a time. The standards held because Global Brand endorsed them, not because they were well documented.",
                applied: "Requests to break the system went to the governance model, not to whoever asked loudest.",
              },
            ]}
          />
        </div>
      </CsSection>

      {/* Key Decisions */}
      <CsSection id="key-decisions" label="Key Decisions" variant="dark">
        <div className="space-y-5">
          <div className="pb-6">
            <CsOptions
              question="The first call shaped everything after it: what should the system actually be made of?"
              options={[
                {
                  title: "Keep the agency model",
                  body: "Teams keep commissioning custom emails from external agencies whenever they need something branded.",
                  verdict:
                    "Slow, expensive, and inconsistent. It was the status quo that created the problem, and it kept HTML as a gate in front of every send.",
                },
                {
                  title: "Build 28 bespoke templates",
                  body: "Hand-build each template the categories needed. Fastest path to a visible launch.",
                  verdict:
                    "Every future brand update would mean manual edits across all 28. The effort repeats forever instead of compounding.",
                },
                {
                  title: "Build a component library",
                  body: "50+ modular pieces that teams assemble into any email. Started as a Figma library concept, evolved into the no-code builder.",
                  verdict:
                    "More upfront architecture work, invisible to stakeholders at first. But a brand update now touches one component and propagates through every template.",
                  chosen: true,
                },
              ]}
            />
          </div>
          <CsDecision
            index={0}
            title="Push for design ambition, or design within the Outlook constraint?"
            problem="Stakeholders wanted richer, more visual emails, multi-column layouts, custom fonts, dynamic CTAs. Outlook Desktop couldn&apos;t render any of it reliably without complex, brittle workarounds."
            decision="Every time a stakeholder pushed for more visual complexity, the answer was to simplify the design rather than push for complex engineering workarounds. Outlook Desktop is the floor, not an edge case to hack around."
            tradeoff="Required repeatedly saying no to stakeholders who wanted more, and having Global Brand&apos;s endorsement to hold that line. Without organisational authority backing the governance model, it would have eroded on day one."
            impact="The constraint produced more durable design. The emails that perform best in enterprise environments are rarely the most visually complex. Simplicity wasn&apos;t a compromise, it was the correct answer."
          />
          <CsDecision
            index={1}
            title="Build a powerful feature-rich tool, or keep it simple enough for anyone to use?"
            problem="The biggest adoption problem wasn&apos;t technical capability, it was intimidation. Teams avoided custom emails because HTML felt too risky. A more powerful tool with a high capability ceiling would solve for power users and fail for everyone else."
            decision="Radical simplicity: any non-HTML person should be able to build a branded email. Select a component. Fill in content. Ship it. No code, no design tool, no external vendor required."
            tradeoff="Power users wanted advanced customisation, pixel-level control, export options. Those use cases were left underserved intentionally. The 80% case, any team, any region, on brand, mattered more than the 20%."
            impact="Teams that previously avoided custom emails because HTML felt too risky began creating richer branded communication more frequently. Removing the HTML requirement changed the behaviour, not just the tooling."
          />
        </div>
      </CsSection>

      {/* System Architecture */}
      <CsSection id="architecture" label="System Architecture" variant="dark">
        <div className="space-y-8">
          <div className="grid md:grid-cols-[3fr_2fr] gap-10 items-start mb-2">
            <h2 className="type-case-title text-foreground">
              Four levels. One coherent system.
            </h2>
            <p className="text-[15px] text-muted-foreground leading-relaxed">
              Foundations are stable. Components are reusable. Patterns are assembled.
              Templates are shipped. Each level builds on the one below, and a change
              to any level propagates upward automatically.
            </p>
          </div>
          <CsArchStack layers={[
            {
              num: "L1",
              title: "Foundations",
              body: "Spacing system, typography hierarchy, brand colour tokens, responsive grid, accessibility standards, and email-safe colour system. These never change.",
              meta: ["spacing", "type", "colour"],
            },
            {
              num: "L2",
              title: "Components",
              body: "50+ modular building blocks, hero banners, CTA modules, content cards, editorial blocks, product highlights, event modules, legal footers. All Outlook-safe.",
              meta: ["50+ components", "Outlook-safe"],
              isCore: true,
            },
            {
              num: "L3",
              title: "Patterns",
              body: "Recurring email structures assembled from components, campaign layouts, launch announcements, newsletters, internal comms, event invitations.",
              meta: ["campaigns", "newsletters", "events"],
            },
            {
              num: "L4",
              title: "Templates",
              body: "28 best-practice templates across 9 communication categories. Mastercard-wide. Every template is a composition of L2 components, update a component, update every template.",
              meta: ["28 templates", "9 categories"],
            },
          ]} />
        </div>
      </CsSection>

      {/* Outlook constraint table */}
      <CsSection id="outlook-problem" label="The Outlook Problem">
        <div className="space-y-8">
          <div className="space-y-3">
            <h2 className="type-case-title text-foreground">
              What we wanted vs. what Outlook could handle.
            </h2>
            <p className="text-[15px] text-muted-foreground leading-relaxed max-w-xl">
              Every time we wanted to do something modern, Outlook Desktop said no.
              Here&apos;s how every major design decision was reshaped by that constraint.
            </p>
          </div>

          <CsComparisonTable
            columns={["What we wanted", "What Outlook allowed", "What we built"]}
            highlight={2}
            rows={CONSTRAINT_ROWS}
            caption="Six times the modern answer lost to the one that renders everywhere."
          />
        </div>
      </CsSection>

      {/* Template library */}
      <CsSection id="template-library" label="Template Library" variant="muted">
        <div className="space-y-8">
          <div className="grid md:grid-cols-[3fr_2fr] gap-10 items-start">
            <h2 className="type-case-title text-foreground">
              28 templates. 9 categories. All Outlook-safe.
            </h2>
            <p className="text-[15px] text-muted-foreground leading-relaxed">
              Every template is assembled from the component library, not built from scratch.
              Updating a component updates every template that uses it.
            </p>
          </div>

          <FadeIn>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
              {[
                { name: "Newsletter",       sub: "Recurring communications" },
                { name: "Announcement",     sub: "Product + org updates" },
                { name: "Event Invite",     sub: "Conferences + webinars" },
                { name: "CEO / Leadership", sub: "Executive messaging" },
                { name: "B2B Campaign",     sub: "Partner + sales comms" },
                { name: "Product Campaign", sub: "Feature launches" },
                { name: "Information",      sub: "Updates + notices" },
                { name: "Internal Comms",   sub: "Employee messaging" },
                { name: "Other",            sub: "Edge cases + custom" },
              ].map((cat, i) => (
                <FadeIn key={cat.name} delay={i * 0.04}>
                  <div className="rounded-2xl border border-border bg-card p-5">
                    <p className="text-[14px] font-semibold text-foreground mb-1.5 tracking-tight">{cat.name}</p>
                    <p className="text-[12px] text-muted-foreground">{cat.sub}</p>
                  </div>
                </FadeIn>
              ))}
            </div>
          </FadeIn>

          {/* Adoption feedback loop */}
          <FadeIn>
            <div className="space-y-4">
              <p className="text-[10px] font-semibold uppercase tracking-[0.2em] text-muted-foreground">
                Adoption strategy, the feedback loop
              </p>
              <p className="text-[14px] text-muted-foreground leading-relaxed max-w-xl">
                Building the system was half the job. Getting teams to actually use it was the other half.
                Regular interviews with power users drove iteration on real workflow friction.
              </p>
              <div className="flex items-center flex-wrap gap-2 rounded-2xl bg-card border border-border p-5">
                {["Training", "Adoption", "User feedback", "Iteration", "Improved usability", "Wider adoption"].map((step, i, arr) => (
                  <div key={step} className="flex items-center gap-2">
                    <span className="text-[12px] font-medium text-foreground bg-muted border border-border rounded-full px-3 py-1 whitespace-nowrap">
                      {step}
                    </span>
                    {i < arr.length - 1 && (
                      <span className="text-muted-foreground text-sm">→</span>
                    )}
                    {i === arr.length - 1 && (
                      <span className="text-muted-foreground text-sm">↺</span>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </FadeIn>
        </div>
      </CsSection>

      {/* Before / After builder */}
      <CsSection id="the-shift" label="The Shift">
        <div className="space-y-8">
          <h2 className="type-case-title text-foreground">
            From HTML knowledge required to anyone can build a branded email.
          </h2>

          <FadeIn>
            <div className="grid md:grid-cols-2 gap-5">

              {/* Before, dark code panel */}
              <div className="rounded-2xl overflow-hidden border border-border">
                <div className="px-6 py-4 bg-neutral-900 border-b border-white/10">
                  <p className="text-[12px] font-medium text-neutral-400 uppercase tracking-[0.14em]">Before, manual HTML workflow</p>
                </div>
                <div className="bg-neutral-950 p-6 font-mono text-[11px] leading-relaxed space-y-1">
                  <p className="text-red-400/80">&lt;table width=&quot;600&quot; border=&quot;0&quot; cellspacing=&quot;0&quot;&gt;</p>
                  <p className="text-red-400/80">&nbsp;&nbsp;&lt;tr&gt;&lt;td style=&quot;padding:0;margin:0;&quot;&gt;</p>
                  <p className="text-accent/70">&nbsp;&nbsp;&nbsp;&nbsp;&lt;!--[if mso]&gt;&lt;v:rect...&gt;</p>
                  <p className="text-red-500">&nbsp;&nbsp;&nbsp;&nbsp;&lt;div style=&quot;color:#000&quot;&gt; &lt;!-- breaks in OL --&gt;</p>
                  <p className="text-red-400/80">&nbsp;&nbsp;&nbsp;&nbsp;&lt;p style=&quot;font-family:Arial;&quot;&gt;</p>
                  <p className="text-red-500">&nbsp;&nbsp;&nbsp;&nbsp;&lt;!-- font ignored in Outlook 2016 --&gt;</p>
                  <p className="text-accent/70">&nbsp;&nbsp;&nbsp;&nbsp;Hello [FIRST_NAME],</p>
                  <p className="text-red-500">&nbsp;&nbsp;&lt;!-- spacing broken on mobile --&gt;</p>
                  <p className="text-red-400/80">&lt;/table&gt;</p>
                </div>
                <div className="px-6 py-5 bg-neutral-900 border-t border-white/10">
                  <p className="text-[18px] font-medium text-red-400">HTML required</p>
                  <p className="text-[11px] text-neutral-400 mt-1">Agency dependency · inconsistent output · weeks of turnaround</p>
                </div>
              </div>

              {/* After, clean builder panel */}
              <div className="rounded-2xl overflow-hidden border border-border">
                <div className="px-6 py-4 bg-accent/10 border-b border-accent/20">
                  <p className="text-[12px] font-medium text-accent uppercase tracking-[0.14em]">After, no-code builder</p>
                </div>
                <div className="bg-muted/30 p-6 space-y-2.5">
                  {[
                    { label: "Hero banner",     type: "Foundation" },
                    { label: "Editorial block", type: "Component" },
                    { label: "CTA module",      type: "Component" },
                    { label: "Legal footer",    type: "Component" },
                  ].map(block => (
                    <div key={block.label} className="flex items-center gap-3 bg-card border border-border rounded-xl px-4 py-3">
                      <span className="text-[14px] text-muted-foreground select-none">⠿</span>
                      <span className="text-[13px] font-medium text-foreground flex-1">{block.label}</span>
                      <span className="text-[10px] font-mono text-muted-foreground tracking-wide">{block.type}</span>
                    </div>
                  ))}
                </div>
                <div className="px-6 py-5 bg-accent/5 border-t border-accent/20">
                  <p className="text-[18px] font-medium text-accent">Zero HTML required</p>
                  <p className="text-[11px] text-muted-foreground mt-1">Any team · any region · on-brand · Outlook-safe</p>
                </div>
              </div>

            </div>
          </FadeIn>

          {/* Anatomy of a built email */}
          <CsAnnotatedImage
            src="/assets/images/work/execution-system.jpg"
            alt="Anatomy of an email assembled from the component library"
            caption="Representative visual with placeholder imagery. The builder itself is an internal Mastercard tool."
            annotations={[
              { x: 24, y: 18, title: "Component picker", text: "Every block comes from the 50+ piece library. Nothing on the canvas can go off-brand, because off-brand is not on the menu." },
              { x: 70, y: 32, title: "Composition, not code", text: "An email is a stack of components in an order. The system owns the HTML underneath, including the Outlook workarounds." },
              { x: 38, y: 62, title: "Email-safe by construction", text: "Table layout, VML buttons, tested colour pairs. The constraint work is baked into the pieces so authors never see it." },
              { x: 78, y: 82, title: "Governed footer", text: "Legal and unsubscribe blocks are locked components. The parts that carry risk are the parts nobody can improvise." },
            ]}
          />

          <CsQuote
            quote="Will this render in Outlook Desktop?"
            attribution="The filter on every design decision"
            role="Asked before anything entered the library"
          />

          <FadeIn>
            <div className="rounded-2xl bg-muted/40 border border-border p-7 max-w-3xl">
              <p className="text-[10px] font-semibold uppercase tracking-[0.2em] text-muted-foreground mb-3">The organisational shift</p>
              <p className="text-[15px] text-foreground leading-relaxed">
                Teams that previously avoided custom emails, because HTML felt too risky or agency
                turnaround was too slow, began creating richer branded communication more frequently.
                The barrier wasn&apos;t capability. It was confidence. Removing the HTML requirement
                changed the behaviour, not just the tooling.{" "}
                <em className="not-italic font-medium text-foreground">That&apos;s what a well-designed system does: it changes what people feel able to do.</em>
              </p>
            </div>
          </FadeIn>
        </div>
      </CsSection>

      {/* Impact */}
      <CsSection id="what-changed" label="What Changed" variant="dark">
        <div className="space-y-10">
          <div className="grid md:grid-cols-[3fr_2fr] gap-10 items-start">
            <h2 className="type-case-title text-foreground">
              A system the whole organisation adopted.
            </h2>
            <p className="text-[15px] text-muted-foreground leading-relaxed">
              Backed by Global Brand. Used Mastercard-wide. The number wasn&apos;t how many
              components shipped, it was how many people stopped needing HTML to communicate.
            </p>
          </div>

          <CsMetricBars
            sectionLabel="Barrier to creating a branded email"
            title="What it took to send a branded, Outlook-safe email."
            bars={[
              { label: "Before", width: 100, displayValue: "HTML + agency",  isBefore: true },
              { label: "After",  width: 8,   displayValue: "Zero code" },
            ]}
          />

          <div className="grid md:grid-cols-4 divide-x divide-border border-t border-b border-border">
            {[
              { num: "M.01", figure: "50+",      label: "Modular components, all Outlook-safe, all brand-compliant." },
              { num: "M.02", figure: "28",        label: "Best-practice templates across 9 communication categories." },
              { num: "M.03", figure: "9",         label: "Communication categories covering the full range of Mastercard messaging needs." },
              { num: "M.04", figure: "Zero HTML", label: "Skill level required. Any team, any region can now build a branded email." },
            ].map((m, i) => (
              <FadeIn key={m.num} delay={i * 0.08}>
                <div className="px-6 py-10">
                  <p className="font-mono text-[11px] text-muted-foreground tracking-[0.06em] mb-5">{m.num}</p>
                  <p className="text-[clamp(22px,2.5vw,36px)] font-medium text-accent tracking-tight leading-none mb-4">{m.figure}</p>
                  <p className="text-[13px] text-muted-foreground leading-relaxed">{m.label}</p>
                </div>
              </FadeIn>
            ))}
          </div>
        </div>
      </CsSection>

      {/* Reflection */}
      <CsSection id="reflection" label="Key Reflection">
        <div className="space-y-10">
          <blockquote className="pl-6 max-w-2xl">
            <p className="text-xl md:text-2xl font-medium text-foreground leading-[1.5]">
              The challenge wasn&apos;t creating email templates. It was designing a system{" "}
              <em className="not-italic text-accent">constrained enough</em> to work in Outlook
              and{" "}
              <em className="not-italic text-accent">flexible enough</em> that any team would
              actually want to use it. Governance only works if someone with authority backs it.
            </p>
          </blockquote>

          <CsReflection
            learned="Design systems need political backing, not just design quality. I faced real pushback on the governance model, people wanted more flexibility and more exceptions, and Global Brand's endorsement was what held the line. The other surprise was the constraint itself: Outlook forced every design to be simpler than I wanted, and in retrospect that simplicity is why the system endured."
            next="Instrument usage from launch. Knowing which templates got used most, which components got customised, and which categories drove adoption would have accelerated the feedback loop and made every prioritisation conversation sharper."
            validate="Whether radical simplicity keeps holding as power users grow. The 80% case was the right first bet, but the underserved 20% will eventually push for pixel-level control, and the system has not yet had to absorb that pressure."
          />
        </div>
      </CsSection>

      <CsNextStudies currentHref="/work/email-builder" />

    </div>
  )
}
