export function scrollToSection(id: string) {
  const el = document.getElementById(id)
  if (!el) return

  // Clears the fixed navbar.
  const yOffset = -80
  const y = el.getBoundingClientRect().top + window.scrollY + yOffset

  // Native scrolling only: smooth by default, an instant jump under reduced motion.
  const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches
  window.scrollTo({ top: y, behavior: reduce ? "auto" : "smooth" })
}
