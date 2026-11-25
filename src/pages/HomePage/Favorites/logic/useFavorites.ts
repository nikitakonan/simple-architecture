import { useStore } from 'zustand'

import { favoritesStore } from '~/stores/favoritesStore'

/**
 * The favorites list for the header panel: the shows and the ids still being
 * saved. Each value is read on its own, so the panel re-renders only when one
 * of them changes.
 */
export function useFavorites() {
  const items = useStore(favoritesStore, (state) => state.items)
  const savingIds = useStore(favoritesStore, (state) => state.savingIds)
  return { items, savingIds }
}
