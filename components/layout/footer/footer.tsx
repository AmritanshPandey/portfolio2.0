"use client"

import { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import {
  IconBrandLinkedin,
  IconBrandGithub,
  IconBrandBehance,
  IconBrandDribbble,
  IconArrowUpRight,
  IconCopy,
  IconCheck,
} from "@tabler/icons-react"

// ── Platform data ───────────────────────────────────────────
const PLATFORMS = [
  {
    label:       "Behance",
    handle:      "@amritanshpandey",
    href:        "https://www.behance.net/amritanshpandey",
    icon:        IconBrandBehance,
    description: "Case studies & concept work",
    accent:      "#1769FF",
    accentRgb:   "23,105,255",
  },
  {
    label:       "Dribbble",
    handle:      "@amrit10",
    href:        "https://dribbble.com/amrit10",
    icon:        IconBrandDribbble,
    description: "Visual craft & UI explorations",
    accent:      "#EA4C89",
    accentRgb:   "234,76,137",
  },
  {
    label:       "GitHub",
    handle:      "@AmritanshPandey",
    href:        "https://github.com/AmritanshPandey",
    icon:        IconBrandGithub,
    description: "What I build in public",
    accent:      "currentColor",
    accentRgb:   "100,100,100",
  },
  {
    label:       "LinkedIn",
    handle:      "amritansh-pandey",
    href:        "https://www.linkedin.com/in/amritansh-pandey-bb5b3087",
    icon:        IconBrandLinkedin,
    description: "Professional story & network",
    accent:      "#0A66C2",
    accentRgb:   "10,102,194",
  },
]

// ── Fun status messages that rotate ─────────────────────────
const STATUSES = [
  "Currently designing in Gurgaon ☕",
  "Open to advisory conversations 👋",
  "Building in public 🛠",
  "Thinking about systems again 🧩",
  "Probably in Figma right now 🎨",
]

// ── Copy email button ────────────────────────────────────────
function CopyEmail() {
  const email = "amritansh.pandey6@gmail.com"
  const [copied, setCopied] = useState(false)

  const handleCopy = () => {
    navigator.clipboard.writeText(email)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <button
      onClick={handleCopy}
      className="group flex items-center gap-2 text-sm text-neutral-400 hover:text-white transition-colors duration-200"
    >
      <span>{email}</span>
      <span className="flex items-center justify-center w-5 h-5 rounded-md bg-white/[0.06] group-hover:bg-white/[0.12] transition-colors duration-200">
        <AnimatePresence mode="wait" initial={false}>
          {copied ? (
            <motion.span key="check"
              initial={{ scale: 0.5, opacity: 0 }}
              animate={{ scale: 1,   opacity: 1 }}
              exit={{    scale: 0.5, opacity: 0 }}
              transition={{ duration: 0.14 }}
            >
              <IconCheck size={11} strokeWidth={2.5} className="text-emerald-500" />
            </motion.span>
          ) : (
            <motion.span key="copy"
              initial={{ scale: 0.5, opacity: 0 }}
              animate={{ scale: 1,   opacity: 1 }}
              exit={{    scale: 0.5, opacity: 0 }}
              transition={{ duration: 0.14 }}
            >
              <IconCopy size={11} strokeWidth={2} />
            </motion.span>
          )}
        </AnimatePresence>
      </span>
    </button>
  )
}

// ── Rotating status ──────────────────────────────────────────
function RotatingStatus() {
  const [index, setIndex] = useState(0)

  useEffect(() => {
    const id = setInterval(() => {
      setIndex(i => (i + 1) % STATUSES.length)
    }, 3500)
    return () => clearInterval(id)
  }, [])

  return (
    <div className="flex items-center gap-2 text-xs text-neutral-500">
      {/* Live dot */}
      <span className="relative flex items-center justify-center w-2 h-2">
        <span className="absolute w-full h-full rounded-full bg-emerald-400/40 animate-ping" />
        <span className="relative w-1.5 h-1.5 rounded-full bg-emerald-400" />
      </span>

      <AnimatePresence mode="wait">
        <motion.span
          key={index}
          initial={{ opacity: 0, y: 6  }}
          animate={{ opacity: 1, y: 0  }}
          exit={{    opacity: 0, y: -6 }}
          transition={{ duration: 0.3, ease: "easeOut" }}
          className="inline-block"
        >
          {STATUSES[index]}
        </motion.span>
      </AnimatePresence>
    </div>
  )
}

// ── Platform card ────────────────────────────────────────────
function PlatformCard({ label, handle, href, icon: Icon, description, accent, accentRgb }: typeof PLATFORMS[0]) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className="group relative flex flex-col justify-between p-4 rounded-2xl border border-white/[0.08] bg-white/[0.03] hover:bg-white/[0.06] hover:border-white/[0.15] transition-all duration-300 overflow-hidden"
    >
      {/* Hover accent glow — adapts to theme */}
      <div
        className="pointer-events-none absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-2xl"
        style={{
          background: `radial-gradient(ellipse 80% 60% at 50% 130%, rgba(${accentRgb},0.10), transparent)`,
        }}
      />

      {/* Top row */}
      <div className="relative flex items-start justify-between mb-5">
        {/* Icon box */}
        <div
          className="w-9 h-9 rounded-xl flex items-center justify-center border border-white/[0.10] bg-white/[0.04] transition-all duration-300 group-hover:shadow-[0_0_0_1px_rgba(var(--accent-rgb),0.25)]"
          style={{
            // Use CSS variable for accentRgb to allow group-hover shadow
            ...(accent !== "currentColor" ? { ['--accent-rgb' as any]: accentRgb } : {}),
          }}
        >
          <Icon size={16} stroke={1.75} style={{ color: accent === "currentColor" ? undefined : accent }} />
        </div>

        {/* Arrow */}
        <span
          className="transition-transform duration-200 group-hover:translate-x-[1.5px] group-hover:-translate-y-[1.5px]"
        >
          <IconArrowUpRight
            size={14}
            stroke={2}
            className="text-neutral-700 group-hover:text-neutral-300 transition-colors duration-200"
          />
        </span>
      </div>

      {/* Bottom */}
      <div className="relative">
        <p className="text-sm font-medium text-white/80 group-hover:text-white transition-colors duration-200 mb-0.5">
          {label}
        </p>
        <p className="text-[11px] text-neutral-600 group-hover:text-neutral-400 transition-colors duration-200 leading-snug">
          {description}
        </p>
        {/* Handle fades in on hover */}
        <span
          className="text-[10px] mt-1.5 font-mono opacity-0 group-hover:opacity-100 translate-y-1 group-hover:translate-y-0 transition-all duration-200"
          style={{ color: accent === "currentColor" ? undefined : accent }}
        >
          {handle}
        </span>
      </div>
    </a>
  )
}

