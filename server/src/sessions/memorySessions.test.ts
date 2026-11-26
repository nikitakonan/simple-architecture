import { describe, expect, it } from 'vitest'

import { createMemorySessions } from './memorySessions'

describe('createMemorySessions', () => {
  it('creates, finds and removes sessions', async () => {
    const sessions = createMemorySessions()
    const record = { email: 'ann@example.com', expiresAt: 10 }

    await sessions.create('a', record)

    await expect(sessions.find('a')).resolves.toEqual(record)
    await expect(sessions.find('b')).resolves.toBeNull()
    await sessions.remove('a')
    await expect(sessions.find('a')).resolves.toBeNull()
  })

  it('returns copies, so the stored session cannot change by accident', async () => {
    const sessions = createMemorySessions()
    await sessions.create('a', { email: 'ann@example.com', expiresAt: 10 })

    const found = await sessions.find('a')
    if (found) found.expiresAt = 99

    await expect(sessions.find('a')).resolves.toMatchObject({ expiresAt: 10 })
  })

  it('does not find inherited keys', async () => {
    await expect(createMemorySessions().find('toString')).resolves.toBeNull()
  })
})
