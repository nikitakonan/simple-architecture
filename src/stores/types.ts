import type { Show } from '../api/types'

/**
 * What a task sees of a store: read its data and write part of it. Stores are
 * the app's in-memory database; the rules that change them live in tasks.
 */
export type Store<T> = {
  getState: () => T
  setState: (patch: Partial<T>) => void
}

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
