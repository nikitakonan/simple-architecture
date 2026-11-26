import { describe, expect, it } from 'vitest'

import { createMemoryFavorites } from './memoryFavorites'

import type { Show } from '../contract'

const show = (id: number) => ({ id, name: `Show ${id}` }) as Show
const ids = (shows: Show[]) => shows.map((s) => s.id)

describe('createMemoryFavorites', () => {
  it('adds, lists and removes shows by id', async () => {
    const favorites = createMemoryFavorites().forUser('ann@example.com')

    await favorites.add(show(2))
    await favorites.add(show(1))
    await favorites.add(show(2))
    await expect(favorites.has(1)).resolves.toBe(true)
    expect(ids(await favorites.list())).toEqual([1, 2])

    await favorites.remove(1)
    await favorites.remove(99)
    await expect(favorites.has(1)).resolves.toBe(false)
    expect(ids(await favorites.list())).toEqual([2])
  })

  it('keeps a separate list for every user', async () => {
    const db = createMemoryFavorites()
    await db.forUser('ann@example.com').add(show(1))
    await db.forUser('bob@example.com').add(show(2))
    await db.forUser('bob@example.com').remove(1)

    expect(ids(await db.forUser('ann@example.com').list())).toEqual([1])
    expect(ids(await db.forUser('bob@example.com').list())).toEqual([2])
    await expect(db.forUser('eve@example.com').list()).resolves.toEqual([])
    await expect(db.forUser('eve@example.com').has(1)).resolves.toBe(false)
  })

  it('stores copies, like a database would', async () => {
    const favorites = createMemoryFavorites().forUser('ann@example.com')
    const original = show(1)
    await favorites.add(original)

    original.name = 'Changed'
    const [stored] = await favorites.list()
    stored.name = 'Changed too'

    expect((await favorites.list())[0].name).toBe('Show 1')
  })

  it('keeps every store separate', async () => {
    await createMemoryFavorites().forUser('ann@example.com').add(show(1))

    await expect(
      createMemoryFavorites().forUser('ann@example.com').list(),
    ).resolves.toEqual([])
  })
})
