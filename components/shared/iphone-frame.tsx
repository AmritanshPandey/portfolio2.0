import Image from "next/image"
import type { ReactNode } from "react"

import { cn } from "@/lib/utils"

/**
 * A realistic iPhone mockup. The body PNGs in /public/assets/images have a
 * transparent screen cutout, so screen content sits in an inset rectangle
 * *behind* the frame and the PNG (bezel, Dynamic Island, side buttons) layers
 * on top — its rounded inner edge masks the content's corners for free.
 *
 * Geometry was measured from the 1800×3680 assets (identical for both variants):
 * screen insets top/bottom 2.5%, left/right 5.333%; corner radius ≈ 12.5% of
 * frame width (expressed as 12.5cqw via the @container context so it scales).
 *
 * Control the size from the caller via `className` (e.g. "w-[240px]").
 */

const FRAME = {
  black: "/assets/images/iphone.png",
  white: "/assets/images/iphone-white.png",
} as const

const SCREEN_INSET = { top: "2.5%", bottom: "2.5%", left: "5.333%", right: "5.333%" } as const

export interface IphoneFrameProps {
  /** Convenience: render an image as the screen. Ignored if children are given. */
  src?: string
  alt?: string
  /** Live screen content (video, iframe, component). Wins over `src`. */
  children?: ReactNode
  /** Which body PNG. Default "black". */
  variant?: "black" | "white"
  /** next/image priority for the frame (above-the-fold use). */
  priority?: boolean
  /** Outer wrapper classes — control width here, e.g. "w-[240px]". */
  className?: string
  /** Screen layer classes, e.g. a bg colour for letterboxed screenshots. */
  screenClassName?: string
}

export function IphoneFrame({
  src,
  alt = "",
  children,
  variant = "black",
  priority = false,
  className,
  screenClassName,
}: IphoneFrameProps) {
  const sizes = "(max-width: 768px) 80vw, 320px"

  return (
    <div className={cn("@container relative isolate aspect-[1800/3680] select-none", className)}>
      {/* Screen layer — behind the frame */}
      <div
        className={cn(
          "absolute overflow-hidden rounded-[12.5cqw] bg-black",
          screenClassName
        )}
        style={SCREEN_INSET}
      >
        {children ??
          (src && (
            <Image
              src={src}
              alt={alt}
              fill
              sizes={sizes}
              className="object-cover"
            />
          ))}
      </div>

      {/* Frame overlay — on top, non-interactive so children stay clickable */}
      <Image
        src={FRAME[variant]}
        alt=""
        aria-hidden
        fill
        priority={priority}
        draggable={false}
        sizes={sizes}
        className="pointer-events-none absolute inset-0 z-10 object-contain"
      />
    </div>
  )
}
