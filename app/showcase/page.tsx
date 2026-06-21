import type { Metadata } from "next"
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
  AvatarFallback,
  AvatarGroup,
  AvatarGroupCount,
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
import { ImageLayout, type ImageItem } from "@/components/shared/image-layout"
import { FullBleedBlock } from "@/components/shared/full-bleed-block"
import PhotoCarousel from "@/components/shared/photo-carousel"
import { CsImage } from "@/components/case-study/cs-image"
import { IphoneFrame } from "@/components/shared/iphone-frame"
import { BentoGrid, BentoCard } from "@/components/shared/bento-grid"
import {
  DottedGlowBackground,
  DottedGravityBackground,
  ConstellationNetwork,
  FlowFieldParticles,
  AuroraGradientMesh,
  MagneticLineField,
  ShaderGrid,
} from "@/components/ui/backgrounds"
import { BackgroundBand } from "@/components/shared/background-band"
import { FlowDiagramDemo } from "./flow-diagram-demo"

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

function Row({ label, children }: { label?: string; children: React.ReactNode }) {
  return (
    <div className="flex flex-col gap-2.5">
      {label && (
        <span className="text-[10px] font-bold uppercase tracking-[0.14em] text-muted-foreground">
          {label}
        </span>
      )}
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
      <p className="mb-3 text-[10px] font-bold uppercase tracking-[0.14em] text-muted-foreground">
        {label}
      </p>
      <BackgroundBand bg={bg}>
        <div className="flex flex-col items-center gap-2 text-center">
          <IconSparkles className="size-8 text-foreground" />
          <p className="text-base font-medium text-foreground md:text-lg">{title}</p>
          <p className="text-xs text-muted-foreground">{sub}</p>
        </div>
      </BackgroundBand>
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

const BUTTON_VARIANTS = ["default", "secondary", "outline", "ghost", "destructive", "link"] as const
const BADGE_VARIANTS = ["default", "secondary", "outline", "ghost", "destructive", "link"] as const

const IMAGES: ImageItem[] = [
  { src: "/assets/images/work/white-label-platform.jpg", alt: "Sample 1", caption: "Frame one" },
  { src: "/assets/images/work/white-label-platform.jpg", alt: "Sample 2", caption: "Frame two" },
  { src: "/assets/images/work/white-label-platform.jpg", alt: "Sample 3", caption: "Frame three" },
  { src: "/assets/images/work/white-label-platform.jpg", alt: "Sample 4", caption: "Frame four" },
]

const BENTO_IMAGES: ImageItem[] = [
  { src: "/assets/images/work/white-label-platform.jpg", alt: "Sample 1", colSpan: 2 },
  { src: "/assets/images/work/white-label-platform.jpg", alt: "Sample 2" },
  { src: "/assets/images/work/white-label-platform.jpg", alt: "Sample 3" },
  { src: "/assets/images/work/white-label-platform.jpg", alt: "Sample 4", colSpan: 2 },
]

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
            <p className="text-[11px] font-bold uppercase tracking-[0.18em] text-accent">
              Internal · not linked in nav
            </p>
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
            {BUTTON_VARIANTS.map((v) => (
              <Button key={v} variant={v}>
                {v}
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
              Get started <IconArrowRight />
            </Button>
            <Button variant="outline">
              <IconSparkles /> With icon
            </Button>
            <Button size="icon" aria-label="Bolt">
              <IconBolt />
            </Button>
            <Button disabled>Disabled</Button>
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
            <IconCheck /> with icon
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
          <FadeIn className="rounded-xl bg-muted p-5 text-sm text-muted-foreground">
            This block fades and rises into view (FadeIn).
          </FadeIn>
          <div className="text-2xl font-medium text-foreground">
            I build{" "}
            <span className="text-accent">
              <RollingWord />
            </span>
          </div>
          <div className="text-2xl font-medium text-foreground">
            I build <TypingWord />
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

      {/* Image components */}
      <Lab
        id="images"
        title="Image components"
        note="The reusable image primitives. ImageLayout handles multi-image grids; FullBleedBlock is the hero with overlay copy; CsImage is the case-study figure; PhotoCarousel is the stacked-photo deck."
      >
        <div className="flex flex-col gap-12">
          <div>
            <p className="mb-3 text-[10px] font-bold uppercase tracking-[0.14em] text-muted-foreground">
              ImageLayout · single
            </p>
            <ImageLayout layout="single" images={[IMAGES[0]]} aspect="16/9" />
          </div>

          <div>
            <p className="mb-3 text-[10px] font-bold uppercase tracking-[0.14em] text-muted-foreground">
              ImageLayout · 2-col
            </p>
            <ImageLayout layout="2-col" images={IMAGES.slice(0, 2)} />
          </div>

          <div>
            <p className="mb-3 text-[10px] font-bold uppercase tracking-[0.14em] text-muted-foreground">
              ImageLayout · 3-featured
            </p>
            <ImageLayout layout="3-featured" images={IMAGES.slice(0, 3)} />
          </div>

          <div>
            <p className="mb-3 text-[10px] font-bold uppercase tracking-[0.14em] text-muted-foreground">
              ImageLayout · bento
            </p>
            <ImageLayout layout="bento" images={BENTO_IMAGES} />
          </div>

          <div>
            <p className="mb-3 text-[10px] font-bold uppercase tracking-[0.14em] text-muted-foreground">
              FullBleedBlock · overlay copy
            </p>
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
            <p className="mb-3 text-[10px] font-bold uppercase tracking-[0.14em] text-muted-foreground">
              CsImage
            </p>
            <CsImage src="/assets/images/work/white-label-platform.jpg" alt="Case study figure" caption="A single case-study figure with caption." />
          </div>

          <div>
            <p className="mb-3 text-[10px] font-bold uppercase tracking-[0.14em] text-muted-foreground">
              PhotoCarousel
            </p>
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

      {/* Bento grid */}
      <Lab
        id="bento"
        title="Bento grid"
        note="General-purpose content bento. Cells set colSpan (1–3) and rowSpan (1–2); the grid backfills gaps with grid-flow-dense. Add href to make a cell a link (with the custom-cursor 'card' affordance)."
      >
        <BentoGrid>
          <BentoCard
            colSpan={2}
            rowSpan={2}
            icon={IconSparkles}
            eyebrow="Featured"
            title="Wide + tall cell"
            description="colSpan 2, rowSpan 2 — the anchor tile. Drop any children below the description."
          >
            <Badge variant="secondary">children slot</Badge>
          </BentoCard>

          <BentoCard
            icon={IconBolt}
            title="Standard"
            description="Default 1×1 cell."
          />

          <BentoCard
            href="/showcase#bento"
            cursorLabel="Open"
            icon={IconArrowRight}
            title="Linked cell"
            description="Has href → whole tile is a link with the cursor pill."
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

      {/* Glow backgrounds — full bleed */}
      <Lab
        id="dotted-glow"
        title="Glow backgrounds (full bleed)"
        note="Each background as a full-width band: ShaderGrid (WebGL), DottedGlowBackground (Canvas), the hero & About replicas, cursor-gravity dots, plus four new variants — constellation network, flow-field particles, aurora gradient mesh, and a magnetic line field. All theme-aware and static under reduced motion."
      >
        <div className="flex flex-col gap-8">
          {/* WebGL ShaderGrid band */}
          <GlowBand
            label="ShaderGrid · WebGL"
            title="Interactive shader background"
            sub="Move the cursor — the dots drag like water"
            bg={<ShaderGrid spacing={16} dotSize={0.08} radius={0.15} drag={1.6} maxDrag={0.014} shimmer={3.5} />}
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
                colorLightVar="--color-neutral-400"
                glowColorLightVar="--accent"
                colorDarkVar="--color-neutral-700"
                glowColorDarkVar="--accent"
                backgroundOpacity={0}
                speedMin={0.4}
                speedMax={1.4}
                speedScale={1}
              />
            }
          />

          {/* Hero background — the exact config used on the home page */}
          <GlowBand
            label="Hero background · ShaderGrid (as shipped)"
            title="Hero background"
            sub="Restrained breathe (shimmer 1) · cursor-reactive"
            bg={<ShaderGrid spacing={18} dotSize={0.07} radius={0.13} drag={1.35} maxDrag={0.01} fallbackOpacity={0.28} />}
          />

          {/* About background — layered grid + ambient blooms (static replica) */}
          <div>
            <p className="mb-3 text-[10px] font-bold uppercase tracking-[0.14em] text-muted-foreground">
              About background · grid + ambient bloom
            </p>
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

          {/* Cursor gravity — the WebGL shader's standing gravity well (dots
              lean in and stick to a resting pointer; click drops a ripple). */}
          <GlowBand
            label="DottedGravityBackground · cursor gravity"
            title="Cursor gravity field"
            sub="Hold the cursor still — the dots lean in and stick · click to ripple"
            bg={<DottedGravityBackground spacing={16} dotSize={0.08} radius={0.2} drag={0.7} maxDrag={0.01} />}
          />

          {/* Constellation network */}
          <GlowBand
            label="ConstellationNetwork · linked particles"
            title="Constellation network"
            sub="Nearby points link · the cursor draws & pulls"
            bg={
              <ConstellationNetwork
                colorLightVar="--color-neutral-400"
                colorDarkVar="--color-neutral-600"
                glowColorLightVar="--accent"
                glowColorDarkVar="--accent"
              />
            }
          />

          {/* Flow-field particles */}
          <GlowBand
            label="FlowFieldParticles · noise drift + trails"
            title="Flow-field particles"
            sub="Particles drift along an evolving noise field"
            bg={<FlowFieldParticles colorLightVar="--accent" colorDarkVar="--accent" />}
          />

          {/* Aurora gradient mesh */}
          <GlowBand
            label="AuroraGradientMesh · ambient blobs"
            title="Aurora gradient mesh"
            sub="Calm, colourful ambient — no cursor needed"
            bg={<AuroraGradientMesh />}
          />

          {/* Magnetic line field */}
          <GlowBand
            label="MagneticLineField · iron filings"
            title="Magnetic line field"
            sub="Segments orient toward the cursor like iron filings"
            bg={
              <MagneticLineField
                colorLightVar="--color-neutral-400"
                colorDarkVar="--color-neutral-600"
                glowColorLightVar="--accent"
                glowColorDarkVar="--accent"
              />
            }
          />
        </div>
      </Lab>

      {/* Flow diagram */}
      <Lab
        id="flow-diagram"
        title="Flow diagram"
        note="A data-driven org chart from one nested tree — each node fans down to its children, joined by measured SVG bézier connectors that draw in (cross-links via the links prop). Hover a node to highlight its edges. Scroll horizontally if it overflows."
      >
        <FlowDiagramDemo />
      </Lab>

      {/* Catalog of in-context components */}
      <Lab
        id="catalog"
        title="In-context components"
        note="These need page data, a provider, or full-bleed layout, so they render best on their own route. Open each to review."
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
    </div>
  )
}
