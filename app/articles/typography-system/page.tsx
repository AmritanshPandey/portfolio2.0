"use client"

import { useMemo, useState } from "react"
import Link from "next/link"
import { motion } from "framer-motion"
import { IconArrowUpRight, IconClock, IconCalendar } from "@tabler/icons-react"
import { articleItems } from "@/lib/data"

// ─── CONSTANTS ───────────────────────────────────────────────────────────────

const ACCENT = "linear-gradient(135deg, #f59e0b 0%, #ea580c 50%, #9a3412 100%)"
const HREF   = "/articles/typography-system"

// Font families showcased in the classification + pairing tools.
const F = {
  serif:  "'Playfair Display', Georgia, serif",
  sans:   "'Inter', system-ui, sans-serif",
  mono:   "'DM Mono', 'Courier New', monospace",
  lora:   "'Lora', Georgia, serif",
  grotesk:"'Space Grotesk', system-ui, sans-serif",
  fraunces:"'Fraunces', Georgia, serif",
  poppins:"'Poppins', system-ui, sans-serif",
  lato:   "'Lato', system-ui, sans-serif",
}

// ─── FADE-IN WRAPPER ───────────────────────────────────────────────────────—

function FadeIn({ children, delay = 0, className = "" }: {
  children: React.ReactNode; delay?: number; className?: string
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 18 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-60px" }}
      transition={{ duration: 0.55, delay, ease: [0.22, 1, 0.36, 1] }}
      className={className}
    >
      {children}
    </motion.div>
  )
}

// ─── PRIMITIVES ───────────────────────────────────────────────────────────────

function Section({ id, children, muted = false }: {
  id?: string; children: React.ReactNode; muted?: boolean
}) {
  return (
    <section
      id={id}
      className={`border-b border-border/40 ${muted ? "bg-foreground/[0.015] dark:bg-white/[0.015]" : ""}`}
    >
      <div className="max-w-4xl mx-auto px-6 py-16 md:py-20">{children}</div>
    </section>
  )
}

function Eyebrow({ num, tag }: { num: string; tag: string }) {
  return (
    <div className="flex items-center gap-3 mb-6">
      <span className="text-[11px] font-bold tracking-[0.18em] text-orange-500 font-mono">{num}</span>
      <span className="w-12 h-px bg-border" />
      <span className="text-[11px] font-bold uppercase tracking-[0.18em] text-muted-foreground">{tag}</span>
    </div>
  )
}

function SubEyebrow({ children }: { children: React.ReactNode }) {
  return (
    <p className="text-[11px] font-bold uppercase tracking-[0.16em] text-muted-foreground mb-5 mt-10">
      {children}
    </p>
  )
}

function Title({ children }: { children: React.ReactNode }) {
  return (
    <h2 className="text-2xl md:text-[2.1rem] font-bold tracking-tight leading-[1.12] text-foreground mb-4">
      {children}
    </h2>
  )
}

function Lede({ children }: { children: React.ReactNode }) {
  return (
    <p className="text-[15px] md:text-base leading-[1.8] text-muted-foreground max-w-xl mb-10">
      {children}
    </p>
  )
}

function Note({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <FadeIn>
      <div className="my-8 rounded-xl border border-orange-500/20 bg-orange-500/[0.05] p-5 md:p-6 relative overflow-hidden">
        <div className="absolute left-0 top-0 bottom-0 w-[3px] bg-orange-500/60 rounded-l-xl" />
        <p className="text-[11px] font-bold uppercase tracking-[0.14em] text-orange-500 mb-2 pl-2">{label}</p>
        <p className="text-[13px] md:text-[14px] leading-[1.7] text-foreground/80 pl-2">{children}</p>
      </div>
    </FadeIn>
  )
}

