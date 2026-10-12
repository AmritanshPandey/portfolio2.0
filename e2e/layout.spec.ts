import { expect, test } from "@playwright/test"
import { accessToken } from "@/lib/gate"
import { E2E_PASSWORD, E2E_PORT } from "./constants"

// Content that runs past the right edge on a phone gets clipped by <main>'s
// overflow-x: clip, so it is cut off rather than scrollable. Anything inside an
// intentional horizontal scroller (a chip row, a carousel) is allowed.
const PAGES = ["/", "/work/white-label-rfp", "/work/citizen-safety", "/articles", "/explorations/personal-execution-system"]

for (const path of PAGES) {
  test(`nothing is clipped at 375px on ${path}`, async ({ page }) => {
    await page.context().addCookies([{ name: "site_access", value: await accessToken(E2E_PASSWORD), url: `http://localhost:${E2E_PORT}` }])
    await page.setViewportSize({ width: 375, height: 812 })
    await page.goto(path)
    const clipped = await page.evaluate(() => {
      const vw = document.documentElement.clientWidth
      const inScroller = (el: Element) => {
        for (let p = el.parentElement; p && p !== document.body; p = p.parentElement) {
          if (p.tagName === "MAIN") return false
          const ox = getComputedStyle(p).overflowX
          if (ox === "auto" || ox === "scroll" || ox === "hidden") return true
        }
        return false
      }
      return [...document.querySelectorAll("main h1, main h2, main h3, main p, main a, main li")]
        .filter((el) => {
          const r = el.getBoundingClientRect()
          return r.width > 0 && r.right > vw + 1 && !inScroller(el)
        })
        .slice(0, 5)
        .map((el) => `${el.tagName} "${(el.textContent ?? "").trim().slice(0, 40)}" right=${Math.round(el.getBoundingClientRect().right)}`)
    })
    expect(clipped).toEqual([])
  })
}
