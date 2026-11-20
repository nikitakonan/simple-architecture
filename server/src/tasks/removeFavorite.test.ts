import { describe, expect, it } from 'vitest'

import { removeFavorite } from './removeFavorite'
import { fakeStore } from './testing/fakeStore'

describe('removeFavorite', () => {
  it('removes the show and returns the rest', async () => {
    const store = fakeStore([
      { id: 1, name: 'Fargo' },
      { id: 2, name: 'Lost' },
    ])

    const ids = async () =>
      (await removeFavorite(1, store)).items.map((s) => s.id)

    expect(await ids()).toEqual([2])
    expect(await ids()).toEqual([2])
  })
})
