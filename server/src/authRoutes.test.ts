import { describe, expect, it, vi } from 'vitest'

import { createApp } from './app'
import { SESSION_COOKIE, SESSION_TTL_MS } from './authRoutes'
import type { AuthSession } from './contract'
import { createMemorySessions } from './sessions/memorySessions'

const ORIGIN = 'http://localhost:5173'
const ENV = { ALLOWED_ORIGINS: ORIGIN }

function setup() {
  let time = 1_000
  let ids = 0
  const app = createApp({
    search: vi.fn(),
    favorites: { forUser: vi.fn() },
    lookupShow: vi.fn(),
    sessions: createMemorySessions(),
    now: () => time,
    newId: () => `id-${++ids}`,
  })
  const call = (method: string, path: string, init: RequestInit = {}) =>
    app.request(path, { method, ...init }, ENV)
  const logIn = (email: unknown, cookie = '') =>
    call('POST', '/auth/login', {
      headers: { 'Content-Type': 'application/json', Cookie: cookie },
      body: JSON.stringify({ email }),
    })
  const session = (cookie: string) =>
    call('GET', '/auth/session', { headers: { Cookie: cookie } })
  const wait = (ms: number) => {
    time += ms
  }
  return { call, logIn, session, wait }
}

const user = async (response: Response) =>
  ((await response.json()) as AuthSession).user

describe('/auth', () => {
  it('signs in with an email and sets an HttpOnly session cookie', async () => {
    const { logIn } = setup()

    const response = await logIn('  Ann@Example.com ')

    expect(response.status).toBe(200)
    expect(await user(response)).toEqual({ email: 'ann@example.com' })
    const cookie = response.headers.get('Set-Cookie') ?? ''
    expect(cookie).toContain(`${SESSION_COOKIE}=id-1`)
    for (const part of ['HttpOnly', 'Secure', 'SameSite=None', 'Partitioned']) {
      expect(cookie).toContain(part)
    }
    expect(cookie).toContain(`Max-Age=${SESSION_TTL_MS / 1000}`)
    expect(response.headers.get('Cache-Control')).toBe('no-store')
  })

  it('returns the user of the session cookie, or null for a guest', async () => {
    const { logIn, session } = setup()
    await logIn('ann@example.com')

    expect(await user(await session(`${SESSION_COOKIE}=id-1`))).toEqual({
      email: 'ann@example.com',
    })
    expect(await user(await session(''))).toBeNull()
    expect(await user(await session(`${SESSION_COOKIE}=forged`))).toBeNull()
  })

  it('forgets a session once it expires', async () => {
    const { logIn, session, wait } = setup()
    await logIn('ann@example.com')

    wait(SESSION_TTL_MS)
    const response = await session(`${SESSION_COOKIE}=id-1`)

    expect(await user(response)).toBeNull()
    expect(response.headers.get('Set-Cookie')).toContain('Max-Age=0')
  })

  it('signs out: deletes the session and clears the cookie', async () => {
    const { call, logIn, session } = setup()
    await logIn('ann@example.com')
    const cookie = `${SESSION_COOKIE}=id-1`

    const response = await call('POST', '/auth/logout', {
      headers: { Cookie: cookie },
    })

    expect(await user(response)).toBeNull()
    expect(response.headers.get('Set-Cookie')).toContain('Max-Age=0')
    expect(await user(await session(cookie))).toBeNull()
  })

  it('replaces the old session when signing in again', async () => {
    const { logIn, session } = setup()
    await logIn('ann@example.com')

    await logIn('bob@example.com', `${SESSION_COOKIE}=id-1`)

    expect(await user(await session(`${SESSION_COOKIE}=id-1`))).toBeNull()
    expect(await user(await session(`${SESSION_COOKIE}=id-2`))).toEqual({
      email: 'bob@example.com',
    })
  })

  it('rejects an invalid email or body', async () => {
    const { call, logIn } = setup()

    const response = await logIn('not-an-email')
    expect(response.status).toBe(400)
    await expect(response.json()).resolves.toEqual({
      error: 'Enter a valid email address.',
    })
    expect((await call('POST', '/auth/login', { body: '{' })).status).toBe(400)
  })
})
