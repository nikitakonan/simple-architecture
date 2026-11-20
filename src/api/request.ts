import type { ApiError } from './types'

function baseUrl(): string {
  const url = import.meta.env.VITE_API_URL
  if (!url) throw new Error('VITE_API_URL is not set.')
  return url.replace(/\/+$/, '')
}

/**
 * Calls the API server and parses the JSON body. A non-2xx response throws
 * with the server's error message, or with the status if there is none.
 */
export async function requestJson<T>(
  path: string,
  init?: RequestInit,
): Promise<T> {
  const response = await fetch(`${baseUrl()}${path}`, init)
  if (!response.ok) {
    const body: Partial<ApiError> | null = await response
      .json()
      .catch(() => null)
    throw new Error(body?.error ?? `API request failed: ${response.status}`)
  }
  return response.json()
}
