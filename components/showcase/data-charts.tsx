"use client"

import { motion } from "framer-motion"
import {
  Bar,
  BarChart,
  Cell,
  LabelList,
  Pie,
  PieChart,
  PolarAngleAxis,
  PolarGrid,
  Radar,
  RadarChart,
  RadialBar,
  RadialBarChart,
  XAxis,
  YAxis,
} from "recharts"

import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  type ChartConfig,
} from "@/components/ui/chart"
import { cn } from "@/lib/utils"
import { EASE } from "@/lib/motion"

/* ─────────────────────────────────────────────────────────────
   A cohesive, emerald-forward data palette. The system runs on a
   single accent, so rather than a categorical rainbow these are an
   analogous green→teal ramp with one warm sand grace-note — enough
   separation to read distinct series while staying on-brand.
───────────────────────────────────────────────────────────────── */
const C = {
  accent: "var(--accent)",
  teal: "oklch(0.70 0.085 195)",
  moss: "oklch(0.56 0.075 150)",
  sand: "oklch(0.80 0.085 75)",
  stone: "oklch(0.62 0.020 110)",
} as const

const SERIES = [C.accent, C.teal, C.sand, C.moss, C.stone]

const AXIS_TICK = { fontSize: 11, fill: "currentColor", opacity: 0.5 } as const

/* ── Card shell ─────────────────────────────────────────────── */

function ChartCard({
  title,
  subtitle,
  className,
  children,
}: {
  title: string
  subtitle?: string
  className?: string
  children: React.ReactNode
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 14 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-60px" }}
      transition={{ duration: 0.5, ease: EASE }}
      className={cn(
        "flex flex-col rounded-2xl border border-border bg-card p-5",
        "shadow-[0_18px_44px_-30px_rgba(0,0,0,0.45)]",
        className
      )}
    >
      <div className="mb-4">
        <p className="text-sm font-medium text-foreground">{title}</p>
        {subtitle && <p className="mt-0.5 text-xs text-muted-foreground">{subtitle}</p>}
      </div>
      <div className="flex flex-1 flex-col justify-center">{children}</div>
    </motion.div>
  )
}

function Legend({ items }: { items: { label: string; color: string }[] }) {
  return (
    <div className="mt-4 flex flex-wrap items-center justify-center gap-x-4 gap-y-1.5">
      {items.map((it) => (
        <span key={it.label} className="inline-flex items-center gap-1.5 text-xs text-muted-foreground">
          <span className="size-2.5 rounded-[3px]" style={{ background: it.color }} />
          {it.label}
        </span>
      ))}
    </div>
  )
}

/* ── 1 · Radar — target audience ────────────────────────────── */

const RADAR_DATA = [
  { axis: "Jan", value: 186 },
  { axis: "Feb", value: 225 },
  { axis: "Mar", value: 168 },
  { axis: "Apr", value: 241 },
  { axis: "May", value: 209 },
  { axis: "Jun", value: 264 },
]

export function RadarAudience() {
  const config = { value: { label: "Visitors", color: C.accent } } satisfies ChartConfig
  return (
    <ChartCard title="Target audience" subtitle="Total visitors over the last 6 months">
      <ChartContainer config={config} className="mx-auto aspect-square w-full max-h-[230px]">
        <RadarChart data={RADAR_DATA} outerRadius="72%">
          <PolarGrid stroke="currentColor" strokeOpacity={0.12} />
          <PolarAngleAxis dataKey="axis" tick={AXIS_TICK} />
          <ChartTooltip cursor={false} content={<ChartTooltipContent />} />
          <Radar
            dataKey="value"
            stroke={C.accent}
            fill={C.accent}
            fillOpacity={0.22}
            strokeWidth={2}
            dot={{ r: 2.5, fill: C.accent, strokeWidth: 0 }}
          />
        </RadarChart>
      </ChartContainer>
    </ChartCard>
  )
}

/* ── 2 · Mixed horizontal bar — browsers ────────────────────── */

const BROWSER_DATA = [
  { name: "Chrome", value: 1275 },
  { name: "Safari", value: 820 },
  { name: "Firefox", value: 540 },
  { name: "Opera", value: 410 },
  { name: "Edge", value: 305 },
  { name: "Other", value: 190 },
]

