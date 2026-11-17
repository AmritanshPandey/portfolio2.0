import { expect, test, type Page } from "@playwright/test"

// The two sounds beyond the plucked rules: a click ring in the hero's dots,
// and the fold phone's clasp. Both answer the visitor's own hand, never the
// page moving by itself, and both obey the sound toggle.

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

test("the fold phone clasps only when the reader folds it", async ({ page }) => {
  await page.goto("/work/agent-commerce")
  // Unlock audio before the phone's own intro fold runs.
  await page.locator("h1").click()
  const section = page.locator("#unfolded")
  await section.scrollIntoViewIfNeeded()
  const slider = section.locator('input[type="range"]')
  await expect(slider).toBeEnabled({ timeout: 15_000 })

  // The intro folds to 30° and back open by itself: no clasp.
  const before = await notes(page)
  await page.waitForTimeout(3200)
  expect(await notes(page)).toBe(before)

  const setFold = (value: number) =>
    slider.evaluate((el, v) => {
      const input = el as HTMLInputElement
      Object.getOwnPropertyDescriptor(HTMLInputElement.prototype, "value")!.set!.call(input, String(v))
      input.dispatchEvent(new Event("input", { bubbles: true }))
    }, value)

  await setFold(90)
  await setFold(0)
  await expect.poll(() => notes(page)).toBe(before + 1)
  await setFold(180)
  await expect.poll(() => notes(page)).toBe(before + 2)
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
