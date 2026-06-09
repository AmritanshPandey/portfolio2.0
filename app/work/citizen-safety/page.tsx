"use client"

import { motion } from "framer-motion"
import {
  IconUsers,
  IconClock,
  IconPackages,
  IconTrendingUp,
  IconCode,
  IconTarget,
  IconBulb,
  IconPresentation,
} from "@tabler/icons-react"
import { CsSection, CsDecision, CsAreaChart, CsDualLineChart, CsNextStudies, CsOnThisPage } from "@/components/case-study"

const SECTION_NAV = [
  { id: "story",           label: "The Story" },
  { id: "context",         label: "Context" },
  { id: "role-reality",    label: "Role Reality" },
  { id: "act-1",           label: "Act 1 · Consumer" },
  { id: "act-1-decisions", label: "Act 1 Decisions" },
  { id: "pivot",           label: "The Pivot" },
  { id: "act-3",           label: "Act 3 · B2B Rebuild" },
  { id: "impact",          label: "Impact" },
  { id: "reflection",      label: "Reflection" },
]

// ─── fade-in wrapper ────────────────────────────────────────────────────────

function FadeIn({ children, delay = 0, className = "" }: {
  children: React.ReactNode; delay?: number; className?: string
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-50px" }}
      transition={{ duration: 0.5, delay, ease: [0.22, 1, 0.36, 1] }}
      className={className}
    >
      {children}
    </motion.div>
  )
}

// ─── HERO ──────────────────────────────────────────────────────────────────

function HeroVisual() {
  return (
    <div className="w-full max-w-[360px] mx-auto space-y-3">

      {/* Act 1 */}
      <div className="rounded-2xl border border-orange-500/25 bg-orange-500/[0.05] p-5">
        <p className="text-[9px] font-bold uppercase tracking-[0.22em] text-orange-600/70 dark:text-orange-400/55 mb-2">
          Act 1 · May–Oct 2020 · 6 months
        </p>
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-orange-500/10 border border-orange-500/20 flex items-center justify-center shrink-0">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" className="text-orange-600/70 dark:text-orange-400/60">
              <rect x="5" y="2" width="14" height="20" rx="2" /><line x1="12" y1="18" x2="12.01" y2="18" strokeWidth="2" strokeLinecap="round" />
            </svg>
          </div>
          <div>
            <p className="text-[14px] font-semibold text-foreground leading-tight">Consumer Safety App</p>
            <p className="text-[11px] text-muted-foreground">India&apos;s Life360 · B2C freemium · real users</p>
          </div>
        </div>
      </div>

      {/* Connector + forcing function */}
      <div className="flex items-stretch gap-3 px-2">
        <div className="flex flex-col items-center">
          <div className="w-px flex-1 bg-orange-500/30" />
          <div className="w-2 h-2 rounded-full bg-orange-500/60 my-1 shrink-0" />
          <div className="w-px flex-1 bg-orange-500/30" />
        </div>
        <div className="flex-1 rounded-xl border border-orange-500/20 bg-orange-500/[0.04] px-4 py-3 my-1">
          <p className="text-[9px] font-bold uppercase tracking-[0.2em] text-orange-600/70 mb-1">⚡ Forcing Function</p>
          <p className="text-[12px] font-medium text-foreground/80">COVID-19 Lockdowns</p>
          <p className="text-[11px] text-muted-foreground">Citizens stop moving. B2C use-case evaporates.</p>
        </div>
      </div>

      {/* Pivot */}
      <div className="rounded-2xl border border-orange-500/25 bg-orange-500/[0.04] p-5">
        <p className="text-[9px] font-bold uppercase tracking-[0.22em] text-orange-600/70 dark:text-orange-400/55 mb-2">
          Pivot · Oct–Nov 2020 · 6 weeks
        </p>
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-orange-500/10 border border-orange-500/20 flex items-center justify-center shrink-0">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" className="text-orange-600/70 dark:text-orange-400/60">
              <path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z" />
            </svg>
          </div>
          <div>
            <p className="text-[14px] font-semibold text-foreground leading-tight">The B2B Pivot</p>
            <p className="text-[11px] text-muted-foreground">3-day prototype · 5 enterprise clients · commit</p>
          </div>
        </div>
      </div>

      {/* Connector */}
      <div className="flex items-stretch gap-3 px-2">
        <div className="flex flex-col items-center">
          <div className="w-px flex-1 bg-orange-500/30" />
        </div>
        <div className="flex-1 my-1" />
      </div>

      {/* Act 3 */}
      <div className="rounded-2xl border border-orange-500/25 bg-orange-500/[0.05] p-5">
        <p className="text-[9px] font-bold uppercase tracking-[0.22em] text-orange-600/70 dark:text-orange-400/55 mb-2">
          Act 3 · Nov 2020–Apr 2021 · 5 months
        </p>
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-orange-500/10 border border-orange-500/20 flex items-center justify-center shrink-0">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" className="text-orange-600/70 dark:text-orange-400/60">
              <rect x="2" y="3" width="20" height="14" rx="2" /><path d="M8 21h8M12 17v4" />
            </svg>
          </div>
          <div>
            <p className="text-[14px] font-semibold text-foreground leading-tight">B2B Workplace Safety SaaS</p>
            <p className="text-[11px] text-muted-foreground">Bluetooth · Smart cards · React dashboard</p>
          </div>
        </div>
      </div>

      {/* Outcome stats */}
      <div className="grid grid-cols-3 gap-2 pt-1">
        {[
          { num: "₹1.98Cr", label: "Revenue" },
          { num: "2",       label: "Products" },
          { num: "$494K",   label: "Raised" },
        ].map(s => (
          <div key={s.label} className="text-center rounded-xl border border-border/60 bg-muted/30 py-3">
            <p className="text-[14px] font-semibold text-foreground">{s.num}</p>
            <p className="text-[10px] text-muted-foreground mt-0.5">{s.label}</p>
          </div>
        ))}
      </div>
    </div>
  )
}

