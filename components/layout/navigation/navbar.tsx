"use client"

import { useRouter, usePathname } from "next/navigation"
import { useState, useEffect } from "react"
import clsx from "clsx"
import Link from "next/link"
import { motion } from "framer-motion"
import {
  IconHome,
  IconMenu2,
  IconX,
  IconDownload,
} from "@tabler/icons-react"
import { ThemeToggle } from "@/components/shared/theme-toggle"
import { scrollToSection } from "@/lib/scroll"
import { saveScroll } from "@/lib/scroll-manager"

// ─────────────────────────
// NAV LINKS
// ─────────────────────────
const NAV_LINKS = [
  { label: "Home", href: "#hero", icon: true },
  { label: "Work", href: "#work" },
  { label: "Approach", href: "#approach" },
  { label: "Exploration", href: "#exploration" },
  { label: "Impact", href: "#impact" },
  { label: "About", href: "#about" },
]

// ─────────────────────────
// ACTIVE SECTION (smooth + perf)
// ─────────────────────────
function useActiveSection(ids: string[]) {
  const [active, setActive] = useState(ids[0])

  useEffect(() => {
    let ticking = false

    const update = () => {
      const mid = window.scrollY + window.innerHeight * 0.45
      let current = ids[0]

      for (const id of ids) {
        const el = document.getElementById(id)
        if (!el) continue
        if (mid >= el.offsetTop) current = id
      }

      setActive(current)
      ticking = false
    }

    const onScroll = () => {
      if (!ticking) {
        requestAnimationFrame(update)
        ticking = true
      }
    }

    window.addEventListener("scroll", onScroll, { passive: true })
    update()

    return () => window.removeEventListener("scroll", onScroll)
  }, [ids])

  return active
}

// ─────────────────────────
// NAV ITEM
// ─────────────────────────
function NavItem({
  href,
  label,
  icon,
  isActive,
  setActiveImmediate,
  closeMenu,
}: {
  href: string
  label: string
  icon?: boolean
  isActive: boolean
  setActiveImmediate: (id: string) => void
  closeMenu?: () => void
}) {
  const router = useRouter()
  const pathname = usePathname()
  const id = href.replace("#", "")

  const handleClick = (e: React.MouseEvent) => {
    e.preventDefault()

    setActiveImmediate(id)
    saveScroll(pathname)

    if (id === "hero") {
      if (pathname === "/") {
        window.scrollTo({ top: 0, behavior: "smooth" })
      } else {
        router.push("/")
      }
      closeMenu?.()
      return
    }

    if (pathname === "/") {
      scrollToSection(id)
      closeMenu?.()
      return
    }

    router.push(`/#${id}`)
    closeMenu?.()
  }

  return (
    <button
      onClick={handleClick}
      className="
        relative flex items-center gap-1.5 px-3 py-2 rounded-full
        text-[14px] font-medium
      "
    >
      {/* ACTIVE PILL */}
      {isActive && (
        <motion.span
          layoutId="nav-pill"
          transition={{ type: "spring", stiffness: 420, damping: 32 }}
          className="
            absolute inset-0 rounded-full
            bg-black/[0.04] dark:bg-white/[0.08]
            border border-black/[0.06] dark:border-white/[0.08]
          "
        />
      )}

      <span
        className={clsx(
          "relative z-10 flex items-center gap-1.5 transition-colors duration-200",
          isActive
            ? "text-foreground"
            : "text-muted-foreground hover:text-foreground"
        )}
      >
        {icon ? <IconHome size={16} className="opacity-70" /> : label}
      </span>
    </button>
  )
}

