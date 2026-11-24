import type { Show } from '~/api/types'
import type { FavoritesState } from '~/stores/types'

import { SAVE_FAVORITE_ERROR, toggleFavorite } from './toggleFavorite'

const lost = { id: 1, name: 'Lost' } as Show
const fargo = { id: 2, name: 'Fargo' } as Show

function setup(items: Show[] = [lost]) {
  let state: FavoritesState = {
    items,
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
  const api = { addFavorite: vi.fn(), removeFavorite: vi.fn() }
  const notify = vi.fn()
  return { store, api, notify, deps: { store, api, notify } }
}

describe('toggleFavorite', () => {
  it('adds a show, stores the server list and notifies', async () => {
    const { store, api, notify, deps } = setup()
    api.addFavorite.mockResolvedValue({ items: [fargo, lost] })

    const saving = toggleFavorite(fargo, deps)
    expect(store.getState().savingIds).toEqual([2])
    await saving

    expect(api.addFavorite).toHaveBeenCalledWith(2)
    expect(store.getState()).toMatchObject({ items: [fargo, lost] })
    expect(store.getState().savingIds).toEqual([])
    expect(notify).toHaveBeenCalledWith('Added “Fargo” to favorites')
  })

  it('keeps the list and notifies when saving fails', async () => {
    const { store, api, notify, deps } = setup()
    api.addFavorite.mockRejectedValue(new Error('down'))

    await toggleFavorite(fargo, deps)

    expect(store.getState().items).toEqual([lost])
    expect(store.getState().savingIds).toEqual([])
    expect(notify).toHaveBeenCalledWith(SAVE_FAVORITE_ERROR)
  })

  it('ignores a second click while the show is saving', async () => {
    const { api, deps } = setup()
    api.addFavorite.mockResolvedValue({ items: [fargo] })

    await Promise.all([
      toggleFavorite(fargo, deps),
      toggleFavorite(fargo, deps),
    ])

    expect(api.addFavorite).toHaveBeenCalledOnce()
  })

  it('never lets an older response replace a newer list', async () => {
    const { store, api, deps } = setup([])
    let answerFargo: (value: { items: Show[] }) => void = () => {}
    api.addFavorite
      .mockReturnValueOnce(new Promise((resolve) => (answerFargo = resolve)))
      .mockResolvedValueOnce({ items: [fargo, lost] })

    const first = toggleFavorite(fargo, deps)
    await toggleFavorite(lost, deps)
    answerFargo({ items: [fargo] })
    await first

    expect(store.getState().items).toEqual([fargo, lost])
  })
})
