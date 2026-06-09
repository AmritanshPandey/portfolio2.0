"use client"

import { motion } from "framer-motion"
import {
  CsSection,
  CsDecision,
  CsInfoBar,
  CsNextStudies,
  CsOnThisPage,
} from "@/components/case-study"

const SECTION_NAV = [
  { id: "problem", label: "Problem" },
  { id: "research", label: "Research" },
  { id: "key-decisions", label: "Key Decisions" },
  { id: "silent-guardian", label: "Silent Guardian" },
  { id: "solution", label: "Solution" },
  { id: "live-demo", label: "Live Demo" },
  { id: "impact", label: "Impact" },
  { id: "adjacent-work", label: "Adjacent Work" },
  { id: "reflection", label: "Reflection" },
]

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
  { what: "Internal team alignment", how: "Four teams went from duplicating flows to building from one shared toolkit. The drift stopped at the source." },
  { what: "Strategic direction adopted", how: "The silent guardian held up against Brand and became the agreed approach for Mastercard's role in agentic commerce." },
  { what: "Executive demo capability", how: "The CPO and several SVPs can demo Agent Pay from their phones, with no designer and no Figma login needed." },
  { what: "Multi-sensory research", how: "Six flows with real haptic and sound variations, tested across three regions. The first Mastercard research of its kind in agentic commerce, and it fed V2." },
  { what: "External conversations", how: "The work has been used in live conversations with Google, ChatGPT, and merchant partners to show where Mastercard fits." },
  { what: "New brand dimension", how: "Multi-sensory design is now a Mastercard brand channel for agentic environments, an infrastructure decision the company has kept." },
]

