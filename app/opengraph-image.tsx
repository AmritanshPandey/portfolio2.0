import { readFile } from "node:fs/promises"
import { join } from "node:path"
import { ImageResponse } from "next/og"

export const size = { width: 1200, height: 630 }
export const contentType = "image/png"
export const alt =
  "Amritansh Pandey, Senior UX Designer at Mastercard. Product design for complex systems people can trust."

/**
 * The social card.
 *
 * A portfolio spreads by being pasted into LinkedIn, Slack, and DMs; without
 * this the link rendered as a bare text row. Rebuilds the hero's composition
 * rather than inventing a second identity: dark canvas, emerald accent on the
 * middle line, and the same positioning statement.
 *
 * The display font is read from the repo rather than fetched from Google at
 * build time. A network call here would fail silently — the card would just
 * render in a default face and nothing would flag it — and the preview
 * deployments sit behind Vercel SSO, so that regression would be invisible
 * from outside. 82 KB in the repo, never shipped to a browser, always correct.
 */
async function loadFont(): Promise<Buffer> {
  return readFile(
    join(process.cwd(), "assets", "fonts", "bricolage-grotesque-700.ttf")
  )
}

export default async function Image() {
  const font = await loadFont()

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          background: "#0a0a0a",
          padding: "72px 80px",
          position: "relative",
        }}
      >
        {/* Emerald bloom, echoing the hero's ambient glow. */}
        <div
          style={{
            position: "absolute",
            top: -180,
            right: -140,
            width: 640,
            height: 640,
            borderRadius: 9999,
            background:
              "radial-gradient(circle, rgba(52,211,153,0.20) 0%, rgba(52,211,153,0) 70%)",
            display: "flex",
          }}
        />

        <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
          <div
            style={{
              width: 11,
              height: 11,
              borderRadius: 9999,
              background: "#34d399",
              display: "flex",
            }}
          />
          <div style={{ color: "#a1a1aa", fontSize: 25, letterSpacing: "-0.01em" }}>
            Senior UX Designer · Mastercard
          </div>
        </div>

        <div
          style={{
            display: "flex",
            flexDirection: "column",
            fontSize: 78,
            fontWeight: 700,
            letterSpacing: "-0.022em",
            lineHeight: 1.06,
          }}
        >
          <div style={{ color: "#fafafa", display: "flex" }}>Product design for</div>
          <div style={{ color: "#34d399", display: "flex" }}>complex systems</div>
          <div style={{ color: "#fafafa", display: "flex" }}>people can trust.</div>
        </div>

        <div style={{ display: "flex", alignItems: "center", gap: 22 }}>
          <div style={{ color: "#fafafa", fontSize: 29, fontWeight: 700 }}>
            Amritansh Pandey
          </div>
          <div style={{ width: 1, height: 26, background: "#3f3f46", display: "flex" }} />
          <div style={{ color: "#71717a", fontSize: 22 }}>
            7 years · fintech, commerce, 0→1
          </div>
        </div>
      </div>
    ),
    {
      ...size,
      // No conditional fallback: the file is in the repo, so a missing font is
      // a build error worth surfacing rather than a card that quietly ships in
      // the wrong typeface.
      fonts: [
        { name: "Bricolage Grotesque", data: font, style: "normal", weight: 700 },
      ],
    }
  )
}
