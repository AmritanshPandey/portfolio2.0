"use client"

import Image from "next/image"
import type { ReactNode } from "react"
import clsx from "clsx"

export type FullBleedCopyMode = "overlay" | "outside"
export type FullBleedCopyPlacement = "top" | "bottom"
export type FullBleedTypography = "article" | "case" | "page"
export type FullBleedAspect = "screen" | "16/9" | "16/10" | "4/3"
export type FullBleedFit = "cover" | "contain"
export type FullBleedAlign = "left" | "center"

export interface FullBleedBlockProps {
  src: string
  alt: string
  caption?: ReactNode
  source?: ReactNode
  eyebrow?: ReactNode
  title?: ReactNode
  subtitle?: ReactNode
  body?: ReactNode
  copyMode?: FullBleedCopyMode
  copyPlacement?: FullBleedCopyPlacement
  typography?: FullBleedTypography
  aspect?: FullBleedAspect
  fit?: FullBleedFit
  align?: FullBleedAlign
  priority?: boolean
  className?: string
}

const ASPECT_CLASS: Record<FullBleedAspect, string> = {
  screen: "min-h-[460px] md:min-h-[580px] lg:min-h-[680px]",
  "16/9": "aspect-video",
  "16/10": "aspect-[16/10]",
  "4/3": "aspect-[4/3]",
}

const FIT_CLASS: Record<FullBleedFit, string> = {
  cover: "object-cover",
  contain: "object-contain",
}

const TITLE_CLASS: Record<FullBleedTypography, string> = {
  article: "text-[28px] font-semibold leading-[1.14] md:text-[38px]",
  case: "type-case-title",
  page: "type-section-title",
}

const BODY_CLASS: Record<FullBleedTypography, string> = {
  article: "text-[15px] leading-[1.8] md:text-[17px]",
  case: "type-section-intro",
  page: "type-section-intro",
}

function BodyText({
  body,
  className,
}: {
  body: ReactNode
  className: string
}) {
  if (typeof body !== "string") {
    return <div className={className}>{body}</div>
  }

  const paragraphs = body.split("\n\n").filter(Boolean)

  return (
    <div className={clsx(className, "space-y-3")}>
      {paragraphs.map((paragraph, index) => (
        <p key={index}>{paragraph}</p>
      ))}
    </div>
  )
}

function CopyBlock({
  eyebrow,
  title,
  subtitle,
  body,
  typography,
  align,
  overlay,
}: {
  eyebrow?: ReactNode
  title?: ReactNode
  subtitle?: ReactNode
  body?: ReactNode
  typography: FullBleedTypography
  align: FullBleedAlign
  overlay: boolean
}) {
  if (!eyebrow && !title && !subtitle && !body) return null

  return (
    <div
      className={clsx(
        "max-w-[720px]",
        align === "center" ? "mx-auto text-center" : "text-left",
        overlay ? "text-white" : "text-foreground"
      )}
    >
      {eyebrow && (
        <p
          className="type-meta mb-3"
          style={{ color: overlay ? "rgba(255,255,255,0.68)" : "color-mix(in srgb, var(--foreground) 45%, transparent)" }}
        >
          {eyebrow}
        </p>
      )}
      {title && (
        <h2 className={clsx(TITLE_CLASS[typography], overlay ? "text-white" : "text-foreground")}>
          {title}
        </h2>
      )}
      {subtitle && (
        <p
          className={clsx(
            "type-subtitle mt-4",
            overlay ? "text-white/82" : "text-muted-foreground"
          )}
        >
          {subtitle}
        </p>
      )}
      {body && (
        <BodyText
          body={body}
          className={clsx(
            BODY_CLASS[typography],
            title || subtitle ? "mt-5" : undefined,
            align === "center" ? "mx-auto" : undefined,
            overlay ? "text-white/76" : "text-muted-foreground"
          )}
        />
      )}
    </div>
  )
}

export function FullBleedBlock({
  src,
  alt,
  caption,
  source,
  eyebrow,
  title,
  subtitle,
  body,
  copyMode = "overlay",
  copyPlacement = "bottom",
  typography = "case",
  aspect = "16/9",
  fit = "cover",
  align = "left",
  priority = false,
  className,
}: FullBleedBlockProps) {
  if (!src) return null

  const hasCopy = Boolean(eyebrow || title || subtitle || body)
  const isOverlay = copyMode === "overlay" && hasCopy
  const copy = (
    <CopyBlock
      eyebrow={eyebrow}
      title={title}
      subtitle={subtitle}
      body={body}
      typography={typography}
      align={align}
      overlay={copyMode === "overlay"}
    />
  )

  return (
    <figure className={clsx("my-12", className)}>
      {copyMode === "outside" && copyPlacement === "top" && (
        <div className="mx-auto mb-6 max-w-[820px] px-6 md:mb-8">
          {copy}
        </div>
      )}

      <div
        className={clsx(
          "relative isolate w-full overflow-hidden rounded-2xl border border-border/30 bg-muted/20 dark:bg-white/[0.03]",
          ASPECT_CLASS[aspect]
        )}
      >
        <Image
          src={src}
          alt={alt}
          fill
          priority={priority}
          sizes="100vw"
          className={clsx(FIT_CLASS[fit], fit === "contain" && "p-4 md:p-6")}
        />

        {isOverlay && (
          <>
            <div
              aria-hidden
              className={clsx(
                "absolute inset-x-0 z-10 h-2/3",
                copyPlacement === "top"
                  ? "top-0 bg-gradient-to-b from-black/78 via-black/46 to-transparent"
                  : "bottom-0 bg-gradient-to-t from-black/82 via-black/48 to-transparent"
              )}
            />
            <div
              className={clsx(
                "absolute inset-x-0 z-20 px-5 py-6 md:px-8 md:py-8 lg:px-10 lg:py-10",
                copyPlacement === "top" ? "top-0" : "bottom-0"
              )}
            >
              {copy}
            </div>
          </>
        )}
      </div>

      {copyMode === "outside" && copyPlacement === "bottom" && (
        <div className="mx-auto mt-6 max-w-[820px] px-6 md:mt-8">
          {copy}
        </div>
      )}

      {(caption || source) && (
        <figcaption className="mt-3 px-6 text-center type-caption text-muted-foreground">
          {caption}
          {source && <span className="ml-2 opacity-60">· {source}</span>}
        </figcaption>
      )}
    </figure>
  )
}
