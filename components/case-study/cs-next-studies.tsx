"use client"

import Link from "next/link"
import { motion } from "framer-motion"
import { IconArrowUpRight, IconArrowRight } from "@tabler/icons-react"
import { workItems } from "@/lib/data"
import type { WorkItem } from "@/lib/types/content"

// ─── CARD COMPONENTS ─────────────────────────────────────────────────────────

function PrimaryCard({ item, index }: { item: WorkItem; index: number }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-40px" }}
      transition={{ duration: 0.55, delay: index * 0.08, ease: [0.22, 1, 0.36, 1] }}
    >
      <Link href={item.href} className="group block h-full">
        <div className="
          relative h-full rounded-2xl border border-white/[0.08] bg-white/[0.02]
          p-8 flex flex-col gap-6 overflow-hidden
          transition-all duration-500 ease-out
          hover:border-orange-500/30
          hover:-translate-y-[3px]
          hover:shadow-[0_24px_60px_rgba(0,0,0,0.5)]
        ">
          {/* Hover glow */}
          <div className="
            pointer-events-none absolute inset-0
            opacity-0 group-hover:opacity-100 transition-opacity duration-500
            bg-[radial-gradient(420px_280px_at_0%_100%,rgba(249,115,22,0.10),transparent_65%)]
          " />
          {/* Top edge */}
          <div className="
            pointer-events-none absolute inset-x-0 top-0 h-px
            bg-gradient-to-r from-transparent via-white/10 to-transparent
            group-hover:via-orange-500/20 transition-all duration-500
          " />

          {/* Index */}
          <p className="font-mono text-[11px] tracking-[0.12em] text-orange-500/70">
            {String(index + 1).padStart(2, "0")}
          </p>

          {/* Category + title */}
          <div className="flex flex-col gap-3 flex-1">
            <p className="text-[10px] font-semibold uppercase tracking-[0.22em] text-neutral-500">
              {item.category}
            </p>
            <h3 className="
              text-[22px] md:text-[26px] font-semibold text-white leading-[1.15] tracking-tight
              group-hover:text-orange-50 transition-colors duration-300
            ">
              {item.title}
            </h3>
            {item.description && (
              <p className="text-[14px] text-neutral-500 leading-relaxed line-clamp-2 group-hover:text-neutral-400 transition-colors duration-300">
                {item.description}
              </p>
            )}
          </div>

          {/* Metric */}
          {item.metric && (
            <p className="text-[11px] font-medium text-orange-400/70 border-l-2 border-orange-500/30 pl-3 leading-relaxed">
              {item.metric}
            </p>
          )}

          {/* CTA */}
          <div className="flex items-center justify-between pt-5 border-t border-white/[0.07] group-hover:border-orange-500/20 transition-colors duration-300">
            <span className="
              text-[13px] font-medium text-neutral-400
              group-hover:text-orange-400 transition-colors duration-300
              group-hover:translate-x-[3px] transition-transform
            ">
              Read case study
            </span>
            <span className="
              w-9 h-9 rounded-full border border-white/[0.08] flex items-center justify-center
              group-hover:border-orange-500/40 group-hover:bg-orange-500/10
              transition-all duration-300
            ">
              <IconArrowUpRight
                size={15}
                stroke={2}
                className="text-neutral-600 group-hover:text-orange-400 group-hover:-translate-y-[2px] group-hover:translate-x-[2px] transition-all duration-300"
              />
            </span>
          </div>
        </div>
      </Link>
    </motion.div>
  )
}

