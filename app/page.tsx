"use client"

import { useMemo, useState } from "react"

/* ------------------------------------------------------------------ */
/*  Types & helpers                                                    */
/* ------------------------------------------------------------------ */

type Task = {
  id: string
  name: string
  minutes: number
  done: boolean
}

type Screen = "landing" | "plan" | "schedule"

const SUGGESTED: { name: string; minutes: number }[] = [
  { name: "Shower", minutes: 15 },
  { name: "Get dressed", minutes: 10 },
  { name: "Breakfast", minutes: 20 },
  { name: "Coffee", minutes: 5 },
  { name: "Skincare", minutes: 10 },
  { name: "Pack your bag", minutes: 5 },
  { name: "Tidy up", minutes: 5 },
]

const DEFAULT_TASKS: Task[] = [
  { id: "t1", name: "Shower", minutes: 15, done: false },
  { id: "t2", name: "Get dressed", minutes: 10, done: false },
  { id: "t3", name: "Breakfast", minutes: 20, done: false },
]

let idSeed = 100
const nextId = () => `t${idSeed++}`

/** Minutes-of-day (0–1439, wrapping) → "7:05 AM" */
function fmtTime(mins: number): string {
  const m = ((mins % 1440) + 1440) % 1440
  let h = Math.floor(m / 60)
  const mm = m % 60
  const period = h >= 12 ? "PM" : "AM"
  h = h % 12
  if (h === 0) h = 12
  return `${h}:${mm.toString().padStart(2, "0")} ${period}`
}

/** "09:00" → minutes of day */
function parseTime(value: string): number {
  const [h, m] = value.split(":").map(Number)
  return h * 60 + m
}

function fmtDuration(mins: number): string {
  if (mins < 60) return `${mins} min`
  const h = Math.floor(mins / 60)
  const m = mins % 60
  return m === 0 ? `${h} hr` : `${h} hr ${m} min`
}

/* ------------------------------------------------------------------ */
/*  Root                                                               */
/* ------------------------------------------------------------------ */

export default function App() {
  const [screen, setScreen] = useState<Screen>("landing")
  const [arrival, setArrival] = useState("09:00")
  const [commute, setCommute] = useState(25)
  const [tasks, setTasks] = useState<Task[]>(DEFAULT_TASKS)

  const totalTaskMinutes = useMemo(
    () => tasks.reduce((sum, t) => sum + t.minutes, 0),
    [tasks],
  )
  const arrivalMins = parseTime(arrival)
  const departureMins = arrivalMins - commute
  const startMins = departureMins - totalTaskMinutes
  const totalPrep = totalTaskMinutes + commute

  return (
    <div className="min-h-screen bg-background text-foreground font-sans">
      <Header screen={screen} onHome={() => setScreen("landing")} />

      {screen === "landing" && <Landing onStart={() => setScreen("plan")} />}

      {screen === "plan" && (
        <Plan
          arrival={arrival}
          setArrival={setArrival}
          commute={commute}
          setCommute={setCommute}
          tasks={tasks}
          setTasks={setTasks}
          totalTaskMinutes={totalTaskMinutes}
          totalPrep={totalPrep}
          startMins={startMins}
          onDone={() => setScreen("schedule")}
        />
      )}

      {screen === "schedule" && (
        <Schedule
          tasks={tasks}
          setTasks={setTasks}
          startMins={startMins}
          departureMins={departureMins}
          arrivalMins={arrivalMins}
          commute={commute}
          totalPrep={totalPrep}
          onEdit={() => setScreen("plan")}
        />
      )}

      <footer className="mx-auto max-w-6xl px-6 pb-10 pt-16 text-xs text-muted font-mono">
        Morning Map — plan backward from where you need to be.
      </footer>
    </div>
  )
}

/* ------------------------------------------------------------------ */
/*  Header                                                             */
/* ------------------------------------------------------------------ */

