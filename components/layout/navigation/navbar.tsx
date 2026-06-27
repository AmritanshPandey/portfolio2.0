"use client"

import Link from "next/link"
import { usePathname, useRouter } from "next/navigation"
import { AnimatePresence, motion } from "framer-motion"
import clsx from "clsx"
import {
  useEffect,
  useRef,
  useState,
  useSyncExternalStore,
  type MouseEvent,
  type ReactNode,
} from "react"
import {
  IconDownload,
  IconHome,
} from "@tabler/icons-react"

import { ThemeToggle } from "@/components/shared/theme-toggle"
import { scrollToSection } from "@/lib/scroll"

type NavLink = {
  label: string
  href: string
  section: string
  icon?: typeof IconHome
}

const NAV_LINKS: NavLink[] = [
  { label: "Home", href: "/", section: "hero", icon: IconHome },
  { label: "Work", href: "/#work", section: "work" },
  { label: "Exploration", href: "/#explorations", section: "explorations" },
  { label: "Gallery", href: "/gallery", section: "gallery" },
  { label: "Insights", href: "/#insights", section: "insights" },
  { label: "About", href: "/#about", section: "about" },
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
  "/work": { section: "work", label: "Work", href: "/#work" },
  "/systems": { section: "explorations", label: "Exploration", href: "/#explorations" },
  "/explorations": { section: "explorations", label: "Exploration", href: "/#explorations" },
  "/articles": { section: "insights", label: "Insights", href: "/#insights" },
  "/gallery": { section: "gallery", label: "Work", href: "/#work" },
}

const NAV_IDS = NAV_LINKS.map((link) => link.section)
const PENDING_HOME_SECTION_KEY = "portfolio:pending-home-section"

function getDetailRoute(pathname: string) {
  for (const [prefix, meta] of Object.entries(DETAIL_ROUTES)) {
    if (pathname === prefix || pathname.startsWith(`${prefix}/`)) return meta
  }
  return null
}

function navSectionFor(activeId: string) {
  const idx = SECTION_IDS.indexOf(activeId)
  if (idx === -1) return activeId

  for (let i = idx; i >= 0; i--) {
    if (NAV_IDS.includes(SECTION_IDS[i])) return SECTION_IDS[i]
  }

  return activeId
}

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
      const el = document.documentElement
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
      if (ticking) return
      requestAnimationFrame(update)
      ticking = true
    }

    window.addEventListener("scroll", onScroll, { passive: true })
    update()
    return () => window.removeEventListener("scroll", onScroll)
  }, [ids, enabled])

  return [active, setActive] as const
}

function PrimaryNavItem({
  item,
  isActive,
  setActiveImmediate,
  closeMenu,
  className,
}: {
  item: NavLink
  isActive: boolean
  setActiveImmediate: (id: string) => void
  closeMenu?: () => void
  className?: string
}) {
  const router = useRouter()
  const pathname = usePathname()
  const Icon = item.icon

  const handleClick = (e: MouseEvent<HTMLAnchorElement>) => {
    setActiveImmediate(item.section)

    if (item.section === "hero") {
      e.preventDefault()
      if (pathname === "/") window.scrollTo({ top: 0, behavior: "smooth" })
      else router.push("/")
      closeMenu?.()
      return
    }

    if (item.href.startsWith("/#") && pathname === "/") {
      e.preventDefault()
      scrollToSection(item.section)
      closeMenu?.()
      return
    }

    if (item.href.startsWith("/#")) {
      e.preventDefault()
      window.sessionStorage.setItem(PENDING_HOME_SECTION_KEY, item.section)
      router.push("/")
      closeMenu?.()
      return
    }

    closeMenu?.()
  }

  return (
    <Link
      href={item.href}
      onClick={handleClick}
      aria-current={isActive ? "true" : undefined}
      aria-label={Icon ? item.label : undefined}
      className={clsx(
        "group/nav relative flex h-10 shrink-0 items-center gap-1.5 rounded-full px-3 text-[13px] font-medium",
        "transition-colors duration-200 md:px-2.5 lg:px-3 lg:text-sm",
        "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent/55 focus-visible:ring-offset-2 focus-visible:ring-offset-background",
        className,
      )}
    >
      {isActive && (
        <motion.span
          layoutId="nav-active-pill"
          className="absolute inset-0 rounded-full border border-accent/25 bg-accent/[0.08] shadow-[inset_0_1px_0_rgba(255,255,255,0.12)] dark:bg-accent/[0.12]"
          transition={{ type: "spring", stiffness: 420, damping: 34 }}
        />
      )}

      <span
        className={clsx(
          "relative z-10 flex items-center gap-1.5 transition-colors duration-200",
          isActive ? "text-foreground" : "text-muted-foreground group-hover/nav:text-foreground",
        )}
      >
        {Icon ? <Icon size={16} strokeWidth={2} className="opacity-75" /> : item.label}
        {isActive && !Icon ? <span aria-hidden className="h-1 w-1 rounded-full bg-accent" /> : null}
      </span>
    </Link>
  )
}

