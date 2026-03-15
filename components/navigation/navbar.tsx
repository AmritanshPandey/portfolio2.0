"use client"

import Link from "next/link"
import { Button } from "@/components/ui/button"
import { IconFileDownload } from "@tabler/icons-react"

export default function Navbar() {
  return (
    <header className="fixed top-0 w-full z-50 backdrop-blur-md bg-white/70 border-b">
      <div className="max-w-6xl mx-auto flex items-center justify-between px-6 py-4">

        {/* Logo */}
        <Link href="/" className="font-semibold text-lg">
          Amritansh
        </Link>

        {/* Navigation */}
        <nav className="flex items-center gap-8 text-sm">

          <a href="#work">Work</a>
          <a href="#systems">Systems</a>
          <a href="#articles">Articles</a>
          <a href="#about">About</a>

          <Button size="sm" variant="outline">
            <IconFileDownload size={16} className="mr-2"/>
            Resume
          </Button>

        </nav>

      </div>
    </header>
  )
}