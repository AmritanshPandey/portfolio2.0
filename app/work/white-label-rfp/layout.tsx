import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "PartnerBank, A White-Label Design System for Global RFPs",
  description:
    "A configurable white-label design system that turned per-client demo re-skins into a configuration pass across global RFP cycles.",
}

export default function WhiteLabelRfpLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>
}
