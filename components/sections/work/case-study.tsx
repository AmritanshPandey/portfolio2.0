import { SectionSubgroup } from "@/components/shared/section-subgroup"
import { workItems } from "@/lib/data"
import { WorkIndex } from "./work-index"

export default function WorkSection() {
  // Order is controlled by SEQUENCE in lib/data/work.ts.
  const sorted = [...workItems].sort((a, b) => a.order - b.order)

  return (
    <SectionSubgroup variant="spacious">
      <section data-cursor-zone="work">
        <WorkIndex items={sorted} />
      </section>
    </SectionSubgroup>
  )
}
