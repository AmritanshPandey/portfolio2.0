"use client"

import { usePathname } from "next/navigation"
import { useState, useEffect, useRef, useSyncExternalStore } from "react"
import clsx from "clsx"
import Link from "next/link"
import { AnimatePresence, motion } from "framer-motion"
import { IconHome, IconDownload, IconArrowLeft } from "@tabler/icons-react"
import { ThemeToggle } from "@/components/shared/theme-toggle"
import { WorkMegaMenu } from "@/components/portfolio/WorkMegaMenu"
import { scrollToSection } from "@/lib/scroll"
import { getModeConfig } from "@/data/portfolio/helpers"
import type { PortfolioMode } from "@/data/portfolio/types"

// ─────────────────────────
// MODE ROUTES — the three engine pages share one mode-aware nav.
// ─────────────────────────

const MODE_BY_PATH: Record<string, PortfolioMode> = {
  "/": "general",
  "/design-lead": "designLead",
  "/pm": "pm",
}

// ─────────────────────────
// DETAIL ROUTES (case studies, articles, systems) — unchanged.
// ─────────────────────────

const DETAIL_ROUTES: Record<string, { section: string; label: string; href: string }> = {
  "/work":         { section: "work",        label: "Work",     href: "/#work" },
  "/systems":      { section: "explorations", label: "Exploration", href: "/#explorations" },
  "/explorations": { section: "explorations", label: "Exploration", href: "/#explorations" },
  "/articles":     { section: "insights",    label: "Insights", href: "/#insights" },
}

const DETAIL_NAV_LINKS = [
  { label: "Home",     href: "/",             section: "hero",     icon: IconHome },
  { label: "Work",     href: "/#work",        section: "work",     icon: undefined },
  { label: "Built",    href: "/#built",       section: "built",    icon: undefined },
  { label: "Insights", href: "/#insights",    section: "insights", icon: undefined },
  { label: "About",    href: "/#about",       section: "about",    icon: undefined },
]

function getDetailRoute(pathname: string) {
  for (const [prefix, meta] of Object.entries(DETAIL_ROUTES)) {
    if (pathname.startsWith(prefix)) return meta
  }
  return null
}

// Map a tracked section to the nearest preceding nav entry, so the active pill
// stays anchored while scrolling through sections that aren't in the nav.
function navSectionFor(activeId: string, trackIds: string[], navIds: string[]) {
  const idx = trackIds.indexOf(activeId)
  if (idx === -1) return activeId
  for (let i = idx; i >= 0; i--) {
    if (navIds.includes(trackIds[i])) return trackIds[i]
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
      setActive((prev) => (prev === current ? prev : current))
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
// NAV ITEMS
// ─────────────────────────

/** Mode page in-section link — always scrolls within the current page. */
function ModeNavItem({
  href, label, isActive, onActivate, closeMenu,
}: {
  href: string; label: string; isActive: boolean
  onActivate: (id: string) => void; closeMenu?: () => void
}) {
  const id = href.replace("#", "")

  const handleClick = (e: React.MouseEvent) => {
    e.preventDefault()
    onActivate(id)
    if (id === "hero") window.scrollTo({ top: 0, behavior: "smooth" })
    else scrollToSection(id)
    closeMenu?.()
  }

  return (
    <a
      href={href}
      onClick={handleClick}
      aria-current={isActive ? "true" : undefined}
      className="relative flex items-center gap-1.5 px-3 py-2 rounded-full text-[14px] font-medium focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-rose-500/45 focus-visible:ring-offset-2 focus-visible:ring-offset-background"
    >
      {isActive && (
        <motion.span
          layoutId="nav-active-pill"
          className="absolute inset-0 rounded-full bg-black/[0.05] dark:bg-white/[0.09] border border-black/[0.06] dark:border-white/[0.09]"
          transition={{ type: "spring", stiffness: 380, damping: 30 }}
        />
      )}
      <span className={clsx(
        "relative z-10 flex items-center gap-1.5 transition-colors duration-150",
        isActive ? "text-foreground" : "text-muted-foreground hover:text-foreground",
      )}>
        {label}
      </span>
    </a>
  )
}

function DetailNavItem({
  href, label, icon: Icon, active, onClick,
}: {
  href: string; label: string; icon?: typeof IconHome; active?: boolean; onClick?: () => void
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
          : "text-muted-foreground hover:bg-black/[0.04] hover:text-foreground dark:hover:bg-white/[0.06]",
      )}
    >
      {Icon ? <Icon size={15} className="opacity-75" /> : null}
      {label}
    </Link>
  )
}

