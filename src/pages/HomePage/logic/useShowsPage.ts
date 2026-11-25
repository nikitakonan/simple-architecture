import { useCallback, useEffect, useState } from 'react'

import { fetchShowsPage } from '~/api/shows'
import type { ShowsPage, ShowsPageRequest } from '~/api/types'
import { normalizeShowsRequest } from './tasks/normalizeShowsRequest'

export type SearchStatus = 'idle' | 'loading' | 'success' | 'error'

type ShowsPageState = {
  status: SearchStatus
  /** The last page that loaded. Kept while the next one loads. */
  data: ShowsPage | null
  error: string | null
}

const IDLE: ShowsPageState = { status: 'idle', data: null, error: null }

/**
 * Loads one page of shows from the API. Every new request (a new query, genre
 * or page, or a retry) aborts the one still in flight, so a slow old response
 * can never overwrite a newer one. An empty query resets to the idle state
 * without a request.
 */
export function useShowsPage({ query, genre, page }: ShowsPageRequest) {
  const [state, setState] = useState<ShowsPageState>(IDLE)
  const [attempt, setAttempt] = useState(0)

  // `attempt` is a dependency on purpose: bumping it re-runs the request.
  // biome-ignore lint/correctness/useExhaustiveDependencies: retry trigger
  useEffect(() => {
    if (!query.trim()) {
      setState(IDLE)
      return
    }

    const controller = new AbortController()
    const { signal } = controller
    setState((prev) => ({ ...prev, status: 'loading', error: null }))

    fetchShowsPage(normalizeShowsRequest({ query, genre, page }), signal)
      .then((data) => {
        if (signal.aborted) return
        setState({ status: 'success', data, error: null })
      })
      .catch((error: unknown) => {
        if (signal.aborted) return
        setState({
          status: 'error',
          data: null,
          error: error instanceof Error ? error.message : String(error),
        })
      })

    return () => controller.abort()
  }, [query, genre, page, attempt])

  const retry = useCallback(() => setAttempt((n) => n + 1), [])

  return { ...state, retry }
}
