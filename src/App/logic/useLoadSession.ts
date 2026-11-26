import { useEffect } from 'react'

import * as authApi from '~/api/auth'
import { loadSession } from './tasks/loadSession'

/**
 * Asks the server who is signed in once, when the app starts, and cancels
 * the request if the app goes away first.
 */
export function useLoadSession(): void {
  useEffect(() => {
    const controller = new AbortController()
    void loadSession(authApi, controller.signal)
    return () => controller.abort()
  }, [])
}
