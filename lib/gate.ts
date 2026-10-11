/**
 * Site password gate: the pure logic shared by `proxy.ts` and the unlock page.
 *
 * Web Crypto only (no `node:` imports), so the same code runs in the proxy and
 * in Node. The cookie holds an HMAC keyed by the password, never the password
 * itself, and changing `SITE_PASSWORD` invalidates every existing cookie.
 */

export const GATE_COOKIE = "site_access"

/** 30 days, in seconds. */
export const GATE_MAX_AGE = 2592000

export type GateMode = "off" | "on" | "closed"

type GateEnv = { password?: string; nodeEnv?: string }

const TOKEN_MESSAGE = "site-access-v1"

// Reachable without the cookie. `/unlock` needs the framework's assets to
// render; the favicon, social preview image and robots.txt serve link
// previews and crawlers.
const PUBLIC_EXACT = new Set(["/unlock", "/favicon.ico", "/robots.txt"])
const PUBLIC_PREFIXES = ["/_next/", "/opengraph-image"]

/**
 * `off` only for local development without a password. Anywhere else a
 * missing password keeps the gate shut (`closed`) rather than open.
 */
export function gateMode(env: GateEnv): GateMode {
  if (env.password) return "on"
  return env.nodeEnv === "development" ? "off" : "closed"
}

export async function accessToken(password: string): Promise<string> {
  const encoder = new TextEncoder()
  const key = await crypto.subtle.importKey(
    "raw",
    encoder.encode(password),
    { name: "HMAC", hash: "SHA-256" },
    false,
    ["sign"]
  )
  const signature = await crypto.subtle.sign("HMAC", key, encoder.encode(TOKEN_MESSAGE))
  return Array.from(new Uint8Array(signature), (b) => b.toString(16).padStart(2, "0")).join("")
}

/** Constant-time string comparison: never returns early on a mismatch. */
export function safeEqual(a: string, b: string): boolean {
  const length = Math.max(a.length, b.length)
  let diff = a.length ^ b.length
  for (let i = 0; i < length; i++) {
    diff |= (a.charCodeAt(i) || 0) ^ (b.charCodeAt(i) || 0)
  }
  return diff === 0
}

export async function hasAccess(cookie: string | undefined, env: GateEnv): Promise<boolean> {
  const mode = gateMode(env)
  if (mode === "off") return true
  if (mode === "closed" || !cookie || !env.password) return false
  return safeEqual(cookie, await accessToken(env.password))
}

/** Only same-site paths survive; anything that could leave the site becomes `/`. */
export function safeNext(next: string | null | undefined): string {
  if (!next || !next.startsWith("/") || next.startsWith("//") || next.startsWith("/\\")) return "/"
  return next
}

export function isPublicPath(pathname: string): boolean {
  const path = pathname.length > 1 && pathname.endsWith("/") ? pathname.slice(0, -1) : pathname
  return PUBLIC_EXACT.has(path) || PUBLIC_PREFIXES.some((prefix) => path.startsWith(prefix))
}
