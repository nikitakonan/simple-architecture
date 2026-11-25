import type { Show } from '~/api/types'
import { favoritesStore } from '~/stores/favoritesStore'

import { applyFavorites } from './applyFavorites'
import { describeFavoriteChange } from './describeFavoriteChange'
import { isFavorite } from './isFavorite'
import { isSavingFavorite } from './isSavingFavorite'
import { type FavoritesApi, saveFavorite } from './saveFavorite'
import { showToast } from './showToast'

export const SAVE_FAVORITE_ERROR = 'Couldn’t update your favorites. Try again.'

/**
 * Adds the show to the favorites or removes it, stores the list the server
 * answers with and tells the user. One request per show at a time, so double
 * clicks can't race.
 */
export async function toggleFavorite(
  show: Show,
  api: FavoritesApi,
): Promise<void> {
  const state = favoritesStore.getState()
  if (isSavingFavorite(state, show.id)) return
  const favorite = !isFavorite(state, show.id)
  const request = state.lastSent + 1
  favoritesStore.setState({
    lastSent: request,
    savingIds: [...state.savingIds, show.id],
  })

  try {
    const favorites = await saveFavorite({ id: show.id, favorite }, api)
    applyFavorites(request, favorites)
    showToast(describeFavoriteChange({ name: show.name, favorite }))
  } catch {
    showToast(SAVE_FAVORITE_ERROR)
  } finally {
    const { savingIds } = favoritesStore.getState()
    favoritesStore.setState({
      savingIds: savingIds.filter((id) => id !== show.id),
    })
  }
}
