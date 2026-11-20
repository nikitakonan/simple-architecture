import { useCallback, useEffect, useState } from 'react'

export type ToastMessage = { id: number; text: string }

const TOAST_MS = 3000

/** One short message at a time; a new one replaces the old one. */
export function useToast() {
  const [toast, setToast] = useState<ToastMessage | null>(null)

  useEffect(() => {
    if (!toast) return
    const timer = setTimeout(() => setToast(null), TOAST_MS)
    return () => clearTimeout(timer)
  }, [toast])

  // The id changes every time, so the same text shown twice restarts the timer.
  const showToast = useCallback((text: string) => {
    setToast((prev) => ({ id: (prev?.id ?? 0) + 1, text }))
  }, [])

  return { toast, showToast }
}
