#!/usr/bin/env node
/**
 * Ledger drift check. Run: `node scripts/check-ledger.mjs` (or `npm run check:ledger`).
 *
 * HARD rules fail the run (exit 1). They are visible bugs or system breaks:
 *   H1  Tailwind text sizes below 11px            text-[8px], text-[10.5px] ...
 *   H2  HTML entities inside JS/JSON strings       "couldn&apos;t" renders literally
 *   H3  Stock gradient placeholders in the gallery or work data (only with --strict-images)
 *
 * SOFT rules are reported as counts per file, so a phase can drive them to zero:
 *   S1  Legacy accents (rose, red, pink, orange, emerald, ember) outside mockups
 *   S2  Gradients (radial/linear) outside mockups
 *   S3  Card-grid surfaces (rounded box + border + card fill) where Ledger wants ruled rows
 *   S4  Emoji and pictographs in copy
 *   S5  Uppercase + tracking label classes (the CSS override hides them; the code still drifts)
 *   S6  White-alpha SVG fills/strokes that vanish on light paper
 *   S7  SVG fontSize below 11
 *   S8  Stock gradient placeholder images still referenced
 *   S9  Em dashes in strings and JSX text (comments excluded, best effort)
 *   S10 Open <AddLater> editorial notes (info only)
 *
 * Flags: --strict-images (S8 becomes hard), --json (machine-readable output).
 */
import fs from "node:fs"
import path from "node:path"

const ROOT = process.cwd()
const args = new Set(process.argv.slice(2))
const STRICT_IMAGES = args.has("--strict-images")
const AS_JSON = args.has("--json")

const SCAN = ["app", "components", "lib", "data"]
const EXT = /\.(tsx|ts|mjs|json)$/
const SKIP_DIRS = new Set(["node_modules", ".next", ".next-build", ".next-preview", "_localfonts"])

// Specimens, demos and someone else's interface: they keep their own palettes and sizes.
const ALLOW = [
  "components/fintech-system/",
  "app/systems/fintech-ai-interface/",
  "app/articles/color-system/",
  "app/articles/typography-system/",
  "components/shared/color-system/",
  "components/shared/color-scale-tool.tsx",
  "components/shared/matching-lab.tsx",
  "app/showcase/",
  "components/showcase/",
  "components/ui/",
  "lib/color.ts",
  "scripts/",
]
const allowed = (rel) => ALLOW.some((p) => rel.startsWith(p))

function walk(dir, out = []) {
  if (!fs.existsSync(dir)) return out
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    if (SKIP_DIRS.has(entry.name)) continue
    const p = path.join(dir, entry.name)
    if (entry.isDirectory()) walk(p, out)
    else if (EXT.test(entry.name)) out.push(p)
  }
  return out
}

const files = SCAN.flatMap((d) => walk(path.join(ROOT, d)))
const hard = []
const soft = {}
const bump = (rule, rel, line) => {
  soft[rule] ??= {}
  soft[rule][rel] ??= []
  soft[rule][rel].push(line)
}

