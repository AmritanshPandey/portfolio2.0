import type { Metadata } from "next"
import {
  IconArrowUpRight,
  IconCalendarDue,
  IconChartLine,
  IconCheck,
  IconCircle,
  IconClockHour4,
  IconRoute,
  IconTargetArrow,
} from "@tabler/icons-react"

export const metadata: Metadata = {
  title: "PlanR Personal Execution System",
  description:
    "A portfolio exploration of PlanR, a goal-oriented planning app built with Firebase, Claude Code, and Codex to connect planning, execution, and progress tracking.",
}

const originNotes = [
  {
    title: "The problem was personal",
    body: "I kept seeing the same gap in my own workflow. I could define the goal, but the plan would get messy once real life interrupted it. The missing piece was not another task list. It was a system that could keep the goal, the next action, and the review loop connected.",
  },
  {
    title: "Existing tools felt split",
    body: "Calendar apps handled time. Task apps handled lists. Notes apps held thinking. None of them gave me a clean way to move from a long-term goal to a weekly execution plan, then back into review without rebuilding context.",
  },
  {
    title: "I wanted a product I would actually use",
    body: "PlanR started as a practical tool for myself. The bar was simple: if I would not open it on a busy day, the design was too heavy. That pushed the product toward short loops, clear states, and fast capture.",
  },
]

const principles = [
  {
    title: "Goals need a path",
    body: "Most planning tools store intent. PlanR turns the intent into milestones, tasks, and a weekly operating plan.",
  },
  {
    title: "Progress should be visible",
    body: "The system keeps the next action, current streak, and blocked work close to the goal instead of hiding them in separate views.",
  },
  {
    title: "Planning has to survive real life",
    body: "Missed tasks roll forward cleanly. The plan adapts without making the user rebuild the whole week.",
  },
]

const flows = [
  "Capture the goal",
  "Break it into milestones",
  "Plan the week",
  "Track execution",
  "Review and adjust",
]

const metrics = [
  { value: "Live", label: "Firebase product build" },
  { value: "5", label: "Core workflow stages" },
  { value: "Fast", label: "Release and feedback loop" },
]

const iterations = [
  {
    phase: "01",
    title: "Task list",
    body: "The first version was too close to a normal checklist. It helped capture work, but it did not explain why the work mattered or how it connected to the larger goal.",
  },
  {
    phase: "02",
    title: "Goal planner",
    body: "The next version moved goals to the center. That made the product clearer, but it still needed a stronger weekly rhythm so users could decide what to do next.",
  },
  {
    phase: "03",
    title: "Execution loop",
    body: "The current direction connects goals, milestones, tasks, progress, and review. The product became less about storing plans and more about helping people keep promises to themselves.",
  },
  {
    phase: "04",
    title: "Live feedback",
    body: "After releasing early builds, I used feedback to simplify flows, tighten the mobile experience, and remove anything that made planning feel like extra work.",
  },
]

const buildStack = [
  {
    title: "Firebase backend",
    body: "Firebase let me move quickly without spending weeks on backend setup. I used it to handle the product foundation, including persistence, deployment, and the data model behind goals, tasks, progress, and reviews.",
  },
  {
    title: "Claude Code for backend complexity",
    body: "Claude Code helped me work through complex backend flows, especially where planning logic touched data structure. Rolling tasks forward, syncing progress, and keeping goal state predictable needed careful implementation.",
  },
  {
    title: "Codex for implementation passes",
    body: "I used Codex to tighten React components, debug edge cases, refactor repeated UI patterns, and keep the product moving without getting stuck in small implementation loops.",
  },
  {
    title: "Fast release cycle",
    body: "Instead of waiting for a polished launch, I shipped early versions and watched where users hesitated. The feedback helped me decide what to simplify, what to rename, and which flows needed stronger defaults.",
  },
]

const buildNotes = [
  "Designed as a portrait-first product, not a generic desktop dashboard.",
  "Uses a neutral interface so planning data stays readable for daily use.",
  "Connects goals, tasks, blockers, and review in one loop.",
  "Keeps the interaction model simple enough for repeated weekly use.",
]

