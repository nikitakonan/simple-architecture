import type { Show } from '../api/types'
import type { FavoritesState, Store } from '../stores/types'

import { applyFavorites } from './applyFavorites'
import { describeFavoriteChange } from './describeFavoriteChange'
import { isFavorite } from './isFavorite'
import { isSavingFavorite } from './isSavingFavorite'
import { type FavoritesApi, saveFavorite } from './saveFavorite'

export const SAVE_FAVORITE_ERROR = 'Couldn’t update your favorites. Try again.'

export type ToggleFavoriteDeps = {
  api: FavoritesApi
  store: Store<FavoritesState>
  notify: (message: string) => void
}

/**
 * Adds the show to the favorites or removes it, stores the list the server
 * answers with and tells the user. One request per show at a time, so double
 * clicks can't race.
 */
export async function toggleFavorite(
  show: Show,
  { api, store, notify }: ToggleFavoriteDeps,
): Promise<void> {
  const state = store.getState()
  if (isSavingFavorite(state, show.id)) return
  const favorite = !isFavorite(state, show.id)
  const request = state.lastSent + 1
  store.setState({
    lastSent: request,
    savingIds: [...state.savingIds, show.id],
  })

  try {
    const favorites = await saveFavorite({ id: show.id, favorite }, api)
    applyFavorites(store, request, favorites)
    notify(describeFavoriteChange({ name: show.name, favorite }))
  } catch {
    notify(SAVE_FAVORITE_ERROR)
  } finally {
    const { savingIds } = store.getState()
    store.setState({ savingIds: savingIds.filter((id) => id !== show.id) })
  }
}
