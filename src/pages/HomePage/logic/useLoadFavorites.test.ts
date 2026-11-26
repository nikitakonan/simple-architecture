import { renderHook, waitFor } from '@testing-library/react'

import { fetchFavorites } from '~/api/favorites'
import type { Show } from '~/api/types'
import { favoritesStore } from '~/stores/favoritesStore'

import { useLoadFavorites } from './useLoadFavorites'

vi.mock('~/api/favorites')

const show = { id: 1, name: 'Lost' } as Show

describe('useLoadFavorites', () => {
  it('loads the favorites of the signed-in user into the store', async () => {
    vi.mocked(fetchFavorites).mockResolvedValue({ items: [show] })

    renderHook(() => useLoadFavorites('ann@example.com'))

    await waitFor(() => expect(favoritesStore.getState().items).toEqual([show]))
    expect(fetchFavorites).toHaveBeenCalledOnce()
  })

  it('loads nothing for a guest and empties the list on logout', async () => {
    vi.mocked(fetchFavorites).mockResolvedValue({ items: [show] })
    const { rerender } = renderHook(
      ({ email }: { email: string | null }) => useLoadFavorites(email),
      { initialProps: { email: 'ann@example.com' as string | null } },
    )
    await waitFor(() => expect(favoritesStore.getState().items).toEqual([show]))

    rerender({ email: null })

    expect(favoritesStore.getState().items).toEqual([])
    expect(fetchFavorites).toHaveBeenCalledOnce()
  })

  it('cancels the request on unmount', () => {
    vi.mocked(fetchFavorites).mockReturnValue(new Promise(() => {}))
    const { unmount } = renderHook(() => useLoadFavorites('ann@example.com'))
    const signal = vi.mocked(fetchFavorites).mock.lastCall?.[0]

    unmount()
    expect(signal?.aborted).toBe(true)
  })
})
