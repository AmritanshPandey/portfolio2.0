"use client"

// Shared controls for the color-system interactive demos. Kept minimal and
// styled to the portfolio tokens (orange accent, bg-card / border-border).

export function Panel({ children, className = "" }: { children: React.ReactNode; className?: string }) {
  return (
    <div className={`rounded-2xl border border-border/60 bg-card overflow-hidden ${className}`}>
      {children}
    </div>
  )
}

export function Seg<T extends string>({
  options, value, onChange, label,
}: {
  options: { key: T; label: string }[]
  value: T
  onChange: (v: T) => void
  label?: string
}) {
  return (
    <div className="flex items-center gap-2 flex-wrap">
      {label && <span className="text-[10px] font-bold uppercase tracking-[0.14em] text-muted-foreground mr-1">{label}</span>}
      {options.map(o => (
        <button
          key={o.key}
          onClick={() => onChange(o.key)}
          aria-pressed={value === o.key}
          className={`text-[12px] font-medium px-3 py-1.5 rounded-lg border transition-colors ${
            value === o.key
              ? "border-rose-500/50 bg-rose-500/10 text-rose-600 dark:text-rose-400"
              : "border-border text-muted-foreground hover:text-foreground hover:border-foreground/30"
          }`}
        >
          {o.label}
        </button>
      ))}
    </div>
  )
}

export function Switch({ on, onClick, label }: { on: boolean; onClick: () => void; label: string }) {
  return (
    <button onClick={onClick} aria-pressed={on} className="flex items-center gap-2 text-[12px] text-muted-foreground hover:text-foreground transition-colors">
      <span className={`relative w-9 h-5 rounded-full transition-colors ${on ? "bg-rose-500" : "bg-foreground/15"}`}>
        <span className={`absolute top-0.5 w-4 h-4 rounded-full bg-white transition-all ${on ? "left-[18px]" : "left-0.5"}`} />
      </span>
      {label}
    </button>
  )
}
