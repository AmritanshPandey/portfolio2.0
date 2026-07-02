export default function Loading() {
  return (
    <section className="bg-canvas-default min-h-[70svh] px-5 pt-32 text-foreground md:px-6 md:pt-40">
      <div className="mx-auto max-w-3xl">
        <div className="h-3 w-32 rounded-full bg-muted" />
        <div className="mt-6 h-12 w-full max-w-xl rounded-xl bg-muted md:h-16" />
        <div className="mt-4 h-4 w-full max-w-lg rounded-full bg-muted" />
        <div className="mt-2 h-4 w-full max-w-sm rounded-full bg-muted" />
      </div>
    </section>
  )
}
