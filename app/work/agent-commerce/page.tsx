import Image from "next/image"
import { CsHeroShell } from "@/components/case-study/cs-hero-shell"
import { CsSection } from "@/components/case-study/cs-section"
import { CsDecision } from "@/components/case-study/cs-decision"
import { CsInfoBar } from "@/components/case-study/cs-info-bar"
import { CsNextStudies } from "@/components/case-study/cs-next-studies"
import { CsProvenance } from "@/components/case-study/cs-provenance"
import { CsSummary } from "@/components/case-study/cs-summary"
import { DemoPoster } from "@/components/case-study/demo-poster"
import { FoldPhone } from "@/components/case-study/fold-phone"
import { FadeIn } from "@/components/shared/fade-in"

// ─── DATA ─────────────────────────────────────────────────────────────────────

const LAYERS = [
  {
    ref: "Layer 01 · Market problem",
    title: "AI agents are starting to buy things, and no one has defined what trust looks like.",
    body: "ChatGPT, Claude, and Gemini are all adding commerce. People will hand purchases to an agent: flights, hotels, groceries, subscriptions. Mastercard still processes the payment, but in the background, unseen. With no checkout screen, how does it stay trusted and relevant?",
  },
  {
    ref: "Layer 02 · Internal problem",
    title: "Four teams were building the same flows, and nobody had named the duplication.",
    body: "Product, Tech, Research, and Brand were each building their own agentic flows. Different outputs, duplicated work, no shared language. No one had been asked to fix it. I flagged it and proposed one toolkit every team could build from.",
  },
  {
    ref: "Layer 03 · The design philosophy problem",
    title: "Brand wanted to be everywhere. The right answer was to be almost nowhere.",
    body: "Brand wanted the logo across the whole flow. My read was the opposite: these flows work because they feel fluid, and constant branding breaks that. The real question was not how visible Mastercard should be, but which moments its presence actually builds trust.",
    key: true,
  },
]

const INSIGHTS = [
  {
    ref: "Insight 01 · Platform reality",
    finding: "The invisibility paradox",
    quote: "In normal payments, seeing the brand is the trust signal. In agentic flows, seeing it becomes noise.",
    change: "Visual presence, Mastercard's strongest checkout asset, turns into a liability once the agent is meant to act on its own.",
  },
  {
    ref: "Insight 02 · Trust architecture",
    finding: "Trust isn't constant. It spikes at specific moments.",
    quote: "I don't need to know Mastercard is there the whole time. I need to know it's there when something important happens.",
    change: "So the trust signals follow where anxiety peaks: confirmation, verification, and completion.",
  },
  {
    ref: "Insight 03 · Flow typology",
    finding: "Assisted and Autonomous are two products, not two settings",
    quote: "When I'm in the decision, I want to confirm. When I've handed it over, I just want to know it went through safely.",
    change: "So I designed them as separate flows, each with its own trust model.",
  },
  {
    ref: "Insight 04 · Sensory channel",
    finding: "When the screen belongs to ChatGPT, sound and touch are the only brand channels",
    quote: "On someone else's surface, Mastercard has nowhere to put a logo. The brand has to live somewhere else.",
    change: "That moved sound and haptics from a nice-to-have to the main brand strategy for these environments.",
  },
]

const TOOLKIT = [
  {
    label: "Assisted Agent Pay · 3 flows",
    flows: [
      { num: "01", title: "User-initiated with confirmation", desc: "The user sets the intent, the agent acts, and the user confirms at payment. Trust signal at the confirmation gate." },
      { num: "02", title: "Partial delegation", desc: "The agent picks options, the user approves a shortlist before paying. A built-in double check." },
      { num: "03", title: "Exception handling", desc: "What happens when the agent can't finish: escalate, let the user step back in, reassure." },
    ],
  },
  {
    label: "Autonomous Agent Pay · 3 flows",
    flows: [
      { num: "01", title: "Fully delegated transaction", desc: "The user has pre-approved. The agent pays without interrupting, with an ambient signal after." },
      { num: "02", title: "Recurring autonomous", desc: "Subscriptions and repeat buys. The guardian appears at renewal so the user stays informed." },
      { num: "03", title: "Dispute and reversal", desc: "When an autonomous payment goes wrong. A recovery flow with Mastercard visible throughout." },
    ],
  },
]

const SENSES = [
  {
    kind: "visual" as const,
    name: "Visual",
    desc: "A quiet brand mark at the three guardian moments. It appears, confirms, and recedes, more signal than advertisement.",
    collab: "Own work · Figma + motion team",
  },
  {
    kind: "sound" as const,
    name: "Sound",
    desc: "Short, distinctive audio cues at confirmation, verification, and completion. Built on Mastercard's existing sonic identity.",
    collab: "Collaboration · Video / motion team",
  },
  {
    kind: "haptic" as const,
    name: "Haptics",
    desc: "Three haptic patterns for the three moments, each a different intensity and rhythm. Figma can't do haptics, so we built them outside it and tested regional variations.",
    collab: "Collaboration · Haptic Labs",
  },
]

