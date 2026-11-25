import { expect, test, type Page } from "@playwright/test"

// The sound beyond the plucked rules: a click ring in the hero's dots. It
// answers the visitor's own hand, never the page moving by itself, and obeys
// the sound toggle.

test.beforeEach(async ({ page }) => {
  await page.addInitScript(() => {
    // Plugged in, so the live sheet doesn't stand down for a low battery.
    const battery = { charging: true, level: 1, addEventListener() {}, removeEventListener() {} }
    Object.defineProperty(navigator, "getBattery", { value: () => Promise.resolve(battery), configurable: true })
    // Every note is one buffer source.
    const w = window as unknown as { __notes: number }
    w.__notes = 0
    const proto = window.AudioContext?.prototype
    if (!proto) return
    const create = proto.createBufferSource
    proto.createBufferSource = function (this: AudioContext) {
      w.__notes++
      return create.call(this)
    }
  })
})

const notes = (page: Page) => page.evaluate(() => (window as unknown as { __notes: number }).__notes)

// The empty band between the statement and the glass plate: only dots there.
async function bandY(page: Page) {
  return page.evaluate(() => {
    const h1 = document.querySelector("#hero h1")!.getBoundingClientRect()
    const glass = document.querySelector("#hero .glass-plate")!.getBoundingClientRect()
    return Math.round((h1.bottom + glass.top) / 2)
  })
}

async function liveHero(page: Page) {
  await page.goto("/")
  await expect(page.locator("#hero [data-hero-field] canvas")).toHaveCount(1, { timeout: 5000 })
  await page.waitForTimeout(800)
}

test("a click ring in the hero's dots sounds one soft note", async ({ page }) => {
  await liveHero(page)
  const y = await bandY(page)
  // The first click is the gesture that lets audio start.
  await page.mouse.click(120, y)
  await page.waitForTimeout(300)

  const before = await notes(page)
  await page.mouse.click(650, y)
  await expect.poll(() => notes(page)).toBe(before + 1)

  // A click on the glass card is a click on the card: no ring, no note.
  const glass = (await page.locator("#hero .glass-plate").boundingBox())!
  const atGlass = await notes(page)
  await page.mouse.click(glass.x + glass.width - 40, glass.y + 40)
  await page.waitForTimeout(200)
  expect(await notes(page)).toBe(atGlass)
})

test("with sound off, a click ring is silent", async ({ page }) => {
  await liveHero(page)
  const toggle = page.getByRole("button", { name: "Sound" })
  await toggle.click()
  await expect(toggle).toHaveAttribute("aria-pressed", "false")

  const y = await bandY(page)
  const before = await notes(page)
  await page.mouse.click(650, y)
  await page.waitForTimeout(300)
  expect(await notes(page)).toBe(before)
})

test("the fold phone unfolds with the scroll: no controls, no sound", async ({ page }) => {
  await page.goto("/work/agent-commerce")
  // Audio is unlocked, so a sound would be heard.
  await page.locator("h1").click()
  const section = page.locator("#unfolded")
  await section.scrollIntoViewIfNeeded()
  await expect(section.locator("canvas")).toBeAttached({ timeout: 15_000 })
  await expect(section.locator("input, button")).toHaveCount(0)
  const before = await notes(page)
  await section.evaluate((el) => window.scrollTo({ top: el.getBoundingClientRect().bottom + scrollY - innerHeight, behavior: "instant" }))
  await page.waitForTimeout(1200)
  expect(await notes(page)).toBe(before)
})

test("with reduced motion, clicks in the hero make no sound", async ({ page }) => {
  await page.emulateMedia({ reducedMotion: "reduce" })
  await page.goto("/")
  await page.waitForTimeout(1500)
  const y = await bandY(page)
  await page.mouse.click(120, y)
  await page.waitForTimeout(300)
  await page.mouse.click(650, y)
  await page.waitForTimeout(300)
  expect(await notes(page)).toBe(0)
})
