import { expect, test } from "@playwright/test"

// The Agent Pay live demo is a still until someone asks for it, and the
// section still looks finished if the demo's host is asleep or blocked.

const DEMO = "https://agent-pay-demo.vercel.app/**"

test("the live demo loads nothing until it is asked for", async ({ page }) => {
  const demoRequests: string[] = []
  page.on("request", (r) => {
    if (r.url().startsWith("https://agent-pay-demo.vercel.app")) demoRequests.push(r.url())
  })
  await page.goto("/work/agent-commerce")
  const section = page.locator("#live-demo")
  await section.scrollIntoViewIfNeeded()
  await expect(section.getByRole("button", { name: "Try the live demo" })).toBeVisible()
  await expect(section.locator("iframe")).toHaveCount(0)
  expect(demoRequests).toHaveLength(0)
})

test("a demo that never loads leaves the still and a link to open it", async ({ page }) => {
  // Hold the demo's requests open, as a sleeping host would.
  await page.route(DEMO, () => new Promise(() => {}))
  await page.goto("/work/agent-commerce")
  const section = page.locator("#live-demo")
  await section.scrollIntoViewIfNeeded()
  await section.getByRole("button", { name: "Try the live demo" }).click()
  await expect(section.getByRole("button", { name: "Loading the demo…" })).toBeVisible()

  await expect(section.getByText(/The demo didn.t load./)).toBeVisible({ timeout: 10_000 })
  const link = section.getByRole("link", { name: "Open it in a new tab." })
  await expect(link).toHaveAttribute("href", "https://agent-pay-demo.vercel.app/")
  await expect(link).toHaveAttribute("target", "_blank")
  // The still is still there behind the message.
  await expect(section.locator('img[src*="demo-poster"]')).toBeVisible()
})
