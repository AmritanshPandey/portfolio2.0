"use client"

import type { ReactNode } from "react"
import { motion } from "framer-motion"
import clsx from "clsx"

import { EASE, DURATION, STAGGER, RISE } from "@/lib/motion"
import { Pill } from "@/components/shared/pill"

// ─── Types ───────────────────────────────────────────────────────────────────

export interface ImageItem {
  /** Image source. Omit on a bento cell to render a text card instead. */
  src?: string
  alt?: string
  caption?: string
  /** How the image sits inside a fixed-aspect frame. */
  fit?: ImageFit
  /** Aspect ratio for this image cell. Use "auto" to preserve natural height. */
  aspect?: ImageAspect
  /** Bento only — columns this cell spans within a 3-col grid (default 1) */
  colSpan?: 1 | 2 | 3
  /** Bento only — rows this cell spans (default 1) */
  rowSpan?: 1 | 2
  /** Bento text card — heading. Renders a text cell when `src` is omitted. */
  title?: string
  /** Bento text card — supporting copy. */
  body?: string
  /** Bento text card — pill tags shown above the title. */
  pills?: string[]
}

/** True when a cell carries any overlay copy (title / body / pills). */
const hasContent = (item: ImageItem) =>
  !!item.title || !!item.body || (item.pills?.length ?? 0) > 0

/** A bento cell with no image but some text/pills renders as a plain text card. */
const isTextCell = (item: ImageItem) => !item.src && hasContent(item)

export type ImageLayoutVariant =
  | "single"        // one full-width image
  | "2-col"         // two side by side
  | "2-row"         // two stacked
  | "3-col"         // three equal columns
  | "3-featured"    // one wide left + two stacked right
  | "2x2"           // four balanced cells
  | "bento"         // free-span grid, driven by colSpan / rowSpan on each item

type Gap = "sm" | "md" | "lg"
export type ImageFit = "cover" | "contain"
export type ImageAspect = "auto" | "16/10" | "16/9" | "4/3" | "3/2" | "1/1"

export interface ImageLayoutProps {
  layout: ImageLayoutVariant
  images: ImageItem[]
  /** Caption below the whole group */
  caption?: string
  gap?: Gap
  /** Default image fit for fixed-aspect cells. Per-image `fit` wins. */
  fit?: ImageFit
  /** Default aspect for image cells. Per-image `aspect` wins. */
  aspect?: ImageAspect
  className?: string
}

// ─── Constants ────────────────────────────────────────────────────────────────

const GAP_CLASS: Record<Gap, string> = {
  sm: "gap-1.5",
  md: "gap-3",
  lg: "gap-5",
}

// `group` + hover affordances live on the frame: the image lifts slightly and
// its border warms while the picture inside scales up a touch. Transforms are
// gated to motion-safe so reduced-motion users get only the calm border shift.
const CELL_BASE =
  "group relative overflow-hidden rounded-xl border border-border/30 bg-muted/20 dark:bg-white/[0.03] transition-[border-color,transform,box-shadow] duration-500 ease-out hover:border-border/55 motion-safe:hover:-translate-y-0.5"

// The slow, signature zoom on hover — the one premium tell on every image.
const IMG_ZOOM =
  "transition-transform duration-[800ms] ease-[cubic-bezier(0.22,1,0.36,1)] will-change-transform motion-safe:group-hover:scale-[1.045]"

const ASPECT_CLASS: Record<ImageAspect, string> = {
  auto: "",
  "16/10": "aspect-[16/10]",
  "16/9": "aspect-video",
  "4/3": "aspect-[4/3]",
  "3/2": "aspect-[3/2]",
  "1/1": "aspect-square",
}

const FIT_CLASS: Record<ImageFit, string> = {
  cover: "object-cover",
  contain: "object-contain",
}

// ─── Shared primitives ─────────────────────────────────────────────────────────

/** A scroll-reveal figure with a clean, per-index stagger. Reduced motion is
 *  honoured globally by <MotionConfig reducedMotion="user"> in layout.tsx. */
