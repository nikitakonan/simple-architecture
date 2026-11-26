import type { Show } from '~/api/types'
import { favoritesStore } from '~/stores/favoritesStore'
import { sessionStore } from '~/stores/sessionStore'
import { toastStore } from '~/stores/toastStore'

import {
  SAVE_FAVORITE_ERROR,
  SIGN_IN_TO_SAVE,
  toggleFavorite,
} from './toggleFavorite'

const lost = { id: 1, name: 'Lost' } as Show
const fargo = { id: 2, name: 'Fargo' } as Show

function setup(items: Show[] = [lost]) {
  favoritesStore.setState({ items })
  sessionStore.setState({ status: 'ready', user: { email: 'ann@example.com' } })
  return { addFavorite: vi.fn(), removeFavorite: vi.fn() }
}

const toastText = () => toastStore.getState().toast?.text

describe('toggleFavorite', () => {
  it('adds a show, stores the server list and shows a toast', async () => {
    const api = setup()
    api.addFavorite.mockResolvedValue({ items: [fargo, lost] })

    const saving = toggleFavorite(fargo, api)
    expect(favoritesStore.getState().savingIds).toEqual([2])
    await saving

    expect(api.addFavorite).toHaveBeenCalledWith(2)
    expect(favoritesStore.getState()).toMatchObject({ items: [fargo, lost] })
    expect(favoritesStore.getState().savingIds).toEqual([])
    expect(toastText()).toBe('Added “Fargo” to favorites')
  })

  it('removes a show that is already a favorite', async () => {
    const api = setup()
    api.removeFavorite.mockResolvedValue({ items: [] })

    await toggleFavorite(lost, api)

    expect(api.removeFavorite).toHaveBeenCalledWith(1)
    expect(favoritesStore.getState().items).toEqual([])
    expect(toastText()).toBe('Removed “Lost” from favorites')
  })

  it('keeps the list and shows a toast when saving fails', async () => {
    const api = setup()
    api.addFavorite.mockRejectedValue(new Error('down'))

    await toggleFavorite(fargo, api)

    expect(favoritesStore.getState().items).toEqual([lost])
    expect(favoritesStore.getState().savingIds).toEqual([])
    expect(toastText()).toBe(SAVE_FAVORITE_ERROR)
  })

  it('asks a guest to sign in instead of saving', async () => {
    const api = setup()
    sessionStore.setState({ user: null })

    await toggleFavorite(fargo, api)

    expect(api.addFavorite).not.toHaveBeenCalled()
    expect(favoritesStore.getState().savingIds).toEqual([])
    expect(toastText()).toBe(SIGN_IN_TO_SAVE)
  })

  it('ignores a second click while the show is saving', async () => {
    const api = setup()
    api.addFavorite.mockResolvedValue({ items: [fargo] })

    await Promise.all([toggleFavorite(fargo, api), toggleFavorite(fargo, api)])

    expect(api.addFavorite).toHaveBeenCalledOnce()
  })

  it('never lets an older response replace a newer list', async () => {
    const api = setup([])
    let answerFargo: (value: { items: Show[] }) => void = () => {}
    api.addFavorite
      .mockReturnValueOnce(new Promise((resolve) => (answerFargo = resolve)))
      .mockResolvedValueOnce({ items: [fargo, lost] })

    const first = toggleFavorite(fargo, api)
    await toggleFavorite(lost, api)
    answerFargo({ items: [fargo] })
    await first

    expect(favoritesStore.getState().items).toEqual([fargo, lost])
  })
})
