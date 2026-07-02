import type { Metadata } from "next"
import { ChromaticLensHero } from "@/components/showcase/chromatic-lens-hero"

export const metadata: Metadata = {
  title: "Chromatic Lens",
  description:
    "Giant kinetic type under a cursor-following lens that reveals a tinted, chromatically-aberrated, halftone copy of the letters beneath it.",
}

export default function ChromaticLensPage() {
  return <ChromaticLensHero />
}
