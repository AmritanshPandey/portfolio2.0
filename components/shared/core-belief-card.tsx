import clsx from "clsx"

type Props = {
  eyebrow?: string
  children: React.ReactNode
  className?: string
}

export function CoreBeliefCard({ eyebrow = "Core Belief", children, className }: Props) {
  return (
    <div
      className={clsx(
        "relative rounded-3xl px-6 py-8 md:px-10 md:py-10",
        "border border-border",
        "bg-gradient-to-br from-background to-muted/20",
        "dark:from-neutral-950 dark:to-white/[0.03]",
        "overflow-hidden [transform:translateZ(0)]",
        className
      )}
    >
      {/* A single, subtle warm hint — not three stacked ember washes (One Voice Rule) */}
      <div className="pointer-events-none absolute -top-24 -right-24 w-[280px] h-[280px] bg-[radial-gradient(circle,rgba(249,115,22,0.05),transparent_70%)] dark:bg-[radial-gradient(circle,rgba(251,146,60,0.06),transparent_70%)] blur-2xl" />
      <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-foreground/10 to-transparent dark:via-white/20" />

      <div className="relative max-w-3xl">
        {eyebrow && (
          <p className="text-[12px] uppercase tracking-[0.18em] text-foreground/60 mb-4 font-medium">
            {eyebrow}
          </p>
        )}
        <div className="text-xl md:text-2xl lg:text-[28px] font-medium leading-[1.4] text-foreground">
          {children}
        </div>
      </div>
    </div>
  )
}
