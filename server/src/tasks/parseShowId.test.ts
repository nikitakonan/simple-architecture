import { describe, expect, it } from 'vitest'

import { parseShowId } from './parseShowId'

describe('parseShowId', () => {
  it('accepts a positive integer', () => {
    expect(parseShowId('42')).toEqual({ ok: true, value: 42 })
  })

  it.each(['0', '-1', '1.5', 'abc', '', '99999999999999999999'])(
    'rejects %j',
    (value) => {
      expect(parseShowId(value)).toEqual({
        ok: false,
        error: 'Show id must be a positive integer.',
      })
    },
  )
})
