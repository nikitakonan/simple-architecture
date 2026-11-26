import { createStore } from 'zustand/vanilla'

import type { SessionState } from './types'

/** The signed-in user. Data only: tasks import it to read and write it. */
export const sessionStore = createStore<SessionState>()(() => ({
  status: 'checking',
  user: null,
}))
