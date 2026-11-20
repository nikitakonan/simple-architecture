import { act, renderHook, waitFor } from '@testing-library/react'

import {
  addFavorite,
  fetchFavorites,
  removeFavorite,
} from '../../../api/favorites'
import type { Show } from '../../../api/types'

import { useFavorites } from './useFavorites'

vi.mock('../../../api/favorites')

const lost = { id: 1, name: 'Lost' } as Show
const fargo = { id: 2, name: 'Fargo' } as Show

async function setup(initial: Show[] = [lost]) {
  vi.mocked(fetchFavorites).mockResolvedValue({ items: initial })
  const notify = vi.fn()
  const hook = renderHook(() => useFavorites(notify))
  await waitFor(() => expect(hook.result.current.items).toEqual(initial))
  return { ...hook, notify }
}

describe('useFavorites', () => {
  it('loads the favorites from the server', async () => {
    const { result } = await setup()

    expect(result.current.isFavorite(1)).toBe(true)
    expect(result.current.isFavorite(2)).toBe(false)
  })

  it('adds a show, shows the server list and notifies', async () => {
    vi.mocked(addFavorite).mockResolvedValue({ items: [fargo, lost] })
    const { result, notify } = await setup()

    act(() => result.current.toggle(fargo))
    expect(result.current.isSaving(2)).toBe(true)

    await waitFor(() => expect(result.current.isFavorite(2)).toBe(true))
    expect(addFavorite).toHaveBeenCalledWith(2)
    expect(result.current.isSaving(2)).toBe(false)
    expect(notify).toHaveBeenCalledWith('Added “Fargo” to favorites')
  })

  it('removes a favorite', async () => {
    vi.mocked(removeFavorite).mockResolvedValue({ items: [] })
    const { result, notify } = await setup()

    act(() => result.current.toggle(lost))

    await waitFor(() => expect(result.current.items).toEqual([]))
    expect(removeFavorite).toHaveBeenCalledWith(1)
    expect(notify).toHaveBeenCalledWith('Removed “Lost” from favorites')
  })

  it('keeps the list and notifies when saving fails', async () => {
    vi.mocked(addFavorite).mockRejectedValue(new Error('down'))
    const { result, notify } = await setup()

    act(() => result.current.toggle(fargo))

    await waitFor(() =>
      expect(notify).toHaveBeenCalledWith(
        'Couldn’t update your favorites. Try again.',
      ),
    )
    expect(result.current.items).toEqual([lost])
    expect(result.current.isSaving(2)).toBe(false)
  })

  it('notifies when the favorites fail to load', async () => {
    vi.mocked(fetchFavorites).mockRejectedValue(new Error('down'))
    const notify = vi.fn()
    renderHook(() => useFavorites(notify))

    await waitFor(() =>
      expect(notify).toHaveBeenCalledWith('Couldn’t load your favorites.'),
    )
  })
})
