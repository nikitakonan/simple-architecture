import type { AuthSession } from '~/api/types'
import { sessionStore } from '~/stores/sessionStore'
import { showToast } from '~/tasks/showToast'

export const LOG_OUT_DONE = 'Logged out.'
export const LOG_OUT_ERROR = 'Couldn’t log you out. Try again.'

export type LogOutApi = {
  logOut: () => Promise<AuthSession>
}

/**
 * Logs out on the server, which ends the session and clears the cookie. The
 * app can't clear an HttpOnly cookie itself, so if the server fails the user
 * stays signed in instead of being shown as a guest who isn't one.
 */
export async function logOut(api: LogOutApi): Promise<void> {
  try {
    await api.logOut()
  } catch {
    showToast(LOG_OUT_ERROR)
    return
  }
  sessionStore.setState({ status: 'ready', user: null })
  showToast(LOG_OUT_DONE)
}
