import { sessionStore } from '~/stores/sessionStore'
import { toastStore } from '~/stores/toastStore'

import { LOG_OUT_DONE, LOG_OUT_ERROR, logOut } from './logOut'

const ann = { email: 'ann@example.com' }

describe('logOut', () => {
  beforeEach(() => sessionStore.setState({ status: 'ready', user: ann }))

  it('forgets the user once the server has ended the session', async () => {
    const api = { logOut: vi.fn().mockResolvedValue({ user: null }) }

    await logOut(api)

    expect(sessionStore.getState().user).toBeNull()
    expect(toastStore.getState().toast?.text).toBe(LOG_OUT_DONE)
  })

  it('keeps the user signed in when the server fails', async () => {
    const api = { logOut: vi.fn().mockRejectedValue(new Error('down')) }

    await logOut(api)

    expect(sessionStore.getState().user).toEqual(ann)
    expect(toastStore.getState().toast?.text).toBe(LOG_OUT_ERROR)
  })
})
