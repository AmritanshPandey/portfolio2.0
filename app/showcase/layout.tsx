import type { Metadata } from "next"

export const metadata: Metadata = {
  // The showcase is the internal component gallery: it says so on the page
  // ("INTERNAL, NOT LINKED IN NAV") but was still being submitted in the
  // sitemap and left indexable, so work-in-progress components and demo data
  // could surface in search. Covers every /showcase/* child route too.
  robots: { index: false, follow: false },
}

export default function ShowcaseLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return <>{children}</>
}
