import type { Favorites } from '../api/types'
import type { FavoritesState, Store } from '../stores/types'

import { applyFavorites } from './applyFavorites'

export const LOAD_FAVORITES_ERROR = 'Couldn’t load your favorites.'

export type LoadFavoritesDeps = {
  api: { fetchFavorites: (signal?: AbortSignal) => Promise<Favorites> }
  store: Store<FavoritesState>
  notify: (message: string) => void
  signal?: AbortSignal
}

/** Loads the favorites from the server into the store. */
export async function loadFavorites({
  api,
  store,
  notify,
  signal,
}: LoadFavoritesDeps): Promise<void> {
  const request = store.getState().lastSent + 1
  store.setState({ lastSent: request })
  try {
    applyFavorites(store, request, await api.fetchFavorites(signal))
  } catch {
    // A cancelled load isn't a failure the user needs to hear about.
    if (!signal?.aborted) notify(LOAD_FAVORITES_ERROR)
  }
}
