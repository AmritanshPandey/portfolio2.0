import type { ReactNode } from "react"
import clsx from "clsx"
import { drorRevenueVsRestrictions } from "@/lib/data/dror"

/**
 * Work specimens: one small, code-drawn diagram per case study.
 *
 * The case-study images are abstract gradients, so putting them in front of
 * each row would decorate the index without showing any work. Each specimen
 * instead draws the core mechanism of its project from content that already
 * lives in that case study, and hovering (or focusing) the row runs the
 * mechanism. The resting state is designed to read on its own, because touch
 * devices never hover.
 *
 * Every mechanism transition is keyed off the `row-on` variant, declared in
 * globals.css, which covers both hover and keyboard focus on `.work-row`.
 * All specimens are decorative (aria-hidden): the row's text carries the
 * meaning.
 */

const EASE = "ease-[cubic-bezier(0.19,1,0.22,1)] motion-reduce:transition-none"

function Frame({ children, className }: { children: ReactNode; className?: string }) {
  return (
    <div
      aria-hidden
      className={clsx(
        "@container relative aspect-[16/10] w-full overflow-hidden rounded-xl bg-card",
        "ring-1 ring-foreground/[0.08] dark:ring-white/[0.07]",
        className
      )}
    >
      {children}
    </div>
  )
}

/* ── PartnerBank: one component, three brand skins ───────────────────────── */

const BANKS = [
  // The case study's own anonymised prospects and token colours.
  { name: "Heritage Trust", num: "9120", type: "Private credit", from: "#D4A24C", to: "#8B6508" },
  { name: "North Bank", num: "4287", type: "Premier debit", from: "#F43F5E", to: "#9F1239" },
  { name: "Verde Bank", num: "7503", type: "Everyday debit", from: "#4DA88A", to: "#2F6F5A" },
]

// Resting: stacked like a hand of cards, held large so the hand fills the
// frame. Active: dealt into a row at true size, which needs the width back.
const BANK_POSE = [
  "z-10 -translate-x-[18%] -translate-y-[8%] -rotate-[7deg] row-on:-translate-x-[108%] row-on:translate-y-0 row-on:rotate-0",
  "z-30 translate-y-[7%] row-on:translate-y-0",
  "z-20 translate-x-[18%] -translate-y-[10%] rotate-[6deg] row-on:translate-x-[108%] row-on:translate-y-0 row-on:rotate-0",
]

function TokensSpecimen() {
  return (
    <Frame>
      <div className="absolute inset-0 flex items-center justify-center">
        {BANKS.map((b, i) => (
          <div
            key={b.name}
            className={clsx(
              "absolute flex aspect-[1.586] w-[28%] flex-col justify-between overflow-hidden rounded-[1.4cqw] p-[2.2cqw] text-white",
              "shadow-[0_1.6cqw_3.2cqw_-1cqw_rgba(0,0,0,0.45)]",
              "scale-[1.42] row-on:scale-100 transition-[translate,rotate,scale] duration-[900ms]",
              EASE,
              BANK_POSE[i]
            )}
            style={{ background: `linear-gradient(135deg, ${b.from}, ${b.to})` }}
          >
            <span
              className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_78%_12%,rgba(255,255,255,0.22),transparent_58%)]"
            />
            <div className="relative flex items-start justify-between">
              <span className="text-[1.75cqw] font-medium leading-none">{b.name}</span>
              <span className="h-[2.3cqw] w-[3.2cqw] rounded-[0.4cqw] bg-white/30" />
            </div>
            <div className="relative">
              <p className="text-[1.9cqw] tabular-nums leading-none tracking-[0.08em]">
                •••• {b.num}
              </p>
              <p className="mt-[0.9cqw] text-[max(1.35cqw,6px)] leading-none text-white/75">{b.type}</p>
            </div>
          </div>
        ))}
      </div>
    </Frame>
  )
}

/* ── Honasa: three brands on one shared backbone ─────────────────────────── */

const STORES = [
  { name: "Mamaearth", color: "#00AFEF" },
  { name: "The Derma Co.", color: "#217A6E" },
  { name: "Aqualogica", color: "#0066CC" },
]

