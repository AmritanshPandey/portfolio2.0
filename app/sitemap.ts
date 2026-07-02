import type { MetadataRoute } from "next"

import { articleItems, explorationItems, systemItems, workItems } from "@/lib/data"

const SITE_URL = "https://portfolio2-0-beta-one.vercel.app"

const staticRoutes = [
  "/",
  "/articles",
  "/gallery",
  "/playground",
  "/showcase",
  "/showcase/case-study",
  "/showcase/webgl-scroll-shader",
]

export default function sitemap(): MetadataRoute.Sitemap {
  const lastModified = new Date()
  const paths = new Set([
    ...staticRoutes,
    ...articleItems.map((item) => item.href),
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
