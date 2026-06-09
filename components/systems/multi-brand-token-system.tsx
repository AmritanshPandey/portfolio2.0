"use client"

import { motion } from "framer-motion"

/* ──────────────────────────────────────────────────────────────────────────
   Multi-Brand Theming & Token System
   A systems artifact: explains how one product foundation supports many brands
   through a layered token architecture. Explanation first, then the system.
   All copy is editable from the data objects below.
   ────────────────────────────────────────────────────────────────────────── */

const sectionMeta = {
  eyebrow: "Systems / Scale / Brand Infrastructure",
  title:   "Multi-Brand Theming & Token System",
  context:
    "I created a token architecture that let multiple brands share the same product foundation while keeping their own visual identity. Instead of rebuilding components per brand, the system separated product logic from brand expression through reusable semantic tokens, brand tokens, and component-level decisions.",
  principleTitle: "Separate structure from expression",
  principleBody:
    "The product experience stayed consistent across brands; visual identity changed through controlled token layers. Teams reused flows, components, and logic without forcing every brand to look the same.",
}

// 3-layer architecture diagram: a shared foundation that diverges into brands.
const diagram = {
  foundation: {
    label: "Product Foundation",
    items: ["Layout", "Components", "Interaction rules", "UX patterns"],
  },
  semantic: {
    label: "Semantic Tokens",
    items: ["Surface", "Text", "Border", "Action", "Feedback", "State"],
  },
  brandFacets: ["Color", "Type", "Radius", "Motion"],
}

// Token architecture breakdown — increasing specificity, foundation → component.
const tokenLayers = [
  { n: "01", name: "Foundation Tokens", desc: "Spacing, grid, elevation, interaction behavior, and responsive layout." },
  { n: "02", name: "Semantic Tokens",   desc: "Intent-based decisions: surface, text, border, action, feedback, and state." },
  { n: "03", name: "Brand Tokens",      desc: "Brand-specific color, typography, radius, imagery, and motion tone." },
  { n: "04", name: "Component Tokens",  desc: "Per-component tuning: buttons, cards, inputs, tiles, badges, checkout." },
]

// Three brands inherit the same foundation; only their brand tokens differ.
type BrandTheme = {
  id: string
  name: string
  tone: string
  accent: string
  radius: number          // px, drives the live preview
  radiusLabel: string
  typeLabel: string
  surfaceLabel: string
  // preview type treatment expresses the "typography flavor" without new fonts
  headingClass: string
}

const brandThemes: BrandTheme[] = [
  {
    id: "brand-a", name: "Brand A", tone: "Warm · accessible · mass-market",
    accent: "#d97706", radius: 16, radiusLabel: "Soft",
    typeLabel: "Friendly", surfaceLabel: "Light",
    headingClass: "font-medium tracking-normal",
  },
  {
    id: "brand-b", name: "Brand B", tone: "Clinical · precise · expert-led",
    accent: "#2563eb", radius: 8, radiusLabel: "Medium",
    typeLabel: "Structured", surfaceLabel: "Clean",
    headingClass: "font-semibold tracking-tight",
  },
  {
    id: "brand-c", name: "Brand C", tone: "Fresh · youthful · discovery-led",
    accent: "#0d9488", radius: 12, radiusLabel: "Expressive",
    typeLabel: "Expressive", surfaceLabel: "Airy",
    headingClass: "font-bold tracking-[0.01em]",
  },
]

const impactItems = [
  { metric: "7",    title: "Shared Foundation",   body: "Brands on one reusable UX and component base." },
  { metric: "340+", title: "Brand Flexibility",   body: "Tokens — distinct visual systems, shared flows." },
  { metric: "0",    title: "Reduced Duplication", body: "Component forks. No repeated design or engineering." },
  { metric: "60%",  title: "Faster Scale",        body: "Faster brand switch, shipped through token changes." },
]

// ─── motion ──────────────────────────────────────────────────────────────────

function Reveal({ children, delay = 0, className = "" }: {
  children: React.ReactNode; delay?: number; className?: string
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 14 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-60px" }}
      transition={{ duration: 0.5, delay, ease: [0.22, 1, 0.36, 1] }}
      className={className}
    >
      {children}
    </motion.div>
  )
}

// ─── small parts ───────────────────────────────────────────────────────────────

function Chip({ children }: { children: React.ReactNode }) {
  return (
    <li className="text-[11px] text-muted-foreground border border-border/70 rounded-md px-2.5 py-1 leading-none">
      {children}
    </li>
  )
}

