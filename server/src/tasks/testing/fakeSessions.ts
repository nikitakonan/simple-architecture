import type { SessionRecord, SessionStore } from '../startSession'

/** An in-memory `SessionStore` for task tests, with the map exposed. */
export function fakeSessions(entries: [string, SessionRecord][] = []) {
  const map = new Map(entries)
  const store: SessionStore = {
    create: async (id, record) => {
      map.set(id, record)
    },
    find: async (id) => map.get(id) ?? null,
    remove: async (id) => {
      map.delete(id)
    },
  }
  return { store, map }
}
