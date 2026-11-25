import { useEffect } from 'react'

import * as favoritesApi from '~/api/favorites'
import { loadFavorites } from '~/tasks/loadFavorites'

/**
 * Loads the favorites from the server into the shared store once, when the
 * page mounts, and cancels the request if the page goes away first.
 */
export function useLoadFavorites(): void {
  useEffect(() => {
    const controller = new AbortController()
    void loadFavorites(favoritesApi, controller.signal)
    return () => controller.abort()
  }, [])
}
