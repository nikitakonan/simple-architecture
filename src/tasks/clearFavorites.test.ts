import type { Show } from '~/api/types'
import { favoritesStore } from '~/stores/favoritesStore'

import { applyFavorites } from './applyFavorites'
import { clearFavorites } from './clearFavorites'

const lost = { id: 1, name: 'Lost' } as Show

describe('clearFavorites', () => {
  it('empties the list and ignores answers to earlier requests', () => {
    favoritesStore.setState({ items: [lost], savingIds: [1], lastSent: 3 })

    clearFavorites()
    applyFavorites(3, { items: [lost] })

    expect(favoritesStore.getState()).toMatchObject({
      items: [],
      savingIds: [],
    })
  })
})