function RevealFigure({
  index = 0,
  className,
  children,
}: {
  index?: number
  className?: string
  children: ReactNode
}) {
  return (
    <motion.figure
      initial={{ opacity: 0, y: RISE }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-60px" }}
      transition={{ duration: DURATION.base, delay: index * STAGGER, ease: EASE }}
      className={className}
    >
      {children}
    </motion.figure>
  )
}

/** The single image element — framed (absolute fill) or inline (auto height),
 *  always carrying the hover zoom so every layout shares one look. */
function Img({
  item,
  framed,
  fit,
}: {
  item: ImageItem
  framed: boolean
  fit: ImageFit
}) {
  return (
    // eslint-disable-next-line @next/next/no-img-element
    <img
      src={item.src}
      alt={item.alt ?? ""}
      loading="lazy"
      decoding="async"
      className={clsx(
        IMG_ZOOM,
        framed
          ? ["absolute inset-0 h-full w-full", FIT_CLASS[fit]]
          : "relative block h-auto w-full"
      )}
    />
  )
}

// ─── Shared cell ─────────────────────────────────────────────────────────────

/**
 * A single image cell.
 * When `fill` is true the image fills its container absolutely — use this
 * whenever the parent defines the height (featured layout, bento row-span).
 * When aspect is "auto" and `fill` is false, the image sits inline and the
 * container grows with it.
 */
function Cell({
  item,
  index = 0,
  fill = false,
  fit = "cover",
  aspect = "3/2",
  captionAlign = "left",
  className,
}: {
  item: ImageItem
  index?: number
  fill?: boolean
  fit?: ImageFit
  aspect?: ImageAspect
  captionAlign?: "left" | "center"
  className?: string
}) {
  const resolvedFit = item.fit ?? fit
  const resolvedAspect = item.aspect ?? aspect
  const isFramed = fill || resolvedAspect !== "auto"

  return (
    <RevealFigure
      index={index}
      className={clsx("flex min-h-0 flex-col gap-2", fill && "h-full", className)}
    >
      <div className={clsx(CELL_BASE, fill ? "flex-1 min-h-0" : ASPECT_CLASS[resolvedAspect])}>
        <Img item={item} framed={isFramed} fit={resolvedFit} />
      </div>

      {item.caption && (
        <figcaption
          className={clsx(
            "shrink-0 text-[12px] leading-snug text-muted-foreground",
            captionAlign === "center" ? "text-center" : "text-left"
          )}
        >
          {item.caption}
        </figcaption>
      )}
    </RevealFigure>
  )
}

// ─── Layout variants ─────────────────────────────────────────────────────────

function Single({
  images,
  fit,
  aspect,
}: {
  images: ImageItem[]
  fit: ImageFit
  aspect: ImageAspect
}) {
  const img = images[0]
  if (!img) return null

  const resolvedAspect = img.aspect ?? aspect
  const resolvedFit = img.fit ?? fit
  const isFramed = resolvedAspect !== "auto"

  return (
    <RevealFigure className="w-full">
      <div className={clsx(CELL_BASE, ASPECT_CLASS[resolvedAspect])}>
        <Img item={img} framed={isFramed} fit={resolvedFit} />
      </div>
      {img.caption && (
        <figcaption className="mt-2.5 flex items-start gap-1.5 text-[12px] text-muted-foreground">
          <span className="shrink-0 text-accent">↑</span>
          {img.caption}
        </figcaption>
      )}
    </RevealFigure>
  )
}

function TwoCol({
  images,
  gap,
  fit,
  aspect,
}: {
  images: ImageItem[]
  gap: Gap
  fit: ImageFit
  aspect: ImageAspect
}) {
  return (
    <div className={clsx("grid grid-cols-1 sm:grid-cols-2", GAP_CLASS[gap])}>
      {images.slice(0, 2).map((img, i) => (
        <Cell key={i} item={img} index={i} fit={fit} aspect={aspect} />
      ))}
    </div>
  )
}

function TwoRow({
  images,
  gap,
  fit,
  aspect,
}: {
  images: ImageItem[]
  gap: Gap
  fit: ImageFit
  aspect: ImageAspect
}) {
  return (
    <div className={clsx("flex flex-col", GAP_CLASS[gap])}>
      {images.slice(0, 2).map((img, i) => (
        <Cell key={i} item={img} index={i} fit={fit} aspect={aspect} />
      ))}
    </div>
  )
}

function ThreeCol({
  images,
  gap,
  fit,
  aspect,
}: {
  images: ImageItem[]
  gap: Gap
  fit: ImageFit
  aspect: ImageAspect
}) {
  return (
    <div className={clsx("grid grid-cols-1 sm:grid-cols-3", GAP_CLASS[gap])}>
      {images.slice(0, 3).map((img, i) => (
        <Cell key={i} item={img} index={i} fit={fit} aspect={aspect} />
      ))}
    </div>
  )
}

function TwoByTwo({
  images,
  gap,
  fit,
  aspect,
}: {
  images: ImageItem[]
  gap: Gap
  fit: ImageFit
  aspect: ImageAspect
}) {
  return (
    <div className={clsx("grid grid-cols-1 sm:grid-cols-2", GAP_CLASS[gap])}>
      {images.slice(0, 4).map((img, i) => (
        <Cell key={i} item={img} index={i} fit={fit} aspect={aspect} />
      ))}
    </div>
  )
}

function ThreeFeatured({
  images,
  gap,
  fit,
  aspect,
}: {
  images: ImageItem[]
  gap: Gap
  fit: ImageFit
  aspect: ImageAspect
}) {
  const [main, second, third] = images
  const g = GAP_CLASS[gap]
  const mainFit = main?.fit ?? fit
  const mainAspect = main?.aspect ?? aspect
  const mainAspectClass = mainAspect === "auto" ? "aspect-[4/3]" : ASPECT_CLASS[mainAspect]

  return (
    <div className={clsx("grid grid-cols-1 md:grid-cols-[2fr_1fr] md:min-h-[420px]", g)}>
      {/* Left: primary wide image */}
      {main && (
        <RevealFigure className="flex flex-col gap-2 md:h-full">
          <div className={clsx(CELL_BASE, mainAspectClass, "md:aspect-auto md:h-full md:flex-1")}>
            <Img item={main} framed fit={mainFit} />
          </div>
          {main.caption && (
            <figcaption className="shrink-0 text-[12px] text-muted-foreground">
              {main.caption}
            </figcaption>
          )}
        </RevealFigure>
      )}

      {/* Right: two images stacked */}
      <div className={clsx("flex flex-col", g)}>
        {[second, third].filter(Boolean).map((img, i) => (
          <Cell key={i} item={img!} index={i + 1} fill fit={fit} aspect={aspect} className="flex-1" />
        ))}
      </div>
    </div>
  )
}

/** Overlay copy laid over a bento image — title, body and pills pinned to the
 *  bottom-left over a dark scrim for legibility. The image still zooms behind it. */
function BentoOverlay({ item }: { item: ImageItem }) {
  return (
    <div className="pointer-events-none absolute inset-0 z-10 flex flex-col justify-end">
      {/* Scrim — keeps copy legible over any image */}
      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/35 to-transparent" />
      <div className="relative flex flex-col items-start gap-2 p-4 md:p-5">
        {item.title && (
          <p className="text-lg font-semibold leading-tight text-white md:text-xl">
            {item.title}
          </p>
        )}
        {item.body && (
          <p className="max-w-prose text-[13px] leading-relaxed text-white/80">{item.body}</p>
        )}
        {item.pills && item.pills.length > 0 && (
          <div className="flex flex-wrap gap-1.5">
            {item.pills.map((p, i) => (
              <Pill key={i} className="px-2.5 py-1 text-[11px]">
                {p}
              </Pill>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

/** A text card that sits in the bento grid beside the image cells — pills,
 *  title, body — sharing the same frame, hover lift and reveal as the images. */
function BentoText({ item }: { item: ImageItem }) {
  return (
    <div className="group flex min-h-0 flex-1 flex-col gap-2.5 rounded-xl border border-border/40 bg-card p-5 transition-[border-color,transform] duration-500 ease-out hover:border-border/60 motion-safe:hover:-translate-y-0.5">
      {item.pills && item.pills.length > 0 && (
        <div className="flex flex-wrap gap-1.5">
          {item.pills.map((p, i) => (
            <Pill key={i} className="px-2.5 py-1 text-[11px]">
              {p}
            </Pill>
          ))}
        </div>
      )}
      {item.title && (
        <p className="text-base font-semibold leading-snug text-foreground md:text-lg">
          {item.title}
        </p>
      )}
      {item.body && (
        <p className="text-[13px] leading-relaxed text-muted-foreground">{item.body}</p>
      )}
    </div>
  )
}

function Bento({ images, gap, fit }: { images: ImageItem[]; gap: Gap; fit: ImageFit }) {
  return (
    <div
      className={clsx(
        "grid grid-cols-2 md:grid-cols-3",
        "auto-rows-[160px] md:auto-rows-[200px]",
        GAP_CLASS[gap]
      )}
    >
      {images.map((img, i) => {
        const col = img.colSpan ?? 1
        const row = img.rowSpan ?? 1
        const resolvedFit = img.fit ?? fit

        // Mobile: col 3 collapses to full-width (col-span-2); col 2 stays 2-col
        const colClass =
          col === 3 ? "col-span-2 md:col-span-3" :
          col === 2 ? "col-span-2" :
          "col-span-1"

        const rowClass = row === 2 ? "row-span-2" : ""

        return (
          <RevealFigure
            key={i}
            index={i}
            className={clsx("flex min-h-0 flex-col gap-1.5", colClass, rowClass)}
          >
            {isTextCell(img) ? (
              <BentoText item={img} />
            ) : (
              <>
                <div className={clsx(CELL_BASE, "flex-1 min-h-0")}>
                  <Img item={img} framed fit={resolvedFit} />
                  {hasContent(img) && <BentoOverlay item={img} />}
                </div>
                {img.caption && (
                  <figcaption className="shrink-0 text-[11px] leading-snug text-muted-foreground">
                    {img.caption}
                  </figcaption>
                )}
              </>
            )}
          </RevealFigure>
        )
      })}
    </div>
  )
}

// ─── Main export ──────────────────────────────────────────────────────────────

export function ImageLayout({
  layout,
  images,
  caption,
  gap = "md",
  fit = "cover",
  aspect,
  className,
}: ImageLayoutProps) {
  if (!images || images.length === 0) return null

  const framedAspect = aspect ?? "3/2"
  const singleAspect = aspect ?? "auto"

  const inner = (() => {
    switch (layout) {
      case "single":       return <Single images={images} fit={fit} aspect={singleAspect} />
      case "2-col":        return <TwoCol images={images} gap={gap} fit={fit} aspect={framedAspect} />
      case "2-row":        return <TwoRow images={images} gap={gap} fit={fit} aspect={framedAspect} />
      case "3-col":        return <ThreeCol images={images} gap={gap} fit={fit} aspect={framedAspect} />
      case "3-featured":   return <ThreeFeatured images={images} gap={gap} fit={fit} aspect={framedAspect} />
      case "2x2":          return <TwoByTwo images={images} gap={gap} fit={fit} aspect={framedAspect} />
      case "bento":        return <Bento images={images} gap={gap} fit={fit} />
    }
  })()

  return (
    <div className={clsx("my-10", className)}>
      {inner}
      {caption && (
        <p className="mt-3 text-center text-[12px] text-muted-foreground">
          {caption}
        </p>
      )}
    </div>
  )
}
