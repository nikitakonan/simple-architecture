import type { TvmazeSearchResult } from './types'

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