const sectionNav = [
  { id: "why", label: "Why I built it" },
  { id: "system", label: "Product model" },
  { id: "iterations", label: "Iterations" },
  { id: "design", label: "Design decisions" },
  { id: "build", label: "Build process" },
  { id: "screens", label: "Screens" },
  { id: "shipped", label: "What shipped" },
]

function PlanrSectionHeader({
  id,
  label,
  title,
  description,
}: {
  id: string
  label: string
  title: string
  description: string
}) {
  return (
    <div id={id} className="scroll-mt-28">
      <p className="type-meta mb-3 text-foreground/42">{label}</p>
      <h2 className="type-section-title max-w-3xl text-foreground">{title}</h2>
      <p className="type-section-intro mt-5 max-w-[68ch] text-muted-foreground">{description}</p>
    </div>
  )
}

export default function Page() {
  return (
    <main className="min-h-screen bg-background text-foreground">
      <section className="relative overflow-hidden border-b border-border/60">
        <div className="absolute inset-0 bg-[linear-gradient(to_bottom,var(--background),transparent_42%,var(--background))]" />
        <div className="relative mx-auto grid max-w-6xl gap-10 px-5 pb-20 pt-28 md:grid-cols-[minmax(0,1fr)_420px] md:px-6 md:pb-24 md:pt-32">
          <div className="flex max-w-3xl flex-col justify-center">
            {/* Standardised breadcrumb kicker */}
            <nav className="mb-6 flex flex-wrap items-center gap-3 text-[11px] font-medium uppercase tracking-[0.2em] text-muted-foreground">
              <span>Exploration</span>
              <span className="h-1 w-1 rounded-full bg-accent/60" />
              <span className="text-accent">Personal Tool</span>
              <span className="h-1 w-1 rounded-full bg-border" />
              <span>Self-built · Live</span>
            </nav>
            <div className="mb-6 flex flex-wrap items-center gap-3">
              <PlanrMark />
              <span className="type-meta rounded-full border border-border/70 bg-card px-3 py-1 text-foreground/58">
                Live exploration
              </span>
            </div>

            <h1 className="type-page-title max-w-3xl text-foreground">
              PlanR: a personal execution system for goals that need follow-through
            </h1>

            <p className="type-section-intro mt-6 max-w-[64ch] text-muted-foreground">
              PlanR is a goal-oriented planning app with integrated progress tracking.
              I built it to solve a practical problem I kept running into: goals are
              easy to write down, but hard to keep connected to the work that has to
              happen this week.
            </p>

            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <a
                href="https://planr-75429.web.app/"
                target="_blank"
                rel="noreferrer"
                className="type-cta inline-flex min-h-11 items-center justify-center gap-2 rounded-lg bg-foreground px-5 text-background transition-colors duration-500 hover:bg-foreground/82 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent/45 focus-visible:ring-offset-2 focus-visible:ring-offset-background"
              >
                Open live app
                <IconArrowUpRight size={16} stroke={2} />
              </a>
              <a
                href="#system"
                className="type-cta inline-flex min-h-11 items-center justify-center rounded-lg border border-border bg-card px-5 text-foreground/72 transition-colors duration-500 hover:bg-muted hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent/45 focus-visible:ring-offset-2 focus-visible:ring-offset-background"
              >
                View system model
              </a>
            </div>
          </div>

          <div className="md:justify-self-end">
            <PhoneFrame>
              <TodayScreen />
            </PhoneFrame>
          </div>
        </div>
      </section>

      <section className="border-b border-border/60 bg-[oklch(0.945_0_0)] dark:bg-[oklch(0.105_0_0)]">
        <div className="mx-auto max-w-6xl px-5 py-16 md:px-6 md:py-20">
          <div className="grid gap-3 sm:grid-cols-3">
            {metrics.map((item) => (
              <div key={item.label} className="rounded-2xl border border-border/60 bg-card p-5">
                <p className="text-[30px] font-semibold leading-none tracking-[-0.02em] tabular-nums text-foreground">
                  {item.value}
                </p>
                <p className="mt-2 text-[11px] font-semibold uppercase tracking-[0.14em] text-muted-foreground">{item.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <div className="border-b border-border/60">
        <div className="mx-auto grid max-w-6xl gap-10 px-5 py-14 md:px-6 md:py-20 lg:grid-cols-[190px_1fr]">
          <aside className="hidden lg:block">
            <nav className="sticky top-28 space-y-1 border-l border-border pl-4" aria-label="PlanR page sections">
              <p className="type-meta mb-4 text-foreground/42">On this page</p>
              {sectionNav.map((item) => (
                <a
                  key={item.id}
                  href={`#${item.id}`}
                  className="block rounded-md px-2 py-2 text-[13px] font-medium text-muted-foreground transition-colors duration-500 hover:bg-muted hover:text-foreground"
                >
                  {item.label}
                </a>
              ))}
            </nav>
          </aside>

          <div className="space-y-20">
            <nav className="flex gap-2 overflow-x-auto pb-2 lg:hidden" aria-label="PlanR page sections">
              {sectionNav.map((item) => (
                <a
                  key={item.id}
                  href={`#${item.id}`}
                  className="type-cta shrink-0 rounded-full border border-border bg-card px-3 py-2 text-foreground/62"
                >
                  {item.label}
                </a>
              ))}
            </nav>

            <section className="space-y-8">
              <PlanrSectionHeader
                id="why"
                label="Why I built it"
                title="A planning system for the messy middle"
                description="PlanR came from the space between ambition and follow-through. I did not want another place to store tasks. I wanted a product that could help turn a goal into a small set of decisions I could act on, review, and adjust without losing the thread."
              />
              <div className="grid gap-px overflow-hidden rounded-2xl border border-border/60 bg-border/60 md:grid-cols-3">
                {originNotes.map((item) => (
                  <div key={item.title} className="bg-card p-6 md:p-7">
                    <h3 className="type-card-title text-foreground">{item.title}</h3>
                    <p className="type-card-body mt-3 text-foreground/58">{item.body}</p>
                  </div>
                ))}
              </div>
            </section>

            <section className="grid gap-8 lg:grid-cols-[0.85fr_1.15fr]">
              <PlanrSectionHeader
                id="system"
                label="Product model"
                title="A loop for turning intention into execution"
                description="The product is built around a weekly loop. The user starts with a goal, breaks it into clear work, schedules the next set of actions, then reviews what moved and what got stuck."
              />
              <div className="rounded-2xl border border-border/65 bg-card p-5 md:p-6">
                <div className="space-y-3">
                  {flows.map((flow, index) => (
                    <div key={flow} className="flex items-center gap-4 rounded-xl border border-border/55 bg-background px-4 py-3">
                      <span className="grid size-8 shrink-0 place-items-center rounded-lg bg-muted font-mono text-[12px] font-semibold text-foreground/58">
                        {String(index + 1).padStart(2, "0")}
                      </span>
                      <p className="type-list-title flex-1 text-foreground">{flow}</p>
                      {index < flows.length - 1 ? (
                        <IconRoute size={17} stroke={1.8} className="text-foreground/28" />
                      ) : (
                        <IconCheck size={17} stroke={2} className="text-emerald-500" />
                      )}
                    </div>
                  ))}
                </div>
              </div>
            </section>

            <section className="grid gap-8 lg:grid-cols-[0.8fr_1.2fr]">
              <PlanrSectionHeader
                id="iterations"
                label="Iterations"
                title="The product changed shape several times"
                description="The early versions were useful but not sharp enough. Each iteration forced one question: does this make it easier to act, or is it only making the planning system look more complete?"
              />
              <div className="rounded-2xl border border-border/65 bg-card p-5 md:p-6">
                <div className="space-y-4">
                  {iterations.map((item) => (
                    <div key={item.phase} className="grid gap-3 rounded-xl border border-border/55 bg-background p-4 sm:grid-cols-[52px_1fr]">
                      <span className="font-mono text-[13px] font-semibold leading-6 text-foreground/42">
                        {item.phase}
                      </span>
                      <div>
                        <h3 className="type-card-title text-foreground">{item.title}</h3>
                        <p className="type-card-body mt-2 text-foreground/58">{item.body}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </section>

            <section className="space-y-8">
              <PlanrSectionHeader
                id="design"
                label="Design decisions"
                title="Keep it calm enough to use daily"
                description="This is not a productivity toy. The interface needs to feel quiet, structured, and fast to scan because the user comes back when they are already trying to make decisions."
              />
              <div className="grid gap-px overflow-hidden rounded-2xl border border-border/60 bg-border/60 md:grid-cols-3">
                {principles.map((item) => (
                  <div key={item.title} className="bg-card p-6 md:p-7">
                    <h3 className="type-card-title text-foreground">{item.title}</h3>
                    <p className="type-card-body mt-3 text-foreground/58">{item.body}</p>
                  </div>
                ))}
              </div>
            </section>

            <section className="space-y-8">
              <PlanrSectionHeader
                id="build"
                label="Build process"
                title="Using AI tools to ship faster without lowering the bar"
                description="PlanR became a good test for how I use AI in product work. I was not asking tools to invent the product. I used them to move through complex implementation work faster, then made the product decisions myself."
              />
              <div className="grid gap-4 md:grid-cols-2">
                {buildStack.map((item) => (
                  <div key={item.title} className="rounded-2xl border border-border/65 bg-card p-6 md:p-7">
                    <h3 className="type-card-title text-foreground">{item.title}</h3>
                    <p className="type-card-body mt-3 text-foreground/58">{item.body}</p>
                  </div>
                ))}
              </div>
            </section>

            <section className="space-y-8">
              <PlanrSectionHeader
                id="screens"
                label="Live product"
                title="The actual PlanR build, framed at iPhone 16 size"
                description="This is the deployed product, not a recreated mockup. The frame uses the iPhone 16 viewport size so the mobile-first decisions can be reviewed in the shape they were designed for."
              />
              <PlanrLiveFrame />
            </section>

            <section className="grid gap-8 lg:grid-cols-[0.9fr_1.1fr]">
              <PlanrSectionHeader
                id="shipped"
                label="What shipped"
                title="A working product surface, not only a concept"
                description="The live build establishes the product shell, visual language, portrait-first behavior, theme support, and the core planning direction."
              />
              <div className="grid gap-3">
                {buildNotes.map((note) => (
                  <div key={note} className="flex gap-3 rounded-xl border border-border/60 bg-card p-4">
                    <span className="mt-0.5 grid size-6 shrink-0 place-items-center rounded-full bg-foreground text-background">
                      <IconCheck size={14} stroke={2.2} />
                    </span>
                    <p className="type-card-body text-foreground/68">{note}</p>
                  </div>
                ))}
              </div>
            </section>
          </div>
        </div>
      </div>
    </main>
  )
}

function PlanrMark() {
  return (
    <div className="inline-flex items-center gap-3 rounded-full border border-border/70 bg-card px-3 py-2">
      <span className="flex h-5 w-4 flex-col justify-center gap-1">
        <span className="h-[3px] w-4 rounded-full bg-foreground" />
        <span className="h-[3px] w-3 rounded-full bg-foreground" />
        <span className="h-[3px] w-2 rounded-full bg-foreground" />
      </span>
      <span className="text-[15px] font-semibold leading-none tracking-normal text-foreground">planr.</span>
    </div>
  )
}

function PhoneFrame({ children }: { children: React.ReactNode }) {
  return (
    <div className="mx-auto w-full max-w-[360px] rounded-[32px] border border-foreground/12 bg-foreground p-3 shadow-[0_28px_90px_rgba(0,0,0,0.18)] dark:border-white/12 dark:bg-black">
      <div className="overflow-hidden rounded-[24px] bg-neutral-50 text-neutral-950 dark:bg-neutral-950 dark:text-white">
        {children}
      </div>
    </div>
  )
}

function PlanrLiveFrame() {
  return (
    <div className="rounded-2xl border border-border/65 bg-card p-4 md:p-6">
      <div className="mb-5 flex flex-wrap items-center justify-between gap-3">
        <div>
          <h3 className="type-card-title text-foreground">PlanR live app</h3>
          <p className="type-card-body mt-1 text-foreground/58"></p>
        </div>
        <a
          href="https://planr-75429.web.app/"
          target="_blank"
          rel="noreferrer"
          className="type-cta inline-flex min-h-10 items-center gap-2 rounded-lg border border-border bg-background px-3.5 text-foreground/68 transition-colors duration-500 hover:bg-muted hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent/45 focus-visible:ring-offset-2 focus-visible:ring-offset-background"
        >
          Open app
          <IconArrowUpRight size={15} stroke={2} />
        </a>
      </div>

      <div className="mx-auto w-full max-w-[421px] rounded-[46px] border border-foreground/14 bg-foreground p-3 shadow-[0_28px_90px_rgba(0,0,0,0.22)] dark:border-white/14 dark:bg-black">
        <div className="relative mx-auto aspect-[393/852] w-full max-w-[393px] overflow-hidden rounded-[34px] bg-neutral-950">
          <iframe
            title="PlanR live product"
            src="https://planr-75429.web.app/"
            className="h-full w-full border-0 bg-neutral-950"
            loading="lazy"
            sandbox="allow-scripts allow-same-origin allow-forms allow-popups allow-popups-to-escape-sandbox"
          />
        </div>
      </div>
    </div>
  )
}

function TodayScreen({ compact = false }: { compact?: boolean }) {
  return (
    <div className={compact ? "p-4" : "min-h-[620px] p-5"}>
      <div className="mb-6 flex items-center justify-between">
        <PlanrTinyMark />
        <span className="rounded-full bg-neutral-200 px-2.5 py-1 text-[11px] font-semibold text-neutral-600 dark:bg-white/10 dark:text-white/60">
          Week 24
        </span>
      </div>

      <p className="text-[12px] font-medium text-neutral-500 dark:text-white/45">Today</p>
      <h3 className="mt-1 text-[26px] font-bold leading-[1.1] tracking-normal text-neutral-950 dark:text-white">
        Move the plan forward
      </h3>

      <div className="mt-6 rounded-2xl bg-neutral-950 p-5 text-white dark:bg-white dark:text-neutral-950">
        <div className="flex items-center gap-3">
          <span className="grid size-10 place-items-center rounded-xl bg-white/12 text-white dark:bg-neutral-950/10 dark:text-neutral-950">
            <IconTargetArrow size={20} stroke={1.9} />
          </span>
          <div>
            <p className="text-[13px] font-semibold">Launch portfolio refresh</p>
            <p className="mt-0.5 text-[11px] text-white/55 dark:text-neutral-950/55">68 percent complete</p>
          </div>
        </div>
        <div className="mt-5 h-2 rounded-full bg-white/15 dark:bg-neutral-950/12">
          <div className="h-full w-[68%] rounded-full bg-white dark:bg-neutral-950" />
        </div>
      </div>

      <div className="mt-5 space-y-3">
        <TaskRow icon={<IconClockHour4 size={17} />} title="Write final case intro" meta="45 min" done />
        <TaskRow icon={<IconCalendarDue size={17} />} title="Review mobile layout" meta="Today" />
        <TaskRow icon={<IconChartLine size={17} />} title="Log progress and blockers" meta="Evening" />
      </div>
    </div>
  )
}

function TaskRow({
  icon,
  title,
  meta,
  done = false,
}: {
  icon: React.ReactNode
  title: string
  meta: string
  done?: boolean
}) {
  return (
    <div className="flex items-center gap-3 rounded-xl border border-neutral-200 bg-white p-3 dark:border-white/10 dark:bg-white/[0.04]">
      <span className="grid size-9 shrink-0 place-items-center rounded-lg bg-neutral-100 text-neutral-600 dark:bg-white/10 dark:text-white/62">
        {icon}
      </span>
      <div className="min-w-0 flex-1">
        <p className="truncate text-[13px] font-semibold text-neutral-950 dark:text-white">{title}</p>
        <p className="mt-0.5 text-[11px] text-neutral-500 dark:text-white/45">{meta}</p>
      </div>
      {done ? (
        <IconCheck size={17} stroke={2.2} className="text-emerald-500" />
      ) : (
        <IconCircle size={17} stroke={1.8} className="text-neutral-300 dark:text-white/20" />
      )}
    </div>
  )
}

function PlanrTinyMark() {
  return (
    <div className="flex items-center gap-2">
      <span className="flex h-4 w-3 flex-col justify-center gap-[3px]">
        <span className="h-[2px] w-3 rounded-full bg-neutral-950 dark:bg-white" />
        <span className="h-[2px] w-2 rounded-full bg-neutral-950 dark:bg-white" />
        <span className="h-[2px] w-1.5 rounded-full bg-neutral-950 dark:bg-white" />
      </span>
      <span className="text-[13px] font-bold leading-none tracking-normal text-neutral-950 dark:text-white">planr.</span>
    </div>
  )
}
