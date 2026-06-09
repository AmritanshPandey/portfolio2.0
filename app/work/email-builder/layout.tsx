import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "Scaling Mastercard's Email System to No-Code Infrastructure",
  description:
    "Mastercard's brand evolved; its email system hadn't. A no-code builder, 50+ components, 28 templates, zero HTML, so any team could ship on-brand, Outlook-safe email.",
}

export default function EmailBuilderLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>
}