const ENTITY = "&(?:apos|amp|quot|rsquo|lsquo|rdquo|ldquo|nbsp|mdash|ndash|hellip);"
// A string literal that starts a line (array item) or follows a colon (object value).
// JSX attribute strings (prop="...&apos;...") decode entities, so they are not matched.
const entityInJsString = new RegExp(`(^\\s*|:\\s*|\\(\\s*|,\\s*)(["'\`])[^"'\`\\n]*${ENTITY}`)
const entityInJson = new RegExp(ENTITY)
const tinyText = /text-\[(\d+(?:\.\d+)?)px\]/g
const legacyAccent =
  /(244\s*,\s*63\s*,\s*94|#f43f5e|#e11d48|#f97316|#ea580c|#fb923c|#00c853|\b(?:rose|red|pink|orange|amber|emerald)-\d{2,3}\b)/i
const gradient = /(radial-gradient|linear-gradient|bg-gradient-to-|conic-gradient)/
const cardSurface = /rounded-(?:xl|2xl|3xl)\b[^"'`]*\bborder\b[^"'`]*\b(?:bg-card|bg-muted)\b|\b(?:bg-card|bg-muted)\b[^"'`]*\bborder\b[^"'`]*rounded-(?:xl|2xl|3xl)\b/
const emoji = /[\u{1F300}-\u{1FAFF}\u{2600}-\u{27BF}\u{2B50}\u{2728}]/u
const upperTracked = /\buppercase\b[^"'`]*\btracking-|\btracking-[^"'`]*\buppercase\b/
const whiteAlphaSvg = /(fill|stroke)=["']rgba\(\s*255\s*,\s*255\s*,\s*255/
const svgSmallFont = /fontSize=\{?["']?([0-9.]+)["']?\}?/g
const placeholder = /\/assets\/images\/work\/[a-z0-9-]+\.jpg/
const emDash = /—/
const commentLine = /^\s*(\/\/|\*|\/\*|\{\s*\/\*)/

for (const abs of files) {
  const rel = path.relative(ROOT, abs).split(path.sep).join("/")
  const text = fs.readFileSync(abs, "utf8")
  const lines = text.split("\n")
  const isJson = rel.endsWith(".json")
  const exempt = allowed(rel)

  lines.forEach((line, i) => {
    const n = i + 1
    const isComment = commentLine.test(line)

    // H1: tiny text (everywhere except exempt specimens)
    if (!exempt && !isComment) {
      for (const m of line.matchAll(tinyText)) {
        if (parseFloat(m[1]) < 11) hard.push({ rule: "H1 text below 11px", rel, n, snippet: m[0] })
      }
    }

    // H2: literal entities in JS strings or JSON content
    if (!isComment && ((isJson && entityInJson.test(line)) || (!isJson && entityInJsString.test(line)))) {
      const at = line.indexOf("&")
      hard.push({ rule: "H2 entity renders literally", rel, n, snippet: line.slice(Math.max(0, at - 30), at + 20).trim() })
    }

    if (exempt || isComment) {
      if (!isComment && /<AddLater\b/.test(line)) bump("S10 open AddLater notes", rel, n)
      return
    }

    if (legacyAccent.test(line)) bump("S1 legacy accents", rel, n)
    if (gradient.test(line)) bump("S2 gradients", rel, n)
    if (cardSurface.test(line)) bump("S3 card surfaces", rel, n)
    if (emoji.test(line)) bump("S4 emoji", rel, n)
    if (upperTracked.test(line)) bump("S5 uppercase tracked labels", rel, n)
    if (whiteAlphaSvg.test(line)) bump("S6 white-alpha SVG (invisible on paper)", rel, n)
    for (const m of line.matchAll(svgSmallFont)) {
      if (parseFloat(m[1]) < 11) bump("S7 SVG fontSize < 11", rel, n)
    }
    if (placeholder.test(line)) {
      bump("S8 placeholder images referenced", rel, n)
      if (STRICT_IMAGES) hard.push({ rule: "H3 placeholder image", rel, n, snippet: line.match(placeholder)[0] })
    }
    if (emDash.test(line) && !isJson) bump("S9 em dashes in copy", rel, n)
    if (/<AddLater\b/.test(line)) bump("S10 open AddLater notes", rel, n)
  })
}

if (AS_JSON) {
  console.log(JSON.stringify({ hard, soft }, null, 2))
} else {
  console.log("Ledger drift check\n")
  if (hard.length) {
    console.log(`HARD failures (${hard.length})`)
    for (const h of hard) console.log(`  ${h.rule}  ${h.rel}:${h.n}  ${h.snippet}`)
  } else {
    console.log("HARD failures: none")
  }
  console.log("\nSOFT drift (count per file)")
  for (const [rule, byFile] of Object.entries(soft).sort()) {
    const total = Object.values(byFile).reduce((s, l) => s + l.length, 0)
    console.log(`  ${rule}: ${total}`)
    for (const [rel, ls] of Object.entries(byFile).sort((a, b) => b[1].length - a[1].length)) {
      console.log(`      ${String(ls.length).padStart(3)}  ${rel}  (lines ${ls.slice(0, 6).join(", ")}${ls.length > 6 ? ", ..." : ""})`)
    }
  }
}

process.exit(hard.length ? 1 : 0)
