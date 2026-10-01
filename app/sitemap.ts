import type { MetadataRoute } from "next"

import { articleItems, explorationItems, systemItems, workItems } from "@/lib/data"
import { SITE_URL } from "@/lib/site"

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
  const paths = new Set([
    ...staticRoutes,
    ...articleItems.filter((item) => !item.hidden).map((item) => item.href),
    ...explorationItems.map((item) => item.href),
    ...systemItems.map((item) => item.href),
    ...workItems.map((item) => item.href),
  ])

  return Array.from(paths).map((path) => ({
    url: new URL(path, SITE_URL).toString(),
    changeFrequency: path === "/" ? "monthly" : "yearly",
    priority: path === "/" ? 1 : path.includes("/work/") ? 0.8 : 0.6,
  }))
}
