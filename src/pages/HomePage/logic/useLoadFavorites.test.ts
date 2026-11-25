import { renderHook, waitFor } from '@testing-library/react'

import { fetchFavorites } from '~/api/favorites'
import type { Show } from '~/api/types'
import { favoritesStore } from '~/stores/favoritesStore'

import { useLoadFavorites } from './useLoadFavorites'

vi.mock('~/api/favorites')

const show = { id: 1, name: 'Lost' } as Show

describe('useLoadFavorites', () => {
  it('loads the favorites into the store on mount', async () => {
    vi.mocked(fetchFavorites).mockResolvedValue({ items: [show] })

    renderHook(() => useLoadFavorites())

    await waitFor(() => expect(favoritesStore.getState().items).toEqual([show]))
    expect(fetchFavorites).toHaveBeenCalledOnce()
  })

  it('cancels the request on unmount', () => {
    vi.mocked(fetchFavorites).mockReturnValue(new Promise(() => {}))
    const { unmount } = renderHook(() => useLoadFavorites())
    const signal = vi.mocked(fetchFavorites).mock.lastCall?.[0]

    unmount()
    expect(signal?.aborted).toBe(true)
  })
})
