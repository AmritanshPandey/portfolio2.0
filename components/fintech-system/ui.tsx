import type { ReactNode } from "react"
import {
  IconAlertTriangle,
  IconArrowDownLeft,
  IconArrowRight,
  IconArrowUpRight,
  IconBell,
  IconBriefcase,
  IconCards,
  IconChartCandle,
  IconChartLine,
  IconCheck,
  IconChevronDown,
  IconChevronRight,
  IconCircleCheck,
  IconCoinBitcoin,
  IconCurrencyBitcoin,
  IconClock,
  IconCreditCard,
  IconDots,
  IconDownload,
  IconEye,
  IconFilter,
  IconFingerprint,
  IconGauge,
  IconInfoCircle,
  IconKey,
  IconLayoutDashboard,
  IconLock,
  IconQrcode,
  IconRefresh,
  IconReceipt,
  IconSearch,
  IconSettings,
  IconShieldCheck,
  IconStar,
  IconSwitchHorizontal,
  IconTrendingDown,
  IconTrendingUp,
  IconWallet,
  IconX,
} from "@tabler/icons-react"
import { cn } from "@/lib/utils"
import type {
  FintechComponentState,
  FintechNavigationItem,
  FintechPatternSpec,
  FintechTone,
} from "./types"

type Size = "sm" | "md" | "lg"
type ButtonVariant = "primary" | "secondary" | "ghost" | "destructive" | "icon"

const toneClasses: Record<FintechTone, string> = {
  brand: "text-[var(--fin-brand)] bg-[var(--fin-brand-soft)] border-[var(--fin-brand-border)]",
  neutral: "text-[var(--fin-text-secondary)] bg-[var(--fin-muted)] border-[var(--fin-border)]",
  success: "text-[var(--fin-success)] bg-[var(--fin-success-soft)] border-[var(--fin-success-border)]",
  warning: "text-[var(--fin-warning)] bg-[var(--fin-warning-soft)] border-[var(--fin-warning-border)]",
  error: "text-[var(--fin-error)] bg-[var(--fin-error-soft)] border-[var(--fin-error-border)]",
  info: "text-[var(--fin-accent)] bg-[var(--fin-accent-soft)] border-[var(--fin-accent-border)]",
  pending: "text-[var(--fin-pending)] bg-[var(--fin-pending-soft)] border-[var(--fin-pending-border)]",
  income: "text-[var(--fin-income)] bg-[var(--fin-income-soft)] border-[var(--fin-income-border)]",
  expense: "text-[var(--fin-expense)] bg-[var(--fin-expense-soft)] border-[var(--fin-expense-border)]",
  profit: "text-[var(--fin-profit)] bg-[var(--fin-profit-soft)] border-[var(--fin-profit-border)]",
  loss: "text-[var(--fin-loss)] bg-[var(--fin-loss-soft)] border-[var(--fin-loss-border)]",
  risk: "text-[var(--fin-risk)] bg-[var(--fin-risk-soft)] border-[var(--fin-risk-border)]",
  safe: "text-[var(--fin-safe)] bg-[var(--fin-safe-soft)] border-[var(--fin-safe-border)]",
}

const statusIcon: Partial<Record<FintechTone, ReactNode>> = {
  success: <IconCircleCheck size={14} />,
  warning: <IconAlertTriangle size={14} />,
  error: <IconX size={14} />,
  info: <IconInfoCircle size={14} />,
  pending: <IconClock size={14} />,
  income: <IconArrowDownLeft size={14} />,
  expense: <IconArrowUpRight size={14} />,
  profit: <IconTrendingUp size={14} />,
  loss: <IconTrendingDown size={14} />,
  risk: <IconAlertTriangle size={14} />,
  safe: <IconShieldCheck size={14} />,
}

export function FinSurface({
  children,
  className,
  as = "div",
  pad,
}: {
  children: ReactNode
  className?: string
  as?: "div" | "section" | "article" | "aside"
  /** Standardised card padding. `true`/`"md"` → 20px, `"sm"` → 16px. */
  pad?: boolean | "sm" | "md"
}) {
  const Comp = as
  const padClass = pad === "sm" ? "p-4" : pad ? "p-5" : undefined
  return (
    <Comp
      className={cn(
        "rounded-2xl border border-[var(--fin-border)] bg-[var(--fin-surface)] shadow-[var(--fin-shadow-flat)]",
        padClass,
        className
      )}
    >
      {children}
    </Comp>
  )
}

export function FinBadge({
  children,
  tone = "neutral",
  icon = true,
  className,
}: {
  children: ReactNode
  tone?: FintechTone
  icon?: boolean
  className?: string
}) {
  return (
    <span
      className={cn(
        "inline-flex h-6 items-center gap-1.5 rounded-full border px-2.5 text-[11px] font-semibold leading-none",
        toneClasses[tone],
        className
      )}
    >
      {icon ? statusIcon[tone] : null}
      {children}
    </span>
  )
}

export function FinButton({
  children,
  variant = "primary",
  size = "md",
  state = "default",
  tone = "brand",
  className,
}: {
  children: ReactNode
  variant?: ButtonVariant
  size?: Size
  state?: FintechComponentState
  tone?: FintechTone
  className?: string
}) {
  const sizeClass = {
    sm: "h-8 px-3 text-[12px]",
    md: "h-9 px-4 text-[13px]",
    lg: "h-11 px-5 text-[14px]",
  }[size]

  const variantClass = {
    primary: "border-[var(--fin-brand)] bg-[var(--fin-brand)] text-black shadow-[0_10px_28px_rgba(0,200,83,0.24)] hover:bg-[var(--fin-brand-strong)]",
    secondary: "border-[var(--fin-border)] bg-[var(--fin-surface-raised)] text-[var(--fin-text-primary)] hover:bg-[var(--fin-muted)]",
    ghost: "border-transparent bg-transparent text-[var(--fin-text-secondary)] hover:bg-[var(--fin-muted)] hover:text-[var(--fin-text-primary)]",
    destructive: "border-[var(--fin-error-border)] bg-[var(--fin-error)] text-white hover:brightness-95",
    icon: "size-9 border-[var(--fin-border)] bg-[var(--fin-surface-raised)] p-0 text-[var(--fin-text-secondary)] hover:bg-[var(--fin-muted)]",
  }[variant]

  return (
    <button
      disabled={state === "disabled" || state === "loading"}
      className={cn(
        "inline-flex items-center justify-center gap-2 rounded-full border font-semibold transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--fin-focus)] focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--fin-bg)] disabled:pointer-events-none disabled:opacity-50",
        sizeClass,
        variantClass,
        state === "focus" && "ring-2 ring-[var(--fin-focus)] ring-offset-2 ring-offset-[var(--fin-bg)]",
        tone !== "brand" && variant === "secondary" && toneClasses[tone],
        className
      )}
      type="button"
    >
      {state === "loading" ? (
        <span className="size-3.5 animate-spin rounded-full border-2 border-current border-r-transparent" />
      ) : null}
      {children}
    </button>
  )
}

export function FinField({
  label,
  value,
  description,
  state = "default",
  prefix,
  suffix,
  secure,
}: {
  label: string
  value: string
  description?: string
  state?: FintechComponentState
  prefix?: ReactNode
  suffix?: ReactNode
  secure?: boolean
}) {
  const invalid = state === "error"
  return (
    <label className="block space-y-1.5">
      <span className="text-[11px] font-bold uppercase tracking-[0.12em] text-[var(--fin-text-secondary)]">
        {label}
      </span>
      <span
        className={cn(
          "flex h-10 items-center gap-2 rounded-xl border bg-[var(--fin-bg)] px-3 text-[13px] text-[var(--fin-text-primary)]",
          invalid ? "border-[var(--fin-error)]" : "border-[var(--fin-border)]",
          state === "focus" && "ring-2 ring-[var(--fin-focus)]",
          state === "disabled" && "opacity-50"
        )}
      >
        {prefix}
        <span className={cn("min-w-0 flex-1 truncate", secure && "font-mono tabular-nums tracking-[0.15em]")}>
          {value}
        </span>
        {suffix}
      </span>
      {description ? (
        <span className={cn("block text-[12px]", invalid ? "text-[var(--fin-error)]" : "text-[var(--fin-text-secondary)]")}>
          {description}
        </span>
      ) : null}
    </label>
  )
}

export function FinKpiCard({
  label,
  value,
  description,
  tone = "neutral",
  trend,
}: {
  label: string
  value: string
  description: string
  tone?: FintechTone
  trend?: string
}) {
  return (
    <FinSurface pad>
      <div className="flex items-start justify-between gap-3">
        <p className="fin-eyebrow text-[var(--fin-text-secondary)]">{label}</p>
        {trend ? <FinBadge tone={tone}>{trend}</FinBadge> : null}
      </div>
      <p className="mt-3 text-[28px] font-semibold leading-none tracking-[-0.02em] text-[var(--fin-text-primary)] tabular-nums">
        {value}
      </p>
      <p className="fin-meta mt-2 text-[var(--fin-text-secondary)]">{description}</p>
    </FinSurface>
  )
}

