"use client"

import {
  IconBrandLinkedin,
  IconBrandGithub,
  IconBrandBehance,
  IconBrandDribbble,
  IconArrowUpRight,
} from "@tabler/icons-react"

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
    accent:      "#ffffff",
    accentBg:    "rgba(255,255,255,0.06)",
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

export default function Footer() {
  return (
    <footer className="bg-[#0a0a0a] text-neutral-400">

      <div className="max-w-6xl mx-auto px-6 pt-16 md:pt-20 pb-10">

        {/* ── PLATFORM CARDS ────────────────────────── */}
        <div className="mb-14">
          <p className="text-[10px] font-medium uppercase tracking-[0.22em] text-neutral-600 mb-6">
            More of my work
          </p>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            {PLATFORMS.map(({ label, handle, href, icon: Icon, description, accent, accentBg }) => (
              <a
                key={label}
                href={href}
                target="_blank"
                rel="noopener noreferrer"
                className="group relative flex flex-col justify-between p-4 rounded-2xl border border-white/[0.07] bg-white/[0.02] hover:bg-white/[0.05] hover:border-white/[0.12] transition-all duration-300 overflow-hidden"
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
                      stroke={1.75}
                      style={{ color: accent }}
                    />
                  </div>
                  <IconArrowUpRight
                    size={14}
                    stroke={2}
                    className="text-neutral-700 group-hover:text-neutral-300 transition-all duration-200 group-hover:translate-x-[1px] group-hover:-translate-y-[1px]"
                  />
                </div>

                {/* Bottom — label + description */}
                <div className="relative">
                  <p className="text-sm font-medium text-white/80 group-hover:text-white transition-colors duration-200 mb-0.5">
                    {label}
                  </p>
                  <p className="text-[11px] text-neutral-600 group-hover:text-neutral-400 transition-colors duration-200 leading-snug">
                    {description}
                  </p>
                </div>

              </a>
            ))}
          </div>
        </div>

        {/* ── STATEMENT + CONTACT ───────────────────── */}
        <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-8 mb-10">

          <p className="text-xl md:text-2xl text-white leading-snug tracking-tight max-w-md">
            Designing products at the intersection of strategy, systems, and technology.
          </p>

          <div className="flex flex-col gap-2 text-sm md:items-end">
            <a
              href="mailto:amritansh.pandey6@gmail.com"
              className="hover:text-white transition-colors duration-200"
            >
              amritansh.pandey6@gmail.com
            </a>
            <a
              href="tel:+918130513047"
              className="hover:text-white transition-colors duration-200"
            >
              +91 8130513047
            </a>
            <span className="text-neutral-600">Gurgaon, India</span>
          </div>

        </div>

        {/* ── DIVIDER ───────────────────────────────── */}
        <div className="h-px w-full bg-gradient-to-r from-transparent via-white/[0.08] to-transparent mb-8" />

        {/* ── BOTTOM ────────────────────────────────── */}
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-2 text-xs text-neutral-700">
          <p>© {new Date().getFullYear()} Amritansh Pandey. All rights reserved.</p>
          <p>Built with precision</p>
        </div>

      </div>

    </footer>
  )
}