export function BarMixed() {
  const config = { value: { label: "Visitors" } } satisfies ChartConfig
  return (
    <ChartCard title="Bar chart — mixed" subtitle="January – June 2024">
      <ChartContainer config={config} className="h-[230px] w-full">
        <BarChart data={BROWSER_DATA} layout="vertical" margin={{ left: 4, right: 28, top: 4, bottom: 4 }}>
          <XAxis type="number" hide />
          <YAxis
            type="category"
            dataKey="name"
            tickLine={false}
            axisLine={false}
            width={58}
            tick={AXIS_TICK}
          />
          <ChartTooltip cursor={{ fill: "currentColor", fillOpacity: 0.04 }} content={<ChartTooltipContent />} />
          <Bar dataKey="value" radius={6} barSize={20}>
            {BROWSER_DATA.map((_, i) => (
              <Cell key={i} fill={SERIES[i % SERIES.length]} />
            ))}
            <LabelList
              dataKey="value"
              position="right"
              offset={8}
              fontSize={11}
              fill="currentColor"
              className="font-mono opacity-70"
            />
          </Bar>
        </BarChart>
      </ChartContainer>
    </ChartCard>
  )
}

/* ── 3 · Pie — browser share ────────────────────────────────── */

const PIE_DATA = [
  { name: "Chrome", value: 58 },
  { name: "Safari", value: 27 },
  { name: "Firefox", value: 15 },
]

export function PieMixed() {
  const config = {
    Chrome: { label: "Chrome", color: SERIES[0] },
    Safari: { label: "Safari", color: SERIES[1] },
    Firefox: { label: "Firefox", color: SERIES[2] },
  } satisfies ChartConfig
  return (
    <ChartCard title="Pie chart — mixed" subtitle="January – June 2024">
      <ChartContainer config={config} className="mx-auto aspect-square w-full max-h-[200px]">
        <PieChart>
          <ChartTooltip cursor={false} content={<ChartTooltipContent nameKey="name" hideLabel />} />
          <Pie
            data={PIE_DATA}
            dataKey="value"
            nameKey="name"
            innerRadius={0}
            outerRadius="90%"
            paddingAngle={2}
            stroke="var(--card)"
            strokeWidth={3}
          >
            {PIE_DATA.map((_, i) => (
              <Cell key={i} fill={SERIES[i]} />
            ))}
          </Pie>
        </PieChart>
      </ChartContainer>
      <Legend items={PIE_DATA.map((d, i) => ({ label: d.name, color: SERIES[i] }))} />
    </ChartCard>
  )
}

/* ── 4 · Stacked bar + legend — desktop / mobile ────────────── */

const STACKED_DATA = [
  { month: "Jan", desktop: 186, mobile: 80 },
  { month: "Feb", desktop: 205, mobile: 110 },
  { month: "Mar", desktop: 167, mobile: 95 },
  { month: "Apr", desktop: 241, mobile: 130 },
  { month: "May", desktop: 209, mobile: 120 },
  { month: "Jun", desktop: 264, mobile: 140 },
]

export function BarStacked() {
  const config = {
    desktop: { label: "Desktop", color: C.accent },
    mobile: { label: "Mobile", color: C.sand },
  } satisfies ChartConfig
  return (
    <ChartCard title="Bar chart — stacked + legend" subtitle="January – June 2024">
      <ChartContainer config={config} className="h-[220px] w-full">
        <BarChart data={STACKED_DATA} margin={{ left: 0, right: 0, top: 8, bottom: 0 }}>
          <XAxis dataKey="month" tickLine={false} axisLine={false} tickMargin={8} tick={AXIS_TICK} />
          <ChartTooltip cursor={{ fill: "currentColor", fillOpacity: 0.04 }} content={<ChartTooltipContent />} />
          <Bar dataKey="desktop" stackId="a" fill={C.accent} radius={[0, 0, 4, 4]} barSize={26} />
          <Bar dataKey="mobile" stackId="a" fill={C.sand} radius={[4, 4, 0, 0]} barSize={26} />
        </BarChart>
      </ChartContainer>
      <Legend
        items={[
          { label: "Desktop", color: C.accent },
          { label: "Mobile", color: C.sand },
        ]}
      />
    </ChartCard>
  )
}