function Header({ screen, onHome }: { screen: Screen; onHome: () => void }) {
  return (
    <header className="sticky top-0 z-20 border-b border-border/70 bg-background/85 backdrop-blur-sm">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4">
        <button
          onClick={onHome}
          className="group flex items-center gap-2.5 text-left"
          aria-label="Go to Morning Map home"
        >
          <SunMark />
          <span className="font-display text-lg font-semibold tracking-tight">
            Morning Map
          </span>
        </button>
        {screen !== "landing" && (
          <button
            onClick={onHome}
            className="text-xs font-medium uppercase tracking-[0.14em] text-muted transition-colors hover:text-teal"
          >
            Home
          </button>
        )}
      </div>
    </header>
  )
}

function SunMark() {
  return (
    <span className="grid size-8 place-items-center rounded-full bg-teal/12 transition-colors group-hover:bg-teal/20">
      <svg width="17" height="17" viewBox="0 0 24 24" fill="none" aria-hidden>
        <circle cx="12" cy="12" r="4.2" fill="#537791" />
        {Array.from({ length: 8 }).map((_, i) => {
          const a = (i * Math.PI) / 4
          const x1 = 12 + Math.cos(a) * 7
          const y1 = 12 + Math.sin(a) * 7
          const x2 = 12 + Math.cos(a) * 9.4
          const y2 = 12 + Math.sin(a) * 9.4
          return (
            <line
              key={i}
              x1={x1}
              y1={y1}
              x2={x2}
              y2={y2}
              stroke="#537791"
              strokeWidth="1.6"
              strokeLinecap="round"
            />
          )
        })}
      </svg>
    </span>
  )
}

/* ------------------------------------------------------------------ */
/*  Screen 1 — Landing                                                 */
/* ------------------------------------------------------------------ */

function Landing({ onStart }: { onStart: () => void }) {
  return (
    <main className="mx-auto max-w-6xl px-6">
      <section className="grid items-center gap-12 py-16 lg:grid-cols-[1.05fr_0.95fr] lg:gap-16 lg:py-24">
        <div>
          <h1 className="max-w-xl font-display text-4xl font-semibold leading-[1.02] tracking-tight sm:text-5xl lg:text-6xl">
            Take control of your{" "}
            <em className="text-teal not-italic">morning.</em>
          </h1>
          <p className="mt-6 max-w-sm text-[15px] leading-relaxed text-muted">
            Turn your arrival time into a morning plan.
          </p>
          <button
            onClick={onStart}
            className="mt-9 inline-flex items-center gap-2 rounded-full bg-teal px-7 py-3.5 text-[15px] font-medium text-cream shadow-sm transition-all hover:bg-teal-deep hover:shadow-md focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-teal"
          >
            Plan my morning
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" aria-hidden>
              <path
                d="M5 12h14M13 6l6 6-6 6"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </button>
        </div>

        <ExampleSchedule />
      </section>
    </main>
  )
}

