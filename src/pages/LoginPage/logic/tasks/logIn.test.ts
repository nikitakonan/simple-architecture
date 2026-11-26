import { navigationStore } from '~/stores/navigationStore'
import { sessionStore } from '~/stores/sessionStore'
import { toastStore } from '~/stores/toastStore'

import { LOG_IN_ERROR, logIn } from './logIn'

const ann = { email: 'ann@example.com' }

describe('logIn', () => {
  beforeEach(() => navigationStore.setState({ page: 'login' }))

  it('stores the user, opens the home page and says so', async () => {
    const api = { logIn: vi.fn().mockResolvedValue({ user: ann }) }

    await expect(logIn(' ann@example.com ', api)).resolves.toBeNull()

    expect(api.logIn).toHaveBeenCalledWith('ann@example.com')
    expect(sessionStore.getState()).toEqual({ status: 'ready', user: ann })
    expect(navigationStore.getState().page).toBe('home')
    expect(toastStore.getState().toast?.text).toBe(
      'Signed in as ann@example.com',
    )
  })

  it('returns an error and stays on the page when it fails', async () => {
    const api = { logIn: vi.fn().mockRejectedValue(new Error('down')) }

    await expect(logIn('ann@example.com', api)).resolves.toBe(LOG_IN_ERROR)

    expect(sessionStore.getState().user).toBeNull()
    expect(navigationStore.getState().page).toBe('login')
  })
})
