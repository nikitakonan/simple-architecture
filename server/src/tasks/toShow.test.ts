import { describe, expect, it } from 'vitest'

import { toShow } from './toShow'

import type { TvmazeShow } from '../tvmaze/types'

describe('toShow', () => {
  it('keeps only the fields of the contract', () => {
    const tvmazeShow = {
      id: 1,
      name: 'Murder, She Wrote',
      genres: ['Crime'],
      status: 'Ended',
      premiered: '1984-09-30',
      network: { id: 2, name: 'CBS', country: { code: 'US' } },
      webChannel: null,
      image: { medium: 'm.jpg', original: 'o.jpg' },
      summary: '<p>Jessica</p>',
      rating: { average: 8 },
      _links: { self: { href: '...' } },
    } as TvmazeShow

    expect(toShow(tvmazeShow)).toEqual({
      id: 1,
      name: 'Murder, She Wrote',
      genres: ['Crime'],
      status: 'Ended',
      premiered: '1984-09-30',
      network: { name: 'CBS' },
      webChannel: null,
      image: { medium: 'm.jpg', original: 'o.jpg' },
      summary: '<p>Jessica</p>',
    })
  })
})
