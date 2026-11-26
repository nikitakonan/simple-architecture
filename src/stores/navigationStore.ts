import { createStore } from 'zustand/vanilla'

import type { NavigationState } from './types'

/** The page on screen. Data only: tasks import it to read and write it. */
export const navigationStore = createStore<NavigationState>()(() => ({
  page: 'home',
}))
