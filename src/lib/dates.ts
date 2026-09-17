export function today(): string {
  return new Date().toISOString().split('T')[0]
}

export function addDays(dateStr: string, days: number): string {
  const d = new Date(dateStr)
  d.setDate(d.getDate() + days)
  return d.toISOString().split('T')[0]
}

export function isDueToday(nextReview: string): boolean {
  return nextReview <= today()
}

export function formatDate(dateStr: string): string {
  const d = new Date(dateStr + 'T00:00:00')
  return d.toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  })
}

export function daysUntil(dateStr: string): number {
  const now = new Date(today() + 'T00:00:00')
  const target = new Date(dateStr + 'T00:00:00')
  const diff = target.getTime() - now.getTime()
  return Math.ceil(diff / (1000 * 60 * 60 * 24))
}

export function dayOfWeek(dateStr: string): string {
  return new Date(dateStr + 'T00:00:00').toLocaleDateString('en-US', { weekday: 'short' })
}

export function getGreeting(): string {
  const h = new Date().getHours()
  if (h < 12) return 'Good morning'
  if (h < 17) return 'Good afternoon'
  return 'Good evening'
}

export function relativeTime(dateStr: string): string {
  const d = daysUntil(dateStr)
  if (d === 0) return 'today'
  if (d === 1) return 'tomorrow'
  if (d === -1) return 'yesterday'
  if (d < 0) return `${Math.abs(d)}d ago`
  return `in ${d}d`
}
