"use client"

import Image from "next/image"
import { IconArrowRight } from "@tabler/icons-react"
import { Line, LineChart, ResponsiveContainer, XAxis, YAxis } from "recharts"
import { ShaderHaze } from "@/components/shared/shader-haze"
import { cn } from "@/lib/utils"

/**
 * Growth section — a two-column band:
 *  • Left: editorial eyebrow + heading + supporting copy + a single dark CTA.
 *  • Right: a warm ember panel whose background is a live WebGL haze
 *    (reusing <ShaderHaze> with an ember tint over a static gradient base),
 *    with a piece of content floated dead-center. By default that's the
 *    growth card below; pass `imageSrc` to drop an image in instead.
 *
 * The shader is decorative and degrades to a static warm gradient under
 * reduced-motion / no-WebGL (handled inside ShaderHaze).
 */

// Ember tint for the haze (0..1 rgb) — warm orange, matched to the gradient base.
const EMBER_TINT = [0.976, 0.451, 0.086] as const

// Gentle wave that climbs across the years, echoing the reference card.
const SERIES = [
  { year: "2021", v: 26 },
  { year: "2021.5", v: 30 },
  { year: "2022", v: 24 },
  { year: "2022.5", v: 33 },
  { year: "2023", v: 41 },
  { year: "2023.5", v: 37 },
  { year: "2024", v: 58 },
  { year: "2024.5", v: 62 },
  { year: "2025", v: 55 },
  { year: "2025.5", v: 70 },
  { year: "2026", v: 86 },
]

const TICKS = ["2021", "2022", "2023", "2024", "2025", "2026"]

interface GrowthChartProps {
  eyebrow?: string
  title?: string
  description?: string
  ctaLabel?: string
  ctaHref?: string
  /** Drop an image into the center of the ember panel instead of the card. */
  imageSrc?: string
  imageAlt?: string
  className?: string
}

export function GrowthChart({
  eyebrow = "Growth chart",
  title = "Revenue, team, and market expansion",
  description = "A clear view of how structured execution translates into sustainable, measurable growth across revenue, teams, and markets.",
  ctaLabel = "Start a free meeting",
  ctaHref = "#contact",
  imageSrc,
  imageAlt = "",
  className,
}: GrowthChartProps) {
  return (
    <section
      className={cn(
        "relative overflow-hidden bg-background text-foreground",
        className
      )}
    >
      <div className="mx-auto grid max-w-6xl items-center gap-10 px-6 py-20 lg:grid-cols-2 lg:gap-14 lg:py-28">
        {/* ── Left: editorial column ─────────────────────────────────── */}
        <div className="max-w-md">
          <p className="text-[11px] font-medium uppercase tracking-[0.18em] text-muted-foreground">
            {eyebrow}
          </p>

          <h2 className="mt-5 text-4xl font-semibold leading-[1.08] tracking-tight text-balance sm:text-5xl">
            {title}
          </h2>

          <p className="mt-5 text-[15px] leading-relaxed text-muted-foreground text-pretty">
            {description}
          </p>

          <a
            href={ctaHref}
            className="group/cta mt-8 inline-flex items-center gap-2 rounded-full bg-foreground px-5 py-3 text-xs font-medium uppercase tracking-[0.14em] text-background transition-all hover:opacity-90 active:translate-y-px focus-visible:outline-none focus-visible:ring-[3px] focus-visible:ring-ring/50"
          >
            {ctaLabel}
            <IconArrowRight className="size-3.5 transition-transform duration-300 group-hover/cta:translate-x-0.5" />
          </a>
        </div>

        {/* ── Right: ember shader panel with centered content ────────── */}
        <div className="relative aspect-[4/3] w-full overflow-hidden rounded-3xl border border-border/60 shadow-md">
          {/* Static warm gradient base — also the reduced-motion fallback. */}
          <div
            className="absolute inset-0"
            style={{
              backgroundImage:
                "radial-gradient(120% 120% at 80% 20%, #fb923c 0%, #f97316 32%, #fda4af 64%, #fef3e2 100%)",
            }}
          />

          {/* Live drifting haze over the gradient. */}
          <ShaderHaze tint={EMBER_TINT} lightAlpha={0.55} darkAlpha={0.55} speed={0.9} />

          {/* Centered content — image if provided, else the growth card. */}
          <div className="absolute inset-0 grid place-items-center p-6 sm:p-10">
            {imageSrc ? (
              <div className="relative aspect-square w-2/3 overflow-hidden rounded-2xl shadow-lg">
                <Image
                  src={imageSrc}
                  alt={imageAlt}
                  fill
                  className="object-cover"
                  sizes="(max-width: 1024px) 50vw, 33vw"
                />
              </div>
            ) : (
              <GrowthCard />
            )}
          </div>
        </div>
      </div>
    </section>
  )
}

/* The centered glass card — label, headline stat + delta badge, sparkline. */
function GrowthCard() {
  return (
    <div className="w-full max-w-xs rounded-2xl border border-white/60 bg-white/85 p-5 shadow-xl backdrop-blur-sm">
      <p className="text-[11px] font-medium uppercase tracking-[0.16em] text-neutral-500">
        Growth increase
      </p>

      <div className="mt-2 flex items-center gap-2.5">
        <span className="text-4xl font-semibold tracking-tight text-neutral-900">
          99%
        </span>
        <span className="inline-flex items-center rounded-full bg-emerald-100 px-2 py-0.5 text-[11px] font-semibold text-emerald-700">
          +43%
        </span>
      </div>

      <div className="mt-4 h-24 w-full">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={SERIES} margin={{ top: 6, right: 4, bottom: 0, left: 4 }}>
            <XAxis
              dataKey="year"
              ticks={TICKS}
              tick={{ fontSize: 9, fill: "#a3a3a3" }}
              tickLine={false}
              axisLine={false}
              interval={0}
              padding={{ left: 4, right: 4 }}
            />
            <YAxis hide domain={[0, 100]} />
            <Line
              type="monotone"
              dataKey="v"
              stroke="#171717"
              strokeWidth={2}
              dot={false}
              isAnimationActive
              animationDuration={900}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  )
}

export default GrowthChart
