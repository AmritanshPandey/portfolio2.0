import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "PartnerBank, A White-Label Design System for Global RFPs",
  description:
    "Enterprise demos took days to customise per client. A configurable white-label design system that made tailored product demos same-day, across global sales cycles.",
}

export default function WhiteLabelRfpLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>
}
