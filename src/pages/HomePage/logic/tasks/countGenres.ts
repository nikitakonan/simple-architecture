export type GenreOption = {
  name: string
  count: number
}

type WithGenres = { genres: string[] }

/** Unique genres of `items` with how many items have each, sorted by name. */
export function countGenres(items: WithGenres[]): GenreOption[] {
  const counts = new Map<string, number>()
  for (const item of items) {
    for (const genre of item.genres) {
      counts.set(genre, (counts.get(genre) ?? 0) + 1)
    }
  }
  return [...counts]
    .map(([name, count]) => ({ name, count }))
    .sort((a, b) => a.name.localeCompare(b.name))
}
