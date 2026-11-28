import { CsHeroShell } from "@/components/case-study/cs-hero-shell"
import { CsProvenance } from "@/components/case-study/cs-provenance"
import { CsSummary } from "@/components/case-study/cs-summary"
import { DemoPoster } from "@/components/case-study/demo-poster"
import { DeviceScene } from "@/components/case-study/device-scene"
import { WorkSpecimen } from "@/components/sections/work/work-specimens"
import { StudyChapter, StudyFigure, StudyScreen } from "@/components/study/study-chapter"
import { StudyCalls, StudyFigures, StudyOptions, StudyReflection } from "@/components/study/study-blocks"

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

// ─── PAGE ─────────────────────────────────────────────────────────────────────

/** The seven payment stages; the three where Mastercard shows up are filled. */
function StageStrip() {
  const stages = [
    { label: ["User", "intent"], active: false, role: [] as string[] },
    { label: ["AI", "browses"], active: false, role: [] },
    { label: ["AI", "selects"], active: false, role: [] },
    { label: ["Payment", "confirm"], active: true, role: ["Mastercard", "appears"] },
    { label: ["Identity", "verify"], active: true, role: ["Trust", "signal"] },
    { label: ["Transaction", "complete"], active: true, role: ["Protected", "by MC"] },
    { label: ["Receipt", "/ done"], active: false, role: [] },
  ]
  return (
    <div className="relative overflow-x-auto">
      <div className="pointer-events-none absolute left-0 right-0 top-[13px] h-px bg-border" />
      <ol className="relative flex min-w-[560px]">
        {stages.map((node, i) => (
          <li key={i} className="relative z-10 flex flex-1 flex-col items-center">
            <span aria-hidden className={`mb-3 size-[26px] border ${node.active ? "border-accent bg-accent" : "border-border bg-background"}`} />
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
  )
}

/** A ruled list: a label or reference on the left, the line item on the right. */
function Rows({ rows }: { rows: { ref: string; title: string; body: string; key?: boolean }[] }) {
  return (
    <ol className="border-b border-border">
      {rows.map((r, i) => (
        <li
          key={r.ref}
          data-settle
          style={{ ["--i" as string]: i }}
          className={`grid gap-x-[var(--col-gap)] gap-y-1 border-t py-4 md:grid-cols-[minmax(0,1fr)_minmax(0,2fr)] ${r.key ? "border-foreground" : "border-border"}`}
        >
          <p className="ledger-label">{r.key ? <span className="text-accent">{r.ref}</span> : r.ref}</p>
          <div className="max-w-[62ch]">
            <p className="text-[16px] font-semibold leading-snug text-foreground">{r.title}</p>
            <p className="mt-1 text-[15px] leading-relaxed text-muted-foreground">{r.body}</p>
          </div>
        </li>
      ))}
    </ol>
  )
}

export default function Page() {
  return (
    <div className="min-h-screen">
      <CsHeroShell
        breadcrumb={{ kind: "Case Study", category: "Agentic Commerce", client: "Mastercard · Creative Studio" }}
        keywords={["Agentic Commerce", "Trust UX"]}
        badge="Flagship · Ongoing"
        title={
          <>
            The <em className="not-italic text-accent">silent guardian</em>
            {/* U+2011, a non-breaking hyphen: "AI-led" never splits on a phone. */}
            : Mastercard&apos;s role in AI‑led payments.
          </>
        }
        lede={
          <>
            Agentic commerce is payment without a payment screen. I built the research toolkit, the
            multi-sensory trust framework, and the React demo the CPO used at Money20/20 to show Google and
            ChatGPT where Mastercard fits.
          </>
        }
        meta={{
          role: "Lead · Creative Studio",
          organisation: "Mastercard",
          timeline: "8+ months · ongoing, V2 in progress",
          partners: "Haptic Labs · ElevenLabs",
          platform: "React · Figma · Claude AI",
        }}
        readTime="4 min read"
        aside={<WorkSpecimen slug="agent-commerce" />}
        transitionName="case-agent-commerce"
      >
        <CsProvenance kind="internal" label="Used inside Mastercard · demo white-labelled" />
      </CsHeroShell>

      <div className="ledger ledger-offset pb-8">
        <CsSummary
          problem="Agentic commerce is payment without a payment screen. With no checkout screen, how does Mastercard stay trusted and relevant?"
          role="I built the research toolkit, the multi-sensory trust framework, and a working React app with a Claude backend in two weeks."
          outcome="The silent guardian became the company-wide direction for Mastercard in agentic commerce, and the CPO demos it live from a phone at Money20/20."
        />
      </div>

      <StudyChapter
        id="problem"
        index={1}
        label="Problem"
        title="When AI pays for you, where does trust come from?"
        lede="In normal payments, trust lives in the interface: you see the checkout, you tap, you see the logo. Agentic commerce removes all of that. Three problems landed at once."
        aside={<Rows rows={LAYERS.map((l) => ({ ref: l.ref, title: l.title, body: l.body, key: l.key }))} />}
      >
        <StudyFigure
          width="column"
          caption="Six flows, three regions (NAM, EU, South America), tested in several languages. The findings are confidential; these are the structural insights I can share."
        >
          <Rows rows={INSIGHTS.map((n) => ({ ref: n.ref, title: n.finding, body: n.change }))} />
        </StudyFigure>
      </StudyChapter>

      <StudyChapter
        id="silent-guardian"
        index={2}
        label="The silent guardian"
        ink
        title="Invisible until the moment it matters. Then unmistakable."
        lede="Brand wanted the logo at every stage. My read was the opposite: these flows work because they feel fluid. Mastercard is present the whole way, processing and protecting, but visible at only three moments: where someone needs to know they are safe."
      >
        <StudyOptions
          question="How visible should Mastercard be?"
          options={[
            {
              title: "The logo across the whole flow",
              verdict: "Constant branding interrupts a flow that only works when it feels fluid. In agentic flows, seeing the brand becomes noise.",
            },
            {
              title: "The silent guardian",
              verdict: "Hidden by default, a trust signal at confirmation, verification and completion. Trust is earned by showing up at the right moment, not by being everywhere.",
              chosen: true,
            },
          ]}
        />
        <StudyFigure width="column" caption="Where anxiety peaks across the journey, and where Mastercard shows up.">
          <div className="space-y-10">
            <div className="overflow-x-auto">
              <AnxietyCurve />
            </div>
            <StageStrip />
          </div>
        </StudyFigure>
      </StudyChapter>

      <StudyChapter
        id="the-work"
        index={3}
        label="The work"
        title="A demo that survives a live meeting."
        lede="Figma prototypes fall apart the moment a meeting goes off-script. So I built a working React version of Agent Pay, powered by Claude, in two weeks, on top of a six-flow toolkit and a multi-sensory framework."
      >
        <section id="live-demo" aria-label="Live demo" className="scroll-mt-24">
          <StudyScreen
            refLabel="01 · Live demo"
            title="Built in two weeks. Used by the CPO at Money20/20."
            note="This is the white-labelled version. The Mastercard-branded build is the one the CPO uses with Google, ChatGPT, and merchant partners."
          >
            <div className="ledger-grid items-center gap-y-10">
              <div className="col-span-12 flex justify-center lg:col-span-5">
                <div className="w-[320px] max-w-full">
                  {/* iPhone device frame (a mockup keeps its own palette and radii) */}
                  <div data-keep-radius className="relative rounded-[3rem] border border-[#2a2a2c] bg-[#1b1b1d] p-[11px]">
                    <div className="relative aspect-[393/852] overflow-hidden rounded-[2.3rem] bg-[#F8F6F3]">
                      <DemoPoster
                        src="https://agent-pay-demo.vercel.app/"
                        poster="/assets/images/agent-pay/demo-poster.png"
                        title="Agent Pay live interactive demo (white-labelled)"
                      />
                    </div>
                  </div>
                </div>
              </div>
              <ul className="col-span-12 border-b border-border lg:col-span-6 lg:col-start-7">
                {DEMO_FEATURES.map((f) => (
                  <li key={f.title} className="grid gap-x-4 gap-y-1 border-t border-border py-4 sm:grid-cols-[10rem_minmax(0,1fr)]">
                    <p className="text-[16px] font-semibold text-foreground">{f.title}</p>
                    <p className="text-[15px] leading-snug text-muted-foreground">{f.desc}</p>
                  </li>
                ))}
              </ul>
            </div>
          </StudyScreen>
        </section>

        <section id="unfolded" aria-label="The flow, unfolded" className="scroll-mt-24">
          <StudyScreen
            refLabel="02 · The flow, unfolded"
            title="Two steps, one fold."
            note="The agent's pick and the payment it asks you to approve, side by side. Folded, the cover shows only the confirmation: the moment the trust signal has to carry on its own."
          >
            <DeviceScene
              kind="duo"
              screen="/assets/images/agent-pay/fold-screens.jpg"
              alt="Agent Pay on a foldable: the agent's bike picks beside the payment sheet with Confirm and pay, $193.00."
            />
            <p className="ledger-label mt-4 max-w-2xl">
              Screens from the white-labelled demo, set on Apple&apos;s iPhone Duo reference model as a presentation study.
            </p>
          </StudyScreen>
        </section>

        <StudyScreen
          refLabel="03 · The toolkit"
          title="Six flows every team builds from."
          note="Assisted and Autonomous are two products, not two settings, so each got its own flows and its own trust model. Used by Product, Tech, Research, and Brand."
        >
          <div className="grid gap-x-[var(--col-gap)] gap-y-10 md:grid-cols-2">
            {TOOLKIT.map((col) => (
              <div key={col.label}>
                <p className="ledger-label mb-3 text-foreground">{col.label}</p>
                <ol className="border-b border-border">
                  {col.flows.map((f) => (
                    <li key={f.num} className="grid grid-cols-[2.5rem_minmax(0,1fr)] gap-x-3 border-t border-border py-4">
                      <span className="ledger-label pt-[0.2em]">{f.num}</span>
                      <div>
                        <p className="mb-1 text-[16px] font-semibold text-foreground">{f.title}</p>
                        <p className="text-[15px] leading-snug text-muted-foreground">{f.desc}</p>
                      </div>
                    </li>
                  ))}
                </ol>
              </div>
            ))}
          </div>
        </StudyScreen>

        <StudyScreen
          refLabel="04 · Multi-sensory framework"
          title="When the screen belongs to ChatGPT, sound and touch carry the brand."
          note="Visual branding has no persistent home on someone else's surface, so the three guardian moments each get a mark, a sound and a haptic pattern."
        >
          <div className="grid gap-x-[var(--col-gap)] gap-y-10 md:grid-cols-3">
            {SENSES.map((s, i) => (
              <div key={s.name} data-settle style={{ ["--i" as string]: i }} className="flex h-full flex-col border-t border-border pt-5">
                <div className="mb-5">
                  <SensoryGlyph kind={s.kind} />
                </div>
                <p className="mb-2 text-[17px] font-semibold text-foreground">{s.name}</p>
                <p className="mb-4 flex-1 text-[15px] leading-relaxed text-muted-foreground">{s.desc}</p>
                <p className="ledger-label">{s.collab}</p>
              </div>
            ))}
          </div>
        </StudyScreen>
      </StudyChapter>

      <StudyChapter id="decisions" index={4} label="Decisions" title="Three calls outside the brief.">
        <StudyCalls
          calls={[
            {
              title: "One toolkit for four teams",
              call: "Product, Tech, Research, and Brand were each building their own agentic flows. No one had asked me to fix it; I offered to own the flows for everyone.",
              cost: "It stretched my brief on purpose. If the toolkit wasn't good enough, the teams would ignore it and go back to working alone.",
              changed: "All four teams adopted it. The duplication stopped, and everyone now builds from the same base.",
            },
            {
              title: "React over Figma",
              call: "The CPO needed to demo live from a phone with Google, ChatGPT, and merchant partners. I built a working React app with a Claude backend in two weeks, set per pitch, with ElevenLabs voice.",
              cost: "This was engineering, outside my role. I took it on because the problem needed it and I could do it.",
              changed: "The CPO and several SVPs now demo Agent Pay from their phones at Money20/20, Mastercard Connections, and Innovate at McLaren HQ, with no designer in the room.",
            },
            {
              title: "Real haptics for real research",
              call: "Figma doesn't do haptics. I brought in Haptic Labs to build real haptics for the research: if touch is a trust signal, you have to test touch, not fake it.",
              cost: "Working with an outside partner added coordination and setup time.",
              changed: "The research found that haptic signals land differently by region, and it now feeds the V2 multi-sensory work.",
            },
          ]}
        />
      </StudyChapter>

      <StudyChapter
        id="impact"
        index={5}
        label="Impact"
        title="What this work actually changed."
        lede="The silent guardian held up against Brand and became the agreed approach for Mastercard's role in agentic commerce."
      >
        <StudyFigures items={STATEMENT.map((m) => ({ figure: m.value, label: `${m.label}: ${m.note}.` }))} />
        <StudyFigure width="column">
          <Rows
            rows={[
              ...IMPACT_ROWS.map((r, i) => ({ ref: String(i + 1).padStart(2, "0"), title: r.what, body: r.how })),
              {
                ref: "Adjacent",
                title: "Mastercard One Credential",
                body: "I worked on the early product concept for Mastercard One Credential, now live at mastercard.com, before it moved to its own product team.",
              },
            ]}
          />
        </StudyFigure>
      </StudyChapter>

      <StudyChapter
        id="reflection"
        index={6}
        label="Reflection"
        title="Trust is less about where you put the logo than what happens at the moment someone needs to know they are safe."
        lede="Pushing back on Brand was a product argument. That decision is where the project stopped being about how things looked and started defining Mastercard's role in a new kind of commerce."
      >
        <StudyReflection
          learned="The Figma toolkit was for research. The React demo was for selling. Sometimes the best thing you can build is something that lets people do the work without you in the room."
          next="Measure the toolkit from day one. It's used across four teams and three regions, but I can't see exactly how, and what you can't see is hard to improve."
          open="There's no settled pattern for agentic payments yet. It's the most interesting problem I've worked on, and the least resolved."
        />
      </StudyChapter>
    </div>
  )
}
