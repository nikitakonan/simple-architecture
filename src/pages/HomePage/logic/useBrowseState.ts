import { useCallback, useState } from 'react'

/**
 * The selected genre and page of the results for `query`. A new query starts
 * again from all genres and the first page, and so does a new genre.
 */
export function useBrowseState(query: string) {
  const [genre, setGenre] = useState<string | null>(null)
  const [page, setPage] = useState(1)
  const [prevQuery, setPrevQuery] = useState(query)

  if (query !== prevQuery) {
    setPrevQuery(query)
    setGenre(null)
    setPage(1)
  }

  const selectGenre = useCallback((next: string | null) => {
    setGenre(next)
    setPage(1)
  }, [])

  return { genre, page, selectGenre, setPage }
}
