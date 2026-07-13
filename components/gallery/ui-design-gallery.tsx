"use client"

import Image from "next/image"
import { useEffect, useMemo, useState } from "react"
import { createPortal } from "react-dom"
import {
  IconBookmark,
  IconDeviceDesktop,
  IconDeviceMobile,
  IconLayoutDashboard,
  IconMaximize,
  IconX,
} from "@tabler/icons-react"
import clsx from "clsx"
import { AsciiFlowBackground } from "@/components/ui/backgrounds"

type ShotCategory = "All" | "Web App" | "Systems" | "Mobile"

type Shot = {
  title: string
  category: Exclude<ShotCategory, "All">
  description: string
  image: string
  href: string
  format: "Desktop" | "Mobile" | "System"
  year: string
  tags: string[]
  featured?: boolean
}

const CATEGORIES: ShotCategory[] = ["All", "Web App", "Systems", "Mobile"]

const SHOTS: Shot[] = [
  {
    title: "PartnerBank Demo Builder",
    category: "Systems",
    description: "A configurable demo surface for assembling bank narratives without rebuilds.",
    image: "/assets/images/work/white-label-platform.jpg",
    href: "/work/white-label-rfp",
    format: "System",
    year: "2025",
    tags: ["RFP", "Config", "Scale"],
    featured: true,
  },
  {
    title: "Commerce Operations Hub",
    category: "Web App",
    description: "Shared catalog, campaign, checkout, and reporting patterns for D2C teams.",
    image: "/assets/images/work/commerce-platform.jpg",
    href: "/work/d2c-platform",
    format: "Desktop",
    year: "2024",
    tags: ["Commerce", "Ops", "Checkout"],
  },
  {
    title: "Fintech AI Interface System",
    category: "Systems",
    description: "Finance surfaces for classification, review queues, metrics, and risk decisions.",
    image: "/assets/images/work/fintech-ai-system.jpg",
    href: "/systems/fintech-ai-interface",
    format: "System",
    year: "2026",
    tags: ["Fintech", "AI", "Components"],
  },
  {
    title: "Sneaker Commerce Drop",
    category: "Mobile",
    description: "A high-intent shopping flow with discovery, drops, and purchase confidence cues.",
    image: "/assets/images/work/sneaker-commerce.jpg",
    href: "/explorations/sneakers-commerce",
    format: "Mobile",
    year: "2024",
    tags: ["Retail", "Drops", "Mobile"],
  },
  {
    title: "Weather Skincare Planner",
    category: "Mobile",
    description: "A daily routine interface that adapts recommendations to weather and skin context.",
    image: "/assets/images/work/skincare-planner.jpg",
    href: "/explorations/weather-skincare",
    format: "Mobile",
    year: "2024",
    tags: ["Wellness", "Routine", "Forecast"],
  },
  {
    title: "Execution Planning System",
    category: "Web App",
    description: "Goal, week, and review loops shaped into one execution workspace.",
    image: "/assets/images/work/execution-system.jpg",
    href: "/explorations/personal-execution-system",
    format: "Desktop",
    year: "2025",
    tags: ["Planning", "Goals", "Review"],
  },
  {
    title: "Design Tokens Workspace",
    category: "Systems",
    description: "Token, component, and template foundations for repeatable production.",
    image: "/assets/images/work/design-tokens.jpg",
    href: "/work/email-builder",
    format: "System",
    year: "2024",
    tags: ["Tokens", "Templates", "Email"],
  },
]

function FormatIcon({ format }: { format: Shot["format"] }) {
  if (format === "Mobile") {
    return <IconDeviceMobile size={13} strokeWidth={1.8} aria-hidden="true" />
  }

  if (format === "System") {
    return <IconLayoutDashboard size={13} strokeWidth={1.8} aria-hidden="true" />
  }

  return <IconDeviceDesktop size={13} strokeWidth={1.8} aria-hidden="true" />
}

