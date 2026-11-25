import type { ShowsPageRequest } from '~/api/types'

/**
 * The request with blank parts normalised, so " murder " and "murder" are the
 * same request, a blank genre means all genres, and the page is at least 1.
 */
export function normalizeShowsRequest({
  query,
  genre,
  page,
}: ShowsPageRequest): ShowsPageRequest {
  return {
    query: query.trim(),
    genre: genre?.trim() || null,
    page: Math.max(1, Math.floor(page)),
  }
}
