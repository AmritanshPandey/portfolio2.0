import type { Metadata } from "next"
import Image from "next/image"
import Link from "next/link"
import {
  IconArrowRight,
  IconSparkles,
  IconBolt,
  IconCheck,
  IconHeart,
} from "@tabler/icons-react"

import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { cn } from "@/lib/utils"
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
  CardAction,
} from "@/components/ui/card"
import {
  Avatar,
  AvatarBadge,
  AvatarFallback,
  AvatarGroup,
  AvatarGroupCount,
  AvatarImage,
} from "@/components/ui/avatar"
import { Separator } from "@/components/ui/separator"
import { AppIcon } from "@/components/ui/icon"

import { Pill } from "@/components/shared/pill"
import { FancyDivider } from "@/components/shared/divider"
import { SectionHeader } from "@/components/shared/section-header"
import { FadeIn } from "@/components/shared/fade-in"
import { ThemeToggle } from "@/components/shared/theme-toggle"
import { RollingWord } from "@/components/shared/rolling-word"
import { TypingWord } from "@/components/shared/typing-effect"
import { type ServiceCardItem } from "@/components/shared/service-card"
import { ServiceSheetCarousel } from "@/components/shared/service-sheet-carousel"
import { ServiceCarousel } from "@/components/shared/service-carousel"
import { ServiceAccordion } from "@/components/shared/service-accordion"
import {
  RadarAudience,
  BarMixed,
  PieMixed,
  BarStacked,
  RadialStacked,
  RadialShape,
  WaffleStat,
} from "@/components/showcase/data-charts"
import { ImageLayout, type ImageItem } from "@/components/shared/image-layout"
import { FullBleedBlock } from "@/components/shared/full-bleed-block"
import PhotoCarousel from "@/components/shared/photo-carousel"
import { CsImage } from "@/components/case-study/cs-image"
import { CsOutcomes } from "@/components/case-study/cs-outcomes"
import { CsResults } from "@/components/case-study/cs-results"
import { CsPhoneShowcase } from "@/components/case-study/cs-phone-showcase"
import { CsPhoneFeatures } from "@/components/case-study/cs-phone-features"
import { CsScreenWall } from "@/components/case-study/cs-screen-wall"
import { IphoneFrame } from "@/components/shared/iphone-frame"
import { BentoGrid, BentoCard } from "@/components/shared/bento-grid"
import { BrandBento } from "@/components/shared/brand/brand-bento"
import { CurvedMarquee } from "@/components/shared/curved-marquee/curved-marquee"
import { BeforeAfter } from "@/components/shared/before-after/before-after"
import { ThemeCompareDemo } from "@/components/shared/before-after/theme-compare-demo"
import { ImpactStoryCard } from "@/components/showcase/impact-story-card"
import {
  ShowcaseTabPanel,
  ShowcaseTabs,
  type ShowcaseTab,
} from "@/components/showcase/showcase-tabs"
import {
  DottedGlowBackground,
  AsciiFlowBackground,
  ConstellationNetwork,
  GradientShineBackground,
  ShaderGrid,
} from "@/components/ui/backgrounds"
import { BackgroundBand } from "@/components/shared/background-band"
import { HeroShaderGrid } from "@/components/shared/hero-shader-grid"
import { POOL_MASK } from "@/components/shared/site-background"
import { FlowDiagramDemo } from "./flow-diagram-demo"
import { InfoArchitectureDemo } from "./info-architecture-demo"

export const metadata: Metadata = {
  title: "Component Showcase",
  description: "A kitchen-sink gallery of every reusable component.",
}

/* ─────────────────────────────────────────────
   Local layout helpers — scoped to this page only
───────────────────────────────────────────── */

function Lab({
  id,
  title,
  note,
  children,
}: {
  id: string
  title: string
  note?: string
  children: React.ReactNode
}) {
  return (
    <section id={id} className="scroll-mt-24 py-12 border-t border-border first:border-t-0">
      <div className="mb-7">
        <h2 className="text-xl font-semibold tracking-tight text-foreground">{title}</h2>
        {note && <p className="mt-1.5 text-sm text-muted-foreground max-w-2xl">{note}</p>}
      </div>
      {children}
    </section>
  )
}

function Eyebrow({
  children,
  className,
}: {
  children: React.ReactNode
  className?: string
}) {
  return (
    <p
      className={cn(
        "text-[11px] font-mono font-semibold uppercase tracking-[0.16em] text-muted-foreground",
        className
      )}
    >
      {children}
    </p>
  )
}

function Row({ label, children }: { label?: string; children: React.ReactNode }) {
  return (
    <div className="flex flex-col gap-2.5">
      {label && <Eyebrow>{label}</Eyebrow>}
      <div className="flex flex-wrap items-center gap-3">{children}</div>
    </div>
  )
}

/** A labelled full-bleed background band — dogfoods <BackgroundBand>. */
function GlowBand({
  label,
  title,
  sub,
  bg,
}: {
  label: string
  title: string
  sub: string
  bg: React.ReactNode
}) {
  return (
    <div>
      <Eyebrow className="mb-3">{label}</Eyebrow>
      <div className="relative left-1/2 w-screen -translate-x-1/2">
        <div className="relative isolate flex h-72 items-center justify-center overflow-hidden bg-[oklch(0.98_0_0)] dark:bg-[oklch(0.14_0_0)] md:h-96">
          {/* The actual full-bleed background being demoed */}
          <div className="pointer-events-none absolute inset-0 z-0 overflow-hidden">
            {bg}
          </div>
          {/* Caption overlay */}
          <div className="relative z-10 flex flex-col items-center gap-2 text-center">
            <IconSparkles className="size-8 text-foreground" />
            <p className="text-base font-medium text-foreground md:text-lg">{title}</p>
            <p className="text-xs text-muted-foreground">{sub}</p>
          </div>
        </div>
      </div>
    </div>
  )
}

/* ─────────────────────────────────────────────
   Data
───────────────────────────────────────────── */

const TOKENS: { name: string; cls: string; note: string }[] = [
  { name: "background", cls: "bg-background", note: "page canvas" },
  { name: "foreground", cls: "bg-foreground", note: "primary text" },
  { name: "card", cls: "bg-card", note: "surface-1" },
  { name: "muted", cls: "bg-muted", note: "surface-2" },
  { name: "primary", cls: "bg-primary", note: "shadcn primary" },
  { name: "secondary", cls: "bg-secondary", note: "shadcn secondary" },
  { name: "accent", cls: "bg-accent", note: "emerald accent" },
  { name: "destructive", cls: "bg-destructive", note: "error / danger" },
  { name: "border", cls: "bg-border", note: "hairlines" },
]

