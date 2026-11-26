import { expect, test, type Page } from "@playwright/test"

// The Lab: working experiments pinned once each to a sheet larger than the
// screen. It pans by drag, trackpad or arrow keys, stops at its edges and
// never moves on its own. Opening a tile runs the piece live.

const tiles = (page: Page) => page.locator("[data-lab-tile]")
const sheet = (page: Page) => page.getByRole("region", { name: "Experiments" })

async function drag(page: Page, from: { x: number; y: number }, to: { x: number; y: number }) {
  await page.mouse.move(from.x, from.y)
  await page.mouse.down()
  await page.mouse.move(to.x, to.y, { steps: 10 })
  await page.mouse.up()
}

test("the intro is visible and each experiment is pinned exactly once", async ({ page }) => {
  await page.goto("/playground")
  await expect(page.getByRole("heading", { level: 1, name: "Lab" })).toBeVisible()
  await expect(page.getByText(/^Working pieces, not screenshots/)).toBeVisible()

  const ids = await tiles(page).evaluateAll((els) => els.map((el) => el.getAttribute("data-lab-tile")))
  expect(ids).toHaveLength(9)
  expect(new Set(ids).size).toBe(9)
})

test("the sheet stays put until it is moved", async ({ page }) => {
  await page.goto("/playground")
  const first = tiles(page).first()
  const before = (await first.boundingBox())!
  await page.waitForTimeout(600)
  expect((await first.boundingBox())!.x).toBe(before.x)
})

test("dragging pans the sheet, and it stops at its edges", async ({ page }) => {
  await page.goto("/playground")
  const frame = (await sheet(page).boundingBox())!
  const first = tiles(page).first()
  const start = (await first.boundingBox())!

  // Far more drag than the sheet has room for, from empty paper each time.
  for (let i = 0; i < 3; i++) {
    await drag(
      page,
      { x: frame.x + frame.width - 4, y: frame.y + frame.height - 4 },
      { x: frame.x + 4, y: frame.y + 4 },
    )
  }
  await expect.poll(async () => (await first.boundingBox())!.x).toBeLessThan(start.x)

  // Once the glide has stopped, it rests against the bottom-right edge: the
  // furthest tiles sit inside the frame, a margin short of it, not past it.
  const extent = () =>
    tiles(page).evaluateAll((els) => {
      const boxes = els.map((el) => el.getBoundingClientRect())
      return { right: Math.max(...boxes.map((b) => b.right)), bottom: Math.max(...boxes.map((b) => b.bottom)) }
    })
  let last = ""
  await expect
    .poll(async () => {
      const now = JSON.stringify(await extent())
      const still = now === last
      last = now
      return still
    }, { intervals: [250] })
    .toBe(true)
  const { right, bottom } = await extent()
  expect(right).toBeLessThanOrEqual(frame.x + frame.width)
  expect(right).toBeGreaterThan(frame.x + frame.width - 100)
  expect(bottom).toBeLessThanOrEqual(frame.y + frame.height)
  expect(bottom).toBeGreaterThan(frame.y + frame.height - 100)
})

test("a drag that starts on a tile pans instead of opening it", async ({ page }) => {
  await page.goto("/playground")
  const box = (await tiles(page).first().boundingBox())!
  const from = { x: box.x + box.width / 2, y: box.y + box.height / 2 }
  await drag(page, from, { x: from.x - 160, y: from.y - 60 })
  await page.waitForTimeout(300)
  await expect(page.getByRole("dialog")).toHaveCount(0)
  expect((await tiles(page).first().boundingBox())!.x).toBeLessThan(box.x)
})

test("the arrow keys pan the sheet", async ({ page }) => {
  await page.goto("/playground")
  const first = tiles(page).first()
  const before = (await first.boundingBox())!
  await sheet(page).focus()
  await page.keyboard.press("ArrowRight")
  await expect.poll(async () => (await first.boundingBox())!.x).toBeLessThan(before.x)
})

test("opening a tile runs the piece and links to where it is used", async ({ page }) => {
  await page.goto("/playground")
  await page.locator('[data-lab-tile="brand-skins"]').click()

  const dialog = page.getByRole("dialog", { name: "Brand skin wipe" })
  await expect(dialog).toBeVisible()
  await expect(dialog.getByText("Loading experiment…")).toHaveCount(0)
  await expect(dialog.getByRole("link", { name: "White-label RFP" })).toHaveAttribute(
    "href",
    "/work/white-label-rfp#tokens",
  )

  await page.keyboard.press("Escape")
  await expect(dialog).toBeHidden()
})

test.describe("on a phone", () => {
  test.use({ viewport: { width: 390, height: 844 }, hasTouch: true, isMobile: true })

  test("the intro and tiles show, and a tap opens a piece", async ({ page }) => {
    await page.goto("/playground")
    await expect(page.getByRole("heading", { level: 1, name: "Lab" })).toBeVisible()
    await tiles(page).first().tap()
    await expect(page.getByRole("dialog", { name: "Brand skin wipe" })).toBeVisible()
  })
})
