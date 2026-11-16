import { countGenres } from './countGenres'
import { filterByGenre } from './filterByGenre'
import { paginate } from './paginate'
import type { ShowsQuery } from './parseShowsQuery'
import { toShow } from './toShow'

import type { ShowsPage } from '../contract'
import type { TvmazeSearchResult } from '../tvmaze/types'

/** Anything that can search shows: the TVmaze client, a cache, a fake. */
export type SearchShows = (
  query: string,
  signal?: AbortSignal,
) => Promise<TvmazeSearchResult[]>

export type BrowseShowsDeps = {
  search: SearchShows
  pageSize: number
  signal?: AbortSignal
}

/**
 * One page of the shows matching `query`, filtered by `genre`. The genres are
 * counted over all results, so the client can still offer the other genres
 * while one is selected.
 */
export async function browseShows(
  { query, genre, page }: ShowsQuery,
  { search, pageSize, signal }: BrowseShowsDeps,
): Promise<ShowsPage> {
  const results = await search(query, signal)
  const shows = results.map((result) => toShow(result.show))
  const matching = filterByGenre(shows, genre)
  const slice = paginate(matching, page, pageSize)

  return {
    query,
    genre,
    genres: countGenres(shows),
    totalCount: shows.length,
    matchCount: matching.length,
    page: slice.page,
    pageCount: slice.pageCount,
    pageSize,
    firstIndex: slice.firstIndex,
    items: slice.pageItems,
  }
}
