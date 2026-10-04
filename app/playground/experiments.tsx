"use client"

import dynamic from "next/dynamic"
import { useId, type ComponentType, type ReactNode } from "react"

/**
 * The Lab's contents: working pieces of code, not screenshots.
 *
 * Each experiment has a cheap SVG poster for its wall tile (dozens of live
 * canvases on one draggable wall would be unusable) and a lazily-loaded live
 * component that only mounts once its tile is opened.
 */

export interface Experiment {
  id: string
  title: string
  kind: string
  /** Why it exists — one or two sentences, first person. */
  note: string
  /** Where it earns its keep on the site, if anywhere. */
  usedIn?: { label: string; href: string }
  poster: ReactNode
  Live: ComponentType
}

const loading = () => (
  <div className="grid h-full min-h-[320px] place-items-center text-sm text-muted-foreground">
    Loading experiment…
  </div>
)

const BrandSkins = dynamic(
  () =>
    import("@/components/case-study/cs-brand-skin-compare").then((m) => {
      const skins = [
        { id: "north", bank: "North Bank", primary: "#E11D48", deep: "#9F1239", radius: "12px", fontLabel: "Onest", fontStack: "var(--ff-sans), ui-sans-serif, system-ui, sans-serif" },
        { id: "heritage", bank: "Heritage Trust", primary: "#8A6420", deep: "#6E4E12", radius: "4px", fontLabel: "Serif", fontStack: "\"Iowan Old Style\", Georgia, \"Times New Roman\", serif" },
        { id: "verde", bank: "Verde Bank", primary: "#25785C", deep: "#1C5A45", radius: "18px", fontLabel: "System sans", fontStack: "ui-sans-serif, system-ui, -apple-system, sans-serif" },
      ]
      return function BrandSkinsLive() {
        return <m.CsBrandSkinCompare base={skins[0]} alternates={skins.slice(1)} />
      }
    }),
  { ssr: false, loading }
)

const ThemeSplit = dynamic(
  () =>
    import("@/components/shared/before-after/theme-compare-demo").then((m) => {
      return function ThemeSplitLive() {
        return <m.ThemeCompareDemo className="mx-auto max-w-xl" />
      }
    }),
  { ssr: false, loading }
)

const Marquee = dynamic(
  () =>
    import("@/components/shared/curved-marquee/curved-marquee").then((m) => {
      return function MarqueeLive() {
        return <m.CurvedMarquee editable />
      }
    }),
  { ssr: false, loading }
)

const Flow = dynamic(
  () =>
    import("@/app/showcase/flow-diagram-demo").then((m) => {
      return function FlowLive() {
        return <m.FlowDiagramDemo bleed={false} />
      }
    }),
  { ssr: false, loading }
)

const InfoArch = dynamic(
  () =>
    import("@/app/showcase/info-architecture-demo").then((m) => {
      return function InfoArchLive() {
        return <m.InfoArchitectureDemo bleed={false} />
      }
    }),
  { ssr: false, loading }
)

const ColorScale = dynamic(
  async () => {
    const [ctx, controls, tool] = await Promise.all([
      import("@/components/shared/color-system/context"),
      import("@/components/shared/color-system/primary-controls"),
      import("@/components/shared/color-scale-tool"),
    ])
    return function ColorScaleLive() {
      return (
        <ctx.ColorSystemProvider>
          <div className="flex flex-col gap-4">
            <controls.PrimaryControls />
            <tool.ColorScaleTool />
          </div>
        </ctx.ColorSystemProvider>
      )
    }
  },
  { ssr: false, loading }
)

const Attention = dynamic(
  () => import("@/components/shared/matching-lab").then((m) => m.ConcentrationDemo),
  { ssr: false, loading }
)

const Frontier = dynamic(
  () => import("@/components/shared/matching-lab").then((m) => m.TradeoffFrontier),
  { ssr: false, loading }
)

const Constellation = dynamic(
  () =>
    import("@/components/ui/constellation-network").then((m) => {
      return function ConstellationLive() {
        return (
          <div className="relative h-[60vh] min-h-[360px] overflow-hidden rounded-2xl">
            <m.ConstellationNetwork
              colorLightVar="--color-neutral-400"
              colorDarkVar="--color-neutral-600"
              glowColorLightVar="--accent"
              glowColorDarkVar="--accent"
            />
            <p className="pointer-events-none absolute inset-x-0 bottom-4 text-center text-xs text-muted-foreground">
              Move your cursor through the field.
            </p>
          </div>
        )
      }
    }),
  { ssr: false, loading }
)

/* ─── Posters ────────────────────────────────────────────────────────────────
   Flat SVG artwork on the wall's black canvas. Emerald is the one accent. */

const A = "#34d399"
const LINE = "rgba(255,255,255,0.22)"
const FILL = "rgba(255,255,255,0.06)"

