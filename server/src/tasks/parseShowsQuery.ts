export type ShowsQuery = {
  query: string
  genre: string | null
  page: number
}

export type ShowsQueryParams = {
  q?: string
  genre?: string
  page?: string
}

export type ParsedShowsQuery =
  | { ok: true; value: ShowsQuery }
  | { ok: false; error: string }

const MAX_QUERY_LENGTH = 100

/** Validates the query string of `GET /shows`. */
export function parseShowsQuery(params: ShowsQueryParams): ParsedShowsQuery {
  const query = params.q?.trim() ?? ''
  if (!query) {
    return { ok: false, error: 'Query parameter "q" is required.' }
  }
  if (query.length > MAX_QUERY_LENGTH) {
    return {
      ok: false,
      error: `Query parameter "q" must be at most ${MAX_QUERY_LENGTH} characters.`,
    }
  }

  const page = params.page?.trim() || '1'
  if (!/^\d+$/.test(page) || Number(page) < 1) {
    return {
      ok: false,
      error: 'Query parameter "page" must be a positive integer.',
    }
  }

  const genre = params.genre?.trim() || null
  return { ok: true, value: { query, genre, page: Number(page) } }
}
