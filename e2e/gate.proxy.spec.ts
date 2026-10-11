import { expect, test, type APIResponse } from "@playwright/test"
import { accessToken } from "@/lib/gate"
import { E2E_PASSWORD } from "./constants"

// Next writes a same-origin Location as a relative path; resolve it either way
// and compare path and query only.
const target = (res: APIResponse) => {
  const u = new URL(res.headers()["location"], "http://localhost")
  return u.pathname + u.search
}

for (const path of ["/", "/work/white-label-rfp", "/resume.pdf"]) {
  test(`locked ${path} redirects to unlock`, async ({ request }) => {
    const res = await request.get(path, { maxRedirects: 0 })
    expect(res.status()).toBe(307)
    expect(target(res)).toBe(`/unlock?next=${encodeURIComponent(path)}`)
  })
}

test("query string survives in next", async ({ request }) => {
  const res = await request.get("/articles?topic=ai", { maxRedirects: 0 })
  expect(target(res)).toBe(`/unlock?next=${encodeURIComponent("/articles?topic=ai")}`)
})

for (const path of ["/favicon.ico", "/opengraph-image", "/robots.txt"]) {
  test(`public ${path} loads without a cookie`, async ({ request }) => {
    expect((await request.get(path, { maxRedirects: 0 })).status()).toBe(200)
  })
}

test("robots disallows everything and lists no sitemap", async ({ request }) => {
  const body = await (await request.get("/robots.txt")).text()
  expect(body).toContain("Disallow: /")
  expect(body).not.toContain("Sitemap")
})

test("a valid cookie passes through", async ({ request }) => {
  const token = await accessToken(E2E_PASSWORD)
  const res = await request.get("/", { maxRedirects: 0, headers: { cookie: `site_access=${token}` } })
  expect(res.status()).toBe(200)
})
