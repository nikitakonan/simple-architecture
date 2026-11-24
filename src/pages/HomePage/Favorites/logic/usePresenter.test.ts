import { act, renderHook } from '@testing-library/react'

import type { Show } from '../../../../api/types'
import { toggleFavorite } from '../../../../services/favorites'
import { favoritesStore } from '../../../../stores/favoritesStore'

import { usePresenter } from './usePresenter'

vi.mock('../../../../services/favorites')

const items = [{ id: 1, name: 'Lost' }] as Show[]

describe('Favorites usePresenter', () => {
  beforeEach(() => {
    favoritesStore.setState({ items, savingIds: [1] })
  })

  it('counts the favorites and opens and closes the panel', () => {
    const { result } = renderHook(() => usePresenter())
    expect(result.current.count).toBe(1)
    expect(result.current.isSaving(1)).toBe(true)
    expect(result.current.isOpen).toBe(false)

    act(() => result.current.toggleOpen())
    expect(result.current.isOpen).toBe(true)

    act(() => result.current.close())
    expect(result.current.isOpen).toBe(false)
  })

  it('closes on a click outside', () => {
    const { result } = renderHook(() => usePresenter())
    act(() => result.current.toggleOpen())

    act(() => {
      document.body.dispatchEvent(new Event('pointerdown', { bubbles: true }))
    })
    expect(result.current.isOpen).toBe(false)
  })

  it('toggles a listed show by its id', () => {
    const { result } = renderHook(() => usePresenter())

    result.current.toggleById(1)
    result.current.toggleById(99)

    expect(toggleFavorite).toHaveBeenCalledExactlyOnceWith(items[0])
  })
})
