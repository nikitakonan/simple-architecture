import type { Show } from '~/api/types'
import { describeShowMeta } from '~/tasks/describeShowMeta'
import { getFavoriteLabel } from '~/tasks/getFavoriteLabel'

/** One row of the favorites list, ready to render. */
export type FavoriteRow = {
  id: number
  name: string
  meta: string
  imageUrl: string | null
  starLabel: string
}

export function toFavoriteRow(show: Show): FavoriteRow {
  const meta = describeShowMeta(show)
  return {
    id: show.id,
    name: show.name,
    meta,
    imageUrl: show.image?.medium ?? null,
    starLabel: getFavoriteLabel({ name: show.name, meta }),
  }
}
