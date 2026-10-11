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
  for (const p of ["/unlock", "/unlock/", "/_next/static/chunks/a.js", "/favicon.ico", "/opengraph-image", "/opengraph-image-1a2b", "/robots.txt", "/robots.txt/"])
    expect(isPublicPath(p), p).toBe(true)
  for (const p of ["/", "/work/white-label-rfp", "/resume.pdf", "/unlockx", "/assets/images/pic.webp", "/sitemap.xml"])
    expect(isPublicPath(p), p).toBe(false)
})
