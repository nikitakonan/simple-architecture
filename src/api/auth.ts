import { requestJson } from './request'
import type { AuthSession, LoginRequest } from './types'

// The session is an HttpOnly cookie the API sets from another site, so these
// requests have to send it and let the browser store it.
const WITH_COOKIE: RequestInit = { credentials: 'include' }

/** `GET /auth/session`: who is signed in, `{ user: null }` for a guest. */
export function fetchSession(signal?: AbortSignal): Promise<AuthSession> {
  return requestJson('/auth/session', { ...WITH_COOKIE, signal })
}

/** `POST /auth/login`: signs in with an email; the API sets the cookie. */
export function logIn(email: string): Promise<AuthSession> {
  return requestJson('/auth/login', {
    ...WITH_COOKIE,
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email } satisfies LoginRequest),
  })
}

/** `POST /auth/logout`: ends the session; the API clears the cookie. */
export function logOut(): Promise<AuthSession> {
  return requestJson('/auth/logout', { ...WITH_COOKIE, method: 'POST' })
}
