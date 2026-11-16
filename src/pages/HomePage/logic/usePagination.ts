import { useState } from 'react'

import { paginate } from './tasks/paginate'

export function usePagination<T>(items: T[], pageSize: number) {
  const [page, setPage] = useState(1)
  const [prevItems, setPrevItems] = useState(items)

  // A new list (new search or genre) starts again from the first page.
  // `items` must be memoized by the caller, or this resets on every render.
  if (items !== prevItems) {
    setPrevItems(items)
    setPage(1)
  }

  return { ...paginate(items, page, pageSize), setPage }
}
