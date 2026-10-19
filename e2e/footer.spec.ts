import { expect, test, type Page } from "@playwright/test"

// The footer's ASCII sea: swell lines of mono glyphs that rise and fall under
// the colophon. Live on a desktop pointer while it is on screen; a still frame
// wherever the site's other ambient layers hold still (phones, reduced motion).

// Tests must not depend on the host's battery: the device is plugged in.
test.beforeEach(async ({ page }) => {
  await page.addInitScript(() => {
    const battery = { charging: true, level: 1, addEventListener() {}, removeEventListener() {} }
    Object.defineProperty(navigator, "getBattery", { value: () => Promise.resolve(battery), configurable: true })
  })
})

const sea = (page: Page) => page.locator("[data-footer-sea] canvas")

// What the sea has drawn: total ink, a fingerprint that changes when any glyph
// moves, and the average brightness of the inked pixels (0 black, 255 white).
const snapshot = (page: Page) =>
  sea(page).evaluate((canvas: HTMLCanvasElement) => {
    const data = canvas.getContext("2d")!.getImageData(0, 0, canvas.width, canvas.height).data
    let ink = 0
    let print = 0
    let lum = 0
    for (let i = 0; i < data.length; i += 4) {
      const a = data[i + 3]
      ink += a
      lum += a * (data[i] * 0.299 + data[i + 1] * 0.587 + data[i + 2] * 0.114)
      print = (print * 31 + a * ((i + 3) % 997)) % 2147483647
    }
    return { ink, print, lum: ink ? lum / ink : 0 }
  })

async function openFooter(page: Page) {
  await page.goto("/")
  await expect(sea(page)).toHaveCount(1, { timeout: 5000 })
  await sea(page).scrollIntoViewIfNeeded()
  await expect.poll(async () => (await snapshot(page)).ink).toBeGreaterThan(0)
}

const isStill = async (page: Page) => {
  const a = await snapshot(page)
  await page.waitForTimeout(700)
  return (await snapshot(page)).print === a.print
}

test("the footer has a live ASCII sea on a desktop pointer", async ({ page }) => {
  await openFooter(page)
  expect(await isStill(page)).toBe(false)
})

test("the sea runs the full width of the page, under the footer links", async ({ page }) => {
  await openFooter(page)
  const box = await page.evaluate(() => {
    const sea = document.querySelector("[data-footer-sea]")!.getBoundingClientRect()
    const links = document.querySelector('footer nav[aria-label="Footer links"]')!.getBoundingClientRect()
    return { top: sea.top, height: sea.height, left: sea.left, right: sea.right, linksBottom: links.bottom, vw: document.documentElement.clientWidth }
  })
  expect(box.top).toBeGreaterThan(box.linksBottom)
  expect(box.height).toBeGreaterThan(100)
  expect(box.left).toBeLessThanOrEqual(0)
  expect(box.right).toBeGreaterThanOrEqual(box.vw)
})

test("the sea stops while it is off screen", async ({ page }) => {
  await openFooter(page)
  await page.evaluate(() => window.scrollTo(0, 0))
  await page.waitForTimeout(300)
  expect(await isStill(page)).toBe(true)
})

test("the sea stops in a hidden tab", async ({ page }) => {
  await openFooter(page)
  await page.evaluate(() => {
    Object.defineProperty(document, "visibilityState", { value: "hidden", configurable: true })
    document.dispatchEvent(new Event("visibilitychange"))
  })
  await page.waitForTimeout(100)
  expect(await isStill(page)).toBe(true)
})

test("reduced motion shows a still sea", async ({ page }) => {
  await page.emulateMedia({ reducedMotion: "reduce" })
  await openFooter(page)
  expect(await isStill(page)).toBe(true)
})

test("the sea redraws in the night palette when the theme flips", async ({ page }) => {
  await page.emulateMedia({ reducedMotion: "reduce" })
  await openFooter(page)
  const light = await snapshot(page)
  await page.evaluate(() => {
    document.documentElement.classList.remove("light")
    document.documentElement.classList.add("dark")
  })
  await expect.poll(async () => (await snapshot(page)).lum).toBeGreaterThan(light.lum + 30)
})

test.describe("on a phone", () => {
  test.use({ viewport: { width: 375, height: 812 }, hasTouch: true, isMobile: true })

  test("the footer shows a still sea, with nothing to scroll sideways", async ({ page }) => {
    await openFooter(page)
    expect(await isStill(page)).toBe(true)
    const overflow = await page.evaluate(() => document.documentElement.scrollWidth - document.documentElement.clientWidth)
    expect(overflow).toBeLessThanOrEqual(0)
  })
})