function ExampleSchedule() {
  const rows = [
    {
      label: "Getting ready",
      time: "7:30 AM",
      note: "45 min",
      icon: (
        <svg width="17" height="17" viewBox="0 0 24 24" fill="none" aria-hidden>
          <path d="M12 3v3M6 21V10a6 6 0 0112 0v11" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      ),
    },
    {
      label: "Breakfast",
      time: "8:15 AM",
      note: "20 min",
      icon: (
        <svg width="17" height="17" viewBox="0 0 24 24" fill="none" aria-hidden>
          <path d="M6 3v7a2 2 0 002 2h0a2 2 0 002-2V3M8 12v9M17 3c-1.5 1-2 3-2 5s.5 4 2 5v8" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      ),
    },
    {
      label: "Leave home",
      time: "8:35 AM",
      note: "25 min ride",
      icon: (
        <svg width="17" height="17" viewBox="0 0 24 24" fill="none" aria-hidden>
          <path d="M3 12h13M11 7l5 5-5 5M20 5v14" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      ),
    },
    {
      label: "Arrive",
      time: "9:00 AM",
      note: "on time",
      icon: (
        <svg width="17" height="17" viewBox="0 0 24 24" fill="none" aria-hidden>
          <path d="M5 12l5 5 9-11" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      ),
    },
  ]
  return (
    <div className="relative rounded-3xl border border-border bg-card p-7 shadow-[0_18px_50px_-24px_rgba(45,54,64,0.35)] sm:p-9">
      <div className="mb-6 flex items-baseline justify-between">
        <span className="font-mono text-[11px] uppercase tracking-[0.16em] text-muted">
          A typical morning
        </span>
        <span className="font-display text-sm text-teal">Start 7:30</span>
      </div>
      <ol className="relative">
        <span className="absolute bottom-3 left-[19px] top-3 w-px bg-border" />
        {rows.map((r, i) => (
          <li key={r.label} className="relative flex items-center gap-4 py-3">
            <span
              className={`z-10 grid size-10 place-items-center rounded-full ${
                i === rows.length - 1
                  ? "bg-teal text-cream"
                  : "border border-border bg-sand text-ink/70"
              }`}
            >
              {r.icon}
            </span>
            <div className="flex flex-1 items-baseline justify-between border-b border-dashed border-border/70 pb-2">
              <div>
                <p className="text-[15px] font-medium leading-tight">{r.label}</p>
                <p className="text-xs text-muted">{r.note}</p>
              </div>
              <span className="font-mono text-sm text-ink/80">{r.time}</span>
            </div>
          </li>
        ))}
      </ol>
    </div>
  )
}

/* ------------------------------------------------------------------ */
/*  Screen 2 — Plan (walkthrough + live preview)                       */
/* ------------------------------------------------------------------ */

type PlanProps = {
  arrival: string
  setArrival: (v: string) => void
  commute: number
  setCommute: (v: number) => void
  tasks: Task[]
  setTasks: React.Dispatch<React.SetStateAction<Task[]>>
  totalTaskMinutes: number
  totalPrep: number
  startMins: number
  onDone: () => void
}

const STEPS = ["Arrival", "Commute", "Routine"] as const

function Plan(props: PlanProps) {
  const { arrival, setArrival, commute, setCommute, tasks, setTasks } = props
  const [step, setStep] = useState(0)

  return (
    <main className="mx-auto max-w-6xl px-6 py-10 lg:py-14">
      <div className="grid gap-10 lg:grid-cols-[1.35fr_1fr] lg:gap-14">
        {/* Walkthrough */}
        <div>
          <div className="mb-8 flex items-center gap-3">
            {STEPS.map((s, i) => (
              <button
                key={s}
                onClick={() => setStep(i)}
                className="flex items-center gap-2"
              >
                <span
                  className={`grid size-6 place-items-center rounded-full font-mono text-xs transition-colors ${
                    i === step
                      ? "bg-teal text-cream"
                      : i < step
                        ? "bg-teal/15 text-teal"
                        : "border border-border text-muted"
                  }`}
                >
                  {i + 1}
                </span>
                <span
                  className={`text-xs font-medium uppercase tracking-[0.12em] ${
                    i === step ? "text-foreground" : "text-muted"
                  }`}
                >
                  {s}
                </span>
                {i < STEPS.length - 1 && (
                  <span className="ml-1 h-px w-6 bg-border" />
                )}
              </button>
            ))}
          </div>

          {step === 0 && (
            <StepArrival arrival={arrival} setArrival={setArrival} />
          )}
          {step === 1 && (
            <StepCommute commute={commute} setCommute={setCommute} />
          )}
          {step === 2 && <StepTasks tasks={tasks} setTasks={setTasks} />}

          <div className="mt-10 flex items-center gap-3">
            {step > 0 && (
              <button
                onClick={() => setStep((s) => s - 1)}
                className="rounded-full border border-border px-5 py-2.5 text-sm font-medium text-ink/80 transition-colors hover:border-taupe hover:bg-sand"
              >
                Back
              </button>
            )}
            {step < STEPS.length - 1 ? (
              <button
                onClick={() => setStep((s) => s + 1)}
                className="rounded-full bg-teal px-6 py-2.5 text-sm font-medium text-cream transition-colors hover:bg-teal-deep"
              >
                Continue
              </button>
            ) : (
              <button
                onClick={props.onDone}
                className="rounded-full bg-teal px-6 py-2.5 text-sm font-medium text-cream transition-colors hover:bg-teal-deep"
              >
                See my morning →
              </button>
            )}
          </div>
        </div>

        {/* Live preview */}
        <LivePreview {...props} />
      </div>
    </main>
  )
}

