"use client"

import Image from "next/image"
import { useState } from "react"
import { AnimatePresence, motion } from "framer-motion"
import { IconArrowUpRight } from "@tabler/icons-react"
import type { ReactNode } from "react"

import { cn } from "@/lib/utils"
import { EASE } from "@/lib/motion"
import { IphoneFrame } from "@/components/shared/iphone-frame"

/**
 * A feature list paired with a device mockup — heading + supporting copy over a
 * stack of tappable feature rows on one side, an <IphoneFrame> on the other.
 *
 * The rows are interactive: clicking one promotes it and swaps the screen shown
 * on the phone (each feature carries its own `src`). The selected row reads as
 * "the live screen" via the accent ring; the image crossfades on change. Mark a
 * feature `active` to choose which one is selected on first paint.
 *
 * Tokens only (bg-card / border / accent) so it sits inside the design system;
 * set `reverse` to put the phone on the left.
 */

export interface PhoneFeature {
  title: string
  description?: string
  /** Screen shown on the device when this row is selected. */
  src?: string
  alt?: string
  /** Select this row on first paint. First match wins; defaults to the first row. */
  active?: boolean
}

export interface CsPhoneFeaturesProps {
  eyebrow?: string
  title: string
  description?: string
  features: PhoneFeature[]
  /** Fallback screen when the selected feature has no `src`. */
  src?: string
  alt?: string
  /** Live screen content (video, iframe, component) — shown when no image resolves. */
  children?: ReactNode
  variant?: "black" | "white"
  /** Put the phone on the left instead of the right. */
  reverse?: boolean
  className?: string
}

function FeatureRow({
  feature,
  index,
  active,
  onSelect,
}: {
  feature: PhoneFeature
  index: number
  active: boolean
  onSelect: () => void
}) {
  const { title, description } = feature

  return (
    <motion.button
      type="button"
      onClick={onSelect}
      aria-pressed={active}
      data-cursor-card
      data-cursor-label="View"
      initial={{ opacity: 0, y: 12 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-60px" }}
      transition={{ duration: 0.45, delay: index * 0.07, ease: EASE }}
      className={cn(
        "group/row flex w-full items-center justify-between gap-4 rounded-2xl border px-5 py-4 text-left",
        "transition-[transform,border-color,background-color] duration-300 ease-[cubic-bezier(0.22,1,0.36,1)]",
        "outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2 focus-visible:ring-offset-background",
        active
          ? "border-accent/30 bg-accent/[0.08]"
          : "border-border/60 bg-card hover:border-border motion-safe:hover:-translate-y-0.5"
      )}
    >
      <div className="min-w-0">
        <p className="text-[15px] font-medium leading-snug text-foreground">{title}</p>
        {description && (
          <p className="mt-1 text-[13px] leading-relaxed text-muted-foreground">{description}</p>
        )}
      </div>

      {active ? (
        // A live status dot — reads as "this screen is showing now". One soft,
        // slow pulse (not a spinner, which reads as loading).
        <span
          aria-hidden
          className="grid size-9 shrink-0 place-items-center rounded-full bg-accent/[0.1] ring-1 ring-accent/25"
        >
          <span className="relative flex size-2.5 items-center justify-center">
            <span className="absolute inline-flex size-2.5 rounded-full bg-accent/50 motion-safe:animate-ping [animation-duration:2.4s]" />
            <span className="relative inline-flex size-1.5 rounded-full bg-accent" />
          </span>
        </span>
      ) : (
        <span
          aria-hidden
          className="grid size-9 shrink-0 place-items-center rounded-full border border-border/70 text-muted-foreground transition-colors duration-300 group-hover/row:border-foreground/40 group-hover/row:text-foreground"
        >
          <IconArrowUpRight className="size-4" />
        </span>
      )}
    </motion.button>
  )
}

export function CsPhoneFeatures({
  eyebrow,
  title,
  description,
  features,
  src,
  alt,
  children,
  variant = "black",
  reverse = false,
  className,
}: CsPhoneFeaturesProps) {
  const defaultIndex = features.findIndex((f) => f.active)
  const [activeIndex, setActiveIndex] = useState(defaultIndex >= 0 ? defaultIndex : 0)

  const activeFeature = features[activeIndex]
  const screenSrc = activeFeature?.src ?? src
  const screenAlt = activeFeature?.alt ?? alt ?? ""

  return (
    <div
      className={cn(
        "grid items-center gap-10 md:grid-cols-2 md:gap-14",
        reverse && "md:[&>*:first-child]:order-last",
        className
      )}
    >
      {/* Text + feature list */}
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-80px" }}
        transition={{ duration: 0.55, ease: EASE }}
      >
        {eyebrow && (
          <p className="mb-4 text-[11px] font-mono font-medium uppercase tracking-[0.14em] text-muted-foreground">
            {eyebrow}
          </p>
        )}
        <h3 className="text-[clamp(26px,2.6vw,38px)] font-semibold leading-[1.1] tracking-tight text-foreground">
          {title}
        </h3>
        {description && (
          <p className="mt-3 max-w-[42ch] text-[15px] leading-relaxed text-muted-foreground">
            {description}
          </p>
        )}

        <div className="mt-8 flex flex-col gap-3">
          {features.map((feature, i) => (
            <FeatureRow
              key={i}
              feature={feature}
              index={i}
              active={i === activeIndex}
              onSelect={() => setActiveIndex(i)}
            />
          ))}
        </div>
      </motion.div>

      {/* Device */}
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-80px" }}
        transition={{ duration: 0.6, delay: 0.1, ease: EASE }}
        className="flex justify-center md:justify-end"
      >
        <IphoneFrame className="w-[280px]" variant={variant}>
          {screenSrc ? (
            <AnimatePresence mode="wait" initial={false}>
              <motion.div
                key={screenSrc}
                initial={{ opacity: 0, scale: 1.03 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.99 }}
                transition={{ duration: 0.4, ease: EASE }}
                className="absolute inset-0"
              >
                <Image
                  src={screenSrc}
                  alt={screenAlt}
                  fill
                  sizes="(max-width: 768px) 80vw, 280px"
                  className="object-cover"
                />
              </motion.div>
            </AnimatePresence>
          ) : (
            children
          )}
        </IphoneFrame>
      </motion.div>
    </div>
  )
}