function ShotCard({
  shot,
  priority,
  onOpen,
}: {
  shot: Shot
  priority?: boolean
  onOpen: (shot: Shot) => void
}) {
  return (
    <article className="group">
      <button
        type="button"
        onClick={() => onOpen(shot)}
        className="block w-full text-left focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-4 focus-visible:ring-offset-background"
        aria-label={`Open ${shot.title} preview`}
      >
        <div className="relative aspect-[4/3] overflow-hidden rounded-2xl bg-muted shadow-[var(--shadow-sm)]">
          <Image
            src={shot.image}
            alt=""
            fill
            priority={priority}
            sizes="(min-width: 1280px) 25vw, (min-width: 768px) 33vw, 100vw"
            className="object-cover transition-transform duration-700 ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:scale-[1.045]"
          />

          <div className="absolute inset-0 bg-gradient-to-t from-black/78 via-black/16 to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100" />

          <div className="absolute left-3 top-3 flex items-center gap-1.5 rounded-full border border-white/15 bg-black/35 px-2.5 py-1 text-[11px] font-medium text-white/86 opacity-0 backdrop-blur transition-opacity duration-300 group-hover:opacity-100">
            <FormatIcon format={shot.format} />
            {shot.format}
          </div>

          <div className="absolute right-3 top-3 flex gap-2 opacity-0 transition-opacity duration-300 group-hover:opacity-100">
            <span className="grid h-9 w-9 place-items-center rounded-full bg-white text-neutral-950 shadow-[0_8px_22px_rgba(0,0,0,0.24)]">
              <IconBookmark size={15} strokeWidth={2} aria-hidden="true" />
            </span>
            <span className="grid h-9 w-9 place-items-center rounded-full bg-white text-neutral-950 shadow-[0_8px_22px_rgba(0,0,0,0.24)]">
              <IconMaximize size={15} strokeWidth={2} aria-hidden="true" />
            </span>
          </div>

          <div className="absolute inset-x-0 bottom-0 translate-y-2 p-4 opacity-0 transition-all duration-300 group-hover:translate-y-0 group-hover:opacity-100">
            <h2 className="text-base font-semibold leading-tight text-white">{shot.title}</h2>
            <p className="mt-1 line-clamp-2 max-w-[32ch] text-xs leading-5 text-white/72">
              {shot.description}
            </p>
            <div className="mt-3 flex flex-wrap gap-1.5">
              {shot.tags.slice(0, 3).map((tag) => (
                <span
                  key={tag}
                  className="rounded-full border border-white/14 bg-white/10 px-2 py-1 text-[10px] font-medium text-white/78 backdrop-blur"
                >
                  {tag}
                </span>
              ))}
            </div>
          </div>
        </div>
      </button>

      <div className="mt-3 flex items-center justify-between gap-3 px-1">
        <div className="min-w-0">
          <h3 className="truncate text-sm font-semibold leading-5 text-foreground">{shot.title}</h3>
          <p className="text-xs text-muted-foreground">
            {shot.category} / {shot.year}
          </p>
        </div>

        <p className="shrink-0 text-xs font-medium text-muted-foreground">{shot.format}</p>
      </div>
    </article>
  )
}