function StepHeading({ kicker, title, hint }: { kicker: string; title: string; hint: string }) {
  return (
    <header className="mb-7">
      <p className="mb-2 font-mono text-xs uppercase tracking-[0.18em] text-teal">
        {kicker}
      </p>
      <h2 className="font-display text-3xl font-semibold leading-tight sm:text-4xl">
        {title}
      </h2>
      <p className="mt-3 max-w-md text-[15px] leading-relaxed text-muted">
        {hint}
      </p>
    </header>
  )
}

function StepArrival({ arrival, setArrival }: { arrival: string; setArrival: (v: string) => void }) {
  return (
    <div>
      <StepHeading
        kicker="Step one"
        title="When do you need to arrive?"
        hint="Your class, shift, or meeting time. Everything else is calculated backward from here."
      />
      <div className="inline-flex items-center gap-4 rounded-2xl border border-border bg-card px-6 py-5">
        <input
          type="time"
          value={arrival}
          onChange={(e) => setArrival(e.target.value)}
          className="bg-transparent font-display text-4xl font-semibold tracking-tight text-foreground outline-none [color-scheme:light]"
        />
      </div>
      <div className="mt-5 flex flex-wrap gap-2">
        {["08:00", "08:30", "09:00", "10:15"].map((t) => (
          <button
            key={t}
            onClick={() => setArrival(t)}
            className={`rounded-full border px-4 py-1.5 font-mono text-xs transition-colors ${
              arrival === t
                ? "border-teal bg-teal/10 text-teal"
                : "border-border text-muted hover:border-taupe"
            }`}
          >
            {fmtTime(parseTime(t))}
          </button>
        ))}
      </div>
    </div>
  )
}

function StepCommute({ commute, setCommute }: { commute: number; setCommute: (v: number) => void }) {
  return (
    <div>
      <StepHeading
        kicker="Step two"
        title="How long is your commute?"
        hint="Walking, bus, bike, or drive — your best estimate of door to destination."
      />
      <div className="rounded-2xl border border-border bg-card px-6 py-6">
        <div className="flex items-baseline gap-2">
          <span className="font-display text-5xl font-semibold tabular-nums">
            {commute}
          </span>
          <span className="text-sm text-muted">minutes</span>
        </div>
        <input
          type="range"
          min={0}
          max={90}
          step={5}
          value={commute}
          onChange={(e) => setCommute(Number(e.target.value))}
          className="mt-5 w-full accent-teal"
        />
        <div className="mt-1 flex justify-between font-mono text-[11px] text-muted">
          <span>0</span>
          <span>45</span>
          <span>90 min</span>
        </div>
      </div>
    </div>
  )
}

