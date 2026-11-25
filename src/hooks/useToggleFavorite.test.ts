import { renderHook, waitFor } from '@testing-library/react'

import { addFavorite } from '~/api/favorites'
import type { Show } from '~/api/types'
import { favoritesStore } from '~/stores/favoritesStore'
import { toastStore } from '~/stores/toastStore'

import { useToggleFavorite } from './useToggleFavorite'

vi.mock('~/api/favorites')

const show = { id: 1, name: 'Lost' } as Show

describe('useToggleFavorite', () => {
  it('saves through the API into the store and shows a toast', async () => {
    vi.mocked(addFavorite).mockResolvedValue({ items: [show] })
    const { result } = renderHook(() => useToggleFavorite())

    result.current(show)

    await waitFor(() => expect(favoritesStore.getState().items).toEqual([show]))
    expect(addFavorite).toHaveBeenCalledWith(1)
    expect(toastStore.getState().toast?.text).toMatch(/Lost/)
  })

  it('returns the same function on every render', () => {
    const { result, rerender } = renderHook(() => useToggleFavorite())
    const first = result.current

    rerender()
    expect(result.current).toBe(first)
  })
})
