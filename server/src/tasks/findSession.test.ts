import { describe, expect, it } from 'vitest'

import { findSession } from './findSession'
import { fakeSessions } from './testing/fakeSessions'

const ann = { email: 'ann@example.com', expiresAt: 100 }

describe('findSession', () => {
  it('returns the user of a live session', async () => {
    const { store } = fakeSessions([['a', ann]])

    await expect(
      findSession('a', { sessions: store, now: () => 99 }),
    ).resolves.toEqual({ email: 'ann@example.com' })
  })

  it('returns null without an id or for an unknown one', async () => {
    const deps = { sessions: fakeSessions().store, now: () => 0 }

    await expect(findSession(undefined, deps)).resolves.toBeNull()
    await expect(findSession('nope', deps)).resolves.toBeNull()
  })

  it('deletes and ignores an expired session', async () => {
    const { store, map } = fakeSessions([['a', ann]])

    await expect(
      findSession('a', { sessions: store, now: () => 100 }),
    ).resolves.toBeNull()
    expect(map.has('a')).toBe(false)
  })
})
