import { useStore } from 'zustand'

import { favoritesStore } from '../stores/favoritesStore'
import type { FavoritesState } from '../stores/types'

/**
 * One value from the favorites store; the component re-renders only when that
 * value changes. `select` must return a primitive or a stored value, never a
 * new object or array, or React re-renders forever.
 */
export function useFavorites<T>(select: (state: FavoritesState) => T): T {
  return useStore(favoritesStore, select)
}
