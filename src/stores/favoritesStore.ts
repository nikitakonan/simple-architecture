import { createStore } from 'zustand/vanilla'

import type { FavoritesState } from './types'

/** The app's favorites. Data only: tasks read and write it. */
export const favoritesStore = createStore<FavoritesState>()(() => ({
  items: [],
  savingIds: [],
  lastSent: 0,
  lastApplied: 0,
}))