const ROADMAP = [
  {
    version: "V1", date: "8 months · shipped",
    badge: "Complete", badgeClass: "bg-orange-500/15 text-orange-400",
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
    badge: "Active", badgeClass: "bg-orange-500/15 text-orange-400",
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
    <div className="relative min-h-[640px] overflow-hidden bg-[oklch(0.985_0_0)] text-foreground dark:bg-[oklch(0.14_0_0)]">

      {/* Ambient glows */}
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute inset-0 bg-[radial-gradient(900px_500px_at_10%_0%,rgba(249,115,22,0.06),transparent_60%)] opacity-70 dark:bg-[radial-gradient(900px_500px_at_10%_0%,rgba(249,115,22,0.09),transparent_60%)]" />
      </div>

      <div className="relative max-w-[1000px] mx-auto px-6 pt-32 pb-16 md:pt-40 md:pb-20">
        <div className="grid md:grid-cols-2 gap-12 items-center">

          {/* ── Left: copy ── */}
          <div>
            <motion.div
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4 }}
              className="flex items-center gap-3 mb-10 text-[11px] tracking-[0.22em] uppercase text-muted-foreground"
            >
              <span>Case Study</span>
              <span className="w-1 h-1 rounded-full bg-border" />
              <span className="text-orange-600 dark:text-orange-400">Agentic Commerce</span>
              <span className="w-1 h-1 rounded-full bg-border" />
              <span>Mastercard · Creative Studio</span>
            </motion.div>

            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.4, delay: 0.04 }}
              className="inline-block text-[10px] uppercase tracking-[0.16em] text-muted-foreground border border-border rounded px-2.5 py-1 mb-6"
            >
              Flagship · Ongoing
            </motion.p>

            <motion.h1
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.55, delay: 0.06, ease: [0.22, 1, 0.36, 1] }}
              className="type-page-title max-w-lg text-foreground mb-6"
            >
              The{" "}
              <em className="not-italic text-orange-400">silent guardian</em>
              : Mastercard&apos;s role in AI-led payments.
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.12, ease: [0.22, 1, 0.36, 1] }}
              className="type-section-intro text-muted-foreground mb-8"
            >
              Agentic commerce is payment without a payment screen. I built the research toolkit,
              the multi-sensory trust framework, and the React demo the CPO used at Money20/20 to
              show Google and ChatGPT where Mastercard fits.
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.45, delay: 0.18 }}
              className="flex flex-wrap gap-2 mb-8"
            >
              {[
                { label: "Silent guardian, adopted direction", orange: true },
                { label: "Used by CPO + SVPs live" },
                { label: "6 research flows · 3 regions" },
                { label: "React + Claude AI · 2 weeks" },
                { label: "Haptic Labs · ElevenLabs" },
              ].map(p => (
                <span
                  key={p.label}
                  className={`text-[11px] font-medium px-3 py-1 rounded-full border ${
                    p.orange
                      ? "bg-orange-500/10 border-orange-500/35 text-orange-600 dark:text-orange-400"
                      : "border-border text-muted-foreground"
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
              className="flex flex-wrap items-center gap-2 pt-6 border-t border-border/60"
            >
              <span className="text-[11px] text-muted-foreground mr-1">Presented at</span>
              {["Money20/20", "Mastercard Connections", "Innovate at McLaren HQ"].map(e => (
                <span key={e} className="text-[11px] font-medium px-3 py-1 rounded-full border border-orange-500/30 text-orange-600 dark:text-orange-400">
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
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(249,115,22,0.12)_0%,transparent_65%)] dark:bg-[radial-gradient(circle_at_center,rgba(249,115,22,0.18)_0%,transparent_65%)]" />

            <div className="relative z-10 w-[220px] rounded-[28px] border border-white/[0.15] bg-[#111] overflow-hidden shadow-[0_32px_80px_rgba(0,0,0,0.6)]">
              {/* Notch */}
              <div className="h-5 bg-[#0a0a0a] flex items-center justify-center">
                <div className="w-12 h-[5px] rounded-full bg-[#333]" />
              </div>
              {/* Header */}
              <div className="bg-[#111] px-3.5 py-2.5 flex items-center gap-2 border-b border-white/[0.06]">
                <div className="w-6 h-6 rounded-full bg-orange-500 flex items-center justify-center text-[9px] font-bold text-black shrink-0">
                  AI
                </div>
                <div>
                  <p className="text-[11px] font-medium text-white leading-none mb-0.5">ChatAI Agent</p>
                  <p className="text-[10px] text-orange-400">● Active, booking your trip</p>
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
                <div className="bg-orange-500/[0.08] border border-orange-500/25 rounded-[10px] p-2.5 mt-0.5">
                  <p className="text-[9px] uppercase tracking-[0.05em] font-semibold text-orange-400 mb-1.5">Payment secured</p>
                  <p className="text-[10px] text-white/60 leading-[1.4] mb-2">ANA NH807 · Business · Tokyo<br />¥285,000 · Visa ···· 4821</p>
                  <div className="flex items-center gap-1.5">
                    <div className="w-1.5 h-1.5 rounded-full bg-orange-400 shrink-0" />
                    <p className="text-[9px] font-medium text-orange-400">Transaction verified and protected</p>
                  </div>
                  <p className="text-[8px] text-neutral-600 text-right mt-2 tracking-[0.04em]">Secured by trusted payment network ✦</p>
                </div>
              </div>
            </div>
          </motion.div>

        </div>
      </div>

      <div className="absolute bottom-0 left-0 w-full h-px bg-border/70 dark:bg-white/[0.08]" />
    </div>
  )
}

// ─── PAGE ─────────────────────────────────────────────────────────────────────

export default function Page() {
  return (
    <div className="min-h-screen">

      <Hero />

      <CsOnThisPage items={SECTION_NAV} />

      <CsInfoBar cells={[
        { label: "My Role",    value: "Lead · Creative Studio", sub: "toolkit + flows + React demo" },
        { label: "Partners",   value: "Haptic Labs · ElevenLabs", sub: "+ video team · UX research" },
        { label: "Timeline",   value: "8+ months", sub: "ongoing · V2 in progress" },
        { label: "Research",   value: "6 flows", sub: "NAM · EU · South America" },
        { label: "React Demo", value: "2 weeks", sub: "React.js + Claude AI + ElevenLabs" },
        { label: "Platforms",  value: "ChatGPT · Claude", sub: "Gemini · merchant surfaces" },
      ]} />

      {/* ── PROBLEM ── dark */}
      <CsSection id="problem" label="Problem" variant="dark" withDivider={false}>
        <div className="space-y-8">
          <div className="max-w-2xl space-y-3">
            <h2 className="text-2xl md:text-3xl font-semibold text-white leading-snug tracking-tight">
              When AI pays for you, where does trust come from?
            </h2>
            <p className="text-[15px] text-neutral-400 leading-relaxed">
              In normal payments, trust lives in the interface. You see the checkout, you tap, you
              see the Mastercard logo, you feel safe. Agentic commerce removes all of that. Three
              problems landed at once.
            </p>
          </div>

          <div className="flex flex-col gap-4">
            {[
              {
                num: "Layer 01 · Market problem",
                title: "AI agents are starting to buy things, and no one has defined what trust looks like.",
                body: "ChatGPT, Claude, and Gemini are all adding commerce. People will hand purchases to an agent: flights, hotels, groceries, subscriptions. Mastercard still processes the payment, but in the background, unseen. With no checkout screen, how does it stay trusted and relevant?",
                accent: "border-l-red-500",
                orange: false,
              },
              {
                num: "Layer 02 · Internal problem",
                title: "Four teams were building the same flows, and nobody had named the duplication.",
                body: "Product, Tech, Research, and Brand were each building their own agentic flows. Different outputs, duplicated work, no shared language. No one had been asked to fix it. I flagged it and proposed one toolkit every team could build from.",
                accent: "border-l-orange-500",
                orange: false,
              },
              {
                num: "Layer 03 · The design philosophy problem",
                title: "Brand wanted to be everywhere. The right answer was to be almost nowhere.",
                body: "Brand wanted the logo across the whole flow. My read was the opposite: these flows work because they feel fluid, and constant branding breaks that. The real question was not how visible Mastercard should be, but which moments its presence actually builds trust.",
                accent: "border-l-orange-500",
                orange: true,
              },
            ].map((layer, i) => (
              <FadeIn key={i} delay={i * 0.08}>
                <div className={`p-6 border border-white/[0.07] rounded-2xl border-l-[3px] ${layer.accent} ${layer.orange ? "bg-orange-500/[0.04]" : "bg-white/[0.02]"}`}>
                  <p className="text-[11px] uppercase tracking-[0.08em] font-medium text-neutral-500 mb-2">{layer.num}</p>
                  <p className={`text-[17px] font-medium mb-3 leading-snug ${layer.orange ? "text-orange-400" : "text-white"}`}>{layer.title}</p>
                  <p className={`text-[13px] leading-relaxed ${layer.orange ? "text-orange-500/70" : "text-neutral-400"}`}>{layer.body}</p>
                </div>
              </FadeIn>
            ))}
          </div>
        </div>      </CsSection>

      {/* ── RESEARCH ── light */}
      <CsSection id="research" label="Research">
        <div className="space-y-8">
          <div className="max-w-2xl space-y-3">
            <h2 className="text-2xl md:text-3xl font-semibold text-foreground leading-snug tracking-tight">
              What the multilingual study surfaced
            </h2>
            <p className="text-[14px] text-muted-foreground leading-relaxed">
              Six flows, three regions (NAM, EU, South America), tested in several languages. We ran
              Assisted and Autonomous Agent Pay separately. Here are the structural insights I can
              share.
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-4">
            {[
              {
                num: "Insight 01 · Platform reality",
                finding: "The invisibility paradox",
                quote: "In normal payments, seeing the brand is the trust signal. In agentic flows, seeing it becomes noise.",
                change: "Visual presence, Mastercard's strongest checkout asset, turns into a liability once the agent is meant to act on its own.",
              },
              {
                num: "Insight 02 · Trust architecture",
                finding: "Trust isn't constant. It spikes at specific moments.",
                quote: "I don't need to know Mastercard is there the whole time. I need to know it's there when something important happens.",
                change: "So the trust signals follow where anxiety peaks: confirmation, verification, and completion.",
              },
              {
                num: "Insight 03 · Flow typology",
                finding: "Assisted and Autonomous are two products, not two settings",
                quote: "When I'm in the decision, I want to confirm. When I've handed it over, I just want to know it went through safely.",
                change: "So I designed them as separate flows, each with its own trust model.",
              },
              {
                num: "Insight 04 · Sensory channel",
                finding: "When the screen belongs to ChatGPT, sound and touch are the only brand channels",
                quote: "On someone else's surface, Mastercard has nowhere to put a logo. The brand has to live somewhere else.",
                change: "That moved sound and haptics from a nice-to-have to the main brand strategy for these environments.",
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
                <strong className="text-foreground font-medium">The findings are confidential.</strong>{" "}
                The study showed clear regional differences in how people respond to trust signals in
                autonomous payments, and those differences shaped the V2 demos and the multi-sensory
                work. Happy to talk through specifics in person.
              </p>
            </div>
          </FadeIn>
        </div>
      </CsSection>

      {/* ── DECISIONS ── dark */}
      <CsSection id="key-decisions" label="Key Decisions" variant="dark">
        <div className="space-y-6">
          <h2 className="text-2xl md:text-3xl font-semibold text-white leading-snug tracking-tight mb-2">
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
        </div>      </CsSection>

      {/* ── SILENT GUARDIAN ── dark centrepiece */}
      <CsSection id="silent-guardian" label="The silent guardian" variant="dark">
        <div className="space-y-10">
          <div className="max-w-2xl space-y-3">
            <h2 className="text-2xl md:text-3xl font-semibold text-white leading-snug tracking-tight">
              Invisible until the moment it matters. Then unmistakable.
            </h2>
            <p className="text-[15px] text-neutral-400 leading-relaxed">
              The payment journey runs seven stages. Mastercard is present the whole way,
              processing and protecting, but visible at only three: the moments where someone
              needs to know they are safe.
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
                        ? "bg-orange-500 shadow-[0_0_20px_rgba(20,184,166,0.45)]"
                        : "bg-white/[0.05] border border-white/[0.12]"
                    }`}>
                      {node.active && <span className="text-[10px] text-black font-bold">✓</span>}
                    </div>
                    <p className={`text-[10px] text-center leading-[1.35] mb-1.5 ${node.active ? "text-white font-medium" : "text-neutral-600"}`}>
                      {node.label.map((line, j) => <span key={j} className="block">{line}</span>)}
                    </p>
                    <p className="text-[9px] text-center text-orange-500 leading-[1.35] min-h-[24px]">
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
              { dot: "bg-white/[0.15] border border-white/[0.12]", label: "Mastercard silent, processing in the background" },
              { dot: "bg-orange-500",                                 label: "Mastercard present, trust signal active" },
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
                Why this is a product call, not a style choice
              </p>
              <p className="text-[13px] text-neutral-400 leading-relaxed">
                The useful question was never how prominent the brand should be. It was which
                moments brand presence actually lowers someone&apos;s anxiety. Answering that is what
                the silent guardian does, and it ends up defining Mastercard&apos;s whole role in
                agentic commerce.
              </p>
            </div>
          </FadeIn>
        </div>      </CsSection>

      {/* ── SOLUTION ── light */}
      <CsSection id="solution" label="Solution">
        <div className="space-y-12">
          <h2 className="text-2xl md:text-3xl font-semibold text-foreground leading-snug tracking-tight">
            What I built, and why each piece existed
          </h2>

          {/* Figma toolkit */}
          <FadeIn>
            <div className="p-6 bg-card border border-border rounded-2xl">
              <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-muted-foreground mb-5">
                The Agent Pay toolkit (Figma)
              </p>
              <div className="grid md:grid-cols-2 gap-0 border border-border rounded-xl overflow-hidden">
                {[
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
                ].map((col, ci) => (
                  <div key={ci} className={`p-5 ${ci === 0 ? "md:border-r border-border" : ""} border-b md:border-b-0 border-border last:border-b-0`}>
                    <p className="text-[10px] font-semibold uppercase tracking-[0.16em] text-muted-foreground mb-4">{col.label}</p>
                    <div className="flex flex-col gap-3">
                      {col.flows.map(f => (
                        <div key={f.num} className="flex gap-3 p-3 bg-muted rounded-lg">
                          <span className="text-[11px] font-medium text-orange-600 dark:text-orange-400 shrink-0 mt-0.5">{f.num}</span>
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
                  name: "Visual",
                  desc: "A quiet brand mark at the three guardian moments. It appears, confirms, and recedes, more signal than advertisement.",
                  collab: "Own work · Figma + motion team",
                },
                {
                  name: "Sound",
                  desc: "Short, distinctive audio cues at confirmation, verification, and completion. Built on Mastercard's existing sonic identity.",
                  collab: "Collaboration · Video / motion team",
                },
                {
                  name: "Haptics",
                  desc: "Three haptic patterns for the three moments, each a different intensity and rhythm. Figma can't do haptics, so we built them outside it and tested regional variations.",
                  collab: "Collaboration · Haptic Labs",
                },
              ].map((s, i) => (
                <FadeIn key={i} delay={i * 0.07}>
                  <div className="p-6 bg-card border border-border rounded-2xl h-full flex flex-col">
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
      <CsSection id="live-demo" label="Live Demo" variant="dark">
        <div className="grid md:grid-cols-2 gap-12 items-center">

          {/* Left: annotation */}
          <div className="space-y-6">
            <h2 className="text-2xl md:text-3xl font-semibold text-white leading-snug tracking-tight">
              Built in 2 weeks.<br />Used by the CPO<br />at Money20/20.
            </h2>
            <p className="text-[15px] text-neutral-400 leading-relaxed">
              Figma prototypes fall apart the moment a meeting goes off-script. The CPO needed
              something he could hold, hand over, and run mid-conversation. So I built a working
              React version of Agent Pay, powered by Claude, in two weeks.
            </p>
            <div className="flex flex-col gap-3">
              {[
                { title: "React and Claude", desc: "Real AI responses, not a click-through script. It follows wherever the conversation goes." },
                { title: "Editable per meeting", desc: "Name, region, currency, and flight details can be set for whoever is in the room." },
                { title: "Voice mode", desc: "ElevenLabs voice for hands-free demos and voice-first research." },
                { title: "Runs on a phone", desc: "No laptop, no Figma login. The CPO opens it and demos live." },
              ].map((f, i) => (
                <div key={i} className="p-4 bg-white/[0.03] border border-white/[0.07] rounded-xl">
                  <p className="text-[13px] font-medium text-white mb-0.5">{f.title}</p>
                  <p className="text-[12px] text-neutral-400 leading-snug">{f.desc}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Right: phone frame + iframe */}
          <div className="relative flex flex-col items-center">
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(20,184,166,0.18)_0%,transparent_65%)]" />
            <div className="relative z-10 w-[320px] max-w-full">
              {/* iPhone 16 device frame */}
              <div className="relative rounded-[3rem] border border-white/[0.12] bg-[#1b1b1d] p-[11px] shadow-[0_40px_100px_rgba(0,0,0,0.7)]">

                {/* Side buttons — action + volume (left), power (right) */}
                <span className="absolute -left-[3px] top-[96px] h-[26px] w-[3px] rounded-r bg-[#0e0e10]" />
                <span className="absolute -left-[3px] top-[140px] h-[52px] w-[3px] rounded-r bg-[#0e0e10]" />
                <span className="absolute -left-[3px] top-[204px] h-[52px] w-[3px] rounded-r bg-[#0e0e10]" />
                <span className="absolute -right-[3px] top-[160px] h-[80px] w-[3px] rounded-l bg-[#0e0e10]" />

                {/* Screen — iPhone 16 logical ratio 393 × 852 */}
                <div className="relative aspect-[393/852] overflow-hidden rounded-[2.3rem] bg-[#0a0a0a]">
                  <iframe
                    src="https://agent-pay-demo.vercel.app/"
                    title="Agent Pay live interactive demo (white-labelled)"
                    className="absolute inset-0 h-full w-full border-none bg-[#0a0a0a]"
                    loading="lazy"
                    allow="microphone"
                  />
                </div>
              </div>
            </div>
            <p className="relative z-10 text-center mt-4 text-[11px] text-neutral-500 leading-relaxed max-w-[320px]">
              This is the white-labelled version. The Mastercard-branded build is the one the CPO uses with Google, ChatGPT, and merchant partners.
            </p>
          </div>

        </div>      </CsSection>

      {/* ── IMPACT ── light */}
      <CsSection id="impact" label="Impact">
        <div className="space-y-10">
          <h2 className="text-2xl md:text-3xl font-semibold text-foreground leading-snug tracking-tight">
            What this work actually changed
          </h2>

          {/* Metric cards */}
          <FadeIn>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              {[
                { label: "Strategic direction", value: "Adopted",  sub: "silent guardian, company-wide", orange: true },
                { label: "Events used",         value: "3",        sub: "Money20/20 · Connections · McLaren" },
                { label: "Research flows",      value: "6",        sub: "NAM · EU · South America" },
                { label: "React demo",          value: "2 weeks",  sub: "solo build · live in production" },
              ].map(m => (
                <div key={m.label} className={`p-4 rounded-xl border ${m.orange ? "bg-orange-500/[0.08] border-orange-500/20" : "bg-muted border-border"}`}>
                  <p className="text-[11px] text-muted-foreground mb-1">{m.label}</p>
                  <p className={`text-[22px] font-semibold tracking-tight leading-none mb-1 ${m.orange ? "text-orange-600 dark:text-orange-400" : "text-foreground"}`}>{m.value}</p>
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
              Where this is heading
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
      <CsSection id="adjacent-work" label="Adjacent Work">
        <FadeIn>
          <div className="p-6 bg-card border border-border rounded-2xl max-w-2xl">
            <p className="text-[13px] leading-relaxed text-muted-foreground">
              <strong className="text-foreground font-medium block mb-2">One adjacent piece worth noting</strong>
              I worked on the early product concept for{" "}
              <strong className="text-foreground font-medium">Mastercard One Credential</strong>, now live at
              mastercard.com, before it moved to its own product team. That work shaped how I think about
              credential flexibility, and how agentic commerce needs to handle credentials at scale.
            </p>
          </div>
        </FadeIn>
      </CsSection>

      {/* ── REFLECTION ── dark */}
      <CsSection id="reflection" label="Reflection" variant="dark">
        <div className="space-y-8">
          <blockquote className="text-xl md:text-2xl font-light italic text-white/85 border-l-[3px] border-orange-500 pl-6 leading-relaxed max-w-2xl">
            &ldquo;Agentic commerce taught me that trust is less about where you put the logo
            and more about what happens, and what someone feels, at the moment they need to
            know they are safe.&rdquo;
          </blockquote>

          <div className="grid md:grid-cols-2 gap-4">
            {[
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
