import type { Favorites } from '~/api/types'
import type { FavoritesState, Store } from '~/stores/types'

/**
 * Stores the list from the response to request number `request`, unless the
 * response to a newer request is already stored.
 */
export function applyFavorites(
  store: Store<FavoritesState>,
  request: number,
  { items }: Favorites,
): void {
  if (request < store.getState().lastApplied) return
  store.setState({ items, lastApplied: request })
}
