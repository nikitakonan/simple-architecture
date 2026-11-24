import * as favoritesApi from '~/api/favorites'
import type { Show } from '~/api/types'
import { favoritesStore } from '~/stores/favoritesStore'
import { toastStore } from '~/stores/toastStore'
import { loadFavorites as loadFavoritesTask } from '~/tasks/loadFavorites'
import { showToast } from '~/tasks/showToast'
import { toggleFavorite as toggleFavoriteTask } from '~/tasks/toggleFavorite'

// The favorites tasks with their real dependencies, wired once for the app.

const notify = (text: string) =>
  showToast(text, {
    store: toastStore,
    schedule: (callback, ms) => {
      setTimeout(callback, ms)
    },
  })

const deps = { api: favoritesApi, store: favoritesStore, notify }

/** Loads the favorites from the server into the store. */
export function loadFavorites(signal?: AbortSignal): Promise<void> {
  return loadFavoritesTask({ ...deps, signal })
}

/** Adds the show to the favorites or removes it; a toast tells the user. */
export function toggleFavorite(show: Show): void {
  void toggleFavoriteTask(show, deps)
}
