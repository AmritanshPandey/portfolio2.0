"use client"

import { useRouter, usePathname } from "next/navigation"
import { useState, useEffect, useRef, useSyncExternalStore } from "react"
import clsx from "clsx"
import Link from "next/link"
import { AnimatePresence, motion } from "framer-motion"
import {
  IconHome,
  IconMenu2,
  IconX,
  IconDownload,
  IconArrowLeft,
} from "@tabler/icons-react"
import { ThemeToggle } from "@/components/shared/theme-toggle"
import { scrollToSection } from "@/lib/scroll"
import { saveScroll } from "@/lib/scroll-manager"

// ─────────────────────────
// CONSTANTS
// ─────────────────────────

const NAV_LINKS = [
  { label: "Home",     href: "#hero",        icon: true },
  { label: "Work",     href: "#work" },
  { label: "Projects", href: "#exploration" },
  { label: "Impact",   href: "#impact" },
  { label: "About",    href: "#about" },
]

const SECTION_IDS = ["hero", "work", "exploration", "impact", "about"]

const DETAIL_ROUTES: Record<string, { section: string; label: string; href: string }> = {
  "/work":         { section: "work",        label: "Work",     href: "/#work" },
  "/systems":      { section: "work",        label: "Work",     href: "/#work" },
  "/explorations": { section: "exploration", label: "Projects", href: "/#exploration" },
  "/articles":     { section: "exploration", label: "Projects", href: "/#exploration" },
}

function getDetailRoute(pathname: string) {
  for (const [prefix, meta] of Object.entries(DETAIL_ROUTES)) {
    if (pathname.startsWith(prefix)) return meta
  }
  return null
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
    saveScroll(pathname)

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
    <button
      onClick={handleClick}
      className="relative flex items-center gap-1.5 px-3 py-2 rounded-full text-[14px] font-medium"
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
    </button>
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
  const router      = useRouter()
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
    const onResize = () => { if (window.innerWidth >= 768) setOpen(false) }
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

  return (
    <>
      {/* ══════════════════════════════════════════════
          READING PROGRESS BAR — detail pages only
      ══════════════════════════════════════════════ */}
      {isDetail && (
        <div
          ref={progressBarRef}
          className="fixed top-0 left-0 right-0 h-[2px] z-[60] bg-orange-500/70 origin-left"
          style={{ transform: "scaleX(0)" }}
        />
      )}

      {/* ══════════════════════════════════════════════
          DESKTOP
      ══════════════════════════════════════════════ */}
      <header className="fixed top-7 left-1/2 -translate-x-1/2 z-50 hidden md:block">
        {isDetail ? (
          /* ── DETAIL: minimal pill ─────────────────── */
          <NavShell scrolled={scrolled}>
            <button
              onClick={() => router.push(detailRoute!.href)}
              className="
                flex items-center gap-1.5 pl-2 pr-3 py-1.5 rounded-full
                text-[13px] font-medium text-muted-foreground
                hover:text-foreground hover:bg-black/[0.04] dark:hover:bg-white/[0.06]
                transition-colors duration-200
              "
            >
              <IconArrowLeft size={14} stroke={2} />
              {detailRoute!.label}
            </button>

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
                  isActive={effectiveActive === href.replace("#", "")}
                  setActiveImmediate={setActive}
                />
              ))}
            </div>

            <div className="w-px h-4 bg-border/60 mx-1" />

            <ThemeToggle />

            <Link
              href="/resume.pdf"
              target="_blank"
              className="ml-1 flex items-center gap-1.5 px-3 py-1.5 rounded-full text-sm text-muted-foreground hover:text-foreground hover:bg-muted/40 transition"
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
        className="
          fixed bottom-6 right-6 z-50 md:hidden
          w-14 h-14 rounded-full flex items-center justify-center
          bg-white dark:bg-neutral-900
          border border-black/[0.06] dark:border-white/[0.08]
          shadow-[0_10px_30px_rgba(0,0,0,0.2)]
          active:scale-[0.92] transition
        "
      >
        <AnimatePresence mode="wait" initial={false}>
          {open ? (
            <motion.span key="x"
              initial={{ rotate: -90, opacity: 0 }} animate={{ rotate: 0, opacity: 1 }}
              exit={{ rotate: 90, opacity: 0 }} transition={{ duration: 0.15 }}
            >
              <IconX size={22} />
            </motion.span>
          ) : (
            <motion.span key="menu"
              initial={{ rotate: 90, opacity: 0 }} animate={{ rotate: 0, opacity: 1 }}
              exit={{ rotate: -90, opacity: 0 }} transition={{ duration: 0.15 }}
            >
              <IconMenu2 size={22} />
            </motion.span>
          )}
        </AnimatePresence>
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
              fixed bottom-24 right-6 z-50 md:hidden w-64
              rounded-2xl overflow-hidden
              bg-white dark:bg-neutral-900
              border border-black/[0.06] dark:border-white/[0.08]
              shadow-[0_20px_60px_rgba(0,0,0,0.25)]
            "
          >
            <div className="p-3 flex flex-col gap-1">

              {isDetail ? (
                /* ── DETAIL: back + theme only ──────── */
                <>
                  <button
                    onClick={() => { router.push(detailRoute!.href); setOpen(false) }}
                    className="flex items-center gap-2 px-3 py-3 rounded-xl text-sm font-medium text-muted-foreground hover:text-foreground hover:bg-muted/40 transition"
                  >
                    <IconArrowLeft size={16} stroke={2} />
                    Back to {detailRoute!.label}
                  </button>
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
                      isActive={effectiveActive === href.replace("#", "")}
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
