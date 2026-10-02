#!/usr/bin/env node
// Fails (exit 1) if any text/background token pair in app/globals.css is
// below WCAG AA in either theme. Run: npm run check:contrast
import { readFileSync } from "node:fs"
import { checkContrast, MIN_RATIO } from "./lib/contrast-check.mjs"

const css = readFileSync(new URL("../app/globals.css", import.meta.url), "utf8")
const { results, failures } = checkContrast(css)

for (const r of results) {
  const detail = r.ratio === null ? r.reason : `${r.ratio.toFixed(2)}:1`
  console.log(`${r.pass ? "PASS" : "FAIL"}  ${r.name.padEnd(48)} ${detail}`)
}

if (failures.length) {
  console.error(`\n${failures.length} pair(s) below AA (${MIN_RATIO}:1).`)
  process.exit(1)
}
console.log(`\nAll ${results.length} pairs meet AA (${MIN_RATIO}:1).`)
