import type { SessionRecord, SessionStore } from '../tasks/startSession'

/**
 * Sessions kept in a plain object keyed by session id, behind an async API so
 * it can be swapped for a real database (KV, D1) without touching the tasks.
 * It lives as long as the Worker instance does: a cold start, a deploy, or
 * another instance starts with nobody signed in.
 */
export function createMemorySessions(): SessionStore {
  const sessions: Record<string, SessionRecord> = {}

  return {
    async create(id, record) {
      sessions[id] = { ...record }
    },
    async find(id) {
      // A copy, so callers can't change the stored row by accident.
      return Object.hasOwn(sessions, id) ? { ...sessions[id] } : null
    },
    async remove(id) {
      delete sessions[id]
    },
  }
}
