import { paginate } from './paginate'

const items = [1, 2, 3, 4, 5, 6, 7]

describe('paginate', () => {
  it('returns the items of the requested page', () => {
    expect(paginate(items, 3, 3)).toEqual({
      page: 3,
      pageCount: 3,
      pageItems: [7],
      firstIndex: 6,
    })
  })

  it('clamps the page to the existing pages', () => {
    expect(paginate(items, 9, 3).page).toBe(3)
    expect(paginate(items, 0, 3).page).toBe(1)
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