function BackboneSpecimen() {
  // The skeleton is the shared system: identical in all three storefronts.
  // Activating the row lights it up everywhere at once, one brand after the
  // other, while each brand's own colour stays put.
  // The per-storefront stagger comes from inline transitionDelay on each bone.
  const bone = clsx(
    "rounded-full bg-foreground/[0.12] transition-colors duration-500 row-on:bg-accent/70",
    EASE
  )

  return (
    <Frame>
      <div className="absolute inset-0 flex items-center justify-center gap-[3.5cqw]">
        {STORES.map((s, i) => (
          <div
            key={s.name}
            className={clsx(
              "flex aspect-[9/16] w-[23%] flex-col overflow-hidden rounded-[1.4cqw] bg-background p-[1.4cqw]",
              "ring-1 ring-foreground/[0.1] transition-shadow duration-500 row-on:ring-accent/55 dark:ring-white/[0.09]",
              EASE
            )}
            style={{ transitionDelay: `${i * 90}ms` }}
          >
            <p className="truncate text-[max(1.45cqw,8px)] font-medium leading-none text-foreground/75">
              {s.name}
            </p>
            <div
              className="mt-[1.2cqw] flex aspect-[4/3] items-center justify-center rounded-[0.9cqw]"
              style={{ background: `linear-gradient(145deg, ${s.color}, color-mix(in srgb, ${s.color} 55%, #000))` }}
            >
              <span className="h-[5.5cqw] w-[5.5cqw] rounded-full bg-white/25 ring-1 ring-white/40" />
            </div>
            <div className="mt-[1.6cqw] space-y-[1cqw]">
              <div className={clsx("h-[1cqw] w-[85%]", bone)} style={{ transitionDelay: `${i * 90}ms` }} />
              <div className={clsx("h-[1cqw] w-[60%]", bone)} style={{ transitionDelay: `${i * 90 + 40}ms` }} />
              <div className={clsx("h-[1cqw] w-[72%]", bone)} style={{ transitionDelay: `${i * 90 + 80}ms` }} />
            </div>
            <div className="mt-auto flex items-center justify-between gap-[1cqw]">
              <div className={clsx("h-[1cqw] w-[30%]", bone)} style={{ transitionDelay: `${i * 90 + 120}ms` }} />
              <span className="h-[3.2cqw] w-[48%] rounded-[0.7cqw]" style={{ background: s.color }} />
            </div>
          </div>
        ))}
      </div>
    </Frame>
  )
}

/* ── Dror: revenue tracked the pandemic, not the product ─────────────────── */

function PivotSpecimen() {
  const data = drorRevenueVsRestrictions
  const W = 320
  const H = 200
  const left = 18
  const right = W - 18
  const top = 38
  const base = H - 34
  const maxRev = Math.max(...data.map((d) => d.revenue))
  const maxCovid = Math.max(...data.map((d) => d.covid))
  const x = (i: number) => left + (i * (right - left)) / (data.length - 1)
  // Both series share one vertical scale, normalised to their own peak, so the
  // reader compares shape and timing rather than units.
  const y = (v: number, max: number) => base - (v / max) * (base - top)
  const line = (key: "revenue" | "covid", max: number) =>
    data.map((d, i) => `${i ? "L" : "M"}${x(i).toFixed(1)} ${y(d[key], max).toFixed(1)}`).join(" ")

  const revenue = line("revenue", maxRev)
  const covid = line("covid", maxCovid)
  const area = `${revenue} L${right} ${base} L${left} ${base} Z`
  const peak = data.findIndex((d) => d.revenue === maxRev)

  return (
    <Frame>
      <svg viewBox={`0 0 ${W} ${H}`} className="absolute inset-0 h-full w-full" preserveAspectRatio="xMidYMid meet">
        <defs>
          <linearGradient id="dror-area" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="var(--accent)" stopOpacity="0.22" />
            <stop offset="100%" stopColor="var(--accent)" stopOpacity="0" />
          </linearGradient>
        </defs>

        {/* Legend */}
        <g fontSize="8.5" className="fill-muted-foreground">
          <line x1={left} y1="16" x2={left + 14} y2="16" stroke="var(--accent)" strokeWidth="2" />
          <text x={left + 19} y="19">Revenue</text>
          <line
            x1={left + 64} y1="16" x2={left + 78} y2="16"
            className="stroke-foreground/40" strokeWidth="1.5" strokeDasharray="3 3"
          />
          <text x={left + 83} y="19">COVID restrictions</text>
        </g>

        <line x1={left} y1={base} x2={right} y2={base} className="stroke-foreground/15" strokeWidth="1" />

        {/* Where the market started to disappear */}
        {/* Label sits above the peak, clear of the dot and both lines. */}
        <line
          x1={x(peak)} y1={top - 4} x2={x(peak)} y2={base}
          className="stroke-foreground/20" strokeWidth="1" strokeDasharray="2 3"
        />
        <text x={x(peak) + 6} y={top - 8} fontSize="8" className="fill-muted-foreground">
          Restrictions ease
        </text>

        <path d={area} fill="url(#dror-area)" />
        <path
          d={covid}
          fill="none"
          className="stroke-foreground/35"
          strokeWidth="1.5"
          strokeDasharray="4 4"
        />
        <path
          d={revenue}
          pathLength={1}
          fill="none"
          stroke="var(--accent)"
          strokeWidth="2.25"
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeDasharray="1"
          className="row-on:animate-[work-draw_1.5s_cubic-bezier(0.19,1,0.22,1)] motion-reduce:animate-none"
        />
        <circle cx={x(peak)} cy={y(maxRev, maxRev)} r="3.25" fill="var(--accent)" />

        <g fontSize="8" className="fill-muted-foreground">
          <text x={left} y={base + 14}>{data[0].label.replace("'", " '")}</text>
          <text x={right} y={base + 14} textAnchor="end">{data[data.length - 1].label.replace("'", " '")}</text>
        </g>
      </svg>
    </Frame>
  )
}

