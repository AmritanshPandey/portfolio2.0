import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "Agent Pay — Mastercard's Role in AI-led Payments",
  description:
    "When AI pays autonomously, where does trust live? The UX research toolkit, multi-sensory trust framework, and the React + Claude demo Mastercard's CPO used at Money20/20.",
}

export default function AgentCommerceLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>
}