// ─────────────────────────
// NAVBAR
// ─────────────────────────
export default function Navbar() {
  const pathname = usePathname()
  const isHome = pathname === "/"

  const detectedActive = useActiveSection([
    "hero",
    "work",
    "approach",
    "exploration",
    "impact",
    "about",
  ])

  const [active, setActive] = useState("hero")
  const [open, setOpen] = useState(false)

  useEffect(() => {
    if (isHome) setActive(detectedActive)
  }, [detectedActive, isHome])

  useEffect(() => {
    const onResize = () => {
      if (window.innerWidth >= 768) setOpen(false)
    }
    window.addEventListener("resize", onResize)
    return () => window.removeEventListener("resize", onResize)
  }, [])

  return (
    <>
      {/* DESKTOP */}
      <header className="fixed top-5 left-1/2 -translate-x-1/2 z-50 hidden md:block">
        <nav className="
          relative flex items-center gap-1 px-2 py-2 rounded-full

          bg-white dark:bg-neutral-900
          border border-black/[0.06] dark:border-white/[0.08]

          shadow-[0_6px_18px_rgba(0,0,0,0.08)]

          [transform:translateZ(0)]
        ">

          {/* subtle top highlight */}
          <div className="
            pointer-events-none absolute inset-x-0 top-0 h-px
            bg-gradient-to-r from-transparent via-black/10 to-transparent
            dark:via-white/20
          " />

          <div className="flex items-center gap-1 relative">
            {NAV_LINKS.map(({ label, href, icon }) => (
              <NavItem
                key={href}
                href={href}
                label={label}
                icon={icon}
                isActive={isHome && active === href.replace("#", "")}
                setActiveImmediate={setActive}
              />
            ))}
          </div>

          <div className="w-px h-4 bg-border/60 mx-1" />

          <ThemeToggle />

          <Link
            href="/resume.pdf"
            target="_blank"
            className="
              ml-1 flex items-center gap-1.5 px-3 py-1.5 rounded-full
              text-sm text-muted-foreground hover:text-foreground
              hover:bg-muted/40 transition
            "
          >
            Resume
            <IconDownload size={16} />
          </Link>
        </nav>
      </header>

      {/* MOBILE BUTTON */}
      <button
        onClick={() => setOpen(v => !v)}
        className="
          fixed bottom-6 right-6 z-50 md:hidden
          w-14 h-14 rounded-full
          flex items-center justify-center

          bg-white dark:bg-neutral-900
          border border-black/[0.06] dark:border-white/[0.08]

          shadow-[0_10px_30px_rgba(0,0,0,0.2)]

          active:scale-[0.92]
          transition
        "
      >
        {open ? <IconX size={24} /> : <IconMenu2 size={24} />}
      </button>

      {/* MOBILE MENU */}
      {open && (
        <div className="
          fixed bottom-24 right-6 z-50 md:hidden w-64
          rounded-2xl overflow-hidden

          bg-white dark:bg-neutral-900
          border border-black/[0.06] dark:border-white/[0.08]

          shadow-[0_20px_60px_rgba(0,0,0,0.25)]
        ">
          <div className="p-3 flex flex-col gap-2">
            {NAV_LINKS.map(({ label, href, icon }) => (
              <NavItem
                key={href}
                href={href}
                label={label}
                icon={icon}
                isActive={isHome && active === href.replace("#", "")}
                setActiveImmediate={(id) => {
                  setActive(id)
                  setOpen(false)
                }}
                closeMenu={() => setOpen(false)}
              />
            ))}

            <div className="h-px bg-border/50 my-2" />

            <div className="flex items-center gap-2">
              <div className="w-10 h-10 flex items-center justify-center rounded-xl bg-muted/40 border border-border/60">
                <ThemeToggle />
              </div>

              <Link
                href="/resume.pdf"
                target="_blank"
                className="
                  flex-1 flex items-center justify-center gap-2
                  h-10 rounded-xl px-4
                  text-sm text-muted-foreground hover:text-foreground
                  hover:bg-muted/40 transition
                "
              >
                Resume
                <IconDownload size={16} />
              </Link>
            </div>
          </div>
        </div>
      )}
    </>
  )
}