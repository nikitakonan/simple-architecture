import type { Show, User } from '~/api/types'

/** The favorite shows, as the server last returned them. */
export type FavoritesState = {
  items: Show[]
  /** Ids of the shows whose change is still being saved. */
  savingIds: number[]
  /** Requests are numbered so an older response never replaces a newer list. */
  lastSent: number
  lastApplied: number
}

export type ToastMessage = { id: number; text: string }

/** The one short message shown at the bottom of the screen. */
export type ToastState = { toast: ToastMessage | null }

/**
 * Who is signed in. The session itself is an HttpOnly cookie the app can't
 * read, so the server is asked once on start: `checking` until it answers.
 */
export type SessionState = {
  status: 'checking' | 'ready'
  user: User | null
}

/** The pages of the app. There is no router: the page is just state. */
export type Page = 'home' | 'login'

export type NavigationState = { page: Page }