function Hero() {
  const meta = [
    { icon: <IconCode size={16} strokeWidth={1.75} />,         label: "Role",     value: "Designer · PM · Frontend" },
    { icon: <IconUsers size={16} strokeWidth={1.75} />,        label: "Team",     value: "10 people" },
    { icon: <IconClock size={16} strokeWidth={1.75} />,        label: "Duration", value: "11 months" },
    { icon: <IconTrendingUp size={16} strokeWidth={1.75} />,   label: "Revenue",  value: "₹1.98Cr lifetime" },
  ]

  return (
    <div className="relative overflow-hidden bg-[oklch(0.985_0_0)] dark:bg-[oklch(0.14_0_0)]">
      {/* Ambient glow */}
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute inset-0 bg-[radial-gradient(900px_500px_at_10%_0%,rgba(249,115,22,0.06),transparent_60%)] opacity-70 dark:hidden" />
        <div className="hidden dark:block absolute inset-0 bg-[radial-gradient(900px_500px_at_10%_0%,rgba(249,115,22,0.09),transparent_60%)]" />
      </div>

      <div className="relative max-w-[1100px] mx-auto px-6 pt-28 pb-0 md:pt-36">

        {/* Back link */}
        {/* Split layout */}
        <div className="grid lg:grid-cols-[1fr_440px] gap-16 xl:gap-20 items-start pb-0">

          {/* LEFT, content */}
          <div className="flex flex-col gap-6">

            {/* Eyebrow */}
            <motion.p
              initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
              className="text-[10px] font-bold uppercase tracking-[0.22em] text-muted-foreground"
            >
              Dror · Gurugram · Seed · 2020–2021
            </motion.p>

            {/* Title */}
            <motion.h1
              initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.55, ease: [0.22, 1, 0.36, 1] }}
              className="text-4xl md:text-5xl lg:text-[3rem] font-semibold tracking-tight leading-[1.06] text-neutral-900 dark:text-white max-w-xl"
            >
              Two products, one pivot, eleven months
            </motion.h1>

            {/* Description */}
            <motion.p
              initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.07, ease: [0.22, 1, 0.36, 1] }}
              className="text-base leading-relaxed text-muted-foreground max-w-lg"
            >
              Sole PM and designer at Dror, through{" "}
              <strong className="text-foreground font-medium">a full product lifecycle</strong>: a 0→1 consumer launch, a{" "}
              <strong className="text-foreground font-medium">COVID-forced B2B pivot</strong>, and a lesson about{" "}
              <strong className="text-foreground font-medium">what PMF looks like when it&apos;s rented from an external event</strong>.
            </motion.p>

            {/* Company/product naming bridge for resume cross-reference */}
            <motion.p
              initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.09, ease: [0.22, 1, 0.36, 1] }}
              className="text-sm leading-relaxed text-muted-foreground max-w-lg"
            >
              Dror was the flagship product at Lythouse, the company was originally Dror Labs.
            </motion.p>

            {/* Meta grid */}
            <motion.div
              initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.45, delay: 0.12, ease: [0.22, 1, 0.36, 1] }}
              className="grid grid-cols-2 sm:grid-cols-4 border border-border/60 rounded-2xl overflow-hidden divide-x divide-y sm:divide-y-0 divide-border/60"
            >
              {meta.map(m => (
                <div key={m.label} className="px-4 py-4 flex flex-col gap-2">
                  <span className="text-muted-foreground/60">{m.icon}</span>
                  <div>
                    <p className="text-[9px] font-bold uppercase tracking-[0.18em] text-muted-foreground mb-0.5">{m.label}</p>
                    <p className="text-[13px] font-medium text-foreground leading-tight">{m.value}</p>
                  </div>
                </div>
              ))}
            </motion.div>

            {/* Footer */}
            <motion.div
              initial={{ opacity: 0 }} animate={{ opacity: 1 }}
              transition={{ duration: 0.4, delay: 0.2 }}
              className="flex flex-wrap items-center gap-5 text-[11px] text-muted-foreground pt-4 border-t border-border/60"
            >
              <span className="flex items-center gap-1.5">
                <IconClock size={13} strokeWidth={1.75} />
                15 min read
              </span>
              <span className="flex items-center gap-1.5">
                <IconPackages size={13} strokeWidth={1.75} />
                2 products shipped
              </span>
              <div className="flex gap-2">
                {["Startup", "Pivot", "0→1", "PMF"].map(t => (
                  <span key={t} className="px-2 py-0.5 rounded-full border border-border/60 bg-muted/40 text-[10px]">{t}</span>
                ))}
              </div>
            </motion.div>
          </div>

          {/* RIGHT, visual */}
          <motion.div
            initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1, ease: [0.22, 1, 0.36, 1] }}
            className="lg:sticky lg:top-24 pb-12"
          >
            <div className="rounded-2xl border border-border/60 bg-muted/20 dark:bg-white/[0.02] p-6 backdrop-blur-sm">
              <p className="text-[9px] font-bold uppercase tracking-[0.2em] text-muted-foreground mb-5">
                Product Journey
              </p>
              <HeroVisual />
            </div>
          </motion.div>

        </div>
      </div>

      {/* Bottom separator */}
      <div className="absolute bottom-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-foreground/10 to-transparent dark:via-white/10" />
    </div>
  )
}

// ─── THREE-ACT TIMELINE ─────────────────────────────────────────────────────

