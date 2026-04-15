import { useMemo } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { AddProblemForm } from '../components/add-problem-form'
import { ReviewCard } from '../components/review-card'
import { EmptyState } from '../components/empty-state'
import { isDueToday, today, formatDate, dayOfWeek, getGreeting } from '../lib/dates'
import type { Problem, Difficulty } from '../types/problem'

type Props = {
  problems: Problem[]
  onAdd: (data: { title: string; url: string; difficulty: Difficulty; dateSolved: string }) => void
  onReview: (id: string) => void
  onDelete: (id: string) => void
}

export function DashboardPage({ problems, onAdd, onReview, onDelete }: Props) {
  const dueToday = useMemo(
    () => problems.filter((p) => isDueToday(p.nextReview)),
    [problems],
  )

  const todayLogged = useMemo(
    () => problems.filter((p) => p.dateSolved === today()).length,
    [problems],
  )

  const streakDays = useMemo(() => {
    const dates = new Set(problems.map((p) => p.dateSolved))
    let count = 0
    const cursor = new Date()
    while (true) {
      const d = cursor.toISOString().split('T')[0]
      if (dates.has(d)) {
        count++
        cursor.setDate(cursor.getDate() - 1)
      } else {
        break
      }
    }
    return count
  }, [problems])

  const todayLabel = formatDate(today())
  const greeting = getGreeting()

  const stats = [
    {
      label: 'Due today',
      value: dueToday.length,
      accent: dueToday.length > 0 ? 'text-amber-400' : 'text-zinc-100',
    },
    {
      label: 'Logged today',
      value: todayLogged,
      accent: 'text-zinc-100',
    },
    {
      label: 'Day streak',
      value: streakDays,
      accent: streakDays > 0 ? 'text-sky-400' : 'text-zinc-100',
    },
    {
      label: 'Total logged',
      value: problems.length,
      accent: 'text-zinc-100',
    },
  ]

  return (
    <div className="mx-auto max-w-4xl px-5 py-8">
      <div className="mb-8 grid grid-cols-1 gap-4 md:grid-cols-[2fr_1fr]">
        <div>
          <p className="mb-1 font-mono text-[11px] uppercase tracking-widest text-zinc-600">
            {todayLabel}
          </p>
          <h1 className="text-2xl font-semibold tracking-tight text-zinc-100">
            {greeting}, Karthik
          </h1>
          <p className="mt-1 text-sm text-zinc-500">
            {dueToday.length > 0
              ? `You have ${dueToday.length} problem${dueToday.length !== 1 ? 's' : ''} waiting for review.`
              : 'No problems due for review today.'}
          </p>
        </div>
        <div className="flex items-start justify-start md:justify-end">
          <AddProblemForm onAdd={onAdd} />
        </div>
      </div>

      <div className="mb-8 flex divide-x divide-zinc-800/70 rounded-xl border border-zinc-800/70 bg-zinc-900/30 overflow-hidden">
        {stats.map(({ label, value, accent }) => (
          <div key={label} className="flex-1 px-5 py-4">
            <p className="text-[10px] font-medium uppercase tracking-widest text-zinc-600">{label}</p>
            <p className={`mt-1.5 font-mono text-2xl font-semibold ${accent}`}>{value}</p>
          </div>
        ))}
      </div>

      <div className="rounded-xl border border-zinc-800/70 bg-zinc-900/30 shadow-[0_20px_40px_-15px_rgba(0,0,0,0.3)]">
        <div className="flex items-center justify-between border-b border-zinc-800/60 px-5 py-3.5">
          <span className="text-xs font-medium uppercase tracking-widest text-zinc-600">
            Today&#39;s queue
          </span>
          <span className={`font-mono text-xs font-semibold ${dueToday.length > 0 ? 'text-amber-400' : 'text-zinc-600'}`}>
            {dueToday.length} problem{dueToday.length !== 1 ? 's' : ''}
          </span>
        </div>

        <div className="px-5">
          <AnimatePresence mode="popLayout">
            {dueToday.length === 0 ? (
              <EmptyState variant="queue-empty" />
            ) : (
              dueToday.map((p) => (
                <ReviewCard
                  key={p.id}
                  problem={p}
                  onReview={onReview}
                  onDelete={onDelete}
                />
              ))
            )}
          </AnimatePresence>
        </div>
      </div>

      {problems.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1, type: 'spring', stiffness: 200, damping: 24 }}
          className="mt-6 rounded-xl border border-zinc-800/70 bg-zinc-900/30 shadow-[0_20px_40px_-15px_rgba(0,0,0,0.3)]"
        >
          <div className="flex items-center justify-between border-b border-zinc-800/60 px-5 py-3.5">
            <span className="text-xs font-medium uppercase tracking-widest text-zinc-600">
              Upcoming
            </span>
            <span className="font-mono text-xs text-zinc-600">next 7 days</span>
          </div>
          <div className="px-5">
            {problems
              .filter((p) => !isDueToday(p.nextReview))
              .sort((a, b) => a.nextReview.localeCompare(b.nextReview))
              .slice(0, 5)
              .map((p) => (
                <div key={p.id} className="flex items-center gap-3">
                  <div className="shrink-0 w-8 text-center">
                    <span className="font-mono text-[10px] font-medium uppercase tracking-wide text-zinc-600">
                      {dayOfWeek(p.nextReview)}
                    </span>
                  </div>
                  <div className="flex-1 min-w-0">
                    <ReviewCard
                      problem={p}
                      onReview={onReview}
                      onDelete={onDelete}
                      showNext
                    />
                  </div>
                </div>
              ))}
            {problems.filter((p) => !isDueToday(p.nextReview)).length === 0 && (
              <p className="py-6 text-center text-xs text-zinc-600">No upcoming reviews scheduled.</p>
            )}
          </div>
        </motion.div>
      )}
    </div>
  )
}
