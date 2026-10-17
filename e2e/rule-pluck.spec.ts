import { expect, test, type Page } from "@playwright/test"

// Pluckable rules: on a desktop pointer, sweeping across an ink rule catches
// it like a string. It bends toward the pointer, slips free past the pull
// limit, rings and settles flat. Sound is opt-in and off by default. Phones,
// touch and reduced motion never pluck.

const HERO_RULE = "#hero [data-hero-rule]"

// Counts plucked notes by watching the Web Audio graph, before any page code runs.
async function countNotes(page: Page) {
  await page.addInitScript(() => {
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
}

const notes = (page: Page) => page.evaluate(() => (window as unknown as { __notes: number }).__notes)

async function heroRule(page: Page) {
  await page.goto("/")
  const rule = page.locator(HERO_RULE)
  // The hero rule draws in on load; it can only be plucked once it spans the sheet.
  await expect
    .poll(() => rule.evaluate((el) => el.getBoundingClientRect().width >= (el as HTMLElement).offsetWidth - 1))
    .toBe(true)
  const box = (await rule.boundingBox())!
  return { box, x: box.x + box.width * 0.4, y: box.y + box.height / 2 }
}

// The rule's current displacement at the grab point, read from its path.
const bend = (page: Page, rule = HERO_RULE) =>
  page.locator(rule).evaluate((el) => {
    const d = el.querySelector("svg path")?.getAttribute("d")
    return d ? Number(d.match(/-?\d+(\.\d+)?/g)![3]) : null
  })

// Records the rule's furthest swing either way, frame by frame inside the page,
// so a busy test runner cannot miss a swing that lasts a few frames.
const recordSwing = (page: Page, rule = HERO_RULE) =>
  page.evaluate((sel) => {
    const el = document.querySelector(sel)!
    const w = window as unknown as { __swing: { min: number; max: number } }
    w.__swing = { min: 0, max: 0 }
    const frame = () => {
      const d = el.querySelector("svg path")?.getAttribute("d")
      if (d) {
        const v = Number(d.match(/-?\d+(\.\d+)?/g)![3])
        w.__swing = { min: Math.min(w.__swing.min, v), max: Math.max(w.__swing.max, v) }
      }
      requestAnimationFrame(frame)
    }
    frame()
  }, rule)

const swing = (page: Page) => page.evaluate(() => (window as unknown as { __swing: { min: number; max: number } }).__swing)

test("a slow sweep catches the rule, draws it out and lets it ring flat again", async ({ page }) => {
  const { x, y } = await heroRule(page)

  await page.mouse.move(x, y - 30)
  await page.mouse.move(x, y + 12, { steps: 8 })
  await expect.poll(() => bend(page)).toBeGreaterThan(9)
  await expect(page.locator(HERO_RULE)).toHaveAttribute("data-plucking", "")

  // Past the pull limit it slips free, then settles: the drawn copy is
  // removed and the rule is its plain self again.
  await recordSwing(page)
  await page.mouse.move(x, y + 80, { steps: 4 })
  await expect(page.locator(`${HERO_RULE} svg`)).toHaveCount(0, { timeout: 4000 })
  await expect(page.locator(HERO_RULE)).not.toHaveAttribute("data-plucking")

  // On the way it rang: released below the line, it swung back up through rest.
  const { min, max } = await swing(page)
  expect(max).toBeGreaterThan(15)
  expect(min).toBeLessThan(-6)
})

test("a fast flick across the rule plucks it in passing", async ({ page }) => {
  const { x, y } = await heroRule(page)
  await page.mouse.move(x, y - 60)
  await page.mouse.move(x, y + 60)
  await expect(page.locator(`${HERO_RULE} svg`)).toHaveCount(1)
})

test("scrolling a rule past a resting pointer does not pluck it", async ({ page }) => {
  await page.goto("/")
  const rule = page.locator("#work [data-settle='rule']")
  const start = (await rule.boundingBox())!
  const x = start.x + start.width * 0.5
  const pointerY = 200

  await page.mouse.move(x, pointerY)
  await page.mouse.wheel(0, start.y - pointerY + 160)
  await expect.poll(async () => (await rule.boundingBox())!.y).toBeLessThan(pointerY - 40)
  await page.mouse.move(x + 2, pointerY + 1)
  await page.waitForTimeout(150)
  await expect(page.locator(".rule-ink svg")).toHaveCount(0)
})

test("sound is off until asked for, then each pluck plays a note", async ({ page }) => {
  await countNotes(page)
  const { x, y } = await heroRule(page)
  const toggle = page.getByRole("button", { name: "Sound" })
  await expect(toggle).toHaveAttribute("aria-pressed", "false")

  await page.mouse.move(x, y - 60)
  await page.mouse.move(x, y + 60)
  await page.waitForTimeout(100)
  expect(await notes(page)).toBe(0)

  await toggle.click()
  await expect(toggle).toHaveAttribute("aria-pressed", "true")
  await expect.poll(() => notes(page)).toBe(1) // a soft note confirms it is on
  const afterToggle = 1

  // The toggle sits above the rule, so this first move does not cross it.
  await page.mouse.move(x, y - 60)
  await page.mouse.move(x, y + 60)
  await expect.poll(() => notes(page)).toBe(afterToggle + 1)

  // The choice lasts for the visit, not forever.
  await page.reload()
  await expect(page.getByRole("button", { name: "Sound" })).toHaveAttribute("aria-pressed", "true")
  expect(await page.evaluate(() => window.localStorage.getItem("ledger-sound"))).toBeNull()
})

test("reduced motion never plucks and hides the sound toggle", async ({ page }) => {
  await page.emulateMedia({ reducedMotion: "reduce" })
  const { x, y } = await heroRule(page)
  await page.mouse.move(x, y - 30)
  await page.mouse.move(x, y + 12, { steps: 8 })
  await page.waitForTimeout(150)
  await expect(page.locator(".rule-ink svg")).toHaveCount(0)
  await expect(page.getByRole("button", { name: "Sound" })).toBeHidden()
})

test.describe("on a phone", () => {
  test.use({ viewport: { width: 375, height: 812 }, hasTouch: true, isMobile: true })

  test("rules never pluck", async ({ page }) => {
    const { x, y } = await heroRule(page)
    await page.mouse.move(x, y - 30)
    await page.mouse.move(x, y + 30, { steps: 8 })
    await page.waitForTimeout(150)
    await expect(page.locator(".rule-ink svg")).toHaveCount(0)
  })
})
