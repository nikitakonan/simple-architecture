import { requestJson } from './request'
import type { Favorites } from './types'

// The favorites belong to the signed-in user, whom the API knows by the
// session cookie, so every request sends it.
const WITH_COOKIE: RequestInit = { credentials: 'include' }

/** `GET /favorites`: the user's favorite shows, kept on the server. */
export function fetchFavorites(signal?: AbortSignal): Promise<Favorites> {
  return requestJson('/favorites', { ...WITH_COOKIE, signal })
}

/** `PUT /favorites/:id`: adds a show and returns the updated list. */
export function addFavorite(id: number): Promise<Favorites> {
  return requestJson(`/favorites/${id}`, { ...WITH_COOKIE, method: 'PUT' })
}

/** `DELETE /favorites/:id`: removes a show and returns the updated list. */
export function removeFavorite(id: number): Promise<Favorites> {
  return requestJson(`/favorites/${id}`, { ...WITH_COOKIE, method: 'DELETE' })
}
