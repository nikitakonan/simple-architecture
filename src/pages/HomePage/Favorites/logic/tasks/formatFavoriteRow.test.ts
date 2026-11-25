import type { Show } from '~/api/types'

import { formatFavoriteRow } from './formatFavoriteRow'

describe('formatFavoriteRow', () => {
  it('formats a show for the favorites list', () => {
    const show = {
      id: 2,
      name: 'The Office',
      premiered: '2001-07-09',
      network: { name: 'BBC Two' },
      webChannel: null,
      image: { medium: 'https://example.com/o.jpg', original: '' },
    } as Show

    expect(formatFavoriteRow(show)).toEqual({
      id: 2,
      name: 'The Office',
      meta: '2001 · BBC Two',
      imageUrl: 'https://example.com/o.jpg',
      starLabel: 'Favorite The Office (2001 · BBC Two)',
    })
  })
})
