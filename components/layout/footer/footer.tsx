"use client"

import { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import Link from "next/link"
import {
  IconBrandLinkedin,
  IconBrandGithub,
  IconBrandBehance,
  IconBrandDribbble,
  IconArrowUpRight,
  IconArrowRight,
  IconCopy,
  IconCheck,
} from "@tabler/icons-react"

// ── Platform data ───────────────────────────────────────────
const PLATFORMS = [
  {
    label:       "Behance",
    handle:      "amritanshpandey",
    href:        "https://www.behance.net/amritanshpandey",
    icon:        IconBrandBehance,
    description: "Case studies & concept work",
    accent:      "#1769FF",
    accentBg:    "rgba(23,105,255,0.08)",
  },
  {
    label:       "Dribbble",
    handle:      "amrit10",
    href:        "https://dribbble.com/amrit10",
    icon:        IconBrandDribbble,
    description: "Visual craft & UI explorations",
    accent:      "#EA4C89",
    accentBg:    "rgba(234,76,137,0.08)",
  },
  {
    label:       "GitHub",
    handle:      "AmritanshPandey",
    href:        "https://github.com/AmritanshPandey",
    icon:        IconBrandGithub,
    description: "What I build in public",
    accent:      "#6e7681",
    accentBg:    "rgba(110,118,129,0.08)",
  },
  {
    label:       "LinkedIn",
    handle:      "amritansh-pandey",
    href:        "https://www.linkedin.com/in/amritansh-pandey-bb5b3087",
    icon:        IconBrandLinkedin,
    description: "Professional story & network",
    accent:      "#0A66C2",
    accentBg:    "rgba(10,102,194,0.08)",
  },
]

// ── Rotating status ──────────────────────────────────────────
const STATUSES = [
  "Currently designing in Gurgaon ☕",
  "Open to advisory conversations 👋",
  "Building in public 🛠",
  "Thinking about systems again 🧩",
  "Probably in Figma right now 🎨",
]

function RotatingStatus() {
  const [index, setIndex] = useState(0)

  useEffect(() => {
    const id = setInterval(() => {
      setIndex(i => (i + 1) % STATUSES.length)
    }, 3500)
    return () => clearInterval(id)
  }, [])

  return (
    <div className="flex items-center gap-2 text-xs text-muted-foreground">
      <span className="relative flex items-center justify-center w-2 h-2 shrink-0">
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

// ── Copy email ───────────────────────────────────────────────
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
      className="
        group flex items-center gap-2.5 px-4 py-2.5 rounded-xl
        bg-card border border-border
        text-sm font-medium text-foreground
        hover:border-accent/40 hover:bg-card
        transition-all duration-200
      "
    >
      <span className="text-muted-foreground group-hover:text-foreground transition-colors duration-200">
        {email}
      </span>
      <span className="flex items-center justify-center w-5 h-5 rounded-md bg-muted border border-border group-hover:border-accent/30 transition-colors duration-200">
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
              <IconCopy size={11} strokeWidth={2} className="text-muted-foreground" />
            </motion.span>
          )}
        </AnimatePresence>
      </span>
    </button>
  )
}

