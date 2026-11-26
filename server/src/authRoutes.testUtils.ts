import type { AuthDeps } from './authRoutes'
import { createMemorySessions } from './sessions/memorySessions'

/** Real auth deps for tests of the other routes, which don't use them. */
export const AUTH_DEPS: AuthDeps = {
  sessions: createMemorySessions(),
  now: Date.now,
  newId: () => crypto.randomUUID(),
}
