"use client"

import { useEffect, useState } from "react"
import { IconDownload, IconMenu2, IconX } from "@tabler/icons-react"
import clsx from "clsx"

export default function Navbar() {

  const [open, setOpen] = useState(false)
  const [active, setActive] = useState("#work")

  const navItems = [
    { label: "Work", href: "#work" },
    { label: "Systems", href: "#systems" },
    { label: "Approach", href: "#approach" },
    { label: "Thinking", href: "#product-thinking" },
    { label: "Insights", href: "#articles" },
    { label: "Explorations", href: "#explorations" },
    { label: "About", href: "#about" },
  ]

  // ✅ Active section (stable)
  useEffect(() => {
    const handleScroll = () => {
      const scrollY = window.scrollY + 140

      let current = navItems[0].href

      navItems.forEach((item) => {
        const el = document.querySelector(item.href)
        if (!el) return

        const rect = el.getBoundingClientRect()
        const top = rect.top + window.scrollY
        const height = rect.height

        if (scrollY >= top && scrollY < top + height) {
          current = item.href
        }
      })

      setActive(current)
    }

    window.addEventListener("scroll", handleScroll)
    handleScroll()

    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  return (
    <>
      {/* DESKTOP NAV */}

      <header className="fixed top-6 left-1/2 -translate-x-1/2 z-50 hidden md:block">
        <nav
          className={clsx(
            "flex items-center gap-7 px-9 py-4 rounded-full",
            "bg-white border border-neutral-200",
            "shadow-[0_10px_30px_rgba(0,0,0,0.08)]",
            "ring-1 ring-black/[0.02]"
            
            
          )}
        >

          {navItems.map((item, i) => {
            const isActive = active === item.href

            return (
              <a
                key={i}
                href={item.href}
                className={clsx(
                  "relative text-sm font-medium transition-all duration-200",
                  "hover:-translate-y-[1px]",

                  isActive
                    ? "text-neutral-900"
                    : "text-neutral-400 hover:text-red-600"
                )}
              >
                {item.label}

                {/* ACTIVE INDICATOR */}
                <span
                  className={clsx(
                    "absolute -bottom-1 left-0 h-[2px] w-full bg-red-500 transition-all duration-300 origin-left",
                    isActive ? "scale-x-100 opacity-100" : "scale-x-0 opacity-0"
                  )}
                />
              </a>
            )
          })}

          {/* DIVIDER */}
          <div className="w-px h-5 mx-2 bg-neutral-200" />

          {/* RESUME */}
          <a
            href="/resume.pdf"
            className="group flex items-center gap-2 text-sm font-medium text-neutral-900 hover:text-red-600 transition"
          >
            Resume
            <IconDownload
              size={16}
              className="transition-transform duration-200 group-hover:translate-y-[2px]"
            />
          </a>

        </nav>
      </header>


      {/* MOBILE BUTTON */}

      <button
        onClick={() => setOpen(!open)}
        className="fixed bottom-6 right-6 z-50 md:hidden p-4 rounded-full bg-white border border-neutral-200 shadow-md"
      >
        {open ? <IconX size={22} /> : <IconMenu2 size={22} />}
      </button>


      {/* MOBILE MENU */}

      {open && (
        <div className="fixed bottom-24 right-6 z-40 md:hidden w-64 rounded-2xl border border-neutral-200 bg-white shadow-lg p-6 flex flex-col gap-5">

          {navItems.map((item, i) => {
            const isActive = active === item.href

            return (
              <a
                key={i}
                href={item.href}
                onClick={() => setOpen(false)}
                className={clsx(
                  "text-base transition",
                  isActive ? "text-neutral-900 font-medium" : "text-neutral-500",
                  "hover:text-red-600"
                )}
              >
                {item.label}
              </a>
            )
          })}

          <div className="h-px bg-neutral-200 my-2" />

          <a
            href="/resume.pdf"
            onClick={() => setOpen(false)}
            className="flex items-center gap-2 text-base font-medium text-neutral-900 hover:text-red-600"
          >
            Resume
            <IconDownload size={16} />
          </a>

        </div>
      )}
    </>
  )
}