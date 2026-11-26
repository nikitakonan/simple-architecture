import type { Context, Env, MiddlewareHandler } from 'hono'

import type { ApiError } from './contract'

const SAFE_METHODS = ['GET', 'HEAD', 'OPTIONS']

/**
 * CSRF protection. The session cookie is `SameSite=None`, so the browser
 * sends it with requests from any site, and a page elsewhere could post a
 * plain form or `fetch` to `/auth/logout`. A browser always sends `Origin`
 * with such requests, so a changing request from an origin not on the list
 * is refused. Requests without `Origin` don't come from a browser page.
 */
export function originGuard<E extends Env>(
  allowedOrigins: (c: Context<E>) => string[],
): MiddlewareHandler<E> {
  return async (c, next) => {
    const origin = c.req.header('Origin')
    if (
      origin &&
      !SAFE_METHODS.includes(c.req.method) &&
      !allowedOrigins(c).includes(origin)
    ) {
      return c.json({ error: 'Origin not allowed.' } satisfies ApiError, 403)
    }
    await next()
  }
}
