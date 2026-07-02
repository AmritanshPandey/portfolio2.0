"use client"

import { motion } from "framer-motion"
import clsx from "clsx"

import {
  ImageLayout,
  type ImageAspect,
  type ImageFit,
  type ImageItem,
  type ImageLayoutVariant,
} from "@/components/shared/image-layout"
import { EASE, DURATION, RISE } from "@/lib/motion"

type Variant = "default" | "muted" | "dark"
type Placement = "below" | "left" | "right"
type Gap = "sm" | "md" | "lg"

export type CsMediaTextLayout = Extract<
  ImageLayoutVariant,
  "single" | "2-row" | "2-col" | "3-featured" | "2x2" | "bento"
>

export interface CsMediaTextMedia {
  layout: CsMediaTextLayout
  images: ImageItem[]
  caption?: string
  gap?: Gap
  fit?: ImageFit
  aspect?: ImageAspect
}

export interface CsMediaTextSectionProps {
  eyebrow?: string
  heading: string
  body?: string | string[]
  placement?: Placement
  variant?: Variant
  media: CsMediaTextMedia
  id?: string
  className?: string
}

const BG: Record<Variant, string> = {
  default: "bg-canvas-default text-foreground",
  muted:   "bg-canvas-muted text-foreground",
  dark:    "bg-canvas-accent text-foreground",
}

const EDGE_LINE = "bg-black/[0.05] dark:bg-white/[0.06]"
const EDGE_HIGHLIGHT = "bg-white/30 dark:bg-white/[0.02]"

function normalizeBody(body: CsMediaTextSectionProps["body"]) {
  if (!body) return []
  return (Array.isArray(body) ? body : [body]).filter((paragraph) => paragraph.trim().length > 0)
}

export function CsMediaTextSection({
  eyebrow,
  heading,
  body,
  placement = "below",
  variant = "default",
  media,
  id,
  className,
}: CsMediaTextSectionProps) {
  const paragraphs = normalizeBody(body)
  const isSideBySide = placement !== "below"

  const copy = (
    <div
      className={clsx(
        "min-w-0",
        isSideBySide ? "lg:max-w-[430px]" : "max-w-[720px]",
        placement === "left" && "lg:order-2",
        placement === "right" && "lg:order-1"
      )}
    >
      {eyebrow && (
        <p className="mb-4 font-mono text-[10px] font-semibold uppercase tracking-[0.16em] text-accent">
          {eyebrow}
        </p>
      )}
      <h2 className="type-case-title text-foreground">{heading}</h2>
      {paragraphs.length > 0 && (
        <div className="mt-5 space-y-4">
          {paragraphs.map((paragraph, index) => (
            <p key={index} className="type-section-intro text-muted-foreground">
              {paragraph}
            </p>
          ))}
        </div>
      )}
    </div>
  )

  const mediaBlock = (
    <div
      className={clsx(
        "min-w-0",
        placement === "left" && "lg:order-1",
        placement === "right" && "lg:order-2"
      )}
    >
      <ImageLayout
        layout={media.layout}
        images={media.images}
        caption={media.caption}
        gap={media.gap}
        fit={media.fit}
        aspect={media.aspect}
        className="my-0"
      />
    </div>
  )

  return (
    <section
      id={id}
      className={clsx(
        "relative w-full overflow-hidden transition-colors duration-300",
        id && "scroll-mt-24",
        BG[variant],
        className
      )}
    >
      <div aria-hidden className={clsx("pointer-events-none absolute inset-x-0 top-0 h-px", EDGE_LINE)} />
      <div aria-hidden className={clsx("pointer-events-none absolute inset-x-0 top-px h-px", EDGE_HIGHLIGHT)} />

      <div
        className={clsx(
          "relative mx-auto px-6 py-20 md:py-24",
          isSideBySide ? "max-w-[1160px]" : "max-w-[920px]"
        )}
      >
        <motion.div
          initial={{ opacity: 0, y: RISE }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-60px" }}
          transition={{ duration: DURATION.base, ease: EASE }}
          className={clsx(
            "min-w-0",
            isSideBySide
              ? clsx(
                  "grid gap-10 lg:items-center lg:gap-14",
                  placement === "left"
                    ? "lg:grid-cols-[minmax(0,1.12fr)_minmax(0,0.88fr)]"
                    : "lg:grid-cols-[minmax(0,0.88fr)_minmax(0,1.12fr)]"
                )
              : "flex flex-col gap-10"
          )}
        >
          {copy}
          {mediaBlock}
        </motion.div>
      </div>

      <div className={clsx("absolute bottom-0 left-0 h-px w-full", EDGE_LINE)} />
    </section>
  )
}
