// Pulls the light and dark custom-property maps out of globals.css.
// Light = every rule whose selector list contains `:root` (including rules
// inside @media blocks); dark = every rule whose selector list contains
// exactly `.dark`. Later declarations win, as in the cascade.

export function extractThemes(css) {
  const light = {}
  const dark = {}
  const stripped = css.replace(/\/\*[\s\S]*?\*\//g, "")
  for (const [, selectorText, body] of stripped.matchAll(/([^{}]+)\{([^{}]*)\}/g)) {
    // Drop any `;`-terminated statements (e.g. @custom-variant) that precede
    // the selector, or they glue onto its first selector.
    const selector = selectorText.slice(selectorText.lastIndexOf(";") + 1)
    const selectors = selector.split(",").map((s) => s.trim())
    const target = selectors.includes(":root") ? light : selectors.includes(".dark") ? dark : null
    if (!target) continue
    for (const [, name, value] of body.matchAll(/--([\w-]+)\s*:\s*([^;]+);/g)) {
      target[name] = value.trim()
    }
  }
  return { light, dark }
}

/** Follows `var(--x)` chains inside one theme map. Undefined when missing. */
export function resolveToken(map, name, depth = 0) {
  const raw = map[name]
  if (raw === undefined || depth > 8) return undefined
  const ref = raw.match(/^var\(--([\w-]+)\)$/)
  return ref ? resolveToken(map, ref[1], depth + 1) : raw
}
