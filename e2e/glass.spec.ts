import { expect, test, type Page } from "@playwright/test"

// Liquid glass is for the layer that floats over content (the nav bars, the
// phone menu button and secondary buttons) and for the plate under the
// hero's intro. The page shows through them, blurred; primary
// actions and everything else stay solid. Chromium on a desktop pointer bends
// what passes under the plate's rim with an SVG lens.

type Material = { blur: boolean; alpha: number }

// The material an element is drawn in: whether it blurs what is behind it,
// and how opaque its own background is.
function material(page: Page, selector: string): Promise<Material> {
  return page.locator(selector).first().evaluate((el) => {
    const cs = getComputedStyle(el)
    const filter = cs.backdropFilter || cs.getPropertyValue("-webkit-backdrop-filter")
    const bg = cs.backgroundColor
    const slash = bg.match(/\/\s*([\d.]+)\s*\)$/)
    const rgba = bg.match(/^rgba\([^)]*,\s*([\d.]+)\)$/)
    const alpha = bg === "transparent" ? 0 : Number(slash?.[1] ?? rgba?.[1] ?? 1)
    // The lens is an SVG filter that blurs as part of its chain.
    return { blur: filter.includes("blur") || filter.includes("url("), alpha }
  })
}

const isGlass = (m: Material) => m.blur && m.alpha > 0.5 && m.alpha < 1

test("the nav bar is glass", async ({ page }) => {
  await page.goto("/")
  expect(isGlass(await material(page, "header"))).toBe(true)
})

test("the secondary action is glass and the primary stays solid ink", async ({ page }) => {
  await page.goto("/")
  const secondary = await material(page, "#hero a.btn-line")
  const primary = await material(page, "#hero a.btn-ink")
  expect(isGlass(secondary)).toBe(true)
  expect(primary).toEqual({ blur: false, alpha: 1 })
})

test("the hero's intro sits on a glass plate", async ({ page }) => {
  await page.goto("/")
  const plate = page.locator("#hero .glass-plate")
  await expect(plate).toHaveCount(1)
  await expect(plate).toContainText("Senior UX Designer at Mastercard.")
  await expect(plate.getByRole("link", { name: /View selected work/ })).toBeVisible()

  const m = await material(page, "#hero .glass-plate")
  // Translucent enough to read as glass, opaque enough to keep text at AA.
  expect(m.blur).toBe(true)
  expect(m.alpha).toBeGreaterThanOrEqual(0.5)
  expect(m.alpha).toBeLessThan(0.7)
})

test("in Chromium the plate's rim bends what is under it; elsewhere it is plain glass", async ({ page, browserName }) => {
  await page.goto("/")
  const plate = page.locator("#hero .glass-plate").first()
  if (browserName === "chromium") {
    await expect(plate).toHaveAttribute("data-lens", "")
    await expect(plate.locator("filter feDisplacementMap")).toHaveCount(1)
    expect(await plate.evaluate((el) => getComputedStyle(el).backdropFilter)).toMatch(/^url\(/)
  } else {
    await page.waitForTimeout(500)
    await expect(plate).not.toHaveAttribute("data-lens")
    expect(await plate.evaluate((el) => getComputedStyle(el).backdropFilter)).toContain("blur")
  }
})

test.describe("on a phone", () => {
  test.use({ viewport: { width: 390, height: 844 }, hasTouch: true, isMobile: true })

  test("the header and the menu button are glass", async ({ page }) => {
    await page.goto("/")
    const menu = page.getByRole("button", { name: "Open navigation menu" })
    await expect(menu).toBeVisible()
    expect(isGlass(await material(page, 'button[aria-label="Open navigation menu"]'))).toBe(true)

    // The phone header is whatever bar sits under the top-left corner.
    const header = await page.evaluate(() => {
      let el = document.elementFromPoint(4, 4)
      while (el && !getComputedStyle(el).backdropFilter.includes("blur") && !getComputedStyle(el).getPropertyValue("-webkit-backdrop-filter").includes("blur")) {
        el = el.parentElement
      }
      return el ? getComputedStyle(el).position : null
    })
    expect(header).toBe("fixed")
  })

  test("the plate stays plain glass, without the lens", async ({ page }) => {
    await page.goto("/")
    const plate = page.locator("#hero .glass-plate").first()
    await expect(plate).toBeVisible()
    await page.waitForTimeout(500)
    await expect(plate).not.toHaveAttribute("data-lens")
  })
})