function StepTasks({
  tasks,
  setTasks,
}: {
  tasks: Task[]
  setTasks: React.Dispatch<React.SetStateAction<Task[]>>
}) {
  const [custom, setCustom] = useState("")
  const chosen = new Set(tasks.map((t) => t.name.toLowerCase()))

  const addTask = (name: string, minutes: number) => {
    if (!name.trim()) return
    setTasks((prev) => [
      ...prev,
      { id: nextId(), name: name.trim(), minutes, done: false },
    ])
  }
  const removeTask = (id: string) =>
    setTasks((prev) => prev.filter((t) => t.id !== id))
  const setMinutes = (id: string, minutes: number) =>
    setTasks((prev) =>
      prev.map((t) => (t.id === id ? { ...t, minutes: Math.max(1, minutes) } : t)),
    )

  return (
    <div>
      <StepHeading
        kicker="Step three"
        title="What's your morning routine?"
        hint="Add the things you actually do — including breakfast. Nudge the minutes to match your real pace."
      />

      {/* Chosen tasks */}
      <ul className="space-y-2.5">
        {tasks.map((t) => (
          <li
            key={t.id}
            className="flex items-center gap-3 rounded-xl border border-border bg-card px-4 py-3"
          >
            <span className="flex-1 text-[15px] font-medium">{t.name}</span>
            <div className="flex items-center gap-1.5 rounded-full border border-border bg-sand/60 px-1">
              <button
                onClick={() => setMinutes(t.id, t.minutes - 5)}
                className="grid size-7 place-items-center rounded-full text-muted transition-colors hover:bg-sand hover:text-foreground"
                aria-label={`Decrease ${t.name} time`}
              >
                –
              </button>
              <span className="w-14 text-center font-mono text-xs text-ink/80">
                {t.minutes} min
              </span>
              <button
                onClick={() => setMinutes(t.id, t.minutes + 5)}
                className="grid size-7 place-items-center rounded-full text-muted transition-colors hover:bg-sand hover:text-foreground"
                aria-label={`Increase ${t.name} time`}
              >
                +
              </button>
            </div>
            <button
              onClick={() => removeTask(t.id)}
              className="grid size-7 place-items-center rounded-full text-muted transition-colors hover:bg-sand hover:text-foreground"
              aria-label={`Remove ${t.name}`}
            >
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" aria-hidden>
                <path d="M6 6l12 12M18 6L6 18" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
              </svg>
            </button>
          </li>
        ))}
      </ul>

      {/* Suggested */}
      <p className="mb-2.5 mt-7 font-mono text-[11px] uppercase tracking-[0.16em] text-muted">
        Suggested tasks
      </p>
      <div className="flex flex-wrap gap-2">
        {SUGGESTED.filter((s) => !chosen.has(s.name.toLowerCase())).map((s) => (
          <button
            key={s.name}
            onClick={() => addTask(s.name, s.minutes)}
            className="group flex items-center gap-1.5 rounded-full border border-border bg-card px-4 py-2 text-sm transition-colors hover:border-teal hover:bg-teal/5"
          >
            <span className="text-teal">+</span>
            {s.name}
            <span className="font-mono text-[11px] text-muted">{s.minutes}m</span>
          </button>
        ))}
      </div>

      {/* Custom */}
      <form
        onSubmit={(e) => {
          e.preventDefault()
          addTask(custom, 10)
          setCustom("")
        }}
        className="mt-4 flex gap-2"
      >
        <input
          value={custom}
          onChange={(e) => setCustom(e.target.value)}
          placeholder="Write your own task…"
          className="flex-1 rounded-full border border-border bg-card px-4 py-2.5 text-sm outline-none transition-colors placeholder:text-muted focus:border-teal"
        />
        <button
          type="submit"
          className="rounded-full border border-border px-5 py-2.5 text-sm font-medium text-ink/80 transition-colors hover:border-teal hover:text-teal"
        >
          Add
        </button>
      </form>
    </div>
  )
}

