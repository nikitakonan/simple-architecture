import { filterByGenre } from './filterByGenre'

const items = [
  { id: 1, genres: ['Drama', 'Crime'] },
  { id: 2, genres: ['Comedy'] },
  { id: 3, genres: ['Drama'] },
]

describe('filterByGenre', () => {
  it('keeps only the items with the genre', () => {
    expect(filterByGenre(items, 'Drama').map((item) => item.id)).toEqual([1, 3])
  })

  it('returns the same list when no genre is selected', () => {
    expect(filterByGenre(items, null)).toBe(items)
  })
})
