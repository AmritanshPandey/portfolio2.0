import { expect, test, type Page } from "@playwright/test"

// The hero's dot field: a live WebGL shader on desktop pointers, a static CSS
// dot grid everywhere else (phones, touch, reduced motion) with no shader code
// loaded at all.

// Tests must not depend on the host's battery (the live sheet stands down on
// a low battery): unless a test says otherwise, the device is plugged in.
test.beforeEach(async ({ page }) => {
  await page.addInitScript(() => {
    const battery = { charging: true, level: 1, addEventListener() {}, removeEventListener() {} }
    Object.defineProperty(navigator, "getBattery", { value: () => Promise.resolve(battery), configurable: true })
  })
})

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

// Total ink and ultramarine the field itself has drawn in a region: summed
// pixel alpha, read from the live canvas inside the frame it was drawn in (its
// buffer isn't preserved). No screenshot, so no capture delay for the wake to
// fade during, and the page's own text and colours never count.
async function inkIn(page: Page, band: Band) {
  return page.evaluate(async (r) => {
    const canvas = document.querySelector<HTMLCanvasElement>("#hero [data-hero-field] canvas")
    if (!canvas) throw new Error("No live sheet: the field fell back to the static dots (too slow, or WebGL failed)")
    const box = canvas.getBoundingClientRect()
    const scale = canvas.width / box.width
    const w = Math.round((r.right - r.left) * scale)
    const h = Math.round((r.bottom - r.top) * scale)
    const out = Object.assign(document.createElement("canvas"), { width: w, height: h })
    const ctx = out.getContext("2d")!
    await new Promise<void>((resolve) =>
      requestAnimationFrame(() => {
        ctx.drawImage(canvas, (r.left - box.left) * scale, (r.top - box.top) * scale, w, h, 0, 0, w, h)
        resolve()
      }),
    )
    const data = ctx.getImageData(0, 0, w, h).data
    let ink = 0
    let blue = 0
    for (let i = 0; i < data.length; i += 4) {
      const alpha = data[i + 3] / 255
      if (data[i + 2] - data[i] > 60) blue += alpha
      else ink += alpha
    }
    return { ink: Math.round(ink), blue: Math.round(blue) }
  }, band)
}

// Moves the pointer across the band the way a hand does: one move every
// `msPerStep`, rather than a burst the page receives in a single frame.
async function stroke(page: Page, band: Band, msPerStep: number, steps = 30) {
  const y = (band.top + band.bottom) / 2
  for (let i = 0; i <= steps; i++) {
    await page.mouse.move(band.left + ((band.right + 100 - band.left) * i) / steps, y)
    await page.waitForTimeout(msPerStep)
  }
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
  // The cursor waits left of the measured band, so it isn't counted as ink.
  await page.mouse.move(20, (band.top + band.bottom) / 2)
  const before = await inkIn(page, band)

  await stroke(page, band, 12)
  const during = await inkIn(page, band)
  // A working wake adds ~500 here; none adds ~0.
  expect(during.ink).toBeGreaterThan(before.ink + 150)

  await page.waitForTimeout(3000)
  const after = await inkIn(page, band)
  expect(after.ink).toBeLessThan(before.ink + 10)
})

test("a slow, hand-speed stroke leaves a wake too", async ({ page }) => {
  // Moves arrive less often than frames here, as with a trackpad on a 120Hz
  // screen; the wake must not depend on a move landing in every frame.
  await liveField(page)
  const band = await emptyBand(page)
  await page.mouse.move(20, (band.top + band.bottom) / 2)
  const before = await inkIn(page, band)

  await stroke(page, band, 22, 60)
  const during = await inkIn(page, band)
  // ~140 at hand speed, ~30 on a heavily loaded machine; the old bug, where
  // natural strokes printed nothing, gave 0–8.
  expect(during.ink).toBeGreaterThan(before.ink + 20)
})

test("a click sends out a ring of ultramarine pixels", async ({ page }) => {
  await liveField(page)
  const band = await emptyBand(page)
  const y = (band.top + band.bottom) / 2
  // A square around the click, wide enough to hold the ring at 250ms.
  const around = { top: y - 260, bottom: y + 260, left: 390, right: 910 }
  await page.mouse.move(650, y)
  const before = await inkIn(page, around)
  await page.mouse.down()
  await page.mouse.up()
  await page.waitForTimeout(250)
  const ring = await inkIn(page, around)
  // ~2,100 for the ring; nothing in the field is ultramarine before it.
  expect(ring.blue).toBeGreaterThan(before.blue + 500)
})

