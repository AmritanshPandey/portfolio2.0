import type { ReactNode } from "react"

import { cn } from "@/lib/utils"

/**
 * Living reference for the editorial Foundations
 * (docs/superpowers/specs/2026-10-01-editorial-foundations-design.md).
 * Everything reads tokens through CSS variables, so the header's theme toggle
 * shows both sets. Static on purpose: no client code.
 */

const COLOR_TOKENS = [
  { name: "background", note: "editorial canvas" },
  { name: "foreground", note: "ink" },
  { name: "text-muted", note: "metadata" },
  { name: "surface-1", note: "elevated" },
  { name: "surface-2", note: "artefact stage" },
  { name: "surface-inverse", note: "inverse colour" },
  { name: "accent", note: "the one accent" },
  { name: "border", note: "hairline rule" },
  { name: "rule-strong", note: "system layer" },
] as const

const TYPE_SCALE = [
  { cls: "type-display-hero", label: "Display", sample: "Systems over screens." },
  { cls: "type-hero-internal", label: "Hero, internal", sample: "Decisions over UI." },
  { cls: "type-page-title", label: "Page title", sample: "Clarity over decoration." },
  { cls: "type-section-title", label: "Section title", sample: "Systems that shipped." },
  { cls: "type-case-title", label: "Case title", sample: "One theme file, one brand skin." },
  { cls: "type-subtitle", label: "Subtitle", sample: "Brand token layer" },
  {
    cls: "type-prose",
    label: "Prose",
    sample:
      "Colour, type and radius live in a single brand layer, so a new prospect is a configuration pass rather than a redesign.",
  },
  { cls: "type-card-body", label: "Card body", sample: "Every bank inherits the system." },
  { cls: "type-meta", label: "Meta", sample: "Mastercard · 2022–now" },
  { cls: "type-caption", label: "Caption", sample: "Representative visual." },
  { cls: "type-mono", label: "Mono / system", sample: "↳ Decision" },
] as const

const SPACE = [4, 8, 12, 16, 24, 32, 48, 64, 96, 128, 160]

const RADII = [
  { token: "radius-xs", use: "tags" },
  { token: "radius-sm", use: "buttons" },
  { token: "radius-md", use: "artefacts" },
  { token: "radius-lg", use: "dialogs" },
] as const

const MOTION = [
  ["--dur-1", "200ms", "hover, focus, press"],
  ["--dur-2", "400ms", "nav, dialogs, tabs"],
  ["--dur-3", "600ms", "reveals"],
  ["--dur-4", "900ms", "hero entrance only"],
  ["--ease-out", "cubic-bezier(0.22, 1, 0.36, 1)", "entrances"],
  ["--ease-move", "cubic-bezier(0.65, 0, 0.35, 1)", "layers changing position"],
] as const

const columnVisibility = (i: number) =>
  i < 4 ? "" : i < 8 ? "hidden md:block" : "hidden lg:block"

function Heading({ children, note }: { children: ReactNode; note?: string }) {
  return (
    <div className="mb-5">
      <h3 className="type-subtitle text-foreground">{children}</h3>
      {note && <p className="type-meta mt-1 max-w-2xl">{note}</p>}
    </div>
  )
}

/** Reports whether `dark:` utilities are active at this point in the tree. */
function ScopeProbe({ id }: { id: string }) {
  return (
    <span data-scope-probe={id} className="type-mono">
      <span className="hidden dark:inline">dark: active</span>
      <span className="dark:hidden">dark: inactive</span>
    </span>
  )
}

