"use client"

import { useRouter, usePathname } from "next/navigation"
import { useState, useEffect, useRef, useSyncExternalStore } from "react"
import clsx from "clsx"
import Link from "next/link"
import { AnimatePresence, motion } from "framer-motion"
import {
  IconHome,
  IconDownload,
  IconArrowLeft,
} from "@tabler/icons-react"
import { ThemeToggle } from "@/components/shared/theme-toggle"
import { scrollToSection } from "@/lib/scroll"

// ─────────────────────────
// CONSTANTS
// ─────────────────────────

const NAV_LINKS = [
  { label: "Home",     href: "#hero",        icon: true },
  { label: "Work",     href: "#work" },
  { label: "Exploration", href: "#explorations" },
  { label: "Insights", href: "#insights" },
  { label: "About",    href: "#about" },
]

const SECTION_IDS = [
  "hero",
  "work",
  "explorations",
  "approach",
  "insights",
  "leadership",
  "advisory",
  "about",
]

const DETAIL_ROUTES: Record<string, { section: string; label: string; href: string }> = {
  "/work":         { section: "work",        label: "Work",     href: "/#work" },
  "/systems":      { section: "explorations", label: "Exploration", href: "/#explorations" },
  "/explorations": { section: "explorations", label: "Exploration", href: "/#explorations" },
  "/articles":     { section: "insights",    label: "Insights", href: "/#insights" },
}

const DETAIL_NAV_LINKS = [
  { label: "Home",     href: "/",             section: "hero",        icon: IconHome },
  { label: "Work",     href: "/#work",        section: "work",        icon: undefined },
  { label: "Exploration", href: "/#explorations", section: "explorations", icon: undefined },
  { label: "Insights", href: "/#insights",    section: "insights",    icon: undefined },
  { label: "About",    href: "/#about",       section: "about",       icon: undefined },
]

function getDetailRoute(pathname: string) {
  for (const [prefix, meta] of Object.entries(DETAIL_ROUTES)) {
    if (pathname.startsWith(prefix)) return meta
  }
  return null
}

// Section ids that actually have a nav entry.
const NAV_IDS = NAV_LINKS.map((l) => l.href.replace("#", ""))

// Map the currently-tracked section to the nearest preceding nav entry, so the
// active pill stays anchored while scrolling through sections that aren't in the
// nav (e.g. Approach, Advisory) instead of blinking out and back.
function navSectionFor(activeId: string) {
  const idx = SECTION_IDS.indexOf(activeId)
  if (idx === -1) return activeId
  for (let i = idx; i >= 0; i--) {
    if (NAV_IDS.includes(SECTION_IDS[i])) return SECTION_IDS[i]
  }
  return activeId
}

// ─────────────────────────
// SCROLL HOOKS
// ─────────────────────────

function useScrolled(threshold = 40) {
  return useSyncExternalStore(
    (cb) => {
      window.addEventListener("scroll", cb, { passive: true })
      return () => window.removeEventListener("scroll", cb)
    },
    () => window.scrollY > threshold,
    () => false,
  )
}

// Progress bar is driven by direct DOM mutation — no React re-render per frame.
function useProgressBar(enabled: boolean) {
  const ref = useRef<HTMLDivElement>(null)
  useEffect(() => {
    const bar = ref.current
    if (!bar || !enabled) return
    const update = () => {
      const el  = document.documentElement
      const max = el.scrollHeight - el.clientHeight
      bar.style.transform = `scaleX(${max > 0 ? Math.min(el.scrollTop / max, 1) : 0})`
    }
    window.addEventListener("scroll", update, { passive: true })
    update()
    return () => window.removeEventListener("scroll", update)
  }, [enabled])
  return ref
}

// ─────────────────────────
// ACTIVE SECTION (home only)
// ─────────────────────────

function useActiveSection(ids: string[], enabled: boolean) {
  const [active, setActive] = useState(ids[0])

  useEffect(() => {
    if (!enabled) return
    let ticking = false

    const update = () => {
      const mid = window.scrollY + window.innerHeight * 0.45
      let current = ids[0]
      for (const id of ids) {
        const el = document.getElementById(id)
        if (el && mid >= el.offsetTop) current = id
      }
      setActive(prev => (prev === current ? prev : current))
      ticking = false
    }

    const onScroll = () => {
      if (!ticking) { requestAnimationFrame(update); ticking = true }
    }

    window.addEventListener("scroll", onScroll, { passive: true })
    update()
    return () => window.removeEventListener("scroll", onScroll)
  }, [ids, enabled])

  return [active, setActive] as const
}

