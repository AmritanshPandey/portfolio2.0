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

const WORK = ["/work/white-label-rfp", "/work/agent-commerce", "/work/d2c-platform", "/work/citizen-safety", "/work/email-builder"]

async function pastHero(page: Page) {
  await page.evaluate(() => {
    const hero = document.querySelector("[data-cs-hero-inner]")!
    window.scrollTo(0, hero.getBoundingClientRect().bottom + window.scrollY + 200)
  })
  await page.waitForTimeout(400)
}

test.describe("the index", () => {
  test.use({ viewport: { width: 1440, height: 900 } })

  test("lists studies in home order and marks this one", async ({ page }) => {
    await page.goto("/work/agent-commerce")
    await pastHero(page)
    const index = page.locator("[data-study-index]")
    const hrefs = await index.locator("a[data-study-href]").evaluateAll((as) => as.map((a) => a.getAttribute("href")))
    expect(hrefs.slice(0, 5)).toEqual(WORK)
    await expect(index.locator('a[href="/work/agent-commerce"]')).toHaveAttribute("aria-current", "page")
    await expect(index.getByRole("link", { name: "All work" })).toHaveAttribute("href", "/#work")
  })

  test("labels the explorations self-directed", async ({ page }) => {
    await page.goto("/work/agent-commerce")
    const text = await page.locator("[data-study-index]").innerText()
    expect(text.indexOf("Self-directed")).toBeGreaterThan(-1)
    expect(text.indexOf("Self-directed")).toBeLessThan(text.indexOf("PlanR"))
  })

  test("waits for the hero and steps aside for the ending", async ({ page }) => {
    await page.goto("/work/agent-commerce")
    const index = page.locator("[data-study-index]")
    await expect(index).toHaveAttribute("data-shown", "false")
    await pastHero(page)
    await expect(index).toHaveAttribute("data-shown", "true")
    await page.locator("[data-study-next]").scrollIntoViewIfNeeded()
    await expect(index).toHaveAttribute("data-shown", "false")
  })

  test("stays pinned to the screen, with the tracker", async ({ page }) => {
    await page.goto("/work/agent-commerce")
    await pastHero(page)
    const strip = (await page.locator("[data-study-index]").boundingBox())!
    expect(strip.y + strip.height).toBeLessThanOrEqual(900 + 1)
    expect(strip.y).toBeGreaterThan(900 - 200)
    const rail = (await page.locator("[data-study-tracker]").boundingBox())!
    expect(rail.y).toBeGreaterThanOrEqual(0)
    expect(rail.y + rail.height).toBeLessThanOrEqual(900)
    // Solid, edge to edge: the page never shows through it.
    expect(strip.width).toBe(1440)
    const bg = await page.locator("[data-study-index]").evaluate((el) => getComputedStyle(el).backgroundColor)
    expect(bg).not.toMatch(/rgba\(.*, 0(\.\d+)?\)$|transparent/)
  })

  test("still shows with reduced motion, without sliding", async ({ page }) => {
    await page.emulateMedia({ reducedMotion: "reduce" })
    await page.goto("/work/agent-commerce")
    await pastHero(page)
    const index = page.locator("[data-study-index]")
    await expect(index).toHaveAttribute("data-shown", "true")
    expect(await index.evaluate((el) => parseFloat(getComputedStyle(el).transitionDuration))).toBeLessThan(0.01)
  })
})

test.describe("the index on a phone", () => {
  test.use({ viewport: { width: 390, height: 844 }, isMobile: true, hasTouch: true })

  test("opens a sheet and closes on Escape", async ({ page }) => {
    await page.goto("/work/agent-commerce")
    await pastHero(page)
    const trigger = page.locator("[data-study-index-trigger]")
    await expect(trigger).toHaveText("02 / 05 · Agent Pay")
    await trigger.click()
    const sheet = page.getByRole("dialog", { name: "All studies" })
    await expect(sheet).toBeVisible()
    await expect(sheet.locator("a[data-study-href]")).toHaveCount(6)
    await page.keyboard.press("Escape")
    await expect(sheet).toBeHidden()
    await expect(trigger).toBeFocused()
  })

  test("moving to another study closes the sheet", async ({ page }) => {
    await page.goto("/work/agent-commerce")
    await pastHero(page)
    await page.locator("[data-study-index-trigger]").click()
    const sheet = page.getByRole("dialog", { name: "All studies" })
    await sheet.locator('a[href="/work/white-label-rfp"]').click()
    await page.waitForURL("**/work/white-label-rfp")
    await expect(sheet).toBeHidden()
    await expect(page.locator("[data-study-index-trigger]")).toHaveText("01 / 05 · PartnerBank")
  })
})

test.describe("every study page", () => {
  test.use({ viewport: { width: 1440, height: 900 } })

  for (const path of [...WORK, "/explorations/personal-execution-system"]) {
    test(`${path} has the layer and none of the old navigation`, async ({ page }) => {
      await page.goto(path)
      await expect(page.locator("[data-study-index]")).toHaveCount(1)
      if (path.startsWith("/work/")) {
        await expect(page.locator("[data-study-tracker]")).toHaveCount(1)
        await expect(page.locator("[data-study-next]")).toHaveCount(1)
      }
      await expect(page.getByRole("heading", { name: "More case studies" })).toHaveCount(0)
      await expect(page.locator('[aria-label="Case study sections"]')).toHaveCount(0)
    })
  }
})
