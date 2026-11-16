import { countGenres } from './countGenres'

describe('countGenres', () => {
  it('collects unique genres with counts, sorted by name', () => {
    const items = [
      { genres: ['Drama', 'Crime'] },
      { genres: ['Comedy'] },
      { genres: ['Drama'] },
    ]

    expect(countGenres(items)).toEqual([
      { name: 'Comedy', count: 1 },
      { name: 'Crime', count: 1 },
      { name: 'Drama', count: 2 },
    ])
  })

  it('returns no genres for no items', () => {
    expect(countGenres([])).toEqual([])
  })
})
