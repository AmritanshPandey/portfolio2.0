"use client"

import { useMemo, useState } from "react"
import { IconArrowUpRight } from "@tabler/icons-react"
import { hexToRgb, normalizeHex, hexToHsl, hslToHex } from "@/lib/color"
import { at } from "@/lib/scale"
import { Panel, Seg } from "./ui"
import { useColorSystem } from "./context"

const rgbDist = (a: string, b: string) => {
  const [r1, g1, b1] = hexToRgb(a), [r2, g2, b2] = hexToRgb(b)
  return Math.sqrt((r1 - r2) ** 2 + (g1 - g2) ** 2 + (b1 - b2) ** 2)
}

// ════════════════════════════════════════════════════════════════════════════
// 19 · AUDIT EXISTING COLOR USAGE  (maps pasted values to the live token set)
// ════════════════════════════════════════════════════════════════════════════

export function ColorAudit() {
  const { system, name } = useColorSystem()
  const P = system.primary, N = system.neutral, m = system.semMap

  const TOKEN_SET = [
    { name: "neutral-50", hex: at(N, 50) }, { name: "neutral-200", hex: at(N, 200) },
    { name: "neutral-500", hex: at(N, 500) }, { name: "neutral-900", hex: at(N, 900) },
    { name: `${name}-600`, hex: at(P, 600) }, { name: `${name}-500`, hex: at(P, 500) },
    { name: "success-600", hex: at(m.success, 600) }, { name: "error-600", hex: at(m.error, 600) },
    { name: "warning-500", hex: at(m.warning, 500) },
  ]

  // Seed the textarea once with values relative to the current primary.
  const [raw, setRaw] = useState(() => {
    const b = hexToHsl(at(P, 600))
    const drift = hslToHex({ h: b.h, s: b.s, l: Math.min(100, b.l + 1.6) })
    const off = hslToHex({ h: (b.h + 42) % 360, s: b.s, l: b.l })
    return [at(P, 600), drift, off, at(N, 50), at(N, 900), "#ff0000", at(P, 500)].join("\n")
  })

  const rows = useMemo(() => {
    const hexes = (raw.match(/#?[0-9a-fA-F]{6}/g) ?? []).map(normalizeHex).filter(Boolean) as string[]
    return hexes.map(hex => {
      let best = TOKEN_SET[0], dist = Infinity
      for (const t of TOKEN_SET) { const d = rgbDist(hex, t.hex); if (d < dist) { dist = d; best = t } }
      const status = dist < 2 ? "exact" : dist < 16 ? "drift" : "off"
      return { hex, token: best, dist: Math.round(dist), status }
    })
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [raw, JSON.stringify(TOKEN_SET)])

  const counts = rows.reduce((a, r) => { a[r.status] = (a[r.status] ?? 0) + 1; return a }, {} as Record<string, number>)
  const STATUS: Record<string, { c: string; t: string }> = {
    exact: { c: "#16a34a", t: "exact" }, drift: { c: "#d97706", t: "drift → snap to token" }, off: { c: "#dc2626", t: "off-system" },
  }

  return (
    <Panel>
      <div className="grid md:grid-cols-2">
        <div className="p-5 border-b md:border-b-0 md:border-r border-border/60">
          <p className="text-[10px] font-bold uppercase tracking-[0.14em] text-muted-foreground mb-2">Paste values from code / Figma</p>
          <textarea value={raw} onChange={e => setRaw(e.target.value)} spellCheck={false} rows={9}
            className="w-full font-mono text-[12px] bg-background border border-border rounded-lg p-3 text-foreground focus:border-rose-500/60 outline-none resize-none" />
          <div className="flex gap-3 mt-3 text-[11px]">
            {Object.entries(STATUS).map(([k, v]) => (
              <span key={k} className="flex items-center gap-1.5 text-muted-foreground">
                <span className="w-2 h-2 rounded-full" style={{ background: v.c }} />{k} {counts[k] ?? 0}
              </span>
            ))}
          </div>
        </div>
        <div className="p-5 max-h-[340px] overflow-y-auto">
          <p className="text-[10px] font-bold uppercase tracking-[0.14em] text-muted-foreground mb-3">Mapped to nearest token</p>
          <div className="flex flex-col gap-1.5">
            {rows.map((r, i) => (
              <div key={i} className="flex items-center gap-2.5 text-[11px]">
                <span className="w-5 h-5 rounded border border-border/60 shrink-0" style={{ background: r.hex }} />
                <span className="font-mono text-foreground/80">{r.hex}</span>
                <span className="text-muted-foreground">→</span>
                <span className="w-4 h-4 rounded border border-border/60 shrink-0" style={{ background: r.token.hex }} />
                <span className="font-mono text-foreground/70">{r.token.name}</span>
                <span className="ml-auto font-mono text-[10px] px-1.5 py-0.5 rounded text-white" style={{ background: STATUS[r.status].c }}>{STATUS[r.status].t}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
      <p className="px-5 pb-5 text-[12px] text-muted-foreground leading-relaxed">
        The audit is the gap between what the system <em>says</em> and what shipped code actually uses. “Drift” values are near-duplicates that should snap to a token; “off-system” values need a decision — adopt, replace, or document as an exception.
      </p>
    </Panel>
  )
}

// ════════════════════════════════════════════════════════════════════════════
// 20 · FIGMA VARIABLE SETUP  (collections · modes · scoping, from the system)
// ════════════════════════════════════════════════════════════════════════════

export function FigmaVariables() {
  const { system, name } = useColorSystem()
  const P = system.primary, N = system.neutral
  const [mode, setMode] = useState<"light" | "dark">("light")

  const PRIMITIVES = [
    { name: `${name}/600`, hex: at(P, 600) }, { name: "gray/50", hex: at(N, 50) },
    { name: "gray/900", hex: at(N, 900) }, { name: "gray/200", hex: at(N, 200) },
  ]
  const SEMANTIC = [
    { name: "action",  light: `${name}/600`, dark: `${name}/400`, lh: at(P, 600), dh: at(P, 400), scope: "Fill, Stroke" },
    { name: "surface", light: "gray/50",      dark: "gray/900",     lh: at(N, 50),  dh: at(N, 900), scope: "Fill" },
    { name: "text",    light: "gray/900",     dark: "gray/50",      lh: at(N, 900), dh: at(N, 50),  scope: "Text" },
    { name: "border",  light: "gray/200",     dark: "gray/800",     lh: at(N, 200), dh: at(N, 800), scope: "Stroke" },
  ]

  return (
    <Panel>
      <div className="p-4 border-b border-border/60">
        <Seg label="Mode" value={mode} onChange={setMode} options={[{ key: "light", label: "Light" }, { key: "dark", label: "Dark" }]} />
      </div>
      <div className="grid md:grid-cols-2">
        <div className="p-5 border-b md:border-b-0 md:border-r border-border/60">
          <div className="flex items-center justify-between mb-3">
            <p className="text-[12px] font-semibold text-foreground">Primitives</p>
            <span className="text-[10px] font-mono text-muted-foreground">1 collection · no modes</span>
          </div>
          <div className="flex flex-col gap-1.5">
            {PRIMITIVES.map(p => (
              <div key={p.name} className="flex items-center gap-2.5 text-[11px]">
                <span className="w-4 h-4 rounded border border-border/60" style={{ background: p.hex }} />
                <span className="font-mono text-foreground/80">{p.name}</span>
                <span className="font-mono text-muted-foreground/60 ml-auto">{p.hex}</span>
              </div>
            ))}
          </div>
        </div>
        <div className="p-5">
          <div className="flex items-center justify-between mb-3">
            <p className="text-[12px] font-semibold text-foreground">Semantic</p>
            <span className="text-[10px] font-mono text-muted-foreground">1 collection · Light / Dark modes</span>
          </div>
          <div className="flex flex-col gap-1.5">
            {SEMANTIC.map(s => (
              <div key={s.name} className="flex items-center gap-2.5 text-[11px]">
                <span className="w-4 h-4 rounded border border-border/60" style={{ background: mode === "light" ? s.lh : s.dh }} />
                <span className="font-mono text-foreground/80 w-16">{s.name}</span>
                <span className="font-mono text-accent">→ {mode === "light" ? s.light : s.dark}</span>
                <span className="text-muted-foreground/60 ml-auto text-[10px]">{s.scope}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
      <p className="px-5 pb-5 text-[12px] text-muted-foreground leading-relaxed">
        Primitives are the raw scale in one mode-less collection. Semantic tokens live in a separate collection with <strong className="text-foreground/80 font-medium">Light/Dark modes</strong> and alias the primitives — flip the mode and every alias re-points. <strong className="text-foreground/80 font-medium">Scoping</strong> restricts where each variable can be applied (a text token can&apos;t be picked as a fill), which is how the structure survives contact with a real file.
      </p>
    </Panel>
  )
}

// ════════════════════════════════════════════════════════════════════════════
// 21 · RECOMMENDED TOOLS
// ════════════════════════════════════════════════════════════════════════════

const TOOLS = [
  { name: "Huemint", tag: "generate", url: "https://huemint.com", good: "AI palettes conditioned on context (brand, web, logo). Great for unexpected harmonies.", short: "Not token-aware; won't build an accessible 11-stop scale for you." },
  { name: "Coolors", tag: "generate", url: "https://coolors.co", good: "Fast palette ideation, spacebar to iterate, easy export.", short: "Five-swatch thinking; no perceptual scale, no contrast structure." },
  { name: "Reasonable Colors", tag: "scales", url: "https://reasonable.work/colors", good: "WCAG-locked palettes where every step pairs predictably for AA.", short: "Opinionated, limited hue set — less a generator than a curated system." },
  { name: "Radix Colors", tag: "scales", url: "https://www.radix-ui.com/colors", good: "12-step scales with built-in light/dark + semantic step roles (1–12).", short: "Fixed hues; you adopt their system rather than build your own." },
  { name: "APCA Contrast", tag: "contrast", url: "https://www.myndex.com/APCA/", good: "Perceptual contrast (the WCAG 3 direction) — far better for text than 2.x ratios.", short: "Not yet a conformance standard; mental model differs from 4.5:1." },
  { name: "OKLCH.com", tag: "contrast", url: "https://oklch.com", good: "Perceptual picker; build even, predictable scales and see gamut clipping.", short: "A picker, not a full token pipeline." },
]
const TOOL_FILTERS = [
  { key: "all", label: "All" }, { key: "generate", label: "Generate" },
  { key: "scales", label: "Accessible scales" }, { key: "contrast", label: "Contrast / space" },
]

export function RecommendedTools() {
  const [f, setF] = useState("all")
  const list = f === "all" ? TOOLS : TOOLS.filter(t => t.tag === f)
  return (
    <Panel>
      <div className="p-4 border-b border-border/60">
        <Seg label="Use case" value={f} onChange={setF} options={TOOL_FILTERS} />
      </div>
      <div className="p-5 grid sm:grid-cols-2 gap-3">
        {list.map(t => (
          <a key={t.name} href={t.url} target="_blank" rel="noopener noreferrer"
            className="group rounded-xl border border-border/60 p-4 hover:border-rose-500/30 transition-colors">
            <div className="flex items-center gap-1.5 mb-2">
              <span className="text-[14px] font-semibold text-foreground group-hover:text-rose-600 dark:group-hover:text-rose-400 transition-colors">{t.name}</span>
              <IconArrowUpRight size={13} className="text-muted-foreground" />
            </div>
            <p className="text-[12px] text-foreground/75 leading-relaxed mb-2"><span className="text-green-600 dark:text-green-400 font-medium">Good for · </span>{t.good}</p>
            <p className="text-[12px] text-muted-foreground leading-relaxed"><span className="text-amber-600 dark:text-amber-400 font-medium">Falls short · </span>{t.short}</p>
          </a>
        ))}
      </div>
    </Panel>
  )
}

// ════════════════════════════════════════════════════════════════════════════
// 22 · GETTING BUY-IN
// ════════════════════════════════════════════════════════════════════════════

const OBJECTIONS = [
  { say: "“Can we make it more vibrant?”", reframe: "What outcome are we after — attention, or conversion? Higher saturation draws the eye but drops text contrast below AA. Here's the trade and where vibrance actually helps." },
  { say: "“I don't like this blue.”", reframe: "Brand hue should encode the feeling we want — trust vs. energy — and pass contrast and semantic-neutrality. Let's choose against those criteria, not preference." },
  { say: "“Competitor X uses purple — let's stand out.”", reframe: "Differentiation is fair, if the hue still clears accessibility and doesn't collide with our error/success colors. Let's run it through the four criteria first." },
  { say: "“Make the buttons pop.”", reframe: "Pop is contrast plus restraint. If every button pops, none does. Let's define the single primary action per screen and let the rest recede." },
]

export function GettingBuyIn() {
  const [open, setOpen] = useState<number | null>(0)
  return (
    <Panel>
      <div className="p-5 flex flex-col gap-2.5">
        {OBJECTIONS.map((o, i) => (
          <button key={i} onClick={() => setOpen(open === i ? null : i)}
            className="text-left rounded-xl border border-border/60 p-4 hover:border-rose-500/25 transition-colors">
            <div className="flex items-center gap-3">
              <span className="text-[13px] font-medium text-foreground/85">{o.say}</span>
              <span className="ml-auto text-[11px] font-mono text-rose-600 dark:text-rose-400 shrink-0">{open === i ? "− reframe" : "+ reframe"}</span>
            </div>
            {open === i && (
              <p className="text-[13px] text-muted-foreground leading-relaxed mt-3 pt-3 border-t border-border/50">{o.reframe}</p>
            )}
          </button>
        ))}
        <p className="text-[12px] text-muted-foreground leading-relaxed mt-1">
          Color decisions get overridden when they&apos;re framed as taste — because taste is arguable. Reframe every one as a user outcome (contrast, attention, recognition, accessibility) and the conversation moves from “I prefer” to “users will.”
        </p>
      </div>
    </Panel>
  )
}

// ════════════════════════════════════════════════════════════════════════════
// 23 · THE "ONE-OFF" PROBLEM  (system scale = your generated primary)
// ════════════════════════════════════════════════════════════════════════════

export function OneOffProblem() {
  const { system, baseHsl } = useColorSystem()
  const SYSTEM_SCALE = system.primary.map(s => s.hex)
  const [oneOffs, setOneOffs] = useState<string[]>([])

  const addOneOff = () => {
    const h = baseHsl.h + (Math.random() * 24 - 12)
    const s = Math.max(20, baseHsl.s + (Math.random() * 20 - 10))
    const l = 42 + (Math.random() * 22 - 11)
    setOneOffs(o => [...o, hslToHex({ h, s, l })])
  }

  const redundant = oneOffs.filter((c, i) => oneOffs.some((d, j) => j < i && rgbDist(c, d) < 18)).length

  return (
    <Panel>
      <div className="grid md:grid-cols-2">
        <div className="p-5 border-b md:border-b-0 md:border-r border-border/60">
          <div className="flex items-center justify-between mb-3">
            <p className="text-[12px] font-semibold text-foreground">Ad-hoc “just this once”</p>
            <button onClick={addOneOff} className="text-[11px] font-medium px-2.5 py-1 rounded-md border border-border hover:border-rose-500/40 hover:text-rose-600 dark:hover:text-rose-400 transition-colors">+ add a one-off</button>
          </div>
          <div className="flex flex-wrap gap-1.5 min-h-[72px]">
            {oneOffs.length === 0 && <span className="text-[12px] text-muted-foreground">Click “add a one-off” a few times…</span>}
            {oneOffs.map((c, i) => <span key={i} className="w-7 h-7 rounded-md border border-border/60" style={{ background: c }} title={c} />)}
          </div>
          {oneOffs.length > 0 && (
            <div className="flex items-center gap-3 mt-3 text-[11px]">
              <span className="text-muted-foreground">{oneOffs.length} custom colors</span>
              {redundant > 0 && <span className="font-mono px-1.5 py-0.5 rounded text-white" style={{ background: "#dc2626" }}>{redundant} visually redundant</span>}
              <button onClick={() => setOneOffs([])} className="ml-auto text-muted-foreground hover:text-foreground underline">reset</button>
            </div>
          )}
        </div>
        <div className="p-5">
          <p className="text-[12px] font-semibold text-foreground mb-3">One well-ranged scale</p>
          <div className="flex rounded-lg overflow-hidden border border-border/60">
            {SYSTEM_SCALE.map((c, i) => <div key={i} className="flex-1 h-9" style={{ background: c }} />)}
          </div>
          <p className="text-[11px] text-muted-foreground mt-3 leading-relaxed">
            11 stops already span every tint and shade anyone reaches for. There&apos;s no gap to “fill” with a custom value.
          </p>
        </div>
      </div>
      <p className="px-5 pb-5 text-[12px] text-muted-foreground leading-relaxed">
        Designers add one-offs because the system feels like it&apos;s missing a step — so they eyeball “close enough,” and the palette quietly fragments into dozens of near-duplicates nobody can maintain. The fix isn&apos;t discipline alone; it&apos;s a scale with enough range that the temptation never arises.
      </p>
    </Panel>
  )
}
