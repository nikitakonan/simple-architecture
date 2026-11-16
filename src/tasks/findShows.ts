import type { SearchResult, Show } from '../api/types'

/** Anything that can search shows: the TVmaze client, a fake in tests. */
export type SearchShows = (
  query: string,
  signal?: AbortSignal,
) => Promise<SearchResult[]>

export type FindShowsDeps = {
  search: SearchShows
  signal?: AbortSignal
}

/** Shows matching `query`, in the order the search ranks them. */
export async function findShows(
  query: string,
  { search, signal }: FindShowsDeps,
): Promise<Show[]> {
  const results = await search(query, signal)
  return results.map((result) => result.show)
}
