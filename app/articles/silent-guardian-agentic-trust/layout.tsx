import type { Metadata } from "next"

export const metadata: Metadata = {
  // Retired alongside the Agent Pay case study, and for the same reason: it
  // covers that work in more strategic detail than the case study did. Kept
  // out of search indexes; the route still resolves so it can be re-enabled by
  // clearing `hidden` in lib/data/articles.ts and deleting this file.
  robots: { index: false, follow: false },
}

export default function SilentGuardianLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return <>{children}</>
}
