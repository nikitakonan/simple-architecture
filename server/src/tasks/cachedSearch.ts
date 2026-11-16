import type { SearchShows } from './browseShows'

import type { TvmazeSearchResult } from '../tvmaze/types'

/** Any key-value store with expiry: an in-memory map, a fake in tests. */
export type SearchCache = {
  get: (key: string) => TvmazeSearchResult[] | undefined
  set: (key: string, value: TvmazeSearchResult[]) => void
}

/**
 * Wraps `search` so repeated queries are answered from `cache`. Switching the
 * page or the genre sends the same query again, so this keeps those requests
 * from reaching TVmaze (and its rate limit).
 */
export function cachedSearch(
  search: SearchShows,
  cache: SearchCache,
): SearchShows {
  return async (query, signal) => {
    const key = query.trim().toLowerCase()
    const cached = cache.get(key)
    if (cached) return cached

    const results = await search(query, signal)
    cache.set(key, results)
    return results
  }
}
