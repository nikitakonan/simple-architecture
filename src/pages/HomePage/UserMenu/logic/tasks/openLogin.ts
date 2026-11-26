import { navigationStore } from '~/stores/navigationStore'

/** Opens the login page. */
export function openLogin(): void {
  navigationStore.setState({ page: 'login' })
}
