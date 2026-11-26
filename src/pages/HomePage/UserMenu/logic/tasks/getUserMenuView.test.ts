import { getUserMenuView } from './getUserMenuView'

const ann = { email: 'ann@example.com' }

describe('getUserMenuView', () => {
  it('waits for the session check', () => {
    expect(getUserMenuView({ status: 'checking', user: null })).toBe('checking')
  })

  it('tells a guest from a signed-in user', () => {
    expect(getUserMenuView({ status: 'ready', user: null })).toBe('guest')
    expect(getUserMenuView({ status: 'ready', user: ann })).toBe('user')
  })
})
