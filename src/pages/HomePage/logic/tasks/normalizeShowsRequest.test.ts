import { normalizeShowsRequest } from './normalizeShowsRequest'

describe('normalizeShowsRequest', () => {
  it('trims the query and turns a blank genre into null', () => {
    expect(
      normalizeShowsRequest({ query: ' murder ', genre: ' ', page: 1 }),
    ).toEqual({ query: 'murder', genre: null, page: 1 })
  })

  it('keeps the genre and trims it', () => {
    expect(
      normalizeShowsRequest({ query: 'murder', genre: ' Drama ', page: 3 }),
    ).toEqual({ query: 'murder', genre: 'Drama', page: 3 })
  })

  it('makes the page a whole number of at least 1', () => {
    expect(
      normalizeShowsRequest({ query: 'murder', genre: null, page: 0 }).page,
    ).toBe(1)
    expect(
      normalizeShowsRequest({ query: 'murder', genre: null, page: 2.7 }).page,
    ).toBe(2)
  })
})
