import { expect, test } from "@playwright/test"

// Snappiness budgets: native scrolling, and motion that finishes quickly
// enough that nobody waits on it.

test("scrolling is native: no smooth-scroll library takes over the wheel", async ({ page }) => {
  await page.goto("/")
  await page.waitForTimeout(1000)
  const hijacked = await page.evaluate(
    () => "__lenis" in window || document.documentElement.classList.contains("lenis"),
  )
  expect(hijacked).toBe(false)
})

test("the hero's landing takes under 0.9s from first frame to last", async ({ page }) => {
  await page.goto("/")
  // The motion's own length (delay + duration of its last animation), so page
  // load time can't make this flaky.
  const length = await page.evaluate(() => {
    const hero = document.querySelector("#hero")!
    return Math.max(
      ...document
        .getAnimations()
        .filter((a) => {
          const target = (a.effect as KeyframeEffect | null)?.target
          return target instanceof Element && hero.contains(target)
        })
        .map((a) => Number(a.effect!.getComputedTiming().endTime)),
    )
  })
  expect(length).toBeGreaterThan(0)
  expect(length).toBeLessThan(900)
})

test("a block scrolled into view has landed within 0.75s", async ({ page }) => {
  await page.goto("/")
  await page.waitForTimeout(800)
  const rows = page.locator(".work-row")
  const fourth = rows.nth(Math.min(3, (await rows.count()) - 1))
  // Bring the fourth row's top into view, instantly, and time it (stagger
  // included) until it is fully opaque and in place.
  const elapsed = await fourth.evaluate(async (row) => {
    window.scrollTo({ top: row.getBoundingClientRect().top + window.scrollY - window.innerHeight * 0.6, behavior: "instant" })
    const start = performance.now()
    return new Promise<number>((resolve) => {
      const check = () => {
        const style = getComputedStyle(row)
        if (row.hasAttribute("data-settled") && style.opacity === "1" && style.transform === "none") {
          resolve(performance.now() - start)
        } else if (performance.now() - start > 3000) resolve(Infinity)
        else requestAnimationFrame(check)
      }
      requestAnimationFrame(check)
    })
  })
  // ~0.5s of motion (stagger + transition) plus the observer's ~0.15s;
  // the old timings took ~1.1s.
  expect(elapsed).toBeLessThan(750)
})

test("page changes cross-fade in a quarter of a second or less", async ({ page }) => {
  await page.goto("/")
  const durations = await page.evaluate(() => {
    const found: string[] = []
    const walk = (rules: CSSRuleList) => {
      for (const rule of Array.from(rules)) {
        if ("cssRules" in rule && (rule as CSSGroupingRule).cssRules) walk((rule as CSSGroupingRule).cssRules)
        if (rule instanceof CSSStyleRule && rule.selectorText.includes("::view-transition-")) {
          const d = rule.style.animationDuration
          if (d) found.push(d)
        }
      }
    }
    for (const sheet of Array.from(document.styleSheets)) {
      try {
        walk(sheet.cssRules)
      } catch {}
    }
    return found
  })
  // "auto" is the reduced-motion rule switching the animation off; anything
  // else must be a plain duration within budget.
  const timed = durations.filter((d) => d !== "auto")
  expect(timed.length).toBeGreaterThan(0)
  for (const d of timed) {
    const match = /^([\d.]+)(ms|s)$/.exec(d)
    expect(match, `view-transition duration "${d}"`).not.toBeNull()
    const ms = parseFloat(match![1]) * (match![2] === "s" ? 1000 : 1)
    expect(ms).toBeLessThanOrEqual(250)
  }
})

test("scrolling straight after load is never pulled back to the top", async ({ page }) => {
  await page.goto("/")
  await page.mouse.move(640, 400)
  await page.mouse.wheel(0, 900)
  await page.waitForTimeout(1200)
  expect(await page.evaluate(() => window.scrollY)).toBeGreaterThan(400)
})

test("an anchor link lands its section just below the nav", async ({ page }) => {
  await page.goto("/")
  await page.waitForTimeout(800)
  await page.getByRole("link", { name: "View selected work" }).first().click()
  await expect
    .poll(async () => page.evaluate(() => Math.round(document.getElementById("work")!.getBoundingClientRect().top)), {
      timeout: 4000,
    })
    .toBeGreaterThanOrEqual(0)
  await page.waitForTimeout(1500)
  const top = await page.evaluate(() => document.getElementById("work")!.getBoundingClientRect().top)
  expect(top).toBeGreaterThanOrEqual(0)
  expect(top).toBeLessThan(140)
})