function SecondaryCard({ item, index }: { item: WorkItem; index: number }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-40px" }}
      transition={{ duration: 0.5, delay: index * 0.08, ease: [0.22, 1, 0.36, 1] }}
      className="flex-1"
    >
      <Link href={item.href} className="group block h-full">
        <div className="
          relative h-full rounded-2xl border border-white/[0.07] bg-white/[0.015]
          p-6 flex flex-col gap-4 overflow-hidden
          transition-all duration-400 ease-out
          hover:border-orange-500/25
          hover:-translate-y-[2px]
          hover:shadow-[0_16px_40px_rgba(0,0,0,0.4)]
        ">
          <div className="
            pointer-events-none absolute inset-0
            opacity-0 group-hover:opacity-100 transition-opacity duration-400
            bg-[radial-gradient(280px_200px_at_0%_100%,rgba(249,115,22,0.07),transparent)]
          " />

          <div className="flex items-start justify-between">
            <p className="font-mono text-[10px] tracking-[0.12em] text-orange-500/60">
              {String(index + 1).padStart(2, "0")}
            </p>
            <IconArrowUpRight
              size={14}
              stroke={2}
              className="text-neutral-700 group-hover:text-orange-400 group-hover:-translate-y-[2px] group-hover:translate-x-[2px] transition-all duration-300 shrink-0"
            />
          </div>

          <div className="flex flex-col gap-2 flex-1">
            <p className="text-[9.5px] font-semibold uppercase tracking-[0.2em] text-neutral-600">
              {item.category}
            </p>
            <h3 className="
              text-[15px] font-semibold text-white/85 leading-snug tracking-tight
              group-hover:text-white transition-colors duration-300
            ">
              {item.title}
            </h3>
          </div>

          {item.metric && (
            <p className="text-[11px] text-neutral-600 group-hover:text-orange-400/60 transition-colors duration-300 leading-relaxed">
              {item.metric}
            </p>
          )}
        </div>
      </Link>
    </motion.div>
  )
}

// ─── MAIN COMPONENT ──────────────────────────────────────────────────────────

export function CsNextStudies({ currentHref }: { currentHref: string }) {
  const others = workItems
    .sort((a, b) => {
      if (a.tier !== b.tier) return a.tier === "flagship" ? -1 : 1
      return a.order - b.order
    })
    .filter(item => item.href !== currentHref)
    .slice(0, 3)

  if (others.length === 0) return null

  const [primary, ...rest] = others

  return (
    <section className="relative overflow-hidden bg-neutral-950">
      {/* Noise */}
      <div
        className="pointer-events-none absolute inset-0 opacity-[0.035]"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)'/%3E%3C/svg%3E")`,
          backgroundSize: "128px 128px",
        }}
      />
      {/* Ambient glow */}
      <div className="pointer-events-none absolute top-0 right-0 w-[600px] h-[500px]
        bg-[radial-gradient(closest-side,rgba(249,115,22,0.08),transparent_70%)]" />
      {/* Top border */}
      <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-white/[0.10] to-transparent" />

      <div className="relative max-w-[1000px] mx-auto px-6 py-20 md:py-28">

        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-40px" }}
          transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
          className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4 mb-12"
        >
          <div>
            <p className="font-mono text-[10px] uppercase tracking-[0.24em] text-neutral-600 mb-3">
              Keep reading
            </p>
            <h2 className="text-3xl md:text-4xl font-semibold text-white tracking-[-0.03em] leading-[0.96]">
              More work worth reading.
            </h2>
          </div>
          <Link
            href="/#work"
            className="flex items-center gap-2 text-[13px] text-neutral-500 hover:text-neutral-300 transition-colors duration-200 whitespace-nowrap"
          >
            All case studies
            <IconArrowRight size={13} strokeWidth={2} />
          </Link>
        </motion.div>

        {/* Cards */}
        {rest.length === 0 ? (
          /* Single item — full width */
          <PrimaryCard item={primary} index={0} />
        ) : rest.length === 1 ? (
          /* Two items — equal split */
          <div className="grid md:grid-cols-2 gap-5">
            <PrimaryCard item={primary} index={0} />
            <PrimaryCard item={rest[0]} index={1} />
          </div>
        ) : (
          /* Three items — large primary + stacked secondaries */
          <div className="grid md:grid-cols-[1fr_280px] gap-5 items-stretch">
            <PrimaryCard item={primary} index={0} />
            <div className="flex flex-col gap-5">
              {rest.map((item, i) => (
                <SecondaryCard key={item.href} item={item} index={i + 1} />
              ))}
            </div>
          </div>
        )}

      </div>
    </section>
  )
}
