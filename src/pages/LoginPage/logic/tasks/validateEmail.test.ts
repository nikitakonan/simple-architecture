import { validateEmail } from './validateEmail'

describe('validateEmail', () => {
  it('accepts an email, spaces around it included', () => {
    expect(validateEmail(' ann@example.com ')).toBeNull()
  })

  it('asks for an email when the field is empty', () => {
    expect(validateEmail('  ')).toBe('Enter your email.')
  })

  it.each(['ann', 'ann@example', 'a nn@example.com', '@example.com'])(
    'rejects %j',
    (email) => {
      expect(validateEmail(email)).toBe('Enter a valid email address.')
    },
  )
})
