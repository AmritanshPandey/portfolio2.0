import { articleItems } from "@/lib/data"
import { ArticleHeader, RelatedArticles } from "@/components/articles/article-ui"
import { FadeIn } from "@/components/shared/fade-in"
import { ReadingProgress } from "@/components/shared/reading-progress"
import { ColorScaleTool } from "@/components/shared/color-scale-tool"
import { ColorSystemProvider } from "@/components/shared/color-system/context"
import { PrimaryControls } from "@/components/shared/color-system/primary-controls"
import { DarkModeRemap, ColorInMotion, DataVizPalettes } from "@/components/shared/color-system/practical"
import { PerceptualUniformity, ColorblindSim, NeutralTemperature } from "@/components/shared/color-system/concepts"
import { TokenTaxonomy, BreakTheSystem, ColorVersioning } from "@/components/shared/color-system/architecture"
import { ColorAudit, FigmaVariables, RecommendedTools, GettingBuyIn, OneOffProblem } from "@/components/shared/color-system/qa-human"

// ─── CONSTANTS ───────────────────────────────────────────────────────────────

const HREF   = "/articles/color-system"


// ─── PRIMITIVES ───────────────────────────────────────────────────────────────

function Section({ id, children }: {
  id?: string; children: React.ReactNode; muted?: boolean
}) {
  return (
    <section
      id={id}
      className="border-b border-border/40 bg-background"
    >
      <div className="max-w-6xl mx-auto px-6 py-16 md:py-20">{children}</div>
    </section>
  )
}

function Eyebrow({ num, tag }: { num: string; tag: string }) {
  // A quiet chapter marker for a long-form sequence, not the orange,
  // uppercase, wide-tracked eyebrow trope (per DESIGN.md / PRODUCT.md).
  return (
    <div className="mb-5 font-mono text-[12px] text-muted-foreground">
      <span className="tabular-nums text-foreground/50">{num}</span>
      <span className="mx-2 text-border">/</span>
      {tag}
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
      <div className="my-8 rounded-lg border border-rose-500/20 bg-rose-500/[0.04] p-5 md:p-6 relative overflow-hidden">
        <div className="absolute left-0 top-0 bottom-0 rounded-l-xl" />
        <p className="text-[11px] font-bold uppercase tracking-[0.14em] text-rose-600 dark:text-rose-400 mb-2 pl-2">{label}</p>
        <p className="text-[13px] md:text-[14px] leading-[1.7] text-foreground/80 pl-2">{children}</p>
      </div>
    </FadeIn>
  )
}

// Mono code chip
function Code({ children }: { children: React.ReactNode }) {
  return (
    <span className="inline-block mt-2 font-mono text-[11px] bg-foreground/[0.05] border border-border rounded-md px-3 py-1.5 text-foreground/70 tracking-[0.02em]">
      {children}
    </span>
  )
}

// Wraps an interactive tool so it reads as a distinct, hands-on region, // a soft orange ring + tint and a floating "Interactive" marker.
function ToolFrame({ label = "Interactive", children }: { label?: string; children: React.ReactNode }) {
  return (
    <div className="relative rounded-lg ring-1 ring-rose-500/20 bg-rose-500/[0.02] p-3 md:p-4 mt-2">
      <span className="absolute -top-2.5 left-5 z-10 flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-background border border-rose-500/40 font-mono text-[9px] font-bold uppercase tracking-[0.14em] text-rose-600 dark:text-rose-400">
        <span className="w-1.5 h-1.5 rounded-full bg-rose-500 motion-safe:animate-pulse" />
        {label}
      </span>
      {children}
    </div>
  )
}

// ─── DATA ───────────────────────────────────────────────────────────────────, 

const FOUNDATIONS = [
  { name: "Primary Background",   hex: "#FFFFFF", bg: "#FFFFFF", desc: "The main canvas. Base surface for all page-level content." },
  { name: "Secondary Background", hex: "#F5F5F5", bg: "#F5F5F5", desc: "Separates sections and creates visual grouping within layouts." },
  { name: "Tertiary Background",  hex: "#EBEBEB", bg: "#EBEBEB", desc: "Third depth level, nested panels, sub-regions, inset areas." },
]

const FOUNDATIONS_2 = [
  { name: "Raised Surface",    hex: "+ shadow",        bg: "#FFFFFF", shadow: true,  desc: "Floating panels, command menus, and popovers that sit above the main layout." },
  { name: "Overlay Background", hex: "rgba(0,0,0,.5)", bg: "rgba(0,0,0,0.5)", shadow: false, desc: "Behind modals and drawers. Reduces underlying interface, preserving context." },
]

const SURFACES = [
  { name: "Card",     chip: { background: "#FFFFFF", border: "1px solid #E0E0E0" },                                  role: "Content container", usage: "Tiles, list items, dashboard blocks",  prop: "Restrained contrast",   propColor: "#7EC8A0" },
  { name: "Modal",    chip: { background: "#FFFFFF", boxShadow: "0 4px 16px rgba(0,0,0,0.12)" },                     role: "Interruption layer", usage: "Confirmations, forms, dialogs",        prop: "Strong emphasis",       propColor: "#E8A030" },
  { name: "Dropdown", chip: { background: "#FAFAFA", border: "1px solid #E8E8E8", boxShadow: "0 2px 8px rgba(0,0,0,0.06)" }, role: "Interaction menu", usage: "Select menus, command palettes",  prop: "Subtle + responsive",   propColor: "#A0C8E8" },
  { name: "Tooltip",  chip: { background: "#1C1C1E" },                                                               role: "Contextual hint",   usage: "Icon labels, field helpers",           prop: "Max readability",       propColor: "#E8A030" },
  { name: "Hover",    chip: { background: "#F0F0F0" },                                                               role: "Interactivity signal", usage: "List items, rows, nav links",       prop: "Subtle brightness shift", propColor: "#A0C8E8" },
  { name: "Active",   chip: { background: "#E8F0FE", border: "1px solid #4285F4" },                                  role: "Persistent selection", usage: "Selected rows, nav current, tabs",  prop: "Persistent, distinct",  propColor: "#7EC8A0" },
]

const TYPE_SCALE = [
  { glyph: "#0D0D0D", label: "Primary",   note: "Headings, critical info, CTAs. Maximum visual weight." },
  { glyph: "#444444", label: "Secondary", note: "Body content, descriptions, explanations." },
  { glyph: "#888888", label: "Muted",     note: "Timestamps, metadata, captions, helper text." },
  { glyph: "#BBBBBB", label: "Disabled",  note: "Inactive UI. Must look off, never invisible." },
  { glyph: "#0066CC", label: "Accent",    note: "Links, interactive labels, highlighted values." },
]

