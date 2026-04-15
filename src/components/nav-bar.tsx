import { motion } from 'framer-motion'
import { SquaresFour, ClockCounterClockwise } from '@phosphor-icons/react'

type Page = 'dashboard' | 'history'

type Props = {
  current: Page
  onChange: (page: Page) => void
  dueCount: number
  totalCount: number
  isSyncing: boolean
}

const tabs: { id: Page; label: string; Icon: React.ElementType }[] = [
  { id: 'dashboard', label: 'Dashboard', Icon: SquaresFour },
  { id: 'history', label: 'History', Icon: ClockCounterClockwise },
]

export function NavBar({ current, onChange, dueCount, totalCount, isSyncing }: Props) {
  return (
    <header className="sticky top-0 z-30 border-b border-zinc-800/60 bg-zinc-950/95 backdrop-blur-xl shadow-[0_1px_0_0_rgba(39,39,42,0.8)]">
      <div className="mx-auto flex max-w-4xl items-center justify-between px-5 py-3">
        <div className="flex items-center gap-2.5">
          <div className="flex h-6 w-6 items-center justify-center rounded bg-sky-500 text-zinc-950">
            <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
              <rect x="1" y="1" width="4" height="4" rx="1" fill="currentColor" />
              <rect x="7" y="1" width="4" height="4" rx="1" fill="currentColor" />
              <rect x="1" y="7" width="4" height="4" rx="1" fill="currentColor" />
              <rect x="7" y="7" width="4" height="4" rx="1" fill="currentColor" opacity="0.5" />
            </svg>
          </div>
          <span className="text-sm font-semibold tracking-tight text-zinc-100">LC Tracker</span>
          {isSyncing ? (
            <span className="hidden sm:flex items-center gap-1.5 font-mono text-[11px] text-zinc-600">
              <motion.span
                animate={{ opacity: [1, 0.3, 1] }}
                transition={{ duration: 1.2, repeat: Infinity }}
                className="h-1.5 w-1.5 rounded-full bg-sky-500"
              />
              syncing
            </span>
          ) : totalCount > 0 ? (
            <span className="hidden sm:inline font-mono text-[11px] text-zinc-600">
              · {totalCount} problem{totalCount !== 1 ? 's' : ''}
            </span>
          ) : null}
        </div>

        <nav className="flex items-center gap-0.5 rounded-lg border border-zinc-800 bg-zinc-900 p-0.5">
          {tabs.map(({ id, label, Icon }) => (
            <button
              key={id}
              onClick={() => onChange(id)}
              className="relative flex items-center gap-1.5 rounded-md px-3 py-1.5 text-xs font-medium transition-base"
            >
              {current === id && (
                <motion.span
                  layoutId="nav-pill"
                  className="absolute inset-0 rounded-md bg-zinc-800"
                  transition={{ type: 'spring', stiffness: 340, damping: 28 }}
                />
              )}
              <Icon
                size={13}
                weight={current === id ? 'fill' : 'regular'}
                className={`relative z-10 transition-base ${current === id ? 'text-zinc-100' : 'text-zinc-500'}`}
              />
              <span className={`relative z-10 transition-base ${current === id ? 'text-zinc-100' : 'text-zinc-500'}`}>
                {label}
              </span>
              {id === 'dashboard' && dueCount > 0 && (
                <motion.span
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ type: 'spring', stiffness: 400, damping: 18 }}
                  className="relative z-10 flex h-4 min-w-[16px] items-center justify-center rounded-full bg-sky-500 px-1 font-mono text-[10px] font-bold text-zinc-950"
                >
                  {dueCount}
                </motion.span>
              )}
            </button>
          ))}
        </nav>
      </div>
    </header>
  )
}
