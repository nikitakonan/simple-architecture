import type { SessionStore } from './startSession'

/** Signs out: deletes the session `id`. Without a session it does nothing. */
export async function endSession(
  id: string | undefined,
  sessions: SessionStore,
): Promise<void> {
  if (id) await sessions.remove(id)
}
