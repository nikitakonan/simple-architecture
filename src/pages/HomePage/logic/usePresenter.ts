import type { ShowsPage } from '~/api/types'
import { useDebounce } from '~/hooks/useDebounce'
import { useSignedInEmail } from '~/hooks/useSignedInEmail'
import { describeRange } from './tasks/describeRange'
import { describeResults } from './tasks/describeResults'
import { getHomeView } from './tasks/getHomeView'

import { useBrowseState } from './useBrowseState'
import { useLoadFavorites } from './useLoadFavorites'
import { useSearchParam } from './useSearchParam'
import { useShowsPage } from './useShowsPage'
import { useToast } from './useToast'

const DEBOUNCE_MS = 400
const SUGGESTIONS = ['murder', 'office', 'dragon', 'space']
const ERROR_MESSAGE =
  'Couldn’t load the shows. Check your connection and try again.'

/** What the page shows before anything has loaded. */
const NO_RESULTS: ShowsPage = {
  query: '',
  genre: null,
  genres: [],
  totalCount: 0,
  matchCount: 0,
  page: 1,
  pageCount: 1,
  pageSize: 0,
  firstIndex: 0,
  items: [],
}

export function usePresenter() {
  const [query, setQuery] = useSearchParam('q')
  const debouncedQuery = useDebounce(query, DEBOUNCE_MS)
  const hasQuery = query.trim() !== ''
  // Clearing the field resets right away instead of waiting for the debounce.
  const searchQuery = hasQuery ? debouncedQuery.trim() : ''

  // The server filters and paginates; the page only keeps what is selected.
  const { genre, page, selectGenre, setPage } = useBrowseState(searchQuery)
  const { data, status, retry } = useShowsPage({
    query: searchQuery,
    genre,
    page,
  })
  const results = data ?? NO_RESULTS
  // The favorites live in a shared store, loaded for whoever is signed in.
  const email = useSignedInEmail()
  useLoadFavorites(email)

  const view = getHomeView({
    hasQuery,
    status,
    resultCount: results.totalCount,
  })
  // Loading another page or genre of the same search isn't "searching".
  const isNewSearch = status === 'loading' && results.query !== searchQuery

  return {
    query,
    changeQuery: setQuery,
    clearQuery: () => setQuery(''),
    isSearching: hasQuery && (query !== debouncedQuery || isNewSearch),
    view,
    isRefreshing: view === 'results' && status === 'loading',
    searchedFor: results.query,
    // Set only in the error state, so it can't leak into other views.
    errorMessage: view === 'error' ? ERROR_MESSAGE : null,
    retry,
    suggestions: SUGGESTIONS,
    genres: results.genres,
    selectedGenre: genre,
    selectGenre,
    resetGenre: () => selectGenre(null),
    totalCount: results.totalCount,
    resultsLabel: describeResults({
      total: results.totalCount,
      filtered: results.matchCount,
      genre: results.genre,
    }),
    visibleShows: results.items,
    page,
    pageCount: results.pageCount,
    setPage,
    rangeLabel: describeRange({
      firstIndex: results.firstIndex,
      pageItemCount: results.items.length,
      total: results.matchCount,
    }),
    // Only a signed-in user has favorites to open.
    isSignedIn: email !== null,
    toast: useToast(),
  }
}
