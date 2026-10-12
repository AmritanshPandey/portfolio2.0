import { expect, test } from "@playwright/test"
import { accessToken, gateMode, hasAccess, isPublicPath, safeEqual, safeNext } from "@/lib/gate"

test("gateMode", () => {
  expect(gateMode({ password: "x", nodeEnv: "production" })).toBe("on")
  expect(gateMode({ password: "x", nodeEnv: "development" })).toBe("on")
  expect(gateMode({ nodeEnv: "development" })).toBe("off")
  expect(gateMode({ nodeEnv: "production" })).toBe("closed")
  expect(gateMode({ password: "", nodeEnv: "production" })).toBe("closed")
})

test("accessToken is a stable 64-char hex HMAC that changes with the password", async () => {
  const a = await accessToken("alpha")
  expect(a).toMatch(/^[0-9a-f]{64}$/)
  expect(await accessToken("alpha")).toBe(a)
  expect(await accessToken("beta")).not.toBe(a)
})

test("safeEqual", () => {
  expect(safeEqual("abc", "abc")).toBe(true)
  expect(safeEqual("abc", "abd")).toBe(false)
  expect(safeEqual("abc", "abcd")).toBe(false)
  expect(safeEqual("pässwörd", "pässwörd")).toBe(true)
})

test("hasAccess", async () => {
  const env = { password: "alpha", nodeEnv: "production" }
  expect(await hasAccess(await accessToken("alpha"), env)).toBe(true)
  expect(await hasAccess(await accessToken("beta"), env)).toBe(false)
  expect(await hasAccess(undefined, env)).toBe(false)
  expect(await hasAccess("anything", { nodeEnv: "production" })).toBe(false)
  expect(await hasAccess(undefined, { nodeEnv: "development" })).toBe(true)
})

test("safeNext", () => {
  expect(safeNext("/work/agent-commerce")).toBe("/work/agent-commerce")
  expect(safeNext("/articles?topic=ai")).toBe("/articles?topic=ai")
  expect(safeNext("//evil.example")).toBe("/")
  expect(safeNext("/\\evil.example")).toBe("/")
  expect(safeNext("https://evil.example")).toBe("/")
  expect(safeNext("")).toBe("/")
  expect(safeNext(null)).toBe("/")
})

test("isPublicPath", () => {
  for (const p of ["/unlock", "/unlock/", "/_next/static/chunks/a.js", "/favicon.ico", "/opengraph-image", "/opengraph-image-1a2b", "/robots.txt", "/robots.txt/", "/icon.svg", "/apple-icon.png"])
    expect(isPublicPath(p), p).toBe(true)
  for (const p of ["/", "/work/white-label-rfp", "/resume.pdf", "/unlockx", "/sitemap.xml"])
    expect(isPublicPath(p), p).toBe(false)
})

test("safeNext rejects control-character and non-string tricks", () => {
  expect(safeNext("/\t/evil.example")).toBe("/")
  expect(safeNext("/\n/evil.example")).toBe("/")
  expect(safeNext("/\r/evil.example")).toBe("/")
  expect(safeNext(["/a", "/b"])).toBe("/")
  expect(safeNext(42)).toBe("/")
  expect(safeNext("/work/agent-commerce#outcome")).toBe("/work/agent-commerce#outcome")
})

test("isPublicPath allows optimisable images and Vercel's own endpoints only", () => {
  for (const p of ["/assets/images/pic.webp", "/assets/images/work/agent-commerce.jpg", "/article.png", "/_vercel/insights/script.js"])
    expect(isPublicPath(p), p).toBe(true)
  for (const p of ["/assets/images/Wednesday.pdf", "/resume.pdf", "/assets/other.webp"])
    expect(isPublicPath(p), p).toBe(false)
})

test("a configured password with stray spaces matches the cookie the action sets", async () => {
  const cookie = await accessToken("alpha")
  expect(await hasAccess(cookie, { password: " alpha ", nodeEnv: "production" })).toBe(true)
  expect(gateMode({ password: "   ", nodeEnv: "production" })).toBe("closed")
})