function Poster({ children, label }: { children: ReactNode; label: string }) {
  return (
    <div className="absolute inset-0 bg-[#0b0b0b]">
      <svg viewBox="0 0 200 200" className="h-full w-full" aria-hidden>
        {children}
      </svg>
      <span className="pointer-events-none absolute bottom-2.5 left-3 font-mono text-[10px] text-white/45">
        {label}
      </span>
    </div>
  )
}

/* Its own component so each tile's textPath gets a unique id — the wall
   renders every poster many times over. */
function MarqueePoster() {
  const id = useId()
  return (
    <Poster label="curved marquee">
      <path d="M20 140 C 60 40, 140 40, 180 120" fill="none" stroke={LINE} strokeWidth="1" />
      <path id={id} d="M20 140 C 60 40, 140 40, 180 120" fill="none" />
      <text fontSize="11" fill="rgba(255,255,255,0.7)" letterSpacing="1.5">
        <textPath href={`#${id}`}>PRODUCT · SYSTEMS · CRAFT · PROOF ·</textPath>
      </text>
      <circle cx="60" cy="40" r="4" fill={A} />
      <circle cx="140" cy="40" r="4" fill={A} />
      <line x1="20" y1="140" x2="60" y2="40" stroke={A} strokeDasharray="2 3" />
      <line x1="180" y1="120" x2="140" y2="40" stroke={A} strokeDasharray="2 3" />
    </Poster>
  )
}

const posters = {
  brandSkins: (
    <Poster label="brand skins">
      <rect x="30" y="50" width="140" height="84" rx="10" fill="#E11D48" />
      <rect x="100" y="50" width="70" height="84" fill="#8A6420" />
      <line x1="100" y1="40" x2="100" y2="144" stroke="#fff" strokeWidth="1.5" />
      <circle cx="100" cy="92" r="8" fill="#fff" />
      <rect x="42" y="112" width="44" height="6" rx="3" fill="rgba(255,255,255,0.7)" />
    </Poster>
  ),
  themeSplit: (
    <Poster label="theme split">
      <rect x="36" y="40" width="128" height="110" rx="12" fill="#f4f4f2" />
      <path d="M100 40 H152 a12 12 0 0 1 12 12 V138 a12 12 0 0 1 -12 12 H100 Z" fill="#161616" />
      <circle cx="68" cy="78" r="14" fill="none" stroke={A} strokeWidth="5" />
      <circle cx="132" cy="78" r="14" fill="none" stroke={A} strokeWidth="5" />
      <line x1="100" y1="32" x2="100" y2="158" stroke={A} strokeWidth="1.5" />
    </Poster>
  ),
  marquee: <MarqueePoster />,
  flow: (
    <Poster label="flow diagram">
      <rect x="80" y="30" width="40" height="22" rx="5" fill={FILL} stroke={A} />
      {[36, 88, 140].map((x) => (
        <rect key={x} x={x} y="92" width="30" height="20" rx="5" fill={FILL} stroke={LINE} />
      ))}
      {[70, 118].map((x) => (
        <rect key={x} x={x} y="146" width="30" height="20" rx="5" fill={FILL} stroke={LINE} />
      ))}
      <g fill="none" stroke={LINE}>
        <path d="M100 52 V72 H51 V92" />
        <path d="M100 52 V92" stroke={A} />
        <path d="M100 72 H155 V92" />
        <path d="M103 112 V130 H85 V146" stroke={A} />
        <path d="M103 130 H133 V146" />
      </g>
    </Poster>
  ),
  infoArch: (
    <Poster label="information architecture">
      <rect x="78" y="90" width="44" height="20" rx="10" fill={A} />
      <g fill="none" stroke={LINE}>
        <path d="M100 90 V70 H50 V56 M100 70 H150 V56 M100 70 V56" />
        <path d="M100 110 V130 H60 V144 M100 130 H140 V144" />
      </g>
      {[36, 86, 136].map((x) => (
        <rect key={x} x={x} y="38" width="28" height="18" rx="4" fill={FILL} stroke={LINE} />
      ))}
      {[46, 126].map((x) => (
        <rect key={x} x={x} y="144" width="28" height="18" rx="4" fill={FILL} stroke={LINE} />
      ))}
    </Poster>
  ),
  colorScale: (
    <Poster label="color scale">
      {Array.from({ length: 10 }, (_, i) => (
        <rect
          key={i}
          x={22 + i * 16}
          y="70"
          width="14"
          height="60"
          rx="3"
          fill={`hsl(158 ${40 + i * 4}% ${92 - i * 8}%)`}
        />
      ))}
      <text x="22" y="150" fontSize="9" fill="rgba(255,255,255,0.5)" fontFamily="monospace">50 → 950 · 4.5:1 ✓</text>
    </Poster>
  ),
  attention: (
    <Poster label="attention model">
      {Array.from({ length: 14 }, (_, i) => {
        // Rounded so server and client serialise identical attribute strings.
        const h = Math.round((100 * Math.pow(1 - i / 14, 2.4) + 4) * 10) / 10
        return (
          <rect key={i} x={26 + i * 11} y={150 - h} width="8" height={h} rx="1.5" fill={i < 2 ? A : "rgba(255,255,255,0.25)"} />
        )
      })}
      <line x1="22" y1="150" x2="182" y2="150" stroke={LINE} />
    </Poster>
  ),
  frontier: (
    <Poster label="trade-off frontier">
      <line x1="34" y1="160" x2="176" y2="160" stroke={LINE} />
      <line x1="34" y1="160" x2="34" y2="30" stroke={LINE} />
      <path d="M40 44 C 90 50, 150 90, 170 154" fill="none" stroke={A} strokeWidth="1.5" />
      {[[60, 90], [90, 120], [120, 104], [70, 132], [140, 140]].map(([x, y]) => (
        <circle key={`${x}-${y}`} cx={x} cy={y} r="3" fill="rgba(255,255,255,0.4)" />
      ))}
      <circle cx="104" cy="70" r="5" fill={A} />
    </Poster>
  ),
  constellation: (
    <Poster label="constellation">
      {(() => {
        const pts = [[40, 60], [80, 40], [120, 70], [160, 50], [60, 110], [110, 120], [150, 130], [90, 160], [140, 96]]
        const edges = [[0, 1], [1, 2], [2, 3], [0, 4], [4, 5], [5, 2], [5, 6], [5, 7], [2, 8], [8, 6]]
        return (
          <>
            {edges.map(([a, b]) => (
              <line key={`${a}-${b}`} x1={pts[a][0]} y1={pts[a][1]} x2={pts[b][0]} y2={pts[b][1]} stroke={LINE} />
            ))}
            {pts.map(([x, y], i) => (
              <circle key={i} cx={x} cy={y} r={i === 5 ? 4 : 2} fill={i === 5 ? A : "rgba(255,255,255,0.6)"} />
            ))}
          </>
        )
      })()}
    </Poster>
  ),
}

