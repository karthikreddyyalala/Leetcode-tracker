import { CheckCircle, ClockCounterClockwise } from '@phosphor-icons/react'

type Props = {
  variant: 'queue-empty' | 'history-empty'
}

export function EmptyState({ variant }: Props) {
  if (variant === 'queue-empty') {
    return (
      <div className="flex flex-col items-center justify-center py-20 text-center">
        <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-xl border border-emerald-500/20 bg-emerald-500/8">
          <CheckCircle weight="duotone" size={24} className="text-emerald-400" />
        </div>
        <p className="text-sm font-medium text-zinc-300">All clear for today</p>
        <p className="mt-1 max-w-[280px] text-xs leading-relaxed text-zinc-500">
          No problems due for review. Log a new problem or check back tomorrow.
        </p>
      </div>
    )
  }

  return (
    <div className="flex flex-col items-center justify-center py-20 text-center">
      <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-xl border border-zinc-700 bg-zinc-800/50">
        <ClockCounterClockwise weight="duotone" size={24} className="text-zinc-400" />
      </div>
      <p className="text-sm font-medium text-zinc-300">No problems logged yet</p>
      <p className="mt-1 max-w-[280px] text-xs leading-relaxed text-zinc-500">
        Start logging problems from the Dashboard and they will appear here.
      </p>
    </div>
  )
}
