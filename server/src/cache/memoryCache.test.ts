import { describe, expect, it } from 'vitest'

import { createMemoryCache } from './memoryCache'

function setup(maxEntries = 10) {
  let time = 0
  const cache = createMemoryCache<string>({
    ttlMs: 1000,
    maxEntries,
    now: () => time,
  })
  return { cache, advance: (ms: number) => (time += ms) }
}

describe('createMemoryCache', () => {
  it('returns stored values until they expire', () => {
    const { cache, advance } = setup()
    cache.set('a', 'A')

    advance(999)
    expect(cache.get('a')).toBe('A')

    advance(1)
    expect(cache.get('a')).toBeUndefined()
  })

  it('drops the oldest entry when full', () => {
    const { cache } = setup(2)
    cache.set('a', 'A')
    cache.set('b', 'B')
    cache.set('a', 'A2')
    cache.set('c', 'C')

    expect(cache.get('b')).toBeUndefined()
    expect(cache.get('a')).toBe('A2')
    expect(cache.get('c')).toBe('C')
  })
})
