import { act, renderHook } from '@testing-library/react'

import type { Show } from '../../../../api/types'

import { usePresenter } from './usePresenter'

const items = [{ id: 1, name: 'Lost' }] as Show[]
const props = { items, isSaving: () => false, onToggle: vi.fn() }

describe('Favorites usePresenter', () => {
  it('counts the favorites and opens and closes the panel', () => {
    const { result } = renderHook(() => usePresenter(props))
    expect(result.current.count).toBe(1)
    expect(result.current.isOpen).toBe(false)

    act(() => result.current.toggleOpen())
    expect(result.current.isOpen).toBe(true)

    act(() => result.current.close())
    expect(result.current.isOpen).toBe(false)
  })

  it('closes on a click outside', () => {
    const { result } = renderHook(() => usePresenter(props))
    act(() => result.current.toggleOpen())

    act(() => {
      document.body.dispatchEvent(new Event('pointerdown', { bubbles: true }))
    })
    expect(result.current.isOpen).toBe(false)
  })

  it('toggles a listed show by its id', () => {
    const { result } = renderHook(() => usePresenter(props))

    result.current.toggleById(1)
    result.current.toggleById(99)

    expect(props.onToggle).toHaveBeenCalledExactlyOnceWith(items[0])
  })
})
