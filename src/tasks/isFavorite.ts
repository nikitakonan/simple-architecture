import type { FavoritesState } from '~/stores/types'

/** Whether the show with `id` is one of the favorites. */
export function isFavorite(
  { items }: Pick<FavoritesState, 'items'>,
  id: number,
): boolean {
  return items.some((show) => show.id === id)
}
