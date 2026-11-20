import type { Show } from '../contract'

/** The same shape a real database client would have: every call is async. */
export type MemoryFavorites = {
  list: () => Promise<Show[]>
  has: (id: number) => Promise<boolean>
  add: (show: Show) => Promise<void>
  remove: (id: number) => Promise<void>
}

/**
 * Favorite shows kept in a plain object keyed by show id, behind an async
 * API so it can be swapped for a real database (D1, KV) without touching the
 * tasks. It lives as long as the Worker instance does: a cold start, a
 * deploy, or another instance starts with an empty list.
 */
export function createMemoryFavorites(): MemoryFavorites {
  const favorite: Record<number, Show> = {}

  return {
    async list() {
      // Copies, so callers can't change the stored rows by accident.
      return Object.values(favorite).map((show) => structuredClone(show))
    },
    async has(id) {
      return Object.hasOwn(favorite, id)
    },
    async add(show) {
      favorite[show.id] = structuredClone(show)
    },
    async remove(id) {
      delete favorite[id]
    },
  }
}
