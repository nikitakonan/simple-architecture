export type ParsedLogin =
  | { ok: true; value: string }
  | { ok: false; error: string }

// The longest address SMTP allows.
const MAX_LENGTH = 254
// Deliberately loose: something@something.tld, without spaces.
const EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

/**
 * Validates the body of `POST /auth/login` and returns the email normalised
 * (trimmed and lowercased), so `Ann@Mail.com ` and `ann@mail.com` are one user.
 */
export function parseLoginBody(body: unknown): ParsedLogin {
  const email =
    typeof body === 'object' && body !== null && 'email' in body
      ? body.email
      : undefined
  if (typeof email !== 'string') {
    return { ok: false, error: 'Email is required.' }
  }
  const value = email.trim().toLowerCase()
  if (value.length > MAX_LENGTH || !EMAIL.test(value)) {
    return { ok: false, error: 'Enter a valid email address.' }
  }
  return { ok: true, value }
}
