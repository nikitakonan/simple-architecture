import { Hono } from 'hono'
import { deleteCookie, getCookie, setCookie } from 'hono/cookie'

import { endSession } from './tasks/endSession'
import { findSession } from './tasks/findSession'
import { parseLoginBody } from './tasks/parseLoginBody'
import { type SessionStore, startSession } from './tasks/startSession'

import type { ApiError, AuthSession } from './contract'

export type AuthDeps = {
  sessions: SessionStore
  now: () => number
  newId: () => string
}

/** `__Host-`: the browser keeps it only if Secure, on `/` and without Domain. */
export const SESSION_COOKIE = '__Host-sid'
export const SESSION_TTL_MS = 7 * 24 * 60 * 60 * 1000

/**
 * The app (GitHub Pages) and the API (workers.dev) are different sites, so
 * the cookie is sent cross-site: `SameSite=None` needs `Secure`, and
 * `Partitioned` (CHIPS) keeps it working where third-party cookies are blocked
 * unless partitioned. Browsers count `http://localhost` as secure.
 */
const COOKIE = {
  httpOnly: true,
  secure: true,
  sameSite: 'None',
  partitioned: true,
  path: '/',
} as const

/** `/auth`: email-only sign-in with a server session in a cookie. HTTP only. */
export function authRoutes({ sessions, now, newId }: AuthDeps) {
  const routes = new Hono()

  // Every answer depends on the cookie, so never reuse a stored copy.
  routes.use('*', async (c, next) => {
    await next()
    c.header('Cache-Control', 'no-store')
  })

  routes.get('/session', async (c) => {
    const id = getCookie(c, SESSION_COOKIE)
    const user = await findSession(id, { sessions, now })
    // A cookie that points at no session is useless: drop it.
    if (id && !user) deleteCookie(c, SESSION_COOKIE, COOKIE)
    return c.json({ user } satisfies AuthSession)
  })

  routes.post('/login', async (c) => {
    const body: unknown = await c.req.json().catch(() => null)
    const email = parseLoginBody(body)
    if (!email.ok) return c.json({ error: email.error } satisfies ApiError, 400)

    // Signing in again replaces the old session instead of leaving it behind.
    await endSession(getCookie(c, SESSION_COOKIE), sessions)
    const session = await startSession(email.value, {
      sessions,
      now,
      newId,
      ttlMs: SESSION_TTL_MS,
    })
    setCookie(c, SESSION_COOKIE, session.id, {
      ...COOKIE,
      maxAge: SESSION_TTL_MS / 1000,
    })
    return c.json({ user: session.user } satisfies AuthSession)
  })

  routes.post('/logout', async (c) => {
    await endSession(getCookie(c, SESSION_COOKIE), sessions)
    deleteCookie(c, SESSION_COOKIE, COOKIE)
    return c.json({ user: null } satisfies AuthSession)
  })

  return routes
}
