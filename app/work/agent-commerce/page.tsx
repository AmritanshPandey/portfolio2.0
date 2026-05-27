"use client"

import { motion } from "framer-motion"
import {
  CsSection,
  CsDecision,
  CsInfoBar,
  CsNextStudies,
} from "@/components/case-study"

// ─── FADE-IN WRAPPER ─────────────────────────────────────────────────────────

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

// ─── DATA ─────────────────────────────────────────────────────────────────────

const IMPACT_ROWS = [
  { what: "Internal team alignment", how: "Four teams duplicating Figma work → one consolidated toolkit every team builds from. Inconsistency eliminated at source." },
  { what: "Strategic direction adopted", how: "Silent guardian framework pushed back on Brand and won. Now the agreed approach for Mastercard's role in agentic commerce globally." },
  { what: "Executive demo capability", how: "CPO and multiple SVPs can demo Agent Pay live from their phones. No designer in the room required. No Figma credentials needed." },
  { what: "Multi-sensory research", how: "6 research flows with real haptic and sound variations tested across 3 regions. Findings fed V2 direction. First Mastercard research of this type in agentic commerce." },
  { what: "External conversations", how: "Work used in live discussions with Google, ChatGPT, and merchant partners. Mastercard's position in agentic commerce demonstrated, not just described." },
  { what: "New brand dimension", how: "Multi-sensory design established as a Mastercard brand channel in agentic environments — an infrastructure decision, not a campaign." },
]

const ROADMAP = [
  {
    version: "V1", date: "8 months · shipped",
    badge: "Complete", badgeClass: "bg-emerald-500/15 text-emerald-400",
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
    version: "V2", date: "In progress",
    badge: "Active", badgeClass: "bg-teal-500/15 text-teal-400",
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
    version: "Future", date: "Vision",
    badge: "Roadmap", badgeClass: "bg-neutral-800 text-neutral-500",
    items: [
      "Real transaction integration",
      "Full platform standardisation",
      "Cross-ecosystem trust standards",
      "Production multi-sensory SDK",
      "Self-serve demo toolkit for sales",
    ],
  },
]

// ─── HERO ─────────────────────────────────────────────────────────────────────

