import { act, renderHook } from '@testing-library/react'

import { fetchSession } from '~/api/auth'
import { navigationStore } from '~/stores/navigationStore'

import { usePresenter } from './usePresenter'

vi.mock('~/api/auth')

describe('App usePresenter', () => {
  beforeEach(() => {
    vi.mocked(fetchSession).mockReturnValue(new Promise(() => {}))
  })

  it('starts on the home page and checks the session', () => {
    const { result } = renderHook(() => usePresenter())

    expect(result.current.page).toBe('home')
    expect(fetchSession).toHaveBeenCalledOnce()
  })

  it('follows the page in the store', () => {
    const { result } = renderHook(() => usePresenter())

    act(() => navigationStore.setState({ page: 'login' }))

    expect(result.current.page).toBe('login')
  })
})
