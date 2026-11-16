import { afterEach, describe, expect, it, vi } from 'vitest'

import { searchTvmaze } from './client'

describe('searchTvmaze', () => {
  afterEach(() => {
    vi.unstubAllGlobals()
  })

  it('requests the search endpoint with an encoded query and signal', async () => {
    const body = [{ score: 1, show: { id: 1 } }]
    const fetchMock = vi
      .fn()
      .mockResolvedValue(new Response(JSON.stringify(body)))
    vi.stubGlobal('fetch', fetchMock)
    const { signal } = new AbortController()

    const results = await searchTvmaze('law & order', signal)

    expect(fetchMock).toHaveBeenCalledWith(
      'https://api.tvmaze.com/search/shows?q=law%20%26%20order',
      { signal },
    )
    expect(results).toEqual(body)
  })

  it('throws when the response is not ok', async () => {
    vi.stubGlobal(
      'fetch',
      vi.fn().mockResolvedValue(new Response('', { status: 429 })),
    )

    await expect(searchTvmaze('murder')).rejects.toThrow(
      'TVmaze request failed: 429',
    )
  })
})
