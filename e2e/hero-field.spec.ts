import { expect, test, type Page } from "@playwright/test"

// The hero's dot field: a live WebGL shader on desktop pointers, a static CSS
// dot grid everywhere else (phones, touch, reduced motion) with no shader code
// loaded at all.

async function openHome(page: Page) {
  await page.goto("/")
  await expect(page.locator("#hero [data-hero-field]")).toHaveCount(1)
}

// The wake shader's source is the one string only the shader chunk has.
function watchForShaderCode(page: Page) {
  const seen = { shader: false }
  page.on("response", async (response) => {
    if (response.request().resourceType() !== "script") return
    const body = await response.text().catch(() => "")
    if (body.includes("u_trail")) seen.shader = true
  })
  return seen
}

// The empty band between the headline and the portrait row: nothing but the
// dot field is drawn there, so any change in it comes from the field.
async function emptyBand(page: Page) {
  return page.evaluate(() => {
    const h1 = document.querySelector("#hero h1")!.getBoundingClientRect()
    const grid = document.querySelector("#hero .ledger-grid")!.getBoundingClientRect()
    return { top: Math.ceil(h1.bottom) + 8, bottom: Math.floor(grid.top) - 8, left: 100, right: 1200 }
  })
}

type Band = Awaited<ReturnType<typeof emptyBand>>

// Counts strongly inked pixels (resting dots are too faint to count) and
// ultramarine pixels in the band.
async function inkIn(page: Page, band: Band) {
  const png = await page.screenshot({ clip: { x: band.left, y: band.top, width: band.right - band.left, height: band.bottom - band.top } })
  return page.evaluate(async (b64) => {
    const img = new Image()
    img.src = `data:image/png;base64,${b64}`
    await img.decode()
    const canvas = Object.assign(document.createElement("canvas"), { width: img.width, height: img.height })
    const ctx = canvas.getContext("2d")!
    ctx.drawImage(img, 0, 0)
    const data = ctx.getImageData(0, 0, img.width, img.height).data
    let ink = 0
    let blue = 0
    for (let i = 0; i < data.length; i += 4) {
      const [r, g, b] = [data[i], data[i + 1], data[i + 2]]
      if (b > 150 && b - r > 80) blue++
      else if (0.299 * r + 0.587 * g + 0.114 * b < 110) ink++
    }
    return { ink, blue }
  }, png.toString("base64"))
}

async function liveField(page: Page) {
  await openHome(page)
  await expect(page.locator("#hero [data-hero-field] canvas")).toHaveCount(1, { timeout: 5000 })
  await page.waitForTimeout(800)
}

const staticDotsShown = (page: Page) =>
  page.locator("#hero [data-hero-dots]").evaluate((el) => getComputedStyle(el).display !== "none")

test("the hero dot field goes live on a desktop pointer", async ({ page }) => {
  const seen = watchForShaderCode(page)
  await openHome(page)
  await expect(page.locator("#hero [data-hero-field] canvas")).toHaveCount(1, { timeout: 5000 })
  expect(await staticDotsShown(page)).toBe(false)
  await expect.poll(() => seen.shader).toBe(true)
})

test("moving the cursor leaves a wake of ink pixels that fades away", async ({ page }) => {
  await liveField(page)
  const band = await emptyBand(page)
  const y = (band.top + band.bottom) / 2
  await page.mouse.move(band.left, y)
  const before = await inkIn(page, band)

  await page.mouse.move(band.right + 100, y, { steps: 24 })
  const during = await inkIn(page, band)
  expect(during.ink).toBeGreaterThan(before.ink + 1500)

  await page.waitForTimeout(3000)
  const after = await inkIn(page, band)
  expect(after.ink).toBeLessThan(before.ink + 200)
})

test("a click sends out a ring of ultramarine pixels", async ({ page }) => {
  await liveField(page)
  const band = await emptyBand(page)
  await page.mouse.click(650, (band.top + band.bottom) / 2)
  await page.waitForTimeout(120)
  // The band only catches the ring where it crosses it. The old dot ripple
  // printed ~270 blue pixels here; a ring of square pixels prints 1000+.
  const ring = await inkIn(page, band)
  expect(ring.blue).toBeGreaterThan(600)
})

test("the dot field is one full-width sheet that starts at the hero rule", async ({ page }) => {
  await openHome(page)
  const box = await page.evaluate(() => {
    const field = document.querySelector("#hero [data-hero-field]")!.getBoundingClientRect()
    const rule = document.querySelector("#hero [data-hero-rule]")!.getBoundingClientRect()
    return { fieldTop: field.top, ruleBottom: rule.bottom, left: field.left, right: field.right, vw: document.documentElement.clientWidth }
  })
  expect(box.fieldTop).toBeGreaterThanOrEqual(box.ruleBottom - 1)
  expect(box.fieldTop).toBeLessThanOrEqual(box.ruleBottom + 2)
  expect(box.left).toBeLessThanOrEqual(0)
  expect(box.right).toBeGreaterThanOrEqual(box.vw)
})

test("reduced motion keeps the static dots and skips the shader", async ({ page }) => {
  await page.emulateMedia({ reducedMotion: "reduce" })
  await openHome(page)
  await page.waitForTimeout(2500)
  await expect(page.locator("#hero [data-hero-field] canvas")).toHaveCount(0)
  expect(await staticDotsShown(page)).toBe(true)
})

test.describe("on a phone", () => {
  test.use({ viewport: { width: 375, height: 812 }, hasTouch: true, isMobile: true })

  test("the hero shows static dots and never loads the shader", async ({ page }) => {
    const seen = watchForShaderCode(page)
    await openHome(page)
    await page.waitForTimeout(2500)
    await expect(page.locator("#hero [data-hero-field] canvas")).toHaveCount(0)
    expect(await staticDotsShown(page)).toBe(true)
    expect(seen.shader).toBe(false)
  })
})
