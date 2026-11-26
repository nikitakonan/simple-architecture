import { navigationStore } from '~/stores/navigationStore'

/** Leaves the login page for the home page. */
export function closeLogin(): void {
  navigationStore.setState({ page: 'home' })
}