// ─────────────────────────
// NAV ITEM
// ─────────────────────────

function NavItem({
  href, label, icon, isActive, setActiveImmediate, closeMenu,
}: {
  href: string; label: string; icon?: boolean
  isActive: boolean; setActiveImmediate: (id: string) => void; closeMenu?: () => void
}) {
  const router   = useRouter()
  const pathname = usePathname()
  const id = href.replace("#", "")

  const handleClick = (e: React.MouseEvent) => {
    e.preventDefault()
    setActiveImmediate(id)

    if (id === "hero") {
      if (pathname === "/") window.scrollTo({ top: 0, behavior: "smooth" })
      else router.push("/")
      closeMenu?.()
      return
    }

    if (pathname === "/") { scrollToSection(id); closeMenu?.(); return }
    router.push(`/#${id}`)
    closeMenu?.()
  }

  return (
    <a
      href={pathname === "/" ? href : `/${href}`}
      onClick={handleClick}
      aria-current={isActive ? "true" : undefined}
      aria-label={icon ? label : undefined}
      className="relative flex items-center gap-1.5 px-3 py-2 rounded-full text-[14px] font-medium focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-rose-500/45 focus-visible:ring-offset-2 focus-visible:ring-offset-background"
    >
      {/* Sliding pill — layoutId moves it between active items via spring transform */}
      {isActive && (
        <motion.span
          layoutId="nav-active-pill"
          className="absolute inset-0 rounded-full bg-black/[0.05] dark:bg-white/[0.09] border border-black/[0.06] dark:border-white/[0.09]"
          transition={{ type: "spring", stiffness: 380, damping: 30 }}
        />
      )}
      <span className={clsx(
        "relative z-10 flex items-center gap-1.5 transition-colors duration-150",
        isActive ? "text-foreground" : "text-muted-foreground hover:text-foreground"
      )}>
        {icon ? <IconHome size={16} className="opacity-70" /> : label}
      </span>
    </a>
  )
}

function DetailNavItem({
  href,
  label,
  icon: Icon,
  active,
  onClick,
}: {
  href: string
  label: string
  icon?: typeof IconHome
  active?: boolean
  onClick?: () => void
}) {
  return (
    <Link
      href={href}
      onClick={onClick}
      aria-current={active ? "true" : undefined}
      aria-label={Icon && !label ? "Home" : undefined}
      className={clsx(
        "relative flex items-center gap-1.5 rounded-full px-3 py-2 text-[13px] font-medium transition-colors duration-150",
        "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-rose-500/45 focus-visible:ring-offset-2 focus-visible:ring-offset-background",
        active
          ? "bg-black/[0.05] text-foreground dark:bg-white/[0.09]"
          : "text-muted-foreground hover:bg-black/[0.04] hover:text-foreground dark:hover:bg-white/[0.06]"
      )}
    >
      {Icon ? <Icon size={15} className="opacity-75" /> : null}
      {label}
    </Link>
  )
}

// ─────────────────────────
// NAV PILL SHELL
// shared glass/border styles
// ─────────────────────────

function NavShell({ scrolled, children, className }: {
  scrolled: boolean; children: React.ReactNode; className?: string
}) {
  const blurValue = scrolled ? "blur(16px)" : "blur(8px)"
  return (
    <nav
      className={clsx(
        "navbar-enter",
        "relative flex items-center gap-1 px-2 py-2 rounded-full",
        "transition-[background,border-color,box-shadow] duration-300 ease-out",
        "[transform:translateZ(0)]",
        scrolled
          ? "bg-white/[0.92] dark:bg-neutral-900/[0.92] backdrop-blur-md border border-black/[0.08] dark:border-white/[0.10] shadow-[0_8px_28px_rgba(0,0,0,0.12)]"
          : "bg-white/[0.80] dark:bg-neutral-900/[0.80] backdrop-blur-sm border border-black/[0.06] dark:border-white/[0.08] shadow-[0_4px_16px_rgba(0,0,0,0.07)]",
        className
      )}
      style={{
        // Safari requires the -webkit- prefix for backdrop-filter
        WebkitBackdropFilter: blurValue,
        backdropFilter:       blurValue,
      }}
    >
      <div className="pointer-events-none absolute inset-x-0 top-0 h-px rounded-full bg-gradient-to-r from-transparent via-black/[0.08] to-transparent dark:via-white/[0.15]" />
      {children}
    </nav>
  )
}

