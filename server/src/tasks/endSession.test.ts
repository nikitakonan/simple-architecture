import { describe, expect, it } from 'vitest'

import { endSession } from './endSession'
import { fakeSessions } from './testing/fakeSessions'

describe('endSession', () => {
  it('deletes the session', async () => {
    const { store, map } = fakeSessions([
      ['a', { email: 'ann@example.com', expiresAt: 1 }],
    ])

    await endSession('a', store)

    expect(map.size).toBe(0)
  })

  it('does nothing without a session id', async () => {
    const { store } = fakeSessions()

    await expect(endSession(undefined, store)).resolves.toBeUndefined()
  })
})
