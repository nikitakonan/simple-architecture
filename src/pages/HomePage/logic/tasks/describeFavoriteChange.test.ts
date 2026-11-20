import { describeFavoriteChange } from './describeFavoriteChange'

describe('describeFavoriteChange', () => {
  it('describes an added and a removed show', () => {
    expect(describeFavoriteChange({ name: 'Lost', favorite: true })).toBe(
      'Added “Lost” to favorites',
    )
    expect(describeFavoriteChange({ name: 'Lost', favorite: false })).toBe(
      'Removed “Lost” from favorites',
    )
  })
})
