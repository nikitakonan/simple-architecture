import { useStore } from 'zustand'

import { sessionStore } from '~/stores/sessionStore'

/** Whether the session check has finished, and who is signed in. */
export function useSession() {
  const status = useStore(sessionStore, (state) => state.status)
  const user = useStore(sessionStore, (state) => state.user)
  return { status, user }
}