function LivePreview(props: PlanProps) {
  const { totalTaskMinutes, commute, totalPrep, startMins, tasks } = props
  return (
    <aside className="lg:sticky lg:top-24 lg:self-start">
      <div className="overflow-hidden rounded-3xl border border-border bg-teal text-cream shadow-[0_18px_50px_-24px_rgba(45,54,64,0.5)]">
        <div className="px-7 pt-7">
          <p className="font-mono text-[11px] uppercase tracking-[0.18em] text-cream/70">
            Start getting ready at
          </p>
          <p className="mt-2 font-display text-5xl font-semibold tracking-tight sm:text-6xl">
            {fmtTime(startMins)}
          </p>
        </div>
        <div className="mt-6 space-y-px bg-cream/15 px-px pb-px">
          <PreviewRow label="Routine" value={fmtDuration(totalTaskMinutes)} sub={`${tasks.length} tasks`} />
          <PreviewRow label="Commute" value={fmtDuration(commute)} />
          <PreviewRow label="Total prep time" value={fmtDuration(totalPrep)} strong />
        </div>
      </div>
      <p className="mt-4 px-1 text-xs leading-relaxed text-muted">
        This updates as you plan. Change your arrival time, commute, or tasks
        and watch your start time shift.
      </p>
    </aside>
  )
}

function PreviewRow({
  label,
  value,
  sub,
  strong,
}: {
  label: string
  value: string
  sub?: string
  strong?: boolean
}) {
  return (
    <div className="flex items-baseline justify-between bg-teal px-7 py-3.5">
      <span className={`text-sm ${strong ? "font-semibold text-cream" : "text-cream/80"}`}>
        {label}
        {sub && <span className="ml-2 font-mono text-[11px] text-cream/55">{sub}</span>}
      </span>
      <span className={`font-mono text-sm ${strong ? "text-cream" : "text-cream/90"}`}>
        {value}
      </span>
    </div>
  )
}

/* ------------------------------------------------------------------ */
/*  Screen 3 — Schedule                                                */
/* ------------------------------------------------------------------ */

type ScheduleProps = {
  tasks: Task[]
  setTasks: React.Dispatch<React.SetStateAction<Task[]>>
  startMins: number
  departureMins: number
  arrivalMins: number
  commute: number
  totalPrep: number
  onEdit: () => void
}

