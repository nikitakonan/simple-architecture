import { act, renderHook } from '@testing-library/react'

import { sessionStore } from '~/stores/sessionStore'
import { logOut } from './tasks/logOut'

import { usePresenter } from './usePresenter'

vi.mock('./tasks/logOut')

describe('UserMenu usePresenter', () => {
  it('shows nothing while the session is being checked', () => {
    const { result } = renderHook(() => usePresenter())

    expect(result.current).toMatchObject({ view: 'checking', email: '' })
  })

  it('returns the signed-in user', () => {
    sessionStore.setState({ status: 'ready', user: { email: 'a@b.co' } })

    const { result } = renderHook(() => usePresenter())

    expect(result.current).toMatchObject({ view: 'user', email: 'a@b.co' })
  })

  it('is busy while logging out', async () => {
    let finish = () => {}
    vi.mocked(logOut).mockReturnValue(
      new Promise((resolve) => {
        finish = resolve
      }),
    )
    const { result } = renderHook(() => usePresenter())

    let done: Promise<void> = Promise.resolve()
    act(() => {
      done = result.current.logOut()
    })
    expect(result.current.isLoggingOut).toBe(true)

    await act(async () => {
      finish()
      await done
    })
    expect(result.current.isLoggingOut).toBe(false)
  })
})
