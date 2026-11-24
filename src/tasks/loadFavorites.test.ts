import type { Show } from '../api/types'
import type { FavoritesState } from '../stores/types'

import { LOAD_FAVORITES_ERROR, loadFavorites } from './loadFavorites'

const lost = { id: 1, name: 'Lost' } as Show

function setup() {
  let state: FavoritesState = {
    items: [],
    savingIds: [],
    lastSent: 0,
    lastApplied: 0,
  }
  const store = {
    getState: () => state,
    setState: (patch: Partial<FavoritesState>) => {
      state = { ...state, ...patch }
    },
  }
  return { store, notify: vi.fn(), api: { fetchFavorites: vi.fn() } }
}

describe('loadFavorites', () => {
  it('stores the favorites from the server', async () => {
    const { store, notify, api } = setup()
    api.fetchFavorites.mockResolvedValue({ items: [lost] })
    const signal = new AbortController().signal

    await loadFavorites({ api, store, notify, signal })

    expect(api.fetchFavorites).toHaveBeenCalledWith(signal)
    expect(store.getState()).toMatchObject({ items: [lost], lastApplied: 1 })
    expect(notify).not.toHaveBeenCalled()
  })

  it('notifies when the favorites fail to load', async () => {
    const { store, notify, api } = setup()
    api.fetchFavorites.mockRejectedValue(new Error('down'))

    await loadFavorites({ api, store, notify })

    expect(notify).toHaveBeenCalledWith(LOAD_FAVORITES_ERROR)
  })

  it('stays quiet when the load was cancelled', async () => {
    const { store, notify, api } = setup()
    const controller = new AbortController()
    api.fetchFavorites.mockImplementation(() => {
      controller.abort()
      return Promise.reject(new Error('aborted'))
    })

    await loadFavorites({ api, store, notify, signal: controller.signal })

    expect(notify).not.toHaveBeenCalled()
  })
})
