"use server"

import { cookies } from "next/headers"
import { redirect } from "next/navigation"
import { GATE_COOKIE, GATE_MAX_AGE, accessToken, gateMode, safeEqual, safeNext } from "@/lib/gate"

export type UnlockState = { error: boolean }

const WRONG_PASSWORD_DELAY_MS = 400

export async function unlock(_prev: UnlockState, form: FormData): Promise<UnlockState> {
  // Both sides trimmed: a password copied from the resume PDF or an email
  // often carries a stray space.
  const password = process.env.SITE_PASSWORD?.trim()
  const submitted = String(form.get("password") ?? "").trim()
  const next = String(form.get("next") ?? "")

  const closed = gateMode({ password, nodeEnv: process.env.NODE_ENV }) === "closed"
  if (closed || !safeEqual(submitted, password ?? "")) {
    // Slows down guessing without blocking anyone who simply mistyped.
    await new Promise((resolve) => setTimeout(resolve, WRONG_PASSWORD_DELAY_MS))
    return { error: true }
  }

  const jar = await cookies()
  jar.set(GATE_COOKIE, await accessToken(password ?? ""), {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: GATE_MAX_AGE,
  })
  redirect(safeNext(next))
}