const DEMO_FEATURES = [
  { title: "React and Claude", desc: "Real AI responses, not a click-through script. It follows wherever the conversation goes." },
  { title: "Editable per meeting", desc: "Name, region, currency, and flight details can be set for whoever is in the room." },
  { title: "Voice mode", desc: "ElevenLabs voice for hands-free demos and voice-first research." },
  { title: "Runs on a phone", desc: "No laptop, no Figma login. The CPO opens it and demos live." },
]

const STATEMENT = [
  { label: "Strategic direction", value: "Adopted", note: "silent guardian, company-wide" },
  { label: "Events used", value: "3", note: "Money20/20 · Connections · McLaren" },
  { label: "Research flows", value: "6", note: "NAM · EU · South America" },
  { label: "React demo", value: "2 weeks", note: "solo build · live in production" },
]

const IMPACT_ROWS = [
  { what: "Internal team alignment", how: "Four teams went from duplicating flows to building from one shared toolkit. The drift stopped at the source." },
  { what: "Strategic direction adopted", how: "The silent guardian held up against Brand and became the agreed approach for Mastercard's role in agentic commerce." },
  { what: "Executive demo capability", how: "The CPO and several SVPs can demo Agent Pay from their phones, with no designer and no Figma login needed." },
  { what: "Multi-sensory research", how: "Six flows with real haptic and sound variations, tested across three regions. The first Mastercard research of its kind in agentic commerce, and it fed V2." },
  { what: "External conversations", how: "The work has been used in live conversations with Google, ChatGPT, and merchant partners to show where Mastercard fits." },
  { what: "New brand dimension", how: "Multi-sensory design is now a Mastercard brand channel for agentic environments, an infrastructure decision the company has kept." },
]

// `done` fills the status mark; the rest stay outlined, as CsProvenance does.
const ROADMAP = [
  {
    version: "V1", date: "8 months · shipped", status: "Complete", done: true,
    items: [
      "6 Figma research flows",
      "Assisted + Autonomous typology",
      "Multi-sensory framework",
      "Haptic Labs collaboration",
      "Multilingual UX research",
      "Silent guardian direction",
      "React + Claude AI demo",
      "ElevenLabs voice mode",
    ],
  },
  {
    version: "V2", date: "In progress", status: "Active", done: false,
    items: [
      "Research findings → refined flows",
      "Updated demos from V1 insights",
      "Extended platform coverage",
      "Deeper multi-sensory integration",
      "Regional demo customisation",
      "Broader internal rollout",
    ],
  },
  {
    version: "Future", date: "Vision", status: "Roadmap", done: false,
    items: [
      "Real transaction integration",
      "Full platform standardisation",
      "Cross-ecosystem trust standards",
      "Production multi-sensory SDK",
      "Self-serve demo toolkit for sales",
    ],
  },
]

const REFLECTIONS = [
  {
    label: "Designing in undefined space",
    body: "There's no settled pattern for agentic payments yet. No precedent, no competitor to copy. I had to work it out from first principles: what trust needs, what an agent needs, and where those overlap. It's the most interesting problem I've worked on, and the least resolved.",
  },
  {
    label: "The silent guardian as product philosophy",
    body: "Pushing back on Brand was a product argument. Everywhere in the flow, Mastercard is noise; at the moments someone is anxious about safety, it's a signal. That decision is where the project stopped being about how things looked and started defining Mastercard's role in a new kind of commerce.",
  },
  {
    label: "Why the React demo mattered more than the Figma flows",
    body: "The Figma toolkit was for research. The React demo was for selling. Both mattered, but the CPO using the demo live with Google is what moved this from internal strategy to external positioning. Sometimes the best thing you can build is something that lets people do the work without you in the room.",
  },
  {
    label: "What I'd do differently",
    body: "Measure the toolkit from day one. Which flows get used most? Which scenarios come up in every pitch? Which regional variations get adapted? It's used across four teams and three regions, but I can't see exactly how, and what you can't see is hard to improve.",
  },
]

// ─── HERO ─────────────────────────────────────────────────────────────────────

/** The real thing: the demo's two steps on a foldable, the agent's pick beside
 *  the payment it asks the user to approve. */
