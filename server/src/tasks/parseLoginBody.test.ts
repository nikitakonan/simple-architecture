import { describe, expect, it } from 'vitest'

import { parseLoginBody } from './parseLoginBody'

describe('parseLoginBody', () => {
  it('returns the email trimmed and lowercased', () => {
    expect(parseLoginBody({ email: ' Ann@Example.COM ' })).toEqual({
      ok: true,
      value: 'ann@example.com',
    })
  })

  it.each([null, 'ann@example.com', {}, { email: 42 }])(
    'requires an email in %j',
    (body) => {
      expect(parseLoginBody(body)).toEqual({
        ok: false,
        error: 'Email is required.',
      })
    },
  )

  it.each([
    '',
    'ann',
    'ann@example',
    'a nn@example.com',
    `${'a'.repeat(250)}@b.co`,
  ])('rejects %j', (email) => {
    expect(parseLoginBody({ email })).toMatchObject({ ok: false })
  })
})
