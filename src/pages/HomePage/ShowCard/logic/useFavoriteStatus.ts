import { useStore } from 'zustand'

import { favoritesStore } from '~/stores/favoritesStore'
import { isFavorite } from '~/tasks/isFavorite'
import { isSavingFavorite } from '~/tasks/isSavingFavorite'

/**
 * The star of one card: whether the show is a favorite and whether its change
 * is still being saved. Both are booleans, so a card re-renders only when its
 * own star changes, not when another show is added or removed.
 */
export function useFavoriteStatus(showId: number) {
  return {
    isFavorite: useStore(favoritesStore, (state) => isFavorite(state, showId)),
    isSaving: useStore(favoritesStore, (state) =>
      isSavingFavorite(state, showId),
    ),
  }
}
