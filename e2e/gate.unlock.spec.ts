import { expect, test } from "@playwright/test"
import { accessToken } from "@/lib/gate"
import { E2E_PASSWORD, E2E_PORT } from "./constants"

test("wrong password shows the error and sets no cookie", async ({ page, context }) => {
  await page.goto("/unlock?next=%2Fwork%2Fwhite-label-rfp")
  await page.getByLabel("Password").fill("not-it")
  await page.getByRole("button", { name: "Unlock" }).click()
  await expect(page.getByText("That password didn't work.")).toBeVisible()
  expect((await context.cookies()).find((c) => c.name === "site_access")).toBeUndefined()
})

test("right password lands on next, and a second visit needs nothing", async ({ page }) => {
  await page.goto("/work/white-label-rfp")
  await expect(page).toHaveURL(/\/unlock\?next=/)
  await page.getByLabel("Password").fill(E2E_PASSWORD)
  await page.getByRole("button", { name: "Unlock" }).click()
  await expect(page).toHaveURL("/work/white-label-rfp")
  await page.goto("/")
  await expect(page).toHaveURL("/")
})

test("an open-redirect next falls back to home", async ({ page }) => {
  await page.goto("/unlock?next=%2F%2Fevil.example")
  await page.getByLabel("Password").fill(E2E_PASSWORD)
  await page.getByRole("button", { name: "Unlock" }).click()
  await expect(page).toHaveURL("/")
})

test("an unlocked visitor opening /unlock is sent on", async ({ page }) => {
  await page.context().addCookies([
    { name: "site_access", value: await accessToken(E2E_PASSWORD), url: `http://localhost:${E2E_PORT}` },
  ])
  await page.goto("/unlock?next=%2Farticles")
  await expect(page).toHaveURL("/articles")
})

test("unlock page carries the site's social preview tags", async ({ request }) => {
  // Status first: Next's 404 page carries the same layout tags, so the tags
  // alone would pass before /unlock exists.
  const res = await request.get("/unlock")
  expect(res.status()).toBe(200)
  const html = await res.text()
  expect(html).toContain('property="og:title"')
  expect(html).toContain('property="og:image"')
  expect(html).toContain('name="robots" content="noindex')
})

test("unlock page renders with no failed requests and no site chrome", async ({ page }) => {
  const failed: string[] = []
  page.on("response", (r) => {
    if (r.status() >= 300 && r.status() !== 304) failed.push(`${r.status()} ${r.url()}`)
  })
  await page.goto("/unlock")
  await expect(page.getByText("This portfolio is shared privately.", { exact: false })).toBeVisible()
  await expect(page.getByRole("link", { name: "Ask for access" })).toHaveAttribute("href", /^mailto:/)
  await expect(page.getByRole("navigation")).toHaveCount(0)
  expect(failed).toEqual([])
})

test("the password field keeps its height on a phone", async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 })
  await page.goto("/unlock")
  const box = await page.getByLabel("Password").boundingBox()
  expect(box!.height).toBeGreaterThanOrEqual(40)
  expect(box!.width).toBeGreaterThan(300)
})
