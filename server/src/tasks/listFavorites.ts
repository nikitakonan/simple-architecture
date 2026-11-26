import type { Favorites, Show } from '../contract'

/** Where favorites are kept: a database, a plain object, a fake in tests. */
export type FavoritesStore = {
  list: () => Promise<Show[]>
  has: (id: number) => Promise<boolean>
  add: (show: Show) => Promise<void>
  remove: (id: number) => Promise<void>
}

/** The favorites of every user: `forUser(email)` is that user's own list. */
export type FavoritesDb = {
  forUser: (email: string) => FavoritesStore
}

/** The favorite shows, sorted by name so the list reads like a shelf. */
export async function listFavorites(store: FavoritesStore): Promise<Favorites> {
  const items = await store.list()
  return { items: items.sort((a, b) => a.name.localeCompare(b.name)) }
}
