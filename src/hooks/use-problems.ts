import { useState, useCallback, useEffect } from 'react'
import { loadProblems, saveProblems } from '../lib/storage'
import { addDays, today } from '../lib/dates'
import { syncProblems, fetchProblems } from '../lib/api'
import type { Problem, Difficulty } from '../types/problem'

function generateId(): string {
  const ts = Date.now().toString(36)
  const rand = Math.random().toString(36).slice(2, 9)
  return `${ts}-${rand}`
}

export function useProblems() {
  const [problems, setProblems] = useState<Problem[]>(() => loadProblems())
  const [isSyncing, setIsSyncing] = useState(true)

  // On mount: sync with Redis.
  // If Redis has data → use it as source of truth.
  // If Redis is empty but localStorage has data → push local data up to Redis.
  // This handles the case where Redis was never seeded (first load after setup).
  useEffect(() => {
    const localProblems = loadProblems()
    fetchProblems().then((serverProblems) => {
      if (serverProblems !== null && serverProblems.length > 0) {
        setProblems(serverProblems)
        saveProblems(serverProblems)
      } else if (serverProblems !== null && localProblems.length > 0) {
        syncProblems(localProblems)
      }
    }).finally(() => setIsSyncing(false))
  }, [])

  const persist = useCallback((updated: Problem[]) => {
    setProblems(updated)
    saveProblems(updated)
    syncProblems(updated)
  }, [])

  const addProblem = useCallback(
    (data: { title: string; url: string; difficulty: Difficulty; dateSolved: string }) => {
      const nextReview = addDays(data.dateSolved, 7)
      const problem: Problem = {
        id: generateId(),
        ...data,
        reviewDates: [],
        nextReview,
      }
      persist([...problems, problem])
    },
    [problems, persist],
  )

  const markReviewed = useCallback(
    (id: string) => {
      const updated = problems.map((p) => {
        if (p.id !== id) return p
        const reviewedOn = today()
        const reviewCount = p.reviewDates.length + 1
        const interval = reviewCount <= 1 ? 7 : reviewCount <= 3 ? 14 : 30
        return {
          ...p,
          reviewDates: [...p.reviewDates, reviewedOn],
          nextReview: addDays(reviewedOn, interval),
        }
      })
      persist(updated)
    },
    [problems, persist],
  )

  const deleteProblem = useCallback(
    (id: string) => {
      persist(problems.filter((p) => p.id !== id))
    },
    [problems, persist],
  )

  return { problems, addProblem, markReviewed, deleteProblem, isSyncing }
}
