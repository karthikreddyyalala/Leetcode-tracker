'use client'
import { useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { CheckCircle, X } from '@phosphor-icons/react'

export type Toast = {
  id: string
  message: string
}

type Props = {
  toasts: Toast[]
  onDismiss: (id: string) => void
}

function ToastItem({ toast, onDismiss }: { toast: Toast; onDismiss: (id: string) => void }) {
  useEffect(() => {
    const timer = setTimeout(() => onDismiss(toast.id), 3000)
    return () => clearTimeout(timer)
  }, [toast.id, onDismiss])

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 16, scale: 0.96 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, y: -8, scale: 0.96 }}
      transition={{ type: 'spring', stiffness: 320, damping: 26 }}
      className="flex items-center gap-2.5 rounded-xl border border-zinc-700/60 bg-zinc-900 px-4 py-3 shadow-[0_8px_24px_-6px_rgba(0,0,0,0.5)]"
    >
      <CheckCircle weight="fill" size={15} className="shrink-0 text-emerald-400" />
      <span className="text-sm font-medium text-zinc-200">{toast.message}</span>
      <button
        onClick={() => onDismiss(toast.id)}
        className="ml-1 flex h-4 w-4 shrink-0 items-center justify-center rounded text-zinc-600 transition-base hover:text-zinc-300"
      >
        <X size={10} />
      </button>
    </motion.div>
  )
}

export function ToastContainer({ toasts, onDismiss }: Props) {
  return (
    <div className="fixed bottom-5 right-5 z-50 flex flex-col items-end gap-2">
      <AnimatePresence mode="popLayout">
        {toasts.map((t) => (
          <ToastItem key={t.id} toast={t} onDismiss={onDismiss} />
        ))}
      </AnimatePresence>
    </div>
  )
}
