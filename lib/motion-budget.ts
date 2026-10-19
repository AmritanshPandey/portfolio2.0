/**
 * Where continuous canvas animation wouldn't be smooth, or would cost a
 * battery more than it's worth, the site's animated backgrounds (the hero's
 * dot field, the gallery's ASCII field) hold still. Shared so they agree.
 */

// Set when this session found the browser too slow for live animation.
const SLOW_KEY = "motion:slow"

export type Battery = {
  charging: boolean
  level: number
  addEventListener?: (type: string, listener: () => void) => void
  removeEventListener?: (type: string, listener: () => void) => void
}

export const getBattery = () =>
  (navigator as Navigator & { getBattery?: () => Promise<Battery> }).getBattery?.().catch(() => undefined)

// Battery saver comes on at 20% in Chrome and macOS by default.
export const onLowBattery = (b: Battery) => !b.charging && b.level <= 0.2

/** Remember, for the rest of the session, that live animation was too slow here. */
export function markSlow() {
  try {
    sessionStorage.setItem(SLOW_KEY, "1")
  } catch {}
}

/**
 * True on iPads (iPadOS reports a Mac; a touch screen gives it away), Safari
 * on four cores or fewer, a laptop on a low battery, and any browser this
 * session already found too slow. Callers also check their media query.
 */
export async function staysStill() {
  if (navigator.platform === "MacIntel" && navigator.maxTouchPoints > 1) return true
  const safari = /^((?!chrome|android).)*safari/i.test(navigator.userAgent)
  if (safari && navigator.hardwareConcurrency <= 4) return true
  try {
    if (sessionStorage.getItem(SLOW_KEY)) return true
  } catch {}
  const battery = await getBattery()
  return battery ? onLowBattery(battery) : false
}
