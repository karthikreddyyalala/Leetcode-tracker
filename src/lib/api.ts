import type { Problem } from '../types/problem'

const SYNC_ENDPOINT = '/api/sync-problems'
const FETCH_ENDPOINT = '/api/get-problems'

let syncTimer: ReturnType<typeof setTimeout> | null = null

export function syncProblems(problems: Problem[]): void {
  if (syncTimer) clearTimeout(syncTimer)
  syncTimer = setTimeout(() => {
    fetch(SYNC_ENDPOINT, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ problems }),
    }).catch(() => {
      // Non-critical — localStorage remains the source of truth in the browser.
    })
  }, 500)
}

export async function fetchProblems(): Promise<Problem[] | null> {
  try {
    const res = await fetch(FETCH_ENDPOINT)
    if (!res.ok) return null
    const data = (await res.json()) as { problems: Problem[] }
    return Array.isArray(data.problems) ? data.problems : null
  } catch {
    return null
  }
}
