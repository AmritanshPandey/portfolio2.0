export function scrollToSection(id: string) {
  const el = document.getElementById(id)
  if (!el) return

  const yOffset = -80

  const y =
    el.getBoundingClientRect().top +
    window.scrollY +
    yOffset

  // Route through Lenis when it's running — native window.scrollTo and the
  // virtual scroll position fight each other otherwise.
  const lenis = typeof window !== "undefined" ? window.__lenis : null
  if (lenis) {
    // Lenis caches its scroll limit; if the page grew since it last measured
    // (e.g. late-loading content right after a route change), a far target
    // would clamp short. Force a re-measure so the full target is reachable.
    lenis.resize()
    lenis.scrollTo(y)
    return
  }

  window.scrollTo({
    top: y,
    behavior: "smooth",
  })
}
