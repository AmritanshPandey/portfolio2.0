import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "Agent Pay, Mastercard's Role in AI-led Payments",
  description:
    "When AI pays autonomously, where does trust live? The UX research toolkit, multi-sensory trust framework, and the React + Claude demo Mastercard's CPO used at Money20/20.",
  // Hidden from the portfolio: unlinked from Work / Gallery / hero, and kept
  // out of search indexes. The route still resolves so it can be re-enabled.
  robots: { index: false, follow: false },
}

export default function AgentCommerceLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>
}
