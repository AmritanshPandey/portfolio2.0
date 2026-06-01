import type { Metadata } from "next"
import ContentPage from "@/components/layout/content-page"
import { InProgressSections } from "@/components/shared/in-progress-sections"

export const metadata: Metadata = {
  title: "Personal Execution System",
  description:
    "Hypothesis: goals fail at decomposition, not intention. An exploration of dependency-aware task systems that connect long-term goals to short-term execution.",
}

export default function Page() {
  return (
    <ContentPage
      eyebrow="Exploration · Systems"
      status="In Development"
      title="Personal Execution System"
      hypothesis="Hypothesis: goals fail at decomposition, not intention."
      description="An exploration of dependency-aware task systems — connecting long-term goals to short-term execution cycles, so the gap between wanting and doing gets engineered away."
    >
      <InProgressSections />
    </ContentPage>
  )
}