export function FinCreditCardPreview() {
  return (
    <div className="flex h-full min-h-[208px] flex-col justify-between rounded-[22px] border border-white/15 bg-[radial-gradient(circle_at_15%_12%,rgba(0,230,118,0.38),transparent_32%),linear-gradient(135deg,#050806,#101914_58%,#013f22)] p-5 text-white shadow-[0_18px_52px_rgba(0,0,0,0.34)]">
      <div className="flex items-start justify-between">
        <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-white/60">Instant debit</p>
        <div className="grid size-10 place-items-center rounded-full bg-[var(--fin-brand)] text-black">
          <IconCards size={20} />
        </div>
      </div>
      <p className="flex items-center gap-2 font-mono text-[19px] font-medium tabular-nums tracking-[0.1em]">
        <span>4829</span>
        <span className="text-white/55">••••</span>
        <span className="text-white/55">••••</span>
        <span>1048</span>
      </p>
      <div className="flex items-end justify-between gap-4">
        <div>
          <p className="text-[10px] uppercase tracking-[0.16em] text-white/50">Cardholder</p>
          <p className="mt-1 text-[13px] font-semibold">Avery Stone</p>
        </div>
        <div className="text-right">
          <p className="text-[10px] uppercase tracking-[0.16em] text-white/50">Limit</p>
          <p className="mt-1 text-[13px] font-semibold tabular-nums">$8,000</p>
        </div>
      </div>
    </div>
  )
}

export function FinTransactionList() {
  const rows = [
    ["Stripe payout", "Today, 10:42", "+$12,804.20", "income", "Settled"],
    ["AWS Marketplace", "Yesterday", "-$1,482.10", "expense", "Posted"],
    ["Wire to Mercury", "Jun 7", "-$24,000.00", "pending", "Review"],
    ["FX gain", "Jun 6", "+$842.90", "profit", "Booked"],
  ] as const

  return (
    <FinSurface className="overflow-hidden">
      <div className="flex items-center justify-between border-b border-[var(--fin-border)] px-4 py-3">
        <div className="min-w-0">
          <p className="text-[14px] font-semibold text-[var(--fin-text-primary)]">Recent transactions</p>
          <p className="truncate text-[12px] text-[var(--fin-text-secondary)]">Ledger activity across accounts</p>
        </div>
        <FinButton variant="icon" size="sm" className="shrink-0">
          <IconArrowRight size={14} />
        </FinButton>
      </div>
      <div className="divide-y divide-[var(--fin-border)]">
        {rows.map(([name, date, amount, tone, status]) => (
          <div key={name} className="grid grid-cols-[minmax(0,1fr)_auto] items-center gap-3 px-4 py-3">
            <div className="min-w-0">
              <p className="truncate text-[13px] font-semibold text-[var(--fin-text-primary)]">{name}</p>
              <div className="mt-1 flex min-w-0 flex-wrap items-center gap-2">
                <p className="text-[12px] text-[var(--fin-text-secondary)]">{date}</p>
                <FinBadge tone={tone as FintechTone} className="h-5 px-2 text-[10px]">{status}</FinBadge>
              </div>
            </div>
            <p className="font-mono text-[13px] font-semibold text-[var(--fin-text-primary)] tabular-nums">{amount}</p>
          </div>
        ))}
      </div>
    </FinSurface>
  )
}

export function FinDataTable() {
  const rows = [
    ["Operating", "$482,490.24", "Safe", "safe"],
    ["Payroll reserve", "$88,200.00", "Pending", "pending"],
    ["AP clearing", "$34,910.16", "Risk review", "risk"],
    ["Card liability", "$18,442.90", "Warning", "warning"],
  ] as const

  return (
    <FinSurface className="overflow-x-auto">
      <table className="w-full min-w-[560px] text-left text-[13px]">
        <caption className="sr-only">Account exposure table</caption>
        <thead className="border-b border-[var(--fin-border)] text-[11px] uppercase tracking-[0.12em] text-[var(--fin-text-secondary)]">
          <tr>
            <th className="px-4 py-3 font-bold">Account</th>
            <th className="px-4 py-3 font-bold">Balance</th>
            <th className="px-4 py-3 font-bold">Status</th>
            <th className="px-4 py-3 font-bold">Action</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-[var(--fin-border)]">
          {rows.map(([account, balance, status, tone]) => (
            <tr key={account}>
              <th className="px-4 py-3 font-semibold text-[var(--fin-text-primary)]">{account}</th>
              <td className="px-4 py-3 font-mono font-semibold tabular-nums text-[var(--fin-text-primary)]">{balance}</td>
              <td className="px-4 py-3"><FinBadge tone={tone as FintechTone}>{status}</FinBadge></td>
              <td className="px-4 py-3"><FinButton variant="ghost" size="sm">Open</FinButton></td>
            </tr>
          ))}
        </tbody>
      </table>
    </FinSurface>
  )
}

export function FinMiniChart({
  showHeader = true,
}: {
  showHeader?: boolean
} = {}) {
  const bars = [42, 54, 39, 68, 73, 58, 82, 76, 91, 87, 95, 102].map((value, index) => ({
    value,
    forecast: index > 7,
  }))

  return (
    <FinSurface className="p-4">
      {showHeader ? (
        <div className="flex items-start justify-between gap-4">
          <div>
            <p className="text-[14px] font-semibold text-[var(--fin-text-primary)]">Cash flow forecast</p>
            <p className="text-[12px] text-[var(--fin-text-secondary)]">Projected runway over 12 weeks</p>
          </div>
          <FinBadge tone="profit">+18.4%</FinBadge>
        </div>
      ) : null}

      <div className={cn("rounded-xl border border-[var(--fin-border)] bg-[var(--fin-muted)] p-3", showHeader && "mt-5")}>
        <div className="mb-3 flex items-center justify-between gap-4 text-[11px] font-medium text-[var(--fin-text-secondary)]">
          <span>Operating cash</span>
          <span className="tabular-nums">Forecast starts W9</span>
        </div>

        <div className="relative h-32">
          <div className="pointer-events-none absolute inset-x-0 bottom-6 top-0">
            <div className="absolute inset-x-0 top-1/3 h-px bg-[var(--fin-border)]" />
            <div className="absolute inset-x-0 top-2/3 h-px bg-[var(--fin-border)]" />
            <div className="absolute bottom-0 left-[66%] top-0 w-px border-l border-dashed border-[var(--fin-accent-border)]" />
          </div>

          <div className="relative z-10 flex h-[104px] items-end gap-1.5 border-b border-[var(--fin-border)]">
            {bars.map((bar, index) => (
              <div
                key={`${bar.value}-${index}`}
                className="flex-1 rounded-t-[5px]"
                style={{
                  height: `${bar.value}%`,
                  background: bar.forecast
                    ? "linear-gradient(180deg,var(--fin-accent),color-mix(in srgb,var(--fin-accent) 34%,transparent))"
                    : "linear-gradient(180deg,var(--fin-brand),color-mix(in srgb,var(--fin-brand) 32%,transparent))",
                  opacity: bar.forecast ? 0.78 : 0.92,
                }}
                title={`Week ${index + 1}: ${bar.value}%`}
              />
            ))}
          </div>

          <div className="mt-2 grid grid-cols-4 text-[10px] font-medium text-[var(--fin-text-secondary)]">
            <span>W1</span>
            <span>W4</span>
            <span>W8</span>
            <span className="text-right">W12</span>
          </div>
        </div>
      </div>

      <div className="mt-3 grid grid-cols-3 gap-2 text-[11px]">
        {[
          ["Runway", "12.4 wk"],
          ["Low point", "W3"],
          ["Peak", "W12"],
        ].map(([label, value]) => (
          <div key={label} className="rounded-[8px] bg-[var(--fin-muted)] px-2.5 py-2">
            <p className="text-[var(--fin-text-secondary)]">{label}</p>
            <p className="mt-0.5 font-mono font-semibold tabular-nums text-[var(--fin-text-primary)]">{value}</p>
          </div>
        ))}
      </div>
    </FinSurface>
  )
}

export function FinSidebar({ items }: { items: FintechNavigationItem[] }) {
  const icons = [IconLayoutDashboard, IconWallet, IconCreditCard, IconReceipt, IconGauge, IconSettings]
  return (
    <FinSurface className="w-full max-w-[260px] p-3">
      <div className="mb-4 flex items-center gap-2 px-2">
        <div className="grid size-8 place-items-center rounded-[8px] bg-[var(--fin-brand)] text-black">
          <IconShieldCheck size={17} />
        </div>
        <div>
          <p className="text-[13px] font-bold text-[var(--fin-text-primary)]">Northstar Pay</p>
          <p className="text-[11px] text-[var(--fin-text-secondary)]">Verified workspace</p>
        </div>
      </div>
      <nav className="space-y-1" aria-label="Fintech sidebar specimen">
        {items.map((item, index) => {
          const Icon = icons[index % icons.length]
          const active = index === 0
          return (
            <a
              href="#foundations"
              key={item.label}
              className={cn(
                "flex items-center justify-between rounded-[8px] px-2.5 py-2 text-[13px] font-semibold",
                active
                  ? "bg-[var(--fin-brand-soft)] text-[var(--fin-brand)]"
                  : "text-[var(--fin-text-secondary)] hover:bg-[var(--fin-muted)]"
              )}
            >
              <span className="flex items-center gap-2"><Icon size={16} /> {item.label}</span>
              {item.value ? <span className="font-mono text-[11px]">{item.value}</span> : null}
            </a>
          )
        })}
      </nav>
    </FinSurface>
  )
}

export function FinTopNav() {
  return (
    <FinSurface className="flex flex-wrap items-center justify-between gap-3 px-4 py-3">
      <div className="flex min-w-0 items-center gap-3">
        <FinBadge tone="safe">Secure session</FinBadge>
        <div className="hidden h-8 items-center gap-2 rounded-[8px] border border-[var(--fin-border)] bg-[var(--fin-muted)] px-3 text-[13px] text-[var(--fin-text-secondary)] sm:flex">
          <IconSearch size={15} />
          Search transactions
        </div>
      </div>
      <div className="flex items-center gap-2">
        <FinButton variant="icon"><IconBell size={16} /></FinButton>
        <FinButton variant="icon"><IconDots size={16} /></FinButton>
        <div className="grid size-8 place-items-center rounded-full bg-[var(--fin-brand)] text-[12px] font-bold text-black">AS</div>
      </div>
    </FinSurface>
  )
}

