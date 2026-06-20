import type { Metadata } from "next"

const TITLE = "Amritansh Pandey | Product"
const DESCRIPTION =
  "Product-focused builder turning ambiguous problems into decisions, prototypes, roadmaps, and measurable outcomes. Agent Pay, 0→1 work, and metrics."

export const metadata: Metadata = {
  title: "Product",
  description: DESCRIPTION,
  alternates: { canonical: "/pm" },
  openGraph: {
    type: "profile",
    url: "/pm",
    title: TITLE,
    description: DESCRIPTION,
  },
  twitter: { card: "summary_large_image", title: TITLE, description: DESCRIPTION },
}

export default function PmLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>
}
