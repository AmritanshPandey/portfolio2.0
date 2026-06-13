"use client"

import { useMemo, useState } from "react"
import { hslToHex, oklchToHex, luminance, hexToRgb, simulateCb } from "@/lib/color"
import { at } from "@/lib/scale"
import { Panel, Seg } from "./ui"
import { useColorSystem } from "./context"

// ════════════════════════════════════════════════════════════════════════════
// 13 · PERCEPTUAL UNIFORMITY  (why HSL lies, why OKLCH is better)
// Same "lightness" across hues looks wildly uneven in HSL, even in OKLCH.
// ════════════════════════════════════════════════════════════════════════════

const HUES = [
  { h: 0, name: "Red" }, { h: 55, name: "Yellow" }, { h: 130, name: "Green" },
  { h: 195, name: "Cyan" }, { h: 250, name: "Blue" }, { h: 320, name: "Magenta" },
]

function lumPct(hex: string) { return Math.round(luminance(hex) * 100) }
function spread(row: string[]) { const v = row.map(lumPct); return Math.max(...v) - Math.min(...v) }

function PuRow({ title, row, sub }: { title: string; row: string[]; sub: string }) {
  return (
    <div>
      <div className="flex items-baseline justify-between mb-1.5">
        <span className="font-mono text-[10px] uppercase tracking-[0.1em] text-foreground/70">{title}</span>
        <span className="text-[11px] text-muted-foreground">{sub} · luminance spread <strong className="text-foreground/80 font-medium">{spread(row)}%</strong></span>
      </div>
      <div className="grid grid-cols-6 rounded-lg overflow-hidden border border-border/60">
        {row.map((c, i) => (
          <div key={i} className="h-16 flex flex-col items-center justify-center" style={{ background: c }}>
            <span className="font-mono text-[10px] font-semibold" style={{ color: lumPct(c) > 45 ? "#111" : "#fff" }}>{lumPct(c)}%</span>
          </div>
        ))}
      </div>
    </div>
  )
}

export function PerceptualUniformity() {
  const [L, setL] = useState(55)

  const hsl   = useMemo(() => HUES.map(x => hslToHex({ h: x.h, s: 75, l: L })), [L])
  const oklch = useMemo(() => HUES.map(x => oklchToHex({ l: L / 100, c: 0.13, h: x.h })), [L])

  return (
    <Panel>
      <div className="p-4 border-b border-border/60">
        <label className="flex items-center gap-3 text-[11px] text-muted-foreground">
          <span className="font-bold uppercase tracking-[0.14em]">Lightness</span>
          <input type="range" min={30} max={85} value={L} onChange={e => setL(+e.target.value)} className="w-56 accent-rose-500" />
          <span className="font-mono">{L}%</span>
        </label>
      </div>
      <div className="p-6 flex flex-col gap-5">
        <PuRow title="HSL — same L, six hues" row={hsl} sub="uneven" />
        <PuRow title="OKLCH — same L, six hues" row={oklch} sub="even" />
        <p className="text-[12px] text-muted-foreground leading-relaxed">
          Every swatch in a row claims the <em>same</em> lightness. In HSL the measured luminance lurches — yellow blinds, blue sinks —
          because HSL lightness is a math artefact, not a perceptual one. OKLCH is built on human vision, so the row reads evenly.
          That is why OKLCH/LCH scales look smoother and why a constant-lightness palette only behaves in a perceptual space.
        </p>
      </div>
    </Panel>
  )
}

// ════════════════════════════════════════════════════════════════════════════
// 14 · COLOR-BLINDNESS SIMULATION
// Re-render a palette + semantic pairs under each deficiency; flag collapses.
// ════════════════════════════════════════════════════════════════════════════

type CbType = "normal" | "deuteranopia" | "protanopia" | "tritanopia"
const CB_TYPES: { key: CbType; label: string }[] = [
  { key: "normal", label: "Normal" },
  { key: "deuteranopia", label: "Deuteranopia" },
  { key: "protanopia", label: "Protanopia" },
  { key: "tritanopia", label: "Tritanopia" },
]

function rgbDist(a: string, b: string) {
  const [r1, g1, b1] = hexToRgb(a), [r2, g2, b2] = hexToRgb(b)
  return Math.sqrt((r1 - r2) ** 2 + (g1 - g2) ** 2 + (b1 - b2) ** 2)
}

