export type HomeView = 'idle' | 'loading' | 'error' | 'empty' | 'results'

export type SearchStatus = 'idle' | 'loading' | 'success' | 'error'

type HomeViewInput = {
  hasQuery: boolean
  status: SearchStatus
  resultCount: number
}

/**
 * Which state the home page shows. While a new search loads, the previous
 * results stay on screen instead of being replaced by the skeleton.
 */
export function getHomeView({
  hasQuery,
  status,
  resultCount,
}: HomeViewInput): HomeView {
  if (!hasQuery) return 'idle'
  if (status === 'error') return 'error'
  if (resultCount > 0) return 'results'
  if (status === 'success') return 'empty'
  return 'loading'
}
