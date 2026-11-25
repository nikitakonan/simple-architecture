import { type FavoritesStore, listFavorites } from './listFavorites'
import { mapTvmazeShow } from './mapTvmazeShow'

import type { Favorites } from '../contract'
import type { TvmazeShow } from '../tvmaze/types'

/** Anything that can find a show by id: the TVmaze client, a fake. */
export type LookupShow = (
  id: number,
  signal?: AbortSignal,
) => Promise<TvmazeShow | null>

export type AddFavoriteDeps = {
  store: FavoritesStore
  lookupShow: LookupShow
  signal?: AbortSignal
}

export type AddFavoriteResult =
  | { ok: true; value: Favorites }
  | { ok: false; error: 'not-found' }

/**
 * Adds show `id` to the favorites. The show is looked up on TVmaze, so the
 * list holds real show data whatever the client sends. Adding a favorite
 * twice changes nothing and doesn't ask TVmaze again.
 */
export async function addFavorite(
  id: number,
  { store, lookupShow, signal }: AddFavoriteDeps,
): Promise<AddFavoriteResult> {
  if (!(await store.has(id))) {
    const show = await lookupShow(id, signal)
    if (!show) return { ok: false, error: 'not-found' }
    await store.add(mapTvmazeShow(show))
  }
  return { ok: true, value: await listFavorites(store) }
}
