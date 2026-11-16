import type { ApiError, ShowsPage, ShowsPageRequest } from './types'

function baseUrl(): string {
  const url = import.meta.env.VITE_API_URL
  if (!url) throw new Error('VITE_API_URL is not set.')
  return url.replace(/\/+$/, '')
}

/** One page of shows matching the query, filtered by genre on the server. */
export async function fetchShowsPage(
  { query, genre, page }: ShowsPageRequest,
  signal?: AbortSignal,
): Promise<ShowsPage> {
  const params = new URLSearchParams({ q: query, page: String(page) })
  if (genre) params.set('genre', genre)

  const response = await fetch(`${baseUrl()}/shows?${params}`, { signal })
  if (!response.ok) {
    const body: Partial<ApiError> | null = await response
      .json()
      .catch(() => null)
    throw new Error(body?.error ?? `API request failed: ${response.status}`)
  }
  return response.json()
}
