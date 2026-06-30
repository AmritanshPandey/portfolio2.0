import type { Metadata } from "next"
import { UiDesignGallery } from "@/components/gallery/ui-design-gallery"

export const metadata: Metadata = {
  title: "UI Design Gallery",
  description:
    "A visual gallery of product interfaces, design systems, and mobile concepts by Amritansh Pandey.",
}

export default function GalleryPage() {
  return <UiDesignGallery />
}
