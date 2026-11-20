import { describe, expect, it, vi } from 'vitest'

import { createApp } from './app'
import type { Favorites } from './contract'
import { createMemoryFavorites } from './favorites/memoryFavorites'
import type { TvmazeShow } from './tvmaze/types'

const ENV = { ALLOWED_ORIGINS: 'http://localhost:5173' }

function tvmazeShow(id: number, name: string) {
  return { id, name, genres: [] } as unknown as TvmazeShow
}

function setup(lookupShow = vi.fn(async (id: number) => tvmazeShow(id, 'X'))) {
  const app = createApp({
    search: vi.fn(),
    favorites: createMemoryFavorites(),
    lookupShow,
  })
  const call = (method: string, path: string, headers?: HeadersInit) =>
    app.request(path, { method, headers }, ENV)
  return { call, lookupShow }
}

const names = async (response: Response) =>
  ((await response.json()) as Favorites).items.map((show) => show.name)

describe('/favorites', () => {
  it('adds, lists and removes favorites', async () => {
    const lookupShow = vi.fn(async (id: number) =>
      tvmazeShow(id, id === 1 ? 'Lost' : 'Fargo'),
    )
    const { call } = setup(lookupShow)

    expect(await names(await call('PUT', '/favorites/1'))).toEqual(['Lost'])
    const added = await call('PUT', '/favorites/2')
    expect(added.headers.get('Cache-Control')).toBe('no-store')
    expect(await names(added)).toEqual(['Fargo', 'Lost'])
    expect(await names(await call('GET', '/favorites'))).toEqual([
      'Fargo',
      'Lost',
    ])
    expect(await names(await call('DELETE', '/favorites/2'))).toEqual(['Lost'])
  })

  it('rejects an invalid id', async () => {
    const { call, lookupShow } = setup()

    const response = await call('PUT', '/favorites/abc')

    expect(response.status).toBe(400)
    expect(lookupShow).not.toHaveBeenCalled()
  })

  it('answers 404 for a show TVmaze does not know', async () => {
    const { call } = setup(vi.fn().mockResolvedValue(null))

    const response = await call('PUT', '/favorites/9')

    expect(response.status).toBe(404)
    await expect(response.json()).resolves.toEqual({
      error: 'There is no show with id 9.',
    })
  })

  it('answers 502 when TVmaze fails', async () => {
    vi.spyOn(console, 'error').mockImplementation(() => {})
    const { call } = setup(vi.fn().mockRejectedValue(new Error('down')))

    expect((await call('PUT', '/favorites/9')).status).toBe(502)
  })

  it('allows PUT and DELETE from the configured origins', async () => {
    const { call } = setup()

    const response = await call('OPTIONS', '/favorites/1', {
      Origin: 'http://localhost:5173',
      'Access-Control-Request-Method': 'PUT',
    })

    expect(response.headers.get('Access-Control-Allow-Methods')).toContain(
      'DELETE',
    )
  })
})
