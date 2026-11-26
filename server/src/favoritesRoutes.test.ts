import { describe, expect, it, vi } from 'vitest'

import type { Favorites } from './contract'
import {
  ORIGIN,
  setup,
  signedIn,
  tvmazeShow,
} from './favoritesRoutes.testUtils'

const names = async (response: Response) =>
  ((await response.json()) as Favorites).items.map((show) => show.name)

describe('/favorites', () => {
  it('adds, lists and removes favorites', async () => {
    const { call } = await signedIn(
      vi.fn(async (id: number) => tvmazeShow(id, id === 1 ? 'Lost' : 'Fargo')),
    )

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

  it('refuses a guest', async () => {
    const { request, lookupShow } = setup()

    for (const method of ['GET', 'PUT', 'DELETE']) {
      const path = method === 'GET' ? '/favorites' : '/favorites/1'
      const response = await request(method, path, { Origin: ORIGIN })
      expect(response.status).toBe(401)
      await expect(response.json()).resolves.toEqual({
        error: 'Sign in to use favorites.',
      })
    }
    expect(lookupShow).not.toHaveBeenCalled()
  })

  it('keeps a separate list for every user', async () => {
    const { logIn, as } = setup()
    const ann = as(await logIn('ann@example.com'))
    const bob = as(await logIn('bob@example.com'))

    await ann('PUT', '/favorites/1')

    expect(await names(await bob('GET', '/favorites'))).toEqual([])
    expect(await names(await ann('GET', '/favorites'))).toEqual(['X'])
  })

  it('gives the same list back after logging out and in again', async () => {
    const { logIn, logOut, as } = setup()
    const first = await logIn('ann@example.com')
    await as(first)('PUT', '/favorites/1')
    await logOut(first)

    expect((await as(first)('GET', '/favorites')).status).toBe(401)
    const again = as(await logIn('Ann@Example.com'))
    expect(await names(await again('GET', '/favorites'))).toEqual(['X'])
  })

  it('rejects an invalid id', async () => {
    const { call, lookupShow } = await signedIn()

    const response = await call('PUT', '/favorites/abc')

    expect(response.status).toBe(400)
    expect(lookupShow).not.toHaveBeenCalled()
  })

  it('answers 404 for a show TVmaze does not know', async () => {
    const { call } = await signedIn(vi.fn().mockResolvedValue(null))

    const response = await call('PUT', '/favorites/9')

    expect(response.status).toBe(404)
    await expect(response.json()).resolves.toEqual({
      error: 'There is no show with id 9.',
    })
  })

  it('answers 502 when TVmaze fails', async () => {
    vi.spyOn(console, 'error').mockImplementation(() => {})
    const { call } = await signedIn(vi.fn().mockRejectedValue(new Error('x')))

    expect((await call('PUT', '/favorites/9')).status).toBe(502)
  })

  it('allows PUT and DELETE from the configured origins', async () => {
    const { request } = setup()

    const response = await request('OPTIONS', '/favorites/1', {
      Origin: ORIGIN,
      'Access-Control-Request-Method': 'PUT',
    })

    expect(response.headers.get('Access-Control-Allow-Methods')).toContain(
      'DELETE',
    )
  })
})
