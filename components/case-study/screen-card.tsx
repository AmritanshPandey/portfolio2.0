import Image from "next/image"
import type { ReactNode } from "react"

import { cn } from "@/lib/utils"

/**
 * A bare, rounded screenshot card with a soft shadow — no device chrome. The
 * shared primitive behind both <CsPhoneShowcase frame="none"> and the
 * <CsScreenWall> collage.
 *
 * Crop bleeds the screen off-edge so only part of the UI shows:
 *   crop "bottom" → reveals the TOP of the UI    (screen rises from below)
 *   crop "top"    → reveals the BOTTOM of the UI
 *   crop "none"   → the whole screen
 * `reveal` (0–1) controls how much stays visible when cropped.
 *
 * Drop in a screenshot via `src`, or any node (incl. a colour placeholder) via
 * `children`. `hover` adds a subtle lift + shadow, and a slow zoom on the image.
 */

export type ScreenCrop = "none" | "top" | "bottom"

/** iPhone 17 native screen resolution → frameless screens match the device. */
export const IPHONE_17_ASPECT = "1206/2622"

export interface ScreenCardProps {
  /** Screenshot to fill the card. Ignored if `children` are given. */
  src?: string
  alt?: string
  /** Live / placeholder screen content. Wins over `src`. */
  children?: ReactNode
  /** Screen aspect as "w/h". Default the iPhone 17 screen. */
  aspect?: string
  /** How the screen bleeds off-edge. Default "none". */
  crop?: ScreenCrop
  /** Fraction kept visible when cropped (0–1). Default 0.72. */
  reveal?: number
  /** Subtle hover lift + image zoom. Default false. */
  hover?: boolean
  /** Soft drop shadow under the card. Default true. */
  shadow?: boolean
  /** Extra classes on the card (e.g. a bg colour placeholder). */
  className?: string
}

export function ScreenCard({
  src,
  alt = "",
  children,
  aspect = IPHONE_17_ASPECT,
  crop = "none",
  reveal = 0.72,
  hover = false,
  shadow = true,
  className,
}: ScreenCardProps) {
  const [w, h] = aspect.split("/").map(Number)
  const aspectRatio = crop === "none" ? aspect : `${w} / ${h * reveal}`
  // To reveal the TOP of the UI we pin the image to the top, and vice-versa.
  const objectPos =
    crop === "top" ? "object-bottom" : crop === "bottom" ? "object-top" : "object-center"

  return (
    <div
      className={cn(
        "group relative w-full overflow-hidden rounded-[1.75rem] bg-card",
        "ring-1 ring-black/[0.06] dark:ring-white/[0.08]",
        shadow && "shadow-[0_28px_64px_-24px_rgba(0,0,0,0.35)]",
        hover &&
          "z-0 transition-[transform,box-shadow,border-color] duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] hover:z-10 motion-safe:hover:-translate-y-2.5 hover:ring-black/[0.12] dark:hover:ring-white/[0.16]",
        hover && shadow && "hover:shadow-[0_48px_90px_-26px_rgba(0,0,0,0.55)]",
        className
      )}
      style={{ aspectRatio }}
    >
      {children ??
        (src && (
          <Image
            src={src}
            alt={alt}
            fill
            sizes="(max-width: 768px) 90vw, 360px"
            className={cn(
              "object-cover",
              objectPos,
              hover &&
                "transition-transform duration-[800ms] ease-[cubic-bezier(0.22,1,0.36,1)] will-change-transform motion-safe:group-hover:scale-[1.04]"
            )}
          />
        ))}
    </div>
  )
}
