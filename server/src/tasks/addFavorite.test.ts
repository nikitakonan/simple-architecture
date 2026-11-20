import { describe, expect, it, vi } from 'vitest'

import { addFavorite } from './addFavorite'
import { fakeStore } from './testing/fakeStore'

import type { TvmazeShow } from '../tvmaze/types'

const tvmazeShow = { id: 5, name: 'Lost', genres: ['Drama'] } as TvmazeShow

describe('addFavorite', () => {
  it('looks the show up and adds it', async () => {
    const store = fakeStore([{ id: 1, name: 'Fargo' }])
    const lookupShow = vi.fn().mockResolvedValue(tvmazeShow)
    const { signal } = new AbortController()

    const result = await addFavorite(5, { store, lookupShow, signal })

    expect(lookupShow).toHaveBeenCalledWith(5, signal)
    expect(result.ok && result.value.items.map((s) => s.name)).toEqual([
      'Fargo',
      'Lost',
    ])
    await expect(store.has(5)).resolves.toBe(true)
  })

  it('does not look up a show that is already a favorite', async () => {
    const store = fakeStore([{ id: 5, name: 'Lost' }])
    const lookupShow = vi.fn()

    const result = await addFavorite(5, { store, lookupShow })

    expect(lookupShow).not.toHaveBeenCalled()
    expect(result.ok).toBe(true)
  })

  it('reports a show TVmaze does not know', async () => {
    const store = fakeStore()
    const lookupShow = vi.fn().mockResolvedValue(null)

    await expect(addFavorite(9, { store, lookupShow })).resolves.toEqual({
      ok: false,
      error: 'not-found',
    })
    await expect(store.list()).resolves.toEqual([])
  })
})
