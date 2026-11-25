import type { Show } from '~/api/types'
import { favoritesStore } from '~/stores/favoritesStore'
import { toastStore } from '~/stores/toastStore'

import { LOAD_FAVORITES_ERROR, loadFavorites } from './loadFavorites'

const lost = { id: 1, name: 'Lost' } as Show

describe('loadFavorites', () => {
  it('stores the favorites from the server', async () => {
    const api = { fetchFavorites: vi.fn().mockResolvedValue({ items: [lost] }) }
    const signal = new AbortController().signal

    await loadFavorites(api, signal)

    expect(api.fetchFavorites).toHaveBeenCalledWith(signal)
    expect(favoritesStore.getState()).toMatchObject({
      items: [lost],
      lastApplied: 1,
    })
    expect(toastStore.getState().toast).toBeNull()
  })

  it('shows a toast when the favorites fail to load', async () => {
    const api = { fetchFavorites: vi.fn().mockRejectedValue(new Error('down')) }

    await loadFavorites(api)

    expect(toastStore.getState().toast?.text).toBe(LOAD_FAVORITES_ERROR)
  })

  it('stays quiet when the load was cancelled', async () => {
    const controller = new AbortController()
    const api = {
      fetchFavorites: vi.fn(() => {
        controller.abort()
        return Promise.reject(new Error('aborted'))
      }),
    }

    await loadFavorites(api, controller.signal)

    expect(toastStore.getState().toast).toBeNull()
  })
})
