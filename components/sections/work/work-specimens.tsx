"use client"

import { useMemo } from "react"
import { AsciiField } from "@/components/shared/ascii-field"
import { workField } from "./work-fields"

/**
 * Work specimens: one live ASCII field per case study (work-fields.ts).
 *
 * The case-study images are abstract gradients, so putting them in front of
 * each row would decorate the index without showing any work. Each specimen
 * instead draws the core mechanism of its project, in type, from content
 * that lives in that case study: PartnerBank's three bank skins, Agent Pay's
 * anxiety curve and its guardian moments, Honasa's shared backbone, DROR's
 * revenue turning against restrictions, the email builder's blocks.
 *
 * The picture resolves as the row scrolls in, warms under the cursor, and
 * runs harder while the row is hovered or focused. Phones and reduced motion
 * get one resolved frame. Decorative (aria-hidden): the row's text carries
 * the meaning.
 */

/** Returns null for a case study with no specimen, so the caller can fall back. */
export function WorkSpecimen({ slug }: { slug: string }) {
  const motifs = useMemo(() => {
    const motif = workField(slug)
    return motif ? [motif] : null
  }, [slug])
  if (!motifs) return null
  return (
    <div
      aria-hidden
      // Ledger's 4px corner on the frame.
      className="relative aspect-[16/10] w-full overflow-hidden rounded-[4px] bg-card ring-1 ring-foreground/[0.08] dark:ring-white/[0.07]"
    >
      <AsciiField motifs={motifs} cell={7} energyFrom=".work-row" className="absolute inset-0" />
    </div>
  )
}
