import { readFile } from "node:fs/promises"
import { join } from "node:path"
import { ImageResponse } from "next/og"

export const size = { width: 1200, height: 630 }
export const contentType = "image/png"
export const alt =
  "Amritansh Pandey, Senior UX Designer at Mastercard. Product design for complex systems people can trust."

// The Ledger palette (light paper), from the tokens in globals.css.
const PAPER = "#F2F0EB"
const INK = "#111111"
const GRAPHITE = "#5C5A55"
const ULTRAMARINE = "#2B35E8"
const RULE = "#D6D2C9"

/**
 * The social card: what a link to the site shows when it is pasted into
 * LinkedIn, Slack or a DM. It is the hero, set again: the paper, the ink
 * rule, the statement in Archivo with the ultramarine full stop, and the
 * name and role on a hairline underneath.
 *
 * The fonts are read from the repo rather than fetched at build time. A
 * network call here would fail silently (the card would just render in a
 * default face), and preview deployments sit behind Vercel SSO, so that
 * regression would be invisible from outside. Static Archivo instances
 * (Fontsource, OFL), since the card renderer reads neither variable fonts
 * nor WOFF2; never shipped to a browser.
 */
async function loadFont(file: string): Promise<Buffer> {
  return readFile(join(process.cwd(), "assets", "fonts", file))
}

export default async function Image() {
  const [regular, bold] = await Promise.all([loadFont("archivo-400.woff"), loadFont("archivo-800.woff")])

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          background: PAPER,
          padding: "56px 72px 60px",
          fontFamily: "Archivo",
          color: INK,
        }}
      >
        {/* Meta line, then the ink rule the statement hangs from. */}
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 14, fontSize: 24, color: INK }}>
            <div style={{ width: 12, height: 12, background: ULTRAMARINE, display: "flex" }} />
            Open to conversations
          </div>
          <div style={{ display: "flex", fontSize: 24, color: GRAPHITE }}>amritansh.cc</div>
        </div>
        <div style={{ display: "flex", height: 2, background: INK, marginTop: 22 }} />

        <div
          style={{
            display: "flex",
            flexDirection: "column",
            marginTop: 40,
            fontSize: 104,
            fontWeight: 800,
            letterSpacing: "-0.045em",
            lineHeight: 0.96,
          }}
        >
          <div style={{ display: "flex" }}>Product design for</div>
          <div style={{ display: "flex" }}>complex systems</div>
          <div style={{ display: "flex" }}>
            people can trust<span style={{ color: ULTRAMARINE }}>.</span>
          </div>
        </div>

        <div
          style={{
            display: "flex",
            alignItems: "baseline",
            justifyContent: "space-between",
            marginTop: "auto",
            paddingTop: 22,
            borderTop: `1px solid ${RULE}`,
          }}
        >
          <div style={{ display: "flex", fontSize: 32, fontWeight: 800, letterSpacing: "-0.02em" }}>
            Amritansh Pandey
          </div>
          <div style={{ display: "flex", fontSize: 26, color: GRAPHITE }}>
            Senior UX Designer · Mastercard
          </div>
        </div>
      </div>
    ),
    {
      ...size,
      // No conditional fallback: the files are in the repo, so a missing font
      // is a build error worth surfacing rather than a card that quietly ships
      // in the wrong typeface.
      fonts: [
        { name: "Archivo", data: regular, style: "normal", weight: 400 },
        { name: "Archivo", data: bold, style: "normal", weight: 800 },
      ],
    }
  )
}
