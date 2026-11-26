import { favoritesStore } from '~/stores/favoritesStore'

/**
 * Empties the favorites, for a guest. Responses to requests sent before now
 * belonged to the previous user, so they are ignored when they arrive.
 */
export function clearFavorites(): void {
  const request = favoritesStore.getState().lastSent + 1
  favoritesStore.setState({
    items: [],
    savingIds: [],
    lastSent: request,
    lastApplied: request,
  })
}
