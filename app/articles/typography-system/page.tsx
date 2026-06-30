"use client"

import { useMemo, useState } from "react"
import { articleItems } from "@/lib/data"
import { ArticleHeader, RelatedArticles } from "@/components/articles/article-ui"
import { FadeIn } from "@/components/shared/fade-in"
import { ReadingProgress } from "@/components/shared/reading-progress"

const HREF = "/articles/typography-system"

const F = {
  serif:    "'Playfair Display', Georgia, serif",
  sans:     "'Inter', system-ui, sans-serif",
  mono:     "'DM Mono', 'Courier New', monospace",
  lora:     "'Lora', Georgia, serif",
  grotesk:  "'Space Grotesk', system-ui, sans-serif",
  fraunces: "'Fraunces', Georgia, serif",
  poppins:  "'Poppins', system-ui, sans-serif",
  lato:     "'Lato', system-ui, sans-serif",
}

// ─── DATA ─────────────────────────────────────────────────────────────────────

const TYPE_SHOW = [
  { word: "Readability", font: F.serif,  weight: 600, style: "normal", lbl: "The first job",
    desc: "Before personality, text must be effortless to read. Size, measure, line height, and contrast come first." },
  { word: "Personality", font: F.sans,   weight: 600, style: "normal", lbl: "The second job",
    desc: "A geometric sans reads precise and modern; a humanist serif warm and editorial. Voice supports brand without costing legibility." },
  { word: "Hierarchy",   font: F.mono,   weight: 500, style: "normal", lbl: "The structure",
    desc: "Size, weight, color, and space let users tell a heading from body, a label from a value — without reading a word." },
  { word: "Function",    font: F.lora,   weight: 400, style: "italic", lbl: "The discipline",
    desc: "Every style answers one question: what is its job? Tokens named by role keep that discipline across every screen." },
]

const CLASSES = [
  { spec: F.lora,     size: 52, name: "Serif",      font: "Lora · Georgia · Times",
    desc: "Traditional, authoritative, editorial. Excellent for long-form reading.",       traits: ["Editorial", "Trustworthy", "Long-form"] },
  { spec: F.sans,     size: 52, name: "Sans-serif",  font: "Inter · Helvetica · Arial",
    desc: "Clean, neutral, modern. The UI default, legible at small sizes.",               traits: ["Modern", "Neutral", "UI default"] },
  { spec: F.grotesk,  size: 52, name: "Grotesk",     font: "Space Grotesk · Founders",
    desc: "Slightly mechanical forms. Confident and characterful without serifs.",          traits: ["Confident", "Characterful", "Brand"] },
  { spec: F.poppins,  size: 52, name: "Geometric",   font: "Poppins · Futura · Circular",
    desc: "Built from circles and lines. Precise and friendly in headings, tiring in body.", traits: ["Precise", "Friendly", "Display-leaning"] },
  { spec: F.lato,     size: 52, name: "Humanist",    font: "Lato · Frutiger · Source Sans",
    desc: "Calligraphic warmth and open apertures. The most readable sans.",                traits: ["Warm", "Readable", "Accessible"] },
  { spec: F.mono,     size: 42, name: "Monospace",   font: "DM Mono · JetBrains · SF Mono",
    desc: "Equal-width characters. Essential for code, data, and tabular numbers.",        traits: ["Code", "Tabular", "Technical"] },
  { spec: F.serif,    size: 52, name: "Display",     font: "Playfair · Fraunces · Canela",
    desc: "Built for large sizes and impact. Hero moments only — never body or labels.",    traits: ["Impact", "Hero-only", "Expressive"] },
  { spec: F.fraunces, size: 52, name: "Variable",    font: "Fraunces · Inter · Recursive",
    desc: "One file, continuous axes. Smaller payloads, fluid weights, optical sizing.",   traits: ["One file", "Fluid axes", "Performance"] },
]

const SCALE_ROLES = [
  { key: "display",  name: "Display",     exp: 7,  lh: 1.04, ls: -0.02,  sample: "Display" },
  { key: "h1",       name: "Heading 1",   exp: 6,  lh: 1.08, ls: -0.02,  sample: "Heading One" },
  { key: "h2",       name: "Heading 2",   exp: 5,  lh: 1.12, ls: -0.015, sample: "Heading Two" },
  { key: "h3",       name: "Heading 3",   exp: 4,  lh: 1.18, ls: -0.01,  sample: "Heading Three" },
  { key: "h4",       name: "Heading 4",   exp: 3,  lh: 1.25, ls: -0.005, sample: "Heading Four" },
  { key: "h5",       name: "Heading 5",   exp: 2,  lh: 1.3,  ls: 0,      sample: "Heading Five" },
  { key: "body-lg",  name: "Body Large",  exp: 1,  lh: 1.6,  ls: 0,      sample: "Larger body copy for intros" },
  { key: "body",     name: "Body",        exp: 0,  lh: 1.65, ls: 0,      sample: "Default body text for reading" },
  { key: "small",    name: "Small",       exp: -1, lh: 1.5,  ls: 0,      sample: "Secondary and supporting text" },
  { key: "caption",  name: "Caption",     exp: -2, lh: 1.45, ls: 0.01,   sample: "Captions, metadata, footnotes" },
]