export function FinMobileNav() {
  const items = [
    ["Home", IconLayoutDashboard],
    ["Pay", IconArrowUpRight],
    ["Cards", IconCards],
    ["Insights", IconGauge],
  ] as const
  return (
    <FinSurface className="grid grid-cols-4 gap-1 p-1">
      {items.map(([label, Icon], index) => (
        <button
          type="button"
          key={label}
          className={cn(
            "flex min-h-12 flex-col items-center justify-center gap-1 rounded-[8px] text-[11px] font-semibold",
            index === 0 ? "bg-[var(--fin-brand-soft)] text-[var(--fin-brand)]" : "text-[var(--fin-text-secondary)]"
          )}
        >
          <Icon size={17} />
          {label}
        </button>
      ))}
    </FinSurface>
  )
}

export function FinSecurityPanel() {
  return (
    <FinSurface className="p-4">
      <div className="flex items-start gap-3">
        <div className="grid size-10 place-items-center rounded-[8px] bg-[var(--fin-safe-soft)] text-[var(--fin-safe)]">
          <IconFingerprint size={20} />
        </div>
        <div className="min-w-0 flex-1">
          <p className="text-[14px] font-semibold text-[var(--fin-text-primary)]">Verify this payment</p>
          <p className="mt-1 text-[12px] leading-5 text-[var(--fin-text-secondary)]">
            Confirm with device biometrics before sending $24,000.00 to a new beneficiary.
          </p>
          <div className="mt-3 grid grid-cols-6 gap-2">
            {["", "", "", "", "", ""].map((_, index) => (
              <div key={index} className="grid h-10 place-items-center rounded-[8px] border border-[var(--fin-border)] bg-[var(--fin-muted)] font-mono text-[18px] text-[var(--fin-text-primary)]">
                {index < 4 ? "•" : ""}
              </div>
            ))}
          </div>
        </div>
      </div>
    </FinSurface>
  )
}

export function FinOverlaySpec() {
  return (
    <div className="grid gap-4 lg:grid-cols-[1fr_280px]">
      <FinSurface className="p-4">
        <div className="max-w-sm rounded-[8px] border border-[var(--fin-border)] bg-[var(--fin-surface-raised)] p-4 shadow-[var(--fin-shadow-overlay)]">
          <div className="mb-3 flex items-start justify-between">
            <div>
              <p className="text-[15px] font-semibold text-[var(--fin-text-primary)]">Confirm wire transfer</p>
              <p className="text-[12px] text-[var(--fin-text-secondary)]">This action cannot be cancelled after submission.</p>
            </div>
            <IconX size={16} className="text-[var(--fin-text-secondary)]" />
          </div>
          <FinBadge tone="risk">Critical confirmation</FinBadge>
          <div className="mt-4 flex justify-end gap-2">
            <FinButton variant="secondary" size="sm">Cancel</FinButton>
            <FinButton variant="destructive" size="sm">Submit wire</FinButton>
          </div>
        </div>
      </FinSurface>
      <FinSurface className="p-4">
        <div className="rounded-[8px] border border-[var(--fin-border)] bg-[var(--fin-muted)] p-3">
          <p className="text-[13px] font-semibold text-[var(--fin-text-primary)]">Bottom sheet</p>
          <p className="mt-1 text-[12px] text-[var(--fin-text-secondary)]">Mobile confirmation and account selection pattern.</p>
        </div>
        <div className="mt-3 rounded-[8px] border border-[var(--fin-border)] bg-[var(--fin-surface-raised)] p-3 shadow-[var(--fin-shadow-overlay)]">
          <p className="text-[13px] font-semibold text-[var(--fin-text-primary)]">Tooltip and popover</p>
          <p className="mt-1 text-[12px] text-[var(--fin-text-secondary)]">Explain fees, limits, and statuses without hiding primary data.</p>
        </div>
      </FinSurface>
    </div>
  )
}

export function FinFeedbackSpec() {
  return (
    <div className="grid gap-3 md:grid-cols-2">
      <FinSurface className="p-4">
        <FinBadge tone="success">Transfer complete</FinBadge>
        <p className="mt-3 text-[14px] font-semibold text-[var(--fin-text-primary)]">Receipt saved</p>
        <p className="mt-1 text-[12px] text-[var(--fin-text-secondary)]">A PDF receipt is available in statements.</p>
      </FinSurface>
      <FinSurface className="p-4">
        <FinBadge tone="error">Recovery needed</FinBadge>
        <p className="mt-3 text-[14px] font-semibold text-[var(--fin-text-primary)]">Card verification failed</p>
        <p className="mt-1 text-[12px] text-[var(--fin-text-secondary)]">No money moved. Try another card or contact support.</p>
      </FinSurface>
      <FinSurface className="p-4">
        <div className="space-y-2">
          <div className="h-3 w-3/5 rounded bg-[var(--fin-skeleton)]" />
          <div className="h-9 rounded bg-[var(--fin-skeleton)]" />
          <div className="h-3 w-4/5 rounded bg-[var(--fin-skeleton)]" />
        </div>
      </FinSurface>
      <FinSurface className="flex items-center gap-3 p-4">
        <IconDownload size={18} className="text-[var(--fin-accent)]" />
        <div>
          <p className="text-[13px] font-semibold text-[var(--fin-text-primary)]">Statement exported</p>
          <p className="text-[12px] text-[var(--fin-text-secondary)]">CSV download started.</p>
        </div>
      </FinSurface>
    </div>
  )
}

export function FinPatternPreview({ pattern }: { pattern: FintechPatternSpec }) {
  const badgeTone: FintechTone =
    pattern.previewKind === "risk" || pattern.previewKind === "dispute"
      ? "risk"
      : pattern.previewKind === "confirmation"
        ? "warning"
        : pattern.previewKind === "kyc" || pattern.previewKind === "consent"
          ? "safe"
          : "brand"

  return (
    <FinSurface className="flex h-full flex-col p-4">
      <div className="flex items-start justify-between gap-3">
        <div>
          <p className="text-[15px] font-semibold text-[var(--fin-text-primary)]">{pattern.name}</p>
          <p className="mt-1 text-[12px] leading-5 text-[var(--fin-text-secondary)]">{pattern.trigger}</p>
        </div>
        <FinBadge tone={badgeTone}>{pattern.primaryStates[0]}</FinBadge>
      </div>

      <div className="mt-4 rounded-[8px] border border-[var(--fin-border)] bg-[var(--fin-muted)] p-3">
        <div className="mb-3 flex items-center justify-between">
          <span className="text-[11px] font-bold uppercase tracking-[0.12em] text-[var(--fin-text-secondary)]">
            Required data
          </span>
          <IconChevronRight size={15} className="text-[var(--fin-text-secondary)]" />
        </div>
        <div className="flex flex-wrap gap-1.5">
          {pattern.requiredData.slice(0, 4).map((item) => (
            <FinBadge key={item} tone="neutral" icon={false}>{item}</FinBadge>
          ))}
        </div>
      </div>

      <div className="mt-4 grid gap-2">
        {pattern.primaryStates.slice(0, 4).map((state, index) => (
          <div key={state} className="flex items-center gap-2 text-[12px] text-[var(--fin-text-secondary)]">
            <span className={cn("grid size-5 place-items-center rounded-full border text-[10px] font-bold", index === 0 ? "border-[var(--fin-brand)] bg-[var(--fin-brand)] text-black" : "border-[var(--fin-border)]")}>
              {index + 1}
            </span>
            {state}
          </div>
        ))}
      </div>

      <p className="mt-auto pt-4 text-[12px] leading-5 text-[var(--fin-text-secondary)]">
        {pattern.riskBehavior}
      </p>
    </FinSurface>
  )
}

export function FinButtonMatrix() {
  return (
    <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
      <FinButton>Send money</FinButton>
      <FinButton variant="secondary">Add account</FinButton>
      <FinButton variant="ghost">Export</FinButton>
      <FinButton variant="destructive">Freeze card</FinButton>
      <FinButton state="loading">Processing</FinButton>
      <FinButton state="disabled">Unavailable</FinButton>
      <FinButton variant="icon"><IconEye size={16} /></FinButton>
    </div>
  )
}

export function FinInputMatrix() {
  return (
    <div className="grid gap-4 md:grid-cols-2">
      <FinField label="Text input" value="Avery Stone" />
      <FinField label="Amount input" value="$24,000.00" prefix={<IconWallet size={15} />} />
      <FinField label="Search input" value="Search transactions" prefix={<IconSearch size={15} />} />
      <FinField label="Select" value="Operating account • 1048" suffix={<IconChevronRight size={15} />} />
      <FinField label="Multi-select" value="Cards, wires, ACH" suffix={<FinBadge tone="neutral" icon={false}>3</FinBadge>} />
      <FinField label="Date picker" value="08 Jun 2026" suffix={<IconClock size={15} />} />
      <FinField label="OTP input" value="••••  " secure description="Two digits remaining" state="focus" />
      <FinField label="Password input" value="••••••••••" secure suffix={<IconEye size={15} />} />
      <FinField label="Card number input" value="4829  ••••  ••••  1048" prefix={<IconCreditCard size={15} />} secure />
      <FinField label="Currency selector" value="USD - United States Dollar" suffix={<IconChevronRight size={15} />} />
      <FinField label="Inline validation" value="wire@recipient" state="error" description="Enter a valid recipient handle." />
      <FinField label="Verified value" value="Northstar Checking" state="success" suffix={<IconCheck size={15} className="text-[var(--fin-success)]" />} />
    </div>
  )
}

