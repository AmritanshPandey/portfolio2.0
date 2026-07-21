import type { MetadataRoute } from "next"

// Must match `metadataBase` in app/layout.tsx and SITE_URL in app/sitemap.ts.
const SITE_URL = "https://www.amritansh.cc"

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: "*",
      allow: "/",
    },
    sitemap: `${SITE_URL}/sitemap.xml`,
  }
}
