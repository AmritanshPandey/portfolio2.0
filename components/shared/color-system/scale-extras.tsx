"use client"

import { useState } from "react"
import { IconCheck, IconCopy } from "@tabler/icons-react"
import { contrast } from "@/lib/color"

// Stops arrive from the generator (Swatch[] is structurally compatible).
export interface Stop { stop: number; hex: string }

const hx = (s: Stop[], stop: number) => s.find(x => x.stop === stop)?.hex ?? "#000000"

function useCopy() {
  const [copied, setCopied] = useState<string | null>(null)
  const copy = (v: string, k: string) => {
    navigator.clipboard?.writeText(v)
    setCopied(k)
    window.setTimeout(() => setCopied(c => (c === k ? null : c)), 1300)
  }
  return { copied, copy }
}

function CopyBtn({ onClick, active, label }: { onClick: () => void; active: boolean; label: string }) {
  return (
    <button onClick={onClick}
      className="flex items-center gap-1.5 text-[12px] font-medium px-3 py-2 rounded-lg border border-border hover:border-orange-500/40 hover:text-orange-600 dark:hover:text-orange-400 transition-colors">
      {active ? <IconCheck size={13} /> : <IconCopy size={13} />}{label}
    </button>
  )
}

// ════════════════════════════════════════════════════════════════════════════
// CONTRAST CHECKER + COMBINATION TESTER
// ════════════════════════════════════════════════════════════════════════════

export function ContrastChecker({ scale }: { scale: Stop[] }) {
  const opts = [
    { key: "white", label: "White", hex: "#ffffff" },
    { key: "black", label: "Black", hex: "#111111" },
    ...scale.map(s => ({ key: String(s.stop), label: String(s.stop), hex: s.hex })),
  ]
  const find = (k: string) => opts.find(o => o.key === k)!
  const [fg, setFg] = useState("white")
  const [bg, setBg] = useState("500")

  const fgHex = find(fg).hex, bgHex = find(bg).hex
  const ratio = contrast(fgHex, bgHex)

  const badges = [
    { label: "AA · normal", pass: ratio >= 4.5 },
    { label: "AAA · normal", pass: ratio >= 7 },
    { label: "AA · large", pass: ratio >= 3 },
  ]

  const optionEls = opts.map(o => <option key={o.key} value={o.key}>{o.label} · {o.hex}</option>)

  return (
    <div className="flex flex-col gap-5">
      <div className="flex flex-wrap items-end gap-4">
        <label className="flex flex-col gap-1">
          <span className="text-[10px] font-bold uppercase tracking-[0.14em] text-muted-foreground">Foreground</span>
          <select value={fg} onChange={e => setFg(e.target.value)}
            className="font-mono text-[12px] bg-background border border-border rounded-md px-2.5 py-1.5 text-foreground focus:border-orange-500/60 outline-none">
            {optionEls}
          </select>
        </label>
        <label className="flex flex-col gap-1">
          <span className="text-[10px] font-bold uppercase tracking-[0.14em] text-muted-foreground">Background</span>
          <select value={bg} onChange={e => setBg(e.target.value)}
            className="font-mono text-[12px] bg-background border border-border rounded-md px-2.5 py-1.5 text-foreground focus:border-orange-500/60 outline-none">
            {optionEls}
          </select>
        </label>
        <div className="flex flex-col gap-1">
          <span className="text-[10px] font-bold uppercase tracking-[0.14em] text-muted-foreground">Ratio</span>
          <span className="font-mono text-[20px] font-semibold text-foreground leading-none py-0.5">{ratio.toFixed(2)}:1</span>
        </div>
        <div className="flex gap-2">
          {badges.map(b => (
            <span key={b.label} className="text-[10px] font-mono font-semibold px-2 py-1 rounded text-white" style={{ background: b.pass ? "#16a34a" : "#dc2626" }}>
              {b.pass ? "✓" : "✕"} {b.label}
            </span>
          ))}
        </div>
      </div>

      {/* rendered samples */}
      <div className="rounded-xl border border-border/60 p-5 flex flex-col gap-3" style={{ background: bgHex }}>
        {[14, 16, 24].map(px => (
          <p key={px} style={{ color: fgHex, fontSize: px }} className="leading-snug">
            The quick brown fox <span className="opacity-60">— {px}px</span>
          </p>
        ))}
      </div>
      <p className="text-[12px] text-muted-foreground leading-relaxed">
        WCAG AA needs 4.5:1 for normal text, 3:1 for large (≥18px or ≥14px bold). AAA needs 7:1. Test the exact pairs before committing them to tokens — a pair that fails here will fail in production.
      </p>
    </div>
  )
}

