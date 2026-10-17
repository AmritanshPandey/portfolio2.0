"use client"

import Link from "next/link"
import { usePathname, useRouter } from "next/navigation"
import clsx from "clsx"
import {
  useEffect,
  useLayoutEffect,
  useRef,
  useState,
  useSyncExternalStore,
  type MouseEvent,
  type ReactNode,
} from "react"
import { IconHome } from "@tabler/icons-react"

import { scrollToSection } from "@/lib/scroll"
import { EMAIL_HREF, RESUME_HREF } from "@/lib/contact"
import { ThemeToggle } from "@/components/shared/theme-fab"
import { SoundToggle } from "@/components/shared/sound-toggle"

type NavLink = {
  label: string
  href: string
  section: string
  icon?: typeof IconHome
}

// Home + in-page sections (left group). These scroll to home sections.
const SECTION_LINKS: NavLink[] = [
  { label: "Home", href: "/", section: "hero", icon: IconHome },
  { label: "Work", href: "/#work", section: "work" },
  { label: "Exploration", href: "/#explorations", section: "explorations" },
  { label: "Insights", href: "/#insights", section: "insights" },
  { label: "About", href: "/#about", section: "about" },
]

// Standalone pages (right group). These are real routes.
const PAGE_LINKS: NavLink[] = [
  { label: "Gallery", href: "/gallery", section: "gallery" },
  { label: "Lab", href: "/playground", section: "playground" },
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
  "/gallery": { section: "gallery", label: "Gallery", href: "/gallery" },
  "/playground": { section: "playground", label: "Lab", href: "/playground" },
  "/showcase": { section: "playground", label: "Lab", href: "/showcase" },
}

const NAV_IDS = SECTION_LINKS.map((link) => link.section)
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
      // Near the top, the answer is always the first section — this also
      // sidesteps mis-measurement before layout settles (all offsetTops 0
      // during hydration made the last section win on load).
      const mid = window.scrollY + window.innerHeight * 0.45
      let current = ids[0]

      if (window.scrollY > 80) {
        for (const id of ids) {
          const el = document.getElementById(id)
          if (el && el.offsetTop > 0 && mid >= el.offsetTop) current = id
        }
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
    window.addEventListener("resize", onScroll, { passive: true })
    update()
    // Section offsets move as images/fonts settle — re-measure after load.
    const settle = window.setTimeout(update, 1200)
    window.addEventListener("load", onScroll)
    return () => {
      window.removeEventListener("scroll", onScroll)
      window.removeEventListener("resize", onScroll)
      window.removeEventListener("load", onScroll)
      clearTimeout(settle)
    }
  }, [ids, enabled])

  return [active, setActive] as const
}

function PrimaryNavItem({
  item,
  isActive,
  setActiveImmediate,
  closeMenu,
  className,
  labelRef,
}: {
  item: NavLink
  isActive: boolean
  setActiveImmediate: (id: string) => void
  closeMenu?: () => void
  className?: string
  /** Lets the desktop nav measure this label for its gliding underline. */
  labelRef?: (el: HTMLSpanElement | null) => void
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
        "group/nav relative flex h-10 shrink-0 items-center px-2.5 text-[14px] font-medium tracking-[-0.005em]",
        "transition-colors duration-200 lg:px-3",
        "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent/55 focus-visible:ring-offset-2 focus-visible:ring-offset-background",
        className,
      )}
    >
      <span
        ref={labelRef}
        className={clsx(
          "relative z-10 flex items-center transition-colors duration-200",
          isActive ? "text-foreground" : "text-muted-foreground group-hover/nav:text-foreground",
        )}
      >
        {/* Home is a mark, not an icon: a small ultramarine square. */}
        {Icon ? (
          <span
            aria-hidden
            className={clsx(
              "block h-3 w-3 bg-accent transition-transform duration-300 ease-[cubic-bezier(0.16,1,0.3,1)]",
              "group-hover/nav:rotate-45",
            )}
          />
        ) : (
          item.label
        )}
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
  return (
    <nav
      className={clsx(
        "navbar-enter ledger flex h-[var(--nav-h)] items-center justify-between gap-4",
        className,
      )}
      data-scrolled={scrolled || undefined}
    >
      {children}
    </nav>
  )
}

