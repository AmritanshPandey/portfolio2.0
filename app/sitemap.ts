import type { MetadataRoute } from "next"

import { articleItems, explorationItems, systemItems, workItems } from "@/lib/data"

// Must match `metadataBase` in app/layout.tsx. Submitting a Vercel preview
// hostname here split search signal across two domains serving identical
// content.
const SITE_URL = "https://www.amritansh.cc"

// Public surfaces only. /showcase and its children are the internal component
// kitchen-sink ("INTERNAL, NOT LINKED IN NAV"), so they are neither submitted
// here nor indexable — see app/showcase/layout.tsx.
const staticRoutes = [
  "/",
  "/articles",
  "/gallery",
  "/playground",
]

export default function sitemap(): MetadataRoute.Sitemap {
  const lastModified = new Date()
  const paths = new Set([
    ...staticRoutes,
    ...articleItems.filter((item) => !item.hidden).map((item) => item.href),
    ...explorationItems.map((item) => item.href),
    ...systemItems.map((item) => item.href),
    ...workItems.map((item) => item.href),
  ])

  return Array.from(paths).map((path) => ({
    url: new URL(path, SITE_URL).toString(),
    lastModified,
    changeFrequency: path === "/" ? "monthly" : "yearly",
    priority: path === "/" ? 1 : path.includes("/work/") ? 0.8 : 0.6,
  }))
}
