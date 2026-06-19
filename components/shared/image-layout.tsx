"use client"

import clsx from "clsx"

// ─── Types ───────────────────────────────────────────────────────────────────

export interface ImageItem {
  src: string
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
}

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

const CELL_BASE =
  "relative overflow-hidden rounded-xl border border-border/30 bg-muted/20 dark:bg-white/[0.03]"

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
  fill = false,
  fit = "cover",
  aspect = "3/2",
  captionAlign = "left",
  className,
}: {
  item: ImageItem
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
    <figure className={clsx("flex min-h-0 flex-col gap-2", fill && "h-full", className)}>
      {/* Image wrapper */}
      <div
        className={clsx(
          CELL_BASE,
          fill ? "flex-1 min-h-0" : ASPECT_CLASS[resolvedAspect]
        )}
      >
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={item.src}
          alt={item.alt ?? ""}
          loading="lazy"
          decoding="async"
          className={clsx(
            isFramed
              ? ["absolute inset-0 h-full w-full", FIT_CLASS[resolvedFit]]
              : "relative block h-auto w-full"
          )}
        />
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
    </figure>
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
    <figure className="w-full">
      <div className={clsx(CELL_BASE, ASPECT_CLASS[resolvedAspect])}>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={img.src}
          alt={img.alt ?? ""}
          loading="lazy"
          decoding="async"
          className={clsx(
            isFramed
              ? ["absolute inset-0 h-full w-full", FIT_CLASS[resolvedFit]]
              : "relative block h-auto w-full"
          )}
        />
      </div>
      {img.caption && (
        <figcaption className="mt-2.5 flex items-start gap-1.5 text-[12px] text-muted-foreground">
          <span className="shrink-0 text-accent">↑</span>
          {img.caption}
        </figcaption>
      )}
    </figure>
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
        <Cell key={i} item={img} fit={fit} aspect={aspect} />
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
        <Cell key={i} item={img} fit={fit} aspect={aspect} />
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
        <Cell key={i} item={img} fit={fit} aspect={aspect} />
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
        <Cell key={i} item={img} fit={fit} aspect={aspect} />
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
        <figure className="flex flex-col gap-2 md:h-full">
          <div className={clsx(CELL_BASE, mainAspectClass, "md:aspect-auto md:h-full md:flex-1")}>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={main.src}
              alt={main.alt ?? ""}
              loading="lazy"
              decoding="async"
              className={clsx("absolute inset-0 h-full w-full", FIT_CLASS[mainFit])}
            />
          </div>
          {main.caption && (
            <figcaption className="shrink-0 text-[12px] text-muted-foreground">
              {main.caption}
            </figcaption>
          )}
        </figure>
      )}

      {/* Right: two images stacked */}
      <div className={clsx("flex flex-col", g)}>
        {[second, third].filter(Boolean).map((img, i) => (
          <Cell key={i} item={img!} fill fit={fit} aspect={aspect} className="flex-1" />
        ))}
      </div>
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
          <figure
            key={i}
            className={clsx("flex min-h-0 flex-col gap-1.5", colClass, rowClass)}
          >
            <div className={clsx(CELL_BASE, "flex-1 min-h-0")}>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={img.src}
                alt={img.alt ?? ""}
                loading="lazy"
                decoding="async"
                className={clsx("absolute inset-0 h-full w-full", FIT_CLASS[resolvedFit])}
              />
            </div>
            {img.caption && (
              <figcaption className="shrink-0 text-[11px] leading-snug text-muted-foreground">
                {img.caption}
              </figcaption>
            )}
          </figure>
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
