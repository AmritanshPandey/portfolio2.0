import type { Metadata } from "next"
import ContentPage from "@/components/layout/content-page"
import { InProgressSections } from "@/components/shared/in-progress-sections"

export const metadata: Metadata = {
  title: "AI Decision Engine",
  description:
    "Hypothesis: structured frameworks reduce cognitive load on complex PM trade-off decisions. A decision-support concept using weighted inputs and scenario simulation.",
}

export default function Page() {
  return (
    <ContentPage
      eyebrow="Exploration · Decision Systems"
      status="Concept"
      title="AI Decision Engine"
      hypothesis="Hypothesis: structured frameworks reduce cognitive load on complex PM trade-off decisions."
      description="A decision-support concept using weighted inputs, trade-offs, and scenario simulation to make hard product calls legible, without pretending to remove the judgement."
    >
      <InProgressSections />
    </ContentPage>
  )
}
