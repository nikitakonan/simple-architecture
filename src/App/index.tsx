import { usePresenter } from './logic/usePresenter'

import { HomePage } from '~/pages/HomePage'
import { LoginPage } from '~/pages/LoginPage'

/** The app shell: checks the session and shows the current page. */
export function App() {
  const { page } = usePresenter()

  return page === 'login' ? <LoginPage /> : <HomePage />
}
