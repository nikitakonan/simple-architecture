import {
  type KeyboardEvent,
  useEffect,
  useId,
  useMemo,
  useRef,
  useState,
} from 'react'

import type { Show } from '../../../../api/types'
import { toFavoriteRow } from './tasks/toFavoriteRow'

export type FavoritesProps = {
  items: Show[]
  isSaving: (id: number) => boolean
  onToggle: (show: Show) => void
}

export function usePresenter({ items, isSaving, onToggle }: FavoritesProps) {
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
    isSaving,
    // The panel reports an id; the page toggles the whole show.
    toggleById: (id: number) => {
      const show = items.find((item) => item.id === id)
      if (show) onToggle(show)
    },
    toggleOpen: () => setIsOpen((open) => !open),
    close: () => setIsOpen(false),
    closeOnEscape: (event: KeyboardEvent) => {
      if (event.key === 'Escape') setIsOpen(false)
    },
  }
}
