import type { Metadata } from "next"
import ContentPage from "@/components/layout/content-page"
import { InProgressSections } from "@/components/shared/in-progress-sections"

export const metadata: Metadata = {
  title: "Weather-Based Skincare Planner",
  description:
    "Hypothesis: environmental context — weather, UV, humidity — can drive a genuinely adaptive skincare routine, not static recommendations.",
}

export default function Page() {
  return (
    <ContentPage
      eyebrow="Exploration · Personal Tools"
      status="Concept"
      title="Weather-Based Skincare Planner"
      hypothesis="Hypothesis: environmental context — weather, UV, humidity — can drive a genuinely adaptive routine, not static recommendations."
      description="A planning system that combines weather data, UV exposure, and skin profiles to adapt a daily routine to the conditions it actually has to survive."
    >
      <InProgressSections />
    </ContentPage>
  )
}