export function ColorblindSim() {
  const { system } = useColorSystem()
  const m = system.semMap
  const CAT = [at(system.primary, 500), at(m.success, 500), at(m.error, 500), at(m.warning, 500), at(m.info, 500), at(system.primary, 300)]
  const PAIRS = [
    { label: "Success vs Error", a: at(m.success, 500), b: at(m.error, 500) },
    { label: "Info vs Warning",  a: at(m.info, 500),    b: at(m.warning, 500) },
  ]
  const [type, setType] = useState<CbType>("deuteranopia")
  const sim = (hex: string) => simulateCb(hex, type)

  return (
    <Panel>
      <div className="p-4 border-b border-border/60">
        <Seg label="Simulate" value={type} onChange={setType} options={CB_TYPES} />
      </div>
      <div className="p-6 flex flex-col gap-6">
        {/* categorical palette under simulation */}
        <div>
          <p className="text-[10px] font-bold uppercase tracking-[0.14em] text-muted-foreground mb-2">Categorical palette</p>
          <div className="flex rounded-lg overflow-hidden border border-border/60">
            {CAT.map((c, i) => <div key={i} className="flex-1 h-12" style={{ background: sim(c) }} />)}
          </div>
        </div>

        {/* pair tests */}
        <div className="grid sm:grid-cols-2 gap-3">
          {PAIRS.map(p => {
            const d = rgbDist(sim(p.a), sim(p.b))
            const safe = d > 90
            return (
              <div key={p.label} className="rounded-xl border border-border/60 p-4">
                <div className="flex items-center justify-between mb-3">
                  <span className="text-[12px] text-foreground/80">{p.label}</span>
                  <span className="text-[10px] font-mono font-semibold px-2 py-0.5 rounded text-white" style={{ background: safe ? "#16a34a" : "#dc2626" }}>
                    {safe ? "DISTINCT" : "COLLAPSES"}
                  </span>
                </div>
                <div className="flex gap-2">
                  <div className="flex-1 h-10 rounded-md" style={{ background: sim(p.a) }} />
                  <div className="flex-1 h-10 rounded-md" style={{ background: sim(p.b) }} />
                </div>
              </div>
            )
          })}
        </div>
        <p className="text-[12px] text-muted-foreground leading-relaxed">
          Red/green is the classic trap — under deuteranopia and protanopia success and error converge, which is why color alone can never carry meaning.
          Blue/orange survives every deficiency: it differs in <em>lightness and warmth</em>, not just hue. Pick semantic pairs that stay apart on more than one axis.
        </p>
      </div>
    </Panel>
  )
}

// ════════════════════════════════════════════════════════════════════════════
// 15 · COLOR TEMPERATURE & MOOD  (warm vs cool neutrals)
// A few degrees of hue in the gray family resets the whole interface feeling.
// ════════════════════════════════════════════════════════════════════════════

const NL = [97, 93, 86, 76, 64, 50, 40, 30, 20, 12]
const TEMP_PRESETS = [
  { key: "cool", label: "Cool", h: 220, s: 9 },
  { key: "true", label: "True gray", h: 0, s: 0 },
  { key: "warm", label: "Warm", h: 32, s: 8 },
]

export function NeutralTemperature() {
  const { baseHsl } = useColorSystem()
  const [h, setH] = useState(Math.round(baseHsl.h))
  const [s, setS] = useState(9)

  const scale = useMemo(() => NL.map(l => hslToHex({ h, s, l })), [h, s])
  const mood = h >= 200 && h <= 260 ? "calm, technical, trustworthy"
            : h >= 20 && h <= 50    ? "warm, editorial, human"
            : s < 2                 ? "clinical, neutral, flat"
            : "distinct — use intentionally"

  return (
    <Panel>
      <div className="p-4 border-b border-border/60 flex flex-col gap-3">
        <div className="flex gap-2">
          {TEMP_PRESETS.map(p => (
            <button key={p.key} onClick={() => { setH(p.h); setS(p.s) }}
              className={`text-[12px] font-medium px-3 py-1.5 rounded-lg border transition-colors ${
                h === p.h && s === p.s ? "border-rose-500/50 bg-rose-500/10 text-accent"
                  : "border-border text-muted-foreground hover:text-foreground hover:border-foreground/30"}`}>
              {p.label}
            </button>
          ))}
        </div>
        <div className="flex flex-wrap gap-x-6 gap-y-2">
          <label className="flex items-center gap-3 text-[11px] text-muted-foreground">
            <span className="font-bold uppercase tracking-[0.14em]">Hue</span>
            <input type="range" min={0} max={359} value={h} onChange={e => setH(+e.target.value)} className="w-44 accent-rose-500" />
            <span className="font-mono">{h}°</span>
          </label>
          <label className="flex items-center gap-3 text-[11px] text-muted-foreground">
            <span className="font-bold uppercase tracking-[0.14em]">Saturation</span>
            <input type="range" min={0} max={16} value={s} onChange={e => setS(+e.target.value)} className="w-36 accent-rose-500" />
            <span className="font-mono">{s}%</span>
          </label>
        </div>
      </div>

      <div className="p-6 flex flex-col gap-5">
        <div className="flex rounded-lg overflow-hidden border border-border/60">
          {scale.map((c, i) => <div key={i} className="flex-1 h-12" style={{ background: c }} />)}
        </div>
        {/* mock surface */}
        <div className="rounded-xl p-5" style={{ background: scale[0], border: `1px solid ${scale[2]}` }}>
          <div className="rounded-lg p-4" style={{ background: "#ffffff", border: `1px solid ${scale[2]}` }}>
            <p className="text-[14px] font-semibold mb-1" style={{ color: scale[9] }}>Interface on a {h >= 200 ? "cool" : s < 2 ? "true" : "warm"} neutral</p>
            <p className="text-[12px] leading-relaxed" style={{ color: scale[5] }}>
              Mood: <span className="font-medium" style={{ color: scale[8] }}>{mood}</span>. The accent and content never changed — only the gray family did.
            </p>
          </div>
        </div>
        <p className="text-[12px] text-muted-foreground leading-relaxed">
          A 5–10° hue shift and a few percent of saturation in the neutrals is invisible stop-by-stop but unmistakable across a full screen.
          Cool grays feel engineered and calm; warm grays feel editorial and inviting. Pick the temperature to match the product&apos;s voice — and keep it consistent.
        </p>
      </div>
    </Panel>
  )
}
