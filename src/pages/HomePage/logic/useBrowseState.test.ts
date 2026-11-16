import { act, renderHook } from '@testing-library/react'

import { useBrowseState } from './useBrowseState'

describe('useBrowseState', () => {
  it('starts with all genres on the first page', () => {
    const { result } = renderHook(() => useBrowseState('murder'))

    expect(result.current.genre).toBeNull()
    expect(result.current.page).toBe(1)
  })

  it('goes back to the first page when the genre changes', () => {
    const { result } = renderHook(() => useBrowseState('murder'))

    act(() => result.current.setPage(3))
    act(() => result.current.selectGenre('Drama'))

    expect(result.current.genre).toBe('Drama')
    expect(result.current.page).toBe(1)
  })

  it('resets the genre and the page when the query changes', () => {
    const { result, rerender } = renderHook(
      ({ query }) => useBrowseState(query),
      { initialProps: { query: 'murder' } },
    )
    act(() => result.current.selectGenre('Drama'))
    act(() => result.current.setPage(2))

    rerender({ query: 'office' })

    expect(result.current.genre).toBeNull()
    expect(result.current.page).toBe(1)
  })
})