// ─────────────────────────
// NAVBAR
// ─────────────────────────

export default function Navbar() {
  const pathname    = usePathname()
  const isHome      = pathname === "/"
  const detailRoute = getDetailRoute(pathname)
  const isDetail    = !!detailRoute

  const [active, setActive] = useActiveSection(SECTION_IDS, isHome)
  const [open, setOpen]     = useState(false)
  const scrolled             = useScrolled()
  const progressBarRef       = useProgressBar(isDetail)

  const menuRef = useRef<HTMLDivElement>(null)
  const btnRef  = useRef<HTMLButtonElement>(null)

  // Close on resize
  useEffect(() => {
    const onResize = () => { if (window.innerWidth >= 1024) setOpen(false) }
    window.addEventListener("resize", onResize)
    return () => window.removeEventListener("resize", onResize)
  }, [])

  // Outside click closes menu
  useEffect(() => {
    if (!open) return
    const onDown = (e: MouseEvent) => {
      const t = e.target as Node
      if (!menuRef.current?.contains(t) && !btnRef.current?.contains(t)) setOpen(false)
    }
    document.addEventListener("mousedown", onDown)
    return () => document.removeEventListener("mousedown", onDown)
  }, [open])

  const effectiveActive = detailRoute?.section ?? (isHome ? active : "hero")
  // Keep the highlight on the nearest nav entry for unlinked sections (Approach, Advisory).
  const activeNavSection = navSectionFor(effectiveActive)

  return (
    <>
      {/* ══════════════════════════════════════════════
          READING PROGRESS BAR — detail pages only
      ══════════════════════════════════════════════ */}
      {isDetail && (
        <div
          ref={progressBarRef}
          className="fixed top-0 left-0 right-0 h-[2px] z-[60] bg-accent/70 origin-left"
          style={{ transform: "scaleX(0)" }}
        />
      )}

      {/* ══════════════════════════════════════════════
          DESKTOP
      ══════════════════════════════════════════════ */}
      <header className="fixed top-7 left-1/2 -translate-x-1/2 z-50 hidden lg:block">
        {isDetail ? (
          /* ── DETAIL: compact home-section nav ─────── */
          <NavShell scrolled={scrolled}>
            {/* Back-to-section affordance */}
            <Link
              href={detailRoute!.href}
              aria-label={`Back to ${detailRoute!.label}`}
              className="flex items-center gap-1.5 rounded-full px-3 py-2 text-[13px] font-medium text-muted-foreground transition-colors duration-150 hover:bg-black/[0.04] hover:text-foreground dark:hover:bg-white/[0.06] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-rose-500/45 focus-visible:ring-offset-2 focus-visible:ring-offset-background"
            >
              <IconArrowLeft size={15} stroke={2} />
              <span className="hidden lg:inline">Back to {detailRoute!.label}</span>
            </Link>

            <div className="w-px h-4 bg-border/60 mx-1" />

            <div className="flex items-center gap-1">
              {DETAIL_NAV_LINKS.map((link) => (
                <DetailNavItem
                  key={link.href}
                  href={link.href}
                  label={link.label}
                  icon={link.icon}
                  active={effectiveActive === link.section}
                />
              ))}
            </div>

            <div className="w-px h-4 bg-border/60 mx-1" />

            <ThemeToggle />
          </NavShell>
        ) : (
          /* ── HOME / SECTIONS: full pill ──────────── */
          <NavShell scrolled={scrolled}>
            <div className="flex items-center gap-1 relative">
              {NAV_LINKS.map(({ label, href, icon }) => (
                <NavItem
                  key={href}
                  href={href}
                  label={label}
                  icon={icon}
                  isActive={activeNavSection === href.replace("#", "")}
                  setActiveImmediate={setActive}
                />
              ))}
            </div>

            <div className="w-px h-4 bg-border/60 mx-1" />

            <ThemeToggle />

            <Link
              href="/resume.pdf"
              target="_blank"
              className="ml-1 flex items-center gap-1.5 px-3 py-1.5 rounded-full border border-border/70 text-sm text-muted-foreground hover:text-foreground hover:border-border hover:bg-muted/40 transition"
            >
              Resume
              <IconDownload size={16} />
            </Link>
          </NavShell>
        )}
      </header>

      {/* ══════════════════════════════════════════════
          MOBILE — FAB + MENU
      ══════════════════════════════════════════════ */}
      <button
        ref={btnRef}
        onClick={() => setOpen(v => !v)}
        aria-label={open ? "Close navigation menu" : "Open navigation menu"}
        aria-expanded={open}
        data-menu-open={open}
        className="
          fixed right-4 top-[calc(env(safe-area-inset-top)+1rem)] z-50 lg:hidden
          w-14 h-14 rounded-full flex items-center justify-center
          bg-white dark:bg-neutral-900
          border border-black/[0.06] dark:border-white/[0.08]
          shadow-[0_10px_30px_rgba(0,0,0,0.2)]
          active:scale-[0.92] transition
        "
      >
        {/* Morphing burger — bars gather, then twist into the X (see
            .menu-morph in globals.css for the two-phase choreography) */}
        <span aria-hidden className="menu-morph">
          <span />
          <span />
          <span />
        </span>
      </button>

      <AnimatePresence>
        {open && (
          <motion.div
            ref={menuRef}
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0  }}
            exit={{    opacity: 0, y: 8  }}
            transition={{ duration: 0.2, ease: [0.22, 1, 0.36, 1] }}
            className="
              fixed right-4 top-[calc(env(safe-area-inset-top)+5rem)] z-50 lg:hidden w-64
              rounded-2xl overflow-hidden
              bg-white dark:bg-neutral-900
              border border-black/[0.06] dark:border-white/[0.08]
              shadow-[0_20px_60px_rgba(0,0,0,0.25)]
            "
          >
            <div className="p-3 flex flex-col gap-1">

              {isDetail ? (
                /* ── DETAIL: section return nav ─────── */
                <>
                  <Link
                    href={detailRoute!.href}
                    onClick={() => setOpen(false)}
                    className="flex items-center gap-2 rounded-xl bg-muted/35 px-3 py-3 text-sm font-medium text-foreground transition hover:bg-muted/55"
                  >
                    <IconArrowLeft size={16} stroke={2} />
                    Back to {detailRoute!.label}
                  </Link>

                  <div className="h-px bg-border/50 my-0.5" />

                  {DETAIL_NAV_LINKS.map((link) => (
                    <DetailNavItem
                      key={link.href}
                      href={link.href}
                      label={link.label}
                      icon={link.icon}
                      active={effectiveActive === link.section}
                      onClick={() => setOpen(false)}
                    />
                  ))}

                  <div className="h-px bg-border/50 my-0.5" />

                  <div className="flex items-center justify-between px-1 py-1">
                    <span className="text-xs text-muted-foreground pl-2">Theme</span>
                    <ThemeToggle />
                  </div>
                </>
              ) : (
                /* ── HOME: full menu ────────────────── */
                <>
                  {NAV_LINKS.map(({ label, href, icon }) => (
                    <NavItem
                      key={href}
                      href={href}
                      label={label}
                      icon={icon}
                      isActive={activeNavSection === href.replace("#", "")}
                      setActiveImmediate={(id) => { setActive(id); setOpen(false) }}
                      closeMenu={() => setOpen(false)}
                    />
                  ))}

                  <div className="h-px bg-border/50 my-1" />

                  <div className="flex items-center gap-2">
                    <div className="flex items-center justify-center rounded-xl bg-muted/40 border border-border/60">
                      <ThemeToggle />
                    </div>
                    <Link
                      href="/resume.pdf"
                      target="_blank"
                      onClick={() => setOpen(false)}
                      className="flex-1 flex items-center justify-center gap-2 h-10 rounded-xl px-4 text-sm text-muted-foreground hover:text-foreground hover:bg-muted/40 transition"
                    >
                      Resume <IconDownload size={16} />
                    </Link>
                  </div>
                </>
              )}

            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}
