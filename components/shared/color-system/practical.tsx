"use client"

import { useState } from "react"
import { oklchToHex } from "@/lib/color"
import { at } from "@/lib/scale"
import { Panel, Seg } from "./ui"
import { useColorSystem } from "./context"

// ════════════════════════════════════════════════════════════════════════════
// 10 · DARK-MODE TOKEN REMAPPING  (driven by the shared primary + neutral)
// ════════════════════════════════════════════════════════════════════════════

export function DarkModeRemap() {
  const { system, name } = useColorSystem()
  const N = system.neutral, P = system.primary
  const [mode, setMode] = useState<"light" | "dark">("light")

  const TOKENS = [
    { role: "Page background",    l: at(N, 100), d: at(N, 950), ll: "neutral-100", dl: "neutral-950" },
    { role: "Raised surface",     l: "#ffffff",  d: at(N, 900), ll: "white",       dl: "neutral-900" },
    { role: "Text — primary",     l: at(N, 900), d: at(N, 50),  ll: "neutral-900", dl: "neutral-50"  },
    { role: "Text — secondary",   l: at(N, 500), d: at(N, 400), ll: "neutral-500", dl: "neutral-400" },
    { role: "Border",             l: at(N, 200), d: at(N, 800), ll: "neutral-200", dl: "neutral-800" },
    { role: "Accent fill",        l: at(P, 600), d: at(P, 500), ll: `${name}-600`, dl: `${name}-500` },
    { role: "Accent text / link", l: at(P, 600), d: at(P, 400), ll: `${name}-600`, dl: `${name}-400` },
  ]
  const v = (i: number) => (mode === "light" ? TOKENS[i].l : TOKENS[i].d)

  return (
    <Panel>
      <div className="p-4 border-b border-border/60">
        <Seg label="Mode" value={mode} onChange={setMode}
          options={[{ key: "light", label: "Light" }, { key: "dark", label: "Dark" }]} />
      </div>
      <div className="grid md:grid-cols-2">
        <div className="p-5 transition-colors duration-300" style={{ background: v(0) }}>
          <div className="rounded-xl p-5 transition-colors duration-300" style={{ background: v(1), border: `1px solid ${v(4)}` }}>
            <p className="text-[15px] font-semibold mb-1 transition-colors duration-300" style={{ color: v(2) }}>Account settings</p>
            <p className="text-[12px] leading-relaxed mb-4 transition-colors duration-300" style={{ color: v(3) }}>
              The same token names drive both modes — only the scale stop they resolve to changes.
            </p>
            <div className="flex items-center gap-2.5">
              <button className="text-[12px] font-medium px-3.5 py-2 rounded-lg text-white transition-colors duration-300" style={{ background: v(5) }}>Save changes</button>
              <span className="text-[12px] font-medium transition-colors duration-300" style={{ color: v(6) }}>Cancel</span>
            </div>
          </div>
        </div>
        <div className="p-5 border-t md:border-t-0 md:border-l border-border/60">
          <p className="text-[10px] font-bold uppercase tracking-[0.14em] text-muted-foreground mb-3">Token remap</p>
          <div className="flex flex-col gap-1.5">
            {TOKENS.map((t, i) => (
              <div key={t.role} className="flex items-center gap-2 text-[11px]">
                <span className="w-4 h-4 rounded border border-border/60 shrink-0" style={{ background: v(i) }} />
                <span className="text-foreground/80 w-32 shrink-0 truncate">{t.role}</span>
                <span className="font-mono text-accent">{mode === "light" ? t.ll : t.dl}</span>
                <span className="font-mono text-muted-foreground/50 line-through ml-auto">{mode === "light" ? t.dl : t.ll}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </Panel>
  )
}

// ════════════════════════════════════════════════════════════════════════════
// 11 · COLOR IN MOTION  (accent from the shared primary)
// ════════════════════════════════════════════════════════════════════════════

const DURATIONS = [{ key: "75", label: "75ms" }, { key: "150", label: "150ms" }, { key: "250", label: "250ms" }, { key: "400", label: "400ms" }]
const EASINGS = [
  { key: "linear", label: "linear", css: "linear" },
  { key: "ease",   label: "ease",   css: "ease" },
  { key: "inout",  label: "ease-in-out", css: "cubic-bezier(0.4, 0, 0.2, 1)" },
  { key: "snappy", label: "snappy", css: "cubic-bezier(0.22, 1, 0.36, 1)" },
]

export function ColorInMotion() {
  const { system } = useColorSystem()
  const P = system.primary, N = system.neutral
  const [dur, setDur]   = useState("150")
  const [ease, setEase] = useState("inout")
  const [hov, setHov]   = useState<string | null>(null)

  const easeCss = EASINGS.find(e => e.key === ease)!.css
  const tr = `${dur}ms ${easeCss}`
  const on = (k: string) => ({ onMouseEnter: () => setHov(k), onMouseLeave: () => setHov(null) })

  return (
    <Panel>
      <div className="p-4 border-b border-border/60 flex flex-col gap-3">
        <Seg label="Duration" value={dur} onChange={setDur} options={DURATIONS} />
        <Seg label="Easing" value={ease} onChange={setEase} options={EASINGS} />
      </div>
      <div className="p-6 flex flex-wrap items-center gap-4">
        <button {...on("btn")}
          className="text-[13px] font-medium px-4 py-2 rounded-lg text-white"
          style={{ background: hov === "btn" ? at(P, 500) : at(P, 600), transition: `background-color ${tr}` }}>
          Primary button
        </button>

        <div {...on("row")}
          className="text-[13px] px-4 py-2 rounded-lg border border-border"
          style={{ background: hov === "row" ? at(N, 100) : "transparent", transition: `background-color ${tr}` }}>
          List row (hover fill)
        </div>

        <span {...on("link")}
          className="text-[13px] font-medium cursor-pointer"
          style={{ color: hov === "link" ? at(P, 700) : at(P, 600), transition: `color ${tr}` }}>
          Inline link →
        </span>

        <div {...on("ring")}
          className="text-[13px] px-4 py-2 rounded-lg bg-card"
          style={{ boxShadow: hov === "ring" ? `0 0 0 3px ${at(P, 500)}55` : "0 0 0 0 transparent", border: `1px solid ${at(N, 300)}`, transition: `box-shadow ${tr}` }}>
          Focus ring
        </div>

        <code className="ml-auto font-mono text-[11px] bg-foreground/[0.05] border border-border rounded-md px-3 py-1.5 text-foreground/70">
          transition: {dur}ms {easeCss}
        </code>
      </div>
      <p className="px-6 pb-5 text-[12px] text-muted-foreground leading-relaxed">
        Hover the elements. Color transitions read best at <strong className="text-foreground/80 font-medium">75–150ms</strong> for hover and focus
        — fast enough to feel instant, slow enough to register — with an ease-out curve. Past ~250ms feels laggy on interactive states, and everything honours <code className="font-mono text-[11px]">prefers-reduced-motion</code>.
      </p>
    </Panel>
  )
}

// ════════════════════════════════════════════════════════════════════════════
// 12 · COLOR IN DATA VISUALIZATION  (hue seeded from the shared primary)
// ════════════════════════════════════════════════════════════════════════════

const DV_TYPES = [
  { key: "sequential", label: "Sequential" },
  { key: "diverging",  label: "Diverging" },
  { key: "categorical", label: "Categorical" },
]
const DV_COPY: Record<string, string> = {
  sequential:  "One hue, light → dark. For ordered magnitude — heatmaps, density, low-to-high. The eye reads darkness as “more.”",
  diverging:   "Two hues meeting at a neutral midpoint. For values around a meaningful center — profit/loss, above/below average, sentiment.",
  categorical: "Unrelated hues at matched lightness, so none dominates. For unordered groups. Never reuse your brand primary as one category — it implies the brand “owns” that series.",
}

function seqPalette(hue: number, n = 7) {
  return Array.from({ length: n }, (_, i) => {
    const t = i / (n - 1)
    return oklchToHex({ l: 0.95 - t * 0.5, c: 0.04 + t * 0.13, h: hue })
  })
}
function divPalette(hl: number, hr: number, n = 7) {
  const mid = (n - 1) / 2
  return Array.from({ length: n }, (_, i) => {
    const d = (i - mid) / mid
    const hue = d < 0 ? hl : hr
    const k = Math.abs(d)
    return oklchToHex({ l: 0.95 - k * 0.45, c: k * 0.16, h: hue })
  })
}
function catPalette() {
  return [20, 70, 145, 200, 260, 320].map(h => oklchToHex({ l: 0.64, c: 0.15, h }))
}

export function DataVizPalettes() {
  const { baseHsl } = useColorSystem()
  const hue = Math.round(baseHsl.h)
  const [type, setType] = useState("sequential")

  const palette = type === "sequential" ? seqPalette(hue)
                : type === "diverging"  ? divPalette((hue + 200) % 360, hue)
                : catPalette()

  const seqData = [22, 38, 30, 64, 52, 88, 74]
  const divData = [-32, -18, -7, 9, 24, 40]
  const catData = [[40, 62, 30], [55, 35, 70], [48, 80, 52], [70, 45, 60], [33, 58, 42], [60, 72, 38]]

  return (
    <Panel>
      <div className="p-4 border-b border-border/60 flex items-center justify-between gap-3 flex-wrap">
        <Seg label="Type" value={type} onChange={setType} options={DV_TYPES} />
        {type !== "categorical" && <span className="text-[11px] font-mono text-muted-foreground">hue {hue}° · from your primary</span>}
      </div>
      <div className="p-6">
        <div className="flex rounded-lg overflow-hidden border border-border/60 mb-5">
          {palette.map((c, i) => <div key={i} className="flex-1 h-8" style={{ background: c }} title={c} />)}
        </div>
        <div className="h-36 flex items-end gap-2">
          {type === "categorical"
            ? catData.map((group, gi) => (
                <div key={gi} className="flex-1 flex items-end gap-0.5 h-full">
                  {group.map((val, si) => (
                    <div key={si} className="flex-1 rounded-t" style={{ height: `${val}%`, background: palette[gi] }} />
                  ))}
                </div>
              ))
            : (type === "sequential" ? seqData : divData).map((val, i) => {
                const h = type === "diverging" ? Math.abs(val) * 1.6 + 8 : val
                return (
                  <div key={i} className="flex-1 flex flex-col justify-end h-full">
                    <div className="rounded-t" style={{ height: `${h}%`, background: palette[type === "diverging" ? i : Math.round((val / 100) * (palette.length - 1))] }} />
                  </div>
                )
              })}
        </div>
        {type === "categorical" && (
          <div className="flex flex-wrap gap-3 mt-4">
            {palette.map((c, i) => (
              <span key={i} className="flex items-center gap-1.5 text-[11px] text-muted-foreground">
                <span className="w-2.5 h-2.5 rounded-full" style={{ background: c }} />
                Series {String.fromCharCode(65 + i)}
              </span>
            ))}
          </div>
        )}
      </div>
      <p className="px-6 pb-5 text-[12px] text-muted-foreground leading-relaxed">{DV_COPY[type]}</p>
    </Panel>
  )
}
