import { expect, test } from "@playwright/test"

// The portfolio is public: no password, no cookie, and search engines may
// index it.

test("pages open without a password", async ({ request }) => {
  for (const path of ["/", "/work/white-label-rfp", "/articles"]) {
    const response = await request.get(path, { maxRedirects: 0 })
    expect(response.status(), path).toBe(200)
  }
})

test("robots.txt lets search engines in and points at the sitemap", async ({ request }) => {
  const body = await (await request.get("/robots.txt")).text()
  expect(body).toContain("Allow: /")
  expect(body).not.toContain("Disallow: /")
  expect(body).toContain("/sitemap.xml")
})