test("the live sheet's dots sit exactly on the static grid's", async ({ page }) => {
  // If both layers are ever on screen, their dots must coincide, not double.
  await liveField(page)
  // The sheet only draws while something moves; nudge the pointer near the
  // left edge, far from the column being read, so the next frame draws.
  await page.mouse.move(40, 420)
  await page.mouse.move(48, 424)
  const rows = await page.evaluate(async () => {
    const canvas = document.querySelector("#hero [data-hero-field] canvas") as HTMLCanvasElement
    const box = canvas.getBoundingClientRect()
    const scale = canvas.width / box.width
    // A strip over one column of dots near the middle (the CSS grid's dots
    // sit at pitch/2 + pitch·n from the field's top-left), 40px to 400px
    // down. A dot's ink spreads over neighbouring pixels, so the strip is a
    // few pixels wide and each dot is located by the centre of its ink.
    const pitch = parseFloat(getComputedStyle(document.querySelector("#hero .hero-dots")!).backgroundSize)
    const x = Math.round((pitch / 2 + pitch * Math.round(box.width / 2 / pitch)) * scale) - 2
    const w = Math.max(3, Math.round(4 * scale))
    const top = Math.round(40 * scale)
    const h = Math.round(360 * scale)
    const out = Object.assign(document.createElement("canvas"), { width: w, height: h })
    const ctx = out.getContext("2d")!
    await new Promise<void>((resolve) =>
      requestAnimationFrame(() => {
        ctx.drawImage(canvas, x, top, w, h, 0, 0, w, h)
        resolve()
      }),
    )
    const data = ctx.getImageData(0, 0, w, h).data
    const row = Array.from({ length: h }, (_, y) => {
      let sum = 0
      for (let i = 0; i < w; i++) sum += data[(y * w + i) * 4 + 3]
      return sum
    })
    const centres: number[] = []
    for (let y = 0; y < h; y++) {
      if (row[y] <= 4) continue
      let mass = 0
      let moment = 0
      for (; y < h && row[y] > 4; y++) {
        mass += row[y]
        moment += row[y] * (y + 0.5)
      }
      centres.push((top + moment / mass) / scale)
    }
    return { centres, pitch }
  })
  const { centres, pitch } = rows
  expect(centres.length).toBeGreaterThan(12)
  for (const y of centres) {
    const offset = (((y - pitch / 2) % pitch) + pitch) % pitch
    expect(Math.min(offset, pitch - offset)).toBeLessThan(1)
  }
})

test("the static grid hides once the live sheet has painted, whatever the media query says", async ({ page }) => {
  await openHome(page)
  // Stands in for a browser where the static grid's media query matches too.
  await page.addStyleTag({ content: ".hero-dots { display: block }" })
  await expect(page.locator("#hero [data-hero-field] canvas")).toHaveCount(1, { timeout: 5000 })
  await expect.poll(() => staticDotsShown(page)).toBe(false)
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

test("the dot field fills the hero down to its foot, past the content", async ({ page }) => {
  await liveField(page)
  const box = await page.evaluate(() => {
    const field = document.querySelector("#hero [data-hero-field]")!.getBoundingClientRect()
    const hero = document.getElementById("hero")!.getBoundingClientRect()
    const figure = document.querySelector("#hero figure")!.getBoundingClientRect()
    const proof = document.querySelector("#hero [data-hero-proof]")!.getBoundingClientRect()
    return {
      fieldTop: field.top,
      fieldBottom: field.bottom,
      heroBottom: hero.bottom,
      contentBottom: Math.max(figure.bottom, proof.bottom),
    }
  })
  expect(Math.abs(box.fieldBottom - box.heroBottom)).toBeLessThanOrEqual(1)
  // Room below the content for the sheet to fade out in.
  expect(box.fieldBottom - box.contentBottom).toBeGreaterThanOrEqual(56)

  // And the dots are drawn low down, where the old sheet (gone by 82% of its
  // height) drew nothing: from 86% of the way down to where the foot's fade
  // begins. Nudge the pointer far away so the next frame draws.
  await page.mouse.move(20, 300)
  await page.mouse.move(24, 304)
  const low = await inkIn(page, {
    top: Math.ceil(box.fieldTop + (box.fieldBottom - box.fieldTop) * 0.86),
    bottom: Math.floor(box.fieldBottom - 100),
    left: 100,
    right: 1200,
  })
  expect(low.ink).toBeGreaterThan(40)
})

test.describe("where the live sheet would not be smooth", () => {
  test("an iPad, even with a trackpad, gets the static dots", async ({ page }) => {
    // iPadOS reports itself as a Mac; a touch screen gives it away.
    await page.addInitScript(() => {
      Object.defineProperty(navigator, "platform", { get: () => "MacIntel" })
      Object.defineProperty(navigator, "maxTouchPoints", { get: () => 5 })
    })
    await openHome(page)
    await page.waitForTimeout(2500)
    await expect(page.locator("#hero [data-hero-field] canvas")).toHaveCount(0)
    expect(await staticDotsShown(page)).toBe(true)
  })

  test("a laptop on battery saver gets the static dots", async ({ page }) => {
    await page.addInitScript(() => {
      const battery = { charging: false, level: 0.15, addEventListener() {}, removeEventListener() {} }
      Object.defineProperty(navigator, "getBattery", { value: () => Promise.resolve(battery), configurable: true })
    })
    await openHome(page)
    await page.waitForTimeout(2500)
    await expect(page.locator("#hero [data-hero-field] canvas")).toHaveCount(0)
    expect(await staticDotsShown(page)).toBe(true)
  })

  test("a browser held to 30fps falls back to the static dots", async ({ page }) => {
    // Chrome's Energy Saver and Safari's Low Power Mode both cap frames at ~30fps.
    await page.addInitScript(() => {
      window.requestAnimationFrame = (cb) => window.setTimeout(() => cb(performance.now()), 33)
      window.cancelAnimationFrame = (id) => window.clearTimeout(id)
    })
    await openHome(page)
    await expect.poll(() => staticDotsShown(page), { timeout: 8000 }).toBe(true)
    await expect(page.locator("#hero [data-hero-field] canvas")).toHaveCount(0)
  })
})

test("the live sheet stops drawing while nothing moves", async ({ page }) => {
  await page.addInitScript(() => {
    const w = window as unknown as { __draws: number }
    w.__draws = 0
    const draw = WebGLRenderingContext.prototype.drawArrays
    WebGLRenderingContext.prototype.drawArrays = function (...args) {
      w.__draws++
      return draw.apply(this, args)
    }
  })
  await liveField(page)
  await page.waitForTimeout(3000)
  const draws = () => page.evaluate(() => (window as unknown as { __draws: number }).__draws)
  const idle = await draws()
  await page.waitForTimeout(1000)
  expect((await draws()) - idle).toBeLessThanOrEqual(2)
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
