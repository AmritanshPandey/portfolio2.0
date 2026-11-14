import { expect, test, type Page } from "@playwright/test"

// The study navigation layer (docs/superpowers/specs/2026-11-14-study-template-design.md):
// the place tracker, the index switcher and the next-study ending, on every
// case study and exploration.

const STUDY = "/work/white-label-rfp"

// Brings a section's top just under the tracker's line (30% down the screen).
async function readSection(page: Page, id: string) {
  await page.evaluate((id) => {
    const el = document.getElementById(id)!
    window.scrollTo(0, el.getBoundingClientRect().top + window.scrollY - window.innerHeight * 0.2)
  }, id)
  await page.waitForTimeout(300)
}

test.describe("the place tracker", () => {
  test.use({ viewport: { width: 1440, height: 900 } })

  test("names the chapter in view", async ({ page }) => {
    await page.goto(STUDY)
    await readSection(page, "stakes")
    await expect(page.locator('[data-study-tracker] [aria-current="location"]')).toContainText("The Stakes")
  })

  test("has no chapter active above the first", async ({ page }) => {
    await page.goto(STUDY)
    await page.evaluate(() => window.scrollTo(0, document.documentElement.scrollHeight))
    await page.waitForTimeout(300)
    await page.evaluate(() => window.scrollTo(0, 0))
    await page.waitForTimeout(300)
    await expect(page.locator("[data-study-tracker]")).toHaveCount(1)
    await expect(page.locator('[data-study-tracker] [aria-current="location"]')).toHaveCount(0)
  })

  test("only labelled sections are chapters", async ({ page }) => {
    await page.goto(STUDY)
    const chapters = await page.locator("main section[data-chapter]").count()
    expect(chapters).toBeGreaterThan(0)
    await expect(page.locator("[data-study-tracker] a")).toHaveCount(chapters)
    const unlabelled = await page.locator("main section:not([data-chapter])").count()
    expect(unlabelled).toBeGreaterThan(0)
  })
})

test.describe("the place tracker on a phone", () => {
  test.use({ viewport: { width: 390, height: 844 }, isMobile: true, hasTouch: true })

  test("shows the current chapter under the nav", async ({ page }) => {
    await page.goto(STUDY)
    await readSection(page, "stakes")
    await expect(page.locator("[data-study-tracker-phone]")).toContainText("The Stakes")
  })
})

test.describe("the ending", () => {
  test.use({ viewport: { width: 1440, height: 900 } })

  test("leads to the next study", async ({ page }) => {
    await page.goto("/work/white-label-rfp")
    const next = page.locator("[data-study-next] a").first()
    await expect(next).toHaveAttribute("href", "/work/agent-commerce")
    await expect(next).toContainText("Agent Pay")
  })

  test("wraps from the last study to the first", async ({ page }) => {
    await page.goto("/work/email-builder")
    await expect(page.locator("[data-study-next] a").first()).toHaveAttribute("href", "/work/white-label-rfp")
  })

  test("a page outside the index has no ending, and nothing breaks", async ({ page }) => {
    const errors: string[] = []
    page.on("pageerror", (e) => errors.push(e.message))
    await page.goto("/explorations/smart-journal")
    await page.waitForTimeout(500)
    await expect(page.locator("[data-study-next]")).toHaveCount(0)
    expect(errors).toEqual([])
  })
})
