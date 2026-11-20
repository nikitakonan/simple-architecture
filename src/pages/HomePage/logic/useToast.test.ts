import { act, renderHook } from '@testing-library/react'

import { useToast } from './useToast'

describe('useToast', () => {
  beforeEach(() => vi.useFakeTimers())
  afterEach(() => vi.useRealTimers())

  it('shows a message and hides it after a few seconds', () => {
    const { result } = renderHook(() => useToast())

    act(() => result.current.showToast('Saved'))
    expect(result.current.toast?.text).toBe('Saved')

    act(() => vi.advanceTimersByTime(2000))
    act(() => result.current.showToast('Saved again'))
    act(() => vi.advanceTimersByTime(2000))
    expect(result.current.toast?.text).toBe('Saved again')

    act(() => vi.advanceTimersByTime(1000))
    expect(result.current.toast).toBeNull()
  })
})