function Hero() {
  return (
    <div className="relative overflow-hidden bg-neutral-950 min-h-[640px]">

      {/* Ambient glows */}
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute top-[-80px] left-[-160px] w-[700px] h-[600px]
          bg-[radial-gradient(closest-side,rgba(20,184,166,0.1),transparent_70%)]" />
        <div className="absolute top-[-200px] right-[-300px] w-[800px] h-[600px]
          bg-[radial-gradient(closest-side,rgba(249,115,22,0.07),transparent_70%)]" />
      </div>

      <div className="relative max-w-[1000px] mx-auto px-6 pt-32 pb-16 md:pt-40 md:pb-20">
        <div className="grid md:grid-cols-2 gap-12 items-center">

          {/* ── Left: copy ── */}
          <div>
            <motion.div
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4 }}
              className="flex items-center gap-3 mb-10 text-[11px] tracking-[0.22em] uppercase text-neutral-500"
            >
              <span>Case Study</span>
              <span className="w-1 h-1 rounded-full bg-neutral-700" />
              <span className="text-teal-400/80">Agentic Commerce</span>
              <span className="w-1 h-1 rounded-full bg-neutral-700" />
              <span>Mastercard · Creative Studio</span>
            </motion.div>

            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.4, delay: 0.04 }}
              className="inline-block text-[10px] uppercase tracking-[0.16em] text-neutral-600 border border-neutral-800 rounded px-2.5 py-1 mb-6"
            >
              Flagship · Ongoing
            </motion.p>

            <motion.h1
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.55, delay: 0.06, ease: [0.22, 1, 0.36, 1] }}
              className="text-4xl md:text-5xl font-semibold tracking-[-0.04em] leading-[1.05] text-white max-w-lg mb-6"
            >
              The{" "}
              <em className="not-italic text-teal-400">silent guardian</em>
              {" "}— Mastercard&apos;s role in AI-led payments.
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.12, ease: [0.22, 1, 0.36, 1] }}
              className="text-[15px] leading-relaxed text-neutral-400 mb-8"
            >
              Agentic commerce is payments without a payment screen. I built the UX research
              toolkit, multi-sensory trust framework, and the live React demo the CPO used
              at Money20/20 to show Google and ChatGPT what Mastercard&apos;s role looks like.
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.45, delay: 0.18 }}
              className="flex flex-wrap gap-2 mb-8"
            >
              {[
                { label: "Silent guardian — adopted direction", teal: true },
                { label: "Used by CPO + SVPs live" },
                { label: "6 research flows · 3 regions" },
                { label: "React + Claude AI · 2 weeks" },
                { label: "Haptic Labs · ElevenLabs" },
              ].map(p => (
                <span
                  key={p.label}
                  className={`text-[11px] font-medium px-3 py-1 rounded-full border ${
                    p.teal
                      ? "bg-teal-500/15 border-teal-500/40 text-teal-400"
                      : "border-white/10 text-neutral-500"
                  }`}
                >
                  {p.label}
                </span>
              ))}
            </motion.div>

            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.4, delay: 0.28 }}
              className="flex flex-wrap items-center gap-2 pt-6 border-t border-white/[0.06]"
            >
              <span className="text-[11px] text-neutral-600 mr-1">Presented at</span>
              {["Money20/20", "Mastercard Connections", "Innovate at McLaren HQ"].map(e => (
                <span key={e} className="text-[11px] font-medium px-3 py-1 rounded-full border border-teal-500/30 text-teal-500/80">
                  {e}
                </span>
              ))}
            </motion.div>
          </div>

          {/* ── Right: phone visual ── */}
          <motion.div
            initial={{ opacity: 0, scale: 0.96, y: 12 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.22, ease: [0.22, 1, 0.36, 1] }}
            className="relative flex justify-center"
          >
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(20,184,166,0.2)_0%,transparent_65%)]" />

            <div className="relative z-10 w-[220px] rounded-[28px] border border-white/[0.15] bg-[#111] overflow-hidden shadow-[0_32px_80px_rgba(0,0,0,0.6)]">
              {/* Notch */}
              <div className="h-5 bg-[#0a0a0a] flex items-center justify-center">
                <div className="w-12 h-[5px] rounded-full bg-[#333]" />
              </div>
              {/* Header */}
              <div className="bg-[#111] px-3.5 py-2.5 flex items-center gap-2 border-b border-white/[0.06]">
                <div className="w-6 h-6 rounded-full bg-teal-500 flex items-center justify-center text-[9px] font-bold text-black shrink-0">
                  AI
                </div>
                <div>
                  <p className="text-[11px] font-medium text-white leading-none mb-0.5">ChatAI Agent</p>
                  <p className="text-[10px] text-teal-400">● Active — booking your trip</p>
                </div>
              </div>
              {/* Chat body */}
              <div className="px-2.5 py-3 flex flex-col gap-2">
                <div className="self-end max-w-[85%] bg-[#222] rounded-[10px] rounded-br-[3px] px-2.5 py-2">
                  <p className="text-[10px] text-white/70 leading-[1.5]">Book me a flight to Tokyo, business class</p>
                </div>
                <div className="self-start max-w-[85%] bg-[#1a1a1a] rounded-[10px] rounded-bl-[3px] px-2.5 py-2">
                  <p className="text-[10px] text-white/80 leading-[1.5]">Found: ANA NH807, departs 22:15. Business, direct. ¥285,000. Booking now...</p>
                </div>
                {/* Trust moment */}
                <div className="bg-teal-500/[0.08] border border-teal-500/25 rounded-[10px] p-2.5 mt-0.5">
                  <p className="text-[9px] uppercase tracking-[0.05em] font-semibold text-teal-400 mb-1.5">⚡ Payment secured</p>
                  <p className="text-[10px] text-white/60 leading-[1.4] mb-2">ANA NH807 · Business · Tokyo<br />¥285,000 · Visa ···· 4821</p>
                  <div className="flex items-center gap-1.5">
                    <div className="w-1.5 h-1.5 rounded-full bg-teal-400 shrink-0" />
                    <p className="text-[9px] font-medium text-teal-400">Transaction verified and protected</p>
                  </div>
                  <p className="text-[8px] text-neutral-600 text-right mt-2 tracking-[0.04em]">Secured by trusted payment network ✦</p>
                </div>
              </div>
            </div>
          </motion.div>

        </div>
      </div>

      <div className="absolute bottom-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-white/10 to-transparent" />
    </div>
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

      {/* ── PROBLEM ── dark */}
      <CsSection label="Problem" variant="dark">
        <div className="space-y-8">
          <div className="max-w-2xl space-y-3">
            <h2 className="text-2xl md:text-3xl font-semibold text-white leading-snug tracking-tight">
              When AI pays for you, where does trust come from?
            </h2>
            <p className="text-[15px] text-neutral-400 leading-relaxed">
              Traditional payments have trust built into the UI — you see the checkout, you tap,
              you see the Mastercard logo, you feel safe. Agentic commerce removes all of that.
              Three problems had to be solved simultaneously.
            </p>
          </div>

          <div className="flex flex-col gap-4">
            {[
              {
                num: "Layer 01 · Market problem",
                title: "AI agents are beginning to transact. Nobody has defined what trust looks like.",
                body: "ChatGPT, Claude, Gemini are building commerce capabilities. Users will delegate purchases to AI agents — flights, hotels, groceries, subscriptions. Mastercard processes the payment in the background, invisible and unacknowledged. In a world with no checkout screen, how does Mastercard maintain trust, visibility, and relevance?",
                accent: "border-l-red-500",
                teal: false,
              },
              {
                num: "Layer 02 · Internal problem",
                title: "Four teams building the same Figma flows independently. Nobody had named the duplication.",
                body: "Product, Tech, Research, and Brand were all separately creating Agentic Commerce UX flows. Inconsistent outputs, duplicated effort, no shared language. Nobody had been asked to fix this. I saw it and proposed the solution: one consolidated toolkit every team could build from.",
                accent: "border-l-orange-500",
                teal: false,
              },
              {
                num: "Layer 03 · The design philosophy problem",
                title: "Brand wanted to be everywhere. The right answer was to be almost nowhere.",
                body: "Brand's instinct: maximum Mastercard logo visibility throughout the agentic flow. My instinct: agentic commerce is defined by fluidity — constant branding interrupts it. The question wasn't 'how visible should Mastercard be?' It was 'at which exact moments does Mastercard's presence actually build trust?'",
                accent: "border-l-teal-500",
                teal: true,
              },
            ].map((layer, i) => (
              <FadeIn key={i} delay={i * 0.08}>
                <div className={`p-6 border border-white/[0.07] rounded-2xl border-l-[3px] ${layer.accent} ${layer.teal ? "bg-teal-500/[0.04]" : "bg-white/[0.02]"}`}>
                  <p className="text-[11px] uppercase tracking-[0.08em] font-medium text-neutral-500 mb-2">{layer.num}</p>
                  <p className={`text-[17px] font-medium mb-3 leading-snug ${layer.teal ? "text-teal-400" : "text-white"}`}>{layer.title}</p>
                  <p className={`text-[13px] leading-relaxed ${layer.teal ? "text-teal-500/70" : "text-neutral-400"}`}>{layer.body}</p>
                </div>
              </FadeIn>
            ))}
          </div>
        </div>
        <div className="h-px w-full bg-white/[0.06] mt-16" />
      </CsSection>

      {/* ── RESEARCH ── light */}
      <CsSection label="Research">
        <div className="space-y-8">
          <div className="max-w-2xl space-y-3">
            <h2 className="text-2xl md:text-3xl font-semibold text-foreground leading-snug tracking-tight">
              What the multilingual study surfaced
            </h2>
            <p className="text-[14px] text-muted-foreground leading-relaxed">
              Six research flows. Three regions — NAM, EU, South America. Assisted Agent Pay and
              Autonomous Agent Pay tested separately. Multilingual. The structural insights that
              shaped the design direction are mine to share.
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-4">
            {[
              {
                num: "Insight 01 · Platform reality",
                finding: "The invisibility paradox",
                quote: "In traditional payments, brand recognition is the trust signal. In agentic flows, brand recognition becomes noise.",
                change: "Mastercard's strongest checkout asset — visual brand presence — becomes a liability when the AI is supposed to be acting fluidly.",
              },
              {
                num: "Insight 02 · Trust architecture",
                finding: "Trust isn't continuous — it spikes at specific moments",
                quote: "Users don't need to know Mastercard is there throughout the flow. They need to know it's there when something important happens.",
                change: "The trust system had to match user anxiety architecture — appearing at confirmation, verification, and completion.",
              },
              {
                num: "Insight 03 · Flow typology",
                finding: "Assisted and Autonomous are different products, not variations",
                quote: "When I'm involved in the decision, I want to confirm. When I've delegated, I just want to know it happened safely.",
                change: "Designed as separate flows, not variants of one. Different trust architectures for different delegation models.",
              },
              {
                num: "Insight 04 · Sensory channel",
                finding: "When the screen belongs to ChatGPT, sound and touch are the only brand channels",
                quote: "In third-party environments, Mastercard has no persistent visual presence. The brand has to live somewhere else.",
                change: "Multi-sensory design moved from nice-to-have to primary brand strategy for agentic environments.",
              },
            ].map((insight, i) => (
              <FadeIn key={i} delay={i * 0.07}>
                <div className="p-6 bg-card border border-border rounded-2xl h-full flex flex-col gap-3">
                  <p className="text-[11px] text-muted-foreground">{insight.num}</p>
                  <p className="text-[15px] font-medium text-foreground leading-snug">{insight.finding}</p>
                  <p className="text-[13px] text-muted-foreground italic border-l-2 border-border pl-3 leading-relaxed">
                    &ldquo;{insight.quote}&rdquo;
                  </p>
                  <p className="text-[13px] text-muted-foreground leading-relaxed mt-auto flex gap-1.5">
                    <span className="shrink-0 mt-0.5">→</span>
                    {insight.change}
                  </p>
                </div>
              </FadeIn>
            ))}
          </div>

          <FadeIn>
            <div className="p-5 bg-card border border-l-[3px] border-border rounded-2xl">
              <p className="text-[13px] text-muted-foreground leading-relaxed">
                <strong className="text-foreground font-medium">Research findings are confidential.</strong>{" "}
                The multilingual study across NAM, EU, and South America surfaced meaningful regional
                differences in how users respond to trust signals in autonomous payment flows.
                Those findings directly informed the V2 demo direction and multi-sensory design decisions.
                Happy to discuss specifics in conversation.
              </p>
            </div>
          </FadeIn>
        </div>
      </CsSection>

      {/* ── DECISIONS ── dark */}
      <CsSection label="Key Decisions" variant="dark">
        <div className="space-y-6">
          <h2 className="text-2xl md:text-3xl font-semibold text-white leading-snug tracking-tight mb-2">
            Four calls that shaped the work
          </h2>
          <CsDecision
            index={0}
            title="The duplication problem — four teams building the same flows"
            problem="Product, Tech, Research, and Brand were all separately creating Agentic Commerce UX flows. Inconsistent outputs, duplicated effort, no shared language. Nobody asked me to fix this."
            decision="Proposed owning the Figma flows for all teams. One source of truth for agentic commerce UX — used by Product, Tech, Research, and Brand. I saw the problem and moved on it."
            tradeoff="Deliberate scope expansion beyond my explicit brief. The risk: if my toolkit wasn't good enough, four teams would ignore it and return to building separately."
            impact="One consolidated toolkit adopted across all four teams. Inconsistency eliminated at source. Every team now builds from the same agentic commerce foundation."
          />
          <CsDecision
            index={1}
            title="The silent guardian — the most important decision this project made"
            problem="Brand wanted Mastercard visible throughout the agentic flow — maximum logo presence at every stage. My instinct: in ambient computing, constant branding interrupts fluid AI-led flows."
            decision="Mastercard invisible by default. Appears only at three moments: payment confirmation, identity verification, transaction completion. Not a logo — a trust signal. Subtle. Unmistakable when it appears."
            tradeoff="Pushing back on Brand — the team that owns the identity — required framing it as product philosophy, not design preference. In ambient computing, trust is earned by appearing at the right moment, not everywhere."
            impact="Silent guardian adopted as the company-wide direction for Mastercard's role in agentic commerce. SVP of Multi-Sensory, Brand team, and all stakeholders aligned. The agreed approach."
          />
          <CsDecision
            index={2}
            title="React over Figma — building a demo that survives live conversation"
            problem="CPO needs to demo live from a phone in client meetings with Google, ChatGPT, and merchant partners. Figma prototypes fall apart mid-meeting — can't customise per client, can't handle interruptions."
            decision="Built a fully interactive React app with Claude AI backend in two weeks. Customisable per pitch — user name, region, currency, flight details. ElevenLabs voice mode. Runs on phone."
            tradeoff="Going outside my job description. Building a production React app with an AI backend in 2 weeks is an engineering task. I did it because the problem required it — and because I could."
            impact="CPO and multiple SVPs demo Agent Pay live from their phones at Money20/20, Mastercard Connections, and Innovate at McLaren HQ. No designer in the room required."
          />
          <CsDecision
            index={3}
            title="Haptics beyond Figma — real signals for real research"
            problem="Multi-sensory research required testing real haptic feedback at the guardian moments. Figma doesn't support haptics. Do you drop haptics from scope or find a way?"
            decision="Brought in Haptic Labs to execute haptic feedback for UX research instruments. The tool's limitation is not the project's limitation. If touch is a trust signal in agentic commerce, you need to test touch — not simulate it."
            tradeoff="Additional collaboration overhead with an external partner. More coordination, longer research setup. Worth it because the alternative was incomplete data on a primary trust channel."
            impact="Research found multi-sensory signals behave differently across regions. That finding only exists because we tested real haptics. Regional haptic variations now inform V2 multi-sensory design."
          />
        </div>
        <div className="h-px w-full bg-white/[0.06] mt-16" />
      </CsSection>

      {/* ── SILENT GUARDIAN ── dark centrepiece */}
      <CsSection label="The silent guardian" variant="dark">
        <div className="space-y-10">
          <div className="max-w-2xl space-y-3">
            <h2 className="text-2xl md:text-3xl font-semibold text-white leading-snug tracking-tight">
              Invisible until the moment it matters. Then unmistakable.
            </h2>
            <p className="text-[15px] text-neutral-400 leading-relaxed">
              The agentic payment journey has seven stages. Mastercard is present throughout —
              processing, routing, protecting. But visible at only three. The moments where a
              user needs to know they&apos;re safe.
            </p>
          </div>

          {/* Flow diagram */}
          <FadeIn>
            <div className="relative overflow-x-auto">
              {/* Connecting line */}
              <div className="absolute top-[14px] left-0 right-0 h-px bg-white/[0.08] pointer-events-none" />
              <div className="relative flex min-w-[560px]">
                {[
                  { label: ["User", "intent"],         active: false, role: []                     },
                  { label: ["AI", "browses"],           active: false, role: []                     },
                  { label: ["AI", "selects"],           active: false, role: []                     },
                  { label: ["Payment", "confirm"],      active: true,  role: ["Mastercard", "appears"] },
                  { label: ["Identity", "verify"],      active: true,  role: ["Trust", "signal"]    },
                  { label: ["Transaction", "complete"], active: true,  role: ["Protected", "by MC"] },
                  { label: ["Receipt", "/ done"],       active: false, role: []                     },
                ].map((node, i) => (
                  <div key={i} className="flex-1 flex flex-col items-center relative z-10">
                    <div className={`w-7 h-7 rounded-full flex items-center justify-center mb-3 ${
                      node.active
                        ? "bg-teal-500 shadow-[0_0_20px_rgba(20,184,166,0.45)]"
                        : "bg-white/[0.05] border border-white/[0.12]"
                    }`}>
                      {node.active && <span className="text-[10px] text-black font-bold">✓</span>}
                    </div>
                    <p className={`text-[10px] text-center leading-[1.35] mb-1.5 ${node.active ? "text-white font-medium" : "text-neutral-600"}`}>
                      {node.label.map((line, j) => <span key={j} className="block">{line}</span>)}
                    </p>
                    <p className="text-[9px] text-center text-teal-500 leading-[1.35] min-h-[24px]">
                      {node.role.map((line, j) => <span key={j} className="block">{line}</span>)}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </FadeIn>

          {/* Legend */}
          <div className="flex flex-wrap gap-6">
            {[
              { dot: "bg-white/[0.15] border border-white/[0.12]", label: "Mastercard silent — processing in background" },
              { dot: "bg-teal-500",                                 label: "Mastercard present — trust signal active" },
            ].map(l => (
              <div key={l.label} className="flex items-center gap-2 text-[12px] text-neutral-400">
                <div className={`w-2.5 h-2.5 rounded-full shrink-0 ${l.dot}`} />
                {l.label}
              </div>
            ))}
          </div>

          {/* Philosophy callout */}
          <FadeIn>
            <div className="p-6 border border-white/[0.07] rounded-2xl bg-white/[0.02] max-w-2xl">
              <p className="text-[16px] font-medium text-white mb-3 leading-snug">
                Why this is a product decision, not a design preference
              </p>
              <p className="text-[13px] text-neutral-400 leading-relaxed">
                In ambient computing, trust is architectural. The question is not &ldquo;how prominent
                should the brand be?&rdquo; It&apos;s &ldquo;at which exact moments does brand presence reduce user
                anxiety?&rdquo; Those are different questions with different answers. The silent guardian
                framework answers the second — and in doing so, defines Mastercard&apos;s entire role in
                agentic commerce.
              </p>
            </div>
          </FadeIn>
        </div>
        <div className="h-px w-full bg-white/[0.06] mt-16" />
      </CsSection>

      {/* ── SOLUTION ── light */}
      <CsSection label="Solution">
        <div className="space-y-12">
          <h2 className="text-2xl md:text-3xl font-semibold text-foreground leading-snug tracking-tight">
            Three things built — and why each one existed
          </h2>

          {/* Figma toolkit */}
          <FadeIn>
            <div className="p-6 bg-card border border-border rounded-2xl">
              <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-muted-foreground mb-5">
                The Agent Pay Toolkit — Figma
              </p>
              <div className="grid md:grid-cols-2 gap-0 border border-border rounded-xl overflow-hidden">
                {[
                  {
                    label: "Assisted Agent Pay — 3 flows",
                    flows: [
                      { num: "01", title: "User-initiated with confirmation", desc: "User sets intent, AI executes, user confirms at payment. Trust signal at confirmation gate." },
                      { num: "02", title: "Partial delegation", desc: "AI handles selection, user approves shortlist before payment. Double-check pattern." },
                      { num: "03", title: "Exception handling", desc: "What happens when AI can't complete — escalation, user re-entry, trust reassurance." },
                    ],
                  },
                  {
                    label: "Autonomous Agent Pay — 3 flows",
                    flows: [
                      { num: "01", title: "Fully delegated transaction", desc: "User has pre-authorised. AI transacts without interruption. Ambient trust signal post-completion." },
                      { num: "02", title: "Recurring autonomous", desc: "Subscription or repeat purchase. Silent guardian appears at renewal. User stays informed passively." },
                      { num: "03", title: "Dispute and reversal", desc: "When autonomous payment is wrong. Trust recovery flow — Mastercard visible throughout." },
                    ],
                  },
                ].map((col, ci) => (
                  <div key={ci} className={`p-5 ${ci === 0 ? "md:border-r border-border" : ""} border-b md:border-b-0 border-border last:border-b-0`}>
                    <p className="text-[10px] font-semibold uppercase tracking-[0.16em] text-muted-foreground mb-4">{col.label}</p>
                    <div className="flex flex-col gap-3">
                      {col.flows.map(f => (
                        <div key={f.num} className="flex gap-3 p-3 bg-muted rounded-lg">
                          <span className="text-[11px] font-medium text-teal-600 dark:text-teal-400 shrink-0 mt-0.5">{f.num}</span>
                          <div>
                            <p className="text-[13px] font-medium text-foreground mb-0.5">{f.title}</p>
                            <p className="text-[12px] text-muted-foreground leading-snug">{f.desc}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
              <p className="text-[11px] text-muted-foreground mt-4">
                Used by Product, Tech, Research, and Brand teams · Multilingual research across NAM, EU, South America · Fed directly into V2 direction
              </p>
            </div>
          </FadeIn>

          {/* Multi-sensory */}
          <div>
            <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-muted-foreground mb-3">
              Multi-sensory trust framework
            </p>
            <p className="text-[14px] text-muted-foreground leading-relaxed max-w-xl mb-6">
              When the screen belongs to ChatGPT or Claude, visual branding has no persistent home.
              Sound and haptics become the primary Mastercard brand channel in agentic environments.
            </p>
            <div className="grid md:grid-cols-3 gap-4">
              {[
                {
                  icon: "👁",
                  name: "Visual",
                  desc: "Subtle brand ingredient at the three guardian moments. Not a logo — a trust mark. Appears, confirms, recedes. Designed to feel like a signal, not an advertisement.",
                  collab: "Own work · Figma + motion team",
                },
                {
                  icon: "🔔",
                  name: "Sound",
                  desc: "Audio cues at payment confirmation, verification, and completion. Short, distinctive, reassuring. Builds on Mastercard's existing sonic identity without replicating it.",
                  collab: "Collaboration · Video / motion team",
                },
                {
                  icon: "📳",
                  name: "Haptics",
                  desc: "Three haptic patterns for three guardian moments — distinct intensities and rhythms. Figma doesn't support haptics, so we went outside the tool. Regional variations tested in research.",
                  collab: "Collaboration · Haptic Labs",
                },
              ].map((s, i) => (
                <FadeIn key={i} delay={i * 0.07}>
                  <div className="p-6 bg-card border border-border rounded-2xl h-full flex flex-col">
                    <span className="text-2xl mb-4">{s.icon}</span>
                    <p className="text-[15px] font-medium text-foreground mb-2">{s.name}</p>
                    <p className="text-[13px] text-muted-foreground leading-relaxed flex-1 mb-4">{s.desc}</p>
                    <p className="text-[11px] text-muted-foreground/70">{s.collab}</p>
                  </div>
                </FadeIn>
              ))}
            </div>
          </div>
        </div>
      </CsSection>

      {/* ── LIVE DEMO ── dark */}
      <CsSection label="Live Demo" variant="dark">
        <div className="grid md:grid-cols-2 gap-12 items-center">

          {/* Left: annotation */}
          <div className="space-y-6">
            <h2 className="text-2xl md:text-3xl font-semibold text-white leading-snug tracking-tight">
              Built in 2 weeks.<br />Used by the CPO<br />at Money20/20.
            </h2>
            <p className="text-[15px] text-neutral-400 leading-relaxed">
              Figma prototypes break in live conversation. The CPO needed something he could hold,
              hand to someone, demo mid-meeting without it falling apart. I built a fully interactive
              React simulation of Agent Pay — powered by Claude AI — in two weeks.
            </p>
            <div className="flex flex-col gap-3">
              {[
                { icon: "⚡", title: "Built in React.js + Claude AI", desc: "Real AI responses, not scripted. Adapts to any conversation in real time." },
                { icon: "🎯", title: "Customisable per pitch", desc: "User name, region, currency, address, flight details — all editable for each client meeting." },
                { icon: "🔊", title: "Voice mode via ElevenLabs", desc: "Multi-sensory demo capability. Accessibility and voice-first interaction research." },
                { icon: "📱", title: "Mobile-first", desc: "Runs on phone. CPO demos live. No laptop required, no Figma credentials needed." },
              ].map((f, i) => (
                <div key={i} className="flex gap-4 p-4 bg-white/[0.03] border border-white/[0.07] rounded-xl">
                  <span className="text-base shrink-0 mt-0.5">{f.icon}</span>
                  <div>
                    <p className="text-[13px] font-medium text-white mb-0.5">{f.title}</p>
                    <p className="text-[12px] text-neutral-400 leading-snug">{f.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Right: phone frame + iframe */}
          <div className="relative flex flex-col items-center">
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(20,184,166,0.18)_0%,transparent_65%)]" />
            <div className="relative z-10 w-[280px] rounded-[32px] border border-white/[0.15] overflow-hidden shadow-[0_40px_100px_rgba(0,0,0,0.7)]">
              <div className="h-6 bg-[#0a0a0a] flex items-center justify-center">
                <div className="w-[60px] h-[6px] rounded-full bg-[#222]" />
              </div>
              <iframe
                src="https://agent-pay-demo.vercel.app/"
                title="Agent Pay — live interactive demo (white-labelled)"
                className="w-full h-[560px] border-none block bg-[#0a0a0a]"
                loading="lazy"
                allow="microphone"
              />
              <div className="h-5 bg-[#0a0a0a]" />
            </div>
            <p className="relative z-10 text-center mt-4 text-[11px] text-neutral-500 leading-relaxed max-w-[260px]">
              White-labelled version — live and interactive.<br />
              The Mastercard-branded version is used by the CPO<br />
              in live conversations with Google, ChatGPT, and merchant partners.
            </p>
          </div>

        </div>
        <div className="h-px w-full bg-white/[0.06] mt-16" />
      </CsSection>

      {/* ── IMPACT ── light */}
      <CsSection label="Impact">
        <div className="space-y-10">
          <h2 className="text-2xl md:text-3xl font-semibold text-foreground leading-snug tracking-tight">
            What this work actually changed
          </h2>

          {/* Metric cards */}
          <FadeIn>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              {[
                { label: "Strategic direction", value: "Adopted",  sub: "silent guardian — company-wide", teal: true },
                { label: "Events used",         value: "3",        sub: "Money20/20 · Connections · McLaren" },
                { label: "Research flows",      value: "6",        sub: "NAM · EU · South America" },
                { label: "React demo",          value: "2 weeks",  sub: "solo build · live in production" },
              ].map(m => (
                <div key={m.label} className={`p-4 rounded-xl border ${m.teal ? "bg-teal-500/[0.08] border-teal-500/20" : "bg-muted border-border"}`}>
                  <p className="text-[11px] text-muted-foreground mb-1">{m.label}</p>
                  <p className={`text-[22px] font-semibold tracking-tight leading-none mb-1 ${m.teal ? "text-teal-600 dark:text-teal-400" : "text-foreground"}`}>{m.value}</p>
                  <p className="text-[11px] text-muted-foreground">{m.sub}</p>
                </div>
              ))}
            </div>
          </FadeIn>

          {/* Impact table */}
          <FadeIn>
            <div className="p-6 bg-card border border-border rounded-2xl">
              <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-muted-foreground mb-5">Impact by type</p>
              <div className="divide-y divide-border">
                {IMPACT_ROWS.map((row, i) => (
                  <div key={i} className="grid md:grid-cols-[200px_1fr] gap-4 py-4 first:pt-0 last:pb-0">
                    <p className="text-[13px] font-medium text-foreground">{row.what}</p>
                    <p className="text-[13px] text-muted-foreground leading-relaxed">{row.how}</p>
                  </div>
                ))}
              </div>
            </div>
          </FadeIn>

          {/* Roadmap */}
          <div>
            <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-muted-foreground mb-4">
              Roadmap — where this is going
            </p>
            <FadeIn>
              <div className="grid md:grid-cols-3 gap-px bg-border rounded-2xl overflow-hidden">
                {ROADMAP.map(col => (
                  <div key={col.version} className={`p-6 ${col.version === "Future" ? "bg-muted" : "bg-background"}`}>
                    <p className="text-[13px] font-semibold text-foreground mb-0.5">{col.version}</p>
                    <p className="text-[12px] text-muted-foreground mb-3">{col.date}</p>
                    <span className={`inline-block text-[10px] font-medium px-2.5 py-1 rounded-full mb-4 ${col.badgeClass}`}>
                      {col.badge}
                    </span>
                    <ul className="flex flex-col gap-2">
                      {col.items.map((item, i) => (
                        <li key={i} className="flex gap-1.5 text-[13px] text-muted-foreground leading-snug">
                          <span className="shrink-0 mt-0.5">·</span>
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

      {/* ── ONE CREDENTIAL CALLOUT ── */}
      <CsSection label="Adjacent Work">
        <FadeIn>
          <div className="p-6 bg-card border border-border rounded-2xl max-w-2xl">
            <p className="text-[13px] leading-relaxed text-muted-foreground">
              <strong className="text-foreground font-medium block mb-2">One adjacent piece worth noting</strong>
              I contributed to the initial product concept for{" "}
              <strong className="text-foreground font-medium">Mastercard One Credential</strong> — now a live
              product at mastercard.com — before it moved to a dedicated product team. That early concept
              work informed how I think about credential flexibility in payment experiences, and directly
              shaped my perspective on how agentic commerce needs to handle payment credential management
              at scale.
            </p>
          </div>
        </FadeIn>
      </CsSection>

      {/* ── REFLECTION ── dark */}
      <CsSection label="Reflection" variant="dark">
        <div className="space-y-8">
          <blockquote className="text-xl md:text-2xl font-light italic text-white/85 border-l-[3px] border-teal-500 pl-6 leading-relaxed max-w-2xl">
            &ldquo;Designing for agentic commerce taught me that trust is not a visual problem.
            It&apos;s an architectural one. The question isn&apos;t where to put the logo.
            It&apos;s what should happen — and what should be felt — at the exact moment
            a user needs to know they&apos;re safe.&rdquo;
          </blockquote>

          <div className="grid md:grid-cols-2 gap-4">
            {[
              {
                label: "Designing in undefined space",
                body: "There's no established UX pattern for agentic payments. No precedent, no best practice, no competitive reference. Everything had to be derived from first principles — what does trust require, what does an AI agent require, and where do those needs intersect? That's the most interesting design problem I've worked on. It's also the most unresolved.",
              },
              {
                label: "The silent guardian as product philosophy",
                body: "Pushing back on Brand wasn't a design choice — it was a product argument. If Mastercard is everywhere in the agentic flow, it's noise. If it appears only when a user is anxious about safety, it's signal. The silent guardian decision was the moment this project moved from 'making things look right' to 'defining what Mastercard actually is in a new commercial world.'",
              },
              {
                label: "Why the React demo mattered more than the Figma flows",
                body: "The Figma toolkit was research infrastructure. The React demo was a sales instrument. Both were necessary. But the CPO using the React demo in a live conversation with Google is what moved the work from internal strategy to external positioning. Sometimes the most important thing a designer can do is build something that removes themselves from the process entirely.",
              },
              {
                label: "What I'd do differently",
                body: "Instrument the toolkit from day one. Which flows get used most? Which scenarios come up in every pitch? Which regional variations get adapted and which get used as-is? The toolkit is generating value across four teams and three regions — but I can't fully see how it's being used. Unmeasured systems are hard to improve.",
              },
            ].map((card, i) => (
              <FadeIn key={i} delay={i * 0.07}>
                <div className="p-6 border border-white/[0.07] rounded-2xl bg-white/[0.02] h-full">
                  <p className="text-[11px] font-semibold uppercase tracking-[0.12em] text-neutral-500 mb-3">{card.label}</p>
                  <p className="text-[13px] text-neutral-400 leading-relaxed">{card.body}</p>
                </div>
              </FadeIn>
            ))}
          </div>
        </div>
      </CsSection>

      <CsNextStudies currentHref="/work/agent-commerce" />

    </div>
  )
}