function ActTimeline() {
  return (
    <div className="flex flex-col gap-0">
      <div className="rounded-2xl border border-orange-500/20 bg-orange-500/[0.03] p-5">
        <p className="text-[9px] font-bold uppercase tracking-[0.2em] text-orange-600/70 dark:text-orange-400/60 mb-1">Act 1 · May–Oct 2020 · 6 months</p>
        <p className="text-[15px] font-medium text-foreground mb-1">India&apos;s Life360</p>
        <p className="text-[13px] text-muted-foreground leading-relaxed">Built and launched a consumer citizen safety app from 0→1. B2C freemium. Real users, near-zero revenue.</p>
      </div>
      <div className="flex items-start gap-3 px-4 py-4">
        <div className="flex flex-col items-center mt-1 shrink-0">
          <div className="w-px h-4 bg-border/50" /><div className="w-1.5 h-1.5 rounded-full bg-orange-500/50 my-1" /><div className="w-px h-4 bg-border/50" />
        </div>
        <div className="flex-1 bg-muted/60 border border-border/60 rounded-xl px-4 py-3">
          <p className="text-[9px] font-bold uppercase tracking-[0.18em] text-orange-600/70 dark:text-orange-400/60 mb-1">⚡ Forcing function · March 2020</p>
          <p className="text-[13px] text-foreground/75 leading-relaxed">COVID lockdowns. Citizens stop moving. Safety-while-moving use case evaporates. B2C growth stalls.</p>
        </div>
      </div>
      <div className="rounded-2xl border border-orange-500/20 bg-orange-500/[0.03] p-5">
        <p className="text-[9px] font-bold uppercase tracking-[0.2em] text-orange-600/70 dark:text-orange-400/60 mb-1">Pivot · Oct–Nov 2020 · 6 weeks</p>
        <p className="text-[15px] font-medium text-foreground mb-1">The Pivot Decision</p>
        <p className="text-[13px] text-muted-foreground leading-relaxed">CEO identifies B2B inbound. We prototype a workplace safety product in days, validate with clients, commit.</p>
      </div>
      <div className="flex items-center gap-3 px-4 py-2">
        <div className="ml-[11px] w-px h-8 bg-border/50" />
      </div>
      <div className="rounded-2xl border border-orange-500/20 bg-orange-500/[0.05] p-5">
        <p className="text-[9px] font-bold uppercase tracking-[0.2em] text-orange-600/70 dark:text-orange-400/60 mb-1">Act 3 · Nov 2020–Apr 2021 · 5 months</p>
        <p className="text-[15px] font-medium text-foreground mb-1">B2B SaaS Rebuild</p>
        <p className="text-[13px] text-muted-foreground leading-relaxed">Bluetooth proximity + smart cards + factory manager dashboard I designed nights and coded afternoons in React.</p>
      </div>
      <div className="flex items-start gap-3 px-4 py-4">
        <div className="flex flex-col items-center mt-1 shrink-0">
          <div className="w-px h-4 bg-border/50" /><div className="w-1.5 h-1.5 rounded-full bg-red-500/50 my-1" /><div className="w-px h-4 bg-border/50" />
        </div>
        <div className="flex-1 bg-red-500/[0.04] border border-red-500/15 rounded-xl px-4 py-3">
          <p className="text-[9px] font-bold uppercase tracking-[0.18em] text-red-600/70 dark:text-red-400/60 mb-1">⚡ Forcing function · Late 2021</p>
          <p className="text-[13px] text-foreground/75 leading-relaxed">COVID gets controlled. Restrictions lift. Enterprise clients stop renewing. The urgency that created the market disappears.</p>
        </div>
      </div>
      <div className="rounded-2xl border border-red-500/20 bg-red-500/[0.03] p-5">
        <p className="text-[9px] font-bold uppercase tracking-[0.2em] text-red-600/70 dark:text-red-400/60 mb-1">Wind down · Post Apr 2021</p>
        <p className="text-[15px] font-medium text-foreground mb-1">PMF was real, but rented</p>
        <p className="text-[13px] text-muted-foreground leading-relaxed">Company hits ₹1.98Cr lifetime revenue, eventually winds down. The market we&apos;d built for stopped existing.</p>
      </div>
    </div>
  )
}

// ─── FORCING FUNCTIONS ──────────────────────────────────────────────────────

function ForcingFunctions() {
  const ffs = [
    {
      num: "#1", date: "March 2020", accent: "orange" as const,
      event: "COVID-19 locks everyone home",
      before: "We were 6 months into building a citizen safety app, location sharing, SOS alerts, safety circles for people moving through cities.",
      after: "Citizens stop moving. Our core use case, safety while in transit, becomes irrelevant indefinitely. B2C growth stalls. Revenue near zero.",
    },
    {
      num: "#2", date: "Late 2021", accent: "red" as const,
      event: "COVID gets controlled. Restrictions lift.",
      before: "We had pivoted to B2B workplace safety. Enterprises were paying for Bluetooth-based social distancing tools. Revenue was real. Contracts were signed.",
      after: "The urgency disappears. Offices reopen fully. Clients stop renewing. The problem we solved no longer exists at the severity that made people pay.",
    },
  ]
  return (
    <div className="grid sm:grid-cols-2 gap-4">
      {ffs.map(ff => (
        <div key={ff.num} className={`rounded-2xl border p-6 ${ff.accent === "orange" ? "border-orange-500/20 bg-orange-500/[0.03]" : "border-red-500/20 bg-red-500/[0.03]"}`}>
          <p className={`text-[9px] font-bold uppercase tracking-[0.2em] mb-3 ${ff.accent === "orange" ? "text-orange-600/70 dark:text-orange-400/60" : "text-red-600/70 dark:text-red-400/60"}`}>
            Forcing function {ff.num} · {ff.date}
          </p>
          <p className="text-[15px] font-medium text-foreground mb-4 leading-snug">{ff.event}</p>
          <p className="text-[13px] text-muted-foreground leading-relaxed mb-3">{ff.before}</p>
          <div className="flex gap-2.5 items-start">
            <span className="text-muted-foreground mt-0.5 shrink-0">→</span>
            <p className="text-[13px] text-foreground/80 leading-relaxed">{ff.after}</p>
          </div>
        </div>
      ))}
    </div>
  )
}

// ─── DAILY RHYTHM ───────────────────────────────────────────────────────────

