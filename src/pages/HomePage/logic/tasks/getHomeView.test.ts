import { getHomeView } from './getHomeView'

describe('getHomeView', () => {
  it('is idle without a query, whatever the search status', () => {
    expect(
      getHomeView({ hasQuery: false, status: 'success', resultCount: 3 }),
    ).toBe('idle')
  })

  it('shows the error state when the search failed', () => {
    expect(
      getHomeView({ hasQuery: true, status: 'error', resultCount: 0 }),
    ).toBe('error')
  })

  it('keeps showing results while a new search loads', () => {
    expect(
      getHomeView({ hasQuery: true, status: 'loading', resultCount: 3 }),
    ).toBe('results')
  })

  it('is loading when there are no results yet', () => {
    expect(
      getHomeView({ hasQuery: true, status: 'loading', resultCount: 0 }),
    ).toBe('loading')
  })

  it('is empty when a search found nothing', () => {
    expect(
      getHomeView({ hasQuery: true, status: 'success', resultCount: 0 }),
    ).toBe('empty')
  })
})
