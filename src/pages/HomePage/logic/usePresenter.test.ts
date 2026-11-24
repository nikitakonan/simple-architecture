import { act, renderHook } from '@testing-library/react'

import type { ShowsPage } from '../../../api/types'
import { useShowsPage } from '../../../hooks/useShowsPage'

import { usePresenter } from './usePresenter'

vi.mock('../../../hooks/useShowsPage')
vi.mock('../../../api/favorites')
vi.mock('../../../hooks/useDebounce', () => ({
  useDebounce: <T>(value: T) => value,
}))

const PAGE: ShowsPage = {
  query: 'murder',
  genre: 'Drama',
  genres: [
    { name: 'Comedy', count: 1 },
    { name: 'Drama', count: 4 },
  ],
  totalCount: 5,
  matchCount: 4,
  page: 2,
  pageCount: 2,
  pageSize: 3,
  firstIndex: 3,
  items: [{ id: 7, name: 'Show 7', genres: ['Drama'] }] as ShowsPage['items'],
}

type Result = ReturnType<typeof useShowsPage>
const retry = vi.fn()

function mockPage(overrides: Partial<Result> = {}) {
  vi.mocked(useShowsPage).mockReturnValue({
    status: 'success',
    data: PAGE,
    error: null,
    retry,
    ...overrides,
  })
}
const lastRequest = () => vi.mocked(useShowsPage).mock.lastCall?.[0]

describe('usePresenter', () => {
  beforeEach(() => {
    window.history.replaceState(null, '', '/')
  })

  it('is idle and requests nothing while the query is empty', () => {
    mockPage({ status: 'idle', data: null })
    const { result } = renderHook(() => usePresenter())

    expect(result.current.view).toBe('idle')
    expect(lastRequest()).toEqual({ query: '', genre: null, page: 1 })
  })

  it('searches for the typed query and keeps it in the URL', () => {
    mockPage({ status: 'loading', data: null })
    const { result } = renderHook(() => usePresenter())

    act(() => result.current.changeQuery('murder '))

    expect(lastRequest()).toEqual({ query: 'murder', genre: null, page: 1 })
    expect(result.current.view).toBe('loading')
    expect(result.current.isSearching).toBe(true)
    expect(window.location.search).toBe('?q=murder+')
  })

  it('shows the page the server returned', () => {
    mockPage()
    window.history.replaceState(null, '', '/?q=murder')
    const { result } = renderHook(() => usePresenter())

    expect(result.current.view).toBe('results')
    expect(result.current.visibleShows.map((s) => s.id)).toEqual([7])
    expect(result.current.genres).toBe(PAGE.genres)
    expect(result.current.resultsLabel).toBe('4 Drama of 5 shows')
    expect(result.current.rangeLabel).toBe('Showing 4–4 of 4')
    expect(result.current.pageCount).toBe(2)
  })

  it('requests the selected genre and page', () => {
    mockPage()
    window.history.replaceState(null, '', '/?q=murder')
    const { result } = renderHook(() => usePresenter())

    act(() => result.current.selectGenre('Drama'))
    act(() => result.current.setPage(2))
    expect(lastRequest()).toEqual({ query: 'murder', genre: 'Drama', page: 2 })

    act(() => result.current.resetGenre())
    expect(lastRequest()).toEqual({ query: 'murder', genre: null, page: 1 })
  })

  it('refreshes without "searching" while another page of it loads', () => {
    mockPage({ status: 'loading' })
    window.history.replaceState(null, '', '/?q=murder')
    const { result } = renderHook(() => usePresenter())

    expect(result.current.isRefreshing).toBe(true)
    expect(result.current.isSearching).toBe(false)
  })

  it('picks the view for empty and failed searches', () => {
    window.history.replaceState(null, '', '/?q=zxqv')
    mockPage({ data: { ...PAGE, query: 'zxqv', totalCount: 0, items: [] } })
    const { result, rerender } = renderHook(() => usePresenter())
    expect(result.current.view).toBe('empty')
    expect(result.current.errorMessage).toBeNull()

    mockPage({ status: 'error', data: null, error: 'Failed' })
    rerender()
    expect(result.current.view).toBe('error')
    expect(result.current.errorMessage).toBe(
      'Couldn’t load the shows. Check your connection and try again.',
    )
    expect(result.current.retry).toBe(retry)
  })
})