function LayerBand({ n, label, items, accent }: {
  n: string; label: string; items: string[]; accent?: string
}) {
  return (
    <div className="rounded-xl border border-border/60 bg-background/40 px-4 py-3.5">
      <div className="flex items-center gap-2.5 mb-2.5">
        <span
          className="w-1.5 h-1.5 rounded-full flex-shrink-0"
          style={{ backgroundColor: accent ?? "var(--text-muted)" }}
        />
        <span className="font-mono text-[10px] text-muted-foreground/70">{n}</span>
        <span className="text-[13px] font-semibold text-foreground">{label}</span>
      </div>
      <ul className="flex flex-wrap gap-1.5">
        {items.map(it => <Chip key={it}>{it}</Chip>)}
      </ul>
    </div>
  )
}

function Connector({ label }: { label: string }) {
  return (
    <div className="flex flex-col items-center py-1.5" aria-hidden="true">
      <span className="w-px h-4 bg-border" />
      <span className="font-mono text-[9px] uppercase tracking-[0.14em] text-muted-foreground/60 py-1">{label}</span>
      <span className="w-px h-4 bg-border" />
    </div>
  )
}

// Fans from one shared layer down to three brands — the inheritance, made visible.
function BranchConnector({ label }: { label: string }) {
  return (
    <div className="pt-1.5" aria-hidden="true">
      <p className="text-center font-mono text-[9px] uppercase tracking-[0.14em] text-muted-foreground/60 mb-1">
        {label}
      </p>
      <motion.svg
        viewBox="0 0 100 24"
        preserveAspectRatio="none"
        className="w-full h-6 text-foreground/20"
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true, margin: "-40px" }}
        transition={{ duration: 0.6, delay: 0.15, ease: [0.22, 1, 0.36, 1] }}
      >
        <g fill="none" stroke="currentColor" strokeWidth="1" vectorEffect="non-scaling-stroke">
          <path d="M50 0 V8" />
          <path d="M16.7 8 H83.3" />
          <path d="M16.7 8 V24" />
          <path d="M50 8 V24" />
          <path d="M83.3 8 V24" />
        </g>
      </motion.svg>
    </div>
  )
}

// ─── section ─────────────────────────────────────────────────────────────────