/* ── Email Builder: an email is a stack of governed components ───────────── */

const BLOCKS = ["Hero", "Editorial", "Call to action", "Legal footer"]

function EmailSpecimen() {
  // Activating the row pulls the assembled email apart into its components,
  // and the matching entries in the library light up.
  // The gaps between components widen, so the email card itself grows and
  // stays centred rather than having its blocks slide out past its edge.
  const part = clsx(
    "transition-[margin,outline-color] duration-700 outline-1 outline-dashed outline-offset-[0.4cqw] outline-transparent",
    "row-on:outline-accent/60",
    EASE
  )

  return (
    <Frame>
      <div className="absolute inset-0 flex items-center justify-center gap-[6cqw] px-[7cqw]">
        {/* Component library */}
        <ul className="w-[30%] space-y-[1.4cqw]">
          {BLOCKS.map((name, i) => (
            <li
              key={name}
              className={clsx(
                "flex items-center gap-[1.3cqw] rounded-[1cqw] bg-foreground/[0.06] px-[1.6cqw] py-[1.4cqw] text-[max(1.9cqw,8.5px)] leading-none text-foreground/70",
                "ring-1 ring-foreground/[0.09] transition-[color,box-shadow] duration-500 row-on:text-foreground row-on:ring-accent/55",
                EASE
              )}
              style={{ transitionDelay: `${i * 70}ms` }}
            >
              <span className="h-[1.6cqw] w-[1.6cqw] shrink-0 rounded-[0.4cqw] bg-foreground/20" />
              {name}
            </li>
          ))}
        </ul>

        {/* The assembled, 600px-wide email */}
        <div className="flex w-[44%] flex-col rounded-[1.2cqw] bg-background p-[1.8cqw] ring-1 ring-foreground/[0.1] dark:ring-white/[0.09]">
          <div className={clsx(part, "rounded-[0.8cqw]")} >
            <div className="mb-[1.3cqw] h-[1.3cqw] w-[26%] rounded-full bg-foreground/25" />
            <div className="flex h-[14cqw] flex-col justify-end gap-[1cqw] rounded-[0.8cqw] bg-accent/80 p-[1.8cqw]">
              <div className="h-[1.6cqw] w-[72%] rounded-full bg-white/85" />
              <div className="h-[1.1cqw] w-[46%] rounded-full bg-white/60" />
            </div>
          </div>
          <div className={clsx(part, "mt-[1.8cqw] row-on:mt-[3.6cqw] space-y-[1cqw] rounded-[0.8cqw]")}>
            <div className="h-[1.1cqw] w-full rounded-full bg-foreground/15" />
            <div className="h-[1.1cqw] w-[94%] rounded-full bg-foreground/15" />
            <div className="h-[1.1cqw] w-[88%] rounded-full bg-foreground/15" />
            <div className="h-[1.1cqw] w-[58%] rounded-full bg-foreground/15" />
          </div>
          <div className={clsx(part, "mt-[2cqw] row-on:mt-[3.8cqw] rounded-full")}>
            <div className="mx-auto h-[3.8cqw] w-[48%] rounded-full bg-foreground/85" />
          </div>
          <div className={clsx(part, "mt-[2.2cqw] row-on:mt-[4cqw] space-y-[0.8cqw] rounded-[0.8cqw] border-t border-foreground/10 pt-[1.6cqw]")}>
            <div className="h-[0.8cqw] w-[82%] rounded-full bg-foreground/12" />
            <div className="h-[0.8cqw] w-[56%] rounded-full bg-foreground/12" />
          </div>
        </div>
      </div>
    </Frame>
  )
}

/* ── Registry ────────────────────────────────────────────────────────────── */

const SPECIMENS: Record<string, () => React.JSX.Element> = {
  "white-label-rfp": TokensSpecimen,
  "d2c-platform": BackboneSpecimen,
  "citizen-safety": PivotSpecimen,
  "email-builder": EmailSpecimen,
}

/** Returns null for a case study with no specimen, so the caller can fall back. */
export function WorkSpecimen({ slug }: { slug: string }) {
  const Specimen = SPECIMENS[slug]
  return Specimen ? <Specimen /> : null
}
