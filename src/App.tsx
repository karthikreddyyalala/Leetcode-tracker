import { useState, useCallback } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { NavBar } from './components/nav-bar'
import { DashboardPage } from './pages/dashboard-page'
import { HistoryPage } from './pages/history-page'
import { ToastContainer, type Toast } from './components/toast'
import { useProblems } from './hooks/use-problems'
import { isDueToday } from './lib/dates'
import type { Difficulty } from './types/problem'

type Page = 'dashboard' | 'history'

const pageVariants = {
  initial: { opacity: 0, y: 10 },
  animate: { opacity: 1, y: 0 },
  exit: { opacity: 0, y: -6 },
}

export default function App() {
  const [page, setPage] = useState<Page>('dashboard')
  const { problems, addProblem, markReviewed, deleteProblem, isSyncing } = useProblems()
  const [toasts, setToasts] = useState<Toast[]>([])

  const addToast = useCallback((message: string) => {
    const id = `${Date.now()}`
    setToasts((prev) => [...prev, { id, message }])
  }, [])

  const dismissToast = useCallback((id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id))
  }, [])

  const handleAdd = useCallback((data: { title: string; url: string; difficulty: Difficulty; dateSolved: string }) => {
    addProblem(data)
    addToast(`"${data.title}" added to tracker`)
  }, [addProblem, addToast])

  const handleReview = useCallback((id: string) => {
    const p = problems.find((x) => x.id === id)
    markReviewed(id)
    if (p) addToast(`"${p.title}" marked as reviewed`)
  }, [problems, markReviewed, addToast])

  const dueCount = problems.filter((p) => isDueToday(p.nextReview)).length

  return (
    <div className="min-h-[100dvh] bg-zinc-950 font-sans selection:bg-sky-500/20 selection:text-sky-300">
      <NavBar current={page} onChange={setPage} dueCount={dueCount} totalCount={problems.length} isSyncing={isSyncing} />

      <AnimatePresence mode="wait">
        <motion.main
          key={page}
          variants={pageVariants}
          initial="initial"
          animate="animate"
          exit="exit"
          transition={{ type: 'spring', stiffness: 260, damping: 28 }}
        >
          {page === 'dashboard' ? (
            <DashboardPage
              problems={problems}
              onAdd={handleAdd}
              onReview={handleReview}
              onDelete={deleteProblem}
            />
          ) : (
            <HistoryPage
              problems={problems}
              onReview={handleReview}
              onDelete={deleteProblem}
            />
          )}
        </motion.main>
      </AnimatePresence>
      <ToastContainer toasts={toasts} onDismiss={dismissToast} />
    </div>
  )
}
