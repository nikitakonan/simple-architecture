// The same loose check as the server: something@something.tld, no spaces.
const EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

/** Why `email` can't be used to sign in, or `null` when it can. */
export function validateEmail(email: string): string | null {
  const value = email.trim()
  if (value === '') return 'Enter your email.'
  if (!EMAIL.test(value)) return 'Enter a valid email address.'
  return null
}
