import { describe, expect, it, vi } from 'vitest'

import { createApp } from './app'
import { AUTH_DEPS } from './authRoutes.testUtils'
import type { ShowsPage } from './contract'
import { createMemoryFavorites } from './favorites/memoryFavorites'
import type { TvmazeSearchResult, TvmazeShow } from './tvmaze/types'

const ENV = {
  ALLOWED_ORIGINS: 'https://example.github.io, http://localhost:5173',
}

function result(id: number, genres: string[]): TvmazeSearchResult {
  return { score: 1, show: { id, name: `Show ${id}`, genres } as TvmazeShow }
}

const RESULTS = [
  result(1, ['Drama']),
  result(2, ['Comedy']),
  result(3, ['Drama']),
  result(4, ['Drama']),
  result(5, ['Drama']),
]

function setup(search = vi.fn().mockResolvedValue(RESULTS)) {
  const app = createApp({
    search,
    favorites: createMemoryFavorites(),
    lookupShow: vi.fn(),
    ...AUTH_DEPS,
  })
  const get = (path: string, headers?: HeadersInit) =>
    app.request(path, { headers }, ENV)
  return { get, search }
}

describe('GET /shows', () => {
  it('returns a page of the filtered results', async () => {
    const { get, search } = setup()

    const response = await get('/shows?q=murder&genre=Drama&page=2')

    expect(response.status).toBe(200)
    expect(response.headers.get('Cache-Control')).toBe('public, max-age=300')
    const body: ShowsPage = await response.json()
    expect(body).toMatchObject({
      query: 'murder',
      genre: 'Drama',
      totalCount: 5,
      matchCount: 4,
      page: 2,
      pageCount: 2,
      pageSize: 3,
      firstIndex: 3,
    })
    expect(body.items.map((show) => show.id)).toEqual([5])
    expect(search).toHaveBeenCalledWith('murder', expect.any(AbortSignal))
  })

  it('rejects an invalid query without searching', async () => {
    const { get, search } = setup()

    const response = await get('/shows?q=%20')

    expect(response.status).toBe(400)
    await expect(response.json()).resolves.toEqual({
      error: 'Query parameter "q" is required.',
    })
    expect(search).not.toHaveBeenCalled()
  })

  it('answers 502 when TVmaze fails', async () => {
    vi.spyOn(console, 'error').mockImplementation(() => {})
    const { get } = setup(vi.fn().mockRejectedValue(new Error('down')))

    const response = await get('/shows?q=murder')

    expect(response.status).toBe(502)
    await expect(response.json()).resolves.toEqual({
      error: 'TVmaze did not respond. Try again later.',
    })
  })
})

describe('CORS', () => {
  it('allows the configured origins', async () => {
    const { get } = setup()

    const response = await get('/shows?q=murder', {
      Origin: 'http://localhost:5173',
    })

    expect(response.headers.get('Access-Control-Allow-Origin')).toBe(
      'http://localhost:5173',
    )
  })

  it('does not allow other origins', async () => {
    const { get } = setup()

    const response = await get('/shows?q=murder', {
      Origin: 'https://evil.example',
    })

    expect(response.headers.get('Access-Control-Allow-Origin')).toBeNull()
  })
})

it('answers 404 with a JSON error for unknown routes', async () => {
  const { get } = setup()

  const response = await get('/nope')

  expect(response.status).toBe(404)
  await expect(response.json()).resolves.toEqual({ error: 'Not found.' })
})
