export function scrollToSection(id: string) {
  const el = document.getElementById(id)
  if (!el) return

  // Land the section just below the fixed nav.
  const y = el.getBoundingClientRect().top + window.scrollY - 80
  const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches
  window.scrollTo({ top: y, behavior: reduced ? "auto" : "smooth" })
}