function HeroScreens() {
  return (
    <figure className="m-0">
      <div className="overflow-hidden rounded-[4px] border border-border bg-surface-1">
        <Image
          src="/assets/images/agent-pay/fold-screens.jpg"
          alt="Agent Pay, white-labelled: the agent's bike picks beside the payment sheet, with Personal Card selected and Confirm and pay, $193.00."
          width={1600}
          height={1125}
          priority
          sizes="(max-width: 1023px) 92vw, 40vw"
          className="h-auto w-full"
        />
      </div>
      <figcaption className="ledger-label mt-3">The agent&apos;s pick, then the one moment it asks you to approve.</figcaption>
    </figure>
  )
}

function Hero() {
  return (
    <CsHeroShell
      breadcrumb={{ kind: "Case Study", category: "Agentic Commerce", client: "Mastercard · Creative Studio" }}
      keywords={["Agentic Commerce", "Trust UX"]}
      badge="Flagship · Ongoing"
      title={
        <>
          The{" "}
          <em className="not-italic text-accent">silent guardian</em>
          {/* U+2011, a non-breaking hyphen: "AI-led" never splits on a phone. */}
          : Mastercard&apos;s role in AI‑led payments.
        </>
      }
      lede={
        <>
          Agentic commerce is payment without a payment screen. I built the research toolkit,
          the multi-sensory trust framework, and the React demo the CPO used at Money20/20 to
          show Google and ChatGPT where Mastercard fits.
        </>
      }
      meta={{
        role:         "Lead · Creative Studio",
        platform:     "React · Figma · Claude AI",
        scope:        "Agentic Commerce · Trust UX",
        organisation: "Mastercard",
      }}
      readTime="15 min read"
      publishedDate="2024"
      topics={["Trust", "AI Payments", "Prototype", "Money20/20"]}
      aside={<HeroScreens />}
      transitionName="case-agent-commerce"
    />
  )
}

// ─── VISUALS ──────────────────────────────────────────────────────────────────

/**
 * Anxiety across the 7-stage journey, peaking exactly where the guardian
 * appears. Colours come from tokens, so it reads on paper, on night and in
 * the ink band. It never draws narrower than 560px (the wrapper scrolls), so
 * 14-unit labels never render under 11px.
 */
function AnxietyCurve() {
  const stages = ["Intent", "Browse", "Select", "Confirm", "Verify", "Complete", "Done"]
  const xs = [40, 140, 240, 340, 440, 540, 640]
  const guardian: [number, number][] = [[340, 62], [440, 51], [540, 79]]
  return (
    <svg
      viewBox="0 0 700 200"
      className="h-auto w-full min-w-[560px]"
      role="img"
      aria-label="User anxiety across the payment journey, peaking at the three guardian moments: confirm, verify, complete."
    >
      {/* Where Mastercard shows up */}
      <rect x="300" y="30" width="280" height="126" fill="none" stroke="var(--border)" strokeDasharray="3 5" />
      <text x="440" y="20" textAnchor="middle" fontFamily="var(--font-mono)" fontSize="14" fill="var(--accent)">Mastercard shows up</text>

      <line x1="20" y1="156" x2="680" y2="156" stroke="var(--border)" />
      <text x="20" y="48" fontFamily="var(--font-mono)" fontSize="14" fill="var(--text-muted)">Anxiety</text>

      <path
        d="M40 139 C 120 146 180 148 240 134 C 290 118 320 76 340 62 C 380 52 420 48 440 51 C 480 56 510 72 540 79 C 590 106 600 138 660 139"
        fill="none"
        stroke="var(--accent)"
        strokeWidth="2.5"
        strokeLinecap="round"
      />

      {/* The three guardian moments, as the site's square marks */}
      {guardian.map(([x, y]) => (
        <g key={x}>
          <rect x={x - 9} y={y - 9} width="18" height="18" fill="var(--background)" stroke="var(--accent)" strokeWidth="1.5" />
          <rect x={x - 4} y={y - 4} width="8" height="8" fill="var(--accent)" />
        </g>
      ))}

      {stages.map((s, i) => {
        const active = i >= 3 && i <= 5
        return (
          <text
            key={s}
            x={xs[i]}
            y="184"
            textAnchor="middle"
            fontSize="14"
            fontWeight={active ? 600 : 400}
            fill={active ? "var(--accent)" : "var(--text-muted)"}
          >
            {s}
          </text>
        )
      })}
    </svg>
  )
}