const BORDERS = [
  { label: "Subtle",  style: "0.5px solid #E0E0E0", desc: "Cards, grouped sections, tables, navigation. Barely-there structure." },
  { label: "Default", style: "1px solid #C0C0C0",   desc: "Component boundaries. Clearly visible, defines containment." },
  { label: "Strong",  style: "2px solid #606060",   desc: "Active states, selected components. Use sparingly, commands attention fast." },
  { label: "Focus",   style: "2px solid #0066CC",   desc: "Keyboard navigation ring. Highly visible, distinct from hover states." },
]

const ACCENTS = [
  { bg: "#0A2A4A", dot: "#0066CC", name: "Primary Accent",   desc: "CTAs, active nav, focused elements. Core interaction color." },
  { bg: "#0D3260", dot: "#4A90D9", name: "Secondary Accent", desc: "Supporting emphasis. Works alongside primary without competing." },
  { bg: "#0A2038", dot: "#0055AA", name: "Accent Hover",     desc: "Darkened state on pointer entry, confirms interactivity." },
  { bg: "#071828", dot: "#003E80", name: "Accent Active",    desc: "Pressed or selected. Darkest variant, communicates commitment." },
]

const SEMANTIC = [
  { bg: "#0D2B0D", dot: "#4CAF50", title: "Success", titleColor: "#A5D6A7", desc: "Completed actions, confirmed states, passed validation. Always positive." },
  { bg: "#2E2000", dot: "#FFB300", title: "Warning", titleColor: "#FFE082", desc: "Non-blocking issues, cautionary notices. Something to watch, not act on immediately." },
  { bg: "#2D0A0A", dot: "#EF5350", title: "Error",   titleColor: "#FFCDD2", desc: "Failures, invalid inputs, destructive actions. Demands immediate attention." },
  { bg: "#0A1A2D", dot: "#42A5F5", title: "Info",    titleColor: "#BBDEFB", desc: "Neutral notices, contextual tips, non-critical system messages." },
]

const PRINCIPLES = [
  { num: "01", title: "Name by function, not value", body: "Tokens like color-text-secondary age well. Names like gray-500 don't, they describe what the color is, not what it does." },
  { num: "02", title: "Design dark mode first", body: "Dark mode surfaces token-structure problems quickly. If your system maps cleanly to dark, it's probably built correctly. Light mode rarely breaks what dark mode wouldn't reveal first." },
  { num: "03", title: "Accessibility is a constraint", body: "WCAG contrast ratios, 4.5:1 for text, 3:1 for UI elements, should be baked into tokens at definition time. Not audited at the end of a sprint." },
]

const HUES = [
  { name: "Red",    range: "0°–20°",    grad: "linear-gradient(160deg, #C62828, #EF5350)", note: "Urgency, passion, power. Conflicts with error semantics, use with extreme care.", active: false },
  { name: "Orange", range: "20°–50°",   grad: "linear-gradient(160deg, #E65100, #FFA726)", note: "Energy, creativity, warmth. Bold personality. Borders warning territory.", active: false },
  { name: "Green",  range: "100°–150°", grad: "linear-gradient(160deg, #2E7D32, #66BB6A)", note: "Growth, nature, money, health. Borders success semantics, keep saturation distinct.", active: false },
  { name: "Teal",   range: "170°–195°", grad: "linear-gradient(160deg, #006064, #26C6DA)", note: "Modern, calm, approachable. Strong SaaS and fintech presence. Very scalable.", active: false },
  { name: "Blue",   range: "200°–240°", grad: "linear-gradient(160deg, #1565C0, #42A5F5)", note: "Trust, reliability, clarity. The most-used primary in digital products. Scales beautifully.", active: true },
  { name: "Purple", range: "260°–300°", grad: "linear-gradient(160deg, #4527A0, #AB47BC)", note: "Creativity, premium, sophistication. Differentiating in SaaS, fewer competitors use it.", active: false },
]

const CRITERIA = [
  { i: "01", title: "Contrast on white and dark backgrounds", body: "Your primary must reach at least 4.5:1 contrast against white for text use, and work equally on dark surfaces. Colors in the 40–60% lightness range tend to fail one or both. Vivid mid-tone colors often look great but fail text contrast, test before falling in love with a color." },
  { i: "02", title: "Legibility at small scale", body: "Primary colors appear on 14px labels, 2px focus rings, and 8px active nav dots. A color that looks confident at 200px can become ambiguous at 12px. Always render the color at its smallest intended use. Cool hues generally hold up better at small sizes than warm hues." },
  { i: "03", title: "Semantic neutrality", body: "Avoid hues already claimed by semantic states. Red, orange, and yellow carry universal error/warning meaning. Green often signals success. Using them as your primary creates an unresolvable cognitive conflict. Blue, teal, and purple have no strong semantic pre-assignment." },
  { i: "04", title: "Full-scale scalability (11 stops)", body: "Your primary must generate a complete tonal scale, very light tints through very dark shades, without losing recognizable identity. Low-saturation or unusual hue angles often collapse into gray at the light end or muddy brown at the dark end. Test the extremes (stop 50 and 950) before committing." },
]

const CONTRAST = [
  { bg: "#0066CC", ratio: "7.2:1", ratioColor: "#fff",     label: "White on primary",     ctx: "CTA button label",   badge: "AAA Pass", badgeKind: "pass" },
  { bg: "#FFFFFF", ratio: "5.9:1", ratioColor: "#0066CC",  label: "Primary text on white", ctx: "Link text on page",   badge: "AA Pass",  badgeKind: "pass" },
  { bg: "#EBF3FF", ratio: "4.6:1", ratioColor: "#0066CC",  label: "Primary on tint bg",   ctx: "Label on active row", badge: "AA Pass",  badgeKind: "pass" },
]

const HARMONY = [
  { swatches: ["#0066CC", "#EBF3FF", "#003E80"], title: "Tints & shades (same hue)", desc: "Lighter tints for backgrounds and hover fills; darker shades for active and pressed states. All derived from the same hue, zero dissonance. The most practical pairing strategy for any product UI. Always build these first." },
  { swatches: ["#0066CC", "#0099CC", "#0033AA"], title: "Analogous (±30° on wheel)", desc: "Adjacent hues feel cohesive and calm. A blue primary might pair with cyan and indigo. Great for secondary accents that support without competing, multi-section dashboards where each section needs a distinct but harmonious color." },
  { swatches: ["#0066CC", "#CC6600", "#6600CC"], title: "Triadic (120° apart)", desc: "Three hues equally spaced on the wheel. Creates vibrant, high-energy contrast, ideal for data visualization where categories need clearly distinct colors. Use primary at full weight, the other two as supporting accents." },
  { swatches: ["#0066CC", "#CC2600"],            title: "Complementary (180° opposite)", desc: "Maximum contrast, the hue directly across the wheel. Use the complement very sparingly: a highlight color, a sale badge, a special alert. Never as an equal-weight second primary. One dominant, one accent-only." },
  { swatches: ["#0066CC", "#00A896", "#F4A261"], title: "Split complementary", desc: "Primary + two hues flanking the complement. Lower tension than full complementary, more variety than analogous. Excellent for extended palettes, fintech apps with multiple product lines, analytics with 3+ data categories." },
  { swatches: ["#0066CC", "#6E6E6E", "#EBEBEB"], title: "Primary + neutral (most common)", desc: "One strong accent color and a complete neutral gray family. The neutral carries 90% of the interface; the primary marks the 10% that matters most. Simple, resilient, and the right choice for most product UIs." },
]

