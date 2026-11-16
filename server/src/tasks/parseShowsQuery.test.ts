import { describe, expect, it } from 'vitest'

import { parseShowsQuery } from './parseShowsQuery'

describe('parseShowsQuery', () => {
  it('trims the values and defaults to page 1 and no genre', () => {
    expect(parseShowsQuery({ q: '  murder ', genre: ' ' })).toEqual({
      ok: true,
      value: { query: 'murder', genre: null, page: 1 },
    })
  })

  it('reads the genre and the page', () => {
    expect(parseShowsQuery({ q: 'murder', genre: 'Drama', page: '2' })).toEqual(
      {
        ok: true,
        value: { query: 'murder', genre: 'Drama', page: 2 },
      },
    )
  })

  it.each([undefined, '', '   '])('rejects a missing query (%j)', (q) => {
    expect(parseShowsQuery({ q })).toEqual({
      ok: false,
      error: 'Query parameter "q" is required.',
    })
  })

  it('rejects a query that is too long', () => {
    expect(parseShowsQuery({ q: 'a'.repeat(101) }).ok).toBe(false)
  })

  it.each(['0', '-1', '1.5', 'two'])('rejects page %j', (page) => {
    expect(parseShowsQuery({ q: 'murder', page })).toEqual({
      ok: false,
      error: 'Query parameter "page" must be a positive integer.',
    })
  })
})
