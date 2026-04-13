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