const DERIVED = [
  { mark: "●", color: "#0066CC", title: "Primary (500), the base interactive color", desc: "Used on: primary CTA fills, active navigation indicators, selected checkbox/radio fills, focus rings, active tab underlines, highlighted metric values. This is the color users associate with “action” in your product.", code: "#0066CC · HSL(210, 100%, 40%)" },
  { mark: "●", color: "#3380FF", title: "Hover state (400), one step lighter", desc: "The primary lightens slightly on hover, a subtle shift that signals interactivity without a dramatic change. Never use a completely different hue for hover; always derive it from the same hue, one stop lighter.", code: "#3380FF · HSL(210, 100%, 57%) · hover of primary CTA" },
  { mark: "●", color: "#0052A3", title: "Active / pressed state (600), one step darker", desc: "When a button is actively clicked or a state is “on”, the color darkens one stop. This communicates commitment, something is selected and persisting. Pressed button fills, active toggle backgrounds, current nav item fills.", code: "#0052A3 · HSL(210, 100%, 32%) · active press, selected" },
  { mark: "◆", color: "#EBF3FF", title: "Tint backgrounds (50–200), the ambient presence", desc: "Very light tints used for: active row fills, selected card backgrounds, info banner fills, highlighted search results, chip/badge fills for filters. They keep the primary present in the layout without the full weight of a button fill.", code: "#EBF3FF (50) · #CCE0FF (100) · #99C0FF (200)" },
  { mark: "◆", color: "#003D7A", title: "Dark shades (700–900), text and high-contrast use", desc: "Used when the primary hue appears as text on a light background, or as a border on an accent-tinted surface. Stop 700 works as accent link color on white. 800 for text inside info banners. 900 for maximum contrast.", code: "#003D7A (700) → link text · #002952 (800) → text on tint bg" },
  { mark: "◇", color: "#8A8A8A", title: "Neutral gray family, the interface carrier", desc: "The workhorse. Slightly warm or cool the neutral to harmonize with your primary hue. A blue primary pairs with a cool gray; a warm orange primary with a warm gray. Use 5–10 stops, same naming convention as the primary scale.", code: "gray-50 → gray-950 · HSL(210, 6%, varies) for a blue system" },
]

const SCALE = [
  { step: "50",  hex: "#EBF3FF" },
  { step: "100", hex: "#CCE0FF" },
  { step: "200", hex: "#99C0FF" },
  { step: "300", hex: "#66A0FF" },
  { step: "400", hex: "#3380FF" },
  { step: "500", hex: "#0066CC", base: true },
  { step: "600", hex: "#0052A3" },
  { step: "700", hex: "#003D7A" },
  { step: "800", hex: "#002952" },
  { step: "900", hex: "#001529" },
  { step: "950", hex: "#000A14" },
]

const ZONES = [
  { chips: ["#EBF3FF", "#CCE0FF", "#99C0FF"], label: "50 · 100 · 200, Tint zone",   title: "Ambient backgrounds", desc: "Active row fills, hover surfaces, info banners, selected card fills, chip backgrounds. High lightness (92–97%), reduced saturation. Must pass 4.5:1 with your darkest text on top." },
  { chips: ["#66A0FF", "#3380FF", "#0066CC"], label: "300 · 400 · 500, Action zone", title: "Interactive fills", desc: "500 = primary CTA fill, active nav, focus ring. 400 = hover state. 300 = secondary buttons, less-critical interactive elements. All must pass 4.5:1 with white text on top." },
  { chips: ["#0052A3", "#003D7A", "#002952"], label: "600 · 700 · 800, Depth zone",  title: "Active states and text", desc: "600 = active/pressed CTA. 700 = accent link text on white. 800 = text on tinted backgrounds (50–100 fills). These shades give the primary hue presence without the full-weight button fill." },
]

const BUILD_STEPS = [
  { n: "01", title: "Lock your base color as stop 500, express it in HSL", desc: "Start with your chosen primary. This is stop 500. Convert to HSL immediately, it gives you direct control over hue, saturation, and lightness separately. The hue angle (H) stays constant across all 11 stops; only L and optionally S change. Starting in hex or RGB means guessing at relationships between stops.", code: "#0066CC → HSL(210, 100%, 40%) → Stop 500" },
  { n: "02", title: "Set the lightness anchors at both extremes", desc: "Before filling the middle, define your two poles. Stop 50 ≈ L 95–97% (almost white, still perceptibly tinted). Stop 950 ≈ L 4–7% (almost black, still carrying the hue). These anchors define the full range. Without them, the middle stops will drift.", code: "Stop 50: HSL(210, 70%, 96%), Stop 950: HSL(210, 80%, 5%)" },
  { n: "03", title: "Distribute the 9 intermediate stops on a perceptual curve", desc: "A linear lightness distribution doesn't look linear to human eyes, the mid-range appears compressed and the extremes too spread. Use an eased curve: smaller gaps between 300–600, larger gaps at the extremes. Adjust after visually checking the rendered scale.", code: "L values: 96 · 92 · 84 · 72 · 57 · 40(★) · 32 · 24 · 16 · 10 · 5" },
  { n: "04", title: "Tune saturation at the extremes to avoid muddiness", desc: "At very high lightness (50–200), full saturation looks washed out or aggressively vivid, pull it to 60–80%. At very low lightness (800–950), full saturation looks artificial, reduce to 70–85%. The middle (300–700) stays near full saturation to keep identity. Render and adjust by eye.", code: "50–200: S ≈ 60–80% · 300–700: S ≈ 90–100% · 800–950: S ≈ 70–85%" },
  { n: "05", title: "Verify contrast at each stop, in both light and dark mode", desc: "Every stop needs to work in context. Run each through a contrast checker against white, your dark background, and your primary text color. Targets: 50–200 ≥ 4.5:1 with darkest text; 400–600 ≥ 4.5:1 with white; 700–800 ≥ 4.5:1 with white for text. Adjust failing stops by shifting L a few points.", code: "Check each stop against: white · #111 (dark text) · your ink bg" },
  { n: "06", title: "Name with a prefix and number, never the visual value", desc: "Name with a consistent prefix and the stop number: blue-50, blue-100 … blue-950. Never name by visual description (light-blue, sky, navy), those become wrong the moment you adjust the shade. The number is semantic-neutral and survives any future palette revision.", code: "blue-50 → blue-950 · NOT: sky, powder, cobalt, midnight" },
  { n: "07", title: "Map scale stops to semantic tokens, never reference raw stops in components", desc: "Once the scale exists, create a semantic token layer on top of it. Components should only ever consume semantic tokens, not raw scale stops. This lets you swap the entire scale (or individual stops) later without touching any component. Semantic tokens describe function, not value.", code: "blue-500 → --accent-primary · blue-400 → --accent-hover · blue-100 → --accent-surface" },
]

