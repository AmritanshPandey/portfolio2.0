import { SectionSubgroup } from "@/components/shared/section-subgroup"
import { workItems } from "@/lib/data"
import { WorkGallery } from "./work-gallery"

export default function WorkSection() {
  // Order is controlled by SEQUENCE in lib/data/work.ts.
  const sorted = [...workItems].sort((a, b) => a.order - b.order)

  return (
    <SectionSubgroup variant="spacious">
      <section data-cursor-zone="work">
        <WorkGallery items={sorted} />
      </section>
    </SectionSubgroup>
  )
}