export function MultiBrandTokenSystem() {
  return (
    <section
      aria-labelledby="mbts-title"
      className="border-t border-border/40 bg-foreground/[0.015] dark:bg-white/[0.015]"
    >
      <div className="max-w-[1200px] mx-auto px-6 py-16 md:py-24">

        {/* 1 — Headline + eyebrow + 2 — context */}
        <Reveal className="max-w-2xl">
          <p className="font-mono text-[11px] uppercase tracking-[0.18em] text-sky-600 dark:text-sky-400 mb-4">
            {sectionMeta.eyebrow}
          </p>
          <h2 id="mbts-title" className="text-3xl md:text-[2.4rem] font-semibold tracking-tight leading-[1.12] text-foreground text-balance">
            {sectionMeta.title}
          </h2>
          <p className="text-[15px] md:text-base leading-[1.8] text-muted-foreground mt-5">
            {sectionMeta.context}
          </p>
        </Reveal>

        {/* Two-column: explanation (left) + system diagram (right) */}
        <div className="grid lg:grid-cols-[0.85fr_1.15fr] gap-8 lg:gap-12 mt-12 md:mt-16 items-start">

          {/* 3a — Architecture principle */}
          <Reveal>
            <p className="font-mono text-[10px] uppercase tracking-[0.16em] text-muted-foreground mb-3">
              Architecture principle
            </p>
            <h3 className="text-xl md:text-2xl font-semibold tracking-tight leading-snug text-foreground mb-3">
              {sectionMeta.principleTitle}
            </h3>
            <p className="text-[14px] leading-[1.75] text-muted-foreground">
              {sectionMeta.principleBody}
            </p>
          </Reveal>

          {/* 3b — Visual system diagram */}
          <Reveal delay={0.1}>
            <div className="rounded-2xl border border-border/60 bg-card p-4 md:p-5">
              <LayerBand n="L1" label={diagram.foundation.label} items={diagram.foundation.items} />
              <Connector label="inherited by every brand" />
              <LayerBand n="L2" label={diagram.semantic.label} items={diagram.semantic.items} accent="#0ea5e9" />
              <BranchConnector label="resolved per brand" />

              {/* Layer 3 — brand expression diverges across three brands */}
              <div className="grid grid-cols-3 gap-2">
                {brandThemes.map(b => (
                  <div
                    key={b.id}
                    className="rounded-xl border px-2.5 py-3 text-center"
                    style={{ borderColor: `${b.accent}55`, backgroundColor: `${b.accent}0d` }}
                  >
                    <span className="mx-auto mb-2 block w-2 h-2 rounded-full" style={{ backgroundColor: b.accent }} />
                    <p className="text-[11px] font-semibold text-foreground leading-none">{b.name}</p>
                    <ul className="mt-2 space-y-0.5">
                      {diagram.brandFacets.map(f => (
                        <li key={f} className="font-mono text-[9px] text-muted-foreground/70 leading-tight">{f}</li>
                      ))}
                    </ul>
                  </div>
                ))}
              </div>
              <p className="mt-3 text-center font-mono text-[9px] uppercase tracking-[0.14em] text-muted-foreground/55">
                Brand Expression
              </p>
            </div>
          </Reveal>
        </div>

        {/* 4 — Token architecture breakdown */}
        <div className="mt-16 md:mt-20">
          <Reveal>
            <p className="font-mono text-[10px] uppercase tracking-[0.16em] text-muted-foreground mb-5">
              Token architecture
            </p>
          </Reveal>
          <div className="grid gap-2.5 sm:grid-cols-2">
            {tokenLayers.map((layer, i) => (
              <Reveal key={layer.n} delay={i * 0.06}>
                <div className="group rounded-xl border border-border/60 bg-card p-5 transition-colors hover:border-border h-full">
                  <div className="flex items-baseline gap-3 mb-1.5">
                    <span className="font-mono text-[11px] text-sky-600 dark:text-sky-400">{layer.n}</span>
                    <h4 className="text-[15px] font-semibold tracking-tight text-foreground">{layer.name}</h4>
                  </div>
                  <p className="text-[13px] leading-[1.65] text-muted-foreground pl-[1.85rem]">{layer.desc}</p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>

        {/* 5 — Brand theming examples */}
        <div className="mt-16 md:mt-20">
          <Reveal>
            <p className="font-mono text-[10px] uppercase tracking-[0.16em] text-muted-foreground mb-5">
              Brand theming examples
            </p>
          </Reveal>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            {brandThemes.map((b, i) => (
              <Reveal key={b.id} delay={i * 0.07}>
                <div className="group rounded-2xl border border-border/60 bg-card p-5 transition-all duration-300 hover:border-border hover:-translate-y-0.5 h-full flex flex-col">
                  {/* header */}
                  <div className="flex items-center gap-2.5">
                    <span className="w-2.5 h-2.5 rounded-full flex-shrink-0" style={{ backgroundColor: b.accent }} />
                    <p className="text-[15px] font-semibold tracking-tight text-foreground">{b.name}</p>
                  </div>
                  <p className="text-[12px] text-muted-foreground mt-1.5">{b.tone}</p>

                  {/* live preview — same component, different brand tokens */}
                  <div
                    className="mt-4 border border-border/50 bg-background/50 p-4"
                    style={{ borderRadius: b.radius }}
                  >
                    <p className={`text-[13px] text-foreground ${b.headingClass}`}>Pay $240.00</p>
                    <p className="text-[11px] text-muted-foreground mt-0.5 mb-3">To Ada Lovelace · Today</p>
                    <span
                      className="inline-block text-[11px] font-medium text-white px-3 py-1.5"
                      style={{ backgroundColor: b.accent, borderRadius: Math.max(6, b.radius - 4) }}
                    >
                      Confirm payment
                    </span>
                  </div>

                  {/* token values */}
                  <dl className="mt-4 grid grid-cols-2 gap-x-4 gap-y-2.5 text-[11px]">
                    {[
                      ["Primary", b.accent.toUpperCase()],
                      ["Radius", b.radiusLabel],
                      ["Type", b.typeLabel],
                      ["Surface", b.surfaceLabel],
                    ].map(([k, v]) => (
                      <div key={k} className="flex items-center justify-between gap-2 border-b border-border/40 pb-1.5">
                        <dt className="font-mono uppercase tracking-[0.1em] text-muted-foreground/70">{k}</dt>
                        <dd className="flex items-center gap-1.5 text-foreground/80">
                          {k === "Primary" && (
                            <span className="w-2.5 h-2.5 rounded-sm flex-shrink-0" style={{ backgroundColor: b.accent }} />
                          )}
                          <span className="font-mono text-[10px]">{v}</span>
                        </dd>
                      </div>
                    ))}
                  </dl>
                </div>
              </Reveal>
            ))}
          </div>
        </div>

        {/* 6 — Outcome / impact strip */}
        <Reveal delay={0.05}>
          <div className="mt-16 md:mt-20 rounded-2xl border border-border/60 overflow-hidden grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 divide-y sm:divide-y-0 sm:divide-x divide-border/50">
            {impactItems.map(item => (
              <div key={item.title} className="p-5 md:p-6">
                <p className="text-2xl md:text-[2rem] font-semibold tracking-tight text-foreground tabular-nums leading-none">
                  {item.metric}
                </p>
                <p className="text-[13px] font-semibold tracking-tight text-foreground mt-3">{item.title}</p>
                <p className="text-[12px] leading-[1.6] text-muted-foreground mt-1">{item.body}</p>
              </div>
            ))}
          </div>
        </Reveal>

      </div>
    </section>
  )
}
