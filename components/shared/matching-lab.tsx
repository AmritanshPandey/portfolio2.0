"use client"

/* ────────────────────────────────────────────────────────────────────────────
   Matching-markets visuals for the "Dating Apps Solved the Wrong Problem" essay.

   The trade-off frontier and engine comparison run a real, exact model on the
   same six marriage-seekers used in the FairMatch technical brief: brute-force
   stable-roommates (Irving), bipartite deferred acceptance (Gale–Shapley), and
   a degree-capped fair b-matching. The numbers are computed live, not faked.
   ──────────────────────────────────────────────────────────────────────────── */

import { useMemo, useState } from "react"
import { motion } from "framer-motion"

// ─── shared model: six marriage-seekers ────────────────────────────────────────

type Person = { n: string; role: string; d: number; int: string[] }

const PEOPLE: Person[] = [
  { n: "Aanya",  role: "Architect",   d: 0.95, int: ["travel", "art", "food", "music"] },
  { n: "Vikram", role: "Doctor",      d: 0.90, int: ["travel", "music", "fitness", "food"] },
  { n: "Meera",  role: "Teacher",     d: 0.55, int: ["family", "reading", "food"] },
  { n: "Rohan",  role: "Founder",     d: 0.50, int: ["fitness", "travel", "ambition"] },
  { n: "Diya",   role: "Researcher",  d: 0.25, int: ["reading", "classical", "quiet"] },
  { n: "Sameer", role: "Accountant",  d: 0.20, int: ["family", "reading", "calm"] },
]
const N = PEOPLE.length
const K = 2 // introductions per person

const jac = (a: string[], b: string[]) => {
  const B = new Set(b)
  let x = 0
  a.forEach(v => { if (B.has(v)) x++ })
  const u = new Set([...a, ...b]).size
  return u ? x / u : 0
}
const sc = (i: number, j: number) =>
  i === j ? 0 : 0.35 * jac(PEOPLE[i].int, PEOPLE[j].int) + 0.65 * PEOPLE[i].d * PEOPLE[j].d

const S: number[][] = Array.from({ length: N }, (_, i) =>
  Array.from({ length: N }, (_, j) => sc(i, j)),
)
const ALL_EDGES: [number, number][] = []
for (let i = 0; i < N; i++) for (let j = i + 1; j < N; j++) ALL_EDGES.push([i, j])

// under-service weight: less central → larger weight
const CENT = Array(N).fill(0)
ALL_EDGES.forEach(([i, j]) => { CENT[i] += S[i][j]; CENT[j] += S[i][j] })
const MAXC = Math.max(...CENT)
const W = CENT.map(c => 1 - c / MAXC)

type Edge = [number, number]
type Metrics = { edges: Edge[]; total: number; quiet: number; block: number; introsPer: number }

function metrics(edges: Edge[]): Metrics {
  const part: number[][] = Array.from({ length: N }, () => [])
  let q = 0
  edges.forEach(([i, j]) => { part[i].push(j); part[j].push(i); q += S[i][j] })
  const avgDes = (ps: number[]) => (ps.length ? ps.reduce((a, p) => a + PEOPLE[p].d, 0) / ps.length : 0)
  const quiet = (avgDes(part[4]) + avgDes(part[5])) / 2 // reach of the two quiet profiles
  const worst = Array(N).fill(1)
  edges.forEach(([i, j]) => { worst[i] = Math.min(worst[i], S[i][j]); worst[j] = Math.min(worst[j], S[i][j]) })
  let block = 0
  for (let i = 0; i < N; i++) for (let j = i + 1; j < N; j++) {
    if (part[i].includes(j)) continue
    if (S[i][j] > worst[i] && S[i][j] > worst[j]) block++
  }
  return { edges, part, total: q, quiet, block, introsPer: (2 * edges.length) / N } as Metrics
}

