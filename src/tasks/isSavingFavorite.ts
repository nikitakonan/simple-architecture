import type { FavoritesState } from '~/stores/types'

/** Whether a change to the show with `id` is still being saved. */
export function isSavingFavorite(
  { savingIds }: Pick<FavoritesState, 'savingIds'>,
  id: number,
): boolean {
  return savingIds.includes(id)
}
