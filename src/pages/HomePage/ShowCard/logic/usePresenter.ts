import { useMemo } from 'react'

import type { Show } from '../../../../api/types'
import { getFavoriteLabel } from '../../../../tasks/getFavoriteLabel'
import { formatShow } from './tasks/formatShow'

export type ShowCardProps = {
  show: Show
  isFavorite: boolean
  isSavingFavorite: boolean
  onToggleFavorite: (show: Show) => void
}

export function usePresenter({
  show,
  isFavorite,
  isSavingFavorite,
  onToggleFavorite,
}: ShowCardProps) {
  // formatShow parses the HTML summary, so don't redo it on every render.
  const card = useMemo(() => formatShow(show), [show])

  return {
    card,
    favoriteLabel: getFavoriteLabel(card),
    isFavorite,
    isSavingFavorite,
    toggleFavorite: () => onToggleFavorite(show),
  }
}
