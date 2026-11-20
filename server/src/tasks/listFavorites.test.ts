import { describe, expect, it } from 'vitest'

import { listFavorites } from './listFavorites'
import { fakeStore } from './testing/fakeStore'

describe('listFavorites', () => {
  it('lists the favorite shows sorted by name', async () => {
    const store = fakeStore([
      { id: 1, name: 'The Wire' },
      { id: 2, name: 'Fargo' },
    ])

    expect((await listFavorites(store)).items.map((show) => show.name)).toEqual(
      ['Fargo', 'The Wire'],
    )
  })
})
