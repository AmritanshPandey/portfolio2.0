import type { Metadata } from "next"
import ContentPage from "@/components/layout/content-page"
import { InProgressSections } from "@/components/shared/in-progress-sections"

export const metadata: Metadata = {
  title: "Sneakers Commerce System",
  description:
    "Hypothesis: scarcity mechanics can be systematised without eroding brand trust. An exploration of drop mechanics and behavioural triggers in hype-driven commerce.",
}

export default function Page() {
  return (
    <ContentPage
      eyebrow="Exploration · Commerce"
      status="Concept"
      title="Sneakers Commerce System"
      hypothesis="Hypothesis: scarcity mechanics can be systematised without eroding brand trust."
      description="A commerce system for sneaker discovery, drops, and authentication, studying how hype-driven marketplaces build and keep trust around collectible products."
    >
      <InProgressSections />
    </ContentPage>
  )
}
