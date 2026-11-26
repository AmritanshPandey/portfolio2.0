"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { ViewTransition } from "react"
import { studies } from "@/lib/data/studies"
import { workItems } from "@/lib/data/work"
import { nextStudy } from "@/lib/study-index"
import { EMAIL, EMAIL_HREF } from "@/lib/contact"
import { WorkSpecimen } from "@/components/sections/work/work-specimens"

/**
 * The end of a study: the next one, its title at hero size with its
 * specimen and byline, as one link. The specimen carries the study's
 * transition name, so opening it grows the specimen into the next hero, as
 * from the home page. The last study wraps to the first. Pages outside the
 * index, and a study alone in its kind, get nothing.
 */
export function StudyNext() {
  const pathname = usePathname()
  const next = nextStudy(studies, pathname)
  if (!next) return null
  const byline = workItems.find((w) => w.href === next.href)?.byline

  return (
    <section data-study-next aria-label="Next study" className="relative bg-background text-foreground">
      <div className="ledger pb-16 pt-16 md:pb-24 md:pt-24">
        <div aria-hidden className="rule-ink" />
        <Link href={next.href} className="group mt-6 grid gap-8 md:mt-10 md:grid-cols-12 md:gap-[var(--col-gap)]">
          <div className="md:col-span-7">
            <p className="ledger-label">
              Next · {next.ref}
            </p>
            <p className="type-hero-internal mt-4 text-foreground transition-colors duration-300 group-hover:text-accent">
              {next.short}
            </p>
            {byline && <p className="mt-4 text-[17px] text-muted-foreground">{byline}</p>}
            <p className="mt-4 max-w-[48ch] text-[15px] leading-relaxed text-muted-foreground">{next.problem}</p>
          </div>
          {next.kind === "work" && (
            <div className="md:col-span-5">
              <ViewTransition name={`case-${next.slug}`} share="case-morph">
                <WorkSpecimen slug={next.slug} />
              </ViewTransition>
            </div>
          )}
        </Link>
        <div className="mt-10 flex flex-wrap items-baseline gap-x-8 gap-y-3 border-t border-border pt-5">
          <Link href="/#work" className="ledger-label text-foreground">
            All work
          </Link>
          <a href={EMAIL_HREF} className="ledger-label">
            {EMAIL}
          </a>
        </div>
      </div>
    </section>
  )
}