// ════════════════════════════════════════════════════════════════════════════
// TOKEN MAPPER — stops → semantic roles, CSS + Figma/W3C JSON
// ════════════════════════════════════════════════════════════════════════════

const ROLES: { role: string; stop: number; use: string }[] = [
  { role: "surface",       stop: 50,  use: "subtle background fill" },
  { role: "surface-hover", stop: 100, use: "hovered surface" },
  { role: "border",        stop: 200, use: "component border" },
  { role: "solid",         stop: 500, use: "primary fill / CTA" },
  { role: "solid-hover",   stop: 400, use: "hovered fill" },
  { role: "solid-active",  stop: 600, use: "pressed / active" },
  { role: "text",          stop: 700, use: "accent text on light" },
  { role: "text-strong",   stop: 900, use: "max-contrast text" },
]

export function TokenMapper({ scale, name }: { scale: Stop[]; name: string }) {
  const { copied, copy } = useCopy()
  const rows = ROLES.map(r => ({ ...r, hex: hx(scale, r.stop) }))

  const css = ":root {\n" + rows.map(r => `  --color-${name}-${r.role}: ${r.hex};`).join("\n") + "\n}"
  const json = JSON.stringify(
    { [name]: Object.fromEntries(rows.map(r => [r.role, { $type: "color", $value: r.hex }])) },
    null, 2,
  )

  return (
    <div className="flex flex-col gap-5">
      <div className="rounded-xl border border-border/60 overflow-hidden">
        {rows.map(r => (
          <div key={r.role} className="flex items-center gap-3 px-4 py-2.5 border-b border-border/60 last:border-0">
            <span className="w-6 h-6 rounded border border-border/60 shrink-0" style={{ background: r.hex }} />
            <span className="font-mono text-[12px] text-foreground">{name}-{r.role}</span>
            <span className="font-mono text-[11px] text-muted-foreground">{r.stop}</span>
            <span className="text-[11px] text-muted-foreground/70 ml-auto hidden sm:block">{r.use}</span>
            <span className="font-mono text-[11px] text-muted-foreground">{r.hex}</span>
          </div>
        ))}
      </div>
      <div className="flex flex-wrap gap-2.5">
        <CopyBtn onClick={() => copy(css, "css")} active={copied === "css"} label="Copy CSS custom properties" />
        <CopyBtn onClick={() => copy(json, "json")} active={copied === "json"} label="Copy Figma / W3C token JSON" />
      </div>
      <p className="text-[12px] text-muted-foreground leading-relaxed">
        Components consume these role names, never the raw stops — so re-pointing a role (e.g. <code className="font-mono text-[11px]">solid → 600</code>) restyles every component at once. The JSON imports straight into Figma variable plugins that accept the W3C token format.
      </p>
    </div>
  )
}

// ════════════════════════════════════════════════════════════════════════════
// DARK-MODE MAPPER — derive the dark token map from accent + neutral
// ════════════════════════════════════════════════════════════════════════════

