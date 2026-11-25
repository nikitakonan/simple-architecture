import type { Favorites } from '~/api/types'
import { favoritesStore } from '~/stores/favoritesStore'

import { applyFavorites } from './applyFavorites'
import { showToast } from './showToast'

export const LOAD_FAVORITES_ERROR = 'Couldn’t load your favorites.'

export type LoadFavoritesApi = {
  fetchFavorites: (signal?: AbortSignal) => Promise<Favorites>
}

/** Loads the favorites from the server into the store. */
export async function loadFavorites(
  api: LoadFavoritesApi,
  signal?: AbortSignal,
): Promise<void> {
  const request = favoritesStore.getState().lastSent + 1
  favoritesStore.setState({ lastSent: request })
  try {
    applyFavorites(request, await api.fetchFavorites(signal))
  } catch {
    // A cancelled load isn't a failure the user needs to hear about.
    if (!signal?.aborted) showToast(LOAD_FAVORITES_ERROR)
  }
}
