import { navigationStore } from '~/stores/navigationStore'

import { closeLogin } from './closeLogin'

describe('closeLogin', () => {
  it('goes back to the home page', () => {
    navigationStore.setState({ page: 'login' })

    closeLogin()

    expect(navigationStore.getState().page).toBe('home')
  })
})
