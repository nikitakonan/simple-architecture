import type { Show } from '../../contract'
import type { FavoritesStore } from '../listFavorites'

/** An in-memory `FavoritesStore` for task tests. */
export function fakeStore(
  shows: Pick<Show, 'id' | 'name'>[] = [],
): FavoritesStore {
  const map = new Map(shows.map((show) => [show.id, show as Show]))
  return {
    list: async () => [...map.values()],
    has: async (id) => map.has(id),
    add: async (show) => {
      map.set(show.id, show)
    },
    remove: async (id) => {
      map.delete(id)
    },
  }
}
