import { describe, expect, it, vi } from 'vitest'

import { browseShows } from './browseShows'

import type { TvmazeSearchResult, TvmazeShow } from '../tvmaze/types'

function result(id: number, genres: string[]): TvmazeSearchResult {
  const show = { id, name: `Show ${id}`, genres } as TvmazeShow
  return { score: 1, show }
}

const RESULTS = [
  result(1, ['Drama', 'Crime']),
  result(2, ['Comedy']),
  result(3, ['Drama']),
  result(4, ['Drama', 'Mystery']),
  result(5, ['Drama']),
]

const ids = (page: { items: { id: number }[] }) => page.items.map((s) => s.id)

describe('browseShows', () => {
  it('returns one page of all results with their genres', async () => {
    const search = vi.fn().mockResolvedValue(RESULTS)

    const page = await browseShows(
      { query: 'murder', genre: null, page: 2 },
      { search, pageSize: 3 },
    )

    expect(ids(page)).toEqual([4, 5])
    expect(page).toMatchObject({
      query: 'murder',
      genre: null,
      totalCount: 5,
      matchCount: 5,
      page: 2,
      pageCount: 2,
      pageSize: 3,
      firstIndex: 3,
    })
    expect(page.genres.map((g) => g.name)).toEqual([
      'Comedy',
      'Crime',
      'Drama',
      'Mystery',
    ])
  })

  it('paginates the filtered list but counts genres over all results', async () => {
    const search = vi.fn().mockResolvedValue(RESULTS)

    const page = await browseShows(
      { query: 'murder', genre: 'Drama', page: 2 },
      { search, pageSize: 3 },
    )

    expect(ids(page)).toEqual([5])
    expect(page).toMatchObject({ totalCount: 5, matchCount: 4, pageCount: 2 })
    expect(page.genres).toContainEqual({ name: 'Comedy', count: 1 })
  })

  it('passes the query and the abort signal to the search', async () => {
    const search = vi.fn().mockResolvedValue([])
    const { signal } = new AbortController()

    await browseShows(
      { query: 'murder', genre: null, page: 1 },
      { search, pageSize: 3, signal },
    )

    expect(search).toHaveBeenCalledWith('murder', signal)
  })
})
