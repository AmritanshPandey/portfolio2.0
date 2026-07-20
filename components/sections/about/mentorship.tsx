"use client"

import { IconArrowUpRight } from "@tabler/icons-react"
import { advisoryItems, teachingItems, menteeItems } from "@/lib/data"

const EMAIL = "amritansh.pandey6@gmail.com"

/**
 * Advisory, compressed to its evidence.
 *
 * This is a side door for a "maybe" audience, so it stays a third of its old
 * height: one proof line a visitor can actually check (the mentees and where
 * they landed), one row of engagements, one ask. The Section header carries
 * the framing; nothing here repeats it.
 */
export default function AdvisorySection() {
  const engagements = [...advisoryItems, ...teachingItems]

  return (
    <div className="max-w-3xl space-y-10">

      {/* The proof: checkable people, not a stat chip. */}
      <div className="space-y-3">
        <p className="text-[17px] leading-relaxed text-foreground/85">
          Designers I&apos;ve mentored now work at Microsoft, Zomato, Aleph
          Alpha, and Mastercard.
        </p>
        <ul className="flex flex-wrap gap-x-6 gap-y-2">
          {menteeItems.map((m) => (
            <li key={m.name}>
              <a
                href={m.link}
                target="_blank"
                rel="noopener noreferrer"
                className="group inline-flex items-baseline gap-1.5 rounded-sm text-[13.5px] text-foreground/60 transition-colors hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent/50"
              >
                <span className="underline decoration-border underline-offset-4 transition-colors group-hover:decoration-accent">
                  {m.name}
                </span>
                <span className="text-foreground/40">
                  {m.company.split("•")[1]?.trim() ?? m.company}
                </span>
              </a>
            </li>
          ))}
        </ul>
      </div>

      {/* The engagements: one line each, no cards. */}
      <ul className="space-y-2 border-t border-border/60 pt-6">
        {engagements.map((item) => (
          <li key={item.title}>
            <a
              href={item.link}
              target="_blank"
              rel="noopener noreferrer"
              className="group inline-flex items-center gap-2 rounded-sm text-[14.5px] leading-relaxed text-foreground/70 transition-colors hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent/50"
            >
              {item.title}
              <IconArrowUpRight
                size={14}
                stroke={2}
                className="text-foreground/30 transition-all duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:text-accent"
              />
            </a>
          </li>
        ))}
      </ul>

      {/* The ask: also the page's closing call, so a scroll-through doesn't
          end without a next step. */}
      <div className="flex flex-wrap items-center gap-4 border-t border-border/60 pt-6">
        <a
          href={`mailto:${EMAIL}?subject=Let%27s%20talk`}
          className="inline-flex items-center gap-2 rounded-full bg-accent px-5 py-2.5 text-[14px] font-medium text-white transition-transform duration-300 hover:scale-[1.03] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent/60 focus-visible:ring-offset-2 focus-visible:ring-offset-background dark:text-neutral-950"
        >
          Start a conversation
          <IconArrowUpRight size={16} stroke={2} />
        </a>
        <span className="text-[13px] text-muted-foreground">{EMAIL}</span>
      </div>
    </div>
  )
}
