import { useEffect } from 'react'

import * as favoritesApi from '~/api/favorites'
import { clearFavorites } from '~/tasks/clearFavorites'
import { loadFavorites } from '~/tasks/loadFavorites'

/**
 * Keeps the shared store on the favorites of `email`, the signed-in user:
 * loads them when someone signs in, empties them for a guest, and cancels a
 * load that the page or the user has left behind.
 */
export function useLoadFavorites(email: string | null): void {
  useEffect(() => {
    if (!email) {
      clearFavorites()
      return
    }
    const controller = new AbortController()
    void loadFavorites(favoritesApi, controller.signal)
    return () => controller.abort()
  }, [email])
}
