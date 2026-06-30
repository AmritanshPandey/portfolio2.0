import Image from "next/image"
import type { ReactNode } from "react"

import { cn } from "@/lib/utils"
import { BentoCardShell } from "@/components/shared/bento-card-shell"
import { ExpandingSwatches } from "./expanding-swatches"
import { TypeSpecimen } from "./type-specimen"

/**
 * BrandBento — a neutral brand-kit specimen laid out as an asymmetric bento.
 * It dogfoods the portfolio's own tokens (true-gray neutrals + a single emerald
 * accent). Every cell carries imagery — including the tall central tile —
 * except the two "kit" specimens: the typography cell and the expanding colour
 * swatches. Each cell reuses BentoCardShell for the shared hover lift + cursor
 * spotlight.
 */

const CELL =
  "group/bento relative isolate overflow-hidden rounded-2xl bg-card ring-1 ring-foreground/10 " +
  "transition duration-300 ease-out " +
  "motion-safe:hover:-translate-y-1 hover:ring-foreground/20 hover:shadow-[var(--shadow-md)]"

/** A clean work-image tile with hover zoom — no caption. */
function ImageCell({
  src,
  alt,
  className,
}: {
  src: string
  alt: string
  className?: string
}) {
  return (
    <BentoCardShell className={cn(CELL, className)}>
      <Image
        src={src}
        alt={alt}
        fill
        sizes="(max-width: 768px) 100vw, 33vw"
        className="object-cover transition-transform duration-[800ms] ease-[cubic-bezier(0.22,1,0.36,1)] motion-safe:group-hover/bento:scale-[1.045]"
      />
    </BentoCardShell>
  )
}

/** A non-image "kit" cell: the typography specimen and colour swatches only. */
function KitCell({ className, children }: { className?: string; children: ReactNode }) {
  return <BentoCardShell className={cn(CELL, "p-4", className)}>{children}</BentoCardShell>
}

export function BrandBento({ className }: { className?: string }) {
  return (
    <div
      className={cn(
        "grid grid-cols-1 gap-3",
        "md:grid-cols-3 md:auto-rows-[160px]",
        className
      )}
    >
      {/* Typography specimen — kit cell, no image */}
      <KitCell className="min-h-[200px] md:col-start-1 md:row-start-1 md:row-span-2">
        <TypeSpecimen />
      </KitCell>

      {/* Expanding swatches — compact kit cell directly under the typography */}
      <KitCell className="h-20 !p-3 md:h-auto md:col-start-1 md:row-start-3">
        <ExpandingSwatches />
      </KitCell>

      {/* Central tile — tall image centrepiece */}
      <ImageCell
        src="/assets/images/work/white-label-platform.jpg"
        alt="White-label platform interface"
        className="h-[340px] md:h-auto md:col-start-2 md:row-start-1 md:row-span-3"
      />

      {/* Right column — three image tiles */}
      <ImageCell
        src="/assets/images/work/commerce-platform.jpg"
        alt="Commerce platform interface"
        className="min-h-[180px] md:min-h-0 md:col-start-3 md:row-start-1"
      />
      <ImageCell
        src="/assets/images/work/ai-decision-engine.jpg"
        alt="AI decision engine dashboard"
        className="min-h-[180px] md:min-h-0 md:col-start-3 md:row-start-2"
      />
      <ImageCell
        src="/assets/images/work/design-tokens.jpg"
        alt="Design tokens from a shipped product system"
        className="min-h-[180px] md:min-h-0 md:col-start-3 md:row-start-3"
      />
    </div>
  )
}
