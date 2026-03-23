let positions: Record<string, number> = {}

export function saveScroll(path: string) {
  positions[path] = window.scrollY
}

export function restoreScroll(path: string) {
  const y = positions[path]
  if (typeof y !== "number") return false

  window.scrollTo({ top: y, behavior: "auto" })
  return true
}