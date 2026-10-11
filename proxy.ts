import { NextResponse, type NextRequest } from "next/server"
import { GATE_COOKIE, hasAccess, isPublicPath } from "@/lib/gate"

/**
 * Site password gate. Every request outside the public allowlist needs a
 * valid `site_access` cookie; anything else is sent to /unlock, which returns
 * the visitor to where they were going once they unlock.
 */
export async function proxy(request: NextRequest): Promise<NextResponse> {
  const { pathname, search } = request.nextUrl
  if (isPublicPath(pathname)) return NextResponse.next()

  const cookie = request.cookies.get(GATE_COOKIE)?.value
  const env = { password: process.env.SITE_PASSWORD, nodeEnv: process.env.NODE_ENV }
  if (await hasAccess(cookie, env)) return NextResponse.next()

  const unlock = new URL(`/unlock?next=${encodeURIComponent(pathname + search)}`, request.url)
  return NextResponse.redirect(unlock, 307)
}

export const config = { matcher: "/:path*" }
