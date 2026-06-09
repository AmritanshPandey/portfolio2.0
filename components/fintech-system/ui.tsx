import type { ReactNode } from "react"
import {
  IconAlertTriangle,
  IconArrowDownLeft,
  IconArrowRight,
  IconArrowUpRight,
  IconBell,
  IconCards,
  IconCheck,
  IconChevronRight,
  IconCircleCheck,
  IconClock,
  IconCreditCard,
  IconDots,
  IconDownload,
  IconEye,
  IconFilter,
  IconFingerprint,
  IconGauge,
  IconInfoCircle,
  IconLayoutDashboard,
  IconLock,
  IconReceipt,
  IconSearch,
  IconSettings,
  IconShieldCheck,
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
}: {
  children: ReactNode
  className?: string
  as?: "div" | "section" | "article" | "aside"
}) {
  const Comp = as
  return (
    <Comp
      className={cn(
        "rounded-2xl border border-[var(--fin-border)] bg-[var(--fin-surface)] shadow-[var(--fin-shadow-flat)]",
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
    <FinSurface className="p-4">
      <div className="flex items-start justify-between gap-3">
        <p className="text-[11px] font-bold uppercase tracking-[0.12em] text-[var(--fin-text-secondary)]">{label}</p>
        {trend ? <FinBadge tone={tone}>{trend}</FinBadge> : null}
      </div>
      <p className="mt-3 font-mono text-[26px] font-bold leading-none tracking-normal text-[var(--fin-text-primary)] tabular-nums">
        {value}
      </p>
      <p className="mt-2 text-[12px] leading-5 text-[var(--fin-text-secondary)]">{description}</p>
    </FinSurface>
  )
}

export function FinCreditCardPreview() {
  return (
    <div className="rounded-[22px] border border-white/15 bg-[radial-gradient(circle_at_15%_12%,rgba(0,230,118,0.38),transparent_32%),linear-gradient(135deg,#050806,#101914_58%,#013f22)] p-5 text-white shadow-[0_18px_52px_rgba(0,0,0,0.34)]">
      <div className="flex items-start justify-between">
        <div>
          <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-white/60">Instant debit</p>
          <p className="mt-7 font-mono text-[18px] tracking-[0.18em]">4829  ••••  ••••  1048</p>
        </div>
        <div className="grid size-10 place-items-center rounded-full bg-[var(--fin-brand)] text-black">
          <IconCards size={20} />
        </div>
      </div>
      <div className="mt-6 flex items-end justify-between">
        <div>
          <p className="text-[10px] uppercase tracking-[0.16em] text-white/50">Cardholder</p>
          <p className="text-[13px] font-semibold">Avery Stone</p>
        </div>
        <div className="text-right">
          <p className="text-[10px] uppercase tracking-[0.16em] text-white/50">Limit</p>
          <p className="font-mono text-[13px] font-semibold">$8,000</p>
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
        <div>
          <p className="text-[14px] font-semibold text-[var(--fin-text-primary)]">Recent transactions</p>
          <p className="text-[12px] text-[var(--fin-text-secondary)]">Ledger activity across accounts</p>
        </div>
        <FinButton variant="ghost" size="sm">
          View all <IconArrowRight size={14} />
        </FinButton>
      </div>
      <div className="divide-y divide-[var(--fin-border)]">
        {rows.map(([name, date, amount, tone, status]) => (
          <div key={name} className="grid grid-cols-[1fr_auto] items-center gap-3 px-4 py-3 sm:grid-cols-[1fr_auto_auto]">
            <div className="min-w-0">
              <p className="truncate text-[13px] font-semibold text-[var(--fin-text-primary)]">{name}</p>
              <p className="text-[12px] text-[var(--fin-text-secondary)]">{date}</p>
            </div>
            <FinBadge tone={tone as FintechTone}>{status}</FinBadge>
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

export function FinMiniChart() {
  const bars = [42, 54, 39, 68, 73, 58, 82, 76, 91, 87, 95, 102]
  return (
    <FinSurface className="p-4">
      <div className="flex items-start justify-between gap-4">
        <div>
          <p className="text-[14px] font-semibold text-[var(--fin-text-primary)]">Cash flow forecast</p>
          <p className="text-[12px] text-[var(--fin-text-secondary)]">Projected runway over 12 weeks</p>
        </div>
        <FinBadge tone="profit">+18.4%</FinBadge>
      </div>
      <div className="mt-5 flex h-32 items-end gap-2 border-b border-[var(--fin-border)]">
        {bars.map((height, index) => (
          <div
            key={`${height}-${index}`}
            className="flex-1 rounded-t-[4px] bg-[linear-gradient(180deg,var(--fin-brand),var(--fin-brand-soft-strong))]"
            style={{ height: `${height}%` }}
            title={`Week ${index + 1}: ${height}%`}
          />
        ))}
      </div>
      <div className="mt-3 flex items-center justify-between text-[11px] text-[var(--fin-text-secondary)]">
        <span>Week 1</span>
        <span>Week 12</span>
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

export function FinCardMatrix() {
  return (
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
      <div className="grid gap-3 rounded-[20px] border border-[var(--fin-border)] bg-[var(--fin-bg)] p-4 md:grid-cols-[1fr_260px]">
        <div className="space-y-4">
          <div className="relative overflow-hidden rounded-[20px] border border-white/10 bg-[radial-gradient(circle_at_15%_18%,rgba(0,230,118,0.42),transparent_26%),linear-gradient(135deg,#050806,#0b120d_60%,#013f22)] p-5 text-white">
            <div className="flex flex-wrap items-start justify-between gap-4">
              <div>
                <p className="text-[12px] text-white/62">Total operating cash</p>
                <p className="mt-2 font-mono text-[38px] font-bold leading-none text-white tabular-nums">
                  $482,490.24
                </p>
              </div>
              <span className="inline-flex h-8 items-center rounded-full bg-[var(--fin-brand)] px-3 text-[12px] font-bold text-black">
                Protected
              </span>
            </div>
            <div className="mt-5 grid gap-2 sm:grid-cols-3">
              {[
                ["Inflow", "+$42.8k"],
                ["Outflow", "$18.2k"],
                ["Runway", "11.4 mo"],
              ].map(([label, value]) => (
                <div key={label} className="rounded-[14px] border border-white/10 bg-white/[0.06] p-3">
                  <p className="text-[11px] text-white/55">{label}</p>
                  <p className="mt-1 font-mono text-[17px] font-bold text-white tabular-nums">{value}</p>
                </div>
              ))}
            </div>
          </div>
          <div className="flex flex-wrap items-start justify-between gap-4">
            <div>
              <p className="text-[14px] font-semibold text-[var(--fin-text-primary)]">Cash flow forecast</p>
              <p className="mt-1 text-[12px] text-[var(--fin-text-secondary)]">Next 12 weeks of money movement</p>
            </div>
            <FinBadge tone="profit">+18.4%</FinBadge>
          </div>
          <FinMiniChart />
        </div>
        <div className="space-y-3">
          <FinSurface className="p-4">
            <FinBadge tone="warning">Review queue</FinBadge>
            <p className="mt-4 text-[13px] font-semibold text-[var(--fin-text-primary)]">Wire approval needed</p>
            <p className="mt-1 text-[12px] leading-5 text-[var(--fin-text-secondary)]">
              $24,000 to Northstar Payroll requires one more approver.
            </p>
            <div className="mt-4 flex gap-2">
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