/* ── 5 · Radial gauge (half) — stacked ──────────────────────── */

export function RadialStacked() {
  const data = [{ name: "v", desktop: 1260, mobile: 570 }]
  const total = data[0].desktop + data[0].mobile
  const config = {
    desktop: { label: "Desktop", color: C.accent },
    mobile: { label: "Mobile", color: C.sand },
  } satisfies ChartConfig
  return (
    <ChartCard title="Radial chart — stacked" subtitle="January – June 2024">
      <div className="relative">
        <ChartContainer config={config} className="mx-auto aspect-[2/1.15] w-full max-h-[210px]">
          <RadialBarChart
            data={data}
            startAngle={180}
            endAngle={0}
            innerRadius={86}
            outerRadius={150}
            barSize={20}
          >
            <ChartTooltip cursor={false} content={<ChartTooltipContent hideLabel />} />
            <RadialBar dataKey="desktop" stackId="a" cornerRadius={4} fill={C.accent} className="stroke-card stroke-2" />
            <RadialBar dataKey="mobile" stackId="a" cornerRadius={4} fill={C.sand} className="stroke-card stroke-2" />
          </RadialBarChart>
        </ChartContainer>
        <div className="pointer-events-none absolute inset-x-0 bottom-3 flex flex-col items-center">
          <span className="text-3xl font-semibold tracking-tight text-foreground">
            {total.toLocaleString()}
          </span>
          <span className="text-xs text-muted-foreground">Visitors</span>
        </div>
      </div>
      <Legend
        items={[
          { label: "Desktop", color: C.accent },
          { label: "Mobile", color: C.sand },
        ]}
      />
    </ChartCard>
  )
}

/* ── 6 · Radial gauge (full) — shape ────────────────────────── */

export function RadialShape() {
  const value = 1260
  const max = 1600
  const pct = Math.round((value / max) * 100)
  const data = [{ name: "v", value: pct, fill: C.accent }]
  const config = { value: { label: "Visitors", color: C.accent } } satisfies ChartConfig
  return (
    <ChartCard title="Radial chart — shape" subtitle="January – June 2024">
      <div className="relative">
        <ChartContainer config={config} className="mx-auto aspect-square w-full max-h-[200px]">
          <RadialBarChart
            data={data}
            startAngle={90}
            endAngle={90 - (360 * pct) / 100}
            innerRadius={82}
            outerRadius={128}
            barSize={18}
          >
            <RadialBar
              dataKey="value"
              cornerRadius={10}
              fill={C.accent}
              background={{ className: "fill-muted" }}
            />
          </RadialBarChart>
        </ChartContainer>
        <div className="pointer-events-none absolute inset-0 flex flex-col items-center justify-center">
          <span className="text-3xl font-semibold tracking-tight text-foreground">
            {value.toLocaleString()}
          </span>
          <span className="text-xs text-muted-foreground">Visitors</span>
        </div>
      </div>
    </ChartCard>
  )
}

/* ── 7 · Waffle / dot-grid stat ─────────────────────────────── */

export function WaffleStat({
  percent = 95,
  title = "Bar chart — stacked + legend",
  body = "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt.",
}: {
  percent?: number
  title?: string
  body?: string
}) {
  const filled = Math.round(percent)
  return (
    <ChartCard title={title} subtitle="January – June 2024">
      <div className="grid grid-cols-10 gap-1.5">
        {Array.from({ length: 100 }).map((_, i) => (
          <motion.span
            key={i}
            initial={{ opacity: 0, scale: 0.6 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.3, delay: (i % 10) * 0.012 + Math.floor(i / 10) * 0.02, ease: EASE }}
            className={cn(
              "aspect-square rounded-[3px]",
              i < filled ? "bg-accent" : "bg-foreground/[0.08]"
            )}
          />
        ))}
      </div>
      <p className="mt-5 text-3xl font-semibold tracking-tight text-foreground">{percent}%</p>
      <p className="mt-2 text-xs leading-relaxed text-muted-foreground">{body}</p>
    </ChartCard>
  )
}
