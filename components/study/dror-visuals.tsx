import clsx from "clsx"
import type { CSSProperties } from "react"

/*
 * The Dror study's visuals: the timeline, the two products, and the revenue
 * that tracked COVID. Ledger around the drawings; the dashboard and the app
 * are someone else's interface and keep their own palettes (DESIGN.md §2).
 */

const delay = (i: number) => ({ ["--i" as string]: i }) as CSSProperties

// ─── Timeline ────────────────────────────────────────────────────────────────

const ACTS = [
  { when: "March 2020", what: "Forcing function", body: "COVID lockdowns, before I joined. People stop moving, and so does B2C growth.", force: true },
  { when: "May–Oct 2020 · 6 months", what: "Act 1 · India's Life360", body: "A consumer safety app, 0→1. Real users, near-zero revenue." },
  { when: "Oct–Nov 2020 · 6 weeks", what: "The pivot", body: "Enterprise inbound appears. We prototype in days, validate, commit." },
  { when: "Nov 2020–Apr 2021 · 5 months", what: "Act 3 · B2B SaaS rebuild", body: "Bluetooth proximity, smart cards, and a dashboard I designed and partly coded." },
  { when: "Late 2021", what: "Forcing function", body: "Restrictions lift. Clients stop renewing.", force: true },
  { when: "Post Apr 2021", what: "Wind down", body: "PMF was real, but rented: ₹1.98Cr lifetime revenue, then a wind-down." },
]

/** Three acts and the two outside events that ended them, as a ruled line down the page. */
export function DrorTimeline() {
  return (
    <ol className="relative border-l border-border pl-6">
      {ACTS.map((a, i) => (
        <li key={a.when} data-settle style={delay(i)} className="relative pb-6 last:pb-0">
          <span
            aria-hidden
            className={clsx(
              "absolute -left-[calc(1.5rem+4px)] top-[0.45em] size-[7px]",
              a.force ? "bg-accent" : "border border-foreground bg-background",
            )}
          />
          <p className="ledger-label">{a.when}</p>
          <p className={clsx("mt-1 text-[16px] font-semibold leading-snug", a.force ? "text-accent" : "text-foreground")}>{a.what}</p>
          <p className="mt-1 max-w-[44ch] text-[15px] leading-snug text-muted-foreground">{a.body}</p>
        </li>
      ))}
    </ol>
  )
}

// ─── Two products ────────────────────────────────────────────────────────────

const COMPARE = [
  ["Primary user", "Citizens moving through cities", "Factory managers + essential workers"],
  ["Revenue model", "B2C freemium, mostly free", "Enterprise contracts, recurring"],
  ["Core feature", "SOS trigger + safety circle", "Bluetooth proximity + compliance dashboard"],
  ["Tech", "GPS, mobile app (Android + iOS)", "Bluetooth + smart card hardware + React"],
  ["What I built", "Full UX, PRDs, app design", "UX, PRDs, React.js frontend dashboard"],
]

