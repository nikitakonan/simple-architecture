import { describeRange } from './describeRange'

describe('describeRange', () => {
  it('describes the items shown on the page', () => {
    expect(describeRange({ firstIndex: 3, pageItemCount: 3, total: 10 })).toBe(
      'Showing 4–6 of 10',
    )
  })
})
