import { BeforeAfter } from "./before-after"

/**
 * A compact, token-only dashboard fixture. Because every colour comes from a
 * semantic token (background / card / foreground / muted / accent …), the exact
 * same markup renders correctly in light and dark — which is the whole point of
 * the theme-compare demo below.
 */

function Ring({ value }: { value: number }) {
  const r = 18
  const c = 2 * Math.PI * r
  const offset = c * (1 - value / 100)
  return (
    <svg width={52} height={52} viewBox="0 0 52 52" className="shrink-0 text-foreground/15">
      <circle cx={26} cy={26} r={r} fill="none" stroke="currentColor" strokeWidth={5} />
      <circle
        cx={26}
        cy={26}
        r={r}
        fill="none"
        stroke="var(--accent)"
        strokeWidth={5}
        strokeLinecap="round"
        strokeDasharray={c}
        strokeDashoffset={offset}
        transform="rotate(-90 26 26)"
      />
    </svg>
  )
}

const TILES = [
  { v: "6.2k", l: "Steps" },
  { v: "428", l: "Calories" },
  { v: "62", l: "Resting bpm" },
]

function DemoDashboard() {
  return (
    <div className="bg-background p-5 sm:p-6">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-[11px] text-muted-foreground">Today · Sept 1</p>
          <h3 className="text-lg font-semibold tracking-tight text-foreground">
            Good morning, Jane
          </h3>
        </div>
        <div className="size-9 rounded-full bg-muted ring-1 ring-border" />
      </div>

      <div className="mt-5 flex items-center gap-4 rounded-2xl border border-border bg-card p-4">
        <Ring value={85} />
        <div>
          <p className="text-2xl font-bold leading-none text-foreground">85</p>
          <p className="mt-1 text-xs text-muted-foreground">Daily score</p>
        </div>
        <div className="ml-auto text-right">
          <p className="text-sm font-semibold text-accent">+12%</p>
          <p className="text-xs text-muted-foreground">vs last week</p>
        </div>
      </div>

      <div className="mt-3 grid grid-cols-3 gap-3">
        {TILES.map((t) => (
          <div key={t.l} className="rounded-xl border border-border bg-card p-3">
            <p className="text-base font-semibold text-foreground">{t.v}</p>
            <p className="text-[11px] text-muted-foreground">{t.l}</p>
          </div>
        ))}
      </div>

      <div className="mt-3 rounded-2xl border border-border bg-card p-4">
        <div className="flex items-center justify-between text-xs">
          <span className="font-medium text-foreground">Sleep</span>
          <span className="text-muted-foreground">7h 20m</span>
        </div>
        <div className="mt-2 h-2 w-full rounded-full bg-muted">
          <div className="h-2 rounded-full bg-accent" style={{ width: "68%" }} />
        </div>
      </div>
    </div>
  )
}

/** The same dashboard wiped between forced-light and forced-dark renders. */
export function ThemeCompareDemo({ className }: { className?: string }) {
  return (
    <BeforeAfter
      className={className}
      beforeLabel="Light"
      afterLabel="Dark"
      before={
        <div className="light">
          <DemoDashboard />
        </div>
      }
      after={
        <div className="dark">
          <DemoDashboard />
        </div>
      }
    />
  )
}