/** Act 1 against Act 3, row by row. */
export function ProductCompare() {
  return (
    <div className="overflow-x-auto">
      <table className="w-full min-w-[560px] border-collapse text-left">
        <thead>
          <tr className="border-b border-foreground">
            <th scope="col" className="ledger-label py-3 pr-4 font-normal" />
            <th scope="col" className="py-3 pr-4 text-[15px] font-semibold text-foreground">Act 1 · Consumer Safety App</th>
            <th scope="col" className="py-3 text-[15px] font-semibold text-foreground">Act 3 · B2B Workplace Safety SaaS</th>
          </tr>
        </thead>
        <tbody>
          {COMPARE.map(([label, a, b]) => (
            <tr key={label} className="border-b border-border align-top">
              <th scope="row" className="ledger-label py-3 pr-4 font-normal">{label}</th>
              <td className="py-3 pr-4 text-[15px] leading-snug text-muted-foreground">{a}</td>
              <td className="py-3 text-[15px] leading-snug text-foreground">{b}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

/**
 * The V1 promise, drawn: one tap sends the SOS to your safety circle. A
 * coded sketch of the idea, not a capture of the shipped screen.
 */
export function SosSketch() {
  return (
    <div data-keep-radius className="mx-auto w-full max-w-[300px] rounded-[36px] border border-[#2a2a2a] bg-[#151515] p-[10px]">
      <div className="flex aspect-[9/19] flex-col rounded-[28px] bg-[#f7f5f0] px-6 pb-8 pt-10 text-[#151515]">
        <p className="text-[12px] text-[#6b6862]">Safety circle · 3 people</p>
        <div className="mt-3 flex gap-2">
          {["M", "A", "R"].map((x) => (
            <span key={x} className="grid size-9 place-items-center rounded-full bg-[#e3e0d8] text-[13px] font-semibold">{x}</span>
          ))}
        </div>
        <div className="flex flex-1 flex-col items-center justify-center">
          <span className="grid size-40 place-items-center rounded-full bg-[#d4202c] text-[34px] font-[800] tracking-[-0.02em] text-white">
            SOS
          </span>
          <p className="mt-6 text-center text-[13px] leading-snug text-[#55524c]">One tap alerts your circle with your location. No confirmation step.</p>
        </div>
      </div>
    </div>
  )
}

const HEAT = [
  0.9, 0.8, 0.95, 0.7, 0.85, 0.9, 0.6, 0.95, 0.75, 0.9, 0.85, 0.95, 0.8, 0.7, 0.9, 0.85,
  0.95, 0.6, 0.9, 0.8, 0.75, 0.95, 0.85, 0.9, 0.7, 0.85, 0.9, 0.95, 0.8, 0.75, 0.6, 0.9,
]

/** The factory manager's dashboard, recreated: illustrative figures, not client data. */
export function DashboardMock() {
  return (
    <div data-keep-radius className="overflow-hidden rounded-[6px] border border-[#d8d6d0] bg-[#f6f6f4] text-[#16181a]">
      <div className="flex h-9 items-center gap-3 bg-[#1c1c1c] px-4">
        <span className="flex gap-1.5">
          {[0, 1, 2].map((i) => (
            <span key={i} className="size-2.5 rounded-full bg-[#4a4a4a]" />
          ))}
        </span>
        <span className="rounded-[4px] bg-[#2c2c2c] px-3 py-0.5 text-[11px] text-[#a8a8a8]">drorapp.com/dashboard · Factory A</span>
      </div>
      <div className="p-5 sm:p-6">
        <div className="mb-4 flex items-center justify-between">
          <p className="text-[14px] font-semibold">Live safety overview, today</p>
          <span className="flex items-center gap-1.5 text-[12px] text-[#1f7a4a]">
            <span className="size-2 rounded-full bg-[#22a05a]" /> Live
          </span>
        </div>
        <div className="mb-4 grid grid-cols-3 gap-3">
          {[
            { num: "247", label: "Active workers", bar: 82, color: "#2f5bd3" },
            { num: "14", label: "Proximity events", bar: 14, color: "#d4202c" },
            { num: "94%", label: "Compliance score", bar: 94, color: "#22a05a" },
          ].map((m) => (
            <div key={m.label} className="rounded-[6px] border border-[#e2e0da] bg-white p-3 sm:p-4">
              <p className="text-[22px] font-bold leading-none sm:text-[26px]">{m.num}</p>
              <p className="mb-2 mt-1 text-[11px] text-[#6b6862]">{m.label}</p>
              <div className="h-1.5 rounded-full bg-[#eceae5]">
                <div className="h-full rounded-full" style={{ width: `${m.bar}%`, background: m.color }} />
              </div>
            </div>
          ))}
        </div>
        <div className="rounded-[6px] border border-[#e2e0da] bg-white p-4">
          <div className="mb-3 flex items-center justify-between">
            <p className="text-[12px] font-semibold">Zone compliance heatmap</p>
            <span className="text-[11px] text-[#6b6862]">Factory floor A</span>
          </div>
          <div className="grid grid-cols-16 gap-1" style={{ gridTemplateColumns: "repeat(16, minmax(0, 1fr))" }}>
            {HEAT.map((v, i) => (
              <span
                key={i}
                className="aspect-square rounded-[2px]"
                style={{ background: v < 0.65 ? "#e8a0a4" : `rgba(34,160,90,${v * 0.7})` }}
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}

// ─── What was cut ────────────────────────────────────────────────────────────

const CUTS = [
  { feature: "Community reporting", when: "V1", why: "Trust risk, users feared false alerts and abuse" },
  { feature: "Live location sharing", when: "V1", why: "Privacy concern; battery drain on low-end devices" },
  { feature: "In-app emergency call", when: "V1", why: "Latency made it slower than native dialer every time" },
  { feature: "Driving behaviour tracking", when: "Roadmap", why: "COVID made this irrelevant, no one was driving" },
]

/** What V1 left out, struck through, with the reason. */
export function WhatWasCut() {
  return (
    <ol className="border-b border-border">
      {CUTS.map((c) => (
        <li key={c.feature} className="grid grid-cols-[minmax(0,1fr)_4.5rem_minmax(0,1.4fr)] gap-x-4 border-t border-border py-3">
          <span className="text-[15px] text-muted-foreground line-through decoration-foreground/40">{c.feature}</span>
          <span className="ledger-label">{c.when}</span>
          <span className="text-[15px] leading-snug text-muted-foreground">{c.why}</span>
        </li>
      ))}
    </ol>
  )
}

// ─── Revenue against COVID ───────────────────────────────────────────────────

const QUARTERS = [
  { q: "Q2'20", revenue: 0, covid: 90 },
  { q: "Q3'20", revenue: 0.5, covid: 85 },
  { q: "Q4'20", revenue: 2, covid: 75 },
  { q: "Q1'21", revenue: 8, covid: 70 },
  { q: "Q2'21", revenue: 18, covid: 60 },
  { q: "Q3'21", revenue: 28, covid: 55 },
  { q: "Q4'21", revenue: 35, covid: 45 },
  { q: "Q1'22", revenue: 32, covid: 35 },
  { q: "Q2'22", revenue: 24, covid: 25 },
  { q: "Q3'22", revenue: 16, covid: 15 },
  { q: "Q4'22", revenue: 10, covid: 10 },
  { q: "Q1'23", revenue: 6, covid: 5 },
]

const NOTES: Record<number, string> = { 0: "Consumer app", 2: "B2B pivot", 6: "Peak ₹35L", 9: "COVID eases" }

/**
 * Company revenue by quarter (₹ lakh, ink) drawn against COVID restrictions
 * (%, dashed accent): the correlation that ended the company. Server-drawn
 * SVG, so it costs no chart library.
 */
export function RevenueChart() {
  const W = 720
  const H = 280
  const pad = { l: 40, r: 40, t: 28, b: 36 }
  const iw = W - pad.l - pad.r
  const ih = H - pad.t - pad.b
  const x = (i: number) => pad.l + (iw * i) / (QUARTERS.length - 1)
  const yRev = (v: number) => pad.t + ih - (ih * v) / 40
  const yCov = (v: number) => pad.t + ih - (ih * v) / 100
  const rev = QUARTERS.map((d, i) => `${x(i)},${yRev(d.revenue)}`).join(" ")
  const cov = QUARTERS.map((d, i) => `${x(i)},${yCov(d.covid)}`).join(" ")
  const area = `M ${x(0)},${yRev(0)} L ${rev.replaceAll(" ", " L ")} L ${x(QUARTERS.length - 1)},${pad.t + ih} L ${x(0)},${pad.t + ih} Z`

  return (
    <figure>
      <div className="mb-4 flex flex-wrap gap-x-6 gap-y-2">
        <span className="ledger-label inline-flex items-center gap-2 text-foreground">
          <span aria-hidden className="h-[2px] w-5 bg-foreground" /> Revenue (₹ lakh)
        </span>
        <span className="ledger-label inline-flex items-center gap-2">
          <span aria-hidden className="h-0 w-5 border-t-2 border-dashed border-accent" /> COVID restrictions (%)
        </span>
      </div>
      <svg
        viewBox={`0 0 ${W} ${H}`}
        role="img"
        aria-label="Revenue rose from zero in Q2 2020 to a peak of 35 lakh in Q4 2021 while COVID restrictions fell, then fell to 6 lakh by Q1 2023 as restrictions lifted."
        className="h-auto w-full overflow-visible"
      >
        {[0, 10, 20, 30, 40].map((v) => (
          <g key={v}>
            <line x1={pad.l} x2={W - pad.r} y1={yRev(v)} y2={yRev(v)} stroke="var(--border)" />
            <text x={pad.l - 8} y={yRev(v) + 4} textAnchor="end" fontFamily="var(--font-mono)" fontSize="11" fill="var(--text-muted)">{v}</text>
          </g>
        ))}
        <path d={area} fill="var(--foreground)" opacity="0.08" />
        <polyline points={rev} fill="none" stroke="var(--foreground)" strokeWidth="2" />
        <polyline points={cov} fill="none" stroke="var(--accent)" strokeWidth="2" strokeDasharray="5 5" />
        {QUARTERS.map((d, i) =>
          i % 2 === 0 ? (
            <text key={d.q} x={x(i)} y={H - 10} textAnchor="middle" fontFamily="var(--font-mono)" fontSize="11" fill="var(--text-muted)">{d.q}</text>
          ) : null,
        )}
        {Object.entries(NOTES).map(([k, label]) => {
          const i = Number(k)
          const y = yRev(QUARTERS[i].revenue)
          return (
            <g key={label}>
              <line x1={x(i)} x2={x(i)} y1={y - 6} y2={y - 22} stroke="var(--foreground)" />
              <rect x={x(i) - 3} y={y - 3} width="6" height="6" fill="var(--foreground)" />
              <text x={x(i)} y={y - 28} textAnchor={i === 0 ? "start" : "middle"} fontSize="12" fontWeight="600" fill="var(--foreground)">{label}</text>
            </g>
          )
        })}
      </svg>
    </figure>
  )
}
