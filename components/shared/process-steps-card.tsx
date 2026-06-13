type Step = {
  number: string
  title: string
  description: string
}

export function ProcessStepsCard({ steps }: { steps: Step[] }) {
  return (
    <div className="relative rounded-3xl p-8 md:p-12 bg-card text-card-foreground border border-border overflow-hidden">
      <div className="pointer-events-none absolute inset-y-0 left-0 w-20 bg-gradient-to-r from-[rgba(225,29,72,0.08)] via-[rgba(225,29,72,0.04)] to-transparent blur-xl opacity-70" />
      <div className="pointer-events-none absolute -top-28 -right-28 w-[300px] h-[300px] bg-[radial-gradient(circle,rgba(225,29,72,0.06),transparent_70%)] dark:bg-[radial-gradient(circle,rgba(251,113,133,0.12),transparent_70%)] blur-3xl" />
      <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(110deg,transparent,rgba(225,29,72,0.04),transparent)] dark:bg-[linear-gradient(110deg,transparent,rgba(251,113,133,0.06),transparent)] opacity-50" />
      <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-foreground/10 to-transparent dark:via-white/20" />

      <div className="relative grid md:grid-cols-2 gap-10 md:gap-12">
        {steps.map((step, i) => (
          <div
            key={i}
            className="group relative flex gap-4 transition-transform duration-200 md:hover:translate-x-[3px]"
          >
            <div className="relative pl-4">
              <div className="absolute left-0 top-[6px] bottom-[6px] w-px bg-border/70 transition-colors duration-200 group-hover:bg-accent/50 dark:group-hover:bg-accent/50" />
              <div className="flex items-baseline gap-3">
                <span className="type-caption text-foreground/50 transition-colors duration-200 group-hover:text-accent">
                  {step.number}
                </span>
                <h3 className="type-list-title text-foreground transition-colors duration-200 group-hover:text-accent">
                  {step.title}
                </h3>
              </div>
              <p className="type-card-body mt-2 max-w-[340px] text-foreground/65">
                {step.description}
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