export function FoundationsReference() {
  return (
    <div className="flex flex-col gap-14 py-12">
      <section id="foundations-color">
        <Heading note="Semantic tokens. Toggle the theme to see both sets; every text pair is held to AA by npm run check:contrast.">
          Colour
        </Heading>
        <div className="grid grid-cols-3 gap-4 sm:grid-cols-5">
          {COLOR_TOKENS.map((t) => (
            <div key={t.name} className="flex flex-col gap-2">
              <div className="h-14 rounded-md border border-border" style={{ background: `var(--${t.name})` }} />
              <div>
                <p className="type-mono text-foreground">--{t.name}</p>
                <p className="type-caption text-muted-foreground">{t.note}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      <section id="foundations-surfaces">
        <Heading note="Four surfaces only. If a surface holds primary content, it is not glass.">Surfaces</Heading>
        <div className="grid gap-4 sm:grid-cols-2">
          <div className="rounded-md border border-border bg-background p-5">
            <p className="type-mono text-foreground">Editorial</p>
            <p className="type-card-body mt-2 text-muted-foreground">The paper canvas.</p>
          </div>
          <div className="layer-interface p-5">
            <p className="type-mono text-foreground">Elevated</p>
            <p className="type-card-body mt-2 text-muted-foreground">Interface artefacts. Hairline, no resting shadow.</p>
          </div>
          <div className="rounded-md border border-border bg-[repeating-linear-gradient(135deg,var(--surface-2)_0_12px,var(--background)_12px_24px)] p-5">
            <div className="layer-glass p-4">
              <p className="type-mono text-foreground">Glass</p>
              <p className="type-card-body mt-2 text-muted-foreground">Metadata, nav and overlays only.</p>
            </div>
          </div>
          <div className="band-inverse rounded-md p-5">
            <p className="type-mono">Inverse band</p>
            <p className="type-card-body mt-2 text-muted-foreground">
              Swaps the token scope. <ScopeProbe id="inside" />
            </p>
          </div>
        </div>
        <p className="type-meta mt-3">
          Outside a band: <ScopeProbe id="outside" />
        </p>
      </section>

      <section id="foundations-band">
        <Heading note="A full-bleed emphasis band, as used for core beliefs and frameworks.">Emphasis band</Heading>
        <div className="band-inverse place-bleed">
          <div className="page-container grid-page section-dense">
            <p className="type-mono place-full text-muted-foreground">Core belief</p>
            <p className="type-section-title place-text mt-4">
              Clarity over decoration. Systems over screens. Decisions over UI.
            </p>
          </div>
        </div>
      </section>

      <section id="foundations-type">
        <Heading note="Bricolage 600 for structural headings, Onest for everything else, JetBrains Mono for system notation only.">
          Type scale
        </Heading>
        <div className="divide-y divide-border border-y border-border">
          {TYPE_SCALE.map((t) => (
            <div key={t.cls} className="grid gap-2 py-4 md:grid-cols-[12rem_1fr] md:items-baseline">
              <p className="type-mono text-muted-foreground">
                {t.label} · .{t.cls}
              </p>
              <p className={cn(t.cls, "text-foreground")}>{t.sample}</p>
            </div>
          ))}
        </div>
      </section>

      <section id="foundations-grid">
        <Heading note="12 columns from 1024px, 8 on tablet, 4 on mobile. In development, add ?grid to any URL to overlay it.">
          Grid
        </Heading>
        <div className="grid-page">
          {Array.from({ length: 12 }, (_, i) => (
            <div key={i} className={cn("h-16 rounded-xs bg-accent/15", columnVisibility(i))} />
          ))}
          <div className="type-meta place-text mt-3 rounded-xs border border-dashed border-rule-strong p-3">
            .place-text: the prose column (≈64ch)
          </div>
        </div>
      </section>

      <section id="foundations-space">
        <Heading note="4px base. Sections use .section-dense (64→96px) or .section-quiet (96→160px).">
          Spacing and radius
        </Heading>
        <div className="flex flex-col gap-2">
          {SPACE.map((px, i) => (
            <div key={px} className="flex items-center gap-4">
              <span className="type-mono w-20 text-muted-foreground">--space-{i + 1}</span>
              <span className="h-2 bg-accent" style={{ width: px }} />
              <span className="type-caption text-muted-foreground">{px}px</span>
            </div>
          ))}
        </div>
        <div className="mt-8 flex flex-wrap gap-6">
          {RADII.map((r) => (
            <div key={r.token} className="flex flex-col items-center gap-2">
              <div className="size-16 border border-rule-strong bg-muted" style={{ borderRadius: `var(--${r.token})` }} />
              <p className="type-mono text-foreground">--{r.token}</p>
              <p className="type-caption text-muted-foreground">{r.use}</p>
            </div>
          ))}
        </div>
      </section>

      <section id="foundations-layers">
        <Heading note="Interface < system < annotation < context. Layers overlap by grid offsets; at most three are visible at once. The accent marks the decision.">
          Layers
        </Heading>
        <div className="relative h-[26rem] rounded-md bg-muted md:h-72">
          <div className="layer-interface absolute left-4 top-4 h-48 w-[80%] p-4 md:left-6 md:top-6 md:w-[58%]">
            <p className="type-mono text-muted-foreground">Interface</p>
            <div className="mt-4 h-12 rounded-md bg-foreground/10" />
            <div className="mt-3 h-2 w-3/4 rounded-xs bg-foreground/10" />
            <div className="mt-2 h-2 w-1/2 rounded-xs bg-foreground/10" />
          </div>
          <div className="layer-system absolute left-[20%] top-40 h-36 w-[70%] p-4 md:left-[30%] md:top-20 md:w-[44%]">
            <p className="type-mono text-foreground">↳ System · token layer</p>
            <p className="mt-2 font-mono text-[11px] leading-6 text-foreground">
              color.primary → brand
              <br />
              radius.card → 12px
            </p>
          </div>
          <span className="marker-line absolute left-[58%] top-[6.6rem] hidden w-[12%] md:block" />
          <span className="marker absolute left-[calc(58%-4px)] top-[6.35rem] hidden md:block" />
          <div className="layer-glass absolute bottom-4 right-4 w-[55%] p-4 md:bottom-auto md:right-6 md:top-10 md:w-[30%]">
            <p className="type-mono text-accent">↳ Decision</p>
            <p className="type-card-body mt-1 text-foreground">Tokens, not templates.</p>
          </div>
        </div>
      </section>

      <section id="foundations-motion">
        <Heading note="Slow, quiet, purposeful. With reduced motion, reveals become opacity-only or nothing.">Motion</Heading>
        <div className="divide-y divide-border border-y border-border">
          {MOTION.map(([token, value, use]) => (
            <div key={token} className="grid grid-cols-[8rem_1fr] gap-x-4 gap-y-1 py-3 md:grid-cols-[10rem_1fr_14rem]">
              <p className="type-mono text-foreground">{token}</p>
              <p className="font-mono text-[12px] text-muted-foreground">{value}</p>
              <p className="type-caption col-span-2 text-muted-foreground md:col-span-1">{use}</p>
            </div>
          ))}
        </div>
      </section>
    </div>
  )
}
