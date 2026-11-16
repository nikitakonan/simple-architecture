import { describe, expect, it, vi } from 'vitest'

import { cachedSearch, type SearchCache } from './cachedSearch'

import type { TvmazeSearchResult } from '../tvmaze/types'

function mapCache(): SearchCache {
  const map = new Map<string, TvmazeSearchResult[]>()
  return {
    get: (key) => map.get(key),
    set: (key, value) => map.set(key, value),
  }
}

const RESULTS = [{ score: 1, show: { id: 1 } }] as TvmazeSearchResult[]

describe('cachedSearch', () => {
  it('searches once per query, ignoring case and spaces', async () => {
    const search = vi.fn().mockResolvedValue(RESULTS)
    const cached = cachedSearch(search, mapCache())

    await expect(cached('Murder')).resolves.toBe(RESULTS)
    await expect(cached(' murder ')).resolves.toBe(RESULTS)

    expect(search).toHaveBeenCalledTimes(1)
  })

  it('does not cache failures', async () => {
    const search = vi
      .fn()
      .mockRejectedValueOnce(new Error('Network down'))
      .mockResolvedValueOnce(RESULTS)
    const cached = cachedSearch(search, mapCache())

    await expect(cached('murder')).rejects.toThrow('Network down')
    await expect(cached('murder')).resolves.toBe(RESULTS)
  })
})