const BUTTON_VARIANTS = [
  { label: "primary", variant: "default" },
  { label: "secondary", variant: "secondary" },
  { label: "outline", variant: "outline" },
  { label: "ghost", variant: "ghost" },
  { label: "destructive", variant: "destructive" },
  { label: "link", variant: "link" },
] as const
const BADGE_VARIANTS = ["default", "secondary", "outline", "ghost", "destructive", "link"] as const

const SHOWCASE_TABS: ShowcaseTab[] = [
  {
    id: "foundations",
    label: "Foundations",
    description: "Tokens, buttons, badges, and small tagging primitives.",
  },
  {
    id: "interface",
    label: "Interface",
    description: "Cursor states, avatars, dividers, section headers, motion, and icons.",
  },
  {
    id: "cards",
    label: "Cards",
    description: "Card shells, metric story cards, linked cards, and bento card compositions.",
  },
  {
    id: "brand",
    label: "Brand",
    description:
      "A brand-kit bento — a typography specimen, an expanding color palette, and a tall central image flanked by work-image tiles.",
  },
  {
    id: "images",
    label: "Images",
    description: "Image layouts, full-bleed media, case-study figures, carousels, and device frames.",
  },
  {
    id: "backgrounds",
    label: "Backgrounds",
    description: "Canvas, WebGL, and full-bleed ambient background bands.",
  },
  {
    id: "curved-marquee",
    label: "Curved Marquee",
    description:
      "SVG text flowing along an editable cubic-bezier path — toggle edit mode to drag the anchor and control points.",
  },
  {
    id: "compare",
    label: "Compare",
    description:
      "A draggable before/after wipe — works on two images, or on two live renders for a light↔dark theme split.",
  },
  {
    id: "case-study",
    label: "Case Study",
    description: "Case-study specific visual systems such as diagrams and process explainers.",
  },
  {
    id: "data",
    label: "Data",
    description: "Charts and data-viz: radar, bar, pie, stacked, radial gauges, and waffle stats.",
  },
  {
    id: "page-examples",
    label: "Page Examples",
    description: "Full-page examples that need route data, providers, or in-context layouts.",
  },
]

const SERVICES: ServiceCardItem[] = [
  {
    id: "discovery",
    index: "01",
    category: "Discovery",
    title: "Product discovery & framing",
    description:
      "Interviews, jobs-to-be-done and opportunity mapping that turn a vague ask into a sharp, testable problem statement the whole team can rally behind.",
    image: "/assets/images/work/fintech-ai-system.jpg",
    href: "#",
  },
  {
    id: "strategy",
    index: "02",
    category: "Strategy",
    title: "Roadmap & systems strategy",
    description:
      "Sequencing the bets — what to build now, next and never — against constraints, so each release compounds into a coherent platform instead of scattered features.",
    image: "/assets/images/work/execution-system.jpg",
    href: "#",
  },
  {
    id: "design",
    index: "03",
    category: "Design",
    title: "Interface & interaction design",
    description:
      "High-craft flows and screens with the motion, states and edge cases worked through — the kind of detail that makes a product feel considered rather than assembled.",
    image: "/assets/images/work/commerce-platform.jpg",
    href: "#",
  },
  {
    id: "systems",
    index: "04",
    category: "Systems",
    title: "Design systems & delivery",
    description:
      "Tokens, components and the documentation around them, built so engineering ships consistent UI fast and the system holds together as the surface area grows.",
    image: "/assets/images/work/design-tokens.jpg",
    href: "#",
  },
]

const IMAGES: ImageItem[] = [
  { src: "/assets/images/work/white-label-platform.jpg", alt: "Sample 1", caption: "Frame one" },
  { src: "/assets/images/work/white-label-platform.jpg", alt: "Sample 2", caption: "Frame two" },
  { src: "/assets/images/work/white-label-platform.jpg", alt: "Sample 3", caption: "Frame three" },
  { src: "/assets/images/work/white-label-platform.jpg", alt: "Sample 4", caption: "Frame four" },
]

const BENTO_IMAGES: ImageItem[] = [
  {
    src: "/assets/images/work/white-label-platform.jpg",
    alt: "Sample 1",
    colSpan: 2,
    title: "UX Case Studies",
    pills: ["Web", "Design", "Development", "Next.js"],
  },
  { src: "/assets/images/work/white-label-platform.jpg", alt: "Sample 2" },
  { src: "/assets/images/work/white-label-platform.jpg", alt: "Sample 3" },
  {
    src: "/assets/images/work/white-label-platform.jpg",
    alt: "Sample 4",
    colSpan: 2,
    title: "Overlay title + body",
    body: "Title, body and pills sit over the image on a soft scrim.",
    pills: ["Overlay", "Pills"],
  },
]

/* Screen wall — real work images, assorted aspects + crops, randomly drawn.
   Built once at module load (server) so the arrangement is stable per deploy. */
const WORK_IMAGES = [
  "agent-commerce",
  "ai-decision-engine",
  "commerce-platform",
  "design-tokens",
  "execution-system",
  "fintech-ai-system",
  "skincare-planner",
  "sneaker-commerce",
  "white-label-platform",
].map((n) => `/assets/images/work/${n}.jpg`)

const pick = <T,>(arr: readonly T[]) => arr[Math.floor(Math.random() * arr.length)]

const WALL_ITEMS = Array.from({ length: 30 }, () => ({
  src: pick(WORK_IMAGES),
  alt: "Case-study screen",
  aspect: "9/19.5",
}))

/**
 * The larger composite + section components don't live well out of context —
 * they need page data, the color-system provider, or full-bleed layout. Rather
 * than embed them fragilely, link to the route where each renders for real.
 */
const CATALOG: { group: string; href: string; items: string[] }[] = [
  {
    group: "Home sections",
    href: "/",
    items: ["Hero", "RollingWord / TypingWord", "WorkIndex", "Insights", "ProductThinking"],
  },
  {
    group: "About",
    href: "/#about",
    items: ["About", "Leadership", "Mentorship", "PhotoCarousel", "FocusList"],
  },
  {
    group: "Articles",
    href: "/articles",
    items: ["ArticlesIndex", "ArticleCard", "ArticleLayout", "ReadingProgress", "InsightsList"],
  },
  {
    group: "Case studies",
    href: "/work/agent-commerce",
    items: ["CaseStudyRenderer", "CsHero", "CsMetricBars", "CsTimeline", "CsBeforeAfter", "CsFlow"],
  },
  {
    group: "Fintech system",
    href: "/systems/fintech-ai-interface",
    items: ["CatalogPage", "Fintech UI kit"],
  },
  {
    group: "Color system (interactive)",
    href: "/articles/color-system",
    items: ["PrimaryControls", "Concepts", "Architecture", "ScaleExtras", "QaHuman", "ColorScaleTool"],
  },
  {
    group: "Explorations",
    href: "/explorations/smart-journal",
    items: ["ExplorationCard", "ExplorationProductCard", "MatchingLab", "InProgressSections"],
  },
]