/** Glyphs for the three sensory channels: visual mark, audio cue, haptic pulse. */
function SensoryGlyph({ kind }: { kind: "visual" | "sound" | "haptic" }) {
  if (kind === "sound") {
    const bars = [3, 6, 10, 7, 4, 14, 22, 16, 5, 8, 6, 4, 18, 24, 17, 6, 9, 5, 3, 16, 21, 15, 7, 4, 8, 5]
    const hot = new Set([5, 6, 7, 12, 13, 14, 19, 20, 21])
    return (
      <svg viewBox="0 0 240 48" className="h-10 w-full" aria-hidden>
        {bars.map((h, i) => (
          <rect key={i} x={6 + i * 9} y={24 - h / 2} width="3.5" height={h}
            fill={hot.has(i) ? "var(--accent)" : "var(--text-muted)"} opacity={hot.has(i) ? 1 : 0.5} />
        ))}
      </svg>
    )
  }
  if (kind === "haptic") {
    return (
      <svg viewBox="0 0 240 48" className="h-10 w-full" aria-hidden>
        <line x1="6" y1="24" x2="234" y2="24" stroke="var(--border)" />
        {[44, 120, 196].map((cx, bi) => {
          const amp = [7, 15, 10][bi]
          let d = `M ${cx - 21} 24`
          for (let k = 0; k < 6; k++) d += ` L ${cx - 21 + (k + 1) * 6} ${24 + (k % 2 ? amp : -amp)}`
          d += ` L ${cx + 21} 24`
          return <path key={bi} d={d} fill="none" stroke="var(--accent)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
        })}
      </svg>
    )
  }
  // Visual: a quiet mark at the three moments, the middle one strongest.
  return (
    <svg viewBox="0 0 240 48" className="h-10 w-full" aria-hidden>
      <line x1="6" y1="24" x2="234" y2="24" stroke="var(--border)" />
      {[60, 120, 180].map((x, i) => {
        const s = i === 1 ? 14 : 9
        return <rect key={x} x={x - s / 2} y={24 - s / 2} width={s} height={s} fill="var(--accent)" opacity={i === 1 ? 1 : 0.5} />
      })}
    </svg>
  )
}

/** A status as a mono label with the provenance square: filled when done. */
function StatusMark({ status, done }: { status: string; done: boolean }) {
  return (
    <span className="ledger-label inline-flex items-center gap-2 text-foreground">
      <span aria-hidden className={done ? "size-[7px] bg-accent" : "size-[7px] border border-current"} />
      {status}
    </span>
  )
}

// ─── PAGE ─────────────────────────────────────────────────────────────────────