// ─────────────────────────
// NAV PILL SHELL
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
        className,
      )}
      style={{ WebkitBackdropFilter: blurValue, backdropFilter: blurValue }}
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
  const detailRoute = getDetailRoute(pathname)
  const isDetail    = !!detailRoute

  // Every non-detail top-level page is an engine mode page (general by default).
  const mode: PortfolioMode = MODE_BY_PATH[pathname] ?? "general"
  const config = getModeConfig(mode)
  const isMode = !isDetail

  // Scroll-spy tracks hero + every section band on the mode page (the contact
  // band's real DOM id is "about", from the shared AboutSection).
  const trackIds = [
    "hero",
    ...config.sections.map((s) => (s.id === "contact" ? "about" : s.id)),
  ]
  const navIds = config.nav.map((l) => l.href.replace("#", ""))

  const [active, setActive] = useActiveSection(trackIds, isMode)
  const [open, setOpen]     = useState(false)
  const scrolled            = useScrolled()
  const progressBarRef      = useProgressBar(isDetail)

  const menuRef = useRef<HTMLDivElement>(null)
  const btnRef  = useRef<HTMLButtonElement>(null)

  useEffect(() => {
    const onResize = () => { if (window.innerWidth >= 1024) setOpen(false) }
    window.addEventListener("resize", onResize)
    return () => window.removeEventListener("resize", onResize)
  }, [])

  useEffect(() => {
    if (!open) return
    const onDown = (e: MouseEvent) => {
      const t = e.target as Node
      if (!menuRef.current?.contains(t) && !btnRef.current?.contains(t)) setOpen(false)
    }
    document.addEventListener("mousedown", onDown)
    return () => document.removeEventListener("mousedown", onDown)
  }, [open])

  const effectiveActive  = detailRoute?.section ?? active
  const activeNavSection = navSectionFor(effectiveActive, trackIds, navIds)

  return (
    <>
      {/* READING PROGRESS BAR — detail pages only */}
      {isDetail && (
        <div
          ref={progressBarRef}
          className="fixed top-0 left-0 right-0 h-[2px] z-[60] bg-accent/70 origin-left"
          style={{ transform: "scaleX(0)" }}
        />
      )}

      {/* DESKTOP */}
      <header className="fixed top-7 left-1/2 -translate-x-1/2 z-50 hidden lg:block">
        {isDetail ? (
          <NavShell scrolled={scrolled}>
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
          /* ── MODE PAGE: Work mega-menu + section links ── */
          <NavShell scrolled={scrolled}>
            <div className="flex items-center gap-1 relative">
              <WorkMegaMenu columns={config.megaMenu} />
              {/* The first nav entry (featured work) is represented by the Work
                  dropdown; the rest scroll to their bands. */}
              {config.nav.slice(1).map(({ label, href }) => (
                <ModeNavItem
                  key={href}
                  href={href}
                  label={label}
                  isActive={activeNavSection === href.replace("#", "")}
                  onActivate={setActive}
                />
              ))}
            </div>
            <div className="w-px h-4 bg-border/60 mx-1" />
            <ThemeToggle />
            <Link
              href={config.resumeHref}
              target="_blank"
              className="ml-1 flex items-center gap-1.5 px-3 py-1.5 rounded-full border border-border/70 text-sm text-muted-foreground hover:text-foreground hover:border-border hover:bg-muted/40 transition"
            >
              Resume
              <IconDownload size={16} />
            </Link>
          </NavShell>
        )}
      </header>

      {/* MOBILE — FAB + MENU */}
      <button
        ref={btnRef}
        onClick={() => setOpen((v) => !v)}
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
                <>
                  {config.nav.map(({ label, href }) => (
                    <ModeNavItem
                      key={href}
                      href={href}
                      label={label}
                      isActive={activeNavSection === href.replace("#", "")}
                      onActivate={(id) => { setActive(id); setOpen(false) }}
                      closeMenu={() => setOpen(false)}
                    />
                  ))}
                  <div className="h-px bg-border/50 my-1" />
                  <div className="flex items-center gap-2">
                    <div className="flex items-center justify-center rounded-xl bg-muted/40 border border-border/60">
                      <ThemeToggle />
                    </div>
                    <Link
                      href={config.resumeHref}
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
