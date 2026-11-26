import type { AuthSession } from '~/api/types'
import { sessionStore } from '~/stores/sessionStore'
import { showToast } from '~/tasks/showToast'

import { closeLogin } from './closeLogin'

export const LOG_IN_ERROR =
  'Couldn’t sign you in. Check your connection and try again.'

export type LogInApi = {
  logIn: (email: string) => Promise<AuthSession>
}

/**
 * Signs in with `email`: the server starts a session and sets its cookie,
 * then the app shows the home page with the user. Returns the message to show
 * when it fails, or `null` when it worked.
 */
export async function logIn(
  email: string,
  api: LogInApi,
): Promise<string | null> {
  let user: AuthSession['user']
  try {
    user = (await api.logIn(email.trim())).user
  } catch {
    return LOG_IN_ERROR
  }
  if (!user) return LOG_IN_ERROR

  sessionStore.setState({ status: 'ready', user })
  closeLogin()
  showToast(`Signed in as ${user.email}`)
  return null
}
