import { contrastRatio, parseColor } from "./color.mjs"
import { extractThemes, resolveToken } from "./tokens.mjs"

export const MIN_RATIO = 4.5

// Text tokens on the surfaces they sit on (spec §12). Hairline borders are
// decorative and deliberately not checked.
const PAIRS = [
  ["foreground", "background"],
  ["foreground", "surface-1"],
  ["foreground", "surface-2"],
  ["text-muted", "background"],
  ["text-muted", "surface-1"],
  ["text-muted", "surface-2"],
  ["accent", "background"],
  ["accent", "surface-1"],
  ["on-inverse", "surface-inverse"],
  ["primary-foreground", "primary"],
  // Accent links and labels also sit on muted sections and hovered cards;
  // secondary buttons carry body and muted text; errors sit on paper.
  ["accent", "surface-2"],
  ["accent", "surface-hover"],
  ["foreground", "secondary"],
  ["text-muted", "secondary"],
  ["destructive", "background"],
  ["destructive", "surface-1"],
]

export function checkContrast(css) {
  const themes = extractThemes(css)
  const results = []

  for (const [theme, map] of Object.entries(themes)) {
    const otherName = theme === "light" ? "dark" : "light"
    const checks = [
      ...PAIRS.map(([fg, bg]) => ({ fg, bg, fgMap: map, name: `${theme}: ${fg} on ${bg}` })),
      { fg: "accent", bg: "surface-inverse", fgMap: themes[otherName], name: `${theme}: accent (${otherName}) on surface-inverse` },
    ]

    for (const { fg, bg, fgMap, name } of checks) {
      const fgRaw = resolveToken(fgMap, fg)
      const bgRaw = resolveToken(map, bg)
      const fgColor = fgRaw && parseColor(fgRaw)
      const bgColor = bgRaw && parseColor(bgRaw)

      if (!fgColor || !bgColor) {
        const which = !fgColor ? `--${fg} = ${fgRaw ?? "missing"}` : `--${bg} = ${bgRaw ?? "missing"}`
        results.push({ name, ratio: null, pass: false, reason: `unresolved ${which}` })
        continue
      }
      if (bgColor.a < 1) {
        results.push({ name, ratio: null, pass: false, reason: `--${bg} is translucent` })
        continue
      }
      const ratio = contrastRatio(fgColor, bgColor)
      results.push({ name, ratio, pass: ratio >= MIN_RATIO })
    }
  }

  return { results, failures: results.filter((r) => !r.pass) }
}
