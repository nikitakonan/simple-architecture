import type { SessionStore } from './startSession'

import type { User } from '../contract'

export type FindSessionDeps = {
  sessions: SessionStore
  now: () => number
}

/**
 * The user the session `id` belongs to, or `null` when there is no such
 * session or it has expired. An expired session is deleted on the way.
 */
export async function findSession(
  id: string | undefined,
  { sessions, now }: FindSessionDeps,
): Promise<User | null> {
  if (!id) return null
  const record = await sessions.find(id)
  if (!record) return null
  if (record.expiresAt <= now()) {
    await sessions.remove(id)
    return null
  }
  return { email: record.email }
}
