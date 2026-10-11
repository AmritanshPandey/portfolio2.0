import type { MetadataRoute } from "next"

// The whole portfolio sits behind the password gate (proxy.ts), so search
// crawlers are kept out. Link-preview bots may fetch, so links shared on
// LinkedIn, X or Slack still get a card; they only ever reach the noindex
// /unlock page. app/sitemap.ts stays for when the gate is lifted.
const PREVIEW_BOTS = [
  "LinkedInBot",
  "Twitterbot",
  "facebookexternalhit",
  "Slackbot-LinkExpanding",
  "Discordbot",
  "WhatsApp",
]

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      { userAgent: PREVIEW_BOTS, allow: "/" },
      { userAgent: "*", disallow: "/" },
    ],
  }
}
