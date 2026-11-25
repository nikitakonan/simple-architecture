import { useMemo } from 'react'

import type { Show } from '~/api/types'
import { toggleFavorite } from '~/services/favorites'
import { getFavoriteLabel } from '~/tasks/getFavoriteLabel'
import { formatShow } from './tasks/formatShow'

import { useFavoriteStatus } from './useFavoriteStatus'

export type ShowCardProps = {
  show: Show
}

export function usePresenter({ show }: ShowCardProps) {
  // formatShow parses the HTML summary, so don't redo it on every render.
  const card = useMemo(() => formatShow(show), [show])
  const { isFavorite, isSaving } = useFavoriteStatus(show.id)

  return {
    card,
    favoriteLabel: getFavoriteLabel(card),
    isFavorite,
    isSavingFavorite: isSaving,
    toggleFavorite: () => toggleFavorite(show),
  }
}