/**
 * The two things a recruiter comes for, reachable from any page: the resume
 * (a file, so a plain link in a new tab rather than a prefetched route) and a
 * direct email. "Email me" is the only filled button in the nav, so it reads
 * as the one action rather than another destination.
 */
function ContactActions({
  onNavigate,
  layout = "inline",
}: {
  onNavigate?: () => void
  layout?: "inline" | "menu"
}) {
  const menu = layout === "menu"
  const focus =
    "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent/55 focus-visible:ring-offset-2 focus-visible:ring-offset-background"

  return (
    <div className={clsx(menu ? "grid grid-cols-2 gap-3" : "flex items-center gap-1")}>
      <a
        href={RESUME_HREF}
        target="_blank"
        rel="noopener noreferrer"
        onClick={onNavigate}
        className={clsx(
          "flex shrink-0 items-center justify-center font-medium transition-colors duration-200",
          menu
            ? "btn-line w-full"
            : "h-10 px-2.5 text-[14px] text-muted-foreground hover:text-foreground lg:px-3",
          focus
        )}
      >
        Resume
      </a>
      <a
        href={EMAIL_HREF}
        onClick={onNavigate}
        className={clsx(
          "btn-ink shrink-0",
          menu ? "w-full" : "!min-h-9 !px-4 text-[14px]",
          focus
        )}
      >
        Email me
      </a>
    </div>
  )
}

