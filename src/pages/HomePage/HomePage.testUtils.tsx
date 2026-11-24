import { render } from '@testing-library/react'

import type { Show } from '~/api/types'

import { usePresenter } from './logic/usePresenter'

import { HomePage } from '.'

// Shared by the HomePage view tests, which mock ./logic/usePresenter.

export type Presenter = ReturnType<typeof usePresenter>

export const show: Show = {
  id: 1,
  name: 'Midsomer Murders',
  genres: ['Drama', 'Crime'],
  status: 'Running',
  premiered: '1997-03-23',
  network: { name: 'ITV' },
  webChannel: null,
  image: null,
  summary: '<p>Detectives solve murders in English villages.</p>',
}

export const base: Presenter = {
  query: '',
  changeQuery: vi.fn(),
  clearQuery: vi.fn(),
  isSearching: false,
  view: 'idle',
  isRefreshing: false,
  searchedFor: '',
  errorMessage: null,
  retry: vi.fn(),
  suggestions: ['murder', 'office'],
  genres: [],
  selectedGenre: null,
  selectGenre: vi.fn(),
  resetGenre: vi.fn(),
  totalCount: 0,
  resultsLabel: '',
  visibleShows: [],
  page: 1,
  pageCount: 1,
  setPage: vi.fn(),
  rangeLabel: '',
  toast: null,
}

export function renderWith(overrides: Partial<Presenter>) {
  const presenter = { ...base, ...overrides }
  vi.mocked(usePresenter).mockReturnValue(presenter)
  render(<HomePage />)
  return presenter
}
