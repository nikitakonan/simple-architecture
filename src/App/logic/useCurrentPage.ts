import { useStore } from 'zustand'

import { navigationStore } from '~/stores/navigationStore'

/** The page on screen: `home` or `login`. */
export function useCurrentPage() {
  return useStore(navigationStore, (state) => state.page)
}