function NavShell({
  scrolled,
  children,
  className,
}: {
  scrolled: boolean
  children: ReactNode
  className?: string
}) {
  const blurValue = scrolled ? "saturate(145%) blur(18px)" : "saturate(130%) blur(12px)"

  return (
    <nav
      className={clsx(
        "navbar-enter relative flex max-w-[calc(100vw-2rem)] items-center gap-1 overflow-x-auto rounded-full px-1.5 py-1.5",
        "[-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden",
        "transition-[background,border-color,box-shadow,transform] duration-300 ease-out [transform:translateZ(0)]",
        scrolled
          ? "border border-black/[0.08] bg-white/[0.90] shadow-[0_14px_42px_rgba(0,0,0,0.14)] dark:border-white/[0.12] dark:bg-neutral-950/[0.82] dark:shadow-[0_18px_60px_rgba(0,0,0,0.45)]"
          : "border border-black/[0.06] bg-white/[0.74] shadow-[0_8px_28px_rgba(0,0,0,0.08)] dark:border-white/[0.10] dark:bg-neutral-950/[0.64] dark:shadow-[0_12px_42px_rgba(0,0,0,0.30)]",
        className,
      )}
      style={{
        WebkitBackdropFilter: blurValue,
        backdropFilter: blurValue,
      }}
    >
      <div className="pointer-events-none absolute inset-x-0 top-0 h-px rounded-full bg-gradient-to-r from-transparent via-black/[0.08] to-transparent dark:via-white/[0.15]" />
      <div className="pointer-events-none absolute inset-0 rounded-full ring-1 ring-inset ring-white/35 dark:ring-white/[0.04]" />
      {children}
    </nav>
  )
}

function Divider() {
  return <div className="mx-1 h-4 w-px shrink-0 bg-border/60" />
}