export function UiDesignGallery() {
  const [activeCategory, setActiveCategory] = useState<ShotCategory>("All")
  const [selectedShot, setSelectedShot] = useState<Shot | null>(null)

  const filteredShots = useMemo(() => {
    if (activeCategory === "All") return SHOTS
    return SHOTS.filter((shot) => shot.category === activeCategory)
  }, [activeCategory])
  const featuredShot = SHOTS.find((shot) => shot.featured) ?? SHOTS[0]

  useEffect(() => {
    if (!selectedShot) return

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") setSelectedShot(null)
    }

    document.addEventListener("keydown", onKeyDown)
    const previousBodyOverflow = document.body.style.overflow
    const previousRootOverflow = document.documentElement.style.overflow
    document.body.style.overflow = "hidden"
    document.documentElement.style.overflow = "hidden"

    return () => {
      document.removeEventListener("keydown", onKeyDown)
      document.body.style.overflow = previousBodyOverflow
      document.documentElement.style.overflow = previousRootOverflow
    }
  }, [selectedShot])

  return (
    <div className="bg-background text-foreground">
      <section className="bg-canvas-gallery relative overflow-hidden border-b border-border pt-32 md:pt-36">
        <div aria-hidden className="pointer-events-none absolute inset-0">
          <AsciiFlowBackground opacity={0.85} cellSize={10} speed={0.8} />
          <div className="absolute inset-x-0 bottom-0 h-32 bg-gradient-to-t from-background to-transparent" />
        </div>

        <div className="relative mx-auto max-w-7xl px-5 pb-10 md:px-6 md:pb-14">
          <div className="grid gap-8 lg:grid-cols-[minmax(0,0.82fr)_minmax(420px,0.78fr)] lg:items-start">
            <div className="relative isolate overflow-hidden rounded-3xl border border-white/40 bg-white/25 p-6 shadow-[0_8px_32px_-8px_rgba(0,0,0,0.25),inset_0_1px_0_0_rgba(255,255,255,0.7),inset_0_0_0_1px_rgba(255,255,255,0.12)] backdrop-blur-xl backdrop-saturate-150 md:p-8 lg:max-w-sm lg:justify-self-start dark:border-white/15 dark:bg-white/[0.07] dark:shadow-[0_14px_44px_-10px_rgba(0,0,0,0.65),inset_0_1px_0_0_rgba(255,255,255,0.22),inset_0_0_0_1px_rgba(255,255,255,0.06)]">
              <div
                aria-hidden
                className="pointer-events-none absolute inset-0 rounded-3xl bg-gradient-to-br from-white/30 via-white/5 to-transparent opacity-80 dark:from-white/12 dark:via-transparent dark:opacity-70"
              />
              <div className="relative">
                <h3 className="max-w-4xl text-balance text-2xl font-bold leading-[1.05] tracking-normal text-foreground md:text-4xl">
                  Browse the interface board.
                </h3>
                <p className="mt-5 max-w-2xl text-[15px] leading-7 text-muted-foreground md:text-base">
                  A visual-first collection of app screens, systems, commerce flows, and mobile concepts.
                </p>
              </div>
            </div>

            <button
              type="button"
              onClick={() => setSelectedShot(featuredShot)}
              className="group relative block aspect-[4/3] overflow-hidden rounded-3xl border border-border bg-card text-left shadow-[var(--shadow-md)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-4 focus-visible:ring-offset-background"
              aria-label={`Open featured design: ${featuredShot.title}`}
            >
              <Image
                src={featuredShot.image}
                alt=""
                fill
                priority
                sizes="(min-width: 1024px) 44vw, 100vw"
                className="object-cover transition-transform duration-700 ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:scale-[1.035]"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/82 via-black/22 to-transparent" />
              <div className="absolute left-4 top-4 flex items-center gap-1.5 rounded-full border border-white/15 bg-black/35 px-2.5 py-1 text-[11px] font-medium text-white/86 backdrop-blur">
                <FormatIcon format={featuredShot.format} />
                Featured design
              </div>
              <div className="absolute right-4 top-4 grid h-10 w-10 place-items-center rounded-full bg-white text-neutral-950 shadow-[0_10px_26px_rgba(0,0,0,0.28)]">
                <IconMaximize size={16} strokeWidth={2} aria-hidden="true" />
              </div>
              <div className="absolute inset-x-0 bottom-0 p-5 md:p-6">
                <p className="mb-2 font-mono text-[10px] font-semibold uppercase tracking-[0.16em] text-white/56">
                  {featuredShot.category} / {featuredShot.year}
                </p>
                <h2 className="max-w-xl text-2xl font-semibold leading-tight text-white md:text-3xl">
                  {featuredShot.title}
                </h2>
                <p className="mt-2 max-w-xl text-sm leading-6 text-white/70">
                  {featuredShot.description}
                </p>
                <div className="mt-4 flex flex-wrap gap-2">
                  {featuredShot.tags.map((tag) => (
                    <span
                      key={tag}
                      className="rounded-full border border-white/14 bg-white/10 px-2.5 py-1 text-[11px] font-medium text-white/76 backdrop-blur"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
            </button>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-5 py-8 md:px-6 md:py-10">
        <div className="mb-7 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div className="flex flex-wrap gap-2" aria-label="Shot filters">
            {CATEGORIES.map((category) => (
              <button
                key={category}
                type="button"
                onClick={() => setActiveCategory(category)}
                className={clsx(
                  "h-10 rounded-full border px-4 text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2 focus-visible:ring-offset-background",
                  activeCategory === category
                    ? "border-accent bg-accent text-white dark:text-neutral-950"
                    : "border-border bg-card text-muted-foreground hover:bg-muted hover:text-foreground"
                )}
              >
                {category}
              </button>
            ))}
          </div>

          <p className="text-sm font-medium text-muted-foreground">
            {filteredShots.length} {filteredShots.length === 1 ? "shot" : "shots"}
          </p>
        </div>

        <div className="grid gap-x-6 gap-y-10 md:grid-cols-2 xl:grid-cols-3">
          {filteredShots.map((shot) => (
            <ShotCard
              key={shot.title}
              shot={shot}
              onOpen={setSelectedShot}
            />
          ))}
        </div>
      </section>

      {selectedShot && typeof document !== "undefined" ? createPortal(
        <div
          role="dialog"
          aria-modal="true"
          aria-labelledby="gallery-preview-title"
          className="fixed inset-0 z-[80] flex items-center justify-center p-3 sm:p-5"
        >
          <button
            type="button"
            className="absolute inset-0 bg-black/78 backdrop-blur-md"
            aria-label="Close preview"
            onClick={() => setSelectedShot(null)}
          />

          <div className="relative grid max-h-[92vh] w-full max-w-6xl overflow-hidden rounded-3xl border border-white/10 bg-neutral-950 shadow-[0_32px_120px_rgba(0,0,0,0.72)] lg:grid-cols-[minmax(0,1fr)_320px]">
            <div className="relative min-h-[52vh] bg-black lg:min-h-[78vh]">
              <Image
                src={selectedShot.image}
                alt=""
                fill
                priority
                sizes="(min-width: 1024px) 70vw, 100vw"
                className="object-contain"
              />
            </div>

            <aside className="border-t border-white/10 bg-neutral-950 p-5 text-white lg:border-l lg:border-t-0 lg:p-6">
              <div className="mb-5 flex items-start justify-between gap-4">
                <div>
                  <p className="mb-2 font-mono text-[10px] font-semibold uppercase tracking-[0.16em] text-white/45">
                    {selectedShot.category} / {selectedShot.year}
                  </p>
                  <h2 id="gallery-preview-title" className="text-xl font-semibold leading-tight">
                    {selectedShot.title}
                  </h2>
                </div>

                <button
                  type="button"
                  onClick={() => setSelectedShot(null)}
                  aria-label="Close preview"
                  className="grid h-10 w-10 shrink-0 place-items-center rounded-full border border-white/12 bg-white/8 text-white transition hover:bg-white/14 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent"
                >
                  <IconX size={18} strokeWidth={2} aria-hidden="true" />
                </button>
              </div>

              <p className="text-sm leading-6 text-white/68">{selectedShot.description}</p>

              <div className="mt-5 flex flex-wrap gap-2">
                {selectedShot.tags.map((tag) => (
                  <span
                    key={tag}
                    className="rounded-full border border-white/12 bg-white/7 px-2.5 py-1 text-[11px] font-medium text-white/70"
                  >
                    {tag}
                  </span>
                ))}
              </div>

              <div className="mt-7 overflow-hidden rounded-2xl border border-white/10 p-4">
                <p className="mb-1 text-xs text-white/45">Format</p>
                <p className="inline-flex items-center gap-1.5 text-sm font-semibold text-white">
                  <FormatIcon format={selectedShot.format} />
                  {selectedShot.format}
                </p>
              </div>
            </aside>
          </div>
        </div>,
        document.body,
      ) : null}
    </div>
  )
}
