import type { Favorites } from '~/api/types'
import { favoritesStore } from '~/stores/favoritesStore'

/**
 * Stores the list from the response to request number `request`, unless the
 * response to a newer request is already stored.
 */
export function applyFavorites(request: number, { items }: Favorites): void {
  if (request < favoritesStore.getState().lastApplied) return
  favoritesStore.setState({ items, lastApplied: request })
}
