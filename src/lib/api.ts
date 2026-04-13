import type { Problem } from '../types/problem'

export function syncProblems(problems: Problem[]): void {
  fetch('/api/sync-problems', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ problems }),
  }).catch(() => {
    // Non-critical — localStorage remains the source of truth in the browser.
    // Silently ignore network errors (e.g. local dev without Vercel CLI).
  })
}

export async function fetchProblems(): Promise<Problem[] | null> {
  try {
    const res = await fetch('/api/get-problems')
    if (!res.ok) return null
    const data = (await res.json()) as { problems: Problem[] }
    return Array.isArray(data.problems) ? data.problems : null
  } catch {
    return null
  }
}
