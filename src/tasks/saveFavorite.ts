import type { Favorites } from '~/api/types'

/** Anything that can change the favorites: the API client, a fake. */
export type FavoritesApi = {
  addFavorite: (id: number) => Promise<Favorites>
  removeFavorite: (id: number) => Promise<Favorites>
}

export type FavoriteChange = {
  id: number
  /** `true` to add the show, `false` to remove it. */
  favorite: boolean
}

/** Saves the change on the server and returns the list it now holds. */
export function saveFavorite(
  { id, favorite }: FavoriteChange,
  api: FavoritesApi,
): Promise<Favorites> {
  return favorite ? api.addFavorite(id) : api.removeFavorite(id)
}
