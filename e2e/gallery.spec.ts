import { expect, test, type Page } from "@playwright/test"

// The gallery header's ASCII field: animated on a desktop pointer, a still
// ASCII texture wherever animation wouldn't be smooth (phones, reduced motion,
// low battery), like the hero's dots.

// Tests must not depend on the host's battery: unless a test says otherwise,
// the device is plugged in.
test.beforeEach(async ({ page }) => {
  await page.addInitScript(() => {
    const battery = { charging: true, level: 1, addEventListener() {}, removeEventListener() {} }
    Object.defineProperty(navigator, "getBattery", { value: () => Promise.resolve(battery), configurable: true })
  })
})

const field = (page: Page) => page.locator("[data-gallery-ascii] canvas")

// What the field has drawn: total ink, and a fingerprint that changes when
// any glyph changes.
const snapshot = (page: Page) =>
  field(page).evaluate((canvas: HTMLCanvasElement) => {
    const data = canvas.getContext("2d")!.getImageData(0, 0, canvas.width, canvas.height).data
    let ink = 0
    let print = 0
    for (let i = 3; i < data.length; i += 4) {
      ink += data[i]
      print = (print * 31 + data[i] * (i % 997)) % 2147483647
    }
    return { ink, print }
  })

async function openGallery(page: Page) {
  await page.goto("/gallery")
  await expect(field(page)).toHaveCount(1, { timeout: 5000 })
  await expect.poll(async () => (await snapshot(page)).ink).toBeGreaterThan(0)
}

test("the gallery header has a live ASCII field on a desktop pointer", async ({ page }) => {
  await openGallery(page)
  const a = await snapshot(page)
  await page.waitForTimeout(700)
  const b = await snapshot(page)
  expect(b.print).not.toBe(a.print)
})

test("the ASCII field starts at the header rule, as one sheet", async ({ page }) => {
  await openGallery(page)
  const box = await page.evaluate(() => {
    const field = document.querySelector("[data-gallery-ascii]")!.getBoundingClientRect()
    const rule = document.querySelector("[data-gallery-ascii]")!.closest("section")!.querySelector("[data-hero-rule]")!.getBoundingClientRect()
    return { fieldTop: field.top, ruleBottom: rule.bottom, left: field.left, right: field.right, vw: document.documentElement.clientWidth }
  })
  expect(box.fieldTop).toBeGreaterThanOrEqual(box.ruleBottom - 1)
  expect(box.fieldTop).toBeLessThanOrEqual(box.ruleBottom + 2)
  expect(box.left).toBeLessThanOrEqual(0)
  expect(box.right).toBeGreaterThanOrEqual(box.vw)
})

test("reduced motion keeps the ASCII field still", async ({ page }) => {
  await page.emulateMedia({ reducedMotion: "reduce" })
  await openGallery(page)
  const a = await snapshot(page)
  await page.waitForTimeout(700)
  expect((await snapshot(page)).print).toBe(a.print)
})

test("a laptop on low battery keeps the ASCII field still", async ({ page }) => {
  await page.addInitScript(() => {
    const battery = { charging: false, level: 0.15, addEventListener() {}, removeEventListener() {} }
    Object.defineProperty(navigator, "getBattery", { value: () => Promise.resolve(battery), configurable: true })
  })
  await openGallery(page)
  await page.waitForTimeout(500)
  const a = await snapshot(page)
  await page.waitForTimeout(700)
  expect((await snapshot(page)).print).toBe(a.print)
})

test.describe("on a phone", () => {
  test.use({ viewport: { width: 375, height: 812 }, hasTouch: true, isMobile: true })

  test("the gallery shows a still ASCII texture", async ({ page }) => {
    await openGallery(page)
    const a = await snapshot(page)
    await page.waitForTimeout(700)
    expect((await snapshot(page)).print).toBe(a.print)
  })
})
