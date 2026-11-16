import { describeResults } from './describeResults'

describe('describeResults', () => {
  it('counts all shows when no genre is selected', () => {
    expect(describeResults({ total: 12, filtered: 12, genre: null })).toBe(
      '12 shows',
    )
  })

  it('uses the singular for one show', () => {
    expect(describeResults({ total: 1, filtered: 1, genre: null })).toBe(
      '1 show',
    )
  })

  it('names the genre when one is selected', () => {
    expect(describeResults({ total: 12, filtered: 4, genre: 'Drama' })).toBe(
      '4 Drama of 12 shows',
    )
  })
})
