import type { SearchResult, Show } from '../api/types'

import { findShows } from './findShows'

const show = (id: number) => ({ id, name: `Show ${id}` }) as Show

describe('findShows', () => {
  it('returns the shows of the search results in order', async () => {
    const results: SearchResult[] = [
      { score: 0.9, show: show(1) },
      { score: 0.5, show: show(2) },
    ]
    const search = vi.fn().mockResolvedValue(results)

    await expect(findShows('murder', { search })).resolves.toEqual([
      show(1),
      show(2),
    ])
  })

  it('passes the query and the abort signal to the search', async () => {
    const search = vi.fn().mockResolvedValue([])
    const { signal } = new AbortController()

    await findShows('murder', { search, signal })

    expect(search).toHaveBeenCalledWith('murder', signal)
  })

  it('lets search errors through', async () => {
    const search = vi.fn().mockRejectedValue(new Error('Network down'))

    await expect(findShows('murder', { search })).rejects.toThrow(
      'Network down',
    )
  })
})
