import { expect, test, type Page } from "@playwright/test"
import { accessToken } from "@/lib/gate"
import { E2E_PASSWORD, E2E_PORT } from "./constants"

// The hero's dot field: a live WebGL shader on desktop pointers, a static CSS
// dot grid everywhere else (phones, touch, reduced motion) with no shader code
// loaded at all.

async function openHome(page: Page) {
  await page.context().addCookies([{ name: "site_access", value: await accessToken(E2E_PASSWORD), url: `http://localhost:${E2E_PORT}` }])
  await page.goto("/")
  await expect(page.locator("#hero [data-hero-field]")).toHaveCount(1)
}

// The fragment shader's source is the one string only the shader chunk has.
function watchForShaderCode(page: Page) {
  const seen = { shader: false }
  page.on("response", async (response) => {
    if (response.request().resourceType() !== "script") return
    const body = await response.text().catch(() => "")
    if (body.includes("u_ripple")) seen.shader = true
  })
  return seen
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
