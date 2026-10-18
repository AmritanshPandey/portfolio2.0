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

// Total ink and ultramarine the field itself has drawn in a region: summed
// pixel alpha, read from the live canvas inside the frame it was drawn in (its
// buffer isn't preserved). No screenshot, so no capture delay for the wake to
// fade during, and the page's own text and colours never count.
async function inkIn(page: Page, band: Band) {
  return page.evaluate(async (r) => {
    const canvas = document.querySelector("#hero [data-hero-field] canvas") as HTMLCanvasElement
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

// The live sheet hands over to static dots when frames run slow (see the 30fps
// test). Headless Chromium draws WebGL on the CPU, so a runner with several
// workers is slow in just that way; tests of the live sheet hold it live.
async function keepLive(page: Page) {
  await page.addInitScript(() => {
    ;(window as Window & { __heroWakeKeepLive?: boolean }).__heroWakeKeepLive = true
  })
}

async function liveField(page: Page) {
  await keepLive(page)
  await openHome(page)
  await expect(page.locator("#hero [data-hero-field] canvas")).toHaveCount(1, { timeout: 5000 })
  await page.waitForTimeout(800)
}

const staticDotsShown = (page: Page) =>
  page.locator("#hero [data-hero-dots]").evaluate((el) => getComputedStyle(el).display !== "none")

test("the hero dot field goes live on a desktop pointer", async ({ page }) => {
  const seen = watchForShaderCode(page)
  await keepLive(page)
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
    // sit at 9px + 18px·n from the field's top-left), 40px to 400px down. A
    // dot's ink spreads over neighbouring pixels, so the strip is 3px wide and
    // each dot is located by the centre of its ink.
    const x = Math.round((9 + 18 * Math.round(box.width / 2 / 18)) * scale) - 2
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
    return centres
  })
  expect(rows.length).toBeGreaterThan(12)
  for (const y of rows) {
    const offset = (((y - 9) % 18) + 18) % 18
    expect(Math.min(offset, 18 - offset)).toBeLessThan(1.5)
  }
})

test("the static grid hides once the live sheet has painted, whatever the media query says", async ({ page }) => {
  await keepLive(page)
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
      Object.defineProperty(navigator, "getBattery", { value: () => Promise.resolve(battery) })
    })
    await openHome(page)
    await page.waitForTimeout(2500)
    await expect(page.locator("#hero [data-hero-field] canvas")).toHaveCount(0)
    expect(await staticDotsShown(page)).toBe(true)
  })

  test("a browser held to 30fps falls back to the static dots", async ({ page }) => {
    // Chrome's Energy Saver and Safari's Low Power Mode both cap frames at ~30fps.
    // Chrome often delivers the sheet's first visibility notice a few frames
    // after it starts drawing; holding every notice back makes that the order
    // here, so the check must finish with no help from a moving pointer.
    await page.addInitScript(() => {
      window.requestAnimationFrame = (cb) => window.setTimeout(() => cb(performance.now()), 33)
      window.cancelAnimationFrame = (id) => window.clearTimeout(id)
      const Observer = window.IntersectionObserver
      window.IntersectionObserver = class extends Observer {
        constructor(cb: IntersectionObserverCallback, options?: IntersectionObserverInit) {
          super((entries, observer) => void setTimeout(() => cb(entries, observer), 300), options)
        }
      }
    })
    await openHome(page)
    // 80 frames at 30fps, slower still on a busy test runner.
    await expect.poll(() => staticDotsShown(page), { timeout: 20_000 }).toBe(true)
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
  const draws = () => page.evaluate(() => (window as unknown as { __draws: number }).__draws)
  const drawsOver = async (ms: number) => {
    const start = await draws()
    await page.waitForTimeout(ms)
    return (await draws()) - start
  }
  // The frame-rate check's first 80 frames always draw, for longer on a busy
  // runner; once they are done the sheet sits still, and stays.
  await expect.poll(() => drawsOver(1000), { timeout: 20_000 }).toBeLessThanOrEqual(2)
  expect(await drawsOver(1000)).toBeLessThanOrEqual(2)
  await expect(page.locator("#hero [data-hero-field] canvas")).toHaveCount(1)
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
