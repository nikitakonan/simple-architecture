import { describe, expect, it } from 'vitest'

import { startSession } from './startSession'
import { fakeSessions } from './testing/fakeSessions'

describe('startSession', () => {
  it('stores a session that expires after the ttl', async () => {
    const { store, map } = fakeSessions()

    const session = await startSession('ann@example.com', {
      sessions: store,
      now: () => 100,
      newId: () => 'abc',
      ttlMs: 50,
    })

    expect(session).toEqual({ id: 'abc', user: { email: 'ann@example.com' } })
    expect(map.get('abc')).toEqual({ email: 'ann@example.com', expiresAt: 150 })
  })
})
