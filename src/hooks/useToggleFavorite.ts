import { useCallback } from 'react'

import * as favoritesApi from '~/api/favorites'
import type { Show } from '~/api/types'
import { favoritesStore } from '~/stores/favoritesStore'
import { toggleFavorite } from '~/tasks/toggleFavorite'

import { useNotify } from './useNotify'

/**
 * A function that adds the show to the favorites or removes it, wired to the
 * real API and stores; a toast tells the user.
 */
export function useToggleFavorite(): (show: Show) => void {
  const notify = useNotify()
  return useCallback(
    (show: Show) => {
      void toggleFavorite(show, {
        api: favoritesApi,
        store: favoritesStore,
        notify,
      })
    },
    [notify],
  )
}