function Divider() {
  return <div aria-hidden className="mx-2 h-4 w-px shrink-0 bg-border" />
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

    const previousBodyOverflow = document.body.style.overflow
    const previousRootOverflow = document.documentElement.style.overflow
    document.body.style.overflow = "hidden"
    document.documentElement.style.overflow = "hidden"

    return () => {
      document.body.style.overflow = previousBodyOverflow
      document.documentElement.style.overflow = previousRootOverflow
    }
  }, [open])

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

  // Gliding underline: measure the active label inside the links container.
  const linksRef = useRef<HTMLDivElement>(null)
  const labelRefs = useRef<Record<string, HTMLSpanElement | null>>({})
  const [bar, setBar] = useState<{ x: number; w: number } | null>(null)
  // The first placement snaps; only later moves glide.
  const [barAnimates, setBarAnimates] = useState(false)

  useEffect(() => {
    const frame = requestAnimationFrame(() => setBarAnimates(true))
    return () => cancelAnimationFrame(frame)
  }, [])

  useLayoutEffect(() => {
    const measure = () => {
      const box = linksRef.current?.getBoundingClientRect()
      const label = labelRefs.current[activeNavSection]?.getBoundingClientRect()
      setBar(box && label ? { x: label.left - box.left, w: label.width } : null)
    }
    measure()
    window.addEventListener("resize", measure)
    document.fonts?.ready.then(measure)
    return () => window.removeEventListener("resize", measure)
  }, [activeNavSection])

  return (
    <>
      {isDetail && (
        <div
          ref={progressBarRef}
          className="fixed left-0 right-0 top-0 z-[60] h-[2px] origin-left bg-accent"
          style={{ transform: "scaleX(0)" }}
        />
      )}

      <header
        className={clsx(
          "fixed inset-x-0 top-0 z-50 hidden bg-background md:block",
          "border-b transition-[border-color] duration-300",
          scrolled ? "border-border" : "border-transparent",
        )}
      >
        <NavShell scrolled={scrolled}>
          <PrimaryNavItem
            item={SECTION_LINKS[0]}
            isActive={activeNavSection === SECTION_LINKS[0].section}
            setActiveImmediate={setActive}
            className="-ml-2.5 lg:-ml-3"
          />

          <div ref={linksRef} className="relative flex items-center">
          {/* Active state: one 2px ultramarine rule that glides between items
              (transform only), placed without a slide on first paint. */}
          <span
            aria-hidden
            className="pointer-events-none absolute bottom-[14px] left-0 h-[2px] w-[100px] origin-left bg-accent"
            style={{
              transform: `translateX(${bar?.x ?? 0}px) scaleX(${(bar?.w ?? 0) / 100})`,
              opacity: bar ? 1 : 0,
              transition: barAnimates
                ? "transform 480ms cubic-bezier(0.16,1,0.3,1), opacity 200ms ease"
                : "none",
            }}
          />

          {/* In-page sections */}
          <div className="flex items-center">
            {SECTION_LINKS.slice(1).map((item) => (
              <PrimaryNavItem
                key={item.href}
                item={item}
                isActive={activeNavSection === item.section}
                setActiveImmediate={setActive}
                labelRef={(el) => { labelRefs.current[item.section] = el }}
              />
            ))}
          </div>

          <Divider />

          {/* Standalone pages */}
          <div className="flex items-center">
            {PAGE_LINKS.map((item) => (
              <PrimaryNavItem
                key={item.href}
                item={item}
                isActive={activeNavSection === item.section}
                setActiveImmediate={setActive}
                labelRef={(el) => { labelRefs.current[item.section] = el }}
              />
            ))}
          </div>

          <Divider />

          <ContactActions />
          <SoundToggle className="ml-2" />
          <ThemeToggle className="ml-2" />
          </div>
        </NavShell>
      </header>

      <div
        className={clsx(
          "fixed inset-x-0 top-0 z-50 flex h-[calc(env(safe-area-inset-top)+4rem)] items-end bg-background pb-2.5 md:hidden",
          "border-b transition-[border-color] duration-300",
          scrolled || open ? "border-border" : "border-transparent",
        )}
      >
        <div className="ledger flex h-11 items-center">
          <PrimaryNavItem
            item={SECTION_LINKS[0]}
            isActive={activeNavSection === SECTION_LINKS[0].section}
            setActiveImmediate={setActive}
            closeMenu={() => setOpen(false)}
            className="-ml-2.5"
          />
        </div>
      </div>

      <button
        ref={btnRef}
        onClick={() => setOpen((value) => !value)}
        aria-label={open ? "Close navigation menu" : "Open navigation menu"}
        aria-expanded={open}
        data-menu-open={open}
        className="
          fixed right-[var(--gutter)] top-[calc(env(safe-area-inset-top)+0.625rem)] z-[51] flex h-11 w-11 items-center justify-center md:hidden
          border border-foreground bg-background text-foreground
          transition-transform duration-150 active:translate-y-px
        "
      >
        <span aria-hidden className="menu-morph">
          <span />
          <span />
          <span />
        </span>
      </button>

      {/* Phone menu: a paper sheet that fades and drops in (CSS only). It is
          inert while closed so nothing hidden can take focus. */}
      <div
        ref={menuRef}
        inert={!open}
        aria-hidden={!open}
        className={clsx(
          "fixed inset-x-0 bottom-0 top-[calc(env(safe-area-inset-top)+4rem)] z-50 flex flex-col overflow-y-auto bg-background md:hidden",
          "transition-[opacity,transform,visibility] duration-[240ms] ease-[cubic-bezier(0.16,1,0.3,1)]",
          open ? "visible translate-y-0 opacity-100" : "pointer-events-none invisible -translate-y-2 opacity-0",
        )}
      >
              <p className="ledger ledger-label pt-5">Menu</p>

              <div className="ledger flex flex-col pt-2">
                {SECTION_LINKS.slice(1).map((item) => (
                  <PrimaryNavItem
                    key={item.href}
                    item={item}
                    isActive={activeNavSection === item.section}
                    setActiveImmediate={(id) => {
                      setActive(id)
                      setOpen(false)
                    }}
                    closeMenu={() => setOpen(false)}
                    className="h-auto w-full justify-start border-b border-border !px-0 py-3 text-[2rem] font-[750] tracking-[-0.03em] [font-variation-settings:'wdth'_112]"
                  />
                ))}

                {PAGE_LINKS.map((item) => (
                  <PrimaryNavItem
                    key={item.href}
                    item={item}
                    isActive={activeNavSection === item.section}
                    setActiveImmediate={(id) => {
                      setActive(id)
                      setOpen(false)
                    }}
                    closeMenu={() => setOpen(false)}
                    className="h-auto w-full justify-start border-b border-border !px-0 py-3 text-[2rem] font-[750] tracking-[-0.03em] [font-variation-settings:'wdth'_112]"
                  />
                ))}
              </div>

              <div className="ledger mt-auto space-y-3 pb-[calc(env(safe-area-inset-bottom)+1.5rem)] pt-8">
                <ContactActions layout="menu" onNavigate={() => setOpen(false)} />
                <ThemeToggle className="size-12" />
              </div>
      </div>
    </>
  )
}
