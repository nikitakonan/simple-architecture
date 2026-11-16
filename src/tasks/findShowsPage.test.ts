import type { ShowsPage } from '../api/types'

import { findShowsPage } from './findShowsPage'

const PAGE = { query: 'murder' } as ShowsPage

describe('findShowsPage', () => {
  it('normalises the request and passes the signal on', async () => {
    const fetchPage = vi.fn().mockResolvedValue(PAGE)
    const { signal } = new AbortController()

    await expect(
      findShowsPage(
        { query: ' murder ', genre: ' ', page: 0 },
        { fetchPage, signal },
      ),
    ).resolves.toBe(PAGE)

    expect(fetchPage).toHaveBeenCalledWith(
      { query: 'murder', genre: null, page: 1 },
      signal,
    )
  })

  it('keeps the genre and the page', async () => {
    const fetchPage = vi.fn().mockResolvedValue(PAGE)

    await findShowsPage(
      { query: 'murder', genre: 'Drama', page: 3 },
      { fetchPage },
    )

    expect(fetchPage).toHaveBeenCalledWith(
      { query: 'murder', genre: 'Drama', page: 3 },
      undefined,
    )
  })

  it('lets errors through', async () => {
    const fetchPage = vi.fn().mockRejectedValue(new Error('Network down'))

    await expect(
      findShowsPage({ query: 'murder', genre: null, page: 1 }, { fetchPage }),
    ).rejects.toThrow('Network down')
  })
})
