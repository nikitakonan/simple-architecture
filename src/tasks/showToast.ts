import { toastStore } from '~/stores/toastStore'

export const TOAST_MS = 3000

/** Shows one short message; a new one replaces the old one. */
export function showToast(text: string): void {
  // The id changes every time, so the same text shown twice restarts the timer.
  const id = (toastStore.getState().toast?.id ?? 0) + 1
  toastStore.setState({ toast: { id, text } })

  // Only the latest message hides itself; an older timer can't cut it short.
  setTimeout(() => {
    if (toastStore.getState().toast?.id === id) {
      toastStore.setState({ toast: null })
    }
  }, TOAST_MS)
}
