import { toastStore } from '~/stores/toastStore'
import { showToast } from '~/tasks/showToast'

const notify = (text: string) =>
  showToast(text, {
    store: toastStore,
    schedule: (callback, ms) => {
      setTimeout(callback, ms)
    },
  })

/** A stable function that shows a short message in the app's toast. */
export function useNotify(): (text: string) => void {
  return notify
}
