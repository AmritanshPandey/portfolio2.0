import { expect, test, type Page } from "@playwright/test"

// The hero portrait is drawn in the sheet's own dot screen on a desktop
// pointer: a halftone of the photo that the cursor's wake turns into colour
// pixels, and that develops into the photo when the cursor rests on it. The
// real photo stays in the page throughout; phones, touch and reduced motion
// see only it. Beside it, the intro's glass plate matches the photo's height
// and catches the pointer's light.

const frame = (page: Page) => page.locator("[data-halftone]")

// Colour the portrait's canvas has drawn: pixels that are clearly not grey
// (the halftone is all ink; only lit cells carry the photo's colour).
const colourDrawn = (page: Page) =>
  page.locator("[data-halftone] canvas").evaluate((c: HTMLCanvasElement) => {
    const data = c.getContext("2d")!.getImageData(0, 0, c.width, c.height).data
    let n = 0
    for (let i = 0; i < data.length; i += 4) {
      if (data[i + 3] > 200 && Math.abs(data[i] - data[i + 1]) + Math.abs(data[i + 1] - data[i + 2]) > 40) n++
    }
    return n
  })

async function onTheScreen(page: Page) {
  await page.goto("/")
  await expect(frame(page)).toHaveAttribute("data-halftone", "screen", { timeout: 5000 })
  // The pointer can only reach what is on screen.
  await frame(page).scrollIntoViewIfNeeded()
}

test("on a desktop pointer the portrait is a halftone, with the photo still in the page", async ({ page }) => {
  await onTheScreen(page)
  await expect(frame(page).locator("canvas")).toHaveCount(1)
  await expect(page.getByRole("img", { name: "Amritansh Pandey" })).toBeAttached()
  await expect.poll(() => colourDrawn(page)).toBeLessThan(50)
})

test("the cursor's wake lights colour pixels across the portrait", async ({ page }) => {
  await onTheScreen(page)
  // Let the intro dissolve settle into plain dots first.
  await expect.poll(() => colourDrawn(page)).toBeLessThan(50)
  const box = (await frame(page).boundingBox())!
  const y = box.y + box.height * 0.4
  for (let i = 0; i <= 12; i++) {
    await page.mouse.move(box.x - 10 + ((box.width + 20) * i) / 12, y)
    await page.waitForTimeout(10)
  }
  await page.mouse.move(box.x + box.width + 80, y)
  expect(await colourDrawn(page)).toBeGreaterThan(200)
})

test("resting the cursor on the portrait develops the photo, and leaving returns it to the screen", async ({ page }) => {
  await onTheScreen(page)
  const box = (await frame(page).boundingBox())!
  await page.mouse.move(box.x + box.width / 2, box.y + box.height / 2)
  await expect(frame(page)).toHaveAttribute("data-halftone", "developed", { timeout: 3000 })
  await page.mouse.move(box.x + box.width + 120, box.y + box.height / 2)
  await expect(frame(page)).toHaveAttribute("data-halftone", "screen")
})

test("the intro's plate matches the photo: same reach above and below, actions level with its foot", async ({ page }) => {
  await page.goto("/")
  // Measured once the photo and the intro have landed (they rise in on load,
  // each on its own timing).
  await page.waitForFunction(() =>
    [...document.querySelectorAll("#hero [data-hero-card], #hero [data-hero-fade]")].every((el) =>
      el.getAnimations().every((a) => a.playState === "finished"),
    ),
  )
  const m = await page.evaluate(() => {
    const plate = document.querySelector("#hero .glass-plate")!.getBoundingClientRect()
    const photo = document.querySelector("#hero figure")!.firstElementChild!.getBoundingClientRect()
    const action = document.querySelector("#hero .glass-plate a.btn-ink")!.getBoundingClientRect()
    return { above: photo.top - plate.top, below: plate.bottom - photo.bottom, actionFoot: photo.bottom - action.bottom }
  })
  expect(Math.abs(m.above - m.below)).toBeLessThanOrEqual(2)
  expect(Math.abs(m.actionFoot)).toBeLessThanOrEqual(3)
})

test("the plate catches the pointer's light, brightest on it", async ({ page }) => {
  await page.goto("/")
  const plate = page.locator("#hero .glass-plate")
  await plate.scrollIntoViewIfNeeded()
  const hot = () => plate.evaluate((el) => Number(getComputedStyle(el).getPropertyValue("--glass-hot") || 0))
  const box = (await plate.boundingBox())!
  await page.mouse.move(box.x + box.width / 2, box.y + 40)
  await expect.poll(hot).toBe(1)
  await page.mouse.move(box.x + box.width / 2, box.y + box.height + 200)
  await expect.poll(hot).toBeLessThan(0.6)
})

test("reduced motion keeps the plain photo and a still plate", async ({ page }) => {
  await page.emulateMedia({ reducedMotion: "reduce" })
  await page.goto("/")
  await page.waitForTimeout(1200)
  await expect(page.locator("[data-halftone]")).toHaveCount(0)
  await expect(page.getByRole("img", { name: "Amritansh Pandey" })).toBeVisible()
  await page.locator("#hero .glass-plate").scrollIntoViewIfNeeded()
  const box = (await page.locator("#hero .glass-plate").boundingBox())!
  await page.mouse.move(box.x + box.width / 2, box.y + 40)
  await page.waitForTimeout(200)
  expect(await page.locator("#hero .glass-plate").evaluate((el) => el.style.getPropertyValue("--glass-hot"))).toBe("")
})

test.describe("on a phone", () => {
  test.use({ viewport: { width: 390, height: 844 }, hasTouch: true, isMobile: true })

  test("the portrait is the plain photo", async ({ page }) => {
    await page.goto("/")
    await page.waitForTimeout(1200)
    await expect(page.locator("[data-halftone]")).toHaveCount(0)
    await expect(page.getByRole("img", { name: "Amritansh Pandey" })).toBeVisible()
  })
})
