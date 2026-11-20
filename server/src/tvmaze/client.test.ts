import { afterEach, describe, expect, it, vi } from 'vitest'

import { lookupTvmazeShow, searchTvmaze } from './client'

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

describe('lookupTvmazeShow', () => {
  afterEach(() => {
    vi.unstubAllGlobals()
  })

  it('requests the show by id', async () => {
    const show = { id: 5, name: 'Lost' }
    const fetchMock = vi.fn().mockResolvedValue(Response.json(show))
    vi.stubGlobal('fetch', fetchMock)

    await expect(lookupTvmazeShow(5)).resolves.toEqual(show)
    expect(fetchMock.mock.calls[0][0]).toBe('https://api.tvmaze.com/shows/5')
  })

  it('returns null for an unknown show and throws on other errors', async () => {
    const fetchMock = vi
      .fn()
      .mockResolvedValueOnce(new Response('', { status: 404 }))
      .mockResolvedValueOnce(new Response('', { status: 500 }))
    vi.stubGlobal('fetch', fetchMock)

    await expect(lookupTvmazeShow(5)).resolves.toBeNull()
    await expect(lookupTvmazeShow(5)).rejects.toThrow('500')
  })
})
