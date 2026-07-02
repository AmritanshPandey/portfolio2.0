import Link from "next/link"

export default function NotFound() {
  return (
    <section className="bg-canvas-default min-h-[70svh] px-5 pt-32 text-foreground md:px-6 md:pt-40">
      <div className="mx-auto max-w-3xl">
        <p className="font-mono text-[11px] font-semibold uppercase tracking-[0.16em] text-muted-foreground">
          404 / Not found
        </p>
        <h1 className="mt-5 text-4xl font-semibold tracking-normal md:text-6xl">
          This page is not in the system.
        </h1>
        <p className="mt-5 max-w-xl text-[15px] leading-7 text-muted-foreground md:text-base">
          The route may have moved, or the work may no longer be published.
        </p>
        <Link
          href="/"
          className="mt-8 inline-flex h-11 items-center rounded-full border border-border bg-card px-5 text-sm font-medium text-foreground transition-colors hover:bg-muted focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2 focus-visible:ring-offset-background"
        >
          Back to home
        </Link>
      </div>
    </section>
  )
}
