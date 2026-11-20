import { describeShowMeta } from './describeShowMeta'

describe('describeShowMeta', () => {
  it('joins the year and the channel', () => {
    expect(
      describeShowMeta({
        premiered: '2005-03-24',
        network: { name: 'NBC' },
        webChannel: null,
      }),
    ).toBe('2005 · NBC')
  })

  it('falls back to the web channel and skips unknown parts', () => {
    expect(
      describeShowMeta({
        premiered: null,
        network: null,
        webChannel: { name: 'Prime Video' },
      }),
    ).toBe('Prime Video')
  })
})