// ── Footer ───────────────────────────────────────────────────
export default function Footer() {
  return (
    <footer className="relative overflow-hidden bg-muted dark:bg-neutral-950 border-t border-border">

      {/* Noise texture */}
      <div
        className="pointer-events-none absolute inset-0 opacity-[0.015] dark:opacity-[0.04]"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)'/%3E%3C/svg%3E")`,
          backgroundSize: "128px 128px",
        }}
      />

      {/* Ambient glow */}
      <div
        className="pointer-events-none absolute top-0 right-0 w-[500px] h-[400px]"
        style={{ background: "radial-gradient(circle, rgba(249,115,22,0.04) 0%, transparent 65%)" }}
      />
      <div
        className="pointer-events-none absolute top-0 right-0 w-[500px] h-[400px] hidden dark:block"
        style={{ background: "radial-gradient(circle, rgba(249,115,22,0.12) 0%, transparent 65%)" }}
      />

      <div className="relative max-w-6xl mx-auto px-6">

        {/* ── CTA BLOCK ─────────────────────────────── */}
        <div className="py-16 md:py-20 flex flex-col md:flex-row md:items-center md:justify-between gap-8">
          <div className="max-w-lg">
            <h2 className="text-3xl md:text-4xl font-semibold text-foreground tracking-tight leading-[1.1] mb-3">
              Always interested in interesting problems.
            </h2>
            <p className="text-[15px] text-muted-foreground leading-relaxed">
              If something here resonated, or you want to talk design, systems, or product, I&apos;m easy to reach.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3 shrink-0">
            <CopyEmail />
            <Link
              href="/#work"
              className="
                flex items-center gap-2 px-4 py-2.5 rounded-xl
                text-sm font-medium
                text-accent
                hover:text-accent
                transition-colors duration-200
              "
            >
              View work
              <IconArrowRight size={14} strokeWidth={2} />
            </Link>
          </div>
        </div>

        {/* ── DIVIDER ───────────────────────────────── */}
        <div className="h-px w-full bg-gradient-to-r from-transparent via-border to-transparent" />

        {/* ── PLATFORM CARDS ────────────────────────── */}
        <div className="py-12">
          <p className="text-[10px] font-medium uppercase tracking-[0.22em] text-muted-foreground/60 mb-6">
            Find me on
          </p>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            {PLATFORMS.map(({ label, href, icon: Icon, description, accent, accentBg }) => (
              <a
                key={label}
                href={href}
                target="_blank"
                rel="noopener noreferrer"
                className="
                  group relative flex flex-col justify-between p-4 rounded-2xl
                  border border-border bg-card
                  hover:border-border/80 dark:hover:border-white/[0.12]
                  hover:bg-accent/20 dark:hover:bg-white/[0.05]
                  transition-all duration-300 overflow-hidden
                "
              >
                {/* Hover accent glow */}
                <div
                  className="pointer-events-none absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-2xl"
                  style={{ background: `radial-gradient(ellipse 80% 60% at 50% 120%, ${accentBg}, transparent)` }}
                />

                {/* Top row — icon + arrow */}
                <div className="relative flex items-start justify-between mb-4">
                  <div
                    className="w-8 h-8 rounded-xl flex items-center justify-center transition-all duration-300"
                    style={{ background: accentBg }}
                  >
                    <Icon
                      size={16}
                      strokeWidth={1.75}
                      style={{ color: accent }}
                    />
                  </div>
                  <IconArrowUpRight
                    size={14}
                    strokeWidth={2}
                    className="text-muted-foreground/30 group-hover:text-muted-foreground transition-all duration-200 group-hover:translate-x-[1px] group-hover:-translate-y-[1px]"
                  />
                </div>

                {/* Bottom — label + description */}
                <div className="relative">
                  <p className="text-sm font-medium text-foreground/80 group-hover:text-foreground transition-colors duration-200 mb-0.5">
                    {label}
                  </p>
                  <p className="text-[11px] text-muted-foreground/50 group-hover:text-muted-foreground transition-colors duration-200 leading-snug">
                    {description}
                  </p>
                </div>
              </a>
            ))}
          </div>
        </div>

        {/* ── DIVIDER ───────────────────────────────── */}
        <div className="h-px w-full bg-gradient-to-r from-transparent via-border to-transparent" />

        {/* ── BOTTOM BAR ────────────────────────────── */}
        <div className="py-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">

          <RotatingStatus />

          <div className="flex items-center gap-4 text-xs text-muted-foreground">
            <span>© {new Date().getFullYear()} Amritansh Pandey</span>
            <span className="w-px h-3 bg-border" />
            <span className="hover:text-foreground transition-colors duration-200 cursor-default">
              Built to think out loud.
            </span>
          </div>

        </div>

      </div>
    </footer>
  )
}
