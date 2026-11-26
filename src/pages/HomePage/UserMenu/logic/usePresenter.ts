import { useState } from 'react'

import * as authApi from '~/api/auth'
import { getUserMenuView } from './tasks/getUserMenuView'
import { logOut } from './tasks/logOut'
import { openLogin } from './tasks/openLogin'

import { useSession } from './useSession'

export function usePresenter() {
  const session = useSession()
  const [isLoggingOut, setIsLoggingOut] = useState(false)

  return {
    view: getUserMenuView(session),
    email: session.user?.email ?? '',
    isLoggingOut,
    openLogin,
    logOut: async () => {
      setIsLoggingOut(true)
      await logOut(authApi)
      setIsLoggingOut(false)
    },
  }
}
