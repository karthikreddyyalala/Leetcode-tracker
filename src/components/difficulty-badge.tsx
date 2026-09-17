import type { Difficulty } from '../types/problem'

const dot: Record<Difficulty, string> = {
  Easy: 'bg-emerald-400',
  Medium: 'bg-amber-400',
  Hard: 'bg-rose-400',
}

const text: Record<Difficulty, string> = {
  Easy: 'text-emerald-400',
  Medium: 'text-amber-400',
  Hard: 'text-rose-400',
}

const label: Record<Difficulty, string> = {
  Easy: 'Easy',
  Medium: 'Med',
  Hard: 'Hard',
}

type Props = { difficulty: Difficulty; size?: 'sm' | 'md'; showFull?: boolean }

export function DifficultyBadge({ difficulty, size = 'sm', showFull = true }: Props) {
  const textSize = size === 'md' ? 'text-xs' : 'text-[11px]'
  const dotSize = size === 'md' ? 'h-[7px] w-[7px]' : 'h-[6px] w-[6px]'
  return (
    <span
      className={`inline-flex items-center gap-1.5 font-mono font-semibold tracking-wide ${textSize} ${text[difficulty]}`}
      title={difficulty}
    >
      <span className={`shrink-0 rounded-full ${dotSize} ${dot[difficulty]}`} />
      {showFull ? difficulty : label[difficulty]}
    </span>
  )
}
