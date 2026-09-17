'use client'
import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { ArrowSquareOut, Check, Trash, Star, X } from '@phosphor-icons/react'
import { DifficultyBadge } from './difficulty-badge'
import { formatDate, daysUntil, relativeTime, today } from '../lib/dates'
import type { Problem, Difficulty } from '../types/problem'

type Props = {
  problem: Problem
  onReview: (id: string) => void
  onDelete: (id: string) => void
  showNext?: boolean
}

const accentBar: Record<Difficulty, string> = {
  Easy: 'bg-emerald-500',
  Medium: 'bg-amber-500',
  Hard: 'bg-rose-500',
}

export function ReviewCard({ problem, onReview, onDelete, showNext = false }: Props) {
  const overdue = daysUntil(problem.nextReview)
  const isOverdue = showNext && overdue <= 0
  const isVeteran = problem.reviewDates.length >= 5
  const isMastered = problem.reviewDates.length >= 10
  const [confirming, setConfirming] = useState(false)
  const solvedToday = problem.dateSolved === today()

  useEffect(() => {
    if (!confirming) return
    const t = setTimeout(() => setConfirming(false), 3000)
    return () => clearTimeout(t)
  }, [confirming])

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 6 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -4, scale: 0.98 }}
      transition={{ type: 'spring', stiffness: 260, damping: 24 }}
      className="group relative flex items-start justify-between gap-4 border-b border-zinc-800/60 py-4 pl-4 last:border-0 rounded-lg transition-base hover:bg-zinc-800/25 -mx-2 px-2 cursor-default"
    >
      <div className={`absolute left-0 top-4 h-[calc(100%-2rem)] w-[2px] rounded-full opacity-30 group-hover:opacity-90 transition-opacity duration-200 ${accentBar[problem.difficulty]}`} />

      <div className="flex min-w-0 flex-col gap-1.5">
        <div className="flex items-center gap-2.5 flex-wrap">
          <DifficultyBadge difficulty={problem.difficulty} />
          {isMastered ? (
            <span className="inline-flex items-center gap-1 rounded-full border border-purple-400/30 bg-purple-400/10 px-2 py-0.5 font-mono text-[10px] font-semibold text-purple-400">
              <Star weight="fill" size={9} />
              {problem.reviewDates.length}x mastered
            </span>
          ) : isVeteran ? (
            <span className="inline-flex items-center gap-1 rounded-full border border-amber-400/30 bg-amber-400/10 px-2 py-0.5 font-mono text-[10px] font-semibold text-amber-400">
              <Star weight="fill" size={9} />
              {problem.reviewDates.length}x
            </span>
          ) : problem.reviewDates.length > 0 ? (
            <span className="rounded-full border border-zinc-700/60 bg-zinc-800/50 px-2 py-0.5 font-mono text-[10px] text-zinc-500">
              {problem.reviewDates.length}x
            </span>
          ) : null}
          {isOverdue && (
            <span className="rounded-full border border-amber-500/25 bg-amber-500/10 px-2 py-0.5 text-[10px] font-medium text-amber-400">
              {overdue === 0 ? 'due today' : `${Math.abs(overdue)}d overdue`}
            </span>
          )}
          <a
            href={problem.url}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-1 text-sm font-medium text-zinc-100 transition-base hover:text-sky-400 truncate max-w-[300px]"
          >
            {problem.title}
            <ArrowSquareOut size={12} className="shrink-0 opacity-0 group-hover:opacity-60 transition-base" />
          </a>
        </div>
        <div className="flex items-center gap-3 text-[11px] text-zinc-500">
          <span>
            Solved {formatDate(problem.dateSolved)}
            {solvedToday && <span className="ml-1.5 font-medium text-sky-400/70">· today</span>}
          </span>
          {showNext && !isOverdue && (
            <>
              <span className="h-3 w-px bg-zinc-700" />
              <span>
                Review{' '}
                <span className="text-zinc-400">{relativeTime(problem.nextReview)}</span>
              </span>
            </>
          )}
        </div>
      </div>

      <div className="flex shrink-0 items-center gap-1 opacity-0 transition-base group-hover:opacity-100 translate-x-1 group-hover:translate-x-0">
        <AnimatePresence mode="wait" initial={false}>
          {confirming ? (
            <motion.div
              key="confirm-state"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              transition={{ type: 'spring', stiffness: 400, damping: 22 }}
              className="flex items-center gap-1"
            >
              <motion.button
                whileTap={{ scale: 0.93 }}
                transition={{ type: 'spring', stiffness: 400, damping: 20 }}
                onClick={() => setConfirming(false)}
                className="flex h-7 w-7 items-center justify-center rounded-md text-zinc-500 transition-base hover:bg-zinc-800 hover:text-zinc-300"
                title="Cancel"
              >
                <X size={12} />
              </motion.button>
              <motion.button
                whileTap={{ scale: 0.93 }}
                transition={{ type: 'spring', stiffness: 400, damping: 20 }}
                onClick={() => onDelete(problem.id)}
                className="flex h-7 items-center gap-1 rounded-md border border-rose-500/30 bg-rose-500/10 px-2 text-[11px] font-medium text-rose-400 transition-base hover:bg-rose-500/20"
              >
                <Trash size={11} />
                Sure?
              </motion.button>
            </motion.div>
          ) : (
            <motion.button
              key="trash"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              whileTap={{ scale: 0.93 }}
              transition={{ type: 'spring', stiffness: 400, damping: 20 }}
              onClick={() => setConfirming(true)}
              className="flex h-7 w-7 items-center justify-center rounded-md text-zinc-600 transition-base hover:bg-zinc-800 hover:text-rose-400"
              title="Remove"
            >
              <Trash size={14} />
            </motion.button>
          )}
        </AnimatePresence>
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
