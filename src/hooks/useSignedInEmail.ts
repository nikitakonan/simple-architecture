import { useStore } from 'zustand'

import { sessionStore } from '~/stores/sessionStore'

/** The email of the signed-in user, or `null` for a guest. */
export function useSignedInEmail(): string | null {
  return useStore(sessionStore, (state) => state.user?.email ?? null)
}
