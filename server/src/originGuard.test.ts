import { describe, expect, it, vi } from 'vitest'

import { createApp } from './app'
import { AUTH_DEPS } from './authRoutes.testUtils'

const ENV = { ALLOWED_ORIGINS: 'http://localhost:5173' }

function setup() {
  const app = createApp({
    search: vi.fn(),
    favorites: { list: vi.fn(), has: vi.fn(), add: vi.fn(), remove: vi.fn() },
    lookupShow: vi.fn(),
    ...AUTH_DEPS,
  })
  return (method: string, path: string, headers: HeadersInit = {}) =>
    app.request(path, { method, headers }, ENV)
}

describe('originGuard and CORS', () => {
  it('refuses a changing request from another site', async () => {
    const call = setup()

    const response = await call('POST', '/auth/logout', {
      Origin: 'https://evil.example',
    })

    expect(response.status).toBe(403)
  })

  it('lets the app’s origin through, with credentials', async () => {
    const call = setup()

    const response = await call('POST', '/auth/logout', {
      Origin: 'http://localhost:5173',
    })

    expect(response.status).toBe(200)
    expect(response.headers.get('Access-Control-Allow-Origin')).toBe(
      'http://localhost:5173',
    )
    expect(response.headers.get('Access-Control-Allow-Credentials')).toBe(
      'true',
    )
  })

  it('allows a JSON POST in the preflight', async () => {
    const call = setup()

    const response = await call('OPTIONS', '/auth/login', {
      Origin: 'http://localhost:5173',
      'Access-Control-Request-Method': 'POST',
      'Access-Control-Request-Headers': 'content-type',
    })

    expect(response.headers.get('Access-Control-Allow-Methods')).toContain(
      'POST',
    )
    expect(response.headers.get('Access-Control-Allow-Headers')).toContain(
      'Content-Type',
    )
  })
})
