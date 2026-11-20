import { requestJson } from './request'
import type { Favorites } from './types'

/** `GET /favorites`: the favorite shows, kept on the server. */
export function fetchFavorites(signal?: AbortSignal): Promise<Favorites> {
  return requestJson('/favorites', { signal })
}

/** `PUT /favorites/:id`: adds a show and returns the updated list. */
export function addFavorite(id: number): Promise<Favorites> {
  return requestJson(`/favorites/${id}`, { method: 'PUT' })
}

/** `DELETE /favorites/:id`: removes a show and returns the updated list. */
export function removeFavorite(id: number): Promise<Favorites> {
  return requestJson(`/favorites/${id}`, { method: 'DELETE' })
}