function ConsumerSpecStage({
  children,
  className,
}: {
  children: ReactNode
  className?: string
}) {
  return (
    <div className={cn("min-w-0 overflow-hidden rounded-2xl border border-[var(--fin-border)] bg-[var(--fin-muted)] p-4 md:p-5", className)}>
      {children}
    </div>
  )
}

function ConsumerCard({
  children,
  className,
}: {
  children: ReactNode
  className?: string
}) {
  return (
    <div className={cn("min-w-0 max-w-full rounded-2xl border border-[var(--fin-border)] bg-[var(--fin-surface-raised)] text-[var(--fin-text-primary)] shadow-[var(--fin-shadow-raised)]", className)}>
      {children}
    </div>
  )
}

function Sparkline({
  color,
  path,
  className,
}: {
  color: string
  path: string
  className?: string
}) {
  return (
    <svg viewBox="0 0 120 64" className={cn("h-16 w-32", className)} aria-hidden>
      <path
        d={path}
        fill="none"
        stroke={color}
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="5"
      />
    </svg>
  )
}

function FinPriceTargetCard() {
  return (
    <ConsumerSpecStage className="grid place-items-center">
      <ConsumerCard className="w-full max-w-[330px] overflow-hidden p-5">
        <div className="flex items-start justify-between gap-4">
          <div>
            <p className="text-[13px] font-semibold text-[var(--fin-text-primary)]">Price target</p>
            <p className="mt-1 text-[12px] text-[var(--fin-text-secondary)]">Target range</p>
          </div>
          <FinBadge tone="income">2.35%</FinBadge>
        </div>

        <div className="mt-5 flex items-end justify-between gap-4">
          <div>
            <p className="font-mono text-[30px] font-semibold leading-none tabular-nums text-[var(--fin-text-primary)]">
              $95,260
            </p>
            <p className="mt-2 text-[12px] font-medium text-[var(--fin-text-secondary)]">
              Current price
            </p>
          </div>
          <button type="button" className="h-9 rounded-full bg-[var(--fin-brand)] px-5 text-[13px] font-semibold text-black">
            Set alert
          </button>
        </div>

        <div className="mt-6 rounded-xl border border-[var(--fin-border)] bg-[var(--fin-muted)] p-4">
          <svg viewBox="0 0 280 120" className="h-28 w-full" aria-hidden>
            <path d="M0 82H280" stroke="var(--fin-border)" strokeWidth="1.5" />
            <path d="M0 48H280" stroke="var(--fin-border)" strokeDasharray="4 7" strokeLinecap="round" strokeWidth="1.5" />
            <path
              d="M2 84 C34 82 45 64 74 65 C103 66 101 86 128 84 C157 82 153 48 183 51 C211 54 208 81 234 75 C256 70 258 47 278 44"
              fill="none"
              stroke="var(--fin-accent)"
              strokeLinecap="round"
              strokeWidth="4"
            />
          </svg>
          <div className="mt-3 flex items-center justify-between text-[11px] font-medium text-[var(--fin-text-secondary)]">
            <span className="tabular-nums">$78.4k</span>
            <span className="tabular-nums">$110k</span>
          </div>
        </div>
      </ConsumerCard>
    </ConsumerSpecStage>
  )
}

