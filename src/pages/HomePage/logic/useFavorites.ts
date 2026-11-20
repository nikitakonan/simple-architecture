import { useCallback, useEffect, useMemo, useRef, useState } from 'react'

import * as favoritesApi from '../../../api/favorites'
import type { Favorites, Show } from '../../../api/types'
import { describeFavoriteChange } from './tasks/describeFavoriteChange'
import { saveFavorite } from './tasks/saveFavorite'

const LOAD_ERROR = 'Couldn’t load your favorites.'
const SAVE_ERROR = 'Couldn’t update your favorites. Try again.'

function without(ids: ReadonlySet<number>, id: number): ReadonlySet<number> {
  const next = new Set(ids)
  next.delete(id)
  return next
}

/**
 * The favorites live on the server: this hook loads them, sends each change,
 * and shows the list the server answers with. `notify` gets a message for
 * the toast after every change or failure.
 */
export function useFavorites(notify: (message: string) => void) {
  const [items, setItems] = useState<Show[]>([])
  const [savingIds, setSavingIds] = useState<ReadonlySet<number>>(new Set())
  // Requests are numbered so an older response never replaces a newer list.
  const lastSent = useRef(0)
  const lastApplied = useRef(0)

  const apply = useCallback((request: number, favorites: Favorites) => {
    if (request < lastApplied.current) return
    lastApplied.current = request
    setItems(favorites.items)
  }, [])

  useEffect(() => {
    const controller = new AbortController()
    const request = ++lastSent.current
    favoritesApi
      .fetchFavorites(controller.signal)
      .then((favorites) => apply(request, favorites))
      .catch(() => {
        if (!controller.signal.aborted) notify(LOAD_ERROR)
      })
    return () => controller.abort()
  }, [apply, notify])

  const ids = useMemo(() => new Set(items.map((show) => show.id)), [items])

  const toggle = useCallback(
    (show: Show) => {
      // One request per show at a time, so double clicks can't race.
      if (savingIds.has(show.id)) return
      const favorite = !ids.has(show.id)
      const request = ++lastSent.current
      setSavingIds((prev) => new Set(prev).add(show.id))

      saveFavorite({ id: show.id, favorite }, favoritesApi)
        .then((favorites) => {
          apply(request, favorites)
          notify(describeFavoriteChange({ name: show.name, favorite }))
        })
        .catch(() => notify(SAVE_ERROR))
        .finally(() => setSavingIds((prev) => without(prev, show.id)))
    },
    [ids, savingIds, apply, notify],
  )

  return {
    items,
    isFavorite: (id: number) => ids.has(id),
    isSaving: (id: number) => savingIds.has(id),
    toggle,
  }
}