const SCALES_LIST = [
  { mark: "●", color: "#0066CC", title: "Primary scale (required)", desc: "Your brand hue, 11 stops. The one described above. Every interactive state, accent fill, and focus ring derives from this scale." },
  { mark: "●", color: "#888888", title: "Neutral / gray scale (required)", desc: "11 stops from near-white to near-black. Slightly warm or cool to harmonize with your primary. Used for everything that isn't accented: backgrounds, text, borders, dividers, subtle surfaces. Design it with as much care as the primary, it's used far more.", code: "gray-50 (#FAFAFA) · gray-500 (#6E6E6E) · gray-950 (#0A0A0A)" },
  { mark: "●", color: "#E53935", title: "Error / danger scale (required)", desc: "A red hue, 11 stops. Used exclusively for error states, destructive action fills, validation failures. Because red is semantically loaded, this scale should never bleed into decorative use. Keep it disciplined." },
  { mark: "●", color: "#4CAF50", title: "Success scale (required)", desc: "A green hue, 11 stops. Confirmation states, completion indicators, positive metric highlights. If green is your primary, shift success to a teal or emerald hue to maintain semantic separation." },
  { mark: "●", color: "#FFB300", title: "Warning scale (required)", desc: "An amber/yellow hue, 11 stops. Non-blocking cautions, rate-limit notices, “review before continuing” states. Yellow is notoriously hard to get contrast right at mid-stops, test stop 500 especially carefully against white." },
  { mark: "○", color: "#8A8A8A", title: "Secondary accent scale (optional)", desc: "Only build this if your product has a clear second interaction color, a secondary CTA, a separate product line, or data viz needing a second category. Use an analogous or split-complementary hue. Don't add it just to avoid looking plain." },
]

const BADGE: Record<string, string> = {
  pass: "bg-emerald-500/15 text-emerald-600 dark:text-emerald-300",
  fail: "bg-red-500/15 text-red-500 dark:text-red-300",
  warn: "bg-amber-500/15 text-amber-600 dark:text-amber-300",
}

// ─── HERO ─────────────────────────────────────────────────────────────────, 

function Hero() {
  const a = articleItems.find(x => x.href === HREF)!
  return <ArticleHeader article={a} />
}

// ─── PAGE ─────────────────────────────────────────────────────────────────, 

