import type { Metadata } from "next"

const TITLE = "Amritansh Pandey | Design Lead"
const DESCRIPTION =
  "Product-minded Design Lead — scalable fintech design systems, UX craft, and working prototypes. Email Builder, PartnerBank design system, and Agent Pay."

export const metadata: Metadata = {
  title: "Design Lead",
  description: DESCRIPTION,
  alternates: { canonical: "/design-lead" },
  openGraph: {
    type: "profile",
    url: "/design-lead",
    title: TITLE,
    description: DESCRIPTION,
  },
  twitter: { card: "summary_large_image", title: TITLE, description: DESCRIPTION },
}

export default function DesignLeadLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>
}
