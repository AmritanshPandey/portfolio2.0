import type { MetadataRoute } from "next"

// The whole portfolio sits behind the password gate (proxy.ts), so crawlers
// are kept out entirely. app/sitemap.ts stays for when the gate is lifted.
export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: "*",
      disallow: "/",
    },
  }
}
