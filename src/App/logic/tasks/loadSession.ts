import type { AuthSession } from '~/api/types'
import { sessionStore } from '~/stores/sessionStore'

export type LoadSessionApi = {
  fetchSession: (signal?: AbortSignal) => Promise<AuthSession>
}

/**
 * Finds out who is signed in. If the check fails the app carries on as a
 * guest: search doesn't need a session, and signing in still works.
 */
export async function loadSession(
  api: LoadSessionApi,
  signal?: AbortSignal,
): Promise<void> {
  let user: AuthSession['user'] = null
  try {
    user = (await api.fetchSession(signal)).user
  } catch {
    if (signal?.aborted) return
  }
  // Signing in or out while the check was running has the newer answer.
  if (sessionStore.getState().status === 'checking') {
    sessionStore.setState({ status: 'ready', user })
  }
}
