import { Hono } from 'hono'
import { getCookie } from 'hono/cookie'

import { addFavorite, type LookupShow } from './tasks/addFavorite'
import { findSession } from './tasks/findSession'
import { type FavoritesDb, listFavorites } from './tasks/listFavorites'
import { parseShowId } from './tasks/parseShowId'
import { removeFavorite } from './tasks/removeFavorite'
import type { SessionStore } from './tasks/startSession'

import { SESSION_COOKIE } from './authRoutes'
import type { ApiError, Favorites, User } from './contract'

export type FavoritesDeps = {
  favorites: FavoritesDb
  lookupShow: LookupShow
  sessions: SessionStore
  now: () => number
}

/** `/favorites`: the signed-in user's own favorite shows. HTTP only. */
export function favoritesRoutes({
  favorites,
  lookupShow,
  sessions,
  now,
}: FavoritesDeps) {
  const routes = new Hono<{ Variables: { user: User } }>()

  // The list changes with every PUT/DELETE, so never reuse a stored copy.
  routes.use('*', async (c, next) => {
    await next()
    c.header('Cache-Control', 'no-store')
  })

  // Favorites belong to a user, so a guest gets none.
  routes.use('*', async (c, next) => {
    const id = getCookie(c, SESSION_COOKIE)
    const user = await findSession(id, { sessions, now })
    if (!user) {
      const body = { error: 'Sign in to use favorites.' }
      return c.json(body satisfies ApiError, 401)
    }
    c.set('user', user)
    await next()
  })

  routes.get('/', async (c) => {
    const body = await listFavorites(favorites.forUser(c.var.user.email))
    return c.json(body satisfies Favorites)
  })

  routes.put('/:id', async (c) => {
    const id = parseShowId(c.req.param('id'))
    if (!id.ok) return c.json({ error: id.error } satisfies ApiError, 400)

    try {
      const result = await addFavorite(id.value, {
        store: favorites.forUser(c.var.user.email),
        lookupShow,
        signal: c.req.raw.signal,
      })
      if (!result.ok) {
        const body = { error: `There is no show with id ${id.value}.` }
        return c.json(body satisfies ApiError, 404)
      }
      return c.json(result.value satisfies Favorites)
    } catch (error) {
      console.error('Show lookup failed', error)
      const body = { error: 'TVmaze did not respond. Try again later.' }
      return c.json(body satisfies ApiError, 502)
    }
  })

  routes.delete('/:id', async (c) => {
    const id = parseShowId(c.req.param('id'))
    if (!id.ok) return c.json({ error: id.error } satisfies ApiError, 400)
    const store = favorites.forUser(c.var.user.email)
    return c.json((await removeFavorite(id.value, store)) satisfies Favorites)
  })

  return routes
}
