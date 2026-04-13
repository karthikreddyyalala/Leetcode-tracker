'use client'
import { motion } from 'framer-motion'
import { ArrowSquareOut, Check, Trash } from '@phosphor-icons/react'
import { DifficultyBadge } from './difficulty-badge'
import { formatDate, daysUntil } from '../lib/dates'
import type { Problem } from '../types/problem'

type Props = {
  problem: Problem
  onReview: (id: string) => void
  onDelete: (id: string) => void
  showNext?: boolean
}

export function ReviewCard({ problem, onReview, onDelete, showNext = false }: Props) {
  const overdue = daysUntil(problem.nextReview)

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 6 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -4, scale: 0.98 }}
      transition={{ type: 'spring', stiffness: 260, damping: 24 }}
      className="group flex items-start justify-between gap-4 border-b border-zinc-800/60 py-4 last:border-0"
    >
      <div className="flex min-w-0 flex-col gap-1.5">
        <div className="flex items-center gap-2.5 flex-wrap">
          <DifficultyBadge difficulty={problem.difficulty} />
          <a
            href={problem.url}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-1 text-sm font-medium text-zinc-100 transition-base hover:text-sky-400 truncate max-w-[320px]"
          >
            {problem.title}
            <ArrowSquareOut size={12} className="shrink-0 opacity-0 group-hover:opacity-60 transition-base" />
          </a>
        </div>
        <div className="flex items-center gap-3 text-[11px] text-zinc-500">
          <span>Solved {formatDate(problem.dateSolved)}</span>
          {showNext && (
            <>
              <span className="h-3 w-px bg-zinc-700" />
              <span>
                Next review{' '}
                {overdue <= 0
                  ? <span className="text-amber-400 font-medium">{Math.abs(overdue) === 0 ? 'today' : `${Math.abs(overdue)}d overdue`}</span>
                  : formatDate(problem.nextReview)
                }
              </span>
            </>
          )}
          {problem.reviewDates.length > 0 && (
            <>
              <span className="h-3 w-px bg-zinc-700" />
              <span className="font-mono">{problem.reviewDates.length}x reviewed</span>
            </>
          )}
        </div>
      </div>

      <div className="flex shrink-0 items-center gap-1 opacity-0 transition-base group-hover:opacity-100">
        <motion.button
          whileTap={{ scale: 0.93 }}
          transition={{ type: 'spring', stiffness: 400, damping: 20 }}
          onClick={() => onDelete(problem.id)}
          className="flex h-7 w-7 items-center justify-center rounded-md text-zinc-600 transition-base hover:bg-zinc-800 hover:text-rose-400"
          title="Remove"
        >
          <Trash size={14} />
        </motion.button>
        <motion.button
          whileTap={{ scale: 0.93 }}
          transition={{ type: 'spring', stiffness: 400, damping: 20 }}
          onClick={() => onReview(problem.id)}
          className="flex h-7 items-center gap-1.5 rounded-md border border-emerald-500/25 bg-emerald-500/8 px-2.5 text-[11px] font-medium text-emerald-400 transition-base hover:border-emerald-500/40 hover:bg-emerald-500/15"
          title="Mark reviewed"
        >
          <Check weight="bold" size={11} />
          Done
        </motion.button>
      </div>
    </motion.div>
  )
}
