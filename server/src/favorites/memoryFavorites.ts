import type { FavoritesDb } from '../tasks/listFavorites'

import type { Show } from '../contract'

/**
 * Every user's favorite shows, kept in plain objects: user email → show id →
 * show. It sits behind an async API so it can be swapped for a real database
 * (D1, KV) without touching the tasks. It lives as long as the Worker
 * instance does: a cold start, a deploy, or another instance starts empty.
 */
export function createMemoryFavorites(): FavoritesDb {
  const favoritesByUser: Record<string, Record<number, Show>> = {}

  return {
    forUser(email) {
      // Created on first use; an account that never saved one stays absent.
      const own = () => {
        favoritesByUser[email] ??= {}
        return favoritesByUser[email]
      }
      return {
        async list() {
          // Copies, so callers can't change the stored rows by accident.
          return Object.values(favoritesByUser[email] ?? {}).map((show) =>
            structuredClone(show),
          )
        },
        async has(id) {
          return Object.hasOwn(favoritesByUser[email] ?? {}, id)
        },
        async add(show) {
          own()[show.id] = structuredClone(show)
        },
        async remove(id) {
          delete favoritesByUser[email]?.[id]
        },
      }
    },
  }
}
