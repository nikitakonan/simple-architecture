import { useMemo, useState } from 'react'

import { countGenres } from './tasks/countGenres'
import { filterByGenre } from './tasks/filterByGenre'

type WithGenres = { genres: string[] }

/**
 * Unique genres of `items` with counts, plus the list filtered by the selected
 * genre. A new `items` list (a new search) clears the selection.
 */
export function useGenreFilter<T extends WithGenres>(items: T[]) {
  const [selectedGenre, setSelectedGenre] = useState<string | null>(null)
  const [prevItems, setPrevItems] = useState(items)

  if (items !== prevItems) {
    setPrevItems(items)
    setSelectedGenre(null)
  }

  const genres = useMemo(() => countGenres(items), [items])
  const filteredItems = useMemo(
    () => filterByGenre(items, selectedGenre),
    [items, selectedGenre],
  )

  return {
    genres,
    selectedGenre,
    selectGenre: setSelectedGenre,
    filteredItems,
  }
}
