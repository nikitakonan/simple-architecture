import { navigationStore } from '~/stores/navigationStore'

import { openLogin } from './openLogin'

describe('openLogin', () => {
  it('opens the login page', () => {
    openLogin()

    expect(navigationStore.getState().page).toBe('login')
  })
})