export const EXPERIMENTS: Experiment[] = [
  {
    id: "brand-skins",
    title: "Brand skin wipe",
    kind: "Case-study component",
    note: "The white-label claim, made draggable: one banking screen from two token sets, showing what a config swap changes and what it doesn't.",
    usedIn: { label: "White-label RFP", href: "/work/white-label-rfp#tokens" },
    poster: posters.brandSkins,
    Live: BrandSkins,
  },
  {
    id: "theme-split",
    title: "Light ↔ dark split",
    kind: "Interaction",
    note: "The same token-driven UI forced into both themes at once, with a wipe between them. Built to catch contrast problems that only show up in one mode.",
    poster: posters.themeSplit,
    Live: ThemeSplit,
  },
  {
    id: "curved-marquee",
    title: "Curved marquee",
    kind: "SVG / motion",
    note: "Text flowing along an editable cubic bezier. Drag the anchor and control points; the loop stays seamless whatever shape you give it.",
    poster: posters.marquee,
    Live: Marquee,
  },
  {
    id: "flow-diagram",
    title: "Flow diagram",
    kind: "Data-driven diagram",
    note: "A real parent→child hierarchy. Hover to trace a path, click to pin, drag to rearrange.",
    poster: posters.flow,
    Live: Flow,
  },
  {
    id: "info-architecture",
    title: "Bidirectional sitemap",
    kind: "Data-driven diagram",
    note: "A root that fans into two trees, laid out automatically from nested data. Click a node to collapse its branch.",
    poster: posters.infoArch,
    Live: InfoArch,
  },
  {
    id: "color-scale",
    title: "Color scale generator",
    kind: "Tool",
    note: "Pick one brand colour and get a full, contrast-checked scale with exports. The working half of my colour-system essay.",
    usedIn: { label: "Color Systems Are Rules, Not Palettes", href: "/articles/color-system" },
    poster: posters.colorScale,
    Live: ColorScale,
  },
  {
    id: "attention",
    title: "Where the attention goes",
    kind: "Interactive model",
    note: "A toy model of how engagement-ranked feeds concentrate attention on a few people. Turn up the skew and watch the Gini climb.",
    usedIn: { label: "Dating Apps Solved the Wrong Problem", href: "/articles/dating-app-allocation" },
    poster: posters.attention,
    Live: Attention,
  },
  {
    id: "frontier",
    title: "Trade-off frontier",
    kind: "Interactive model",
    note: "Match quality against fairness as a frontier, not a slider. Every step along the curve costs something.",
    usedIn: { label: "Dating Apps Solved the Wrong Problem", href: "/articles/dating-app-allocation" },
    poster: posters.frontier,
    Live: Frontier,
  },
  {
    id: "constellation",
    title: "Constellation field",
    kind: "Canvas",
    note: "A depth-layered particle field where the cursor pools a warm light. Too loud for a content page, which is why it lives here.",
    poster: posters.constellation,
    Live: Constellation,
  },
]