function FinDistributionCard() {
  const allocations = [
    ["Savings", "10%", "var(--fin-brand)"],
    ["Stock", "10%", "var(--fin-pending)"],
    ["Bitcoin", "7%", "var(--fin-accent)"],
  ]

  return (
    <ConsumerSpecStage className="grid place-items-center">
      <ConsumerCard className="w-full max-w-[360px] p-5">
        <div className="flex items-center justify-between">
          <div>
            <h4 className="text-[16px] font-semibold leading-none">Distributions</h4>
            <p className="mt-1.5 text-[12px] text-[var(--fin-text-secondary)]">Available balance mix</p>
          </div>
          <button type="button" className="h-8 rounded-full border border-[var(--fin-border)] bg-[var(--fin-muted)] px-3 text-[12px] font-semibold text-[var(--fin-text-secondary)] transition-colors hover:text-[var(--fin-text-primary)]">
            Edit
          </button>
        </div>

        <div className="mt-5 grid items-center gap-5 sm:grid-cols-[132px_1fr]">
          <div className="grid size-32 place-items-center rounded-full bg-[conic-gradient(var(--fin-text-primary)_0_73%,var(--fin-brand)_73%_83%,var(--fin-pending)_83%_93%,var(--fin-accent)_93%_100%)]">
            <div className="grid size-[104px] place-items-center rounded-full bg-[var(--fin-surface-raised)] text-center">
              <div>
                <p className="text-[25px] font-semibold leading-none tabular-nums">73%</p>
                <p className="mt-1 text-[11px] font-medium text-[var(--fin-text-secondary)]">Cash</p>
              </div>
            </div>
          </div>

          <div className="min-w-0">
            <p className="text-[11px] font-medium text-[var(--fin-text-secondary)]">Cash balance</p>
            <p className="mt-1 font-mono text-[24px] font-semibold leading-none tabular-nums text-[var(--fin-text-primary)]">
              $1,460.00
            </p>
            <div className="mt-4 grid gap-2">
              {allocations.map(([label, value, color]) => (
                <div key={label} className="flex items-center justify-between gap-3 text-[12px]">
                  <span className="flex min-w-0 items-center gap-2 text-[var(--fin-text-secondary)]">
                    <span className="size-2 rounded-full" style={{ backgroundColor: color }} />
                    {label}
                  </span>
                  <span className="font-mono font-semibold tabular-nums text-[var(--fin-text-primary)]">{value}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="mt-5 rounded-[10px] border border-[var(--fin-border)] bg-[var(--fin-muted)] px-3 py-2.5">
          <div className="flex items-center justify-between text-[12px]">
            <span className="text-[var(--fin-text-secondary)]">Invested allocation</span>
            <span className="font-mono font-semibold tabular-nums text-[var(--fin-text-primary)]">27%</span>
          </div>
          <div className="mt-2 h-1.5 overflow-hidden rounded-full bg-[var(--fin-border)]">
            <div className="h-full w-[27%] rounded-full bg-[var(--fin-brand)]" />
          </div>
        </div>
      </ConsumerCard>
    </ConsumerSpecStage>
  )
}

function FinAssetRowsCard() {
  const rows = [
    {
      name: "Savings",
      value: "$140.00",
      sub: "$160 to goal",
      visual: (
        <div className="grid size-14 place-items-center rounded-full bg-[conic-gradient(var(--fin-brand)_0_38%,var(--fin-muted)_38%_100%)]">
          <div className="grid size-11 place-items-center rounded-full bg-[var(--fin-surface-raised)] text-[var(--fin-text-primary)]">
            <IconWallet size={18} />
          </div>
        </div>
      ),
    },
    {
      name: "Bitcoin",
      value: "$110.00",
      sub: "1.18% today",
      accent: "text-[var(--fin-income)]",
      visual: <Sparkline color="var(--fin-accent)" path="M4 46 C12 20 14 6 22 36 C29 62 41 54 50 52 C60 48 66 40 74 45 C82 50 84 28 91 38 C99 48 102 18 116 28" />,
    },
    {
      name: "Stocks",
      value: "$210.00",
      sub: "2.55% today",
      accent: "text-[var(--fin-income)]",
      visual: <Sparkline color="var(--fin-pending)" path="M4 18 C10 58 18 56 24 30 C31 6 39 22 44 14 C52 4 58 30 65 24 C76 16 84 40 92 48 C103 58 106 22 116 16" />,
    },
  ]

  return (
    <ConsumerSpecStage className="space-y-3">
      {rows.map((row) => (
        <ConsumerCard key={row.name} className="flex items-center justify-between gap-4 px-5 py-4">
          <div className="min-w-0">
            <div className="flex items-center gap-1.5">
              <p className="text-[15px] font-semibold leading-none">{row.name}</p>
              <IconChevronRight size={15} className="text-[var(--fin-text-secondary)]" />
            </div>
            <p className="mt-2.5 text-[24px] font-semibold leading-none tracking-normal tabular-nums">{row.value}</p>
            <p className={cn("mt-2.5 flex items-center gap-1 text-[13px] font-medium text-[var(--fin-text-secondary)]", row.accent)}>
              {row.accent ? <IconArrowUpRight size={13} /> : null}
              {row.sub}
            </p>
          </div>
          <div className="shrink-0">{row.visual}</div>
        </ConsumerCard>
      ))}
    </ConsumerSpecStage>
  )
}

function FinLocalSpotsCard() {
  const places = [
    ["Rangoon Bistro", "Open until 10pm · Restaurant", "RB"],
    ["Lovejoy Bakery", "Open until 5pm · Bakery", "LB"],
    ["Wallflower Coffee Co", "Open until 11pm · Cafe", "WC"],
  ]

  return (
    <ConsumerSpecStage className="grid place-items-center">
      <ConsumerCard className="w-full max-w-[380px] p-6">
        <h4 className="max-w-[260px] text-[22px] font-semibold leading-tight tracking-normal">
          Find the best spots in Portland
        </h4>
        <div className="mt-6 space-y-4">
          {places.map(([name, meta, label]) => (
            <div key={name} className="grid grid-cols-[44px_1fr_auto] items-center gap-3">
              <div className="grid size-11 place-items-center rounded-xl border border-[var(--fin-border)] bg-[var(--fin-muted)] text-center text-[12px] font-semibold leading-none text-[var(--fin-text-secondary)]">
                {label}
              </div>
              <div className="min-w-0">
                <p className="truncate text-[15px] font-semibold leading-tight">{name}</p>
                <p className="mt-1 truncate text-[12px] font-medium text-[var(--fin-text-secondary)]">{meta}</p>
              </div>
              <button type="button" className="h-9 rounded-full border border-[var(--fin-border)] bg-[var(--fin-muted)] px-4 text-[13px] font-semibold text-[var(--fin-text-secondary)] transition-colors hover:text-[var(--fin-text-primary)]">
                Add
              </button>
            </div>
          ))}
        </div>
      </ConsumerCard>
    </ConsumerSpecStage>
  )
}

function FinEarningsStripCard() {
  const bars = [44, 58, 36, 68, 92, 64, 48, 72, 60, 54, 42, 38]

  return (
    <ConsumerSpecStage className="grid place-items-center">
      <ConsumerCard className="w-full max-w-[360px] p-5">
        <div className="flex min-w-0 items-center justify-between gap-3">
          <div className="min-w-0">
            <h4 className="text-[16px] font-semibold leading-none">Earnings</h4>
            <p className="mt-1.5 text-[12px] text-[var(--fin-text-secondary)]">May activity</p>
          </div>
          <button type="button" className="flex shrink-0 items-center gap-1 rounded-full border border-[var(--fin-border)] bg-[var(--fin-muted)] px-3 py-1.5 text-[12px] font-semibold text-[var(--fin-text-secondary)] transition-colors hover:text-[var(--fin-text-primary)]">
            <span className="tabular-nums">$389</span>
            <IconChevronRight size={15} className="shrink-0" />
          </button>
        </div>

        <div className="mt-5 rounded-xl border border-[var(--fin-border)] bg-[var(--fin-muted)] p-3">
          <div className="flex h-20 min-w-0 items-end gap-1.5 border-b border-[var(--fin-border)]">
            {bars.map((height, index) => (
              <span
                key={`${height}-${index}`}
                className="min-w-0 flex-1 rounded-t-[5px]"
                style={{
                  height: `${height}%`,
                  backgroundColor: index === 4 || index === 7
                    ? "var(--fin-brand)"
                    : index < 9
                      ? "var(--fin-brand-soft-strong)"
                      : "var(--fin-muted)",
                }}
              />
            ))}
          </div>
          <div className="mt-2 flex items-center justify-between text-[10px] font-medium text-[var(--fin-text-secondary)]">
            <span>Week 1</span>
            <span>Week 12</span>
          </div>
        </div>

        <div className="mt-4 grid grid-cols-2 gap-2">
          <div className="rounded-lg bg-[var(--fin-muted)] px-3 py-2">
            <p className="text-[11px] text-[var(--fin-text-secondary)]">Best day</p>
            <p className="mt-0.5 font-mono text-[13px] font-semibold tabular-nums">$84</p>
          </div>
          <div className="rounded-lg bg-[var(--fin-muted)] px-3 py-2">
            <p className="text-[11px] text-[var(--fin-text-secondary)]">Average</p>
            <p className="mt-0.5 font-mono text-[13px] font-semibold tabular-nums">$32</p>
          </div>
        </div>
      </ConsumerCard>
    </ConsumerSpecStage>
  )
}

function FinStockActionCard() {
  return (
    <ConsumerSpecStage className="grid place-items-center">
      <ConsumerCard className="relative h-[380px] w-full max-w-[300px] overflow-hidden p-6">
        <div className="grid size-12 place-items-center rounded-full bg-[var(--fin-brand)] text-black">
          <IconStar size={24} fill="currentColor" />
        </div>
        <h4 className="mt-4 text-[18px] font-semibold">Capsule Corp.</h4>
        <p className="mt-2 flex items-center gap-1 text-[14px] font-semibold text-[var(--fin-income)]"><IconArrowUpRight size={14} />1.01%</p>
        <svg viewBox="0 0 300 180" className="absolute inset-x-0 bottom-[96px] h-40 w-full" aria-hidden>
          <path
            d="M0 125 C34 118 31 82 72 90 C116 98 102 130 139 123 C166 118 165 54 198 70 C230 86 216 126 254 108 C281 95 277 53 300 55"
            fill="none"
            stroke="var(--fin-brand)"
            strokeLinecap="round"
            strokeWidth="4"
          />
        </svg>
        <div className="absolute inset-x-6 bottom-[72px] grid grid-cols-5 gap-1.5">
          {["1D", "1W", "1M", "1Y", "ALL"].map((range, index) => (
            <button
              key={range}
              type="button"
              className={cn(
                "h-8 rounded-full text-[12px] font-semibold transition-colors",
                index === 0
                  ? "bg-[var(--fin-brand-soft-strong)] text-[var(--fin-text-primary)]"
                  : "bg-[var(--fin-muted)] text-[var(--fin-text-secondary)] hover:text-[var(--fin-text-primary)]"
              )}
            >
              {range}
            </button>
          ))}
        </div>
        <div className="absolute inset-x-5 bottom-5 grid grid-cols-3 gap-2">
          <button type="button" className="h-10 rounded-full bg-[var(--fin-brand)] text-[13px] font-semibold text-black">Buy</button>
          {["Sell", "Send"].map((action) => (
            <button key={action} type="button" className="h-10 rounded-full border border-[var(--fin-border)] bg-[var(--fin-muted)] text-[13px] font-semibold text-[var(--fin-text-secondary)] transition-colors hover:text-[var(--fin-text-primary)]">
              {action}
            </button>
          ))}
        </div>
      </ConsumerCard>
    </ConsumerSpecStage>
  )
}

function FinLargeProgressCard() {
  return (
    <ConsumerSpecStage className="grid place-items-center">
      <ConsumerCard className="w-full max-w-[360px] p-5">
        <div className="flex items-start justify-between gap-4">
          <div>
            <p className="text-[16px] font-semibold leading-none">Runway health</p>
            <p className="mt-1.5 text-[12px] text-[var(--fin-text-secondary)]">Target coverage</p>
          </div>
          <FinBadge tone="info">62%</FinBadge>
        </div>

        <div className="mt-5 grid items-center gap-5 sm:grid-cols-[116px_1fr]">
          <div className="grid size-28 place-items-center rounded-full bg-[conic-gradient(var(--fin-accent)_0_62%,var(--fin-border)_62%_100%)]">
            <div className="grid size-[88px] place-items-center rounded-full bg-[var(--fin-surface-raised)] text-center">
              <div>
                <p className="text-[25px] font-semibold leading-none tabular-nums text-[var(--fin-text-primary)]">62%</p>
                <p className="mt-1 text-[10px] font-medium text-[var(--fin-text-secondary)]">covered</p>
              </div>
            </div>
          </div>

          <div className="min-w-0">
            <p className="text-[13px] font-semibold leading-5 text-[var(--fin-text-primary)]">
              Above minimum, below target
            </p>
            <p className="mt-1 text-[12px] leading-5 text-[var(--fin-text-secondary)]">
              Add $18.4k to reach the recommended 90-day buffer.
            </p>
            <div className="mt-4 grid grid-cols-2 gap-2">
              <div className="rounded-lg bg-[var(--fin-muted)] px-3 py-2">
                <p className="text-[11px] text-[var(--fin-text-secondary)]">Current</p>
                <p className="mt-0.5 font-mono text-[13px] font-semibold tabular-nums">$56k</p>
              </div>
              <div className="rounded-lg bg-[var(--fin-muted)] px-3 py-2">
                <p className="text-[11px] text-[var(--fin-text-secondary)]">Target</p>
                <p className="mt-0.5 font-mono text-[13px] font-semibold tabular-nums">$90k</p>
              </div>
            </div>
          </div>
        </div>
      </ConsumerCard>
    </ConsumerSpecStage>
  )
}

function FinPaymentReceiptCard() {
  return (
    <ConsumerSpecStage className="grid place-items-center">
      <ConsumerCard className="w-full max-w-[340px] p-6">
        <div className="grid size-12 place-items-center rounded-full border border-[var(--fin-border)] bg-[var(--fin-muted)] text-[var(--fin-text-secondary)]">
          <IconReceipt size={22} />
        </div>
        <div className="mt-4 flex items-center gap-1.5">
          <h4 className="text-[18px] font-semibold leading-none">Diego the Barber</h4>
          <IconBriefcase size={17} className="text-[var(--fin-brand)]" />
        </div>
        <p className="mt-2.5 text-[13px] font-medium text-[var(--fin-text-secondary)]">Yesterday at 12:25pm</p>
        <p className="mt-1 text-[13px] font-medium text-[var(--fin-text-secondary)]">For boy&apos;s haircut</p>
        <p className="mt-6 text-[30px] font-semibold leading-none tracking-normal tabular-nums">$41.20</p>
        <div className="my-6 h-px bg-[var(--fin-border)]" />
        <h5 className="text-[14px] font-semibold">Payment details</h5>
        <div className="mt-4 space-y-3 text-[13px]">
          {[
            ["You paid Diego the Barber", "$40.00"],
            ["Credit card fee", "$1.20"],
            ["Total sent", "$41.20"],
          ].map(([label, value]) => (
            <div key={label} className="flex items-center justify-between gap-4">
              <span className="text-[var(--fin-text-secondary)]">{label}</span>
              <span className="font-semibold tabular-nums">{value}</span>
            </div>
          ))}
        </div>
      </ConsumerCard>
    </ConsumerSpecStage>
  )
}

export function FinConsumerCardSpecimens() {
  return (
    <div className="grid gap-4 xl:grid-cols-2">
      <FinPriceTargetCard />
      <FinDistributionCard />
      <FinAssetRowsCard />
      <FinStockActionCard />
      <FinLocalSpotsCard />
      <FinPaymentReceiptCard />
    </div>
  )
}

export function FinConsumerDataSpecimens() {
  return (
    <div className="grid gap-4 xl:grid-cols-2">
      <FinEarningsStripCard />
      <FinLargeProgressCard />
    </div>
  )
}

export function FinCardMatrix() {
  return (
    <div className="grid gap-5">
      <div className="grid gap-4 lg:grid-cols-3">
        <div className="grid gap-4">
          <FinKpiCard label="Available balance" value="$482,490" description="Across 4 operating accounts" tone="profit" trend="+12.4%" />
          <FinKpiCard label="Risk exposure" value="$18,442" description="Card liability under review" tone="risk" trend="Review" />
        </div>
        <FinCreditCardPreview />
        <div className="grid gap-4">
          <FinSurface className="p-4">
            <FinBadge tone="info">Insight</FinBadge>
            <p className="mt-3 text-[14px] font-semibold text-[var(--fin-text-primary)]">Payroll reserve is below target</p>
            <p className="mt-1 text-[12px] leading-5 text-[var(--fin-text-secondary)]">Move $14,800 from operating to maintain the next payroll buffer.</p>
          </FinSurface>
          <FinSurface className="p-4">
            <FinBadge tone="warning">Alert</FinBadge>
            <p className="mt-3 text-[14px] font-semibold text-[var(--fin-text-primary)]">Wire cut-off in 42 minutes</p>
            <p className="mt-1 text-[12px] leading-5 text-[var(--fin-text-secondary)]">Submit reviewed transfers now for same-day settlement.</p>
          </FinSurface>
        </div>
      </div>
      <FinConsumerCardSpecimens />
    </div>
  )
}

export function FinNavigationMatrix() {
  return (
    <div className="grid gap-4 lg:grid-cols-[260px_1fr]">
      <FinSidebar
        items={[
          { label: "Dashboard", value: "Live" },
          { label: "Wallets" },
          { label: "Cards", value: "8" },
          { label: "Transactions" },
          { label: "Analytics" },
          { label: "Settings" },
        ]}
      />
      <div className="grid content-start gap-4">
        <FinTopNav />
        <FinSurface className="p-4">
          <div className="flex flex-wrap items-center gap-2 text-[13px] text-[var(--fin-text-secondary)]">
            <span>Dashboard</span>
            <IconChevronRight size={14} />
            <span>Accounts</span>
            <IconChevronRight size={14} />
            <span className="font-semibold text-[var(--fin-text-primary)]">Operating account</span>
          </div>
          <div className="mt-4 flex flex-wrap gap-2">
            {["Overview", "Transactions", "Statements", "Limits", "Settings"].map((tab, index) => (
              <button
                key={tab}
                type="button"
                className={cn(
                  "h-8 rounded-[8px] px-3 text-[13px] font-semibold",
                  index === 0 ? "bg-[var(--fin-brand)] text-black" : "bg-[var(--fin-muted)] text-[var(--fin-text-secondary)]"
                )}
              >
                {tab}
              </button>
            ))}
          </div>
        </FinSurface>
        <div className="max-w-sm">
          <FinMobileNav />
        </div>
      </div>
    </div>
  )
}

export function FinDataMatrix() {
  return (
    <div className="grid gap-4">
      <div className="grid gap-4 lg:grid-cols-3">
        <FinKpiCard label="Net cash movement" value="+$42,884" description="Compared to previous 30 days" tone="income" trend="+8.8%" />
        <FinKpiCard label="Burn multiple" value="1.28x" description="Inside finance policy threshold" tone="safe" trend="Safe" />
        <FinKpiCard label="Exceptions" value="7" description="Require review before close" tone="warning" trend="Pending" />
      </div>
      <div className="grid gap-4 lg:grid-cols-[1fr_1fr]">
        <FinMiniChart />
        <FinTransactionList />
      </div>
      <div className="flex flex-wrap items-center gap-2">
        <FinButton variant="secondary" size="sm"><IconFilter size={14} /> Filters</FinButton>
        <FinButton variant="secondary" size="sm">Sort by date</FinButton>
        <FinButton variant="ghost" size="sm">Previous</FinButton>
        <FinBadge tone="neutral" icon={false}>Page 1 of 8</FinBadge>
        <FinButton variant="ghost" size="sm">Next</FinButton>
      </div>
      <FinDataTable />
      <FinConsumerDataSpecimens />
    </div>
  )
}

function FinOrderTicketSpec() {
  return (
    <FinSurface className="overflow-hidden">
      <div className="border-b border-[var(--fin-border)] p-4">
        <div className="flex items-start justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <div className="grid size-9 place-items-center rounded-[8px] bg-[var(--fin-brand-soft)] text-[var(--fin-brand)]">
                <IconChartCandle size={18} />
              </div>
              <div>
                <p className="text-[15px] font-semibold text-[var(--fin-text-primary)]">NVDA</p>
                <p className="text-[12px] text-[var(--fin-text-secondary)]">NVIDIA Corporation</p>
              </div>
            </div>
          </div>
          <div className="text-right">
            <p className="font-mono text-[20px] font-semibold leading-none tabular-nums text-[var(--fin-text-primary)]">$142.64</p>
            <p className="mt-1 flex items-center justify-end gap-1 text-[12px] font-semibold text-[var(--fin-profit)]">
              <IconArrowUpRight size={13} /> 2.18%
            </p>
          </div>
        </div>
        <Sparkline
          color="var(--fin-brand)"
          path="M4 44 C13 30 21 36 29 28 C39 18 46 32 55 25 C67 15 72 38 84 30 C96 22 101 16 116 12"
          className="mt-4 h-20 w-full"
        />
      </div>

      <div className="grid gap-3 p-4">
        <div className="grid grid-cols-2 gap-2">
          {["Buy", "Sell"].map((side, index) => (
            <button
              key={side}
              type="button"
              className={cn(
                "h-9 rounded-[8px] text-[13px] font-semibold",
                index === 0
                  ? "bg-[var(--fin-brand)] text-black"
                  : "border border-[var(--fin-border)] bg-[var(--fin-muted)] text-[var(--fin-text-secondary)]"
              )}
            >
              {side}
            </button>
          ))}
        </div>
        <div className="grid gap-2 sm:grid-cols-2">
          <FinField label="Order type" value="Limit" suffix={<IconChevronDown size={15} />} />
          <FinField label="Shares" value="12.5" />
          <FinField label="Limit price" value="$141.80" />
          <FinField label="Time in force" value="Day" suffix={<IconChevronDown size={15} />} />
        </div>
        <div className="rounded-[10px] border border-[var(--fin-warning-border)] bg-[var(--fin-warning-soft)] p-3">
          <p className="text-[12px] font-semibold text-[var(--fin-warning)]">Estimated order value: $1,772.50. Market price can move before fill.</p>
        </div>
        <FinButton>Review buy order</FinButton>
      </div>
    </FinSurface>
  )
}

function FinWatchlistSpec() {
  const rows = [
    ["AAPL", "Apple", "$203.92", "+1.2%", "profit"],
    ["TSLA", "Tesla", "$178.48", "-0.8%", "loss"],
    ["VTI", "Vanguard Total", "$288.10", "+0.4%", "profit"],
    ["COIN", "Coinbase", "$246.33", "+3.7%", "profit"],
  ] as const

  return (
    <FinSurface className="overflow-hidden">
      <div className="flex items-center justify-between border-b border-[var(--fin-border)] px-4 py-3">
        <div>
          <p className="text-[14px] font-semibold text-[var(--fin-text-primary)]">Watchlist</p>
          <p className="text-[12px] text-[var(--fin-text-secondary)]">Live quote rows with signed movement</p>
        </div>
        <FinBadge tone="safe">Market open</FinBadge>
      </div>
      <div className="divide-y divide-[var(--fin-border)]">
        {rows.map(([symbol, name, price, change, tone]) => (
          <div key={symbol} className="grid grid-cols-[52px_1fr_auto] items-center gap-3 px-4 py-3">
            <div className="grid size-10 place-items-center rounded-[8px] border border-[var(--fin-border)] bg-[var(--fin-muted)] font-mono text-[12px] font-bold text-[var(--fin-text-primary)]">
              {symbol}
            </div>
            <div className="min-w-0">
              <p className="truncate text-[13px] font-semibold text-[var(--fin-text-primary)]">{name}</p>
              <p className="text-[12px] text-[var(--fin-text-secondary)]">{symbol}</p>
            </div>
            <div className="text-right">
              <p className="font-mono text-[13px] font-semibold tabular-nums text-[var(--fin-text-primary)]">{price}</p>
              <p className={cn("text-[12px] font-semibold tabular-nums", tone === "loss" ? "text-[var(--fin-loss)]" : "text-[var(--fin-profit)]")}>{change}</p>
            </div>
          </div>
        ))}
      </div>
    </FinSurface>
  )
}

export function FinTradingMatrix() {
  return (
    <div className="grid gap-4 lg:grid-cols-[1fr_0.9fr]">
      <FinOrderTicketSpec />
      <div className="grid gap-4">
        <FinWatchlistSpec />
        <FinSurface className="p-4">
          <div className="flex items-start gap-3">
            <div className="grid size-10 place-items-center rounded-[8px] bg-[var(--fin-accent-soft)] text-[var(--fin-accent)]">
              <IconChartLine size={19} />
            </div>
            <div>
              <p className="text-[14px] font-semibold text-[var(--fin-text-primary)]">Position summary</p>
              <p className="mt-1 text-[12px] leading-5 text-[var(--fin-text-secondary)]">
                Average cost, unrealized gain, allocation weight, and tax lot labels stay visible before sell actions.
              </p>
              <div className="mt-3 grid grid-cols-3 gap-2 text-center">
                {[
                  ["12.5", "shares"],
                  ["$1,708", "cost"],
                  ["+$74", "gain"],
                ].map(([value, label]) => (
                  <div key={label} className="rounded-[8px] border border-[var(--fin-border)] bg-[var(--fin-muted)] p-2">
                    <p className="font-mono text-[13px] font-semibold tabular-nums text-[var(--fin-text-primary)]">{value}</p>
                    <p className="mt-1 text-[10px] font-medium text-[var(--fin-text-secondary)]">{label}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </FinSurface>
      </div>
    </div>
  )
}

function FinCryptoAssetListSpec() {
  const assets = [
    ["BTC", "Bitcoin", "0.1842 BTC", "$12,824.90", "profit"],
    ["ETH", "Ethereum", "3.20 ETH", "$10,118.42", "profit"],
    ["USDC", "USD Coin", "4,820 USDC", "$4,820.00", "neutral"],
  ] as const

  return (
    <FinSurface className="overflow-hidden">
      <div className="flex items-center justify-between border-b border-[var(--fin-border)] px-4 py-3">
        <div>
          <p className="text-[14px] font-semibold text-[var(--fin-text-primary)]">Crypto wallet</p>
          <p className="text-[12px] text-[var(--fin-text-secondary)]">Multi-asset balances by network</p>
        </div>
        <FinBadge tone="safe">Self-custody</FinBadge>
      </div>
      <div className="p-4">
        <p className="text-[12px] text-[var(--fin-text-secondary)]">Portfolio value</p>
        <p className="mt-1 font-mono text-[30px] font-semibold leading-none tabular-nums text-[var(--fin-text-primary)]">$27,763.32</p>
        <div className="mt-4 grid grid-cols-3 gap-2">
          {[
            ["Send", IconArrowUpRight],
            ["Receive", IconQrcode],
            ["Swap", IconSwitchHorizontal],
          ].map(([label, Icon]) => (
            <button key={label as string} type="button" className="flex h-12 flex-col items-center justify-center gap-1 rounded-[10px] bg-[var(--fin-muted)] text-[11px] font-semibold text-[var(--fin-text-secondary)]">
              <Icon size={16} />
              {label as string}
            </button>
          ))}
        </div>
      </div>
      <div className="divide-y divide-[var(--fin-border)]">
        {assets.map(([symbol, name, amount, value, tone]) => (
          <div key={symbol} className="grid grid-cols-[44px_1fr_auto] items-center gap-3 px-4 py-3">
            <div className="grid size-10 place-items-center rounded-full bg-[var(--fin-brand-soft)] text-[var(--fin-brand)]">
              {symbol === "BTC" ? <IconCurrencyBitcoin size={18} /> : <IconCoinBitcoin size={18} />}
            </div>
            <div className="min-w-0">
              <p className="truncate text-[13px] font-semibold text-[var(--fin-text-primary)]">{name}</p>
              <p className="font-mono text-[11px] text-[var(--fin-text-secondary)]">{amount}</p>
            </div>
            <div className="text-right">
              <p className="font-mono text-[13px] font-semibold tabular-nums text-[var(--fin-text-primary)]">{value}</p>
              <p className={cn("text-[11px] font-semibold", tone === "neutral" ? "text-[var(--fin-text-secondary)]" : "text-[var(--fin-profit)]")}>
                {tone === "neutral" ? "stable" : "+2.4%"}
              </p>
            </div>
          </div>
        ))}
      </div>
    </FinSurface>
  )
}

function FinWalletAddressSpec() {
  return (
    <FinSurface className="p-4">
      <div className="flex items-start justify-between gap-4">
        <div>
          <p className="text-[14px] font-semibold text-[var(--fin-text-primary)]">Receive BTC</p>
          <p className="mt-1 text-[12px] text-[var(--fin-text-secondary)]">Bitcoin network only</p>
        </div>
        <FinBadge tone="warning">Network locked</FinBadge>
      </div>
      <div className="mt-4 grid gap-4 sm:grid-cols-[112px_1fr]">
        <div className="grid size-28 place-items-center rounded-[14px] border border-[var(--fin-border)] bg-[var(--fin-muted)]">
          <IconQrcode size={58} className="text-[var(--fin-text-primary)]" />
        </div>
        <div className="min-w-0">
          <p className="text-[11px] font-bold uppercase tracking-[0.12em] text-[var(--fin-text-secondary)]">Wallet address</p>
          <p className="mt-2 break-all font-mono text-[12px] leading-5 text-[var(--fin-text-primary)]">
            bc1q9v...8m42r7
          </p>
          <div className="mt-3 flex flex-wrap gap-2">
            <FinButton variant="secondary" size="sm">Copy address</FinButton>
            <FinButton variant="ghost" size="sm"><IconRefresh size={14} /> Refresh</FinButton>
          </div>
        </div>
      </div>
      <div className="mt-4 rounded-[10px] border border-[var(--fin-risk-border)] bg-[var(--fin-risk-soft)] p-3">
        <p className="flex items-start gap-2 text-[12px] font-semibold leading-5 text-[var(--fin-risk)]">
          <IconKey size={15} className="mt-0.5 shrink-0" />
          Sending the wrong asset or network can permanently lose funds.
        </p>
      </div>
    </FinSurface>
  )
}

export function FinCryptoWalletMatrix() {
  return (
    <div className="grid gap-4 lg:grid-cols-[0.95fr_1fr]">
      <FinCryptoAssetListSpec />
      <div className="grid gap-4">
        <FinWalletAddressSpec />
        <FinSurface className="p-4">
          <div className="flex items-start gap-3">
            <div className="grid size-10 place-items-center rounded-[8px] bg-[var(--fin-pending-soft)] text-[var(--fin-pending)]">
              <IconSwitchHorizontal size={19} />
            </div>
            <div>
              <p className="text-[14px] font-semibold text-[var(--fin-text-primary)]">Swap review</p>
              <p className="mt-1 text-[12px] leading-5 text-[var(--fin-text-secondary)]">
                Shows received amount, slippage tolerance, network fee, route, and final irreversible broadcast state.
              </p>
              <div className="mt-3 grid gap-2 text-[12px]">
                {[
                  ["From", "0.024 BTC"],
                  ["To", "0.91 ETH"],
                  ["Gas", "$8.42"],
                ].map(([label, value]) => (
                  <div key={label} className="flex justify-between rounded-[8px] bg-[var(--fin-muted)] px-3 py-2">
                    <span className="text-[var(--fin-text-secondary)]">{label}</span>
                    <span className="font-mono font-semibold tabular-nums text-[var(--fin-text-primary)]">{value}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </FinSurface>
      </div>
    </div>
  )
}

export function FinSecurityMatrix() {
  return (
    <div className="grid gap-4 lg:grid-cols-2">
      <FinSecurityPanel />
      <FinSurface className="p-4">
        <div className="flex items-start gap-3">
          <div className="grid size-10 place-items-center rounded-[8px] bg-[var(--fin-risk-soft)] text-[var(--fin-risk)]">
            <IconLock size={19} />
          </div>
          <div>
            <p className="text-[14px] font-semibold text-[var(--fin-text-primary)]">New device trust prompt</p>
            <p className="mt-1 text-[12px] leading-5 text-[var(--fin-text-secondary)]">
              Chrome on macOS requested access from Mumbai, India. Trust only if this was you.
            </p>
            <div className="mt-3 flex flex-wrap gap-2">
              <FinButton variant="destructive" size="sm">Block access</FinButton>
              <FinButton variant="secondary" size="sm">Trust device</FinButton>
            </div>
          </div>
        </div>
      </FinSurface>
      <FinSurface className="p-4">
        <FinBadge tone="safe">Consent</FinBadge>
        <p className="mt-3 text-[14px] font-semibold text-[var(--fin-text-primary)]">Share account balances with LedgerOps</p>
        <p className="mt-1 text-[12px] leading-5 text-[var(--fin-text-secondary)]">
          Access includes balances and transaction history for 90 days. You can revoke it anytime.
        </p>
      </FinSurface>
      <FinSurface className="p-4">
        <FinBadge tone="warning">Session timeout</FinBadge>
        <p className="mt-3 text-[14px] font-semibold text-[var(--fin-text-primary)]">Your session ends in 01:28</p>
        <p className="mt-1 text-[12px] leading-5 text-[var(--fin-text-secondary)]">
          Stay signed in only on trusted devices.
        </p>
      </FinSurface>
    </div>
  )
}

export const fintechComponentPreviewMap: Record<string, ReactNode> = {
  Navigation: <FinNavigationMatrix />,
  Buttons: <FinButtonMatrix />,
  Inputs: <FinInputMatrix />,
  Cards: <FinCardMatrix />,
  Data: <FinDataMatrix />,
  Trading: <FinTradingMatrix />,
  "Crypto Wallet": <FinCryptoWalletMatrix />,
  Feedback: <FinFeedbackSpec />,
  Security: <FinSecurityMatrix />,
  Overlays: <FinOverlaySpec />,
}

function ScreenFrame({
  title,
  eyebrow,
  children,
  className,
}: {
  title: string
  eyebrow: string
  children: ReactNode
  className?: string
}) {
  return (
    <div
      className={cn(
        "relative overflow-hidden rounded-[24px] border border-[var(--fin-border)] bg-[color-mix(in_srgb,var(--fin-surface)_84%,transparent)] p-3 shadow-[var(--fin-shadow-raised)] backdrop-blur-xl",
        className
      )}
    >
      <div className="pointer-events-none absolute inset-x-8 top-0 h-px bg-gradient-to-r from-transparent via-[var(--fin-brand)] to-transparent" />
      <div className="mb-3 flex items-center justify-between gap-3 px-1">
        <div>
          <p className="font-mono text-[10px] font-semibold uppercase tracking-[0.16em] text-[var(--fin-text-secondary)]">
            {eyebrow}
          </p>
          <p className="mt-1 text-[13px] font-semibold text-[var(--fin-text-primary)]">{title}</p>
        </div>
        <div className="flex gap-1.5">
          <span className="size-2 rounded-full bg-[var(--fin-border)]" />
          <span className="size-2 rounded-full bg-[var(--fin-border)]" />
          <span className="size-2 rounded-full bg-[var(--fin-brand)]" />
        </div>
      </div>
      {children}
    </div>
  )
}

export function FinCommandCenterScreen() {
  return (
    <ScreenFrame title="Treasury command" eyebrow="Desktop screen" className="lg:col-span-2">
      <div className="grid gap-3 rounded-[20px] border border-[var(--fin-border)] bg-[var(--fin-bg)] p-3 md:grid-cols-[minmax(0,1fr)_300px]">
        <div className="space-y-4">
          <div className="relative overflow-hidden rounded-[16px] border border-[var(--fin-border)] bg-[var(--fin-surface)] p-4">
            <div className="flex flex-wrap items-start justify-between gap-4">
              <div>
                <p className="text-[12px] text-[var(--fin-text-secondary)]">Total operating cash</p>
                <p className="mt-2 font-mono text-[30px] font-semibold leading-none text-[var(--fin-text-primary)] tabular-nums md:text-[34px]">
                  $482,490.24
                </p>
              </div>
              <FinBadge tone="safe">Protected</FinBadge>
            </div>
            <div className="mt-4 grid gap-px overflow-hidden rounded-[10px] border border-[var(--fin-border)] bg-[var(--fin-border)] sm:grid-cols-3">
              {[
                ["Inflow", "+$42.8k"],
                ["Outflow", "$18.2k"],
                ["Runway", "11.4 mo"],
              ].map(([label, value]) => (
                <div key={label} className="bg-[var(--fin-muted)] p-3">
                  <p className="text-[11px] text-[var(--fin-text-secondary)]">{label}</p>
                  <p className="mt-1 font-mono text-[15px] font-semibold text-[var(--fin-text-primary)] tabular-nums">{value}</p>
                </div>
              ))}
            </div>
          </div>
          <FinMiniChart />
        </div>
        <div className="space-y-3">
          <FinSurface className="p-4">
            <div className="flex items-start justify-between gap-3">
              <div>
                <p className="text-[13px] font-semibold text-[var(--fin-text-primary)]">Wire approval needed</p>
                <p className="mt-1 text-[12px] text-[var(--fin-text-secondary)]">Review queue</p>
              </div>
              <FinBadge tone="warning">1 item</FinBadge>
            </div>
            <p className="mt-4 text-[12px] leading-5 text-[var(--fin-text-secondary)]">
              $24,000 to Northstar Payroll requires one more approver.
            </p>
            <div className="mt-4 flex flex-wrap gap-2">
              <FinButton size="sm">Approve</FinButton>
              <FinButton variant="secondary" size="sm">Inspect</FinButton>
            </div>
          </FinSurface>
          <FinTransactionList />
        </div>
      </div>
    </ScreenFrame>
  )
}

export function FinPaymentReviewScreen() {
  return (
    <ScreenFrame title="Payment review" eyebrow="Risk screen">
      <div className="rounded-[20px] border border-[var(--fin-border)] bg-[var(--fin-bg)] p-4">
        <div className="flex items-start justify-between gap-4">
          <div>
            <p className="text-[12px] text-[var(--fin-text-secondary)]">Send amount</p>
            <p className="mt-1 font-mono text-[30px] font-bold leading-none text-[var(--fin-text-primary)]">$24,000.00</p>
          </div>
          <FinBadge tone="risk">New recipient</FinBadge>
        </div>
        <div className="my-5 h-px bg-[var(--fin-border)]" />
        <div className="space-y-3">
          {[
            ["Recipient", "Northstar Payroll"],
            ["Rail", "Same-day wire"],
            ["Arrival", "Today before 5:00 PM"],
            ["Fee", "$18.00"],
          ].map(([label, value]) => (
            <div key={label} className="flex items-center justify-between gap-4 text-[13px]">
              <span className="text-[var(--fin-text-secondary)]">{label}</span>
              <span className="font-semibold text-[var(--fin-text-primary)]">{value}</span>
            </div>
          ))}
        </div>
        <div className="mt-5 rounded-xl border border-[var(--fin-risk-border)] bg-[var(--fin-risk-soft)] p-3">
          <p className="text-[12px] font-semibold text-[var(--fin-risk)]">This transfer cannot be recalled after submission.</p>
        </div>
        <div className="mt-3 rounded-xl border border-[var(--fin-brand-border)] bg-[var(--fin-brand-soft)] p-3">
          <p className="text-[12px] font-semibold text-[var(--fin-text-primary)]">Biometric approval is required before money leaves the account.</p>
        </div>
        <div className="mt-5 flex gap-2">
          <FinButton className="flex-1">Confirm</FinButton>
          <FinButton variant="secondary" className="flex-1">Save draft</FinButton>
        </div>
      </div>
    </ScreenFrame>
  )
}

export function FinMobileWalletScreen() {
  return (
    <ScreenFrame title="Wallet mobile" eyebrow="Mobile screen">
      <div className="mx-auto max-w-[320px] rounded-[34px] border border-[var(--fin-border)] bg-[#050806] p-3 text-white shadow-[0_24px_70px_rgba(0,0,0,0.34)]">
        <div className="rounded-[28px] bg-[radial-gradient(circle_at_18%_8%,rgba(255,255,255,0.28),transparent_28%),linear-gradient(135deg,#00e676,#00c853_52%,#00a845)] p-5 text-black">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-[13px] font-medium text-black/62">Wallet balance</p>
              <p className="mt-2 text-[42px] font-semibold leading-[0.96] tracking-normal text-black tabular-nums">$8,420</p>
            </div>
            <div className="grid size-10 place-items-center rounded-full bg-black text-[var(--fin-brand)]">
              <IconWallet size={18} />
            </div>
          </div>
          <div className="mt-6 grid grid-cols-3 gap-2">
            {([
              ["Add", IconArrowDownLeft],
              ["Send", IconArrowUpRight],
              ["Cards", IconCards],
            ] as [string, typeof IconWallet][]).map(([item, Icon]) => (
              <button
                key={item}
                type="button"
                className="flex h-14 flex-col items-center justify-center gap-1 rounded-[18px] bg-black/10 text-[12px] font-semibold text-black backdrop-blur"
              >
                <Icon size={17} />
                {item}
              </button>
            ))}
          </div>
        </div>
        <div className="mt-4 rounded-[24px] bg-white p-3 text-black">
          <div className="mb-2 flex items-center justify-between px-1">
            <p className="text-[13px] font-bold">Activity</p>
            <p className="text-[11px] font-semibold text-black/45">Live</p>
          </div>
          <div className="space-y-2">
            {[
              ["Apple Services", "-$12.99"],
              ["Salary credit", "+$4,820"],
              ["Card ending 1048", "-$86.20"],
            ].map(([name, amount]) => (
              <div key={name} className="flex items-center justify-between rounded-[16px] bg-black/[0.04] px-3 py-3">
                <span className="text-[12px] font-medium text-black/78">{name}</span>
                <span className="text-[12px] font-semibold text-black tabular-nums">{amount}</span>
              </div>
            ))}
          </div>
        </div>
        <div className="mt-3">
          <FinMobileNav />
        </div>
      </div>
    </ScreenFrame>
  )
}

export function FinExampleScreens() {
  return (
    <div className="grid gap-4 lg:grid-cols-2">
      <FinCommandCenterScreen />
      <FinPaymentReviewScreen />
      <FinMobileWalletScreen />
    </div>
  )
}

export function FinResponsiveDashboard() {
  return (
    <div className="grid gap-4 lg:grid-cols-[260px_1fr]">
      <FinSidebar
        items={[
          { label: "Dashboard", value: "Live" },
          { label: "Payments", value: "12" },
          { label: "Cards" },
          { label: "Insights" },
          { label: "Security" },
        ]}
      />
      <div className="grid gap-4">
        <FinTopNav />
        <div className="grid gap-4 xl:grid-cols-[1.2fr_0.8fr]">
          <div className="grid gap-4">
            <div className="grid gap-4 md:grid-cols-3">
              <FinKpiCard label="Operating balance" value="$482,490" description="Available now" tone="profit" trend="+12%" />
              <FinKpiCard label="Scheduled outflow" value="$88,210" description="Next 7 days" tone="expense" trend="6 items" />
              <FinKpiCard label="Risk flags" value="3" description="Needs review" tone="risk" trend="High" />
            </div>
            <FinMiniChart />
          </div>
          <div className="grid gap-4">
            <FinCreditCardPreview />
            <FinMobileNav />
          </div>
        </div>
      </div>
    </div>
  )
}
