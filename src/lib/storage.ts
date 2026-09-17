import type { Problem } from '../types/problem'

const KEY = 'lc-tracker-problems'
const BACKUP_KEY = 'lc-tracker-problems-backup'

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
  const prev = localStorage.getItem(KEY)
  if (prev) localStorage.setItem(BACKUP_KEY, prev)
  localStorage.setItem(KEY, JSON.stringify(problems))
}

export function loadBackup(): Problem[] | null {
  try {
    const raw = localStorage.getItem(BACKUP_KEY)
    if (!raw) return null
    return JSON.parse(raw) as Problem[]
  } catch {
    return null
  }
}

export function clearStorage(): void {
  localStorage.removeItem(KEY)
  localStorage.removeItem(BACKUP_KEY)
}