function Schedule(props: ScheduleProps) {
  const { tasks, setTasks, startMins, departureMins, arrivalMins, commute, totalPrep, onEdit } = props

  const toggle = (id: string) =>
    setTasks((prev) => prev.map((t) => (t.id === id ? { ...t, done: !t.done } : t)))

  // Build timeline with running times
  let cursor = startMins
  const taskRows = tasks.map((t) => {
    const at = cursor
    cursor += t.minutes
    return { ...t, at }
  })

  const doneCount = tasks.filter((t) => t.done).length

  return (
    <main className="mx-auto max-w-3xl px-6 py-10 lg:py-14">
      <header className="mb-10 flex flex-wrap items-end justify-between gap-4">
        <div>
          <p className="mb-2 font-mono text-xs uppercase tracking-[0.18em] text-teal">
            Your morning, mapped out
          </p>
          <h2 className="font-display text-4xl font-semibold leading-tight sm:text-5xl">
            Start at{" "}
            <span className="text-teal">{fmtTime(startMins)}</span>
          </h2>
          <p className="mt-3 text-[15px] text-muted">
            {fmtDuration(totalPrep)} of prep before you arrive at{" "}
            {fmtTime(arrivalMins)}. {doneCount > 0 && `${doneCount}/${tasks.length} done.`}
          </p>
        </div>
        <button
          onClick={onEdit}
          className="rounded-full border border-border bg-card px-5 py-2.5 text-sm font-medium text-ink/80 transition-colors hover:border-teal hover:text-teal"
        >
          Edit my plan
        </button>
      </header>

      <ol className="relative">
        <span className="absolute bottom-6 left-[23px] top-6 w-px bg-border" />

        {/* Start anchor */}
        <TimelineNode
          time={fmtTime(startMins)}
          highlight
          icon={
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden>
              <circle cx="12" cy="12" r="9" stroke="currentColor" strokeWidth="2" />
              <path d="M12 7v5l3 2" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          }
        >
          <div className="rounded-2xl bg-teal px-5 py-4 text-cream">
            <p className="font-mono text-[11px] uppercase tracking-[0.16em] text-cream/70">
              Wake &amp; begin
            </p>
            <p className="font-display text-lg font-semibold">Start getting ready</p>
          </div>
        </TimelineNode>

        {/* Tasks */}
        {taskRows.map((t) => (
          <TimelineNode key={t.id} time={fmtTime(t.at)} checked={t.done}>
            <button
              onClick={() => toggle(t.id)}
              className={`flex w-full items-center gap-3 rounded-2xl border px-5 py-4 text-left transition-colors ${
                t.done
                  ? "border-border bg-sand/50"
                  : "border-border bg-card hover:border-taupe"
              }`}
            >
              <span
                className={`grid size-6 shrink-0 place-items-center rounded-md border transition-colors ${
                  t.done ? "border-teal bg-teal text-cream" : "border-taupe bg-transparent"
                }`}
              >
                {t.done && (
                  <svg width="13" height="13" viewBox="0 0 24 24" fill="none" aria-hidden>
                    <path d="M5 12l5 5 9-11" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                )}
              </span>
              <span
                className={`flex-1 text-[15px] font-medium ${
                  t.done ? "text-muted line-through" : ""
                }`}
              >
                {t.name}
              </span>
              <span className="font-mono text-xs text-muted">{fmtDuration(t.minutes)}</span>
            </button>
          </TimelineNode>
        ))}

        {/* Departure */}
        <TimelineNode
          time={fmtTime(departureMins)}
          icon={
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden>
              <path d="M3 12h13M11 7l5 5-5 5M20 5v14" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          }
        >
          <div className="rounded-2xl border border-dashed border-teal/50 bg-teal/5 px-5 py-4">
            <p className="font-mono text-[11px] uppercase tracking-[0.16em] text-teal">
              Leave home
            </p>
            <p className="text-[15px] font-medium">
              Head out — {fmtDuration(commute)} to go
            </p>
          </div>
        </TimelineNode>

        {/* Arrival */}
        <TimelineNode
          time={fmtTime(arrivalMins)}
          highlight
          icon={
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden>
              <path d="M12 21s7-5.5 7-11a7 7 0 10-14 0c0 5.5 7 11 7 11z" stroke="currentColor" strokeWidth="2" strokeLinejoin="round" />
              <circle cx="12" cy="10" r="2.4" stroke="currentColor" strokeWidth="2" />
            </svg>
          }
        >
          <div className="rounded-2xl bg-ink px-5 py-4 text-cream">
            <p className="font-mono text-[11px] uppercase tracking-[0.16em] text-cream/60">
              Arrive
            </p>
            <p className="font-display text-lg font-semibold">On time, unrushed</p>
          </div>
        </TimelineNode>
      </ol>
    </main>
  )
}

function TimelineNode({
  time,
  children,
  icon,
  highlight,
  checked,
}: {
  time: string
  children: React.ReactNode
  icon?: React.ReactNode
  highlight?: boolean
  checked?: boolean
}) {
  return (
    <li className="relative flex gap-4 pb-3">
      <div className="flex w-12 shrink-0 flex-col items-center pt-4">
        <span
          className={`z-10 grid size-12 place-items-center rounded-full ${
            highlight
              ? "bg-teal text-cream"
              : checked
                ? "border border-teal bg-teal/10 text-teal"
                : "border border-border bg-card text-taupe"
          }`}
        >
          {icon ?? (
            <span className="size-2.5 rounded-full bg-current" />
          )}
        </span>
      </div>
      <div className="flex-1 pt-2.5">
        <p className="mb-1.5 font-mono text-xs text-muted">{time}</p>
        {children}
      </div>
    </li>
  )
}
