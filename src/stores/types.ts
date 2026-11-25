import type { Show } from '~/api/types'

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