// ── Footer ───────────────────────────────────────────────────
export default function Footer() {
  return (
    <footer className="relative overflow-hidden
      bg-neutral-950 text-neutral-400
    ">
      {/* Noise texture */}
      <div
        className="pointer-events-none absolute inset-0 opacity-[0.045]"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)'/%3E%3C/svg%3E")`,
          backgroundSize: "128px 128px",
        }}
      />

      {/* Orange bloom — top left */}
      <div
        className="pointer-events-none absolute -top-40 -left-40 w-[520px] h-[520px] rounded-full"
        style={{ background: "radial-gradient(circle, rgba(232,98,26,0.12) 0%, transparent 65%)" }}
      />



      {/* Top gradient border */}
      <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-white/[0.12] to-transparent" />

      <div className="max-w-6xl mx-auto px-6 pt-14 md:pt-20 pb-8">

        {/* ── TOP — statement + status ──────────────── */}
        <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-6 mb-12">

          <div className="max-w-lg">
            <p className="text-xl md:text-2xl font-medium text-white leading-snug tracking-tight mb-3">
              Designing products at the intersection of{" "}
              <span className="text-neutral-500">strategy, systems,</span>{" "}
              and technology.
            </p>
            <RotatingStatus />
          </div>

          {/* Contact */}
          <div className="flex flex-col gap-2 text-sm md:items-end">
            <CopyEmail />
            <a
              href="tel:+918130513047"
              className="hover:text-white transition-colors duration-200"
            >
              +91 8130513047
            </a>
            <span className="text-neutral-700 text-xs">Gurgaon, India</span>
          </div>

        </div>

        {/* ── PLATFORMS ─────────────────────────────── */}
        <div className="mb-10">
          <p className="text-[10px] font-medium uppercase tracking-[0.20em] text-neutral-600 mb-4">
            Find me on
          </p>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            {PLATFORMS.map(p => <PlatformCard key={p.label} {...p} />)}
          </div>
        </div>

        {/* ── DIVIDER ───────────────────────────────── */}
        <div className="h-px w-full bg-gradient-to-r from-transparent via-white/[0.08] to-transparent mb-6" />

        {/* ── BOTTOM ────────────────────────────────── */}
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-2 text-xs text-neutral-700">
          <p>© {new Date().getFullYear()} Amritansh Pandey. All rights reserved.</p>
          <p className="hover:text-muted-foreground transition-colors duration-300 cursor-default">
            Built with precision ✦
          </p>
        </div>

      </div>

    </footer>
  )
}