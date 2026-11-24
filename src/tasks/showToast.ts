import type { Store, ToastState } from '../stores/types'

export const TOAST_MS = 3000

export type ShowToastDeps = {
  store: Store<ToastState>
  /** Runs `callback` after `ms` milliseconds: `setTimeout`, fake timers. */
  schedule: (callback: () => void, ms: number) => void
}

/** Shows one short message; a new one replaces the old one. */
export function showToast(text: string, { store, schedule }: ShowToastDeps) {
  // The id changes every time, so the same text shown twice restarts the timer.
  const id = (store.getState().toast?.id ?? 0) + 1
  store.setState({ toast: { id, text } })

  // Only the latest message hides itself; an older timer can't cut it short.
  schedule(() => {
    if (store.getState().toast?.id === id) store.setState({ toast: null })
  }, TOAST_MS)
}
