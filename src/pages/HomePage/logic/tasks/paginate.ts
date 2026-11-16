export type PageSlice<T> = {
  /** `page` clamped to the existing pages. */
  page: number
  pageCount: number
  pageItems: T[]
  /** Index of the first item of the page in `items`. */
  firstIndex: number
}

/** The items of one page. An empty list still has one (empty) page. */
export function paginate<T>(
  items: T[],
  page: number,
  pageSize: number,
): PageSlice<T> {
  const pageCount = Math.max(1, Math.ceil(items.length / pageSize))
  const currentPage = Math.min(Math.max(page, 1), pageCount)
  const firstIndex = (currentPage - 1) * pageSize
  return {
    page: currentPage,
    pageCount,
    pageItems: items.slice(firstIndex, firstIndex + pageSize),
    firstIndex,
  }
}
