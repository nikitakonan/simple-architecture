import { type FavoritesStore, listFavorites } from './listFavorites'

import type { Favorites } from '../contract'

/** Removes show `id` from the favorites; removing a missing one is a no-op. */
export async function removeFavorite(
  id: number,
  store: FavoritesStore,
): Promise<Favorites> {
  await store.remove(id)
  return listFavorites(store)
}
