'use client'
import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Plus, X } from '@phosphor-icons/react'
import type { Difficulty } from '../types/problem'
import { today } from '../lib/dates'

type FormData = {
  title: string
  url: string
  difficulty: Difficulty
  dateSolved: string
}

type Props = {
  onAdd: (data: FormData) => void
}

const DIFFICULTIES: Difficulty[] = ['Easy', 'Medium', 'Hard']

const difficultyActive: Record<Difficulty, string> = {
  Easy: 'bg-emerald-500/15 border-emerald-500/40 text-emerald-300',
  Medium: 'bg-amber-500/15 border-amber-500/40 text-amber-300',
  Hard: 'bg-rose-500/15 border-rose-500/40 text-rose-300',
}

const initialForm: FormData = {
  title: '',
  url: '',
  difficulty: 'Medium',
  dateSolved: today(),
}

export function AddProblemForm({ onAdd }: Props) {
  const [open, setOpen] = useState(false)
  const [form, setForm] = useState<FormData>(initialForm)
  const [errors, setErrors] = useState<Partial<Record<keyof FormData, string>>>({})

  function validate(): boolean {
    const next: typeof errors = {}
    if (!form.title.trim()) next.title = 'Title is required'
    if (!form.url.trim()) next.url = 'URL is required'
    else if (!form.url.startsWith('http')) next.url = 'Enter a valid URL'
    if (!form.dateSolved) next.dateSolved = 'Date is required'
    setErrors(next)
    return Object.keys(next).length === 0
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!validate()) return
    onAdd(form)
    setForm(initialForm)
    setErrors({})
    setOpen(false)
  }

  function handleClose() {
    setOpen(false)
    setForm(initialForm)
    setErrors({})
  }

  return (
    <>
      <motion.button
        onClick={() => setOpen(true)}
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.97 }}
        transition={{ type: 'spring', stiffness: 300, damping: 20 }}
        className="inline-flex items-center gap-2 rounded-lg bg-sky-500 px-4 py-2 text-sm font-semibold text-zinc-950 shadow-[0_0_0_1px_rgba(14,165,233,0.3),0_4px_12px_-2px_rgba(14,165,233,0.25)] transition-base hover:bg-sky-400 active:scale-[0.97]"
      >
        <Plus weight="bold" size={15} />
        Log Problem
      </motion.button>

      <AnimatePresence>
        {open && (
          <>
            <motion.div
              key="backdrop"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.15 }}
              className="fixed inset-0 z-40 bg-zinc-950/80 backdrop-blur-sm"
              onClick={handleClose}
            />

            <motion.div
              key="panel"
              initial={{ opacity: 0, y: 12, scale: 0.98 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 8, scale: 0.98 }}
              transition={{ type: 'spring', stiffness: 280, damping: 26 }}
              className="fixed inset-x-0 top-[10%] z-50 mx-auto w-full max-w-lg px-4"
            >
              <div className="rounded-2xl border border-zinc-800 bg-zinc-900 shadow-[0_24px_60px_-12px_rgba(0,0,0,0.6)]">
                <div className="flex items-center justify-between border-b border-zinc-800 px-6 py-4">
                  <h2 className="text-sm font-semibold tracking-tight text-zinc-100">
                    Log a problem
                  </h2>
                  <button
                    onClick={handleClose}
                    className="flex h-7 w-7 items-center justify-center rounded-md text-zinc-500 transition-base hover:bg-zinc-800 hover:text-zinc-300"
                  >
                    <X size={15} />
                  </button>
                </div>

                <form onSubmit={handleSubmit} className="flex flex-col gap-5 p-6">
                  <div className="flex flex-col gap-1.5">
                    <label className="text-xs font-medium text-zinc-400">Problem title</label>
                    <input
                      type="text"
                      placeholder="Two Sum"
                      value={form.title}
                      onChange={(e) => setForm({ ...form, title: e.target.value })}
                      className="rounded-lg border border-zinc-700 bg-zinc-800/50 px-3 py-2 text-sm text-zinc-100 placeholder-zinc-600 outline-none transition-base focus:border-sky-500/60 focus:ring-1 focus:ring-sky-500/30"
                    />
                    {errors.title && (
                      <span className="text-[11px] text-rose-400">{errors.title}</span>
                    )}
                  </div>

                  <div className="flex flex-col gap-1.5">
                    <label className="text-xs font-medium text-zinc-400">LeetCode URL</label>
                    <input
                      type="url"
                      placeholder="https://leetcode.com/problems/two-sum"
                      value={form.url}
                      onChange={(e) => setForm({ ...form, url: e.target.value })}
                      className="rounded-lg border border-zinc-700 bg-zinc-800/50 px-3 py-2 text-sm text-zinc-100 placeholder-zinc-600 outline-none transition-base focus:border-sky-500/60 focus:ring-1 focus:ring-sky-500/30"
                    />
                    {errors.url && (
                      <span className="text-[11px] text-rose-400">{errors.url}</span>
                    )}
                  </div>

                  <div className="flex flex-col gap-1.5">
                    <label className="text-xs font-medium text-zinc-400">Difficulty</label>
                    <div className="flex gap-2">
                      {DIFFICULTIES.map((d) => (
                        <button
                          key={d}
                          type="button"
                          onClick={() => setForm({ ...form, difficulty: d })}
                          className={`flex-1 rounded-lg border px-3 py-2 text-xs font-medium transition-base ${
                            form.difficulty === d
                              ? difficultyActive[d]
                              : 'border-zinc-700 bg-zinc-800/40 text-zinc-500 hover:border-zinc-600 hover:text-zinc-300'
                          }`}
                        >
                          {d}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div className="flex flex-col gap-1.5">
                    <label className="text-xs font-medium text-zinc-400">Date solved</label>
                    <input
                      type="date"
                      value={form.dateSolved}
                      onChange={(e) => setForm({ ...form, dateSolved: e.target.value })}
                      className="rounded-lg border border-zinc-700 bg-zinc-800/50 px-3 py-2 text-sm text-zinc-100 outline-none transition-base focus:border-sky-500/60 focus:ring-1 focus:ring-sky-500/30 [color-scheme:dark]"
                    />
                    {errors.dateSolved && (
                      <span className="text-[11px] text-rose-400">{errors.dateSolved}</span>
                    )}
                  </div>

                  <div className="flex items-center justify-end gap-3 border-t border-zinc-800 pt-4">
                    <button
                      type="button"
                      onClick={handleClose}
                      className="rounded-lg px-4 py-2 text-sm text-zinc-400 transition-base hover:text-zinc-200"
                    >
                      Cancel
                    </button>
                    <motion.button
                      type="submit"
                      whileTap={{ scale: 0.97 }}
                      transition={{ type: 'spring', stiffness: 300, damping: 20 }}
                      className="rounded-lg bg-sky-500 px-4 py-2 text-sm font-medium text-zinc-950 transition-base hover:bg-sky-400"
                    >
                      Add to tracker
                    </motion.button>
                  </div>
                </form>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  )
}