export default function Page() {
  return (
    <div className="min-h-screen">

      <Hero />

      <CsInfoBar cells={[
        { label: "My Role",    value: "Lead · Creative Studio", sub: "toolkit + flows + React demo" },
        { label: "Partners",   value: "Haptic Labs · ElevenLabs", sub: "+ video team · UX research" },
        { label: "Timeline",   value: "8+ months", sub: "ongoing · V2 in progress" },
        { label: "Research",   value: "6 flows", sub: "NAM · EU · South America" },
        { label: "React Demo", value: "2 weeks", sub: "React.js + Claude AI + ElevenLabs" },
        { label: "Platforms",  value: "ChatGPT · Claude", sub: "Gemini · merchant surfaces" },
      ]} />

      {/* 30-second read */}
      <div className="ledger ledger-offset pt-14">
        <div className="mb-6 flex flex-wrap gap-x-6 gap-y-2">
          <CsProvenance kind="internal" label="Used inside Mastercard · demo white-labelled" />
        </div>
        <CsSummary
          problem="Agentic commerce is payment without a payment screen. With no checkout screen, how does Mastercard stay trusted and relevant?"
          role="I built the research toolkit, the multi-sensory trust framework, and a working React app with a Claude backend in two weeks."
          outcome="The silent guardian became the company-wide direction for Mastercard in agentic commerce, and the CPO demos it live from a phone at Money20/20."
        />
      </div>

      {/* ── PROBLEM ── */}
      <CsSection id="problem" label="Problem" withDivider={false}>
        <div className="space-y-10">
          <div className="max-w-2xl space-y-3">
            <h2 className="type-case-title text-foreground">
              When AI pays for you, where does trust come from?
            </h2>
            <p className="text-[15px] leading-relaxed text-muted-foreground">
              In normal payments, trust lives in the interface. You see the checkout, you tap, you
              see the Mastercard logo, you feel safe. Agentic commerce removes all of that. Three
              problems landed at once.
            </p>
          </div>

          {/* Ruled line items; Layer 03 is the one the work turned on, so it
              gets the ink rule and the accent on its reference. */}
          <ol className="border-b border-border">
            {LAYERS.map((layer) => (
              <li key={layer.ref} className={`grid gap-x-[var(--col-gap)] gap-y-2 border-t py-6 md:grid-cols-[minmax(0,1fr)_minmax(0,2fr)] ${layer.key ? "border-foreground" : "border-border"}`}>
                  <p className="ledger-label">{layer.key ? <span className="text-accent">{layer.ref}</span> : layer.ref}</p>
                  <div className="max-w-[62ch]">
                    <p className="mb-2 text-[17px] font-medium leading-snug text-foreground">{layer.title}</p>
                    <p className="text-[15px] leading-relaxed text-muted-foreground">{layer.body}</p>
                  </div>
                </li>
            ))}
          </ol>
        </div>
      </CsSection>

      {/* ── RESEARCH ── */}
      <CsSection id="research" label="Research">
        <div className="space-y-10">
          <div className="max-w-2xl space-y-3">
            <h2 className="type-case-title text-foreground">
              What the multilingual study surfaced
            </h2>
            <p className="text-[15px] leading-relaxed text-muted-foreground">
              Six flows, three regions (NAM, EU, South America), tested in several languages. We ran
              Assisted and Autonomous Agent Pay separately. Here are the structural insights I can
              share.
            </p>
          </div>

          <ol className="border-b border-border">
            {INSIGHTS.map((insight) => (
              <li key={insight.ref} className="grid gap-x-[var(--col-gap)] gap-y-3 border-t border-border py-6 md:grid-cols-[minmax(0,1fr)_minmax(0,2fr)]">
                  <div>
                    <p className="ledger-label mb-2">{insight.ref}</p>
                    <p className="text-[17px] font-medium leading-snug text-foreground">{insight.finding}</p>
                  </div>
                  <div className="max-w-[62ch] space-y-3">
                    <p className="border-l border-border pl-4 text-[15px] italic leading-relaxed text-muted-foreground">
                      &ldquo;{insight.quote}&rdquo;
                    </p>
                    <p className="flex gap-2 text-[15px] leading-relaxed text-foreground/80">
                      <span aria-hidden className="shrink-0">→</span>
                      {insight.change}
                    </p>
                  </div>
                </li>
            ))}
          </ol>

          <p className="max-w-2xl text-[15px] leading-relaxed text-muted-foreground">
            <strong className="font-medium text-foreground">The findings are confidential.</strong>{" "}
            The study showed clear regional differences in how people respond to trust signals in
            autonomous payments, and those differences shaped the V2 demos and the multi-sensory
            work. Happy to talk through specifics in person.
          </p>
        </div>
      </CsSection>

      {/* ── SILENT GUARDIAN ── the idea every decision refers to */}
      <CsSection id="silent-guardian" label="The silent guardian">
        <div className="space-y-10">
          <div className="max-w-2xl space-y-3">
            <h2 className="type-case-title text-foreground">
              Invisible until the moment it matters. Then unmistakable.
            </h2>
            <p className="text-[15px] leading-relaxed text-muted-foreground">
              The payment journey runs seven stages. Mastercard is present the whole way,
              processing and protecting, but visible at only three: the moments where someone
              needs to know they are safe.
            </p>
          </div>

          <FadeIn>
            <div>
              <p className="ledger-label mb-4">Where anxiety peaks across the journey</p>
              <div className="overflow-x-auto">
                <AnxietyCurve />
              </div>
            </div>
          </FadeIn>

          {/* The seven stages; the three where Mastercard shows up are filled. */}
          <FadeIn>
            <div className="relative overflow-x-auto">
              <div className="pointer-events-none absolute left-0 right-0 top-[13px] h-px bg-border" />
              <ol className="relative flex min-w-[560px]">
                {[
                  { label: ["User", "intent"],         active: false, role: []                     },
                  { label: ["AI", "browses"],           active: false, role: []                     },
                  { label: ["AI", "selects"],           active: false, role: []                     },
                  { label: ["Payment", "confirm"],      active: true,  role: ["Mastercard", "appears"] },
                  { label: ["Identity", "verify"],      active: true,  role: ["Trust", "signal"]    },
                  { label: ["Transaction", "complete"], active: true,  role: ["Protected", "by MC"] },
                  { label: ["Receipt", "/ done"],       active: false, role: []                     },
                ].map((node, i) => (
                  <li key={i} className="relative z-10 flex flex-1 flex-col items-center">
                    <span
                      aria-hidden
                      className={`mb-3 size-[26px] border ${node.active ? "border-accent bg-accent" : "border-border bg-background"}`}
                    />
                    <p className={`mb-1.5 text-center text-[12px] leading-[1.35] ${node.active ? "font-medium text-foreground" : "text-muted-foreground"}`}>
                      {node.label.map((line, j) => <span key={j} className="block">{line}</span>)}
                    </p>
                    <p className="min-h-[32px] text-center text-[12px] leading-[1.35] text-accent">
                      {node.role.map((line, j) => <span key={j} className="block">{line}</span>)}
                    </p>
                  </li>
                ))}
              </ol>
            </div>
          </FadeIn>

          <div className="flex flex-wrap gap-6">
            {[
              { mark: "border border-border bg-background", label: "Mastercard silent, processing in the background" },
              { mark: "bg-accent", label: "Mastercard present, trust signal active" },
            ].map((l) => (
              <div key={l.label} className="flex items-center gap-2 text-[13px] text-muted-foreground">
                <span aria-hidden className={`size-2.5 shrink-0 ${l.mark}`} />
                {l.label}
              </div>
            ))}
          </div>

          <FadeIn>
            <div className="max-w-2xl border-t border-foreground pt-5">
              <p className="mb-3 text-[17px] font-medium leading-snug text-foreground">
                Why this is a product call, not a style choice
              </p>
              <p className="text-[15px] leading-relaxed text-muted-foreground">
                The useful question was never how prominent the brand should be. It was which
                moments brand presence actually lowers someone&apos;s anxiety. Answering that is what
                the silent guardian does, and it ends up defining Mastercard&apos;s whole role in
                agentic commerce.
              </p>
            </div>
          </FadeIn>
        </div>
      </CsSection>

      {/* ── DECISIONS ── the ink band */}
      <CsSection id="key-decisions" label="Key Decisions" variant="ink">
        <div className="space-y-6">
          <h2 className="type-case-title mb-2 text-foreground">
            Four calls that shaped the work
          </h2>
          <CsDecision
            index={0}
            title="Four teams building the same flows"
            problem="Product, Tech, Research, and Brand were each building their own agentic flows. Inconsistent outputs, duplicated effort, no shared language. No one had asked me to fix it."
            decision="I offered to own the flows for everyone, so there was one source of truth used by all four teams. I saw the gap and moved on it."
            tradeoff="It stretched my brief on purpose. If the toolkit wasn't good enough, the teams would ignore it and go back to working alone."
            impact="All four teams adopted it. The duplication stopped, and everyone now builds from the same base."
          />
          <CsDecision
            index={1}
            title="The silent guardian, the decision the whole project turned on"
            problem="Brand wanted the logo present at every stage. My view was that constant branding interrupts a flow that only works when it feels fluid."
            decision="Mastercard stays hidden by default and shows up at three moments: payment confirmation, identity verification, and completion. Not a logo, a trust signal. Quiet, but clear when it appears."
            tradeoff="Pushing back on the team that owns the brand meant arguing it as product strategy, not taste. Trust here is earned by showing up at the right moment, not by being everywhere."
            impact="Silent guardian became the company-wide direction for Mastercard in agentic commerce. The SVP of Multi-Sensory, Brand, and the other stakeholders all signed on."
          />
          <CsDecision
            index={2}
            title="React over Figma, a demo that survives a live meeting"
            problem="The CPO needed to demo live from a phone with Google, ChatGPT, and merchant partners. Figma breaks mid-meeting: you can't tailor it per client or handle interruptions."
            decision="I built a working React app with a Claude backend in two weeks. It can be set per pitch (name, region, currency, flight details), has ElevenLabs voice, and runs on a phone."
            tradeoff="This was engineering, outside my role. I took it on because the problem needed it and I could do it."
            impact="The CPO and several SVPs now demo Agent Pay from their phones at Money20/20, Mastercard Connections, and Innovate at McLaren HQ, with no designer in the room."
          />
          <CsDecision
            index={3}
            title="Real haptics for real research"
            problem="The research needed real haptic feedback at the guardian moments. Figma doesn't do haptics. Drop it from scope, or find another way?"
            decision="I brought in Haptic Labs to build real haptics for the research. If touch is a trust signal, you have to test touch, not fake it."
            tradeoff="Working with an outside partner added coordination and setup time. Worth it, since the alternative was missing data on a key trust channel."
            impact="The research found that haptic signals land differently by region. That only surfaced because we tested the real thing, and it now feeds the V2 multi-sensory work."
          />
        </div>
      </CsSection>

      {/* ── SOLUTION ── */}
      <CsSection id="solution" label="Solution">
        <div className="space-y-14">
          <h2 className="type-case-title text-foreground">
            What I built, and why each piece existed
          </h2>

          <FadeIn>
            <div>
              <p className="ledger-label mb-5">The Agent Pay toolkit (Figma)</p>
              <div className="grid gap-x-[var(--col-gap)] gap-y-10 md:grid-cols-2">
                {TOOLKIT.map((col) => (
                  <div key={col.label}>
                    <p className="ledger-label mb-3 text-foreground">{col.label}</p>
                    <ol className="border-b border-border">
                      {col.flows.map((f) => (
                        <li key={f.num} className="grid grid-cols-[2.5rem_minmax(0,1fr)] gap-x-3 border-t border-border py-4">
                          <span className="ledger-label pt-[0.2em]">{f.num}</span>
                          <div>
                            <p className="mb-1 text-[15px] font-medium text-foreground">{f.title}</p>
                            <p className="text-[14px] leading-snug text-muted-foreground">{f.desc}</p>
                          </div>
                        </li>
                      ))}
                    </ol>
                  </div>
                ))}
              </div>
              <p className="ledger-label mt-5">
                Used by Product, Tech, Research, and Brand teams · Multilingual research across NAM, EU, South America · Fed directly into V2 direction
              </p>
            </div>
          </FadeIn>

          <div>
            <p className="ledger-label mb-3">Multi-sensory trust framework</p>
            <p className="mb-8 max-w-xl text-[15px] leading-relaxed text-muted-foreground">
              When the screen belongs to ChatGPT or Claude, visual branding has no persistent home.
              Sound and haptics become the primary Mastercard brand channel in agentic environments.
            </p>
            <div className="grid gap-x-[var(--col-gap)] gap-y-10 md:grid-cols-3">
              {SENSES.map((s, i) => (
                <FadeIn key={s.name} delay={i * 0.07}>
                  <div className="flex h-full flex-col border-t border-border pt-5">
                    <div className="mb-5">
                      <SensoryGlyph kind={s.kind} />
                    </div>
                    <p className="mb-2 text-[17px] font-medium text-foreground">{s.name}</p>
                    <p className="mb-4 flex-1 text-[15px] leading-relaxed text-muted-foreground">{s.desc}</p>
                    <p className="ledger-label">{s.collab}</p>
                  </div>
                </FadeIn>
              ))}
            </div>
          </div>
        </div>
      </CsSection>

      {/* ── LIVE DEMO ── */}
      <CsSection id="live-demo" label="Live Demo">
        <div className="grid items-center gap-12 md:grid-cols-2">
          <div className="space-y-6">
            <h2 className="type-case-title text-balance text-foreground">
              Built in two weeks. Used by the&nbsp;CPO at Money20/20.
            </h2>
            <p className="text-[15px] leading-relaxed text-muted-foreground">
              Figma prototypes fall apart the moment a meeting goes off-script. The CPO needed
              something he could hold, hand over, and run mid-conversation. So I built a working
              React version of Agent Pay, powered by Claude, in two weeks.
            </p>
            <ul className="border-b border-border">
              {DEMO_FEATURES.map((f) => (
                <li key={f.title} className="grid gap-x-4 gap-y-1 border-t border-border py-3 sm:grid-cols-[10rem_minmax(0,1fr)]">
                  <p className="text-[15px] font-medium text-foreground">{f.title}</p>
                  <p className="text-[14px] leading-snug text-muted-foreground">{f.desc}</p>
                </li>
              ))}
            </ul>
          </div>

          <div className="flex flex-col items-center">
            <div className="w-[320px] max-w-full">
              {/* iPhone 16 device frame (a mockup keeps its own palette and radii) */}
              <div data-keep-radius className="relative rounded-[3rem] border border-white/[0.12] bg-[#1b1b1d] p-[11px] shadow-[0_40px_100px_rgba(0,0,0,0.35)]">
                <span className="absolute -left-[3px] top-[96px] h-[26px] w-[3px] rounded-r bg-[#0e0e10]" />
                <span className="absolute -left-[3px] top-[140px] h-[52px] w-[3px] rounded-r bg-[#0e0e10]" />
                <span className="absolute -left-[3px] top-[204px] h-[52px] w-[3px] rounded-r bg-[#0e0e10]" />
                <span className="absolute -right-[3px] top-[160px] h-[80px] w-[3px] rounded-l bg-[#0e0e10]" />
                {/* Screen, iPhone 16 logical ratio 393 × 852 */}
                <div className="relative aspect-[393/852] overflow-hidden rounded-[2.3rem] bg-[#F8F6F3]">
                  <DemoPoster
                    src="https://agent-pay-demo.vercel.app/"
                    poster="/assets/images/agent-pay/demo-poster.png"
                    title="Agent Pay live interactive demo (white-labelled)"
                  />
                </div>
              </div>
            </div>
            <p className="ledger-label mt-4 max-w-[320px] text-center">
              This is the white-labelled version. The Mastercard-branded build is the one the CPO uses with Google, ChatGPT, and merchant partners.
            </p>
          </div>
        </div>
      </CsSection>

      {/* ── THE FLOW, UNFOLDED ── the agent's pick and the payment it asks the
          user to approve, side by side; folded, only the confirmation shows. */}
      <CsSection id="unfolded" label="The flow, unfolded">
        <div className="space-y-8">
          <div className="grid items-start gap-10 md:grid-cols-[3fr_2fr]">
            <h2 className="type-case-title text-foreground">Two steps, one fold.</h2>
            <p className="text-[15px] leading-relaxed text-muted-foreground">
              The agent&apos;s pick and the payment it asks you to approve, side by side. Fold it and the
              cover shows only the confirmation: the moment the trust signal has to carry on its own.
            </p>
          </div>
          <FoldPhone
            screens="/assets/images/agent-pay/fold-screens.jpg"
            alt="Agent Pay on a foldable: the agent's bike picks beside the payment sheet with Confirm and pay, $193.00."
          />
          <p className="ledger-label max-w-2xl">
            Screens from the white-labelled demo above, set on Apple&apos;s iPhone Duo reference model as a
            presentation study. Drag to turn it; play or scrub to fold.
          </p>
        </div>
      </CsSection>

      {/* ── IMPACT ── */}
      <CsSection id="impact" label="Impact">
        <div className="space-y-14">
          <h2 className="type-case-title text-foreground">
            What this work actually changed
          </h2>

          {/* The statement: four lines, each a label, a figure and a note. */}
          <FadeIn>
            <dl className="border-b border-border">
              {STATEMENT.map((m) => (
                <div key={m.label} className="grid grid-cols-[minmax(0,1fr)_auto] items-baseline gap-x-4 gap-y-1 border-t border-border py-4 sm:grid-cols-[12rem_8rem_minmax(0,1fr)]">
                  <dt className="ledger-label">{m.label}</dt>
                  <dd className="text-right text-[22px] font-semibold leading-none tracking-tight text-foreground tabular-nums sm:text-left">{m.value}</dd>
                  <dd className="col-span-2 text-[14px] text-muted-foreground sm:col-span-1">{m.note}</dd>
                </div>
              ))}
            </dl>
          </FadeIn>

          <FadeIn>
            <div>
              <p className="ledger-label mb-4">Impact by type</p>
              <dl className="border-b border-border">
                {IMPACT_ROWS.map((row) => (
                  <div key={row.what} className="grid gap-x-[var(--col-gap)] gap-y-1 border-t border-border py-4 md:grid-cols-[minmax(0,1fr)_minmax(0,2fr)]">
                    <dt className="text-[15px] font-medium text-foreground">{row.what}</dt>
                    <dd className="max-w-[62ch] text-[15px] leading-relaxed text-muted-foreground">{row.how}</dd>
                  </div>
                ))}
                <div className="grid gap-x-[var(--col-gap)] gap-y-1 border-t border-border py-4 md:grid-cols-[minmax(0,1fr)_minmax(0,2fr)]">
                  <dt className="text-[15px] font-medium text-foreground">Adjacent work</dt>
                  <dd className="max-w-[62ch] text-[15px] leading-relaxed text-muted-foreground">
                    I worked on the early product concept for Mastercard One Credential, now live at
                    mastercard.com, before it moved to its own product team. It shaped how I think about
                    how agentic commerce needs to handle credentials at scale.
                  </dd>
                </div>
              </dl>
            </div>
          </FadeIn>

          <div>
            <p className="ledger-label mb-4">Where this is heading</p>
            <FadeIn>
              <div className="grid gap-x-[var(--col-gap)] gap-y-10 md:grid-cols-3">
                {ROADMAP.map((col) => (
                  <div key={col.version} className="border-t border-border pt-4">
                    <div className="mb-4 flex items-baseline justify-between gap-3">
                      <p className="text-[17px] font-semibold text-foreground">{col.version}</p>
                      <StatusMark status={col.status} done={col.done} />
                    </div>
                    <p className="ledger-label mb-4">{col.date}</p>
                    <ul className="flex flex-col gap-2">
                      {col.items.map((item) => (
                        <li key={item} className="flex gap-2 text-[14px] leading-snug text-muted-foreground">
                          <span aria-hidden className="shrink-0">·</span>
                          {item}
                        </li>
                      ))}
                    </ul>
                  </div>
                ))}
              </div>
            </FadeIn>
          </div>
        </div>
      </CsSection>

      {/* ── REFLECTION ── */}
      <CsSection id="reflection" label="Reflection">
        <div className="space-y-10">
          <blockquote className="max-w-2xl border-l-[3px] border-accent pl-6 text-xl font-light italic leading-relaxed text-foreground/85 md:text-2xl">
            &ldquo;Agentic commerce taught me that trust is less about where you put the logo
            and more about what happens, and what someone feels, at the moment they need to
            know they are safe.&rdquo;
          </blockquote>

          <dl className="border-b border-border">
            {REFLECTIONS.map((r) => (
              <div key={r.label} className="grid gap-x-[var(--col-gap)] gap-y-2 border-t border-border py-6 md:grid-cols-[minmax(0,1fr)_minmax(0,2fr)]">
                  <dt className="text-[17px] font-medium leading-snug text-foreground">{r.label}</dt>
                  <dd className="max-w-[62ch] text-[15px] leading-relaxed text-muted-foreground">{r.body}</dd>
                </div>
            ))}
          </dl>
        </div>
      </CsSection>

      <CsNextStudies currentHref="/work/agent-commerce" />

    </div>
  )
}
