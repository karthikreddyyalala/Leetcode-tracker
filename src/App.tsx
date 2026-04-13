import { useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { NavBar } from './components/nav-bar'
import { DashboardPage } from './pages/dashboard-page'
import { HistoryPage } from './pages/history-page'
import { useProblems } from './hooks/use-problems'
import { isDueToday } from './lib/dates'

type Page = 'dashboard' | 'history'

const pageVariants = {
  initial: { opacity: 0, y: 10 },
  animate: { opacity: 1, y: 0 },
  exit: { opacity: 0, y: -6 },
}

export default function App() {
  const [page, setPage] = useState<Page>('dashboard')
  const { problems, addProblem, markReviewed, deleteProblem } = useProblems()

  const dueCount = problems.filter((p) => isDueToday(p.nextReview)).length

  return (
    <div className="min-h-[100dvh] bg-zinc-950 font-sans">
      <NavBar current={page} onChange={setPage} dueCount={dueCount} />

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
              onAdd={addProblem}
              onReview={markReviewed}
              onDelete={deleteProblem}
            />
          ) : (
            <HistoryPage
              problems={problems}
              onReview={markReviewed}
              onDelete={deleteProblem}
            />
          )}
        </motion.main>
      </AnimatePresence>
    </div>
  )
}
