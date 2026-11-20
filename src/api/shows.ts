import { requestJson } from './request'
import type { ShowsPage, ShowsPageRequest } from './types'

/** One page of shows matching the query, filtered by genre on the server. */
export function fetchShowsPage(
  { query, genre, page }: ShowsPageRequest,
  signal?: AbortSignal,
): Promise<ShowsPage> {
  const params = new URLSearchParams({ q: query, page: String(page) })
  if (genre) params.set('genre', genre)
  return requestJson(`/shows?${params}`, { signal })
}
