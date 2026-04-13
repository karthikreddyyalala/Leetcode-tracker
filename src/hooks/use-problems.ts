import { useState, useCallback, useEffect } from 'react'
import { loadProblems, saveProblems } from '../lib/storage'
import { addDays, today } from '../lib/dates'
import { syncProblems, fetchProblems } from '../lib/api'
import type { Problem, Difficulty } from '../types/problem'

function generateId(): string {
  return `${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 7)}`
}

export function useProblems() {
  const [problems, setProblems] = useState<Problem[]>(() => loadProblems())

  // On mount: fetch from Redis (source of truth across browsers/profiles).
  // Falls back to localStorage silently if the request fails.
  useEffect(() => {
    fetchProblems().then((serverProblems) => {
      if (serverProblems !== null) {
        setProblems(serverProblems)
        saveProblems(serverProblems)
      }
    })
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
        return {
          ...p,
          reviewDates: [...p.reviewDates, reviewedOn],
          nextReview: addDays(reviewedOn, 7),
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

  return { problems, addProblem, markReviewed, deleteProblem }
}
