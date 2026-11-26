import { renderHook, waitFor } from '@testing-library/react'

import { fetchSession } from '~/api/auth'
import { sessionStore } from '~/stores/sessionStore'

import { useLoadSession } from './useLoadSession'

vi.mock('~/api/auth')

describe('useLoadSession', () => {
  it('loads the session on mount', async () => {
    const user = { email: 'ann@example.com' }
    vi.mocked(fetchSession).mockResolvedValue({ user })

    renderHook(() => useLoadSession())

    await waitFor(() => expect(sessionStore.getState().user).toEqual(user))
  })

  it('cancels the request on unmount', () => {
    vi.mocked(fetchSession).mockReturnValue(new Promise(() => {}))
    const { unmount } = renderHook(() => useLoadSession())
    const signal = vi.mocked(fetchSession).mock.lastCall?.[0]

    unmount()
    expect(signal?.aborted).toBe(true)
  })
})
