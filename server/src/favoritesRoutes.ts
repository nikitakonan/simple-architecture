import { Hono } from 'hono'

import { addFavorite, type LookupShow } from './tasks/addFavorite'
import { type FavoritesStore, listFavorites } from './tasks/listFavorites'
import { parseShowId } from './tasks/parseShowId'
import { removeFavorite } from './tasks/removeFavorite'

import type { ApiError, Favorites } from './contract'

export type FavoritesDeps = {
  favorites: FavoritesStore
  lookupShow: LookupShow
}

/** `/favorites`: list, add and remove favorite shows. HTTP only. */
export function favoritesRoutes({ favorites, lookupShow }: FavoritesDeps) {
  const routes = new Hono()

  // The list changes with every PUT/DELETE, so never reuse a stored copy.
  routes.use('*', async (c, next) => {
    await next()
    c.header('Cache-Control', 'no-store')
  })

  routes.get('/', async (c) => {
    const body = await listFavorites(favorites)
    return c.json(body satisfies Favorites)
  })

  routes.put('/:id', async (c) => {
    const id = parseShowId(c.req.param('id'))
    if (!id.ok) return c.json({ error: id.error } satisfies ApiError, 400)

    try {
      const result = await addFavorite(id.value, {
        store: favorites,
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
    const body = await removeFavorite(id.value, favorites)
    return c.json(body satisfies Favorites)
  })

  return routes
}
