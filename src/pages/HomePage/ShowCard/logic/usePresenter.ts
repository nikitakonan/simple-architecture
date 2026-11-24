import { useMemo } from 'react'

import type { Show } from '../../../../api/types'
import { useFavorites } from '../../../../hooks/useFavorites'
import { toggleFavorite } from '../../../../services/favorites'
import { getFavoriteLabel } from '../../../../tasks/getFavoriteLabel'
import { isFavorite } from '../../../../tasks/isFavorite'
import { isSavingFavorite } from '../../../../tasks/isSavingFavorite'
import { formatShow } from './tasks/formatShow'

export type ShowCardProps = {
  show: Show
}

export function usePresenter({ show }: ShowCardProps) {
  // formatShow parses the HTML summary, so don't redo it on every render.
  const card = useMemo(() => formatShow(show), [show])
  // Each card reads only its own star, so it re-renders only when that changes.
  const favorite = useFavorites((state) => isFavorite(state, show.id))
  const saving = useFavorites((state) => isSavingFavorite(state, show.id))

  return {
    card,
    favoriteLabel: getFavoriteLabel(card),
    isFavorite: favorite,
    isSavingFavorite: saving,
    toggleFavorite: () => toggleFavorite(show),
  }
}
