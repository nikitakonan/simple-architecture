import { cacheSearch } from './tasks/cacheSearch'

import { createApp } from './app'
import { createMemoryCache } from './cache/memoryCache'
import { createMemoryFavorites } from './favorites/memoryFavorites'
import { lookupTvmazeShow, searchTvmaze } from './tvmaze/client'
import type { TvmazeSearchResult } from './tvmaze/types'

// The Worker entry point: wires the real implementations into the app.

// Lives as long as the Worker instance does, so it is a best-effort cache:
// paging through one search usually hits it, but a cold start begins empty.
const cache = createMemoryCache<TvmazeSearchResult[]>({
  ttlMs: 5 * 60 * 1000,
  maxEntries: 200,
})

export default createApp({
  search: cacheSearch(searchTvmaze, cache),
  // One list for everyone, in memory: it is lost when the instance restarts.
  favorites: createMemoryFavorites(),
  lookupShow: lookupTvmazeShow,
})