const SCALE_PRESETS = [
  { name: "Minor Third",   r: 1.2 },
  { name: "Major Third",   r: 1.25 },
  { name: "Perfect Fourth",r: 1.333 },
  { name: "Aug. Fourth",   r: 1.414 },
  { name: "Golden Ratio",  r: 1.618 },
]

const PAIRS = [
  { name: "Editorial", h: F.serif,    b: F.sans,  hw: 400, hs: "italic" as const, note: "Display serif + humanist sans" },
  { name: "Modern UI", h: F.sans,     b: F.sans,  hw: 700, hs: "normal" as const, note: "One grotesk, two weights" },
  { name: "Technical", h: F.grotesk,  b: F.mono,  hw: 500, hs: "normal" as const, note: "Grotesk + monospace" },
  { name: "Literary",  h: F.fraunces, b: F.lora,  hw: 600, hs: "normal" as const, note: "Display serif + reading serif" },
  { name: "Geometric", h: F.poppins,  b: F.lato,  hw: 600, hs: "normal" as const, note: "Geometric + humanist sans" },
]

const PRINCIPLES = [
  { num: "01", title: "Design for reading first",  body: "Personality is earned only after text is effortless to read. Measure, size, and contrast come before voice." },
  { num: "02", title: "Consistency beats novelty", body: "A predictable scale used everywhere reads as quality. 'Just one more size' is how systems rot." },
  { num: "03", title: "Contrast creates hierarchy",body: "Order comes from decisive difference in size, weight, or color — not from making everything large." },
  { num: "04", title: "Spacing is typography",     body: "Line height, paragraph spacing, and measure shape readability as much as the letterforms." },
  { num: "05", title: "Typography is interface",   body: "In most products, text is the interface. Treat the type system as core architecture." },
  { num: "06", title: "Restraint scales",          body: "Two families, a few sizes, two weights covers nearly every interface and stays maintainable." },
]

const LEGIBILITY = [
  { font: F.sans, name: "Inter · clear apertures" },
  { font: F.lato, name: "Lato · humanist, open" },
  { font: F.mono, name: "DM Mono · disambiguated" },
]

// ─── PRIMITIVES ───────────────────────────────────────────────────────────────

function Section({ id, children, muted }: {
  id?: string; children: React.ReactNode; muted?: boolean
}) {
  return (
    <section id={id} className={`border-b border-border/40 ${muted ? "bg-muted/30" : "bg-background"}`}>
      <div className="max-w-4xl mx-auto px-5 py-12 sm:px-6 md:py-18">{children}</div>
    </section>
  )
}

function Eyebrow({ num, tag }: { num: string; tag: string }) {
  return (
    <div className="mb-4 font-mono text-[11px] text-muted-foreground">
      <span className="tabular-nums text-foreground/40">{num}</span>
      <span className="mx-2 text-border">/</span>
      {tag}
    </div>
  )
}

function Title({ children }: { children: React.ReactNode }) {
  return (
    <h2 className="text-2xl md:text-[2rem] font-bold tracking-tight leading-[1.12] text-foreground mb-3">
      {children}
    </h2>
  )
}

function Lede({ children }: { children: React.ReactNode }) {
  return (
    <p className="text-[15px] leading-[1.75] text-muted-foreground max-w-[58ch] mb-8">
      {children}
    </p>
  )
}

function CopyButton({ text, className = "" }: { text: string; className?: string }) {
  const [done, setDone] = useState(false)
  return (
    <button
      type="button"
      onClick={() => {
        if (navigator.clipboard) navigator.clipboard.writeText(text).catch(() => {})
        setDone(true)
        setTimeout(() => setDone(false), 1300)
      }}
      className={`font-mono text-[10px] uppercase tracking-[0.08em] rounded-md border px-3 py-1.5 transition-colors ${
        done
          ? "border-accent text-accent"
          : "border-border text-muted-foreground hover:border-accent hover:text-accent"
      } ${className}`}
    >
      {done ? "Copied ✓" : "Copy"}
    </button>
  )
}

function ToolHead({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex flex-col items-stretch gap-4 border-b border-border/60 px-4 py-4 sm:flex-row sm:flex-wrap sm:items-center sm:gap-x-8 sm:px-5">
      {children}
    </div>
  )
}

function CtlLabel({ children }: { children: React.ReactNode }) {
  return <span className="font-mono text-[10px] uppercase tracking-[0.12em] text-muted-foreground">{children}</span>
}

function Chip({ active, onClick, children }: {
  active?: boolean; onClick: () => void; children: React.ReactNode
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`shrink-0 font-mono text-[11px] rounded-lg border px-3 py-1.5 transition-colors ${
        active
          ? "border-accent text-accent bg-accent/[0.08]"
          : "border-border text-muted-foreground hover:text-foreground hover:border-muted-foreground/60"
      }`}
    >
      {children}
    </button>
  )
}

// ─── TOOLS ────────────────────────────────────────────────────────────────────

