export type MemoryCacheOptions = {
  ttlMs: number
  maxEntries: number
  now?: () => number
}

export type MemoryCache<T> = {
  get: (key: string) => T | undefined
  set: (key: string, value: T) => void
}

/**
 * A key-value map whose entries expire after `ttlMs`. When it is full, the
 * oldest entry is dropped first.
 */
export function createMemoryCache<T>({
  ttlMs,
  maxEntries,
  now = Date.now,
}: MemoryCacheOptions): MemoryCache<T> {
  const entries = new Map<string, { value: T; expiresAt: number }>()

  return {
    get(key) {
      const entry = entries.get(key)
      if (!entry) return undefined
      if (entry.expiresAt <= now()) {
        entries.delete(key)
        return undefined
      }
      return entry.value
    },
    set(key, value) {
      // Re-inserting moves the key to the end, so it is evicted last.
      entries.delete(key)
      entries.set(key, { value, expiresAt: now() + ttlMs })
      for (const oldest of entries.keys()) {
        if (entries.size <= maxEntries) break
        entries.delete(oldest)
      }
    },
  }
}