// Gale–Shapley over an arbitrary two-sided split
const SIDE_A = [0, 2, 4], SIDE_B = [1, 3, 5]
function galeShapley(): Edge[] {
  const pA: Record<number, number[]> = {}, pB: Record<number, number[]> = {}
  SIDE_A.forEach(a => (pA[a] = [...SIDE_B].sort((x, y) => S[a][y] - S[a][x])))
  SIDE_B.forEach(b => (pB[b] = [...SIDE_A].sort((x, y) => S[b][y] - S[b][x])))
  const free = [...SIDE_A], nx: Record<number, number> = {}, held: Record<number, number> = {}
  SIDE_A.forEach(a => (nx[a] = 0))
  while (free.length) {
    const a = free.shift()!
    const b = pA[a][nx[a]++]
    if (held[b] === undefined) held[b] = a
    else {
      const cur = held[b]
      if (pB[b].indexOf(a) < pB[b].indexOf(cur)) { held[b] = a; free.push(cur) }
      else free.push(a)
    }
  }
  return Object.entries(held).map(([b, a]) => [+a, +b] as Edge)
}

// Irving / stable roommates — exact over perfect matchings
function perfMatch(rem: number[]): Edge[][] {
  if (!rem.length) return [[]]
  const [f, ...r] = rem, out: Edge[][] = []
  for (let k = 0; k < r.length; k++) {
    const j = r[k], oth = r.filter((_, t) => t !== k)
    for (const m of perfMatch(oth)) out.push([[f, j], ...m])
  }
  return out
}
function irving(): { ok: boolean; edges: Edge[] } {
  for (const m of perfMatch([0, 1, 2, 3, 4, 5])) {
    const pt: Record<number, number> = {}
    m.forEach(([i, j]) => { pt[i] = j; pt[j] = i })
    let ok = true
    for (let i = 0; i < N && ok; i++) for (let j = i + 1; j < N && ok; j++) {
      if (pt[i] === j) continue
      if (S[i][j] > S[i][pt[i]] && S[i][j] > S[j][pt[j]]) ok = false
    }
    if (ok) return { ok: true, edges: m }
  }
  return { ok: false, edges: [] }
}

// FairMatch — exact degree-capped b-matching with a non-separable fairness term
function fairmatch(lam: number): Edge[] {
  const M = ALL_EDGES.length
  let best = -1e9, bm = 0
  for (let mask = 0; mask < (1 << M); mask++) {
    const deg = Array(N).fill(0)
    let ok = true, wt = 0
    for (let e = 0; e < M; e++) if (mask & (1 << e)) {
      const [i, j] = ALL_EDGES[e]
      deg[i]++; deg[j]++
      wt += S[i][j] + lam * (W[i] * PEOPLE[j].d + W[j] * PEOPLE[i].d)
    }
    for (let n = 0; n < N; n++) if (deg[n] > K) { ok = false; break }
    if (ok && wt > best) { best = wt; bm = mask }
  }
  return ALL_EDGES.filter((_, e) => bm & (1 << e))
}

// ─── shared primitives ──────────────────────────────────────────────────────

function Card({ children, className = "" }: { children: React.ReactNode; className?: string }) {
  return (
    <div className={`rounded-2xl border border-border/50 bg-foreground/[0.015] dark:bg-white/[0.015] ${className}`}>
      {children}
    </div>
  )
}
function CardHead({ title, sub }: { title: string; sub?: string }) {
  return (
    <div className="px-5 md:px-6 pt-5 pb-4 border-b border-border/40">
      <p className="text-[15px] font-semibold tracking-tight text-foreground">{title}</p>
      {sub && <p className="text-[12px] text-muted-foreground mt-0.5 font-mono">{sub}</p>}
    </div>
  )
}

// ════════════════════════════════════════════════════════════════════════════
//  1 · LINEAGE STRIP
// ════════════════════════════════════════════════════════════════════════════

const LINEAGE = [
  { era: "Dating apps", title: "Discovery", body: "Browse, swipe, pile up likes. Good at finding people, not at handing them out well.", tag: "Popularity markets", accent: "#f59e0b" },
  { era: "Gale–Shapley · 1962", title: "Mutual preference", body: "Deferred acceptance. A stable one-to-one match with no blocking pairs. This is the core we keep.", tag: "Stable matching", accent: "#10b981" },
  { era: "Irving · 1985", title: "Single pool", body: "Drops the two-sides rule. One pool, anyone with anyone. But a stable match may not exist.", tag: "Stable roommates", accent: "#8b5cf6" },
  { era: "FairMatch", title: "Fair allocation", body: "Run it weekly as an optimization. Several introductions, fairness built in, always an answer.", tag: "Weekly allocation", accent: "#f472a8" },
]

