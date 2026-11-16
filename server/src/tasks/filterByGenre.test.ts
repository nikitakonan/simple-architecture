import { describe, expect, it } from 'vitest'

import { filterByGenre } from './filterByGenre'

const items = [
  { id: 1, genres: ['Drama', 'Crime'] },
  { id: 2, genres: ['Comedy'] },
  { id: 3, genres: ['Drama'] },
]

describe('filterByGenre', () => {
  it('keeps the items that have the genre', () => {
    expect(filterByGenre(items, 'Drama').map((item) => item.id)).toEqual([1, 3])
  })

  it('returns all items when no genre is selected', () => {
    expect(filterByGenre(items, null)).toBe(items)
  })

  it('returns nothing for a genre no item has', () => {
    expect(filterByGenre(items, 'Horror')).toEqual([])
  })
})
