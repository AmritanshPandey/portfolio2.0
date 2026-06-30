"use client"

import { motion } from "framer-motion"
import type { CSSProperties, ReactNode } from "react"

import { cn } from "@/lib/utils"
import { IphoneFrame } from "@/components/shared/iphone-frame"
import { ScreenCard } from "@/components/case-study/screen-card"

/**
 * A row of 1–3 captioned screens. Two looks, set per-item or for the whole row:
 *   frame "iphone" → wraps each screen in the <IphoneFrame> device mockup
 *   frame "none"   → a bare, rounded screenshot card with a soft shadow
 *                    (a floating "UI screen" collage, no device chrome)
 *
 * Either way the screen can be cropped to bleed off-edge / show only part of the UI:
 *   crop "bottom" → reveals the TOP of the UI    (screen rises from below)
 *   crop "top"    → reveals the BOTTOM of the UI
 *   crop "none"   → the whole screen
 *
 * `reveal` (0–1) controls how much stays visible when cropped. `offsetY` (rem)
 * nudges a column down to stagger a frameless collage.
 */

export type PhoneCrop = "none" | "top" | "bottom"
export type PhoneFrame = "iphone" | "none"

export interface PhoneShowcaseItem {
  /** Small mono eyebrow above the title. */
  eyebrow?: string
  title?: string
  description?: string
  /** Screenshot to drop into the screen. Ignored if `children` are given. */
  src?: string
  alt?: string
  /** Live screen content (component, video). Wins over `src`. */
  children?: ReactNode
  /** Per-item override of the row's frame. */
  frame?: PhoneFrame
  /** Body PNG, for the iphone frame. Default "black". */
  variant?: "black" | "white"
  /** Aspect of a frameless screen, as "w/h". Defaults to the iPhone 17 screen
   *  ("1206/2622"), matching the framed device. */
  aspect?: string
  /** How the screen bleeds off-edge. Default "none". */
  crop?: PhoneCrop
  /** Fraction of the screen kept visible when cropped (0–1). Default 0.72. */
  reveal?: number
  /** Push this column down by N rem to stagger a collage. */
  offsetY?: number
  /** Extra classes on the screen layer (e.g. a letterbox bg). */
  screenClassName?: string
}

export interface CsPhoneShowcaseProps {
  /** 1 to 6 screens. Anything past 6 is dropped to keep the grid honest. */
  items: PhoneShowcaseItem[]
  /** Device mockup or bare screenshot card. Default "iphone". */
  frame?: PhoneFrame
  /** Caption alignment. Default "left". */
  align?: "left" | "center"
  /** Caption above or below the phone. Default "top". */
  captionPosition?: "top" | "bottom"
  /** Wrap each column in a subtle card surface (iphone frame only). Defaults
   *  on for "iphone", off for "none" (the screenshot is already the card). */
  card?: boolean
  className?: string
}

/** Grid template by phone count — caps at 3 columns so phone screens never go
 *  too narrow; 4–6 screens wrap onto a second row. */
function gridClass(count: number): string {
  if (count <= 1) return "mx-auto max-w-[340px]"
  if (count === 2) return "grid grid-cols-1 sm:grid-cols-2 gap-8 md:gap-10 items-start"
  return "grid grid-cols-2 md:grid-cols-3 gap-6 md:gap-8 items-start"
}

/** The iPhone device mockup, optionally cropped to bleed off-edge. */
function DeviceScreen({ item }: { item: PhoneShowcaseItem }) {
  const { crop = "none", reveal = 0.72, variant, src, alt, children, screenClassName } = item

  const frame = (
    <IphoneFrame
      className="w-full"
      variant={variant}
      src={src}
      alt={alt}
      screenClassName={screenClassName}
    >
      {children}
    </IphoneFrame>
  )

  if (crop === "none") return frame

  return (
    <div
      className="relative w-full overflow-hidden"
      style={{ aspectRatio: `1800 / ${3680 * reveal}` }}
    >
      <div className={cn("absolute inset-x-0", crop === "top" ? "bottom-0" : "top-0")}>
        {frame}
      </div>
    </div>
  )
}

export function CsPhoneShowcase({
  items,
  frame = "iphone",
  align = "left",
  card,
  captionPosition = "top",
  className,
}: CsPhoneShowcaseProps) {
  const captionBelow = captionPosition === "bottom"
  const phones = items.slice(0, 6)

  return (
    <div className={cn(gridClass(phones.length), className)}>
      {phones.map((item, i) => {
        const itemFrame = item.frame ?? frame
        const bare = itemFrame === "none"
        const showCard = card ?? !bare
        const crop = item.crop ?? "none"
        const hasCaption = item.eyebrow || item.title || item.description
        // Stagger only kicks in from md+; on mobile every column sits flush so
        // the offsets don't blow open uneven gaps in a 2-up grid.
        const offsetStyle = item.offsetY
          ? ({ "--phone-offset": `${item.offsetY}rem` } as CSSProperties)
          : undefined

        return (
          <motion.div
            key={i}
            initial={{ opacity: 0, y: 18 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-80px" }}
            transition={{ duration: 0.55, delay: i * 0.08, ease: [0.22, 1, 0.36, 1] }}
            style={offsetStyle}
            className={cn(
              "flex flex-col",
              item.offsetY && "md:mt-[var(--phone-offset)]",
              align === "center" && "items-center text-center",
              showCard
                ? cn(
                    "overflow-hidden rounded-2xl border border-border/50 bg-muted/40 px-6",
                    // Pad the non-bleeding sides; a cropped phone bleeds off the
                    // edge nearest the screen (top when caption is below).
                    captionBelow
                      ? cn(crop === "none" ? "pt-6" : "pt-0", "pb-6")
                      : cn("pt-6", crop === "none" && "pb-6")
                  )
                : "gap-5"
            )}
          >
            {(() => {
              const caption = hasCaption ? (
                <div className="flex flex-col gap-2">
                  {item.eyebrow && (
                    <p className="text-[11px] font-mono font-medium uppercase tracking-[0.14em] text-muted-foreground">
                      {item.eyebrow}
                    </p>
                  )}
                  {item.title && (
                    <h3 className="text-[clamp(20px,1.8vw,26px)] font-semibold tracking-tight leading-[1.15] text-foreground">
                      {item.title}
                    </h3>
                  )}
                  {item.description && (
                    <p className="text-[14px] leading-relaxed text-muted-foreground max-w-[40ch]">
                      {item.description}
                    </p>
                  )}
                </div>
              ) : null

              const screen = (
                <div className="w-full">
                  {bare ? (
                    <ScreenCard
                      src={item.src}
                      alt={item.alt}
                      aspect={item.aspect}
                      crop={item.crop}
                      reveal={item.reveal}
                      className={item.screenClassName}
                    >
                      {item.children}
                    </ScreenCard>
                  ) : (
                    <DeviceScreen item={item} />
                  )}
                </div>
              )

              // Spacing between the two halves: a card uses an explicit margin on
              // the second element; the bare layout relies on the parent gap-5.
              const spacer = showCard && hasCaption ? "mt-6" : undefined

              return captionBelow ? (
                <>
                  {screen}
                  {caption && <div className={spacer}>{caption}</div>}
                </>
              ) : (
                <>
                  {caption}
                  <div className={spacer}>{screen}</div>
                </>
              )
            })()}
          </motion.div>
        )
      })}
    </div>
  )
}
