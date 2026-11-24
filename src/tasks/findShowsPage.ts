import type { ShowsPage, ShowsPageRequest } from '~/api/types'

/** Anything that can load a page of shows: the API client, a fake in tests. */
export type FetchShowsPage = (
  request: ShowsPageRequest,
  signal?: AbortSignal,
) => Promise<ShowsPage>

export type FindShowsPageDeps = {
  fetchPage: FetchShowsPage
  signal?: AbortSignal
}

/**
 * One page of shows for `request`. Blank parts are normalised first, so
 * " murder " and "murder" are the same request and a blank genre means all.
 */
export function findShowsPage(
  { query, genre, page }: ShowsPageRequest,
  { fetchPage, signal }: FindShowsPageDeps,
): Promise<ShowsPage> {
  const normalized = {
    query: query.trim(),
    genre: genre?.trim() || null,
    page: Math.max(1, Math.floor(page)),
  }
  return fetchPage(normalized, signal)
}
