import type { SessionState } from '~/stores/types'

export type UserMenuView = 'checking' | 'guest' | 'user'

/** What the header shows: nothing yet, a sign-in button, or the user. */
export function getUserMenuView({ status, user }: SessionState): UserMenuView {
  if (status === 'checking') return 'checking'
  return user ? 'user' : 'guest'
}