export default function Page() {
  return (
    <div>
      <ReadingProgress />
      <Hero />

      {/* 01 FOUNDATIONS */}
      <Section id="foundations">
        <FadeIn><Eyebrow num="01" tag="Foundations" /></FadeIn>
        <FadeIn><Title>Foundation colors</Title></FadeIn>
        <FadeIn><Lede>Foundation colors define the atmosphere of the entire product. These are the most frequently used colors in the interface, they form the visual base layer for every component.</Lede></FadeIn>

        <FadeIn className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          {FOUNDATIONS.map(s => (
            <div key={s.name} className="rounded-xl border border-border/60 overflow-hidden bg-card hover:border-border transition-colors">
              <div className="h-24 flex items-end p-3" style={{ background: s.bg }}>
                <span className="font-mono text-[10px] text-black/40">{s.hex}</span>
              </div>
              <div className="p-4 border-t border-border/60">
                <p className="font-mono text-[11px] uppercase tracking-[0.06em] text-foreground mb-1.5">{s.name}</p>
                <p className="text-[12px] leading-[1.6] text-muted-foreground">{s.desc}</p>
              </div>
            </div>
          ))}
        </FadeIn>

        <FadeIn delay={0.1} className="grid grid-cols-1 sm:grid-cols-2 gap-3 mt-3">
          {FOUNDATIONS_2.map(s => (
            <div key={s.name} className="rounded-xl border border-border/60 overflow-hidden bg-card hover:border-border transition-colors">
              <div
                className="h-24 flex items-end p-3"
                style={{ background: s.bg, boxShadow: s.shadow ? "inset 0 6px 24px rgba(0,0,0,0.12)" : undefined }}
              >
                <span className="font-mono text-[10px]" style={{ color: s.shadow ? "rgba(0,0,0,0.4)" : "rgba(255,255,255,0.5)" }}>{s.hex}</span>
              </div>
              <div className="p-4 border-t border-border/60">
                <p className="font-mono text-[11px] uppercase tracking-[0.06em] text-foreground mb-1.5">{s.name}</p>
                <p className="text-[12px] leading-[1.6] text-muted-foreground">{s.desc}</p>
              </div>
            </div>
          ))}
        </FadeIn>
      </Section>

      {/* 02 SURFACES */}
      <Section id="surfaces" muted>
        <FadeIn><Eyebrow num="02" tag="Surfaces" /></FadeIn>
        <FadeIn><Title>Surface system</Title></FadeIn>
        <FadeIn><Lede>Surface colors define how components feel physically layered inside the interface. Each component type has a surface that matches its perceived depth.</Lede></FadeIn>

        <FadeIn className="rounded-xl border border-border/60 overflow-hidden bg-card">
          <table className="w-full border-collapse text-left">
            <thead>
              <tr className="bg-foreground/[0.03]">
                {["Surface", "Role", "Usage", "Key property"].map(h => (
                  <th key={h} className="font-mono text-[10px] uppercase tracking-[0.1em] text-muted-foreground font-normal px-4 py-3 border-b border-border/60">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {SURFACES.map(r => (
                <tr key={r.name} className="border-b border-border/60 last:border-0 hover:bg-foreground/[0.02] transition-colors">
                  <td className="px-4 py-3 align-middle">
                    <span className="inline-block w-8 h-5 rounded align-middle mr-2.5" style={r.chip} />
                    <span className="font-mono text-[12px] text-foreground align-middle">{r.name}</span>
                  </td>
                  <td className="px-4 py-3 text-[12px] text-muted-foreground">{r.role}</td>
                  <td className="px-4 py-3 text-[12px] text-foreground/70">{r.usage}</td>
                  <td className="px-4 py-3 text-[12px]" style={{ color: r.propColor }}>{r.prop}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </FadeIn>

        <Note label="Depth rule">Each layer should be visually distinguishable from the one beneath, but only just enough. Over-contrasting surfaces creates noise; under-contrasting makes the layout feel flat. Aim for perceivable, not dramatic.</Note>
      </Section>

      {/* 03 TYPOGRAPHY */}
      <Section id="typography">
        <FadeIn><Eyebrow num="03" tag="Typography" /></FadeIn>
        <FadeIn><Title>Typography colors</Title></FadeIn>
        <FadeIn><Lede>Typography color creates information hierarchy. A strong type system lets users instantly distinguish primary content from secondary or supporting information, without reading a word.</Lede></FadeIn>

        {/* Fixed light "specimen" surface in both themes, these are text-on-paper colors */}
        <FadeIn className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-px rounded-xl border border-border/60 overflow-hidden bg-[#e7e5df]">
          {TYPE_SCALE.map(t => (
            <div key={t.label} className="p-5" style={{ background: "#faf9f7" }}>
              <span className="block text-5xl font-semibold leading-none mb-5" style={{ color: t.glyph }}>Ag</span>
              <p className="font-mono text-[10px] uppercase tracking-[0.12em] mb-1.5" style={{ color: "#8a8a82" }}>{t.label}</p>
              <p className="text-[11px] leading-[1.5]" style={{ color: "#6b6b63" }}>{t.note}</p>
            </div>
          ))}
        </FadeIn>

        <Note label="Common mistake">Reducing disabled text opacity too aggressively. Disabled states must appear inactive while remaining accessible, don&apos;t make users wonder if the element exists.</Note>
      </Section>

      {/* 04 BORDERS */}
      <Section id="borders" muted>
        <FadeIn><Eyebrow num="04" tag="Borders" /></FadeIn>
        <FadeIn><Title>Borders &amp; dividers</Title></FadeIn>
        <FadeIn><Lede>Borders do structural work, not decorative work. Modern UI systems use them far more subtly than older systems, only where separation genuinely aids comprehension.</Lede></FadeIn>

        <FadeIn className="grid grid-cols-2 md:grid-cols-4 gap-3">
          {BORDERS.map(b => (
            <div key={b.label} className="rounded-xl border border-border/60 overflow-hidden bg-card">
              <div className="p-5 pb-4">
                <div className="h-[52px] rounded-md bg-foreground/[0.04]" style={{ border: b.style }} />
              </div>
              <div className="p-4 pt-0">
                <p className="font-mono text-[10px] uppercase tracking-[0.1em] text-foreground mb-1.5">{b.label}</p>
                <p className="text-[12px] text-muted-foreground leading-[1.6]">{b.desc}</p>
              </div>
            </div>
          ))}
        </FadeIn>
      </Section>

      {/* 05 ACCENT */}
      <Section id="accent">
        <FadeIn><Eyebrow num="05" tag="Brand & Accent" /></FadeIn>
        <FadeIn><Title>Brand &amp; accent system</Title></FadeIn>
        <FadeIn><Lede>Accent colors define product personality. They&apos;re the colors users associate with your brand, appearing on primary CTAs, active navigation, and interactive focus states.</Lede></FadeIn>

        <FadeIn className="grid grid-cols-2 md:grid-cols-4 rounded-xl border border-border/60 overflow-hidden">
          {ACCENTS.map((a, i) => (
            <div
              key={a.name}
              className={`p-6 pt-7 transition-[filter] hover:brightness-110 ${i < ACCENTS.length - 1 ? "border-r border-white/5" : ""}`}
              style={{ background: a.bg }}
            >
              <div className="w-9 h-9 rounded-full mb-5 border border-white/15" style={{ background: a.dot }} />
              <p className="font-mono text-[11px] uppercase tracking-[0.06em] text-white/90 mb-1.5">{a.name}</p>
              <p className="text-[12px] leading-[1.6] text-white/55">{a.desc}</p>
            </div>
          ))}
        </FadeIn>

        <Note label="Restraint is the point">Accent colors lose meaning when overused. If everything is accented, nothing is. Reserve primary accent for the most important interactive moments, let neutral surfaces carry the rest.</Note>
      </Section>

      {/* 06 SEMANTIC */}
      <Section id="semantic" muted>
        <FadeIn><Eyebrow num="06" tag="Semantic States" /></FadeIn>
        <FadeIn><Title>Semantic states</Title></FadeIn>
        <FadeIn><Lede>Semantic colors carry universal meaning across the interface. They communicate system feedback, success, caution, failure, information, independently of brand color.</Lede></FadeIn>

        <FadeIn className="grid grid-cols-2 md:grid-cols-4 gap-3">
          {SEMANTIC.map(s => (
            <div key={s.title} className="rounded-xl overflow-hidden border border-border/60">
              <div className="p-5 flex items-center gap-2.5" style={{ background: s.bg }}>
                <span className="w-2.5 h-2.5 rounded-full flex-shrink-0" style={{ background: s.dot }} />
                <span className="font-mono text-[12px] font-medium" style={{ color: s.titleColor }}>{s.title}</span>
              </div>
              <div className="p-4 bg-card border-t border-border/60">
                <p className="text-[12px] text-muted-foreground leading-[1.6]">{s.desc}</p>
              </div>
            </div>
          ))}
        </FadeIn>

        <Note label="Never color-only">Always pair semantic color with an icon, label, or text. For users with color-vision deficiency, red and green are often indistinguishable without a secondary visual signal.</Note>
      </Section>

      {/* 07 PRINCIPLES */}
      <Section id="principles">
        <FadeIn><Eyebrow num="07" tag="Principles" /></FadeIn>
        <FadeIn><Title>Putting it together</Title></FadeIn>
        <FadeIn><Lede>A color system isn&apos;t a palette, it&apos;s a set of rules for when and why each color appears. The goal is a product where color communicates function so clearly that users never have to wonder.</Lede></FadeIn>

        <FadeIn className="grid grid-cols-1 md:grid-cols-3 gap-3">
          {PRINCIPLES.map(p => (
            <div key={p.num} className="rounded-xl border border-border/60 p-6 bg-card hover:border-border transition-colors">
              <span className="font-mono text-[11px] text-rose-600 dark:text-rose-400 tracking-[0.1em] block mb-5">{p.num}, </span>
              <p className="text-[19px] font-semibold tracking-tight mb-2.5 leading-tight text-foreground">{p.title}</p>
              <p className="text-[13px] text-muted-foreground leading-[1.7]">{p.body}</p>
            </div>
          ))}
        </FadeIn>
      </Section>

      {/* 08 PICKING PRIMARY */}
      <Section id="primary-selection" muted>
        <FadeIn><Eyebrow num="08" tag="Picking Your Primary" /></FadeIn>
        <FadeIn><Title>How to select your <span className="text-rose-600 dark:text-rose-400">primary color</span></Title></FadeIn>
        <FadeIn><Lede>Your primary is the most consequential decision in the system, every hover, CTA, and focus ring stems from it. Here&apos;s the framework for choosing it well.</Lede></FadeIn>

        <FadeIn><SubEyebrow>Step 1, Choose a hue family</SubEyebrow></FadeIn>
        <FadeIn className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-2">
          {HUES.map(h => (
            <div
              key={h.name}
              className={`rounded-lg overflow-hidden border ${h.active ? "border-rose-500" : "border-border/60"} bg-card transition-transform hover:-translate-y-0.5`}
            >
              <div className="h-14" style={{ background: h.grad }} />
              <div className="p-2.5">
                <span className="block font-mono text-[10px] uppercase tracking-[0.08em] text-foreground mb-1">{h.name}</span>
                <span className="font-mono text-[9px] text-muted-foreground leading-snug block">{h.range} · {h.note}</span>
              </div>
            </div>
          ))}
        </FadeIn>

        <Note label="Hue carries brand meaning before a word is read">Blue signals trust (fintech, SaaS); green maps to growth and money; purple reads premium; teal is calm and modern. Red and orange feel urgent but clash with error/warning semantics. The hue is a brand statement on its own.</Note>

        <FadeIn><SubEyebrow>Step 2, Test against four criteria before committing</SubEyebrow></FadeIn>
        <FadeIn className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {CRITERIA.map(c => (
            <div key={c.i} className="rounded-xl border border-border/60 p-5 bg-card flex gap-4 items-start">
              <span className="font-mono text-[22px] text-rose-600/60 dark:text-rose-400/60 leading-none min-w-[32px]">{c.i}</span>
              <div>
                <p className="text-[14px] text-foreground mb-1.5">{c.title}</p>
                <p className="text-[12px] text-muted-foreground leading-[1.65]">{c.body}</p>
              </div>
            </div>
          ))}
        </FadeIn>

        <FadeIn><SubEyebrow>Step 3, Validate contrast ratios for every use context</SubEyebrow></FadeIn>
        <FadeIn>
          <p className="text-[13px] text-muted-foreground leading-[1.75] max-w-xl mb-6">The primary appears as a fill behind white text, as text on white, and as text on its own tint, each with different contrast requirements. All must pass before you commit.</p>
        </FadeIn>
        <FadeIn className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
          {CONTRAST.map(c => (
            <div key={c.label} className="rounded-xl overflow-hidden border border-border/60">
              <div className="h-20 flex flex-col items-center justify-center gap-1 px-4" style={{ background: c.bg }}>
                <span className="font-mono text-[20px] font-medium leading-none" style={{ color: c.ratioColor }}>{c.ratio}</span>
                <span className="font-mono text-[10px] tracking-[0.1em]" style={{ color: c.ratioColor, opacity: 0.7 }}>{c.label}</span>
              </div>
              <div className="px-3.5 py-2.5 bg-card border-t border-border/60 flex justify-between items-center">
                <span className="font-mono text-[10px] uppercase tracking-[0.06em] text-foreground/70">{c.ctx}</span>
                <span className={`font-mono text-[10px] px-2 py-0.5 rounded ${BADGE[c.badgeKind]}`}>{c.badge}</span>
              </div>
            </div>
          ))}
        </FadeIn>

        <Note label="The ratio targets">WCAG AA: 4.5:1 for normal text, 3:1 for large text (18px+ / 14px+ bold) and UI boundaries. AAA: 7:1. Target AA everywhere, AAA on critical elements.</Note>

        <FadeIn><SubEyebrow>Step 4, Define the colors that live around the primary</SubEyebrow></FadeIn>
        <FadeIn>
          <p className="text-[13px] text-muted-foreground leading-[1.75] max-w-xl mb-6">No primary lives alone, it needs hover/active variants, complementary accents, and a neutral palette to carry the interface. Six proven harmony strategies:</p>
        </FadeIn>
        <FadeIn className="grid grid-cols-1 md:grid-cols-3 gap-3">
          {HARMONY.map(h => (
            <div key={h.title} className="rounded-xl border border-border/60 overflow-hidden bg-card">
              <div className="flex h-16">
                {h.swatches.map((s, i) => <div key={i} className="flex-1" style={{ background: s }} />)}
              </div>
              <div className="p-4 border-t border-border/60">
                <p className="font-mono text-[11px] uppercase tracking-[0.08em] text-foreground mb-1.5">{h.title}</p>
                <p className="text-[12px] text-muted-foreground leading-[1.6]">{h.desc}</p>
              </div>
            </div>
          ))}
        </FadeIn>

        <FadeIn><SubEyebrow>The complete set of colors derived from one primary</SubEyebrow></FadeIn>
        <FadeIn className="rounded-xl border border-border/60 overflow-hidden bg-card">
          {DERIVED.map((d, i) => (
            <div key={i} className="flex items-start gap-5 p-5 border-b border-border/60 last:border-0 hover:bg-foreground/[0.02] transition-colors">
              <span className="text-[16px] leading-none mt-0.5" style={{ color: d.color }}>{d.mark}</span>
              <div>
                <p className="text-[14px] text-foreground mb-1">{d.title}</p>
                <p className="text-[12px] text-muted-foreground leading-[1.65]">{d.desc}</p>
                <Code>{d.code}</Code>
              </div>
            </div>
          ))}
        </FadeIn>

        <Note label="One primary is usually enough">Most interfaces need just one primary, one neutral scale, and semantic colors. Add a secondary accent only for a clear functional need, never to make the palette &ldquo;more interesting.&rdquo; Restraint is a marker of maturity.</Note>
      </Section>

      {/* ─── UNIFIED TOOL REGION, one shared primary drives sections 09–23 ─── */}
      <ColorSystemProvider>

      {/* 09 SWATCH SCALE */}
      <Section id="swatch-scale">
        <FadeIn><Eyebrow num="09" tag="Swatch Scale" /></FadeIn>
        <FadeIn><Title>Building the complete <span className="text-rose-600 dark:text-rose-400">color swatch</span></Title></FadeIn>
        <FadeIn><Lede>A complete swatch is a tonal scale of 11 stops, from near-white to near-black, all derived from a single hue. It is the raw-material layer of the system. Every semantic token eventually maps back to a stop in one of these scales.</Lede></FadeIn>

        <FadeIn className="grid grid-cols-1 md:grid-cols-2 gap-3">
          <div className="rounded-xl border border-border/60 p-5 bg-card flex gap-4 items-start">
            <span className="font-mono text-[16px] text-rose-600 dark:text-rose-400 leading-none min-w-[32px]">11</span>
            <div>
              <p className="text-[14px] text-foreground mb-1.5">Why 11 stops (50 through 950)?</p>
              <p className="text-[12px] text-muted-foreground leading-[1.65]">Enough resolution for every context, pale backgrounds, mid-weight fills, dark text, from one hue. Fewer leaves gaps; more creates ambiguity.</p>
            </div>
          </div>
          <div className="rounded-xl border border-border/60 p-5 bg-card flex gap-4 items-start">
            <span className="font-mono text-[16px] text-rose-600 dark:text-rose-400 leading-none min-w-[32px]">500</span>
            <div>
              <p className="text-[14px] text-foreground mb-1.5">Why 500 is the anchor, not 0</p>
              <p className="text-[12px] text-muted-foreground leading-[1.65]">The primary sits mid-scale, leaving five lighter tints above and five darker shades below, symmetrical room for hover and active variants in both directions.</p>
            </div>
          </div>
        </FadeIn>

        {/* full scale */}
        <FadeIn className="mt-8">
          <div className="flex justify-between items-center mb-3">
            <span className="font-mono text-[10px] uppercase tracking-[0.1em] text-muted-foreground">Complete scale, Blue · base #0066CC · HSL(210°)</span>
            <span className="font-mono text-[10px] text-muted-foreground">★ = base stop</span>
          </div>
          <div className="grid grid-cols-6 md:grid-cols-11 rounded-xl overflow-hidden border border-border/60">
            {SCALE.map(s => (
              <div key={s.step} className="flex flex-col" style={s.base ? { outline: "2px solid #f43f5e", outlineOffset: "-2px", zIndex: 1 } : undefined}>
                <div className="h-20" style={{ background: s.hex }} />
                <div className="p-2 bg-card border-t border-border/60">
                  <span className={`block font-mono text-[9px] mb-0.5 tracking-[0.04em] ${s.base ? "text-rose-600 dark:text-rose-400" : "text-rose-600/80 dark:text-rose-400/80"}`}>{s.step}{s.base ? " ★" : ""}</span>
                  <span className="font-mono text-[8px] text-muted-foreground">{s.hex}</span>
                </div>
              </div>
            ))}
          </div>
          <p className="text-[12px] text-muted-foreground text-center font-mono tracking-[0.04em] mt-3">All 11 stops share hue angle 210°, only lightness and saturation change across the scale</p>
        </FadeIn>

        {/* interactive generator, one picker drives every tool + demo below */}
        <FadeIn><SubEyebrow>Try it, one primary drives every tool below</SubEyebrow></FadeIn>
        <FadeIn>
          <p className="text-[13px] text-muted-foreground leading-[1.75] max-w-xl mb-6">Pick a primary once, it flows through every tool below. Toggle contrast badges for per-stop WCAG ratings, turn on Full system to derive the neutral and semantic scales, then export to CSS, Tailwind, SCSS, JSON, or OKLCH.</p>
        </FadeIn>
        <FadeIn>
          <ToolFrame label="Interactive · drives every tool below">
            <PrimaryControls />
            <div className="mt-3"><ColorScaleTool /></div>
          </ToolFrame>
        </FadeIn>

        {/* zones */}
        <FadeIn className="grid grid-cols-1 md:grid-cols-3 gap-2.5 mt-8">
          {ZONES.map(z => (
            <div key={z.label} className="rounded-xl border border-border/60 p-5 bg-card">
              <div className="flex gap-1 mb-3">
                {z.chips.map((c, i) => <div key={i} className="h-6 flex-1 rounded" style={{ background: c }} />)}
              </div>
              <p className="font-mono text-[10px] uppercase tracking-[0.1em] text-rose-600 dark:text-rose-400 mb-1.5">{z.label}</p>
              <p className="text-[13px] text-foreground mb-1.5">{z.title}</p>
              <p className="text-[12px] text-muted-foreground leading-[1.6]">{z.desc}</p>
            </div>
          ))}
        </FadeIn>

        {/* build process */}
        <FadeIn><SubEyebrow>Step-by-step, how to generate the scale from scratch</SubEyebrow></FadeIn>
        <FadeIn className="rounded-xl border border-border/60 overflow-hidden bg-card">
          {BUILD_STEPS.map(s => (
            <div key={s.n} className="flex items-start gap-5 p-5 border-b border-border/60 last:border-0 hover:bg-foreground/[0.02] transition-colors">
              <span className="font-mono text-[11px] text-rose-600 dark:text-rose-400 min-w-[28px] pt-0.5 tracking-[0.1em]">{s.n}</span>
              <div>
                <p className="text-[14px] text-foreground mb-1">{s.title}</p>
                <p className="text-[12px] text-muted-foreground leading-[1.65]">{s.desc}</p>
                <Code>{s.code}</Code>
              </div>
            </div>
          ))}
        </FadeIn>

        <Note label="The hue-shift trick">A perfectly constant hue makes light tints look cold and dark shades muddy. Shift 5–10° warmer in the light stops and ~5° cooler in the dark ones, mimicking light and shadow. Tailwind does this across its whole palette.</Note>

        {/* multi-scale */}
        <FadeIn><SubEyebrow>A complete system has multiple scales, here are the essential ones</SubEyebrow></FadeIn>
        <FadeIn className="rounded-xl border border-border/60 overflow-hidden bg-card">
          {SCALES_LIST.map((s, i) => (
            <div key={i} className="flex items-start gap-5 p-5 border-b border-border/60 last:border-0 hover:bg-foreground/[0.02] transition-colors">
              <span className="text-[16px] leading-none mt-0.5" style={{ color: s.color }}>{s.mark}</span>
              <div>
                <p className="text-[14px] text-foreground mb-1">{s.title}</p>
                <p className="text-[12px] text-muted-foreground leading-[1.65]">{s.desc}</p>
                {s.code && <Code>{s.code}</Code>}
              </div>
            </div>
          ))}
        </FadeIn>

        <Note label="One hue, not one color">The common mistake is defining a primary as one hex and stopping. Your primary is a full 11-stop family, the hex is just the anchor; the scale is what makes it work across every component, state, and mode.</Note>
      </Section>

      {/* 10 DARK MODE */}
      <Section id="dark-mode" muted>
        <FadeIn><Eyebrow num="10" tag="Dark Mode" /></FadeIn>
        <FadeIn><Title>Dark mode is a <span className="text-rose-600 dark:text-rose-400">remap</span>, not an invert</Title></FadeIn>
        <FadeIn><Lede>The mistake is inverting colors. The fix is re-mapping role tokens to different scale stops: your darkest gray becomes the background, your lightest becomes the text. Same tokens, different resolution per mode.</Lede></FadeIn>
        <FadeIn><ToolFrame><DarkModeRemap /></ToolFrame></FadeIn>
        <Note label="Lighten accents in the dark">A mid accent that passes contrast on white often fails on a dark surface. In dark mode, accents usually step one or two stops lighter (blue-600 → blue-400) so they keep their 4.5:1 against the new background.</Note>
      </Section>

      {/* 11 MOTION */}
      <Section id="motion">
        <FadeIn><Eyebrow num="11" tag="Motion" /></FadeIn>
        <FadeIn><Title>Color in motion</Title></FadeIn>
        <FadeIn><Lede>Color isn&apos;t static, it changes on hover, focus, and state. Those transitions need duration and easing, or the interface feels either jarring or sluggish.</Lede></FadeIn>
        <FadeIn><ToolFrame><ColorInMotion /></ToolFrame></FadeIn>
      </Section>

      {/* 12 DATA VIZ */}
      <Section id="data-viz" muted>
        <FadeIn><Eyebrow num="12" tag="Data Visualization" /></FadeIn>
        <FadeIn><Title>Color on data visualization</Title></FadeIn>
        <FadeIn><Lede>Charts play by different rules. Sequential, diverging, and categorical data each need a different palette structure, and your brand primary usually can&apos;t just be reused as a data color.</Lede></FadeIn>
        <FadeIn><ToolFrame><DataVizPalettes /></ToolFrame></FadeIn>
      </Section>

      {/* 13 PERCEPTUAL */}
      <Section id="perceptual">
        <FadeIn><Eyebrow num="13" tag="Perceptual Uniformity" /></FadeIn>
        <FadeIn><Title>Why HSL lies, and <span className="text-rose-600 dark:text-rose-400">OKLCH</span> doesn&apos;t</Title></FadeIn>
        <FadeIn><Lede>Two HSL colors at the same lightness can look dramatically different in brightness. HSL lightness is a math construct; perceptual spaces like OKLCH and LCH model human vision, which is why they produce better-looking, more even scales.</Lede></FadeIn>
        <FadeIn><ToolFrame><PerceptualUniformity /></ToolFrame></FadeIn>
      </Section>

      {/* 14 COLOR BLINDNESS */}
      <Section id="color-blindness" muted>
        <FadeIn><Eyebrow num="14" tag="Color Vision" /></FadeIn>
        <FadeIn><Title>Color-blindness simulation</Title></FadeIn>
        <FadeIn><Lede>“Use icons too” is the start, not the answer. The deeper question is which hue combinations stay distinct under deuteranopia, protanopia, and tritanopia, and which collapse into the same color.</Lede></FadeIn>
        <FadeIn><ToolFrame><ColorblindSim /></ToolFrame></FadeIn>
      </Section>

      {/* 15 TEMPERATURE */}
      <Section id="temperature">
        <FadeIn><Eyebrow num="15" tag="Temperature & Mood" /></FadeIn>
        <FadeIn><Title>Color temperature &amp; mood</Title></FadeIn>
        <FadeIn><Lede>Warm vs. cool neutrals change the entire feeling of an interface. A 5–10° hue shift in the gray family is invisible up close and unmistakable across a full screen.</Lede></FadeIn>
        <FadeIn><ToolFrame><NeutralTemperature /></ToolFrame></FadeIn>
      </Section>

      {/* 16 TAXONOMY */}
      <Section id="taxonomy" muted>
        <FadeIn><Eyebrow num="16" tag="Token Architecture" /></FadeIn>
        <FadeIn><Title>Token naming: <span className="text-rose-600 dark:text-rose-400">global → alias → component</span></Title></FadeIn>
        <FadeIn><Lede>A full taxonomy has three tiers. Global tokens are the raw scale; alias tokens assign a semantic role; component tokens override for one component. Most teams stop at alias and never explain when the third tier is warranted.</Lede></FadeIn>
        <FadeIn><ToolFrame><TokenTaxonomy /></ToolFrame></FadeIn>
      </Section>

      {/* 17 BREAK */}
      <Section id="break-system">
        <FadeIn><Eyebrow num="17" tag="Exceptions" /></FadeIn>
        <FadeIn><Title>When to break the system</Title></FadeIn>
        <FadeIn><Lede>Marketing pages, empty states, onboarding, and loading screens legitimately need colors outside the system. Having an explicit policy for these is what prevents every screen from becoming an exception.</Lede></FadeIn>
        <FadeIn><ToolFrame><BreakTheSystem /></ToolFrame></FadeIn>
      </Section>

      {/* 18 VERSIONING */}
      <Section id="versioning" muted>
        <FadeIn><Eyebrow num="18" tag="Migration" /></FadeIn>
        <FadeIn><Title>Color versioning</Title></FadeIn>
        <FadeIn><Lede>How do you move the primary from blue to indigo without breaking 200 components? You don&apos;t touch the components at all, you re-point one alias token, and the change propagates everywhere.</Lede></FadeIn>
        <FadeIn><ToolFrame><ColorVersioning /></ToolFrame></FadeIn>
      </Section>

      {/* 19 AUDIT */}
      <Section id="audit">
        <FadeIn><Eyebrow num="19" tag="QA" /></FadeIn>
        <FadeIn><Title>Auditing color usage</Title></FadeIn>
        <FadeIn><Lede>Extract every hex value a product actually ships and map it back to tokens. The gap between what the system says and what the code does is where drift lives, paste real values below to see it.</Lede></FadeIn>
        <FadeIn><ToolFrame><ColorAudit /></ToolFrame></FadeIn>
      </Section>

      {/* 20 FIGMA */}
      <Section id="figma" muted>
        <FadeIn><Eyebrow num="20" tag="Tooling" /></FadeIn>
        <FadeIn><Title>Figma variable setup</Title></FadeIn>
        <FadeIn><Lede>How collections, modes, and scoping map to the token architecture: one collection for the raw scale, a separate collection for semantic tokens with light/dark modes, and scoping so each variable can only be used where it belongs.</Lede></FadeIn>
        <FadeIn><ToolFrame><FigmaVariables /></ToolFrame></FadeIn>
      </Section>

      {/* 21 TOOLS */}
      <Section id="tools">
        <FadeIn><Eyebrow num="21" tag="Tooling" /></FadeIn>
        <FadeIn><Title>Recommended tools</Title></FadeIn>
        <FadeIn><Lede>No single tool does everything well. Here&apos;s what each is actually good for, and where it falls short, filtered by what you&apos;re trying to do.</Lede></FadeIn>
        <FadeIn><ToolFrame><RecommendedTools /></ToolFrame></FadeIn>
      </Section>

      {/* 22 BUY-IN */}
      <Section id="buy-in" muted>
        <FadeIn><Eyebrow num="22" tag="The Human Side" /></FadeIn>
        <FadeIn><Title>Getting buy-in</Title></FadeIn>
        <FadeIn><Lede>Color decisions get overridden by taste (“can we make it more vibrant?”). The way through is to frame every decision as a user outcome, not a preference, tap each objection to see the reframe.</Lede></FadeIn>
        <FadeIn><ToolFrame><GettingBuyIn /></ToolFrame></FadeIn>
      </Section>

      {/* 23 ONE-OFF */}
      <Section id="one-off">
        <FadeIn><Eyebrow num="23" tag="The Human Side" /></FadeIn>
        <FadeIn><Title>The &ldquo;one-off&rdquo; problem</Title></FadeIn>
        <FadeIn><Lede>Designers keep adding custom colors per component, “just this once.” A system with enough range removes the temptation. Watch ad-hoc colors fragment into near-duplicates while one well-ranged scale covers it all.</Lede></FadeIn>
        <FadeIn><ToolFrame><OneOffProblem /></ToolFrame></FadeIn>
      </Section>

      </ColorSystemProvider>

      <RelatedArticles currentHref={HREF} />
    </div>
  )
}
