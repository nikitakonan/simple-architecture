import { vi } from 'vitest'

import { createApp } from './app'
import { AUTH_DEPS } from './authRoutes.testUtils'
import { createMemoryFavorites } from './favorites/memoryFavorites'
import { createMemorySessions } from './sessions/memorySessions'
import type { TvmazeShow } from './tvmaze/types'

// Shared setup of the /favorites route tests: a real app with real sessions.

export const ORIGIN = 'http://localhost:5173'
const ENV = { ALLOWED_ORIGINS: ORIGIN }

export function tvmazeShow(id: number, name: string) {
  return { id, name, genres: [] } as unknown as TvmazeShow
}

export function setup(
  lookupShow = vi.fn(async (id: number) => tvmazeShow(id, 'X')),
) {
  const app = createApp({
    search: vi.fn(),
    favorites: createMemoryFavorites(),
    lookupShow,
    ...AUTH_DEPS,
    sessions: createMemorySessions(),
  })
  const request = (method: string, path: string, headers: HeadersInit) =>
    app.request(path, { method, headers }, ENV)
  /** Signs `email` in and returns its session cookie. */
  const logIn = async (email: string) => {
    const response = await app.request(
      '/auth/login',
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Origin: ORIGIN },
        body: JSON.stringify({ email }),
      },
      ENV,
    )
    return (response.headers.get('Set-Cookie') ?? '').split(';')[0]
  }
  const logOut = (cookie: string) =>
    request('POST', '/auth/logout', { Cookie: cookie, Origin: ORIGIN })
  const as = (cookie: string) => (method: string, path: string) =>
    request(method, path, { Cookie: cookie, Origin: ORIGIN })
  return { request, logIn, logOut, as, lookupShow }
}

/** A setup with `ann@example.com` signed in: `call` sends her cookie. */
export async function signedIn(lookupShow?: Parameters<typeof setup>[0]) {
  const api = setup(lookupShow)
  return { ...api, call: api.as(await api.logIn('ann@example.com')) }
}
