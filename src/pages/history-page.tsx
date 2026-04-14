import { useMemo, useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { MagnifyingGlass, FunnelSimple, X } from '@phosphor-icons/react'
import { ReviewCard } from '../components/review-card'
import { EmptyState } from '../components/empty-state'
import { DifficultyBadge } from '../components/difficulty-badge'
import type { Problem, Difficulty } from '../types/problem'

type Props = {
  problems: Problem[]
  onReview: (id: string) => void
  onDelete: (id: string) => void
}

type Filter = 'All' | Difficulty

const FILTERS: Filter[] = ['All', 'Easy', 'Medium', 'Hard']

const barColor: Record<Difficulty, string> = {
  Easy: 'bg-emerald-500',
  Medium: 'bg-amber-500',
  Hard: 'bg-rose-500',
}

export function HistoryPage({ problems, onReview, onDelete }: Props) {
  const [search, setSearch] = useState('')
  const [filter, setFilter] = useState<Filter>('All')

  const filtered = useMemo(() => {
    return problems
      .filter((p) => {
        const matchesDiff = filter === 'All' || p.difficulty === filter
        const matchesSearch = p.title.toLowerCase().includes(search.toLowerCase())
        return matchesDiff && matchesSearch
      })
      .sort((a, b) => b.dateSolved.localeCompare(a.dateSolved))
  }, [problems, search, filter])

  const counts = useMemo(
    () => ({
      Easy: problems.filter((p) => p.difficulty === 'Easy').length,
      Medium: problems.filter((p) => p.difficulty === 'Medium').length,
      Hard: problems.filter((p) => p.difficulty === 'Hard').length,
    }),
    [problems],
  )

  const total = problems.length

  return (
    <div className="mx-auto max-w-4xl px-5 py-8">
      <div className="mb-6 grid grid-cols-1 gap-6 md:grid-cols-[2fr_1fr]">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight text-zinc-100">History</h1>
          <p className="mt-1 text-sm text-zinc-500">
            All {problems.length} problem{problems.length !== 1 ? 's' : ''} you&#39;ve logged.
          </p>
        </div>

        {problems.length > 0 && (
          <div className="flex items-start justify-start gap-3 md:justify-end md:items-center flex-wrap">
            {(['Easy', 'Medium', 'Hard'] as Difficulty[]).map((d) => (
              <div key={d} className="flex items-center gap-1.5">
                <DifficultyBadge difficulty={d} size="sm" />
                <span className="font-mono text-xs text-zinc-500">{counts[d]}</span>
              </div>
            ))}
          </div>
        )}
      </div>

      {problems.length > 0 && (
        <>
          <div className="mb-5 flex h-1 overflow-hidden rounded-full bg-zinc-800">
            {(['Easy', 'Medium', 'Hard'] as Difficulty[]).map((d) => (
              <motion.div
                key={d}
                initial={{ width: 0 }}
                animate={{ width: `${total > 0 ? (counts[d] / total) * 100 : 0}%` }}
                transition={{ type: 'spring', stiffness: 120, damping: 20, delay: 0.1 }}
                className={`h-full ${barColor[d]}`}
                title={`${d}: ${counts[d]}`}
              />
            ))}
          </div>

          <div className="mb-5 flex items-center gap-3">
            <div className="relative flex-1">
              <MagnifyingGlass
                size={14}
                className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-500"
              />
              <input
                type="text"
                placeholder="Search problems..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full rounded-lg border border-zinc-800 bg-zinc-900 py-2 pl-8 pr-8 text-sm text-zinc-100 placeholder-zinc-600 outline-none transition-base focus:border-sky-500/50 focus:ring-1 focus:ring-sky-500/20"
              />
              <AnimatePresence>
                {search && (
                  <motion.button
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.8 }}
                    transition={{ duration: 0.12 }}
                    onClick={() => setSearch('')}
                    className="absolute right-2.5 top-1/2 -translate-y-1/2 flex h-4 w-4 items-center justify-center rounded-full bg-zinc-700 text-zinc-400 transition-base hover:bg-zinc-600 hover:text-zinc-200"
                  >
                    <X size={9} weight="bold" />
                  </motion.button>
                )}
              </AnimatePresence>
            </div>
            <div className="flex items-center gap-1 rounded-lg border border-zinc-800 bg-zinc-900 p-0.5">
              <FunnelSimple size={13} className="ml-2 text-zinc-500" />
              {FILTERS.map((f) => (
                <button
                  key={f}
                  onClick={() => setFilter(f)}
                  className={`relative rounded-md px-2.5 py-1.5 text-xs font-medium transition-base ${
                    filter === f ? 'text-zinc-100' : 'text-zinc-500 hover:text-zinc-300'
                  }`}
                >
                  {filter === f && (
                    <motion.span
                      layoutId="filter-pill"
                      className="absolute inset-0 rounded-md bg-zinc-800"
                      transition={{ type: 'spring', stiffness: 340, damping: 28 }}
                    />
                  )}
                  <span className="relative z-10">{f}</span>
                </button>
              ))}
            </div>
          </div>
        </>
      )}

      <div className="rounded-xl border border-zinc-800/70 bg-zinc-900/30">
        <div className="border-b border-zinc-800/60 px-5 py-3.5">
          <span className="text-xs font-medium uppercase tracking-widest text-zinc-600">
            {filtered.length} result{filtered.length !== 1 ? 's' : ''}
          </span>
        </div>
        <div className="px-5">
          <AnimatePresence mode="popLayout">
            {problems.length === 0 ? (
              <EmptyState variant="history-empty" />
            ) : filtered.length === 0 ? (
              <motion.p
                key="no-match"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="py-10 text-center text-xs text-zinc-600"
              >
                No problems match your filters.
              </motion.p>
            ) : (
              filtered.map((p) => (
                <ReviewCard
                  key={p.id}
                  problem={p}
                  onReview={onReview}
                  onDelete={onDelete}
                  showNext
                />
              ))
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  )
}
