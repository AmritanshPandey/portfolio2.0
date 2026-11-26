#!/usr/bin/env node
/**
 * Visual snapshots for the redesign loop. Uses the repo's @playwright/test.
 *
 *   npm run dev                                   # or: npm run build && npm start
 *   node scripts/snap.mjs --label before-p1       # every page, light + dark, desktop + phone
 *   node scripts/snap.mjs --label after-p1 --pages home,agent --themes light --widths 1440
 *
 * Output: snapshots/<label>/<page>/<theme>-<width>-<NN>.png, one frame per screen
 * from the top of the page down (default 8 frames; --frames 30 for whole pages).
 * Frames are viewport shots, not one tall capture: Chromium wraps tall
 * captures past ~8k px on this site (main is its own compositing layer).
 *
 * Reduced motion is on by default so the settle never leaves content mid-fade;
 * pass --motion to see the live first fold (hero animations, dot field) instead.
 *
 * Browser: run `npx playwright install chromium` once, or reuse an installed
 * Chrome with SNAP_CHANNEL=chrome, or point SNAP_EXECUTABLE at a binary.
 */
import { chromium } from "@playwright/test"
import fs from "node:fs"
import path from "node:path"

const PAGES = {
  home: "/",
  agent: "/work/agent-commerce",
  partnerbank: "/work/white-label-rfp",
  dror: "/work/citizen-safety",
  honasa: "/work/d2c-platform",
  email: "/work/email-builder",
  system: "/systems/fintech-ai-interface",
  planr: "/explorations/personal-execution-system",
  gallery: "/gallery",
  lab: "/playground",
  articles: "/articles",
  "agentic-essay": "/articles/silent-guardian-agentic-trust",
}

const argv = process.argv.slice(2)
const opt = (name, fallback) => {
  const i = argv.indexOf(`--${name}`)
  return i === -1 ? fallback : argv[i + 1]
}
const flag = (name) => argv.includes(`--${name}`)

const BASE = opt("base", process.env.SNAP_BASE ?? "http://localhost:3000")
const LABEL = opt("label", new Date().toISOString().slice(0, 16).replace(/[:T]/g, "-"))
const pageKeys = (opt("pages", "all") === "all" ? Object.keys(PAGES) : opt("pages").split(","))
const themes = opt("themes", "light,dark").split(",")
const widths = opt("widths", "1440,390").split(",").map(Number)
const FRAMES = Number(opt("frames", 8))
const MOTION = flag("motion")
const NAV_H = 64
const OUT = path.join(process.cwd(), "snapshots", LABEL)

for (const key of pageKeys) {
  if (!PAGES[key]) {
    console.error(`Unknown page "${key}". Known: ${Object.keys(PAGES).join(", ")}`)
    process.exit(2)
  }
}

const browser = await chromium.launch({
  channel: process.env.SNAP_CHANNEL || undefined,
  executablePath: process.env.SNAP_EXECUTABLE || undefined,
})

const index = []
for (const key of pageKeys) {
  for (const theme of themes) {
    for (const width of widths) {
      const phone = width < 600
      const context = await browser.newContext({
        viewport: { width, height: phone ? 844 : 900 },
        deviceScaleFactor: phone ? 2 : 1,
        isMobile: phone,
        hasTouch: phone,
        reducedMotion: MOTION ? "no-preference" : "reduce",
      })
      // next-themes reads localStorage before paint.
      await context.addInitScript((t) => {
        try {
          localStorage.setItem("theme", t)
        } catch {}
      }, theme)
      const page = await context.newPage()
      const dir = path.join(OUT, key)
      fs.mkdirSync(dir, { recursive: true })
      try {
        await page.goto(BASE + PAGES[key], { waitUntil: "load", timeout: 180_000 })
        await page.evaluate(() => document.fonts.ready)
        // Hide dev-only chrome so frames compare cleanly between dev and prod.
        await page.addStyleTag({ content: "nextjs-portal{display:none!important}" })
        await page.waitForTimeout(MOTION ? 3500 : 900)

        const total = await page.evaluate(() => document.documentElement.scrollHeight)
        const H = page.viewportSize().height
        let y = 0
        for (let n = 0; n < FRAMES; n++) {
          y = await page.evaluate(async (target) => {
            window.scrollTo(0, target)
            await new Promise((r) => setTimeout(r, 400))
            return Math.round(window.scrollY)
          }, y)
          const file = path.join(dir, `${theme}-${width}-${String(n + 1).padStart(2, "0")}.png`)
          await page.screenshot({ path: file })
          index.push({ page: key, theme, width, frame: n + 1, scrollY: y, file: path.relative(process.cwd(), file) })
          if (y + H >= total - 1) break
          y += H - NAV_H
        }
        console.log(`ok   ${key.padEnd(14)} ${theme.padEnd(5)} ${String(width).padStart(4)}  height ${total}`)
      } catch (err) {
        console.log(`FAIL ${key.padEnd(14)} ${theme.padEnd(5)} ${String(width).padStart(4)}  ${err.message.split("\n")[0]}`)
      } finally {
        await context.close()
      }
    }
  }
}

fs.mkdirSync(OUT, { recursive: true })
fs.writeFileSync(path.join(OUT, "index.json"), JSON.stringify({ base: BASE, motion: MOTION, frames: index }, null, 2))
await browser.close()
console.log(`\n${index.length} frames -> ${path.relative(process.cwd(), OUT)}`)
