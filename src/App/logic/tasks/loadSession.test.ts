import { sessionStore } from '~/stores/sessionStore'

import { loadSession } from './loadSession'

const ann = { email: 'ann@example.com' }

describe('loadSession', () => {
  it('stores the signed-in user', async () => {
    const api = { fetchSession: vi.fn().mockResolvedValue({ user: ann }) }
    const { signal } = new AbortController()

    await loadSession(api, signal)

    expect(api.fetchSession).toHaveBeenCalledWith(signal)
    expect(sessionStore.getState()).toEqual({ status: 'ready', user: ann })
  })

  it('carries on as a guest when the check fails', async () => {
    const api = { fetchSession: vi.fn().mockRejectedValue(new Error('down')) }

    await loadSession(api)

    expect(sessionStore.getState()).toEqual({ status: 'ready', user: null })
  })

  it('changes nothing when the check was cancelled', async () => {
    const controller = new AbortController()
    const api = {
      fetchSession: vi.fn(() => {
        controller.abort()
        return Promise.reject(new Error('aborted'))
      }),
    }

    await loadSession(api, controller.signal)

    expect(sessionStore.getState().status).toBe('checking')
  })

  it('keeps a sign-in that finished before the check', async () => {
    const api = { fetchSession: vi.fn().mockResolvedValue({ user: null }) }
    sessionStore.setState({ status: 'ready', user: ann })

    await loadSession(api)

    expect(sessionStore.getState().user).toEqual(ann)
  })
})
