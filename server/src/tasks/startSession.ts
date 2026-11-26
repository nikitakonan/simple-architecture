import type { User } from '../contract'

/** A stored session: whose it is and when it stops being valid (ms). */
export type SessionRecord = {
  email: string
  expiresAt: number
}

/** The same shape a real database client would have: every call is async. */
export type SessionStore = {
  create: (id: string, record: SessionRecord) => Promise<void>
  find: (id: string) => Promise<SessionRecord | null>
  remove: (id: string) => Promise<void>
}

export type StartSessionDeps = {
  sessions: SessionStore
  /** The current time in ms, like `Date.now`. */
  now: () => number
  /** A new unguessable session id, like `crypto.randomUUID`. */
  newId: () => string
  ttlMs: number
}

export type StartedSession = {
  /** Goes into the cookie. It is random, so it says nothing about the user. */
  id: string
  user: User
}

/** Signs `email` in: stores a new session that expires after `ttlMs`. */
export async function startSession(
  email: string,
  { sessions, now, newId, ttlMs }: StartSessionDeps,
): Promise<StartedSession> {
  const id = newId()
  await sessions.create(id, { email, expiresAt: now() + ttlMs })
  return { id, user: { email } }
}