// Reusable copy-to-clipboard button
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
          ? "border-orange-500 text-orange-500"
          : "border-border text-muted-foreground hover:border-orange-500 hover:text-orange-500"
      } ${className}`}
    >
      {done ? "Copied ✓" : "Copy"}
    </button>
  )
}

// Tool shell + small controls
function Tool({ children }: { children: React.ReactNode }) {
  return (
    <div className="rounded-2xl border border-border bg-card overflow-hidden">{children}</div>
  )
}
function ToolHead({ children }: { children: React.ReactNode }) {
  return (
    <div className="px-5 py-4 border-b border-border/60 flex flex-wrap items-center gap-x-8 gap-y-4">
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
      className={`font-mono text-[11px] rounded-lg border px-3 py-1.5 transition-colors ${
        active
          ? "border-orange-500 text-orange-500 bg-orange-500/[0.08]"
          : "border-border text-muted-foreground hover:text-foreground hover:border-muted-foreground/60"
      }`}
    >
      {children}
    </button>
  )
}

// ─── DATA ─────────────────────────────────────────────────────────────────────

const TYPE_SHOW = [
  { word: "Readability", font: F.serif, weight: 600, style: "normal", lbl: "The first job",
    desc: "Before a typeface expresses personality, it must be effortless to read. Size, line length, line height, and contrast decide whether users absorb content or bounce. Readability is non-negotiable; everything else is a layer on top." },
  { word: "Personality", font: F.sans, weight: 600, style: "normal", lbl: "The second job",
    desc: "Once text is readable, the typeface carries voice. A geometric sans feels precise and modern; a humanist serif feels warm and editorial. Personality should support the brand — never at the cost of legibility." },
  { word: "Hierarchy", font: F.mono, weight: 500, style: "normal", lbl: "The structure",
    desc: "Hierarchy lets users instantly distinguish a heading from body, a label from a value, a primary action from a secondary one — without reading a word. It is created with size, weight, color, and space working together." },
  { word: "Function", font: F.lora, weight: 400, style: "italic", lbl: "The discipline",
    desc: "Functional typography asks one question of every type style: what is its job? Tokens named by role — not by appearance — keep that discipline. The system exists so designers stop re-deciding the same thing on every screen." },
]

const CLASSES = [
  { spec: F.lora, size: 56, name: "Serif", font: "Lora · Georgia · Times",
    desc: "Small strokes (serifs) finish each letter. Traditional, authoritative, editorial. Excellent for long-form reading in print and increasingly on screen.",
    traits: ["Editorial", "Trustworthy", "Long-form"] },
  { spec: F.sans, size: 56, name: "Sans-serif", font: "Inter · Helvetica · Arial",
    desc: "No serifs — clean, neutral, modern. The default for UI because it stays legible at small sizes and on low-resolution screens.",
    traits: ["Modern", "Neutral", "UI default"] },
  { spec: F.grotesk, size: 56, name: "Grotesk", font: "Space Grotesk · Helvetica · Founders",
    desc: "Early sans-serifs with slightly irregular, mechanical forms. Confident and characterful — popular for product brands that want personality without serifs.",
    traits: ["Confident", "Characterful", "Brand"] },
  { spec: F.poppins, size: 56, name: "Geometric", font: "Poppins · Futura · Circular",
    desc: "Built from near-perfect circles and straight lines. Precise, friendly, contemporary. Beautiful in headings; can tire the eye in long body copy.",
    traits: ["Precise", "Friendly", "Display-leaning"] },
  { spec: F.lato, size: 56, name: "Humanist", font: "Lato · Frutiger · Source Sans",
    desc: "Sans-serifs with calligraphic warmth and open apertures. The most readable sans category — excellent for body text and accessibility.",
    traits: ["Warm", "Readable", "Accessible"] },
  { spec: F.mono, size: 46, name: "Monospace", font: "DM Mono · JetBrains · SF Mono",
    desc: "Every character occupies equal width. Essential for code, data, and tabular numbers where alignment matters. Adds a technical, precise voice.",
    traits: ["Code", "Tabular", "Technical"] },
  { spec: F.serif, size: 56, name: "Display", font: "Playfair · Fraunces · Canela",
    desc: "Designed for large sizes and impact, not paragraphs. High contrast and expressive detail. Use for hero moments — never for body or UI labels.",
    traits: ["Impact", "Hero-only", "Expressive"] },
  { spec: F.fraunces, size: 56, name: "Variable", font: "Fraunces · Inter · Recursive",
    desc: "One file, continuous axes — weight, width, optical size — instead of many static cuts. Smaller payloads, fluid weight transitions, optical sizing at every scale.",
    traits: ["One file", "Fluid axes", "Performance"] },
]

const SCALE_ROLES = [
  { key: "display", name: "Display",    exp: 7,  lh: 1.04, ls: -0.02,  sample: "Display" },
  { key: "h1",      name: "Heading 1",  exp: 6,  lh: 1.08, ls: -0.02,  sample: "Heading One" },
  { key: "h2",      name: "Heading 2",  exp: 5,  lh: 1.12, ls: -0.015, sample: "Heading Two" },
  { key: "h3",      name: "Heading 3",  exp: 4,  lh: 1.18, ls: -0.01,  sample: "Heading Three" },
  { key: "h4",      name: "Heading 4",  exp: 3,  lh: 1.25, ls: -0.005, sample: "Heading Four" },
  { key: "h5",      name: "Heading 5",  exp: 2,  lh: 1.3,  ls: 0,      sample: "Heading Five" },
  { key: "body-lg", name: "Body Large", exp: 1,  lh: 1.6,  ls: 0,      sample: "Larger body copy for intros" },
  { key: "body",    name: "Body",       exp: 0,  lh: 1.65, ls: 0,      sample: "Default body text for reading" },
  { key: "small",   name: "Small",      exp: -1, lh: 1.5,  ls: 0,      sample: "Secondary and supporting text" },
  { key: "caption", name: "Caption",    exp: -2, lh: 1.45, ls: 0.01,   sample: "Captions, metadata, footnotes" },
]

const SCALE_PRESETS = [
  { name: "Minor Third", r: 1.2 },
  { name: "Major Third", r: 1.25 },
  { name: "Perfect Fourth", r: 1.333 },
  { name: "Aug. Fourth", r: 1.414 },
  { name: "Golden Ratio", r: 1.618 },
]

const PAIRS = [
  { name: "Editorial", h: F.serif, b: F.sans, hw: 400, hs: "italic" as const, note: "Display serif + humanist sans" },
  { name: "Modern UI", h: F.sans, b: F.sans, hw: 700, hs: "normal" as const, note: "One grotesk, two weights" },
  { name: "Technical", h: F.grotesk, b: F.mono, hw: 500, hs: "normal" as const, note: "Grotesk + monospace" },
  { name: "Literary", h: F.fraunces, b: F.lora, hw: 600, hs: "normal" as const, note: "Display serif + reading serif" },
  { name: "Geometric", h: F.poppins, b: F.lato, hw: 600, hs: "normal" as const, note: "Geometric + humanist sans" },
]

const PRINCIPLES = [
  { num: "01", title: "Design for reading first", body: "Personality is earned only after text is effortless to read. Size, measure, and contrast come before voice. A beautiful typeface that fatigues the reader has failed at its only essential job." },
  { num: "02", title: "Consistency beats novelty", body: "A predictable scale used everywhere reads as quality. The temptation to introduce “just one more size” is how systems rot. Reuse the scale; let layout and spacing create variety, not new values." },
  { num: "03", title: "Contrast creates hierarchy", body: "Order comes from decisive difference — in size, weight, or color — not from making everything large. One bold step beats five timid ones. If two things look equally important, neither is." },
  { num: "04", title: "Spacing is typography", body: "Line height, paragraph spacing, and the measure shape readability as much as the letterforms. White space isn't empty — it's the medium that lets type breathe and the eye find rhythm." },
  { num: "05", title: "Typography is interface design", body: "In most products, text is the interface. Treating the type system as core architecture — tokenized, accessible, consistent — is treating the product's primary medium with the seriousness it deserves." },
  { num: "06", title: "Restraint scales", body: "Two families, a handful of sizes, two or three weights. A small, disciplined system covers nearly every interface and stays maintainable as the product grows. Range comes from how you combine, not how much you add." },
]

const LEGIBILITY = [
  { font: F.sans, name: "Inter · clear apertures" },
  { font: F.lato, name: "Lato · humanist, open" },
  { font: F.mono, name: "DM Mono · disambiguated" },
]

// ─── INTERACTIVE TOOLS ──────────────────────────────────────────────────────—

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
    <Tool>
      <ToolHead>
        <div className="flex flex-col gap-2">
          <CtlLabel>Base size</CtlLabel>
          <div className="flex items-center gap-2">
            <input
              type="number" min={12} max={22} step={1} value={base}
              onChange={e => setBase(Math.max(12, Math.min(22, Number(e.target.value) || 16)))}
              className="w-20 font-mono text-[13px] bg-background border border-border rounded-md px-2.5 py-1.5 text-foreground outline-none focus:border-orange-500"
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
              className="w-40 accent-orange-500"
            />
            <span className="font-mono text-[13px] text-orange-500 w-12">{ratio.toFixed(3)}</span>
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

      <div className="px-5 py-5">
        <div className="flex flex-col">
          {SCALE_ROLES.map(r => {
            const px = sizeFor(r.exp)
            return (
              <div key={r.key} className="flex items-baseline gap-5 py-3 border-b border-border/40 last:border-0">
                <div className="font-mono text-[10px] text-muted-foreground w-[120px] flex-shrink-0 leading-[1.6]">
                  <span className="block text-[11px] uppercase tracking-[0.06em] text-orange-500">{r.name}</span>
                  {Math.round(px)}px · {r.lh} · {r.ls ? `${r.ls}em` : "0"}
                </div>
                <div
                  className="text-foreground overflow-hidden text-ellipsis whitespace-nowrap"
                  style={{
                    fontSize: Math.min(px, 64),
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
        <pre className="font-mono text-[12px] leading-[1.7] text-foreground/70 bg-background border border-border rounded-lg px-4 py-4 overflow-x-auto">{tokens}</pre>
      </div>
    </Tool>
  )
}

function FontPairingExplorer() {
  const [i, setI] = useState(0)
  const p = PAIRS[i]
  return (
    <Tool>
      <ToolHead>
        <div className="flex flex-wrap gap-2">
          {PAIRS.map((pair, idx) => (
            <Chip key={pair.name} active={i === idx} onClick={() => setI(idx)}>{pair.name}</Chip>
          ))}
        </div>
      </ToolHead>
      <div className="px-5 py-7 md:px-8">
        <div className="font-mono text-[10px] uppercase tracking-[0.12em] text-muted-foreground mb-4">{p.note}</div>
        <div
          className="text-foreground mb-4 leading-[1.1] tracking-[-0.01em]"
          style={{ fontFamily: p.h, fontWeight: p.hw, fontStyle: p.hs, fontSize: 38 }}
        >
          The grand tour of modern typography
        </div>
        <p className="text-[16px] leading-[1.75] text-muted-foreground" style={{ fontFamily: p.b, maxWidth: "62ch" }}>
          Pairing is about contrast with harmony. A high-contrast display serif over a calm humanist sans gives editorial authority; a grotesk over a monospace reads technical and precise. The heading sets the voice; the body keeps it readable.
        </p>
      </div>
    </Tool>
  )
}

function ReadingSimulator() {
  const [width, setWidth] = useState(62)
  const [lh, setLh] = useState(1.7)
  const ok = width >= 45 && width <= 78 && lh >= 1.4 && lh <= 1.9
  const warn = (width >= 38 && width < 45) || (width > 78 && width <= 90) || (lh >= 1.25 && lh < 1.4)
  const verdict = ok ? "✓ Comfortable" : warn ? "~ Acceptable" : "✕ Fatiguing"
  const vColor = ok ? "text-emerald-500" : warn ? "text-amber-500" : "text-red-500"
  return (
    <Tool>
      <ToolHead>
        <div className="flex flex-col gap-2">
          <CtlLabel>Line length</CtlLabel>
          <div className="flex items-center gap-3">
            <input type="range" min={30} max={100} step={1} value={width}
              onChange={e => setWidth(Number(e.target.value))} className="w-40 accent-orange-500" />
            <span className="font-mono text-[13px] text-orange-500 w-12">{width}ch</span>
          </div>
        </div>
        <div className="flex flex-col gap-2">
          <CtlLabel>Line height</CtlLabel>
          <div className="flex items-center gap-3">
            <input type="range" min={1} max={2.2} step={0.01} value={lh}
              onChange={e => setLh(Number(e.target.value))} className="w-40 accent-orange-500" />
            <span className="font-mono text-[13px] text-orange-500 w-12">{lh.toFixed(2)}</span>
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
    </Tool>
  )
}

function HierarchyPlayground() {
  const [s, setS] = useState({ size: true, weight: true, color: true, space: true })
  const toggle = (k: keyof typeof s) => setS(prev => ({ ...prev, [k]: !prev[k] }))
  const n = Object.values(s).filter(Boolean).length
  const strong = n === 4
  const verdict = strong
    ? { color: "text-emerald-500", label: "Strong hierarchy.", text: "Four levers working together — the eye lands on the title, then price, then action, instantly." }
    : n <= 1
    ? { color: "text-red-500", label: "Flat.", text: "With almost no contrast, everything competes and nothing leads. The user has to read every word to find structure." }
    : { color: "text-amber-500", label: "Weak hierarchy.", text: "Some order, but the levels blur. Decisive contrast in size and weight reads far faster." }

  const labels: [keyof typeof s, string][] = [
    ["size", "Size contrast"], ["weight", "Weight contrast"], ["color", "Color contrast"], ["space", "Spacing"],
  ]
  return (
    <Tool>
      <ToolHead>
        <div className="flex flex-wrap gap-2">
          {labels.map(([k, lbl]) => (
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
              fontSize: s.size ? 24 : 15,
              fontWeight: s.weight ? 600 : 400,
              color: s.color ? "var(--foreground)" : "var(--text-muted)",
              marginBottom: s.space ? 8 : 2,
            }}
          >
            Everything your team needs to ship
          </div>
          <p className="text-[14px] leading-[1.65] text-muted-foreground" style={{ marginBottom: s.space ? 16 : 4 }}>
            Unlimited projects, advanced analytics, priority support, and a shared design-token pipeline that keeps every surface consistent.
          </p>
          <div className="flex items-center justify-between">
            <span style={{ fontSize: s.size ? 22 : 15, fontWeight: s.weight ? 600 : 400, color: s.color ? "var(--foreground)" : "var(--text-muted)" }}>
              $29<span className="text-[13px] text-muted-foreground">/mo</span>
            </span>
            <button
              type="button"
              className="rounded-lg bg-orange-500 text-white px-4 py-2 text-[14px]"
              style={{ fontWeight: s.weight ? 500 : 400 }}
            >
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
    </Tool>
  )
}

const DEVICES = [
  { n: "Mobile", w: 375 },
  { n: "Tablet", w: 768 },
  { n: "Desktop", w: 1100 },
]
const MINVW = 360, MAXVW = 1280

function ResponsiveClampPreview() {
  const [min, setMin] = useState(28)
  const [max, setMax] = useState(72)
  const [vw, setVw] = useState(1100)

  const slope = (max - min) / (MAXVW - MINVW)
  const inter = min - slope * MINVW
  const rendered = Math.max(min, Math.min(max, inter + slope * vw))
  const code = `font-size: clamp(${min}px, ${inter.toFixed(2)}px + ${(slope * 100).toFixed(2)}vw, ${max}px);`

  return (
    <Tool>
      <ToolHead>
        <div className="flex flex-col gap-2">
          <CtlLabel>Min size</CtlLabel>
          <div className="flex items-center gap-2">
            <input type="number" min={12} max={60} value={min}
              onChange={e => setMin(Math.max(12, Math.min(60, Number(e.target.value) || 12)))}
              className="w-20 font-mono text-[13px] bg-background border border-border rounded-md px-2.5 py-1.5 text-foreground outline-none focus:border-orange-500" />
            <span className="font-mono text-[11px] text-muted-foreground">px</span>
          </div>
        </div>
        <div className="flex flex-col gap-2">
          <CtlLabel>Max size</CtlLabel>
          <div className="flex items-center gap-2">
            <input type="number" min={20} max={120} value={max}
              onChange={e => setMax(Math.max(20, Math.min(120, Number(e.target.value) || 20)))}
              className="w-20 font-mono text-[13px] bg-background border border-border rounded-md px-2.5 py-1.5 text-foreground outline-none focus:border-orange-500" />
            <span className="font-mono text-[11px] text-muted-foreground">px</span>
          </div>
        </div>
        <div className="flex flex-col gap-2">
          <CtlLabel>Viewport</CtlLabel>
          <div className="flex flex-wrap gap-2">
            {DEVICES.map(d => (
              <Chip key={d.n} active={vw === d.w} onClick={() => setVw(d.w)}>{d.n}</Chip>
            ))}
          </div>
        </div>
      </ToolHead>
      <div className="px-5 py-7 bg-background/40">
        <div
          className="mx-auto rounded-xl border border-border bg-card p-7 overflow-hidden transition-[max-width] duration-300"
          style={{ maxWidth: vw }}
        >
          <div className="leading-[1.1] text-foreground tracking-[-0.02em]" style={{ fontSize: rendered.toFixed(1) + "px", fontFamily: F.serif }}>
            Typography that scales
          </div>
          <p className="font-mono text-[11px] text-muted-foreground mt-3">
            viewport {vw}px → rendered {rendered.toFixed(1)}px (min {min} · max {max})
          </p>
        </div>
      </div>
      <div className="px-5 py-4 border-t border-border/60">
        <div className="flex items-center justify-between mb-3">
          <CtlLabel>Generated CSS</CtlLabel>
          <CopyButton text={code} />
        </div>
        <pre className="font-mono text-[12px] leading-[1.7] text-foreground/70 bg-background border border-border rounded-lg px-4 py-4 overflow-x-auto">{code}</pre>
      </div>
    </Tool>
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
  const aaNeed = large ? 3 : 4.5
  const aaaNeed = large ? 4.5 : 7
  const badges: [string, boolean][] = [
    [`AA ${large ? "large" : "normal"}`, ratio >= aaNeed],
    [`AAA ${large ? "large" : "normal"}`, ratio >= aaaNeed],
    [size >= 16 ? "Body size ✓" : "Below 16px body", size >= 16],
  ]

  return (
    <Tool>
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
              onChange={e => setSize(Number(e.target.value))} className="w-36 accent-orange-500" />
            <span className="font-mono text-[13px] text-orange-500 w-12">{size}px</span>
          </div>
        </div>
        <div className="flex flex-col gap-2">
          <CtlLabel>Ratio</CtlLabel>
          <span className="font-mono text-[13px] text-orange-500">{ratio.toFixed(2)}:1</span>
        </div>
      </ToolHead>
      <div className="px-5 py-6">
        <div className="rounded-xl p-8" style={{ background: bg }}>
          <div style={{ color: fg, fontSize: size, fontWeight: 400, lineHeight: 1.5 }}>
            The quick brown fox jumps over the lazy dog — 0123456789
          </div>
          <div className="flex flex-wrap gap-2.5 mt-5">
            {badges.map(([label, pass]) => (
              <span
                key={label}
                className={`font-mono text-[11px] px-3 py-1.5 rounded-md ${
                  pass ? "bg-emerald-500/15 text-emerald-300" : "bg-red-500/15 text-red-300"
                }`}
              >
                {pass ? "✓ " : "✕ "}{label}
              </span>
            ))}
          </div>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mt-5">
          {LEGIBILITY.map(l => (
            <div key={l.name} className="rounded-xl border border-border/60 p-5 text-center bg-card">
              <div className="text-[28px] text-foreground mb-2" style={{ fontFamily: l.font }}>Il1 O0 rn m</div>
              <div className="font-mono text-[10px] text-muted-foreground">{l.name}</div>
            </div>
          ))}
        </div>
      </div>
      <div className="px-5 py-4 border-t border-border/60">
        <p className="text-[13px] leading-[1.7] text-muted-foreground">
          WCAG AA requires <b className="text-foreground">4.5:1</b> for normal text and <b className="text-foreground">3:1</b> for large text (≥24px, or ≥18.66px bold). Body text should rarely fall below 16px, and the layout must stay usable at 200% zoom. Choose letterforms that disambiguate <b className="text-foreground">I l 1</b> and <b className="text-foreground">O 0</b> — a quiet but real win for dyslexic and low-vision readers.
        </p>
      </div>
    </Tool>
  )
}

// ─── HERO ─────────────────────────────────────────────────────────────────—

function Hero() {
  const a = articleItems.find(x => x.href === HREF)!
  return (
    <div className="relative w-full min-h-[440px] md:min-h-[500px] flex items-end" style={{ background: ACCENT }}>
      <div
        className="absolute inset-0 pointer-events-none"
        style={{ backgroundImage: "radial-gradient(rgba(255,255,255,0.4) 1px, transparent 1px)", backgroundSize: "22px 22px", opacity: 0.15 }}
      />
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,transparent_30%,rgba(0,0,0,0.35)_100%)]" />
      <div className="absolute inset-x-0 bottom-0 h-1/2 bg-gradient-to-t from-black/50 to-transparent" />
      <span
        className="absolute top-1/2 right-12 -translate-y-1/2 leading-none select-none pointer-events-none hidden md:block"
        style={{ fontSize: "240px", color: "rgba(255,255,255,0.06)", fontFamily: F.serif, fontWeight: 600 }}
      >
        Aa
      </span>

      <div className="relative z-10 w-full max-w-4xl mx-auto px-6 pb-14 pt-32 space-y-5">
        <div className="flex flex-wrap items-center gap-3">
          <span className="text-[11px] font-bold uppercase tracking-[0.2em] px-3 py-1 rounded-full" style={{ background: "rgba(255,255,255,0.15)", color: "rgba(255,255,255,0.9)" }}>
            {a.category}
          </span>
          <span className="flex items-center gap-1.5 text-[12px] text-white/60"><IconClock size={12} />{a.readTime}</span>
          <span className="flex items-center gap-1.5 text-[12px] text-white/60"><IconCalendar size={12} />{a.date}</span>
        </div>
        <h1 className="text-3xl md:text-[2.6rem] font-bold tracking-tight leading-[1.1] text-white">{a.title}</h1>
        <p className="text-[17px] text-white/70 leading-relaxed max-w-xl">{a.description}</p>
        <div className="flex flex-wrap gap-2 pt-1">
          {a.tags?.map(tag => (
            <span key={tag} className="text-[10px] font-semibold uppercase tracking-widest px-2.5 py-1 rounded" style={{ background: "rgba(0,0,0,0.25)", color: "rgba(255,255,255,0.65)" }}>
              {tag}
            </span>
          ))}
        </div>
      </div>
    </div>
  )
}

// ─── RELATED ──────────────────────────────────────────────────────────────—

function Related() {
  const related = articleItems.filter(a => a.href !== HREF).slice(0, 3)
  return (
    <div className="border-t border-border/40 bg-foreground/[0.015] dark:bg-white/[0.015]">
      <div className="max-w-4xl mx-auto px-6 py-14">
        <div className="flex items-center gap-3 mb-7">
          <div className="w-4 h-[2px] bg-orange-500 rounded-full" />
          <p className="text-[11px] font-bold uppercase tracking-[0.2em] text-muted-foreground">More Articles</p>
        </div>
        <div className="grid sm:grid-cols-3 gap-4">
          {related.map(a => (
            <Link
              key={a.href}
              href={a.href}
              className="group flex flex-col rounded-xl overflow-hidden border border-border/40 hover:border-orange-500/25 transition-all duration-300 hover:-translate-y-1"
            >
              <div className="relative h-28 flex-shrink-0" style={{ background: a.accent }}>
                <div className="absolute inset-0 pointer-events-none" style={{ backgroundImage: "radial-gradient(rgba(255,255,255,0.4) 1px, transparent 1px)", backgroundSize: "14px 14px", opacity: 0.12 }} />
              </div>
              <div className="p-4 bg-background flex-1">
                <span className="text-[10px] font-semibold uppercase tracking-[0.16em] text-muted-foreground">
                  {a.category}{a.readTime && ` · ${a.readTime}`}
                </span>
                <p className="text-[13px] font-medium leading-snug mt-1.5 mb-1 group-hover:text-orange-600 dark:group-hover:text-orange-400 transition-colors line-clamp-2">{a.title}</p>
                <p className="text-[12px] text-muted-foreground line-clamp-2 leading-relaxed">{a.description}</p>
              </div>
            </Link>
          ))}
        </div>
        <div className="mt-10 text-center">
          <Link href="/articles" className="inline-flex items-center gap-2 text-sm font-medium text-muted-foreground hover:text-orange-600 dark:hover:text-orange-400 transition-colors">
            All articles <IconArrowUpRight size={14} />
          </Link>
        </div>
      </div>
    </div>
  )
}

// ─── PAGE ─────────────────────────────────────────────────────────────────—

export default function Page() {
  return (
    <main>
      {/* Showcase typefaces — loaded only on this article */}
      <link rel="preconnect" href="https://fonts.googleapis.com" />
      <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
      {/* eslint-disable-next-line @next/next/no-page-custom-font -- showcase typefaces are intentionally scoped to this article only */}
      <link
        href="https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,400;0,600;1,400&family=Inter:wght@300;400;500;600;700&family=DM+Mono:wght@400;500&family=Lora:ital,wght@0,400;0,600;1,400&family=Space+Grotesk:wght@400;500;700&family=Fraunces:ital,opsz,wght@0,9..144,400;0,9..144,600&family=Poppins:wght@400;500;600&family=Lato:wght@300;400;700&display=swap"
        rel="stylesheet"
      />

      <Hero />

      {/* 01 FOUNDATIONS */}
      <Section id="foundations">
        <FadeIn><Eyebrow num="01" tag="Foundations" /></FadeIn>
        <FadeIn><Title>Typography foundations</Title></FadeIn>
        <FadeIn><Lede>A typography system is the set of rules that govern how text looks and behaves across an entire product. It is the difference between text that is merely present and text that actively guides, reassures, and communicates.</Lede></FadeIn>

        <FadeIn className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {TYPE_SHOW.map(c => (
            <div key={c.word} className="rounded-xl border border-border/60 bg-card p-7 hover:border-border transition-colors">
              <div className="mb-4 leading-[1.05] tracking-[-0.01em] text-foreground" style={{ fontFamily: c.font, fontWeight: c.weight, fontStyle: c.style, fontSize: 42 }}>
                {c.word}
              </div>
              <p className="font-mono text-[10px] uppercase tracking-[0.12em] text-orange-500 mb-1.5">{c.lbl}</p>
              <p className="text-[13px] text-muted-foreground leading-[1.65]">{c.desc}</p>
            </div>
          ))}
        </FadeIn>

        <Note label="Typography is UX, not styling">Roughly 95% of the information on the web is written language. The type system isn&apos;t a cosmetic pass at the end of a project — it is the primary medium through which the product communicates. Treat it as core architecture.</Note>
      </Section>

      {/* 02 CLASSIFICATION */}
      <Section id="classification" muted>
        <FadeIn><Eyebrow num="02" tag="Classification" /></FadeIn>
        <FadeIn><Title>Font classification system</Title></FadeIn>
        <FadeIn><Lede>Every typeface belongs to a family of forms with its own history, temperament, and ideal use. Knowing the categories lets you choose deliberately instead of by accident.</Lede></FadeIn>

        <FadeIn className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {CLASSES.map(c => (
            <div key={c.name} className="rounded-xl border border-border/60 bg-card overflow-hidden hover:border-border transition-colors">
              <div className="px-7 pt-8 pb-5 text-foreground border-b border-border/60 leading-none" style={{ fontFamily: c.spec, fontSize: c.size }}>
                Ag
              </div>
              <div className="px-7 py-5">
                <p className="font-mono text-[11px] uppercase tracking-[0.1em] text-orange-500 mb-1">{c.name}</p>
                <p className="font-mono text-[10px] text-muted-foreground mb-3">{c.font}</p>
                <p className="text-[13px] text-foreground/75 leading-[1.7] mb-3">{c.desc}</p>
                <div className="flex flex-wrap gap-1.5">
                  {c.traits.map(t => (
                    <span key={t} className="font-mono text-[9px] uppercase tracking-[0.06em] text-muted-foreground border border-border rounded-full px-2.5 py-1">{t}</span>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </FadeIn>

        <FadeIn><SubEyebrow>Tool · Font pairing explorer</SubEyebrow></FadeIn>
        <FadeIn><FontPairingExplorer /></FadeIn>
      </Section>

      {/* 03 TYPE SCALE */}
      <Section id="scale">
        <FadeIn><Eyebrow num="03" tag="Type Scale" /></FadeIn>
        <FadeIn><Title>The modular type scale</Title></FadeIn>
        <FadeIn><Lede>A type scale is a fixed set of sizes derived from one base and one ratio. Every size in the product comes from the scale — never an arbitrary value. This is what makes typography feel composed instead of chaotic.</Lede></FadeIn>

        <FadeIn><SubEyebrow>Tool · Modular scale generator</SubEyebrow></FadeIn>
        <FadeIn><ModularScaleTool /></FadeIn>
      </Section>

      {/* 04 READING */}
      <Section id="reading" muted>
        <FadeIn><Eyebrow num="04" tag="Reading Experience" /></FadeIn>
        <FadeIn><Title>The reading experience</Title></FadeIn>
        <FadeIn><Lede>Sizing the type is only half the job. Line length, vertical rhythm, and paragraph spacing decide whether reading feels effortless or exhausting. These are the quiet mechanics of comfort.</Lede></FadeIn>

        <FadeIn className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-4">
          <div className="rounded-xl border border-emerald-500/30 bg-card p-6">
            <span className="font-mono text-[10px] uppercase tracking-[0.1em] text-emerald-500 mb-4 inline-block">✓ Comfortable</span>
            <p className="text-[14px] text-foreground/75" style={{ maxWidth: "62ch", lineHeight: 1.7 }}>
              Lines of 50–75 characters let the eye return to the start of the next line without effort. Generous line height gives each line room to breathe, and the reader settles into a rhythm.
            </p>
          </div>
          <div className="rounded-xl border border-red-500/30 bg-card p-6">
            <span className="font-mono text-[10px] uppercase tracking-[0.1em] text-red-500 mb-4 inline-block">✕ Fatiguing</span>
            <p className="text-[14px] text-foreground/75" style={{ lineHeight: 1.25 }}>
              Lines that run the full width of a wide screen force long eye journeys and make it easy to lose your place when returning to the left edge, while cramped line height removes the breathing room each line needs, so the paragraph becomes a wall of text that the eye slides off rather than reads.
            </p>
          </div>
        </FadeIn>

        <FadeIn><SubEyebrow>Tool · Reading width &amp; line-height simulator</SubEyebrow></FadeIn>
        <FadeIn><ReadingSimulator /></FadeIn>

        <Note label="Vertical rhythm">Set line height and spacing on a consistent baseline unit (e.g. 4px or 8px). When headings, body, and spacing all snap to the same grid, the page acquires an invisible structure the eye reads as &ldquo;calm&rdquo; — even though most users could never name why.</Note>
      </Section>

      {/* 05 HIERARCHY */}
      <Section id="hierarchy">
        <FadeIn><Eyebrow num="05" tag="Hierarchy" /></FadeIn>
        <FadeIn><Title>Typographic hierarchy</Title></FadeIn>
        <FadeIn><Lede>Hierarchy is how a layout tells you where to look first, second, third. It&apos;s built from four levers — size, weight, color/contrast, and space. Strong hierarchy needs only a few of them used decisively.</Lede></FadeIn>

        <FadeIn><SubEyebrow>Tool · Weight &amp; hierarchy playground</SubEyebrow></FadeIn>
        <FadeIn><HierarchyPlayground /></FadeIn>

        <Note label="Contrast creates hierarchy — not size alone">The most common hierarchy failure is making everything big. If the heading is 32px and the subhead is 28px, there&apos;s no clear order. Aim for decisive jumps in at least one dimension: a bold 24px title above a regular 14px body reads more clearly than two similar large sizes.</Note>
      </Section>

      {/* 06 TYPOGRAPHY FOR UI */}
      <Section id="ui" muted>
        <FadeIn><Eyebrow num="06" tag="Typography for UI" /></FadeIn>
        <FadeIn><Title>Typography for interfaces</Title></FadeIn>
        <FadeIn><Lede>Interface type lives under different pressure than editorial type: small sizes, dense layouts, tabular data, touch targets, and glanceable labels. Each context has its own rules.</Lede></FadeIn>

        <FadeIn className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div className="rounded-xl border border-border/60 bg-card p-7">
            <h4 className="font-mono text-[10px] uppercase tracking-[0.12em] text-orange-500 mb-5">Buttons &amp; actions</h4>
            <div className="flex flex-wrap items-center gap-2.5">
              <button type="button" className="rounded-lg bg-orange-500 text-white px-4 py-2 text-[14px] font-medium">Primary action</button>
              <button type="button" className="rounded-lg bg-transparent text-foreground border border-border px-4 py-2 text-[14px] font-medium">Secondary</button>
            </div>
            <p className="text-[11px] text-muted-foreground mt-4 leading-[1.6]">14–15px, medium weight, generous letter-spacing on uppercase. Labels are verbs. Never let a button label wrap.</p>
          </div>

          <div className="rounded-xl border border-border/60 bg-card p-7">
            <h4 className="font-mono text-[10px] uppercase tracking-[0.12em] text-orange-500 mb-5">Forms &amp; inputs</h4>
            <label className="block text-[12px] font-medium text-foreground mb-1.5">Work email</label>
            <input readOnly value="ada@studio.com" className="w-full bg-background border border-border rounded-md px-3 py-2 text-foreground text-[14px]" />
            <p className="text-[11px] text-muted-foreground mt-1.5 leading-[1.6]">Label 12–13px medium · input 14–16px (≥16px on mobile to stop iOS zoom) · hint 11–12px muted.</p>
          </div>

          <div className="rounded-xl border border-border/60 bg-card p-7">
            <h4 className="font-mono text-[10px] uppercase tracking-[0.12em] text-orange-500 mb-5">Data tables</h4>
            <table className="w-full border-collapse">
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
            <p className="text-[11px] text-muted-foreground mt-3 leading-[1.6]">Tabular-figure numerals so digits align in columns. Labels uppercase mono; values regular.</p>
          </div>

          <div className="rounded-xl border border-border/60 bg-card p-7">
            <h4 className="font-mono text-[10px] uppercase tracking-[0.12em] text-orange-500 mb-5">Navigation</h4>
            <div className="flex gap-6 items-center">
              <span className="text-[13px] text-foreground font-medium">Overview</span>
              {["Projects", "Members", "Settings"].map(n => (
                <span key={n} className="text-[13px] text-muted-foreground">{n}</span>
              ))}
            </div>
            <p className="text-[11px] text-muted-foreground mt-4 leading-[1.6]">13–14px. Current item earns weight and full contrast; the rest recede to muted. Hierarchy by state, not size.</p>
          </div>
        </FadeIn>

        <Note label="Dense interfaces need the system most">Dashboards and tables pack dozens of type styles per screen. Without a token system they drift into a dozen near-identical sizes. A tight scale of 5–6 UI sizes (label, caption, body, body-strong, subhead, value) covers almost every dense interface — resist adding more.</Note>
      </Section>

      {/* 07 RESPONSIVE */}
      <Section id="responsive">
        <FadeIn><Eyebrow num="07" tag="Responsive" /></FadeIn>
        <FadeIn><Title>Responsive &amp; fluid typography</Title></FadeIn>
        <FadeIn><Lede>Type can&apos;t be one size. <code className="font-mono text-[13px] text-orange-500">clamp()</code> lets a size scale smoothly between a minimum and maximum across the viewport — no breakpoints, no jumps. Define the floor, the ceiling, and let the middle flow.</Lede></FadeIn>

        <FadeIn><SubEyebrow>Tool · Responsive clamp preview</SubEyebrow></FadeIn>
        <FadeIn><ResponsiveClampPreview /></FadeIn>
      </Section>

      {/* 08 ACCESSIBILITY */}
      <Section id="accessibility" muted>
        <FadeIn><Eyebrow num="08" tag="Accessibility" /></FadeIn>
        <FadeIn><Title>Accessible by default</Title></FadeIn>
        <FadeIn><Lede>Accessible typography isn&apos;t a constraint bolted on at the end — it&apos;s a set of defaults that make the product better for everyone. Contrast, minimum sizes, zoom behaviour, and legible letterforms are the baseline.</Lede></FadeIn>

        <FadeIn><SubEyebrow>Tool · Contrast &amp; size checker</SubEyebrow></FadeIn>
        <FadeIn><A11yChecker /></FadeIn>
      </Section>

      {/* 09 TOKENS */}
      <Section id="tokens">
        <FadeIn><Eyebrow num="09" tag="Tokens" /></FadeIn>
        <FadeIn><Title>Typography tokens</Title></FadeIn>
        <FadeIn><Lede>Tokens turn typographic decisions into a single source of truth. Name them by role, layer them from raw value to semantic to component, and components stop hard-coding sizes forever.</Lede></FadeIn>

        <FadeIn className="flex flex-col gap-2.5">
          {[
            { lbl: "01 — Global / primitive", code: "--font-size-500: 20px;  --leading-snug: 1.25;  --weight-medium: 500;" },
            { lbl: "02 — Semantic / role", code: "--text-heading: var(--font-size-500)/var(--leading-snug) var(--weight-medium);" },
            { lbl: "03 — Component", code: "--card-title-font: var(--text-heading);" },
          ].map((t, i) => (
            <div key={t.lbl}>
              <div className="rounded-xl border border-border/60 bg-card px-5 py-4">
                <p className="font-mono text-[10px] uppercase tracking-[0.1em] text-orange-500 mb-2">{t.lbl}</p>
                <code className="font-mono text-[12px] text-foreground/70">{t.code}</code>
              </div>
              {i < 2 && <p className="text-center text-muted-foreground text-[12px] py-1">↓ referenced by</p>}
            </div>
          ))}
        </FadeIn>

        <FadeIn><SubEyebrow>Real token architecture · CSS custom properties</SubEyebrow></FadeIn>
        <FadeIn>
          <Tool>
            <div className="px-5 py-4">
              <div className="flex justify-end mb-3">
                <CopyButton text={TOKEN_CODE} />
              </div>
              <pre className="font-mono text-[12px] leading-[1.7] text-foreground/70 bg-background border border-border rounded-lg px-4 py-4 overflow-x-auto">{TOKEN_CODE}</pre>
            </div>
          </Tool>
        </FadeIn>

        <Note label="Name by role, not by value">A token called <code className="font-mono text-[11px]">--text-body</code> survives a redesign; one called <code className="font-mono text-[11px]">--text-16</code> becomes a lie the moment body text changes to 17px. The number describes what it is; the role describes what it&apos;s for.</Note>
      </Section>

      {/* 10 MISTAKES */}
      <Section id="mistakes" muted>
        <FadeIn><Eyebrow num="10" tag="Common Mistakes" /></FadeIn>
        <FadeIn><Title>Common typography mistakes</Title></FadeIn>
        <FadeIn><Lede>Most typographic problems are a handful of recurring errors. Each has a simple correction — seeing them side by side is the fastest way to internalise the fix.</Lede></FadeIn>

        <FadeIn className="space-y-3">
          {/* Weak contrast */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-px rounded-xl border border-border/60 overflow-hidden bg-border/40">
            <div className="bg-card p-7">
              <span className="font-mono text-[10px] uppercase tracking-[0.1em] text-red-500 mb-4 inline-block">✕ Weak contrast</span>
              <p className="text-[14px] text-foreground/25">This body text is set in a low-contrast grey that drops well below 4.5:1. It looks &ldquo;subtle&rdquo; in the mockup and becomes unreadable in sunlight or for low-vision users.</p>
              <p className="text-[12px] text-muted-foreground mt-4">Designers mistake low contrast for elegance.</p>
            </div>
            <div className="bg-card p-7">
              <span className="font-mono text-[10px] uppercase tracking-[0.1em] text-emerald-500 mb-4 inline-block">✓ Corrected</span>
              <p className="text-[14px] text-foreground/75">This body text clears 4.5:1 against the background. It still reads as calm and secondary — restraint comes from hierarchy and size, not from making text hard to see.</p>
              <p className="text-[12px] text-muted-foreground mt-4">Use weight and size for &ldquo;quiet,&rdquo; never failing contrast.</p>
            </div>
          </div>

          {/* Tiny body */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-px rounded-xl border border-border/60 overflow-hidden bg-border/40">
            <div className="bg-card p-7">
              <span className="font-mono text-[10px] uppercase tracking-[0.1em] text-red-500 mb-4 inline-block">✕ Tiny body text</span>
              <p className="text-[11px] text-foreground/75" style={{ lineHeight: 1.4 }}>Body copy set at 11px to fit more on screen. Users pinch-zoom, lean in, and tire quickly. Density bought at the cost of readability is a bad trade.</p>
              <p className="text-[12px] text-muted-foreground mt-4">11px body to win a layout argument.</p>
            </div>
            <div className="bg-card p-7">
              <span className="font-mono text-[10px] uppercase tracking-[0.1em] text-emerald-500 mb-4 inline-block">✓ Corrected</span>
              <p className="text-[16px] text-foreground/75" style={{ lineHeight: 1.65 }}>Body copy at 16px with comfortable line height. Slightly less fits per screen — and every line is effortless to read on any device.</p>
              <p className="text-[12px] text-muted-foreground mt-4">16px floor for body; cut content, not size.</p>
            </div>
          </div>

          {/* Too many weights */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-px rounded-xl border border-border/60 overflow-hidden bg-border/40">
            <div className="bg-card p-7">
              <span className="font-mono text-[10px] uppercase tracking-[0.1em] text-red-500 mb-4 inline-block">✕ Too many weights</span>
              <p className="text-[14px] text-foreground/75">
                <span style={{ fontWeight: 300 }}>Thin</span> <span style={{ fontWeight: 400 }}>Regular</span> <span style={{ fontWeight: 500 }}>Medium</span> <span style={{ fontWeight: 600 }}>Semibold</span> <span style={{ fontWeight: 700 }}>Bold</span> — five weights on one screen, none of them meaning anything specific.
              </p>
              <p className="text-[12px] text-muted-foreground mt-4">Every weight loaded &ldquo;just in case.&rdquo;</p>
            </div>
            <div className="bg-card p-7">
              <span className="font-mono text-[10px] uppercase tracking-[0.1em] text-emerald-500 mb-4 inline-block">✓ Corrected</span>
              <p className="text-[14px] text-foreground/75">
                <span style={{ fontWeight: 400 }}>Regular for body.</span> <span style={{ fontWeight: 600 }}>Semibold for emphasis.</span> Two weights, each with a clear job. The contrast between them does all the work.
              </p>
              <p className="text-[12px] text-muted-foreground mt-4">2–3 weights, each assigned a role.</p>
            </div>
          </div>

          {/* Over-centered */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-px rounded-xl border border-border/60 overflow-hidden bg-border/40">
            <div className="bg-card p-7">
              <span className="font-mono text-[10px] uppercase tracking-[0.1em] text-red-500 mb-4 inline-block">✕ Over-centered text</span>
              <p className="text-[13px] text-foreground/75 text-center" style={{ lineHeight: 1.7 }}>Long passages set centered force the eye to hunt for the start of every line because the left edge moves. Centering is for short, symmetric moments — not paragraphs of running text like this one.</p>
              <p className="text-[12px] text-muted-foreground mt-4 text-center">Centering body copy &ldquo;for balance.&rdquo;</p>
            </div>
            <div className="bg-card p-7">
              <span className="font-mono text-[10px] uppercase tracking-[0.1em] text-emerald-500 mb-4 inline-block">✓ Corrected</span>
              <p className="text-[13px] text-foreground/75 text-left" style={{ lineHeight: 1.7 }}>Running text is left-aligned, giving the eye a fixed return edge. Centering is reserved for headings, single lines, and short callouts where it adds elegance without cost.</p>
              <p className="text-[12px] text-muted-foreground mt-4">Left-align paragraphs; center only short lines.</p>
            </div>
          </div>
        </FadeIn>
      </Section>

      {/* 11 PRINCIPLES */}
      <Section id="principles">
        <FadeIn><Eyebrow num="11" tag="Principles" /></FadeIn>
        <FadeIn><Title>Typography principles</Title></FadeIn>
        <FadeIn><Lede>A typography system isn&apos;t a font choice — it&apos;s a set of convictions about how text should serve the reader. These six hold up across products, brands, and platforms.</Lede></FadeIn>

        <FadeIn className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
          {PRINCIPLES.map(p => (
            <div key={p.num} className="rounded-xl border border-border/60 bg-card p-7 hover:border-border transition-colors">
              <span className="font-mono text-[11px] text-orange-500 tracking-[0.1em] mb-5 block">{p.num} —</span>
              <p className="font-semibold text-[18px] leading-[1.2] text-foreground mb-2.5" style={{ fontFamily: F.serif, fontWeight: 600 }}>{p.title}</p>
              <p className="text-[13px] text-muted-foreground leading-[1.7]">{p.body}</p>
            </div>
          ))}
        </FadeIn>
      </Section>

      <Related />
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