export function LineageStrip() {
  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
      {LINEAGE.map((l, i) => (
        <motion.div
          key={l.title}
          initial={{ opacity: 0, y: 14 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-40px" }}
          transition={{ duration: 0.45, delay: i * 0.08, ease: [0.22, 1, 0.36, 1] }}
          className="relative rounded-xl border bg-background p-4 flex flex-col"
          style={{ borderColor: i === 3 ? "rgba(244,114,168,0.4)" : undefined }}
        >
          <span className="font-mono text-[10px] uppercase tracking-[0.12em] text-muted-foreground">{l.era}</span>
          <span className="font-semibold text-[17px] tracking-tight text-foreground mt-1.5 mb-1.5">{l.title}</span>
          <p className="text-[12.5px] leading-relaxed text-muted-foreground flex-1">{l.body}</p>
          <span
            className="inline-block mt-3 self-start font-mono text-[10px] px-2 py-1 rounded-full border"
            style={{ color: l.accent, borderColor: `${l.accent}55` }}
          >
            {l.tag}
          </span>
          {i < 3 && (
            <span className="hidden lg:block absolute -right-[11px] top-1/2 -translate-y-1/2 text-muted-foreground/50 text-base z-10">→</span>
          )}
        </motion.div>
      ))}
    </div>
  )
}

// ════════════════════════════════════════════════════════════════════════════
//  2 · DISCOVERY vs ALLOCATION
// ════════════════════════════════════════════════════════════════════════════

export function DiscoveryVsAllocation() {
  return (
    <div className="grid md:grid-cols-2 gap-3">
      <div className="rounded-xl border border-border/50 bg-background p-5">
        <p className="font-mono text-[10px] uppercase tracking-[0.16em] text-muted-foreground mb-3">Solved · search problem</p>
        <p className="text-[15px] font-semibold text-foreground mb-3">Discovery</p>
        <div className="flex flex-wrap gap-1.5">
          {Array.from({ length: 28 }).map((_, i) => (
            <span key={i} className="w-4 h-4 rounded-[3px] bg-foreground/15" />
          ))}
        </div>
        <p className="text-[12.5px] text-muted-foreground mt-3 leading-relaxed">Turn a messy pool of strangers into a scrollable, filterable feed. We are very good at this.</p>
      </div>
      <div className="rounded-xl border border-orange-500/30 bg-orange-500/[0.03] p-5">
        <p className="font-mono text-[10px] uppercase tracking-[0.16em] text-orange-500 mb-3">Unsolved · economics problem</p>
        <p className="text-[15px] font-semibold text-foreground mb-3">Allocation</p>
        <div className="flex flex-wrap gap-1.5">
          {Array.from({ length: 28 }).map((_, i) => (
            <span
              key={i}
              className="w-4 h-4 rounded-[3px]"
              style={{ background: i < 3 ? "#f97316" : i < 7 ? "rgba(249,115,22,0.35)" : "rgba(120,120,120,0.12)" }}
            />
          ))}
        </div>
        <p className="text-[12.5px] text-muted-foreground mt-3 leading-relaxed">Of everyone you <em>could</em> meet, who actually gets seen, and how fairly? A few soak up the attention. The rest swipe into nothing.</p>
      </div>
    </div>
  )
}

// ════════════════════════════════════════════════════════════════════════════
//  3 · CONCENTRATION DEMO (illustrative)
// ════════════════════════════════════════════════════════════════════════════

const POP = 24
function gini(v: number[]) {
  const a = [...v].sort((x, y) => x - y), n = a.length
  const sum = a.reduce((x, y) => x + y, 0)
  if (sum <= 0) return 0
  let cum = 0
  for (let k = 0; k < n; k++) cum += (k + 1) * a[k]
  return Math.max(0, Math.min(1, (2 * cum) / (n * sum) - (n + 1) / n))
}

export function ConcentrationDemo() {
  const [k, setK] = useState(2.4) // engagement skew
  const [fair, setFair] = useState(false)
  // each person's "desirability rank" → attention received
  const desir = useMemo(() => Array.from({ length: POP }, (_, i) => 1 - i / POP), [])
  const attention = useMemo(() => {
    const raw = desir.map(d => (fair ? 0.4 + 0.6 * d : Math.pow(d, k)))
    const sum = raw.reduce((a, b) => a + b, 0)
    return raw.map(r => (r / sum) * POP * 3) // normalise to a comparable total
  }, [desir, k, fair])
  const g = gini(attention)
  const max = Math.max(...attention)

  return (
    <Card>
      <CardHead title="Where the attention goes" sub="illustrative model · 24 people, sorted most → least sought-after" />
      <div className="p-5 md:p-6">
        <div className="flex items-end gap-[3px] h-40 mb-4">
          {attention.map((a, i) => (
            <motion.div
              key={i}
              className="flex-1 rounded-t-[2px]"
              style={{ background: fair ? "#f97316" : i < 3 ? "#f97316" : "rgba(120,120,120,0.3)" }}
              animate={{ height: `${(a / max) * 100}%` }}
              transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
            />
          ))}
        </div>

        <div className="flex flex-wrap items-center gap-x-6 gap-y-3">
          <div className="flex items-center gap-2">
            <button
              onClick={() => setFair(false)}
              className={`font-mono text-[11px] px-3 py-1.5 rounded-md border transition ${!fair ? "bg-foreground/10 border-border text-foreground" : "border-border/50 text-muted-foreground"}`}
            >
              Engagement-optimized
            </button>
            <button
              onClick={() => setFair(true)}
              className={`font-mono text-[11px] px-3 py-1.5 rounded-md border transition ${fair ? "bg-orange-500 border-orange-500 text-white" : "border-border/50 text-muted-foreground"}`}
            >
              Fair allocation
            </button>
          </div>

          {!fair && (
            <label className="flex items-center gap-3 flex-1 min-w-[200px]">
              <span className="font-mono text-[10px] uppercase tracking-[0.12em] text-muted-foreground whitespace-nowrap">Skew</span>
              <input
                type="range" min={1} max={4} step={0.1} value={k}
                onChange={e => setK(+e.target.value)}
                className="flex-1 accent-orange-500"
              />
            </label>
          )}

          <div className="flex items-baseline gap-2 ml-auto">
            <span className="font-mono text-[10px] uppercase tracking-[0.12em] text-muted-foreground">Gini</span>
            <span className="font-mono text-[22px] font-semibold text-foreground tabular-nums">{g.toFixed(2)}</span>
          </div>
        </div>
        <p className="text-[12.5px] text-muted-foreground mt-4 leading-relaxed">
          {fair
            ? "Cap how much attention any one person gets and the bottom of the market stops being invisible. Gini drops. Opportunity gets spread instead of hoarded."
            : "An engagement goal lands here by itself. The most wanted few take almost everything. Drag the skew up to watch the gap grow."}
        </p>
      </div>
    </Card>
  )
}

// ════════════════════════════════════════════════════════════════════════════
//  4 · TRADEOFF FRONTIER (centerpiece — real model)
// ════════════════════════════════════════════════════════════════════════════

export function TradeoffFrontier() {
  const [lam, setLam] = useState(1.0)
  // dense λ sweep, computed once
  const sweep = useMemo(() => {
    const pts: { lam: number; total: number; quiet: number; block: number }[] = []
    for (let l = 0; l <= 2.5001; l += 0.125) {
      const m = metrics(fairmatch(l))
      pts.push({ lam: +l.toFixed(3), total: m.total, quiet: m.quiet, block: m.block })
    }
    return pts
  }, [])
  const cur = useMemo(() => {
    const m = metrics(fairmatch(lam))
    return { total: m.total, quiet: m.quiet, block: m.block }
  }, [lam])

  // scales
  const W_ = 520, H = 300, m = { l: 56, r: 20, t: 18, b: 44 }
  const xs = sweep.map(p => p.total), ys = sweep.map(p => p.quiet)
  const xmin = Math.min(...xs), xmax = Math.max(...xs)
  const ymin = Math.min(...ys), ymax = Math.max(...ys)
  const sx = (v: number) => m.l + ((v - xmin) / (xmax - xmin || 1)) * (W_ - m.l - m.r)
  const sy = (v: number) => H - m.b - ((v - ymin) / (ymax - ymin || 1)) * (H - m.t - m.b)
  const path = sweep.map((p, i) => `${i ? "L" : "M"}${sx(p.total).toFixed(1)},${sy(p.quiet).toFixed(1)}`).join(" ")

  return (
    <Card>
      <CardHead title="Quality × Fairness frontier" sub="each dot is a value of λ · your current λ is highlighted" />
      <div className="grid lg:grid-cols-[1.15fr_0.85fr]">
        {/* chart */}
        <div className="p-4 md:p-5 border-b lg:border-b-0 lg:border-r border-border/40">
          <svg viewBox={`0 0 ${W_} ${H}`} className="w-full h-auto">
            {/* axes */}
            <line x1={m.l} y1={H - m.b} x2={W_ - m.r} y2={H - m.b} stroke="currentColor" className="text-border" />
            <line x1={m.l} y1={m.t} x2={m.l} y2={H - m.b} stroke="currentColor" className="text-border" />
            <text x={(m.l + W_ - m.r) / 2} y={H - 8} textAnchor="middle" className="fill-muted-foreground" style={{ fontSize: 11, fontFamily: "monospace" }}>
              ← match value of introductions →
            </text>
            <text transform={`translate(16,${(m.t + H - m.b) / 2}) rotate(-90)`} textAnchor="middle" className="fill-muted-foreground" style={{ fontSize: 11, fontFamily: "monospace" }}>
              under-served reach →
            </text>
            {/* frontier */}
            <path d={path} fill="none" stroke="currentColor" className="text-muted-foreground/50" strokeWidth={2} />
            {sweep.map((p, i) => (
              <circle key={i} cx={sx(p.total)} cy={sy(p.quiet)} r={2.6} className="fill-muted-foreground/60" />
            ))}
            {/* current */}
            <circle cx={sx(cur.total)} cy={sy(cur.quiet)} r={7} fill="#f97316" stroke="white" strokeWidth={1.5} />
            <text x={sx(cur.total)} y={sy(cur.quiet) - 13} textAnchor="middle" fill="#f97316" style={{ fontSize: 12, fontFamily: "monospace", fontWeight: 600 }}>
              λ={lam.toFixed(2)}
            </text>
          </svg>
        </div>

        {/* controls + metrics */}
        <div className="p-5 md:p-6 flex flex-col">
          <div className="flex items-baseline justify-between mb-2">
            <span className="font-mono text-[10px] uppercase tracking-[0.16em] text-orange-500">λ · fairness dial</span>
            <span className="font-semibold text-[26px] text-foreground tabular-nums">{lam.toFixed(2)}</span>
          </div>
          <input type="range" min={0} max={2.5} step={0.05} value={lam} onChange={e => setLam(+e.target.value)} className="w-full accent-orange-500" />
          <div className="flex justify-between font-mono text-[10px] text-muted-foreground mt-1 mb-5">
            <span>0 · compatibility</span><span>2.5 · fairness first</span>
          </div>

          <div className="grid grid-cols-3 gap-2.5">
            <Metric label="Match value" value={cur.total.toFixed(2)} />
            <Metric label="Under-served reach" value={cur.quiet.toFixed(2)} accent />
            <Metric label="Blocking pairs" value={String(cur.block)} />
          </div>
          <p className="text-[12.5px] text-muted-foreground mt-4 leading-relaxed">
            Push the dial right and the engine sends sought-after partners toward people who keep getting skipped. Reach for the under-served goes up. Raw match value gives a little back. No setting wins on everything. You are picking a point on a tradeoff, and that is a product call.
          </p>
        </div>
      </div>
    </Card>
  )
}

function Metric({ label, value, accent = false }: { label: string; value: string; accent?: boolean }) {
  return (
    <div className={`rounded-lg border px-3 py-2.5 ${accent ? "border-orange-500/30 bg-orange-500/[0.04]" : "border-border/50 bg-background"}`}>
      <p className="font-mono text-[9.5px] uppercase tracking-[0.1em] text-muted-foreground leading-tight">{label}</p>
      <p className={`font-semibold text-[22px] tabular-nums mt-1 ${accent ? "text-orange-500" : "text-foreground"}`}>{value}</p>
    </div>
  )
}

// ════════════════════════════════════════════════════════════════════════════
//  5 · ENGINE COMPARISON (real model)
// ════════════════════════════════════════════════════════════════════════════

type EngineRow = { name: string; m: Metrics | null; color: string; hi?: boolean }

function BarGroup({ title, rows, pick, denom }: {
  title: string; rows: EngineRow[]; pick: (m: Metrics) => number; denom: number
}) {
  return (
    <div>
      <p className="font-mono text-[10px] uppercase tracking-[0.12em] text-muted-foreground mb-2.5">{title}</p>
      <div className="space-y-2">
        {rows.map(r => {
          const val = r.m ? pick(r.m) : 0
          return (
            <div key={r.name} className="grid grid-cols-[96px_1fr] gap-3 items-center">
              <span className="font-mono text-[11px] text-foreground/70 text-right">{r.name}</span>
              <div className="h-7 rounded-md bg-foreground/[0.05] overflow-hidden">
                <motion.div
                  className="h-full rounded-md flex items-center justify-end pr-2 font-mono text-[11px] text-white"
                  style={{ background: r.color, boxShadow: r.hi ? "0 0 14px rgba(249,115,22,0.4)" : undefined }}
                  initial={{ width: 0 }}
                  whileInView={{ width: `${Math.max(8, Math.min(100, (val / denom) * 100))}%` }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
                >
                  {r.m ? val.toFixed(2) : "fails"}
                </motion.div>
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}

export function EngineComparison() {
  const gs = useMemo(() => metrics(galeShapley()), [])
  const irv = useMemo(() => { const r = irving(); return r.ok ? metrics(r.edges) : null }, [])
  const fm = useMemo(() => metrics(fairmatch(1.0)), [])

  const MATCH_MAX = 2.2, FAIR_MAX = 0.95
  const rows: EngineRow[] = [
    { name: "Gale–Shapley", m: gs, color: "rgba(120,120,120,0.55)" },
    { name: "Irving's", m: irv, color: "rgba(180,140,70,0.7)" },
    { name: "FairMatch", m: fm, color: "#f97316", hi: true },
  ]

  return (
    <Card>
      <CardHead title="Three engines, same six people" sub="longer bar = better · computed live" />
      <div className="p-5 md:p-6 space-y-6">
        <BarGroup title="Match value delivered (total)" rows={rows} pick={m => m.total} denom={MATCH_MAX} />
        <BarGroup title="Fairness · reach for the under-served" rows={rows} pick={m => m.quiet} denom={FAIR_MAX} />
        <div className="rounded-lg border border-orange-500/25 bg-gradient-to-r from-orange-500/[0.06] to-transparent p-4">
          <p className="text-[13.5px] leading-relaxed text-foreground/80">
            On pure stability, Gale&ndash;Shapley and Irving are hard to beat. One partner each, perfectly stable.
            FairMatch keeps that same stability at its core and adds two things. Several introductions per person,
            and a push that sends sought-after partners toward people who would otherwise be skipped. So it gets
            <b className="text-orange-500"> more total match value and more reach for the under-served</b>, and unlike
            the other two it can never come back with no solution.
          </p>
        </div>
      </div>
    </Card>
  )
}

// ════════════════════════════════════════════════════════════════════════════
//  6 · WEEKLY LOOP
// ════════════════════════════════════════════════════════════════════════════

const LOOP = [
  { si: "01", h: "Filter", p: "Hard rules decide who is even possible. Keeps the pool dense enough for real choices." },
  { si: "02", h: "Score", p: "A mutual compatibility score per pair, built so a match only counts when it's good for both. This is the Gale-Shapley part." },
  { si: "03", h: "Balance", p: "A fairness dial steers desirable partners toward the under-served, without ignoring compatibility." },
  { si: "04", h: "Introduce", p: "Everyone gets the same small set of introductions. Next week the loop runs again with new feedback." },
]
export function WeeklyLoop() {
  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
      {LOOP.map((s, i) => (
        <motion.div
          key={s.h}
          initial={{ opacity: 0, y: 14 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-40px" }}
          transition={{ duration: 0.45, delay: i * 0.08, ease: [0.22, 1, 0.36, 1] }}
          className="relative rounded-xl border border-border/50 bg-background p-4"
        >
          <span className="font-mono text-[11px] text-orange-500/70 tracking-[0.1em]">{s.si}</span>
          <p className="font-semibold text-[16px] tracking-tight text-foreground mt-1.5 mb-1.5">{s.h}</p>
          <p className="text-[12.5px] leading-relaxed text-muted-foreground">{s.p}</p>
          {i < 3 && (
            <span className="hidden lg:block absolute -right-[11px] top-1/2 -translate-y-1/2 text-orange-500/50 text-base z-10">→</span>
          )}
        </motion.div>
      ))}
    </div>
  )
}
