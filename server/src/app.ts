import { Hono } from 'hono'
import { cors } from 'hono/cors'

import { browseShows, type SearchShows } from './tasks/browseShows'
import { parseShowsQuery } from './tasks/parseShowsQuery'

import { type AuthDeps, authRoutes } from './authRoutes'
import type { ApiError, ShowsPage } from './contract'
import { type FavoritesDeps, favoritesRoutes } from './favoritesRoutes'
import { originGuard } from './originGuard'

export type Env = {
  /** Comma-separated origins allowed to call the API from a browser. */
  ALLOWED_ORIGINS?: string
}

export type AppDeps = FavoritesDeps &
  AuthDeps & {
    search: SearchShows
  }

export const PAGE_SIZE = 3

// Lets the browser reuse a page it has already seen (going back a page).
const CACHE_CONTROL = 'public, max-age=300'

function parseOrigins(value = ''): string[] {
  return value
    .split(',')
    .map((origin) => origin.trim())
    .filter(Boolean)
}

/** The HTTP layer: routing, CORS, validation and status codes. */
export function createApp({
  search,
  favorites,
  lookupShow,
  sessions,
  now,
  newId,
}: AppDeps) {
  const app = new Hono<{ Bindings: Env }>()

  app.use(
    '*',
    cors({
      origin: (origin, c) =>
        parseOrigins(c.env?.ALLOWED_ORIGINS).includes(origin) ? origin : null,
      allowMethods: ['GET', 'POST', 'PUT', 'DELETE'],
      allowHeaders: ['Content-Type'],
      // Lets the browser send and store the session cookie (see authRoutes).
      credentials: true,
    }),
  )
  app.use(
    '*',
    originGuard<{ Bindings: Env }>((c) => parseOrigins(c.env?.ALLOWED_ORIGINS)),
  )

  app.get('/shows', async (c) => {
    const parsed = parseShowsQuery(c.req.query())
    if (!parsed.ok) {
      return c.json({ error: parsed.error } satisfies ApiError, 400)
    }

    try {
      const body = await browseShows(parsed.value, {
        search,
        pageSize: PAGE_SIZE,
        signal: c.req.raw.signal,
      })
      c.header('Cache-Control', CACHE_CONTROL)
      return c.json(body satisfies ShowsPage)
    } catch (error) {
      console.error('Search failed', error)
      const body = { error: 'TVmaze did not respond. Try again later.' }
      return c.json(body satisfies ApiError, 502)
    }
  })

  app.route(
    '/favorites',
    favoritesRoutes({ favorites, lookupShow, sessions, now }),
  )
  app.route('/auth', authRoutes({ sessions, now, newId }))

  app.notFound((c) => c.json({ error: 'Not found.' } satisfies ApiError, 404))

  return app
}
