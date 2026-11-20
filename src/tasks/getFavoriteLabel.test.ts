import { getFavoriteLabel } from './getFavoriteLabel'

describe('getFavoriteLabel', () => {
  it('names the show with its year and channel when known', () => {
    expect(getFavoriteLabel({ name: 'The Office', meta: '2005 · NBC' })).toBe(
      'Favorite The Office (2005 · NBC)',
    )
    expect(getFavoriteLabel({ name: 'Lost', meta: '' })).toBe('Favorite Lost')
  })
})
