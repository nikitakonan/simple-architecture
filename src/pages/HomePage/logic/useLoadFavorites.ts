import { useEffect } from 'react'

import * as favoritesApi from '~/api/favorites'
import { useNotify } from '~/hooks/useNotify'
import { favoritesStore } from '~/stores/favoritesStore'
import { loadFavorites } from '~/tasks/loadFavorites'

/**
 * Loads the favorites from the server into the shared store once, when the
 * page mounts, and cancels the request if the page goes away first.
 */
export function useLoadFavorites(): void {
  const notify = useNotify()
  useEffect(() => {
    const controller = new AbortController()
    void loadFavorites({
      api: favoritesApi,
      store: favoritesStore,
      notify,
      signal: controller.signal,
    })
    return () => controller.abort()
  }, [notify])
}