function ModularScaleTool() {
  const [base, setBase] = useState(16)
  const [ratio, setRatio] = useState(1.25)
  const [fmt, setFmt] = useState<"CSS" | "Tailwind">("CSS")

  const sizeFor = (exp: number) => base * Math.pow(ratio, exp)

  const tokens = useMemo(() => {
    if (fmt === "CSS") {
      const lines = [":root {"]
      SCALE_ROLES.forEach(r => {
        lines.push(`  --text-${r.key}: ${Math.round(sizeFor(r.exp))}px;`)
        lines.push(`  --leading-${r.key}: ${r.lh};`)
      })
      lines.push("}")
      return lines.join("\n")
    }
    const lines = ["fontSize: {"]
    SCALE_ROLES.forEach(r => {
      lines.push(`  '${r.key}': ['${Math.round(sizeFor(r.exp))}px', { lineHeight: '${r.lh}' }],`)
    })
    lines.push("}")
    return lines.join("\n")
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [base, ratio, fmt])

  return (
    <>
      <ToolHead>
        <div className="flex flex-col gap-2">
          <CtlLabel>Base size</CtlLabel>
          <div className="flex items-center gap-2">
            <input
              type="number" min={12} max={22} step={1} value={base}
              onChange={e => setBase(Math.max(12, Math.min(22, Number(e.target.value) || 16)))}
              className="w-20 font-mono text-[13px] bg-background border border-border rounded-md px-2.5 py-1.5 text-foreground outline-none focus:border-accent"
            />
            <span className="font-mono text-[11px] text-muted-foreground">px</span>
          </div>
        </div>
        <div className="flex flex-col gap-2">
          <CtlLabel>Ratio</CtlLabel>
          <div className="flex items-center gap-3">
            <input
              type="range" min={1.1} max={1.7} step={0.001} value={ratio}
              onChange={e => setRatio(Number(e.target.value))}
              className="w-full max-w-36 accent-rose-500"
            />
            <span className="font-mono text-[13px] text-accent w-12">{ratio.toFixed(3)}</span>
          </div>
        </div>
        <div className="flex flex-col gap-2">
          <CtlLabel>Preset</CtlLabel>
          <div className="flex flex-wrap gap-2">
            {SCALE_PRESETS.map(p => (
              <Chip key={p.name} active={Math.abs(p.r - ratio) < 0.001} onClick={() => setRatio(p.r)}>
                {p.name}
              </Chip>
            ))}
          </div>
        </div>
      </ToolHead>

      <div className="px-5 py-4">
        <div className="flex flex-col">
          {SCALE_ROLES.map(r => {
            const px = sizeFor(r.exp)
            return (
              <div key={r.key} className="flex flex-col items-start gap-2 border-b border-border/40 py-3 last:border-0 sm:flex-row sm:items-baseline sm:gap-5 sm:py-2.5">
                <div className="w-full flex-shrink-0 font-mono text-[10px] leading-[1.6] text-muted-foreground sm:w-[120px]">
                  <span className="block text-[10px] uppercase tracking-[0.06em] text-accent">{r.name}</span>
                  {Math.round(px)}px · {r.lh}
                </div>
                <div
                  className="max-w-full overflow-hidden text-ellipsis whitespace-nowrap text-foreground"
                  style={{
                    fontSize: Math.min(px, 60),
                    lineHeight: r.lh,
                    letterSpacing: `${r.ls}em`,
                    fontWeight: px >= sizeFor(2) ? 500 : 400,
                    fontFamily: px >= sizeFor(4) ? F.serif : F.sans,
                  }}
                >
                  {r.sample}
                </div>
              </div>
            )
          })}
        </div>
      </div>

      <div className="px-5 py-4 border-t border-border/60">
        <div className="flex items-center justify-between mb-3 flex-wrap gap-2">
          <div className="flex gap-2">
            {(["CSS", "Tailwind"] as const).map(f => (
              <Chip key={f} active={fmt === f} onClick={() => setFmt(f)}>{f}</Chip>
            ))}
          </div>
          <CopyButton text={tokens} />
        </div>
        <pre className="max-w-full overflow-x-auto rounded-lg border border-border bg-background px-4 py-4 font-mono text-[11px] leading-[1.7] text-foreground/65">{tokens}</pre>
      </div>
    </>
  )
}

function FontPairingExplorer() {
  const [i, setI] = useState(0)
  const p = PAIRS[i]
  return (
    <>
      <ToolHead>
        <div className="flex flex-wrap gap-2">
          {PAIRS.map((pair, idx) => (
            <Chip key={pair.name} active={i === idx} onClick={() => setI(idx)}>{pair.name}</Chip>
          ))}
        </div>
      </ToolHead>
      <div className="px-6 py-8 md:px-8">
        <div className="font-mono text-[10px] uppercase tracking-[0.12em] text-muted-foreground mb-4">{p.note}</div>
        <div
          className="mb-5 text-[28px] leading-[1.1] tracking-[-0.01em] text-foreground sm:text-[36px]"
          style={{ fontFamily: p.h, fontWeight: p.hw, fontStyle: p.hs }}
        >
          The grand tour of modern typography
        </div>
        <p className="text-[15px] leading-[1.75] text-muted-foreground" style={{ fontFamily: p.b, maxWidth: "60ch" }}>
          Pairing is about contrast with harmony. A high-contrast display serif over a calm humanist sans gives editorial authority; a grotesk over a monospace reads technical and precise. The heading sets the voice; the body keeps it readable.
        </p>
      </div>
    </>
  )
}

function ReadingSimulator() {
  const [width, setWidth] = useState(62)
  const [lh, setLh] = useState(1.7)
  const ok   = width >= 45 && width <= 78 && lh >= 1.4 && lh <= 1.9
  const warn = (width >= 38 && width < 45) || (width > 78 && width <= 90) || (lh >= 1.25 && lh < 1.4)
  const verdict = ok ? "✓ Comfortable" : warn ? "~ Acceptable" : "✕ Fatiguing"
  const vColor  = ok ? "text-emerald-500" : warn ? "text-amber-500" : "text-red-500"
  return (
    <>
      <ToolHead>
        <div className="flex flex-col gap-2">
          <CtlLabel>Line length</CtlLabel>
          <div className="flex items-center gap-3">
            <input type="range" min={30} max={100} step={1} value={width}
              onChange={e => setWidth(Number(e.target.value))} className="w-full max-w-36 accent-rose-500" />
            <span className="font-mono text-[13px] text-accent w-12">{width}ch</span>
          </div>
        </div>
        <div className="flex flex-col gap-2">
          <CtlLabel>Line height</CtlLabel>
          <div className="flex items-center gap-3">
            <input type="range" min={1} max={2.2} step={0.01} value={lh}
              onChange={e => setLh(Number(e.target.value))} className="w-full max-w-36 accent-rose-500" />
            <span className="font-mono text-[13px] text-accent w-12">{lh.toFixed(2)}</span>
          </div>
        </div>
        <div className="flex flex-col gap-2">
          <CtlLabel>Comfort</CtlLabel>
          <span className={`font-mono text-[12px] ${vColor}`}>{verdict}</span>
        </div>
      </ToolHead>
      <div className="px-5 py-8 flex justify-center bg-background/40">
        <p className="text-[16px] text-foreground/80" style={{ maxWidth: `${width}ch`, lineHeight: lh }}>
          Typography is the craft of making language visible. The measure — the length of a line of text — is one of its oldest and most reliable controls. When a column is too wide the reader tires; too narrow and the rhythm fractures into fragments. Somewhere between forty-five and seventy-five characters lies the comfortable middle, where the eye sweeps and returns without conscious effort, and the words simply flow.
        </p>
      </div>
    </>
  )
}

function HierarchyPlayground() {
  const [s, setS] = useState({ size: true, weight: true, color: true, space: true })
  const toggle = (k: keyof typeof s) => setS(prev => ({ ...prev, [k]: !prev[k] }))
  const n = Object.values(s).filter(Boolean).length
  const verdict =
    n === 4 ? { color: "text-emerald-500", label: "Strong hierarchy.", text: "Four levers working together — the eye lands on the title, then price, then action, instantly." }
    : n <= 1 ? { color: "text-red-500",     label: "Flat.",             text: "Almost no contrast: everything competes, nothing leads. The user must read every word to find structure." }
    :           { color: "text-amber-500",   label: "Weak hierarchy.",   text: "Some order, but the levels blur. Decisive contrast in size and weight reads far faster." }

  return (
    <>
      <ToolHead>
        <div className="flex flex-wrap gap-2">
          {([ ["size","Size contrast"], ["weight","Weight contrast"], ["color","Color contrast"], ["space","Spacing"] ] as [keyof typeof s, string][]).map(([k, lbl]) => (
            <Chip key={k} active={s[k]} onClick={() => toggle(k)}>{lbl}</Chip>
          ))}
        </div>
      </ToolHead>
      <div className="px-5 py-7 bg-background/40">
        <div className="rounded-xl border border-border bg-card p-6 max-w-[420px]">
          <div
            className="font-mono uppercase tracking-[0.12em] text-[11px]"
            style={{ color: s.color ? "#f59e0b" : "var(--text-muted)", fontWeight: s.weight ? 500 : 400, marginBottom: s.space ? 10 : 2 }}
          >
            Pro plan
          </div>
          <div
            className="leading-[1.2]"
            style={{
              fontSize: s.size ? 24 : 15, fontWeight: s.weight ? 600 : 400,
              color: s.color ? "var(--foreground)" : "var(--text-muted)", marginBottom: s.space ? 8 : 2,
            }}
          >
            Everything your team needs to ship
          </div>
          <p className="text-[14px] leading-[1.65] text-muted-foreground" style={{ marginBottom: s.space ? 16 : 4 }}>
            Unlimited projects, advanced analytics, priority support, and a shared design-token pipeline.
          </p>
          <div className="flex items-center justify-between">
            <span style={{ fontSize: s.size ? 22 : 15, fontWeight: s.weight ? 600 : 400, color: s.color ? "var(--foreground)" : "var(--text-muted)" }}>
              $29<span className="text-[13px] text-muted-foreground">/mo</span>
            </span>
            {/* Demo button — intentionally uses raw rose-600 to show the color in isolation */}
            <button type="button" className="rounded-lg bg-rose-600 text-white px-4 py-2 text-[14px]" style={{ fontWeight: s.weight ? 500 : 400 }}>
              Start trial
            </button>
          </div>
        </div>
      </div>
      <div className="px-5 py-4 border-t border-border/60">
        <p className="text-[13px] leading-[1.7] text-muted-foreground">
          <b className={verdict.color}>{verdict.label}</b> {verdict.text}
        </p>
      </div>
    </>
  )
}

const DEVICES = [ { n: "Mobile", w: 375 }, { n: "Tablet", w: 768 }, { n: "Desktop", w: 1100 } ]
const MINVW = 360, MAXVW = 1280

function ResponsiveClampPreview() {
  const [min, setMin] = useState(28)
  const [max, setMax] = useState(72)
  const [vw, setVw]   = useState(1100)

  const slope    = (max - min) / (MAXVW - MINVW)
  const inter    = min - slope * MINVW
  const rendered = Math.max(min, Math.min(max, inter + slope * vw))
  const code     = `font-size: clamp(${min}px, ${inter.toFixed(2)}px + ${(slope * 100).toFixed(2)}vw, ${max}px);`

  return (
    <>
      <ToolHead>
        <div className="flex flex-col gap-2">
          <CtlLabel>Min size</CtlLabel>
          <div className="flex items-center gap-2">
            <input type="number" min={12} max={60} value={min}
              onChange={e => setMin(Math.max(12, Math.min(60, Number(e.target.value) || 12)))}
              className="w-20 font-mono text-[13px] bg-background border border-border rounded-md px-2.5 py-1.5 text-foreground outline-none focus:border-accent" />
            <span className="font-mono text-[11px] text-muted-foreground">px</span>
          </div>
        </div>
        <div className="flex flex-col gap-2">
          <CtlLabel>Max size</CtlLabel>
          <div className="flex items-center gap-2">
            <input type="number" min={20} max={120} value={max}
              onChange={e => setMax(Math.max(20, Math.min(120, Number(e.target.value) || 20)))}
              className="w-20 font-mono text-[13px] bg-background border border-border rounded-md px-2.5 py-1.5 text-foreground outline-none focus:border-accent" />
            <span className="font-mono text-[11px] text-muted-foreground">px</span>
          </div>
        </div>
        <div className="flex flex-col gap-2">
          <CtlLabel>Viewport</CtlLabel>
          <div className="flex gap-2">
            {DEVICES.map(d => <Chip key={d.n} active={vw === d.w} onClick={() => setVw(d.w)}>{d.n}</Chip>)}
          </div>
        </div>
      </ToolHead>
      <div className="px-5 py-7 bg-background/40">
        <div
          className="mx-auto rounded-xl border border-border bg-card p-7 overflow-hidden transition-[max-width] duration-300"
          style={{ maxWidth: `min(${vw}px, 100%)` }}
        >
          <div className="break-words leading-[1.1] tracking-[-0.02em] text-foreground" style={{ fontSize: rendered.toFixed(1) + "px", fontFamily: F.serif }}>
            Typography that scales
          </div>
          <p className="font-mono text-[11px] text-muted-foreground mt-3">
            viewport {vw}px → rendered {rendered.toFixed(1)}px (min {min} · max {max})
          </p>
        </div>
      </div>
      <div className="px-5 py-4 border-t border-border/60">
        <div className="mb-3 flex flex-wrap items-center justify-between gap-2">
          <CtlLabel>Generated CSS</CtlLabel>
          <CopyButton text={code} />
        </div>
        <pre className="max-w-full overflow-x-auto rounded-lg border border-border bg-background px-4 py-4 font-mono text-[11px] leading-[1.7] text-foreground/65">{code}</pre>
      </div>
    </>
  )
}

function hexLum(hex: string) {
  const n = parseInt(hex.slice(1), 16)
  const lin = (c: number) => { c /= 255; return c <= 0.03928 ? c / 12.92 : Math.pow((c + 0.055) / 1.055, 2.4) }
  return 0.2126 * lin((n >> 16) & 255) + 0.7152 * lin((n >> 8) & 255) + 0.0722 * lin(n & 255)
}

function A11yChecker() {
  const [fg, setFg] = useState("#d6d2c5")
  const [bg, setBg] = useState("#181710")
  const [size, setSize] = useState(16)

  const ratio = (() => {
    const L1 = hexLum(fg), L2 = hexLum(bg)
    return (Math.max(L1, L2) + 0.05) / (Math.min(L1, L2) + 0.05)
  })()
  const large = size >= 24
  const badges: [string, boolean][] = [
    [`AA ${large ? "large" : "normal"}`,  ratio >= (large ? 3 : 4.5)],
    [`AAA ${large ? "large" : "normal"}`, ratio >= (large ? 4.5 : 7)],
    [size >= 16 ? "Body size ✓" : "Below 16px", size >= 16],
  ]

  return (
    <>
      <ToolHead>
        <div className="flex flex-col gap-2">
          <CtlLabel>Text</CtlLabel>
          <input type="color" value={fg} onChange={e => setFg(e.target.value)}
            className="w-10 h-8 rounded-md border border-border bg-transparent cursor-pointer p-0.5" />
        </div>
        <div className="flex flex-col gap-2">
          <CtlLabel>Background</CtlLabel>
          <input type="color" value={bg} onChange={e => setBg(e.target.value)}
            className="w-10 h-8 rounded-md border border-border bg-transparent cursor-pointer p-0.5" />
        </div>
        <div className="flex flex-col gap-2">
          <CtlLabel>Size</CtlLabel>
          <div className="flex items-center gap-3">
            <input type="range" min={11} max={32} step={1} value={size}
              onChange={e => setSize(Number(e.target.value))} className="w-full max-w-32 accent-rose-500" />
            <span className="font-mono text-[13px] text-accent w-12">{size}px</span>
          </div>
        </div>
        <div className="flex flex-col gap-2">
          <CtlLabel>Ratio</CtlLabel>
          <span className="font-mono text-[13px] text-accent">{ratio.toFixed(2)}:1</span>
        </div>
      </ToolHead>
      <div className="px-5 py-5">
        <div className="rounded-xl p-7" style={{ background: bg }}>
          <div style={{ color: fg, fontSize: size, fontWeight: 400, lineHeight: 1.5 }}>
            The quick brown fox jumps over the lazy dog, 0123456789
          </div>
          <div className="flex flex-wrap gap-2.5 mt-4">
            {badges.map(([label, pass]) => (
              <span key={label} className={`font-mono text-[11px] px-3 py-1.5 rounded-md ${pass ? "bg-emerald-500/15 text-emerald-300" : "bg-red-500/15 text-red-300"}`}>
                {pass ? "✓ " : "✕ "}{label}
              </span>
            ))}
          </div>
        </div>
        <div className="mt-4 grid grid-cols-1 gap-3 sm:grid-cols-3">
          {LEGIBILITY.map(l => (
            <div key={l.name} className="rounded-xl border border-border/60 p-4 text-center bg-card">
              <div className="text-[26px] text-foreground mb-1.5" style={{ fontFamily: l.font }}>Il1 O0 rn</div>
              <div className="font-mono text-[10px] text-muted-foreground">{l.name}</div>
            </div>
          ))}
        </div>
      </div>
      <div className="px-5 py-4 border-t border-border/60">
        <p className="text-[13px] leading-[1.7] text-muted-foreground">
          WCAG AA requires <b className="text-foreground">4.5:1</b> for normal text, <b className="text-foreground">3:1</b> for large (≥24px). Keep body at 16px minimum, and choose letterforms that disambiguate <b className="text-foreground">I l 1</b> and <b className="text-foreground">O 0</b>.
        </p>
      </div>
    </>
  )
}

// ─── TYPOGRAPHY LAB ───────────────────────────────────────────────────────────

const LAB_TABS = [
  { id: "scale",     label: "Scale generator" },
  { id: "pairs",     label: "Font pairing" },
  { id: "reading",   label: "Reading comfort" },
  { id: "hierarchy", label: "Hierarchy" },
  { id: "clamp",     label: "Fluid clamp" },
  { id: "a11y",      label: "Contrast" },
]

function TypographyLab() {
  const [tab, setTab] = useState("scale")
  return (
    <div className="rounded-2xl border border-border bg-card overflow-hidden">
      {/* Tab bar — all tools mount immediately to preserve state when switching */}
      <div className="flex flex-nowrap overflow-x-auto border-b border-border bg-muted/30 [-webkit-overflow-scrolling:touch]">
        {LAB_TABS.map(t => (
          <button
            key={t.id}
            type="button"
            onClick={() => setTab(t.id)}
            className={`shrink-0 border-r border-border/40 px-4 py-3 text-[12px] font-medium transition-colors duration-150 last:border-r-0 ${
              tab === t.id
                ? "bg-card text-foreground"
                : "text-muted-foreground hover:text-foreground hover:bg-card/50"
            }`}
          >
            {t.label}
          </button>
        ))}
      </div>

      {/* Keep all tools mounted to preserve their state when switching tabs */}
      <div className={tab === "scale"     ? "block" : "hidden"}><ModularScaleTool /></div>
      <div className={tab === "pairs"     ? "block" : "hidden"}><FontPairingExplorer /></div>
      <div className={tab === "reading"   ? "block" : "hidden"}><ReadingSimulator /></div>
      <div className={tab === "hierarchy" ? "block" : "hidden"}><HierarchyPlayground /></div>
      <div className={tab === "clamp"     ? "block" : "hidden"}><ResponsiveClampPreview /></div>
      <div className={tab === "a11y"      ? "block" : "hidden"}><A11yChecker /></div>
    </div>
  )
}

// ─── PAGE ─────────────────────────────────────────────────────────────────────

export default function Page() {
  const article = articleItems.find(x => x.href === HREF)!
  return (
    <main>
      <ReadingProgress />
      <link rel="preconnect" href="https://fonts.googleapis.com" />
      <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
      {/* eslint-disable-next-line @next/next/no-page-custom-font */}
      <link
        href="https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,400;0,600;1,400&family=Inter:wght@300;400;500;600;700&family=DM+Mono:wght@400;500&family=Lora:ital,wght@0,400;0,600;1,400&family=Space+Grotesk:wght@400;500;700&family=Fraunces:ital,opsz,wght@0,9..144,400;0,9..144,600&family=Poppins:wght@400;500;600&family=Lato:wght@300;400;700&display=swap"
        rel="stylesheet"
      />

      <ArticleHeader article={article} />

      {/* 01 · FOUNDATIONS */}
      <Section id="foundations">
        <FadeIn><Eyebrow num="01" tag="Foundations" /></FadeIn>
        <FadeIn><Title>What a type system is for</Title></FadeIn>
        <FadeIn><Lede>A typography system turns text from decoration into communication. It sets the rules for size, hierarchy, spacing, and voice — once, so every surface inherits them without rethinking.</Lede></FadeIn>

        <FadeIn className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {TYPE_SHOW.map(c => (
            <div key={c.word} className="rounded-xl border border-border/60 bg-card p-6 hover:border-border transition-colors">
              <div className="mb-3 text-[34px] leading-[1.05] tracking-[-0.01em] text-foreground sm:text-[40px]" style={{ fontFamily: c.font, fontWeight: c.weight, fontStyle: c.style }}>
                {c.word}
              </div>
              <p className="font-mono text-[10px] uppercase tracking-[0.12em] text-accent mb-1">{c.lbl}</p>
              <p className="text-[13px] text-muted-foreground leading-[1.65]">{c.desc}</p>
            </div>
          ))}
        </FadeIn>
      </Section>

      {/* 02 · CLASSIFICATION */}
      <Section id="classification" muted>
        <FadeIn><Eyebrow num="02" tag="Classification" /></FadeIn>
        <FadeIn><Title>Font classification</Title></FadeIn>
        <FadeIn><Lede>Every typeface has a temperament. Knowing the categories lets you choose deliberately instead of by accident.</Lede></FadeIn>

        <FadeIn className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {CLASSES.map(c => (
            <div key={c.name} className="rounded-xl border border-border/60 bg-card overflow-hidden hover:border-border transition-colors">
              <div className="border-b border-border/60 px-6 pb-4 pt-7 text-[42px] leading-none text-foreground sm:text-[52px]" style={{ fontFamily: c.spec }}>
                Ag
              </div>
              <div className="px-6 py-5">
                <p className="font-mono text-[11px] uppercase tracking-[0.1em] text-accent mb-0.5">{c.name}</p>
                <p className="font-mono text-[10px] text-muted-foreground mb-2.5">{c.font}</p>
                <p className="text-[13px] text-foreground/75 leading-[1.65] mb-3">{c.desc}</p>
                <div className="flex flex-wrap gap-1.5">
                  {c.traits.map(t => (
                    <span key={t} className="font-mono text-[9px] uppercase tracking-[0.06em] text-muted-foreground border border-border rounded-full px-2 py-0.5">{t}</span>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </FadeIn>
      </Section>

      {/* 03 · TYPOGRAPHY LAB */}
      <Section id="lab">
        <FadeIn><Eyebrow num="03" tag="Typography Lab" /></FadeIn>
        <FadeIn><Title>Interactive tools</Title></FadeIn>
        <FadeIn><Lede>Six tools in one place: scale generator, font pairing, reading comfort, hierarchy playground, fluid clamp, and contrast checker.</Lede></FadeIn>
        <FadeIn><TypographyLab /></FadeIn>
      </Section>

      {/* 04 · UI PATTERNS */}
      <Section id="ui" muted>
        <FadeIn><Eyebrow num="04" tag="UI Patterns" /></FadeIn>
        <FadeIn><Title>Typography in interfaces</Title></FadeIn>
        <FadeIn><Lede>Interface type lives under different pressure: small sizes, dense layouts, tabular data, glanceable labels. Each context has its own rules.</Lede></FadeIn>

        <FadeIn className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div className="rounded-xl border border-border/60 bg-card p-6">
            <h4 className="font-mono text-[10px] uppercase tracking-[0.12em] text-accent mb-4">Buttons &amp; actions</h4>
            <div className="flex flex-wrap items-center gap-2.5">
              {/* Demo buttons — intentionally showing raw colors as design examples */}
              <button type="button" className="rounded-lg bg-rose-600 text-white px-4 py-2 text-[14px] font-medium">Primary action</button>
              <button type="button" className="rounded-lg bg-transparent text-foreground border border-border px-4 py-2 text-[14px] font-medium">Secondary</button>
            </div>
            <p className="text-[11px] text-muted-foreground mt-4 leading-[1.6]">14–15px medium weight. Labels are verbs. Never let a button label wrap.</p>
          </div>

          <div className="rounded-xl border border-border/60 bg-card p-6">
            <h4 className="font-mono text-[10px] uppercase tracking-[0.12em] text-accent mb-4">Forms &amp; inputs</h4>
            <label className="block text-[12px] font-medium text-foreground mb-1.5">Work email</label>
            <input readOnly value="ada@studio.com" className="w-full bg-background border border-border rounded-md px-3 py-2 text-foreground text-[14px]" />
            <p className="text-[11px] text-muted-foreground mt-2 leading-[1.6]">Label 12px medium · input 14–16px (≥16px on mobile) · hint 11–12px muted.</p>
          </div>

          <div className="rounded-xl border border-border/60 bg-card p-6">
            <h4 className="font-mono text-[10px] uppercase tracking-[0.12em] text-accent mb-4">Data tables</h4>
            <div className="overflow-x-auto">
              <table className="w-full min-w-[280px] border-collapse">
                <thead>
                  <tr>
                    {["Plan", "Seats", "MRR"].map((h, i) => (
                      <th key={h} className={`font-mono text-[10px] uppercase tracking-[0.08em] text-muted-foreground font-normal py-2 border-b border-border ${i === 2 ? "text-right" : "text-left"}`}>{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {[["Starter", "3", "$87"], ["Growth", "12", "$1,240"], ["Scale", "48", "$9,600"]].map(([p, s, m]) => (
                    <tr key={p}>
                      <td className="text-[13px] text-foreground/75 py-2 border-b border-border/60">{p}</td>
                      <td className="font-mono text-[13px] text-foreground py-2 border-b border-border/60" style={{ fontVariantNumeric: "tabular-nums" }}>{s}</td>
                      <td className="font-mono text-[13px] text-foreground py-2 border-b border-border/60 text-right" style={{ fontVariantNumeric: "tabular-nums" }}>{m}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <p className="text-[11px] text-muted-foreground mt-3 leading-[1.6]">Tabular-figure numerals so digits align. Labels uppercase mono; values regular.</p>
          </div>

          <div className="rounded-xl border border-border/60 bg-card p-6">
            <h4 className="font-mono text-[10px] uppercase tracking-[0.12em] text-accent mb-4">Navigation</h4>
            <div className="flex items-center gap-5 overflow-x-auto">
              <span className="text-[13px] text-foreground font-medium">Overview</span>
              {["Projects", "Members", "Settings"].map(n => (
                <span key={n} className="text-[13px] text-muted-foreground">{n}</span>
              ))}
            </div>
            <p className="text-[11px] text-muted-foreground mt-4 leading-[1.6]">13–14px. Active item earns weight and full contrast; the rest recede to muted.</p>
          </div>
        </FadeIn>
      </Section>

      {/* 05 · TOKENS + PRINCIPLES */}
      <Section id="tokens">
        <FadeIn><Eyebrow num="05" tag="Tokens &amp; Principles" /></FadeIn>
        <FadeIn><Title>From convictions to code</Title></FadeIn>
        <FadeIn><Lede>Tokens turn typographic decisions into one source of truth. The principles behind them are what keep the system from growing in the wrong directions.</Lede></FadeIn>

        {/* Token cascade */}
        <FadeIn className="flex flex-col gap-2 mb-8">
          {[
            { lbl: "01 · Global / primitive", code: "--font-size-500: 20px;  --leading-snug: 1.25;  --weight-medium: 500;" },
            { lbl: "02 · Semantic / role",    code: "--text-heading: var(--font-size-500)/var(--leading-snug) var(--weight-medium);" },
            { lbl: "03 · Component",          code: "--card-title-font: var(--text-heading);" },
          ].map((t, i) => (
            <div key={t.lbl}>
              <div className="rounded-xl border border-border/60 bg-card px-5 py-4">
                <p className="font-mono text-[10px] uppercase tracking-[0.1em] text-accent mb-2">{t.lbl}</p>
                <code className="block max-w-full overflow-x-auto font-mono text-[12px] text-foreground/70">{t.code}</code>
              </div>
              {i < 2 && <p className="text-center text-muted-foreground text-[12px] py-1">↓</p>}
            </div>
          ))}
        </FadeIn>

        {/* Full token block */}
        <FadeIn className="rounded-2xl border border-border bg-card overflow-hidden mb-10">
          <div className="px-5 py-4 border-b border-border/60 flex items-center justify-between">
            <span className="font-mono text-[10px] uppercase tracking-[0.12em] text-muted-foreground">Token reference</span>
            <CopyButton text={TOKEN_CODE} />
          </div>
          <pre className="max-w-full overflow-x-auto px-5 py-4 font-mono text-[11px] leading-[1.7] text-foreground/65">{TOKEN_CODE}</pre>
        </FadeIn>

        {/* Principles */}
        <FadeIn className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
          {PRINCIPLES.map(p => (
            <div key={p.num} className="rounded-xl border border-border/60 bg-card p-6 hover:border-border transition-colors">
              <span className="font-mono text-[11px] text-accent tracking-[0.1em] mb-4 block">{p.num}</span>
              <p className="font-semibold text-[17px] leading-[1.25] text-foreground mb-2" style={{ fontFamily: F.serif }}>{p.title}</p>
              <p className="text-[13px] text-muted-foreground leading-[1.7]">{p.body}</p>
            </div>
          ))}
        </FadeIn>
      </Section>

      <RelatedArticles currentHref={HREF} />
    </main>
  )
}

const TOKEN_CODE = `:root {
  /* primitives */
  --font-sans: "Inter", system-ui, sans-serif;
  --font-mono: "DM Mono", monospace;

  --size-caption: 12px;  --leading-caption: 1.45;
  --size-body:    16px;  --leading-body:    1.65;
  --size-h3:      25px;  --leading-h3:      1.2;
  --size-h1:      39px;  --leading-h1:      1.08;

  --weight-regular: 400;  --weight-medium: 500;  --weight-bold: 700;
}

:root {
  /* semantic roles */
  --text-page-title: var(--weight-bold) var(--size-h1)/var(--leading-h1) var(--font-sans);
  --text-section:    var(--weight-medium) var(--size-h3)/var(--leading-h3) var(--font-sans);
  --text-body:       var(--weight-regular) var(--size-body)/var(--leading-body) var(--font-sans);
  --text-meta:       var(--weight-medium) var(--size-caption)/var(--leading-caption) var(--font-mono);
}

/* usage — components never hard-code sizes */
.page-title { font: var(--text-page-title); letter-spacing: -0.02em; }
.card-meta  { font: var(--text-meta); text-transform: uppercase; letter-spacing: 0.08em; }`
