import type { TvmazeSearchResult, TvmazeShow } from './types'

const BASE_URL = 'https://api.tvmaze.com'

/** `GET /search/shows`: TVmaze ranks the matches and returns at most ~10. */
export async function searchTvmaze(
  query: string,
  signal?: AbortSignal,
): Promise<TvmazeSearchResult[]> {
  const response = await fetch(
    `${BASE_URL}/search/shows?q=${encodeURIComponent(query)}`,
    { signal },
  )
  if (!response.ok) {
    throw new Error(`TVmaze request failed: ${response.status}`)
  }
  return response.json()
}

/** `GET /shows/:id`, or `null` when TVmaze has no show with that id. */
export async function lookupTvmazeShow(
  id: number,
  signal?: AbortSignal,
): Promise<TvmazeShow | null> {
  const response = await fetch(`${BASE_URL}/shows/${id}`, { signal })
  if (response.status === 404) return null
  if (!response.ok) {
    throw new Error(`TVmaze request failed: ${response.status}`)
  }
  return response.json()
}
