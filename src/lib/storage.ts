import type { Problem } from '../types/problem'

const KEY = 'lc-tracker-problems'

export function loadProblems(): Problem[] {
  try {
    const raw = localStorage.getItem(KEY)
    if (!raw) return []
    return JSON.parse(raw) as Problem[]
  } catch {
    return []
  }
}

export function saveProblems(problems: Problem[]): void {
  localStorage.setItem(KEY, JSON.stringify(problems))
}
