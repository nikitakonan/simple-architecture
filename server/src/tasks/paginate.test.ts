import { describe, expect, it } from 'vitest'

import { paginate } from './paginate'

const items = [1, 2, 3, 4, 5, 6, 7]

describe('paginate', () => {
  it('returns the items of the requested page', () => {
    expect(paginate(items, 2, 3)).toEqual({
      page: 2,
      pageCount: 3,
      pageItems: [4, 5, 6],
      firstIndex: 3,
    })
  })

  it('returns a shorter last page', () => {
    expect(paginate(items, 3, 3).pageItems).toEqual([7])
  })

  it('clamps a page past the end to the last page', () => {
    expect(paginate(items, 99, 3)).toMatchObject({ page: 3, firstIndex: 6 })
  })

  it('has one empty page for an empty list', () => {
    expect(paginate([], 1, 3)).toEqual({
      page: 1,
      pageCount: 1,
      pageItems: [],
      firstIndex: 0,
    })
  })
})
