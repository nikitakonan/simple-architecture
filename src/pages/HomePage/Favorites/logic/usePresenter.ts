import {
  type KeyboardEvent,
  useEffect,
  useId,
  useMemo,
  useRef,
  useState,
} from 'react'

import { useFavorites } from '~/hooks/useFavorites'
import { toggleFavorite } from '~/services/favorites'
import { isSavingFavorite } from '~/tasks/isSavingFavorite'
import { toFavoriteRow } from './tasks/toFavoriteRow'

export function usePresenter() {
  const items = useFavorites((state) => state.items)
  const savingIds = useFavorites((state) => state.savingIds)
  const [isOpen, setIsOpen] = useState(false)
  const rootRef = useRef<HTMLDivElement>(null)
  const panelId = useId()

  // A click anywhere outside the button and the panel closes the panel.
  useEffect(() => {
    if (!isOpen) return
    const closeOnOutsideClick = (event: PointerEvent) => {
      if (!rootRef.current?.contains(event.target as Node)) setIsOpen(false)
    }
    document.addEventListener('pointerdown', closeOnOutsideClick)
    return () =>
      document.removeEventListener('pointerdown', closeOnOutsideClick)
  }, [isOpen])

  return {
    rootRef,
    panelId,
    isOpen,
    count: items.length,
    rows: useMemo(() => items.map(toFavoriteRow), [items]),
    isSaving: (id: number) => isSavingFavorite({ savingIds }, id),
    // The panel reports an id; the task toggles the whole show.
    toggleById: (id: number) => {
      const show = items.find((item) => item.id === id)
      if (show) toggleFavorite(show)
    },
    toggleOpen: () => setIsOpen((open) => !open),
    close: () => setIsOpen(false),
    closeOnEscape: (event: KeyboardEvent) => {
      if (event.key === 'Escape') setIsOpen(false)
    },
  }
}
