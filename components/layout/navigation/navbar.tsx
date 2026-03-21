"use client"

import { useState, useEffect, useRef } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import clsx from "clsx"
import {
  IconDownload,
  IconMenu2,
  IconX,
  IconArrowLeft,
  IconHome,
} from "@tabler/icons-react"

// ─── Navigation Links ─────────────────
const NAV_LINKS = [
  { label: "Home", href: "#hero", icon: true },
  { label: "Work", href: "#work" },
  { label: "Approach", href: "#approach" },
  { label: "Exploration", href: "#exploration" },
  { label: "Impact", href: "#impact" },
  { label: "About", href: "#about" },
]

// ─── Back Navigation ─────────────────
const BACK_CONFIG = {
  home: "/",
  work: "/#work",
  system: "/#work",
  exploration: "/#exploration",
  article: "/#exploration",
  other: "/",
}

// ─── Helpers ─────────────────────────
function getContext(pathname: string) {
  if (pathname === "/") return "home"
  if (pathname.startsWith("/work/")) return "work"
  if (pathname.startsWith("/systems/")) return "system"
  if (pathname.startsWith("/explorations/")) return "exploration"
  if (pathname.startsWith("/articles/")) return "article"
  return "other"
}

function slugToTitle(slug: string) {
  return slug
    .split("-")
    .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
    .join(" ")
}

// ─── Premium Dark Glass ──────────────
const GLASS = `
  bg-[rgba(18,18,18,0.7)]
  backdrop-blur-2xl
  border border-white/10
  shadow-[0_10px_40px_rgba(0,0,0,0.45)]
`

export default function Navbar() {
  const [active, setActive] = useState("hero")
  const [open, setOpen] = useState(false)

  const pathname = usePathname()
  const context = getContext(pathname)
  const isHome = context === "home"

  const pageTitle = slugToTitle(pathname.split("/").pop() || "")
  const backHref = BACK_CONFIG[context]

  const hasMounted = useRef(false)

  // ─── FIXED: Stable Active Detection ───────
  useEffect(() => {
    if (!isHome) return

    // Always start with hero
    setActive("hero")

    const observer = new IntersectionObserver(
      (entries) => {
        // Skip first noisy paint
        if (!hasMounted.current) {
          hasMounted.current = true
          return
        }

        let maxRatio = 0
        let current = "hero"

        entries.forEach((entry) => {
          if (entry.intersectionRatio > maxRatio) {
            maxRatio = entry.intersectionRatio
            current = entry.target.id
          }
        })

        if (maxRatio > 0.35) {
          setActive(current)
        }
      },
      {
        rootMargin: "-35% 0px -45% 0px", // center-weighted viewport
        threshold: [0.25, 0.5, 0.75],
      }
    )

    NAV_LINKS.forEach(({ href }) => {
      const el = document.querySelector(href)
      if (el) observer.observe(el)
    })

    return () => observer.disconnect()
  }, [isHome])

  // ─── FIX: Hard override for top scroll ───
  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY < 150) {
        setActive("hero")
      }
    }

    window.addEventListener("scroll", handleScroll)
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  return (
    <>
      {/* ─── DESKTOP NAV ───────────────── */}
      <header className="fixed top-5 left-1/2 -translate-x-1/2 z-50 hidden md:block">
        <nav className={clsx("relative flex items-center gap-1 px-3 py-2 rounded-full", GLASS)}>
          
          <span className="pointer-events-none absolute inset-0 rounded-full border border-white/5" />

          {/* HOME NAV */}
          {isHome ? (
            <ul className="flex items-center gap-1">
              {NAV_LINKS.map(({ label, href, icon }) => {
                const isActive = active === href.replace("#", "")

                return (
                  <li key={href}>
                    <Link
                      href={href}
                      className={clsx(
                        "flex items-center gap-2 px-3 py-1.5 rounded-full text-sm transition-all duration-200",
                        isActive
                          ? "text-white bg-white/[0.08]"
                          : "text-white/50 hover:text-white hover:bg-white/[0.05]"
                      )}
                    >
                      {icon ? (
                        <IconHome size={16} className={isActive ? "" : "opacity-60"} />
                      ) : (
                        label
                      )}
                    </Link>
                  </li>
                )
              })}
            </ul>
          ) : (
            <div className="flex items-center gap-2 px-2">
              <Link
                href={backHref}
                className="flex items-center gap-1.5 px-3 py-1.5 text-sm text-white/50 hover:text-white transition"
              >
                <IconArrowLeft size={14} />
                Back
              </Link>

              <span className="text-white/20">/</span>

              <span className="text-sm text-white/70 font-medium">
                {pageTitle}
              </span>
            </div>
          )}

          {/* Divider */}
          <div className="w-px h-4 bg-white/10 mx-1" />

          {/* Resume */}
          <Link
            href="/resume.pdf"
            target="_blank"
            className="flex items-center gap-2 px-3 py-1.5 rounded-full text-sm text-white/80 hover:text-white hover:bg-white/[0.08] transition"
          >
            Resume
            <IconDownload size={14} />
          </Link>
        </nav>
      </header>

      {/* ─── MOBILE BUTTON ─────────────── */}
      <button
        onClick={() => setOpen(!open)}
        className={clsx(
          "fixed bottom-6 right-6 z-50 md:hidden w-14 h-14 rounded-full flex items-center justify-center",
          "text-white/80 hover:text-white transition",
          GLASS
        )}
      >
        {open ? <IconX size={20} /> : <IconMenu2 size={20} />}
      </button>

      {/* ─── MOBILE MENU ─────────────── */}
      <div
        className={clsx(
          "fixed bottom-24 right-6 z-40 md:hidden w-60 rounded-2xl overflow-hidden",
          GLASS,
          "transition-all duration-300",
          open
            ? "opacity-100 scale-100"
            : "opacity-0 scale-95 pointer-events-none"
        )}
      >
        <div className="p-4 flex flex-col gap-1">
          {NAV_LINKS.map(({ label, href, icon }) => {
            const isActive = active === href.replace("#", "")

            return (
              <Link
                key={href}
                href={href}
                onClick={() => setOpen(false)}
                className={clsx(
                  "flex items-center gap-2 px-3 py-2 rounded-lg text-sm transition",
                  isActive
                    ? "text-white bg-white/[0.08]"
                    : "text-white/50 hover:text-white hover:bg-white/[0.05]"
                )}
              >
                {icon && <IconHome size={16} />}
                {label}
              </Link>
            )
          })}

          <div className="h-px bg-white/10 my-2" />

          <Link
            href="/resume.pdf"
            target="_blank"
            onClick={() => setOpen(false)}
            className="flex items-center justify-between px-3 py-2 text-sm text-white/70 hover:text-white"
          >
            Resume
            <IconDownload size={14} />
          </Link>
        </div>
      </div>
    </>
  )
}