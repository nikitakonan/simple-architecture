import { useStore } from 'zustand'

import { toastStore } from '~/stores/toastStore'

/** The toast on screen, or `null`. */
export function useToast() {
  return useStore(toastStore, (state) => state.toast)
}
