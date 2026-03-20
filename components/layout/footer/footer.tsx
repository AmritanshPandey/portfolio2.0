"use client"

import {
  IconBrandLinkedin,
  IconBrandGithub,
  IconBrandBehance,
} from "@tabler/icons-react"

export default function Footer() {
  return (
    <footer className="bg-black text-neutral-400">

      <div className="max-w-6xl mx-auto px-6 py-16 md:py-20">

        {/* TOP — STATEMENT */}

        <div className="max-w-2xl mb-10">

          <p className="text-xl md:text-2xl text-white leading-snug tracking-tight">
            Designing products at the intersection of strategy, systems, and technology.
          </p>

        </div>


        {/* CONTACT ROW */}

        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6 text-sm">

          {/* LEFT — CONTACT */}

          <div className="flex flex-wrap items-center gap-x-6 gap-y-2">

            <a
              href="mailto:amritansh.pandey6@gmail.com"
              className="hover:text-white transition"
            >
              amritansh.pandey6@gmail.com
            </a>

            <span className="hidden md:block text-neutral-700">•</span>

            <a
              href="tel:+918130513047"
              className="hover:text-white transition"
            >
              +91 8130513047
            </a>

            <span className="hidden md:block text-neutral-700">•</span>

            <span>Gurgaon</span>

          </div>


          {/* RIGHT — SOCIALS */}

          <div className="flex items-center gap-5">

            <a
              href="https://www.linkedin.com/in/amritansh-pandey-bb5b3087"
              target="_blank"
              className="hover:text-white transition"
            >
              <IconBrandLinkedin size={18} />
            </a>

            <a
              href="https://github.com/your-username"
              target="_blank"
              className="hover:text-white transition"
            >
              <IconBrandGithub size={18} />
            </a>

            <a
              href="https://www.behance.net/your-username"
              target="_blank"
              className="hover:text-white transition"
            >
              <IconBrandBehance size={18} />
            </a>

          </div>

        </div>


        {/* DIVIDER */}

        <div className="h-px w-full bg-white/10 my-8" />


        {/* BOTTOM */}

        <div className="flex flex-col md:flex-row items-center justify-between gap-3 text-xs text-neutral-500">

       <p>© {new Date().getFullYear()} Amritansh Pandey. All rights reserved.</p>

          <p className="opacity-60">
            Built with precision
          </p>

        </div>

      </div>

    </footer>
  )
}