/* ─────────────────────────────────────────────
   Page
───────────────────────────────────────────── */

export default function ShowcasePage() {
  return (
    <div className="mx-auto max-w-5xl px-6 md:px-8 pt-28 pb-32">
      {/* Header */}
      <header className="mb-6">
        <div className="flex items-center justify-between gap-4">
          <div>
            <Eyebrow className="text-accent">
              Internal · not linked in nav
            </Eyebrow>
            <h1 className="mt-2 text-3xl md:text-4xl font-semibold tracking-tight text-foreground">
              Component Showcase
            </h1>
            <p className="mt-2 text-sm text-muted-foreground max-w-2xl">
              A kitchen-sink gallery of the reusable primitives and atoms. Use it to spot
              inconsistencies, gaps, and what still needs building. Toggle the theme to check both modes.
            </p>
          </div>
          <ThemeToggle />
        </div>
      </header>

      <ShowcaseTabs tabs={SHOWCASE_TABS}>
        <ShowcaseTabPanel>
      {/* Color tokens */}
      <Lab id="tokens" title="Design tokens" note="The semantic color surface every component is built on. Watch for any swatch that looks wrong in dark vs light.">
        <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 gap-3">
          {TOKENS.map((t) => (
            <div key={t.name} className="flex flex-col gap-1.5">
              <div className={`h-16 rounded-xl ring-1 ring-foreground/10 ${t.cls}`} />
              <div className="leading-tight">
                <p className="text-[12px] font-medium text-foreground">{t.name}</p>
                <p className="text-[11px] text-muted-foreground">{t.note}</p>
              </div>
            </div>
          ))}
        </div>
      </Lab>

      {/* Buttons */}
      <Lab id="buttons" title="Button" note="All variants across sizes, plus icon and disabled states.">
        <div className="flex flex-col gap-6">
          <Row label="Variants">
            {BUTTON_VARIANTS.map((button) => (
              <Button key={button.label} variant={button.variant}>
                {button.label}
              </Button>
            ))}
          </Row>
          <Row label="Sizes">
            <Button size="xs">xs</Button>
            <Button size="sm">sm</Button>
            <Button size="default">default</Button>
            <Button size="lg">lg</Button>
          </Row>
          <Row label="With icon / state">
            <Button>
              Get started <IconArrowRight data-icon="inline-end" />
            </Button>
            <Button variant="outline">
              <IconSparkles data-icon="inline-start" /> With icon
            </Button>
            <Button size="icon" aria-label="Bolt">
              <IconBolt />
            </Button>
            <Button disabled>Disabled</Button>
          </Row>
          <Row label="asChild">
            <Button asChild>
              <Link href="/work/agent-commerce">
                Case study <IconArrowRight data-icon="inline-end" />
              </Link>
            </Button>
            <Button asChild variant="ghost">
              <Link href="/articles">Articles</Link>
            </Button>
          </Row>
        </div>
      </Lab>

      {/* Badges */}
      <Lab id="badges" title="Badge">
        <Row>
          {BADGE_VARIANTS.map((v) => (
            <Badge key={v} variant={v}>
              {v}
            </Badge>
          ))}
          <Badge>
            <IconCheck data-icon="inline-start" /> with icon
          </Badge>
          <Badge asChild variant="outline">
            <Link href="/showcase#badges">asChild link</Link>
          </Badge>
        </Row>
      </Lab>

      {/* Pills */}
      <Lab id="pills" title="Pill" note="Glass pill used for tags and meta chips.">
        <Row>
          <Pill>Product</Pill>
          <Pill>Fintech</Pill>
          <Pill>Design Systems</Pill>
          <Pill>AI Agents</Pill>
        </Row>
      </Lab>
        </ShowcaseTabPanel>

        <ShowcaseTabPanel>
      {/* Custom cursor states */}
      <Lab
        id="cursor"
        title="Custom cursor states"
        note="The cursor only reacts to interactive elements (ring grows) or elements tagged data-cursor-card / data-cursor-image. Plain text, swatches, and pills are inert by design — that's why they feel 'dead'."
      >
        <div className="grid sm:grid-cols-3 gap-4">
          <button className="rounded-xl border border-border p-5 text-left transition-colors hover:border-foreground/30">
            <p className="text-sm font-semibold text-foreground">link state</p>
            <p className="mt-1 text-[12px] text-muted-foreground">
              Any a / button / input grows the ring to 1.5×.
            </p>
          </button>

          <div
            data-cursor-card
            data-cursor-label="View"
            className="rounded-xl border border-border p-5 transition-colors hover:border-foreground/30"
          >
            <p className="text-sm font-semibold text-foreground">card state</p>
            <p className="mt-1 text-[12px] text-muted-foreground">
              data-cursor-card shows the label pill.
            </p>
          </div>

          <div
            data-cursor-image="/assets/images/work/white-label-platform.jpg"
            className="rounded-xl border border-border p-5 transition-colors hover:border-foreground/30"
          >
            <p className="text-sm font-semibold text-foreground">image state</p>
            <p className="mt-1 text-[12px] text-muted-foreground">
              data-cursor-image shows a hover preview.
            </p>
          </div>
        </div>
      </Lab>

      {/* Avatars */}
      <Lab id="avatars" title="Avatar">
        <div className="flex flex-wrap items-center gap-8">
          <Row label="Sizes">
            <Avatar size="sm">
              <AvatarFallback>AP</AvatarFallback>
            </Avatar>
            <Avatar>
              <AvatarFallback>AP</AvatarFallback>
            </Avatar>
            <Avatar size="lg">
              <AvatarFallback>AP</AvatarFallback>
            </Avatar>
          </Row>
          <Row label="Image + badge">
            <Avatar size="lg">
              <AvatarImage src="/assets/images/pic.png" alt="Amritansh Pandey" />
              <AvatarFallback>AP</AvatarFallback>
              <AvatarBadge />
            </Avatar>
          </Row>
          <Row label="Group">
            <AvatarGroup>
              <Avatar>
                <AvatarFallback>A</AvatarFallback>
              </Avatar>
              <Avatar>
                <AvatarFallback>B</AvatarFallback>
              </Avatar>
              <Avatar>
                <AvatarFallback>C</AvatarFallback>
              </Avatar>
              <AvatarGroupCount>+5</AvatarGroupCount>
            </AvatarGroup>
          </Row>
        </div>
      </Lab>

      {/* Dividers & separators */}
      <Lab id="dividers" title="Divider & Separator">
        <div className="flex flex-col gap-8">
          <FancyDivider variant="line" />
          <FancyDivider variant="gradient" />
          <FancyDivider variant="label" label="Section" />
          <div className="flex items-center gap-4 text-sm text-muted-foreground">
            <span>Left</span>
            <Separator orientation="vertical" className="h-5" />
            <span>Middle</span>
            <Separator orientation="vertical" className="h-5" />
            <span>Right</span>
          </div>
        </div>
      </Lab>

      {/* Section headers */}
      <Lab id="section-headers" title="SectionHeader" note="Three variants — hierarchy from size + weight (no eyebrows per DESIGN.md).">
        <div className="flex flex-col gap-10">
          <SectionHeader
            variant="hero"
            as="h2"
            animated={false}
            title="Hero variant title"
            description="The largest header, used to open a page section."
          />
          <SectionHeader
            variant="default"
            animated={false}
            title="Default variant title"
            description="The everyday section header with a supporting description."
          />
          <SectionHeader
            variant="compact"
            animated={false}
            title="Compact variant title"
            description="Tighter max-width for dense layouts."
          />
        </div>
      </Lab>

      {/* Motion & animated text */}
      <Lab id="motion" title="Motion & animated text" note="Scroll the page to retrigger FadeIn. RollingWord and TypingWord animate on their own.">
        <div className="flex flex-col gap-8">
          <FadeIn className="rounded-xl border border-border bg-muted p-5 text-sm text-muted-foreground">
            This block fades and rises into view (FadeIn).
          </FadeIn>

          {/* Hero-style display panel — the animated words shown at the scale
              they run at in the real hero. The tight 1.02 line-height matches
              .type-display-hero, which is what RollingWord's align-bottom mask
              is tuned for; at the showcase's old text-2xl default leading the
              masked word dropped to the bottom of a tall line box. */}
          <div className="rounded-2xl border border-border bg-muted/40 p-8 md:p-12">
            <div className="flex flex-col gap-10">
              <div className="flex flex-col gap-3">
                <Eyebrow>RollingWord</Eyebrow>
                <p className="text-3xl font-semibold leading-[1.02] tracking-[-0.02em] text-foreground md:text-5xl">
                  I build <RollingWord className="shimmer-accent" />
                </p>
              </div>
              <div className="flex flex-col gap-3">
                <Eyebrow>TypingWord</Eyebrow>
                <p className="text-3xl font-semibold leading-[1.02] tracking-[-0.02em] text-foreground md:text-5xl">
                  I build <TypingWord className="shimmer-accent font-medium whitespace-nowrap" />
                </p>
              </div>
            </div>
          </div>
        </div>
      </Lab>

      {/* Icons */}
      <Lab id="icons" title="AppIcon" note="Sized icon wrapper over the icon library.">
        <Row>
          <AppIcon icon={IconSparkles} size="xs" />
          <AppIcon icon={IconSparkles} size="sm" />
          <AppIcon icon={IconSparkles} size="md" />
          <AppIcon icon={IconSparkles} size="lg" />
          <AppIcon icon={IconSparkles} size="xl" />
          <AppIcon icon={IconHeart} size="2xl" className="text-rose-500" />
        </Row>
      </Lab>
        </ShowcaseTabPanel>

        <ShowcaseTabPanel>
      {/* Cards */}
      <Lab id="cards" title="Card" note="Composed header / content / footer slots. The first card is tagged data-cursor-card so the cursor reacts to it.">
        <div className="grid sm:grid-cols-2 gap-5">
          <Card data-cursor-card data-cursor-label="Open">
            <CardHeader>
              <CardTitle>Agent Pay</CardTitle>
              <CardDescription>The demo the CPO used at Money20/20.</CardDescription>
              <CardAction>
                <Badge variant="secondary">Live</Badge>
              </CardAction>
            </CardHeader>
            <CardContent className="text-muted-foreground">
              Cards carry a soft ring and rounded corners. Content can be any rich block.
            </CardContent>
            <CardFooter className="border-t">
              <Button variant="ghost" size="sm">
                Open case study <IconArrowRight />
              </Button>
            </CardFooter>
          </Card>

          <Card size="sm">
            <CardHeader>
              <CardTitle>Compact card</CardTitle>
              <CardDescription>size=&quot;sm&quot; tightens padding and gaps.</CardDescription>
            </CardHeader>
            <CardContent className="text-muted-foreground">
              Useful in dense grids and sidebars.
            </CardContent>
          </Card>
        </div>
      </Lab>

      <Lab
        id="impact-story-card"
        title="Impact story card"
        note="A premium editorial card with image, status pill, testimonial, and metric overlay."
      >
        <ImpactStoryCard
          image="/assets/images/1.png"
          alt="Workspace detail used as an editorial story card sample"
          label="Thinking growth"
          quote="ScaleUnion did not just advise - they restructured how we operate. Within weeks, decision-making was clearer and execution stopped stalling."
          attribution="Rahman H., Chief Operating Officer"
          metric="93.2%+"
          metricLabel="Client retention across multi-phase engagements"
        />
      </Lab>

      {/* Bento grid */}
      <Lab
        id="bento"
        title="Bento grid"
        note="General-purpose content bento. Cells set colSpan (1-3) and rowSpan (1-2); the grid backfills gaps with grid-flow-dense. Add href to make a cell a link."
      >
        <BentoGrid>
          <BentoCard
            colSpan={2}
            rowSpan={2}
            icon={IconSparkles}
            eyebrow="Featured"
            title="Wide + tall cell"
            description="colSpan 2, rowSpan 2 - the anchor tile. Drop any children below the description."
          >
            <Badge variant="secondary">children slot</Badge>
          </BentoCard>

          <BentoCard
            icon={IconBolt}
            title="Standard"
            description="Default 1x1 cell."
          />

          <BentoCard
            href="/showcase#bento"
            cursorLabel="Open"
            icon={IconArrowRight}
            title="Linked cell"
            description="Has href, so the whole tile is a link with the cursor pill."
          />

          <BentoCard
            colSpan={3}
            title="Full-width row"
            description="colSpan 3 spans all three columns on large screens."
          />

          <BentoCard
            title="With background"
            description="A decorative layer sits behind the content."
            background={
              <div className="absolute inset-0 bg-gradient-to-br from-accent/25 via-transparent to-transparent" />
            }
          />

          <BentoCard
            colSpan={2}
            icon={IconHeart}
            title="Media tile"
            description="Use the background slot for imagery."
            background={
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src="/assets/images/work/white-label-platform.jpg"
                alt=""
                className="h-full w-full object-cover opacity-30"
              />
            }
          />
        </BentoGrid>
      </Lab>

      {/* Service sheet card */}
      <Lab
        id="service-sheet-card"
        title="ServiceSheetCard"
        note="Light editorial service card: an image tile with a mint pill badge (index · category) straddling a paper sheet. Hover or focus a card to raise the sheet and reveal the description + VIEW button. As a carousel: prev/next arrows (top-right) step through and raise the active card."
      >
        <ServiceSheetCarousel
          items={SERVICES}
          eyebrow="Our Service"
          heading="Build measurement systems that reveal"
          subtitle="From discovery to delivery — step through each engagement with the arrows, or hover a card to raise its sheet."
        />
      </Lab>
        </ShowcaseTabPanel>

        <ShowcaseTabPanel>
      {/* Brand bento */}
      <Lab
        id="brand"
        title="Brand bento"
        note="A brand-kit specimen built from the portfolio's own tokens — a typography specimen, the expanding color swatches (hover a strip to widen it and copy its hex), and a tall central image flanked by work-image tiles."
      >
        <FadeIn>
          <BrandBento />
        </FadeIn>
      </Lab>
        </ShowcaseTabPanel>

        <ShowcaseTabPanel>
      {/* Image components */}
      <Lab
        id="images"
        title="Image components"
        note="The reusable image primitives. ImageLayout handles multi-image grids; FullBleedBlock is the hero with overlay copy; CsImage is the case-study figure; PhotoCarousel is the stacked-photo deck."
      >
        <div className="flex flex-col gap-12">
          <div>
            <Eyebrow className="mb-3">
              ImageLayout · single
            </Eyebrow>
            <ImageLayout layout="single" images={[IMAGES[0]]} aspect="16/9" />
          </div>

          <div>
            <Eyebrow className="mb-3">
              ImageLayout · 2-col
            </Eyebrow>
            <ImageLayout layout="2-col" images={IMAGES.slice(0, 2)} />
          </div>

          <div>
            <Eyebrow className="mb-3">
              ImageLayout · 3-featured
            </Eyebrow>
            <ImageLayout layout="3-featured" images={IMAGES.slice(0, 3)} />
          </div>

          <div>
            <Eyebrow className="mb-3">
              ImageLayout · bento
            </Eyebrow>
            <ImageLayout layout="bento" images={BENTO_IMAGES} />
          </div>

          <div>
            <Eyebrow className="mb-3">
              FullBleedBlock · overlay copy
            </Eyebrow>
            <p className="mb-3 text-[12px] text-muted-foreground">
              The block is just <code>w-full</code>; &ldquo;full bleed&rdquo; comes from the consumer
              breaking out of its column. Here it breaks out to the full viewport width.
            </p>
            {/* Break out of the centered max-w-5xl container to the viewport edges */}
            <div className="relative left-1/2 w-screen -translate-x-1/2">
              <FullBleedBlock
                src="/assets/images/work/white-label-platform.jpg"
                alt="Full bleed sample"
                aspect="16/9"
                eyebrow="Case study"
                title="Full-bleed hero with overlay"
                subtitle="Copy sits over a gradient scrim at the bottom."
                flush
                className="my-0"
              />
            </div>
          </div>

          <div>
            <Eyebrow className="mb-3">
              CsImage
            </Eyebrow>
            <CsImage src="/assets/images/work/white-label-platform.jpg" alt="Case study figure" caption="A single case-study figure with caption." />
          </div>

          <div>
            <Eyebrow className="mb-3">
              PhotoCarousel
            </Eyebrow>
            <PhotoCarousel />
          </div>
        </div>
      </Lab>

      {/* iPhone frame */}
      <Lab
        id="iphone"
        title="iPhone frame"
        note="Device mockup with a transparent-cutout PNG frame. Drop in a screenshot via src, or live React via children. Set width on the wrapper; the Dynamic Island and buttons render over the content."
      >
        <div className="flex flex-wrap items-start gap-10">
          <div className="flex flex-col items-center gap-3">
            <IphoneFrame
              className="w-[240px]"
              variant="black"
              src="/assets/images/work/white-label-platform.jpg"
              alt="App screen"
            />
            <span className="text-[11px] text-muted-foreground">black · image src</span>
          </div>

          <div className="flex flex-col items-center gap-3">
            <IphoneFrame
              className="w-[240px]"
              variant="white"
              src="/assets/images/work/white-label-platform.jpg"
              alt="App screen"
            />
            <span className="text-[11px] text-muted-foreground">white · image src</span>
          </div>

          <div className="flex flex-col items-center gap-3">
            <IphoneFrame className="w-[240px]">
              <div className="flex h-full w-full flex-col items-center justify-center gap-2 bg-gradient-to-b from-accent/30 to-background text-center">
                <span className="text-sm font-medium text-foreground">Live content</span>
                <span className="text-[11px] text-muted-foreground">children slot</span>
              </div>
            </IphoneFrame>
            <span className="text-[11px] text-muted-foreground">live · children</span>
          </div>
        </div>
      </Lab>

        </ShowcaseTabPanel>

        <ShowcaseTabPanel>
      {/* Glow backgrounds — full bleed */}
      <Lab
        id="dotted-glow"
        title="Glow backgrounds (full bleed)"
        note="Each background as a full-width band: ShaderGrid (WebGL), DottedGlowBackground (Canvas), the hero & About replicas, cursor-gravity dots, and the constellation network. All theme-aware and static under reduced motion."
      >
        <div className="flex flex-col gap-8">
          {/* WebGL ShaderGrid band — shimmer only, no cursor interaction */}
          <GlowBand
            label="ShaderGrid · WebGL"
            title="Shimmer shader background"
            sub="Autonomous twinkle · no cursor interaction"
            bg={<ShaderGrid spacing={16} dotSize={0.08} radius={0.15} shimmer={3.5} interactive={false} />}
          />

          {/* Canvas 2D DottedGlowBackground band */}
          <GlowBand
            label="DottedGlowBackground · Canvas 2D"
            title="Canvas 2D glow background"
            sub="Autonomous twinkle, no GPU required"
            bg={
              <DottedGlowBackground
                opacity={1}
                gap={14}
                radius={1.5}
                colorLightVar="#7a5414"
                glowColorLightVar="#d97706"
                colorDarkVar="#3a2a12"
                glowColorDarkVar="#f59e0b"
                backgroundOpacity={0}
                speedMin={0.4}
                speedMax={1.4}
                speedScale={1.15}
              />
            }
          />

          {/* ASCII / dither field band */}
          <GlowBand
            label="AsciiFlowBackground · Canvas 2D"
            title="ASCII dither background"
            sub="Animated flow field rendered as an ASCII ramp · pass src to dither an image"
            bg={<AsciiFlowBackground cellSize={12} speed={1} opacity={0.9} />}
          />

          {/* Hero background — the exact config used on the home page, including
              the SiteBackground pool mask (pooled at top, dissolves before the
              fold) so it reads as the shipped hero backdrop, not the full-bleed
              ShaderGrid · WebGL demo above. */}
          <GlowBand
            label="Hero background · ShaderGrid (as shipped)"
            title="Hero background"
            sub="Restrained breathe (shimmer 1) · pooled + cursor-reactive"
            bg={
              <div
                className="absolute inset-0"
                style={{ maskImage: POOL_MASK, WebkitMaskImage: POOL_MASK }}
              >
                <HeroShaderGrid spacing={18} dotSize={0.07} radius={0.13} drag={1.35} maxDrag={0.01} fallbackOpacity={0.28} />
              </div>
            }
          />

          {/* About background — layered grid + ambient blooms (static replica) */}
          <div>
            <Eyebrow className="mb-3">
              About background · grid + ambient bloom
            </Eyebrow>
            <div className="relative left-1/2 w-screen -translate-x-1/2">
              <div className="relative isolate flex h-72 items-center justify-center overflow-hidden bg-[oklch(0.98_0_0)] dark:bg-[oklch(0.14_0_0)] md:h-96">
                <div className="pointer-events-none absolute inset-0 z-0 overflow-hidden">
                  {/* fine 24px grid */}
                  <div
                    aria-hidden
                    className="absolute inset-0 opacity-40 dark:opacity-50"
                    style={{
                      backgroundImage:
                        "linear-gradient(to right, rgba(12,12,12,0.055) 1px, transparent 1px), linear-gradient(to bottom, rgba(12,12,12,0.055) 1px, transparent 1px)",
                      backgroundSize: "24px 24px",
                      maskImage:
                        "linear-gradient(to right, transparent 0%, black 10%, black 90%, transparent 100%)",
                      WebkitMaskImage:
                        "linear-gradient(to right, transparent 0%, black 10%, black 90%, transparent 100%)",
                    }}
                  />
                  {/* major 96px grid */}
                  <div
                    aria-hidden
                    className="absolute inset-0 opacity-38 dark:opacity-48"
                    style={{
                      backgroundImage:
                        "linear-gradient(to right, rgba(12,12,12,0.115) 1px, transparent 1px), linear-gradient(to bottom, rgba(12,12,12,0.115) 1px, transparent 1px)",
                      backgroundSize: "96px 96px",
                      maskImage:
                        "linear-gradient(to bottom, transparent 0%, black 8%, black 78%, transparent 100%)",
                      WebkitMaskImage:
                        "linear-gradient(to bottom, transparent 0%, black 8%, black 78%, transparent 100%)",
                    }}
                  />
                  {/* dark-mode grid lines */}
                  <div
                    aria-hidden
                    className="absolute inset-0 hidden opacity-50 dark:block"
                    style={{
                      backgroundImage:
                        "linear-gradient(to right, rgba(255,255,255,0.055) 1px, transparent 1px), linear-gradient(to bottom, rgba(255,255,255,0.055) 1px, transparent 1px)",
                      backgroundSize: "24px 24px",
                      maskImage:
                        "linear-gradient(to right, transparent 0%, black 10%, black 90%, transparent 100%)",
                      WebkitMaskImage:
                        "linear-gradient(to right, transparent 0%, black 10%, black 90%, transparent 100%)",
                    }}
                  />
                  <div
                    aria-hidden
                    className="absolute inset-0 hidden opacity-48 dark:block"
                    style={{
                      backgroundImage:
                        "linear-gradient(to right, rgba(255,255,255,0.115) 1px, transparent 1px), linear-gradient(to bottom, rgba(255,255,255,0.115) 1px, transparent 1px)",
                      backgroundSize: "96px 96px",
                      maskImage:
                        "linear-gradient(to bottom, transparent 0%, black 8%, black 78%, transparent 100%)",
                      WebkitMaskImage:
                        "linear-gradient(to bottom, transparent 0%, black 8%, black 78%, transparent 100%)",
                    }}
                  />
                  {/* vignette */}
                  <div
                    aria-hidden
                    className="absolute inset-0 opacity-20 dark:opacity-70"
                    style={{
                      background:
                        "radial-gradient(ellipse 78% 58% at 50% 38%, transparent 0%, transparent 54%, rgba(0,0,0,0.22) 100%)",
                    }}
                  />
                  {/* ambient emerald + neutral blooms */}
                  <div className="absolute inset-0 bg-[radial-gradient(640px_340px_at_86%_88%,rgba(16,185,129,0.07),transparent_66%)] dark:bg-[radial-gradient(560px_300px_at_86%_88%,rgba(16,185,129,0.17),transparent_70%)]" />
                  <div className="absolute inset-0 bg-[radial-gradient(520px_320px_at_12%_6%,rgba(0,0,0,0.04),transparent_60%)] dark:bg-[radial-gradient(560px_340px_at_12%_6%,rgba(255,255,255,0.05),transparent_62%)]" />
                </div>
                <div className="relative z-20 flex flex-col items-center gap-2 text-center">
                  <IconSparkles className="size-8 text-foreground" />
                  <p className="text-base font-medium text-foreground md:text-lg">About background</p>
                  <p className="text-xs text-muted-foreground">Premium grid + ambient bloom (static replica)</p>
                </div>
              </div>
            </div>
          </div>

        

          {/* Constellation network */}
          <GlowBand
            label="ConstellationNetwork · linked particles"
            title="Constellation network"
            sub="Depth-layered field, edges dissolved · the cursor pools a warm light"
            bg={
              <ConstellationNetwork
                colorLightVar="--color-neutral-400"
                colorDarkVar="--color-neutral-600"
                glowColorLightVar="--accent"
                glowColorDarkVar="--accent"
              />
            }
          />

          {/* Gradient shine — ported from the older portfolio hero */}
          <GlowBand
            label="GradientShineBackground · accent bands + grain + shine"
            title="Gradient shine field"
            sub="Accent bands settle in · grain drifts · a soft shine sweeps once"
            bg={<GradientShineBackground />}
          />
        </div>
      </Lab>
        </ShowcaseTabPanel>

        <ShowcaseTabPanel>
      {/* Curved marquee */}
      <Lab
        id="curved-marquee"
        title="Curved marquee"
        note="Animated SVG text flowing along a cubic-bezier path, looping seamlessly. Two variants: a hairline curve and a filled ribbon."
      >
        <div className="flex flex-col gap-10">
          <div>
            <Eyebrow className="mb-3">Line</Eyebrow>
            <CurvedMarquee editable={false} weave={false} />
          </div>
          <div>
            <Eyebrow className="mb-3">Ribbon</Eyebrow>
            <CurvedMarquee editable={false} variant="ribbon" fontSize={20} casingColor="transparent" />
          </div>
        </div>
      </Lab>
        </ShowcaseTabPanel>

        <ShowcaseTabPanel>
      {/* Before / after compare */}
      <Lab
        id="compare"
        title="Before / after compare"
        note="Drag the handle (or focus it and use the arrow keys) to wipe between two layers. The same slider drives an image comparison and a live light↔dark theme split of one token-driven UI."
      >
        <div className="flex flex-col gap-10">
          <div>
            <Eyebrow className="mb-3">Light ↔ Dark (live UI)</Eyebrow>
            <ThemeCompareDemo className="mx-auto max-w-xl" />
          </div>
          <div>
            <Eyebrow className="mb-3">Image</Eyebrow>
            <BeforeAfter
              className="mx-auto max-w-xl"
              beforeLabel="Before"
              afterLabel="After"
              before={
                <Image
                  src="/assets/images/work/ai-decision-engine.jpg"
                  alt="Earlier exploration"
                  fill
                  sizes="(max-width: 768px) 100vw, 36rem"
                  className="object-cover"
                />
              }
              after={
                <div className="relative aspect-[16/10] w-full">
                  <Image
                    src="/assets/images/work/commerce-platform.jpg"
                    alt="Shipped redesign"
                    fill
                    sizes="(max-width: 768px) 100vw, 36rem"
                    className="object-cover"
                  />
                </div>
              }
            />
          </div>
        </div>
      </Lab>
        </ShowcaseTabPanel>

        <ShowcaseTabPanel>
      {/* Flow diagram */}
      <Lab
        id="flow-diagram"
        title="Case-study flow diagram"
        note="A data-driven diagram for explaining org structure, process, and systems inside case studies. True parent→child hierarchy with directed, side-anchored connectors. Hover, focus, or tap a node to highlight its full path to the root plus its whole subtree; click to pin. Connection dots and the clickable legend carry status; drag any node to reposition it (connectors follow); lanes stack vertically on narrow screens."
      >
        <FlowDiagramDemo />
      </Lab>

      {/* Information architecture */}
      <Lab
        id="info-architecture"
        title="Information architecture"
        note="A bidirectional sitemap for documenting a full product's IA: a center root fans into an 'up' tree and a 'down' tree (e.g. Seller / Buyer), with right-angle connectors. Auto-laid-out from nested data, so editing is just nesting objects. Click any node to collapse/expand its branch; hover or focus to highlight its connections."
      >
        <InfoArchitectureDemo />
      </Lab>

      {/* Phone showcase */}
      <Lab
        id="phone-showcase"
        title="Phone showcase"
        note="A captioned trio of iPhone mockups (built on IphoneFrame). Use 1–3 phones. Each device can crop 'bottom' (rises from below, top of UI shows), 'top' (bottom of UI shows), or 'none' (full device). Tune the visible slice with reveal."
      >
        <div className="flex flex-col gap-16">
          <div>
            <Eyebrow className="mb-5">Three phones · cropped bottom (rises from below)</Eyebrow>
            <CsPhoneShowcase
              items={[
                {
                  title: "Strain",
                  description:
                    "Track how hard you're pushing with one number that captures your daily effort and exertion.",
                  src: "/assets/images/work/fintech-ai-system.jpg",
                  alt: "Strain screen",
                  crop: "bottom",
                },
                {
                  title: "Sleep",
                  description:
                    "Discover what it takes to get a good night's rest by knowing your sleep stages and trends.",
                  src: "/assets/images/work/ai-decision-engine.jpg",
                  alt: "Sleep screen",
                  crop: "bottom",
                },
                {
                  title: "Recovery",
                  description:
                    "See if you're ready to tackle the day or if it's time to slow down and let your body recover.",
                  src: "/assets/images/work/execution-system.jpg",
                  alt: "Recovery screen",
                  crop: "bottom",
                },
              ]}
            />
          </div>

          <div>
            <Eyebrow className="mb-5">Three phones · caption below · white frame</Eyebrow>
            <CsPhoneShowcase
              captionPosition="bottom"
              items={[
                {
                  title: "Before",
                  description: "The old flow buried the primary action three taps deep.",
                  src: "/assets/images/work/commerce-platform.jpg",
                  alt: "Before screen",
                  variant: "white",
                  crop: "top",
                },
                {
                  title: "During",
                  description: "An interim pass surfaced the action but still cost two taps.",
                  src: "/assets/images/work/ai-decision-engine.jpg",
                  alt: "During screen",
                  variant: "white",
                  crop: "top",
                },
                {
                  title: "After",
                  description: "A single sheet surfaces the action the moment it's needed.",
                  src: "/assets/images/work/design-tokens.jpg",
                  alt: "After screen",
                  variant: "white",
                  crop: "top",
                },
              ]}
            />
          </div>

          <div>
            <Eyebrow className="mb-5">Feature list + device</Eyebrow>
            <CsPhoneFeatures
              eyebrow="Capabilities"
              title="And that's not all"
              description="The platform also ships with the following features:"
              src="/assets/images/work/fintech-ai-system.jpg"
              alt="App screen"
              features={[
                {
                  title: "Biological age",
                  description: "One score that shows how you're trending and where to focus.",
                  src: "/assets/images/work/ai-decision-engine.jpg",
                  alt: "Biological age screen",
                },
                {
                  title: "Cycle tracking",
                  description: "Understand your body's rhythm and train smarter around it.",
                  src: "/assets/images/work/skincare-planner.jpg",
                  alt: "Cycle tracking screen",
                  active: true,
                },
                {
                  title: "Strength training",
                  description: "Log your lifts and watch your progress stack up.",
                  src: "/assets/images/work/execution-system.jpg",
                  alt: "Strength training screen",
                },
                {
                  title: "Journal",
                  description: "Track your habits and connect the dots over time.",
                  src: "/assets/images/work/design-tokens.jpg",
                  alt: "Journal screen",
                },
              ]}
            />
          </div>

        </div>
      </Lab>

      {/* Screen wall */}
      <Lab
        id="screen-wall"
        title="Screen wall"
        note="Straight columns of frameless screens that drift slowly upward and loop forever, on a full-bleed ambient backdrop (2 cols on mobile → 5 on wide). Each card lifts on hover; columns hold still under reduced-motion. Images drawn at random from /assets/images/work."
      >
        <CsScreenWall items={WALL_ITEMS} />
      </Lab>

      <Lab
        id="service-carousel"
        title="ServiceCarousel"
        note="An expanding-panel carousel composed from <ServiceCard>. One panel is active at a time — hover or focus a card to promote it; the arrows step the active panel. On touch it becomes a horizontal scroll-snap strip."
      >
        <ServiceCarousel items={SERVICES} />
      </Lab>

      {/* Service accordion — light expanding-strip variation */}
      <Lab
        id="service-accordion"
        title="ServiceAccordion"
        note="A light, editorial variation of ServiceCarousel. Collapsed panels are thin vertical strips with a rotated title + ordinal; the active panel expands to reveal an image, title, description and tag chips. Hover/focus to promote, arrows step the active panel, horizontal scroll-snap on touch."
      >
        <ServiceAccordion
          items={SERVICES.map((s, i) => ({
            ...s,
            tags: [
              ["Logo Design", "Visual Identity", "Brand Guidelines"],
              ["Roadmapping", "Prioritization", "Sequencing"],
              ["Flows", "Motion", "Edge cases"],
            ][i % 3],
          }))}
        />
      </Lab>

      {/* Outcomes block */}
      <Lab
        id="cs-outcomes"
        title="CsOutcomes"
        note="A case-study outcomes block: an editorial media card with a pill badge beside a two-column grid of icon · title · description cells. Columns stretch to equal height and stack (media first) on mobile."
      >
        <CsOutcomes
          image="/assets/images/work/white-label-platform.jpg"
          imageAlt="The team reviewing the system together"
          tag="Team"
          items={[
            {
              icon: <IconBolt stroke={1.75} />,
              title: "Operational Efficiency Across the Organization",
              text: "Reduced friction across teams by clarifying ownership, tightening processes, and eliminating duplicated decisions.",
            },
            {
              icon: <IconSparkles stroke={1.75} />,
              title: "Readiness for Sustainable, Scalable Growth",
              text: "Built reusable foundations so new surfaces ship faster without re-litigating the same structural choices.",
            },
            {
              icon: <IconCheck stroke={1.75} />,
              title: "Leadership Alignment and Decision Clarity",
              text: "Enabled faster, higher-quality decisions through clear governance, accountability frameworks, and shared priorities.",
            },
            {
              icon: <IconHeart stroke={1.75} />,
              title: "Measurable, Long-Term Business Outcomes",
              text: "Delivered quantifiable improvements across execution speed, operational stability, and long-term performance.",
            },
          ]}
        />
      </Lab>

      {/* Results / proof block */}
      <Lab
        id="cs-results"
        title="CsResults"
        note="A results block: eyebrow + narrative heading with an optional CTA pinned top-right, above a row of stat cards (figure · label · supporting line). Highlighted cards pick up a soft accent tint."
      >
        <CsResults
          eyebrow="Consultancy Result"
          heading="121% average improvement in operational efficiency. Once we reorganize product narratives, rebuild journeys, and remove friction from the experience."
          cta={{ label: "Start a free meeting" }}
          stats={[
            {
              value: "121%",
              label: "Average improvement",
              text: "By restructuring workflows, removing redundant processes, and aligning teams around a unified operating model.",
              highlight: true,
            },
            {
              value: "3x",
              label: "Faster decisions",
              text: "Our framework reduces ambiguity and brings clarity to every layer of the organization, with roles defined and priorities aligned.",
            },
            {
              value: "200+",
              label: "Supported globally",
              text: "We've worked with organizations across SaaS, fintech, agencies, and high-growth companies worldwide.",
              highlight: true,
            },
          ]}
        />
      </Lab>
        </ShowcaseTabPanel>

        <ShowcaseTabPanel>
      {/* Data viz */}
      <Lab
        id="charts"
        title="Charts"
        note="Recharts wrapped in the design system — an emerald-forward palette over token surfaces, with on-view reveals. Radar, mixed/stacked bars, pie, radial gauges, and waffle stats."
      >
        <div className="grid grid-cols-1 gap-5 md:grid-cols-2 lg:grid-cols-3">
          <RadarAudience />
          <BarMixed />
          <PieMixed />
          <BarStacked />
          <RadialStacked />
          <RadialShape />
        </div>

        <div className="mt-5 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
          <WaffleStat percent={95} title="Conversion rate" />
          <WaffleStat percent={82} title="Retention (30-day)" />
          <WaffleStat percent={68} title="Task completion" />
        </div>
      </Lab>
        </ShowcaseTabPanel>

        <ShowcaseTabPanel>
      {/* Catalog of in-context components */}
      <Lab
        id="catalog"
        title="Page examples"
        note="These are complete page-level examples. They need route data, providers, or full-page layout, so they are better reviewed in context."
      >
        <div className="grid sm:grid-cols-2 gap-4">
          {CATALOG.map((c) => (
            <Link
              key={c.group}
              href={c.href}
              className="group rounded-xl border border-border p-4 transition-colors hover:border-foreground/30"
            >
              <div className="flex items-center justify-between">
                <p className="text-sm font-semibold text-foreground">{c.group}</p>
                <IconArrowRight className="size-4 text-muted-foreground transition-transform group-hover:translate-x-0.5" />
              </div>
              <p className="mt-2 text-[12px] leading-relaxed text-muted-foreground">
                {c.items.join(" · ")}
              </p>
            </Link>
          ))}
        </div>
      </Lab>
        </ShowcaseTabPanel>
      </ShowcaseTabs>
    </div>
  )
}