const DARK_MAP: { role: string; src: "n" | "a"; light: number; dark: number }[] = [
  { role: "background",  src: "n", light: 100, dark: 950 },
  { role: "surface",     src: "n", light: 50,  dark: 900 },
  { role: "border",      src: "n", light: 200, dark: 800 },
  { role: "text",        src: "n", light: 900, dark: 50 },
  { role: "text-muted",  src: "n", light: 500, dark: 400 },
  { role: "accent",      src: "a", light: 600, dark: 500 },
  { role: "accent-text", src: "a", light: 700, dark: 400 },
]

export function DarkModeMapper({ accent, neutral }: { accent: Stop[]; neutral: Stop[] }) {
  const { copied, copy } = useCopy()
  const [mode, setMode] = useState<"light" | "dark">("dark")
  const pick = (src: "n" | "a", stop: number) => hx(src === "n" ? neutral : accent, stop)
  const v = (role: string) => {
    const m = DARK_MAP.find(r => r.role === role)!
    return pick(m.src, mode === "light" ? m.light : m.dark)
  }

  const darkCss = ".dark {\n" + DARK_MAP.map(r => `  --color-${r.role}: ${pick(r.src, r.dark)};`).join("\n") + "\n}"

  return (
    <div className="flex flex-col gap-5">
      <div className="flex gap-2">
        {(["light", "dark"] as const).map(m => (
          <button key={m} onClick={() => setMode(m)} aria-pressed={mode === m}
            className={`text-[12px] font-medium px-3 py-1.5 rounded-lg border transition-colors capitalize ${
              mode === m ? "border-orange-500/50 bg-orange-500/10 text-accent"
                : "border-border text-muted-foreground hover:text-foreground hover:border-foreground/30"}`}>
            {m}
          </button>
        ))}
      </div>

      <div className="grid md:grid-cols-2 gap-4">
        {/* remap table */}
        <div className="rounded-xl border border-border/60 overflow-hidden">
          {DARK_MAP.map(r => {
            const active = mode === "light" ? r.light : r.dark
            return (
              <div key={r.role} className="flex items-center gap-2.5 px-3.5 py-2 border-b border-border/60 last:border-0 text-[11px]">
                <span className="w-4 h-4 rounded border border-border/60 shrink-0" style={{ background: pick(r.src, active) }} />
                <span className="font-mono text-foreground/80 w-24">{r.role}</span>
                <span className="font-mono text-accent">{r.src === "n" ? "neutral" : "accent"}-{active}</span>
                <span className="font-mono text-muted-foreground/50 ml-auto">{r.light}→{r.dark}</span>
              </div>
            )
          })}
        </div>
        {/* live mock */}
        <div className="rounded-xl p-4 transition-colors duration-300" style={{ background: v("background"), border: `1px solid ${v("border")}` }}>
          <div className="rounded-lg p-4 transition-colors duration-300" style={{ background: v("surface"), border: `1px solid ${v("border")}` }}>
            <p className="text-[13px] font-semibold mb-1 transition-colors duration-300" style={{ color: v("text") }}>Same tokens, both modes</p>
            <p className="text-[11px] leading-relaxed mb-3 transition-colors duration-300" style={{ color: v("text-muted") }}>The role names never change — only the stop each resolves to.</p>
            <button className="text-[12px] font-medium px-3 py-1.5 rounded-md text-white transition-colors duration-300" style={{ background: v("accent") }}>Action</button>
            <span className="text-[12px] font-medium ml-3 transition-colors duration-300" style={{ color: v("accent-text") }}>Link →</span>
          </div>
        </div>
      </div>

      <CopyBtn onClick={() => copy(darkCss, "dark")} active={copied === "dark"} label="Copy dark-mode CSS" />
      <p className="text-[12px] text-muted-foreground leading-relaxed">
        Dark mode is a remap, not an invert: the darkest neutral becomes the background, the lightest becomes the text, and the accent steps one stop lighter to hold its contrast on the new surface.
      </p>
    </div>
  )
}
