import { usePresenter } from './logic/usePresenter'

import styles from './UserMenu.module.css'

export function UserMenu() {
  const menu = usePresenter()

  // Nothing until the server says who is signed in, so nothing flickers.
  if (menu.view === 'checking') return null

  if (menu.view === 'guest') {
    return (
      <button type="button" className={styles.signIn} onClick={menu.openLogin}>
        Sign in
      </button>
    )
  }

  return (
    <div className={styles.user}>
      <span className={styles.email} title={menu.email}>
        {menu.email}
      </span>
      <button
        type="button"
        className={styles.logOut}
        disabled={menu.isLoggingOut}
        onClick={menu.logOut}
      >
        {menu.isLoggingOut ? 'Logging out…' : 'Log out'}
      </button>
    </div>
  )
}