function DailyRhythm() {
  return (
    <div className="space-y-8">
      {/* 24h bar */}
      <div>
        <p className="text-[9px] font-bold uppercase tracking-[0.2em] text-muted-foreground mb-3">A typical 24 hours</p>
        <div className="flex h-8 rounded-full overflow-hidden border border-border/40 gap-px">
          <div className="bg-neutral-900 dark:bg-neutral-700 flex items-center justify-center" style={{ width: "35%" }}>
            <span className="text-[9px] font-semibold text-orange-400/80 tracking-wide">UX DESIGN</span>
          </div>
          <div className="bg-muted/70 flex items-center justify-center" style={{ width: "20%" }}>
            <span className="text-[9px] font-semibold text-muted-foreground tracking-wide">PRD</span>
          </div>
          <div className="bg-orange-500/10 flex items-center justify-center" style={{ width: "35%" }}>
            <span className="text-[9px] font-semibold text-orange-600/70 dark:text-orange-400/70 tracking-wide">REACT</span>
          </div>
          <div className="bg-muted/40 flex items-center justify-center" style={{ width: "10%" }}>
            <span className="text-[9px] text-muted-foreground">…</span>
          </div>
        </div>
        <div className="flex justify-between mt-1.5 text-[10px] text-muted-foreground/60">
          <span>12am</span><span>6am</span><span>12pm</span><span>6pm</span><span>12am</span>
        </div>
      </div>

      {/* Blocks */}
      <div className="grid sm:grid-cols-3 divide-y sm:divide-y-0 sm:divide-x divide-border/50 rounded-2xl border border-border overflow-hidden">
        <div className="p-6 bg-card">
          <p className="text-[9px] font-bold uppercase tracking-[0.2em] text-muted-foreground mb-2">Night</p>
          <p className="text-[14px] font-medium text-foreground mb-2">UX Design</p>
          <p className="text-[12px] text-muted-foreground leading-relaxed">Designed flows, screens, and prototypes for the next day&apos;s dev work. Figma. No handoff process, I was the handoff.</p>
        </div>
        <div className="p-6 bg-muted/40">
          <p className="text-[9px] font-bold uppercase tracking-[0.2em] text-muted-foreground mb-2">12pm Standup</p>
          <p className="text-[14px] font-medium text-foreground mb-2">PRD Delivery</p>
          <p className="text-[12px] text-muted-foreground leading-relaxed">Detailed PRDs to the tech team every morning. Had to be precise, a vague PRD meant broken builds by afternoon.</p>
        </div>
        <div className="p-6 bg-orange-500/[0.04]">
          <p className="text-[9px] font-bold uppercase tracking-[0.2em] text-orange-600/70 dark:text-orange-400/60 mb-2">Afternoon</p>
          <p className="text-[14px] font-medium text-foreground mb-2">React Frontend</p>
          <p className="text-[12px] text-muted-foreground leading-relaxed">Coded the B2B dashboard frontend in React.js alongside the full-stack dev. Frontend would have blocked shipping without me.</p>
        </div>
      </div>

      {/* Team */}
      <div className="rounded-2xl border border-border bg-muted/30 p-6">
        <p className="text-[9px] font-bold uppercase tracking-[0.2em] text-muted-foreground mb-4">Full team, 10 people</p>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-y-4 gap-x-6">
          {[
            { name: "Dhiraj Nauhbar", title: "Co-founder & CEO" },
            { name: "Amritansh", title: "Designer · PM · Frontend" },
            { name: "2 co-founders", title: "Operations & CTO" },
            { name: "2 full-stack devs", title: "Backend + full stack" },
            { name: "2 app developers", title: "Android + iOS" },
            { name: "1 dev intern", title: "Support" },
            { name: "1 marketing intern", title: "Growth" },
          ].map(m => (
            <div key={m.name}>
              <p className="text-[13px] font-medium text-foreground">{m.name}</p>
              <p className="text-[11px] text-muted-foreground">{m.title}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

// ─── ACT 1: GAPS GRID ───────────────────────────────────────────────────────

function GapsGrid() {
  const gaps = [
    { num: "Gap 01", finding: "Connectivity assumption",         change: "Life360 required persistent internet. In tier 2/3 India, patchy connectivity made real-time sharing unreliable exactly when it mattered." },
    { num: "Gap 02", finding: "English-first UI",                change: "Life360&apos;s onboarding was English-heavy and jargon-dense. Our primary users in smaller cities needed icon-first, low-literacy design." },
    { num: "Gap 03", finding: "Family tracking ≠ safety in India", change: "The &lsquo;track your family&rsquo; framing felt invasive in Indian social dynamics. We repositioned as a safety circle, opt-in, mutual, trust-first." },
    { num: "Gap 04 · Research", finding: "68% drop-off in Life360 onboarding", change: "Ran Life360 with 15 Indian users. Primary drop-off: confusing permissions flow, English UI, assumption all members have active smartphones." },
  ]
  return (
    <div className="space-y-8">
      <div>
        <p className="text-[9px] font-bold uppercase tracking-[0.2em] text-muted-foreground mb-5">Why Life360 didn&apos;t work for India</p>
        <div className="grid sm:grid-cols-2 gap-4">
          {gaps.map((g, i) => (
            <FadeIn key={g.num} delay={i * 0.06}>
              <div className="rounded-2xl border border-border bg-muted/30 p-5 h-full">
                <p className="text-[9px] font-bold uppercase tracking-[0.18em] text-muted-foreground mb-2">{g.num}</p>
                <p className="text-[14px] font-medium text-foreground mb-2 leading-snug">{g.finding}</p>
                <div className="flex gap-2.5 items-start">
                  <span className="text-muted-foreground mt-0.5 shrink-0">→</span>
                  <p className="text-[13px] text-muted-foreground leading-relaxed" dangerouslySetInnerHTML={{ __html: g.change }} />
                </div>
              </div>
            </FadeIn>
          ))}
        </div>
      </div>

      {/* Drop-off stat visual */}
      <FadeIn>
        <div className="rounded-2xl border border-border bg-card p-6">
          <p className="text-[9px] font-bold uppercase tracking-[0.2em] text-muted-foreground mb-4">Life360 onboarding drop-off rate · 15 Indian users</p>
          <div className="flex items-end gap-4">
            <div className="flex-1">
              <div className="flex items-center justify-between mb-2">
                <span className="text-[12px] text-muted-foreground">Completed onboarding</span>
                <span className="text-[12px] font-medium text-foreground">32%</span>
              </div>
              <div className="h-3 rounded-full bg-muted overflow-hidden">
                <div className="h-full rounded-full bg-orange-500/60" style={{ width: "32%" }} />
              </div>
              <div className="flex items-center justify-between mt-3 mb-2">
                <span className="text-[12px] text-muted-foreground">Dropped off</span>
                <span className="text-[12px] font-semibold text-orange-600 dark:text-orange-400">68%</span>
              </div>
              <div className="h-3 rounded-full bg-muted overflow-hidden">
                <div className="h-full rounded-full bg-orange-500/70" style={{ width: "68%" }} />
              </div>
            </div>
            <div className="shrink-0 text-right">
              <p className="text-[48px] font-bold text-orange-500/80 leading-none">68%</p>
              <p className="text-[11px] text-muted-foreground">drop-off</p>
            </div>
          </div>
          <p className="text-[12px] text-muted-foreground mt-4 leading-relaxed">Primary reasons: confusing permissions flow, English-heavy copy, assumption that all family members have active smartphones.</p>
        </div>
      </FadeIn>

      {/* Commercial reality */}
      <div className="rounded-2xl border border-orange-500/20 bg-orange-500/[0.04] p-6">
        <p className="text-[9px] font-bold uppercase tracking-[0.2em] text-orange-600/70 dark:text-orange-400/60 mb-3">The commercial reality of Act 1</p>
        <p className="text-[14px] leading-relaxed text-foreground/80">
          The consumer app launched. We got real users. But the revenue model was broken from the start, B2C freemium in India in 2020 meant most users never paid. The product was validated socially, not commercially. Then COVID hit and citizens stopped moving. We had a live product, real users, and almost no revenue.
        </p>
      </div>
    </div>
  )
}

// ─── WHAT WAS CUT ───────────────────────────────────────────────────────────

function WhatWasCut() {
  const cuts = [
    { feature: "Community reporting",       when: "V1",      why: "Trust risk, users feared false alerts and abuse" },
    { feature: "Live location sharing",      when: "V1",      why: "Privacy concern; battery drain on low-end devices" },
    { feature: "In-app emergency call",      when: "V1",      why: "Latency made it slower than native dialer every time" },
    { feature: "Driving behaviour tracking", when: "Roadmap", why: "COVID made this irrelevant, no one was driving" },
  ]
  return (
    <div className="rounded-2xl border border-white/[0.08] overflow-hidden">
      <div className="px-6 py-4 border-b border-white/[0.08]">
        <p className="text-[13px] font-medium text-white">What we cut from V1</p>
        <p className="text-[12px] text-neutral-500 mt-0.5">Prioritisation is what you don&apos;t build.</p>
      </div>
      <div className="divide-y divide-white/[0.06]">
        {cuts.map(c => (
          <div key={c.feature} className="px-6 py-4 grid grid-cols-[1fr_60px_1fr] gap-4 items-start">
            <p className="text-[13px] line-through text-neutral-600">{c.feature}</p>
            <p className="text-[11px] text-neutral-600 font-medium">{c.when}</p>
            <p className="text-[13px] text-neutral-400">{c.why}</p>
          </div>
        ))}
      </div>
    </div>
  )
}

// ─── PIVOT VALIDATION ───────────────────────────────────────────────────────

function PivotValidation() {
  return (
    <div className="space-y-4">
      {/* Funnel visual */}
      <div className="rounded-2xl border border-white/[0.08] bg-white/[0.02] p-6">
        <p className="text-[9px] font-bold uppercase tracking-[0.2em] text-neutral-500 mb-6">Validation pipeline before committing</p>
        <div className="relative">
          {/* Funnel steps */}
          {[
            { step: "01", label: "3 days", sub: "Idea to working prototype", width: "100%" },
            { step: "02", label: "~5 clients", sub: "Enterprises shown the prototype", width: "75%" },
            { step: "03", label: "6 weeks", sub: "Pivot decision to first B2B product", width: "50%" },
          ].map((s, i) => (
            <div key={s.step} className="mb-3 last:mb-0">
              <div className="flex items-center gap-3 mb-1.5">
                <span className="text-[9px] font-bold text-orange-500/70 w-5">{s.step}</span>
                <span className="text-[13px] font-semibold text-white">{s.label}</span>
                <span className="text-[11px] text-neutral-500">{s.sub}</span>
              </div>
              <div className="flex gap-1">
                <div className="w-5 shrink-0" />
                <div className="flex-1 h-2 rounded-full bg-white/[0.04] overflow-hidden">
                  <motion.div
                    className="h-full rounded-full bg-orange-500/60"
                    initial={{ width: 0 }}
                    whileInView={{ width: s.width }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.8, delay: i * 0.15, ease: [0.22, 1, 0.36, 1] }}
                  />
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

// ─── PRODUCT COMPARISON ─────────────────────────────────────────────────────

function ProductComparison() {
  const rows = [
    { label: "Primary user",  act1: "Citizens moving through cities",        act3: "Factory managers + essential workers" },
    { label: "Revenue model", act1: "B2C freemium, mostly free",            act3: "Enterprise contracts, recurring" },
    { label: "Core feature",  act1: "SOS trigger + safety circle",           act3: "Bluetooth proximity + compliance dashboard" },
    { label: "Tech",          act1: "GPS, mobile app (Android + iOS)",       act3: "Bluetooth + smart card hardware + React" },
    { label: "What I built",  act1: "Full UX, PRDs, app design",             act3: "UX, PRDs, React.js frontend dashboard" },
  ]
  return (
    <div className="overflow-hidden rounded-2xl border border-border">
      <div className="grid grid-cols-[1fr_1fr] divide-x divide-border">
        <div className="px-6 py-4 bg-orange-500/[0.04]">
          <p className="text-[9px] font-bold uppercase tracking-[0.2em] text-orange-600/70 dark:text-orange-400/60 mb-0.5">Act 1</p>
          <p className="text-[15px] font-medium text-foreground">Consumer Safety App</p>
        </div>
        <div className="px-6 py-4 bg-orange-500/[0.04]">
          <p className="text-[9px] font-bold uppercase tracking-[0.2em] text-orange-600/70 dark:text-orange-400/60 mb-0.5">Act 3</p>
          <p className="text-[15px] font-medium text-foreground">B2B Workplace Safety SaaS</p>
        </div>
      </div>
      <div className="divide-y divide-border">
        {rows.map(r => (
          <div key={r.label} className="grid grid-cols-[1fr_1fr] divide-x divide-border">
            <div className="px-6 py-4 bg-orange-500/[0.02]">
              <p className="text-[9px] uppercase tracking-[0.14em] text-muted-foreground mb-1">{r.label}</p>
              <p className="text-[13px] text-orange-700/80 dark:text-orange-400/70 leading-relaxed">{r.act1}</p>
            </div>
            <div className="px-6 py-4 bg-orange-500/[0.02]">
              <p className="text-[9px] uppercase tracking-[0.14em] text-muted-foreground mb-1">{r.label}</p>
              <p className="text-[13px] text-orange-700/80 dark:text-orange-400/70 leading-relaxed">{r.act3}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

// ─── DASHBOARD MOCKUP ───────────────────────────────────────────────────────

function DashboardMockup() {
  return (
    <FadeIn>
      <div className="rounded-2xl border border-border overflow-hidden">
        {/* Browser bar */}
        <div className="bg-neutral-900 h-9 flex items-center px-4 gap-2">
          <div className="flex gap-1.5">
            {["bg-red-500/60", "bg-orange-500/60", "bg-orange-500/60"].map((c, i) => (
              <div key={i} className={`w-2.5 h-2.5 rounded-full ${c}`} />
            ))}
          </div>
          <div className="flex-1 mx-4 bg-white/[0.06] rounded-md h-5 flex items-center px-3">
            <p className="text-[10px] text-neutral-500">drorapp.com/dashboard · Factory A</p>
          </div>
        </div>
        {/* Dashboard body */}
        <div className="bg-muted/20 p-5">
          <div className="flex items-center justify-between mb-4">
            <p className="text-[12px] font-semibold text-foreground">Live safety overview, today</p>
            <span className="text-[10px] text-orange-500 bg-orange-500/10 border border-orange-500/20 rounded-full px-2 py-0.5">● Live</span>
          </div>
          {/* Metric cards row */}
          <div className="grid grid-cols-3 gap-3 mb-4">
            {[
              { num: "247", label: "Active workers", textColor: "text-foreground", bar: "82%", barColor: "bg-blue-500/60" },
              { num: "14",  label: "Proximity events", textColor: "text-orange-600 dark:text-orange-400", bar: "14%", barColor: "bg-orange-500/60" },
              { num: "94%", label: "Compliance score", textColor: "text-orange-600 dark:text-orange-400", bar: "94%", barColor: "bg-orange-500/60" },
            ].map(m => (
              <div key={m.label} className="rounded-xl border border-border bg-card p-4">
                <p className={`text-[22px] font-bold ${m.textColor} leading-none mb-1`}>{m.num}</p>
                <p className="text-[10px] text-muted-foreground mb-2">{m.label}</p>
                <div className="h-1.5 rounded-full bg-muted overflow-hidden">
                  <motion.div
                    className={`h-full rounded-full ${m.barColor}`}
                    initial={{ width: 0 }}
                    whileInView={{ width: m.bar }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1] }}
                  />
                </div>
              </div>
            ))}
          </div>
          {/* Mini zone map placeholder */}
          <div className="rounded-xl border border-border bg-card p-4">
            <div className="flex items-center justify-between mb-3">
              <p className="text-[11px] font-medium text-foreground">Zone compliance heatmap</p>
              <span className="text-[10px] text-muted-foreground">Factory floor A</span>
            </div>
            <div className="grid grid-cols-8 gap-1">
              {[0.9,0.8,0.95,0.7,0.85,0.9,0.6,0.95,0.75,0.9,0.85,0.95,0.8,0.7,0.9,0.85,
                0.95,0.6,0.9,0.8,0.75,0.95,0.85,0.9,0.7,0.85,0.9,0.95,0.8,0.75,0.6,0.9].map((v, i) => (
                <div
                  key={i}
                  className="rounded aspect-square"
                  style={{ background: `rgba(34, 197, 94, ${v * 0.6})`, border: "1px solid rgba(34,197,94,0.15)" }}
                />
              ))}
            </div>
            <div className="flex gap-3 mt-2">
              {[{ c: "rgba(34,197,94,0.6)", l: "High compliance" }, { c: "rgba(249,115,22,0.6)", l: "At risk" }].map(l => (
                <div key={l.l} className="flex items-center gap-1.5">
                  <div className="w-2.5 h-2.5 rounded-sm" style={{ background: l.c }} />
                  <span className="text-[10px] text-muted-foreground">{l.l}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
      <p className="text-[11px] text-muted-foreground/60 text-center mt-2">Factory manager dashboard, React.js, designed and coded by me</p>
    </FadeIn>
  )
}

// ─── REVENUE CHART (SVG) ────────────────────────────────────────────────────

const REVENUE_DATA = [
  { label: "Q2'20", value: 0 },
  { label: "Q3'20", value: 0.5 },
  { label: "Q4'20", value: 2 },
  { label: "Q1'21", value: 8 },
  { label: "Q2'21", value: 18 },
  { label: "Q3'21", value: 28 },
  { label: "Q4'21", value: 35 },
  { label: "Q1'22", value: 32 },
  { label: "Q2'22", value: 24 },
  { label: "Q3'22", value: 16 },
  { label: "Q4'22", value: 10 },
  { label: "Q1'23", value: 6 },
]

const REVENUE_ANNOTATIONS = [
  { index: 0, label: "Consumer app" },
  { index: 2, label: "B2B pivot" },
  { index: 6, label: "Peak ₹35L" },
  { index: 9, label: "COVID eases" },
]

// ─── IMPACT METRICS ─────────────────────────────────────────────────────────

function ImpactMetrics() {
  const metrics = [
    { label: "Lifetime revenue", value: "₹1.98Cr", sub: "mostly B2B" },
    { label: "Total funding",    value: "$494K",    sub: "4 rounds · seed" },
    { label: "Competitor rank",  value: "23rd",     sub: "of 215 active" },
    { label: "Products shipped", value: "2",        sub: "in 11 months" },
    { label: "Time to pivot",    value: "6 wks",    sub: "idea → first client" },
  ]
  return (
    <div className="space-y-8">
      {/* Stat grid */}
      <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
        {metrics.map((m, i) => (
          <FadeIn key={m.label} delay={i * 0.05}>
            <div className="rounded-2xl border border-border bg-card p-4">
              <p className="text-[9px] uppercase tracking-[0.14em] text-muted-foreground mb-1.5">{m.label}</p>
              <p className="text-[22px] font-bold text-foreground leading-none mb-1">{m.value}</p>
              <p className="text-[11px] text-muted-foreground">{m.sub}</p>
            </div>
          </FadeIn>
        ))}
      </div>

      {/* Competition rank visual */}
      <FadeIn>
        <div className="rounded-2xl border border-border bg-card p-6">
          <div className="flex items-center justify-between mb-4">
            <div>
              <p className="text-[9px] font-bold uppercase tracking-[0.2em] text-muted-foreground mb-1">Market position</p>
              <p className="text-[15px] font-medium text-foreground">23rd of 215 active competitors</p>
            </div>
            <div className="text-right">
              <p className="text-[28px] font-bold text-foreground leading-none">#23</p>
              <p className="text-[11px] text-muted-foreground">Top 10.7%</p>
            </div>
          </div>
          <div className="relative h-4 rounded-full bg-muted overflow-hidden">
            <motion.div
              className="absolute left-0 top-0 h-full rounded-full bg-gradient-to-r from-orange-500/80 to-orange-500/40"
              initial={{ width: 0 }}
              whileInView={{ width: "10.7%" }}
              viewport={{ once: true }}
              transition={{ duration: 1, ease: [0.22, 1, 0.36, 1] }}
            />
            <div className="absolute left-0 top-0 h-full w-full flex items-center">
              <div className="ml-[10.7%] w-px h-full bg-orange-500" />
            </div>
          </div>
          <div className="flex justify-between mt-1.5">
            <span className="text-[10px] text-orange-500 font-medium">#1</span>
            <span className="text-[10px] text-muted-foreground">#215</span>
          </div>
        </div>
      </FadeIn>

      {/* Revenue chart */}
      <FadeIn>
        <CsAreaChart
          title="Revenue trajectory, company lifetime"
          description="The pivot from B2C to B2B is the only moment revenue grew meaningfully"
          data={REVENUE_DATA}
          unit="₹L"
          color="rgb(83,74,183)"
          annotations={REVENUE_ANNOTATIONS}
          yDomain={[0, 40]}
        />
      </FadeIn>

      {/* Honest assessment */}
      <div className="rounded-2xl border border-red-500/20 bg-red-500/[0.03] p-6">
        <p className="text-[9px] font-bold uppercase tracking-[0.2em] text-red-600/70 dark:text-red-400/60 mb-3">Honest assessment</p>
        <p className="text-[14px] leading-relaxed text-foreground/80">
          ₹1.98Cr sounds like a success. In context it isn&apos;t. The company raised $494K (~₹4Cr) and generated ₹1.98Cr in lifetime revenue. The B2B pivot worked commercially, but only for as long as COVID made social distancing a compliance requirement. Once restrictions lifted, the problem we&apos;d built for stopped being urgent enough for enterprises to pay for. We proved we could sell. We didn&apos;t prove the market would last.
        </p>
      </div>
    </div>
  )
}

// ─── COVID CORRELATION CHART ────────────────────────────────────────────────

const COVID_DUAL_DATA = [
  { label: "Q2'20",  revenue: 0,  covid: 90 },
  { label: "Q3'20",  revenue: 0.5, covid: 85 },
  { label: "Q4'20",  revenue: 2,  covid: 75 },
  { label: "Q1'21",  revenue: 8,  covid: 70 },
  { label: "Q2'21",  revenue: 18, covid: 60 },
  { label: "Q3'21",  revenue: 28, covid: 55 },
  { label: "Q4'21",  revenue: 35, covid: 45 },
  { label: "Q1'22",  revenue: 32, covid: 35 },
  { label: "Q2'22",  revenue: 24, covid: 25 },
  { label: "Q3'22",  revenue: 16, covid: 15 },
  { label: "Q4'22",  revenue: 10, covid: 10 },
  { label: "Q1'23",  revenue: 6,  covid: 5  },
]

// ─── REFLECTION CARDS ───────────────────────────────────────────────────────

function ReflectionCards() {
  const cards = [
    { icon: <IconBulb size={16} strokeWidth={1.75} />, label: "What I&apos;d do differently", body: "Build for the post-COVID use case in parallel. Workplace safety as a category doesn&apos;t require a pandemic, but we never found the non-emergency version of our product. If we&apos;d started that search in early 2021, we might have had something before the urgency disappeared." },
    { icon: <IconTarget size={16} strokeWidth={1.75} />, label: "The PMF lesson", body: "PMF tied to an external forcing function is not durable PMF. Our retention was high, our NPS was strong, clients were happy. But none of that mattered when the underlying reason to buy disappeared. True PMF survives when the conditions that created it change." },
    { icon: <IconPresentation size={16} strokeWidth={1.75} />, label: "What this changed in how I work", body: "I now ask &lsquo;what happens to this product when the forcing function goes away?&rsquo; before committing to any product direction. It&apos;s the question we never asked at Dror, because the forcing function felt permanent at the time." },
    { icon: <IconCode size={16} strokeWidth={1.75} />, label: "The operational learning", body: "Designing nights, writing PRDs at noon, coding afternoons, that rhythm worked because I refused to be a bottleneck. But it&apos;s not scalable. In a lean team, the PM has to be willing to do whatever the product needs, not just what&apos;s in their job description." },
  ]
  return (
    <div className="grid sm:grid-cols-2 gap-4">
      {cards.map((c, i) => (
        <FadeIn key={c.label} delay={i * 0.07}>
          <div className="rounded-2xl border border-border bg-card p-6 h-full">
            <div className="w-8 h-8 rounded-lg bg-orange-500/10 border border-orange-500/15 flex items-center justify-center mb-4 text-orange-600/80 dark:text-orange-400/70">
              {c.icon}
            </div>
            <p className="text-[9px] font-bold uppercase tracking-[0.2em] text-muted-foreground mb-3" dangerouslySetInnerHTML={{ __html: c.label }} />
            <p className="text-[13px] leading-[1.7] text-foreground/70" dangerouslySetInnerHTML={{ __html: c.body }} />
          </div>
        </FadeIn>
      ))}
    </div>
  )
}

// ─── PAGE ────────────────────────────────────────────────────────────────────

export default function Page() {
  return (
    <div className="min-h-screen">

      <Hero />

      <CsOnThisPage items={SECTION_NAV} />

      <CsSection id="story" label="The Story">
        <div className="space-y-6">
          <p className="text-[15px] text-muted-foreground leading-relaxed max-w-2xl">
            Three acts, two forcing functions, one lesson about building products whose market exists only because of the conditions that created them.
          </p>
          <ActTimeline />
        </div>
      </CsSection>

      <CsSection id="context" label="Context" variant="muted">
        <div className="space-y-6">
          <div className="space-y-2">
            <h2 className="text-xl md:text-2xl font-medium text-foreground leading-snug">
              The product didn&apos;t fail. The world changed, twice.
            </h2>
            <p className="text-[14px] text-muted-foreground leading-relaxed max-w-xl">
              Most startup failures are internal, wrong team, wrong execution, wrong market. Dror&apos;s story is different. We built the right product twice. Each time, an external event made our market disappear.
            </p>
          </div>
          <ForcingFunctions />
        </div>
      </CsSection>

      <CsSection id="role-reality" label="Role Reality">
        <div className="space-y-6">
          <div className="space-y-2">
            <h2 className="text-xl md:text-2xl font-medium text-foreground leading-snug">
              There was no time to be a PM in the traditional sense
            </h2>
            <p className="text-[14px] text-muted-foreground leading-relaxed max-w-xl">
              In a 10-person team under survival pressure, I collapsed the PM → Design → Dev handoff into a single person across three time blocks per day.
            </p>
          </div>
          <DailyRhythm />
        </div>
      </CsSection>

      <CsSection id="act-1" label="Act 1, Consumer App" variant="muted">
        <div className="space-y-6">
          <div className="space-y-2">
            <h2 className="text-xl md:text-2xl font-medium text-foreground leading-snug">
              Building India&apos;s Life360, from scratch
            </h2>
            <p className="text-[14px] text-muted-foreground leading-relaxed max-w-xl">
              The CEO had an early MVP and initial seed funding. Life360 existed but wasn&apos;t built for India.
            </p>
          </div>
          <GapsGrid />
        </div>
      </CsSection>

      <CsSection id="act-1-decisions" label="Act 1 Decisions" variant="dark">
        <div className="space-y-5">
          <CsDecision
            index={0}
            title="Full Safety Suite or Single Reliable Action?"
            problem="We had requests for community reporting, live tracking, in-app emergency calls, and driving behaviour tools for V1. Shipping everything would delay launch and create a support surface we couldn't sustain."
            decision="Shipped a single core action: one-tap SOS trigger + safety circle setup. Everything else deferred with documented rationale. In a trust-sensitive category, one failure destroys retention permanently."
            tradeoff="A less feature-complete V1 than stakeholders expected, but zero post-launch critical failures in the category that mattered most: emergency response."
            impact="SOS reliability became the product's trust foundation. Fewer features, rock-solid core, what early retention data confirmed."
          />
          <CsDecision
            index={1}
            title="No Confirmation Screen for SOS"
            problem="A two-step confirmation would prevent accidental triggers. But usability testing showed it added 3× the completion time under simulated stress conditions. Those seconds aren't recoverable."
            decision="One tap = SOS sent. Accepted false positives. Emergency use demands speed over precision. The confirmation step was removed entirely."
            tradeoff="Higher rate of accidental triggers in calm conditions. Worth it for the seconds saved in genuine emergencies where confirmation adds nothing but friction."
          />
          <WhatWasCut />
        </div>
      </CsSection>

      <CsSection id="pivot" label="The Pivot" variant="dark" withDivider={false}>
        <div className="space-y-5">
          <div className="space-y-2">
            <h2 className="text-xl md:text-2xl font-medium text-white leading-snug">The decision that changed everything</h2>
            <p className="text-[14px] text-neutral-400 leading-relaxed max-w-xl">
              Dhiraj was in conversations with enterprises about employee safety. The signal was clear: companies with essential workers needed exactly what we&apos;d built, but packaged for B2B. We validated fast.
            </p>
          </div>
          <CsDecision
            index={0}
            title="Rebuild for B2B or Keep Iterating on Consumer?"
            problem="COVID lockdowns made our core use-case irrelevant indefinitely. The B2C freemium model had near-zero revenue. The team needed a path to commercial viability or it would run out of runway."
            decision="Pivoted to B2B. Rebuilt for enterprise workplace safety with Bluetooth proximity detection and a management dashboard. Kept the consumer app live but stopped investing in it."
            tradeoff="6 months of consumer work became a foundation we weren't building on anymore. Required a full product rebuild with the same team, no extra resources, in 6 weeks."
            impact="First enterprise contracts signed within the pivot window. Revenue went from near-zero to real recurring contracts in a quarter."
          />
          <PivotValidation />
        </div>
      </CsSection>

      <CsSection id="act-3" label="Act 3, B2B Rebuild">
        <div className="space-y-8">
          <div className="space-y-2">
            <h2 className="text-xl md:text-2xl font-medium text-foreground leading-snug">
              Rebuilding for enterprise, Bluetooth, smart cards, and a React dashboard I partly coded myself
            </h2>
          </div>
          <ProductComparison />
          <div>
            <p className="text-[9px] font-bold uppercase tracking-[0.2em] text-muted-foreground mb-5">How the product worked, 4 layers</p>
            <div className="grid sm:grid-cols-2 gap-4">
              {[
                { icon: <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75"><rect x="3" y="3" width="7" height="7" rx="1.5"/><rect x="14" y="3" width="7" height="7" rx="1.5"/><rect x="3" y="14" width="7" height="7" rx="1.5"/><rect x="14" y="14" width="7" height="7" rx="1.5"/></svg>, num: "Layer 01 · Hardware", title: "Smart cards for every worker", desc: "Each essential worker carried a Bluetooth-enabled smart card. Cards detected proximity to other cards. When two workers got too close for too long, both devices vibrated and logged the event." },
                { icon: <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75"><rect x="5" y="2" width="14" height="20" rx="2"/><line x1="12" y1="18" x2="12.01" y2="18" strokeWidth="2" strokeLinecap="round"/></svg>, num: "Layer 02 · Mobile", title: "Phone-based detection for managers", desc: "Workers with smartphones used the mobile app as a secondary detection layer. This reduced hardware cost for enterprises where some workers already had devices." },
                { icon: <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75"><rect x="2" y="3" width="20" height="14" rx="2"/><path d="M8 21h8M12 17v4"/></svg>, num: "Layer 03 · Dashboard", title: "Real-time compliance view for managers", desc: "Factory managers got a web dashboard showing active worker count, proximity events, compliance score, and at-risk zones. This is what I designed nights and coded afternoons in React." },
                { icon: <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><path d="M14 2v6h6M16 13H8M16 17H8M10 9H8"/></svg>, num: "Layer 04 · Reporting", title: "Exportable reports for enterprise compliance", desc: "Enterprises needed documentation for regulatory compliance. Weekly PDF reports with distancing metrics, event logs, and trend lines, added after the first client asked." },
              ].map(l => (
                <FadeIn key={l.num}>
                  <div className="rounded-2xl border border-border bg-card p-5 h-full">
                    <div className="w-8 h-8 rounded-lg bg-muted/60 border border-border flex items-center justify-center mb-4 text-muted-foreground">{l.icon}</div>
                    <p className="text-[9px] font-bold uppercase tracking-[0.2em] text-muted-foreground mb-2">{l.num}</p>
                    <p className="text-[14px] font-medium text-foreground mb-2 leading-snug">{l.title}</p>
                    <p className="text-[13px] text-muted-foreground leading-relaxed">{l.desc}</p>
                  </div>
                </FadeIn>
              ))}
            </div>
          </div>
          <DashboardMockup />
        </div>
      </CsSection>

      <CsSection id="impact" label="Impact" variant="muted">
        <div className="space-y-6">
          <div className="space-y-2">
            <h2 className="text-xl md:text-2xl font-medium text-foreground leading-snug">What the numbers actually say</h2>
            <p className="text-[14px] text-muted-foreground leading-relaxed max-w-xl">
              These are company lifetime numbers, not just my 11 months. The B2B pivot is what generated real revenue, the consumer app validated the concept but couldn&apos;t monetise it.
            </p>
          </div>
          <ImpactMetrics />
        </div>
      </CsSection>

      <CsSection id="reflection" label="Reflection">
        <div className="space-y-10">
          <blockquote className="border-l-2 border-orange-500/60 pl-6 max-w-2xl">
            <p className="text-xl md:text-2xl font-medium text-foreground leading-[1.5]">
              &ldquo;We didn&apos;t fail because we built the wrong product. We built the right product for a temporary world. The lesson isn&apos;t &lsquo;don&apos;t pivot.&rsquo; It&apos;s &lsquo;understand what your market is made of, and whether it exists without the forcing function that created it.&rsquo;&rdquo;
            </p>
          </blockquote>
          <FadeIn>
            <CsDualLineChart
              title="The correlation that ended us"
              description="Our revenue tracked COVID severity, not product quality. When restrictions lifted, revenue fell."
              data={COVID_DUAL_DATA}
              series={[
                { key: "revenue", label: "Revenue (₹L)", color: "rgb(83,74,183)" },
                { key: "covid",   label: "COVID restrictions (%)", color: "rgb(226,75,74)", dashed: true },
              ]}
              annotations={[{ x: "Q4'21", label: "COVID easing begins" }]}
            />
          </FadeIn>
          <ReflectionCards />
        </div>
      </CsSection>

      <CsNextStudies currentHref="/work/citizen-safety" />

    </div>
  )
}
