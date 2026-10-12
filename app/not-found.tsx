import Link from "next/link"
import { IconArrowUpRight } from "@tabler/icons-react"

export default function NotFound() {
  return (
    <section
      className="min-h-[80svh] bg-background text-foreground"
      style={{ paddingTop: "calc(var(--nav-h) + clamp(40px, 7vw, 120px))" }}
    >
      <div className="ledger">
        <p className="ledger-label pb-4">404 / Not found</p>
        <div aria-hidden data-hero-rule className="rule-ink" />
        <div className="ledger-grid mt-8 gap-y-8 md:mt-12">
          <h1 data-hero-line="1" className="type-hero-internal col-span-12 max-w-[14ch] lg:col-span-9">
            This page is not in the system.
          </h1>
          <div data-hero-fade className="col-span-12 md:col-span-6 lg:col-span-4 lg:col-start-4">
            <p className="text-[clamp(1.0625rem,1.3vw,1.25rem)] leading-[1.5] text-muted-foreground">
              The route may have moved, or the work may no longer be published.
            </p>
            <Link href="/" className="btn-ink mt-8">
              Back to home
              <IconArrowUpRight size={16} stroke={2} aria-hidden className="btn-arrow" />
            </Link>
          </div>
        </div>
      </div>
    </section>
  )
}
