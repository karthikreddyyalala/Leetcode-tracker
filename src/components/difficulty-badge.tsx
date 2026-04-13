import type { Difficulty } from '../types/problem'

const styles: Record<Difficulty, string> = {
  Easy: 'text-emerald-400 bg-emerald-400/8 border-emerald-400/20',
  Medium: 'text-amber-400 bg-amber-400/8 border-amber-400/20',
  Hard: 'text-rose-400 bg-rose-400/8 border-rose-400/20',
}

type Props = { difficulty: Difficulty; size?: 'sm' | 'md' }

export function DifficultyBadge({ difficulty, size = 'sm' }: Props) {
  const padding = size === 'md' ? 'px-2.5 py-1 text-xs' : 'px-2 py-0.5 text-[11px]'
  return (
    <span
      className={`inline-flex items-center rounded border font-mono font-medium tracking-wide ${padding} ${styles[difficulty]}`}
    >
      {difficulty}
    </span>
  )
}
