"use client"

import { useState } from "react"
import { IconDownload, IconMenu2, IconX } from "@tabler/icons-react"

export default function Navbar() {

  const [open, setOpen] = useState(false)

  return (
    <>
      {/* Desktop Navbar */}

      <header className="fixed top-6 left-1/2 -translate-x-1/2 z-50 hidden md:block">
        <nav className="flex items-center gap-10 px-10 py-4 rounded-full bg-white/80 backdrop-blur-md border border-neutral-200 shadow-[0_4px_20px_rgba(0,0,0,0.05)]">

          <a href="#work" className="text-lg font-medium text-neutral-800 hover:text-red-600 transition-colors">
            Work
          </a>

          <a href="#systems" className="text-lg font-medium text-neutral-800 hover:text-red-600 transition-colors">
            Systems
          </a>

          <a href="#articles" className="text-lg font-medium text-neutral-800 hover:text-red-600 transition-colors">
            Articles
          </a>

          <a href="#about" className="text-lg font-medium text-neutral-800 hover:text-red-600 transition-colors">
            About
          </a>

          <a
            href="/resume.pdf"
            className="group flex items-center gap-2 text-lg font-medium text-neutral-800 hover:text-red-600 transition-colors"
          >
            Resume
            <IconDownload size={18} className="transition-transform group-hover:translate-y-[2px]" />
          </a>

        </nav>
      </header>


      {/* Floating Menu Button (Mobile) */}

      <button
        onClick={() => setOpen(!open)}
        className="fixed bottom-6 right-6 z-50 md:hidden p-4 rounded-full bg-white shadow-lg border border-neutral-200"
      >
        {open ? <IconX size={22} /> : <IconMenu2 size={22} />}
      </button>


      {/* Popup Menu */}

      {open && (
        <div className="fixed bottom-24 right-6 z-40 md:hidden w-56 rounded-2xl border border-neutral-200 bg-white shadow-xl p-6 flex flex-col gap-4">

          <a href="#work" onClick={() => setOpen(false)} className="hover:text-red-600">
            Work
          </a>

          <a href="#systems" onClick={() => setOpen(false)} className="hover:text-red-600">
            Systems
          </a>

          <a href="#articles" onClick={() => setOpen(false)} className="hover:text-red-600">
            Articles
          </a>

          <a href="#about" onClick={() => setOpen(false)} className="hover:text-red-600">
            About
          </a>

          <a
            href="/resume.pdf"
            onClick={() => setOpen(false)}
            className="flex items-center gap-2 hover:text-red-600"
          >
            Resume
            <IconDownload size={18} />
          </a>

        </div>
      )}

    </>
  )
}