export default function Navbar() {
  const pathname = usePathname()
  const isHome = pathname === "/"
  const detailRoute = getDetailRoute(pathname)
  const isDetail = Boolean(detailRoute)

  const [active, setActive] = useActiveSection(SECTION_IDS, isHome)
  const [open, setOpen] = useState(false)
  const scrolled = useScrolled()
  const progressBarRef = useProgressBar(isDetail)
  const menuRef = useRef<HTMLDivElement>(null)
  const btnRef = useRef<HTMLButtonElement>(null)

  useEffect(() => {
    const onResize = () => {
      if (window.innerWidth >= 768) setOpen(false)
    }

    window.addEventListener("resize", onResize)
    return () => window.removeEventListener("resize", onResize)
  }, [])

  useEffect(() => {
    if (!open) return

    const onDown = (e: globalThis.MouseEvent) => {
      const target = e.target as Node
      if (!menuRef.current?.contains(target) && !btnRef.current?.contains(target)) setOpen(false)
    }

    document.addEventListener("mousedown", onDown)
    return () => document.removeEventListener("mousedown", onDown)
  }, [open])

  useEffect(() => {
    if (!open) return

    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false)
    }

    document.addEventListener("keydown", onKeyDown)
    return () => document.removeEventListener("keydown", onKeyDown)
  }, [open])

  const effectiveActive = detailRoute?.section ?? (isHome ? active : "hero")
  const activeNavSection = navSectionFor(effectiveActive)

  return (
    <>
      {isDetail && (
        <div
          ref={progressBarRef}
          className="fixed left-0 right-0 top-0 z-[60] h-[2px] origin-left bg-accent/70"
          style={{ transform: "scaleX(0)" }}
        />
      )}

      <header className="fixed left-1/2 top-5 z-50 hidden w-[calc(100vw-2rem)] -translate-x-1/2 justify-center md:flex lg:top-7 lg:w-auto">
        <NavShell scrolled={scrolled}>
          <div className="relative flex items-center gap-1">
            {NAV_LINKS.map((item) => (
              <PrimaryNavItem
                key={item.href}
                item={item}
                isActive={activeNavSection === item.section}
                setActiveImmediate={setActive}
              />
            ))}
          </div>

          <Divider />

          <ThemeToggle />

          <Link
            href="/resume.pdf"
            target="_blank"
            className="group/resume relative ml-1 flex h-10 shrink-0 items-center gap-1.5 rounded-full border border-border/70 px-3 text-sm font-medium text-muted-foreground transition-colors duration-200 hover:border-accent/35 hover:bg-accent/[0.08] hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent/55 focus-visible:ring-offset-2 focus-visible:ring-offset-background"
          >
            <span className="hidden lg:inline">Resume</span>
            <IconDownload size={16} className="transition-transform duration-200 group-hover/resume:translate-y-0.5" />
          </Link>
        </NavShell>
      </header>

      <button
        ref={btnRef}
        onClick={() => setOpen((value) => !value)}
        aria-label={open ? "Close navigation menu" : "Open navigation menu"}
        aria-expanded={open}
        data-menu-open={open}
        className="
          fixed right-4 top-[calc(env(safe-area-inset-top)+1rem)] z-50 flex h-14 w-14 items-center justify-center rounded-full md:hidden
          border border-black/[0.06] bg-white/90 shadow-[0_14px_40px_rgba(0,0,0,0.20)] backdrop-blur-xl
          transition active:scale-[0.92] dark:border-white/[0.10] dark:bg-neutral-950/84
        "
        style={{
          WebkitBackdropFilter: "saturate(145%) blur(16px)",
          backdropFilter: "saturate(145%) blur(16px)",
        }}
      >
        <span aria-hidden className="menu-morph">
          <span />
          <span />
          <span />
        </span>
      </button>

      <AnimatePresence>
        {open && (
          <>
            <motion.button
              type="button"
              aria-label="Close navigation menu"
              className="fixed inset-0 z-40 bg-background/20 backdrop-blur-[2px] md:hidden"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.18 }}
              onClick={() => setOpen(false)}
            />

            <motion.div
              ref={menuRef}
              initial={{ opacity: 0, y: 12, scale: 0.98 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 8, scale: 0.98 }}
              transition={{ duration: 0.2, ease: [0.22, 1, 0.36, 1] }}
              className="
                fixed right-4 top-[calc(env(safe-area-inset-top)+5rem)] z-50 w-[min(21rem,calc(100vw-2rem))] overflow-hidden rounded-3xl md:hidden
                border border-black/[0.08] bg-white/94 shadow-[0_24px_70px_rgba(0,0,0,0.24)] backdrop-blur-xl
                dark:border-white/[0.10] dark:bg-neutral-950/92 dark:shadow-[0_28px_80px_rgba(0,0,0,0.55)]
              "
              style={{
                WebkitBackdropFilter: "saturate(145%) blur(18px)",
                backdropFilter: "saturate(145%) blur(18px)",
              }}
            >
              <div className="border-b border-border/60 px-4 py-3">
                <p className="font-mono text-[10px] font-semibold uppercase tracking-[0.16em] text-muted-foreground">
                  Menu
                </p>
              </div>

              <div className="flex flex-col gap-1 p-3">
                {NAV_LINKS.map((item) => (
                  <PrimaryNavItem
                    key={item.href}
                    item={item}
                    isActive={activeNavSection === item.section}
                    setActiveImmediate={(id) => {
                      setActive(id)
                      setOpen(false)
                    }}
                    closeMenu={() => setOpen(false)}
                    className="h-11 w-full justify-start rounded-2xl px-3 text-sm"
                  />
                ))}

                <div className="my-1 h-px bg-border/55" />

                <div className="flex items-center gap-2 px-1 py-1">
                  <div className="flex h-11 w-11 items-center justify-center rounded-2xl border border-border/60 bg-muted/35">
                    <ThemeToggle />
                  </div>
                  <Link
                    href="/resume.pdf"
                    target="_blank"
                    onClick={() => setOpen(false)}
                    className="flex min-h-11 flex-1 items-center justify-center gap-2 rounded-2xl px-4 text-sm font-medium text-muted-foreground transition hover:bg-muted/45 hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent/55 focus-visible:ring-offset-2 focus-visible:ring-offset-background"
                  >
                    Resume <IconDownload size={16} />
                  </Link>
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  )
}
