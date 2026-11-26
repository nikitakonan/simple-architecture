import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'

import { logOut } from '~/api/auth'
import { navigationStore } from '~/stores/navigationStore'
import { sessionStore } from '~/stores/sessionStore'

import { UserMenu } from '.'

vi.mock('~/api/auth')

describe('UserMenu', () => {
  it('renders nothing while the session is being checked', () => {
    const { container } = render(<UserMenu />)

    expect(container).toBeEmptyDOMElement()
  })

  it('offers a guest to sign in', async () => {
    sessionStore.setState({ status: 'ready', user: null })
    render(<UserMenu />)

    await userEvent.click(screen.getByRole('button', { name: 'Sign in' }))

    expect(navigationStore.getState().page).toBe('login')
  })

  it('shows the email of the user and logs out', async () => {
    vi.mocked(logOut).mockResolvedValue({ user: null })
    sessionStore.setState({
      status: 'ready',
      user: { email: 'ann@example.com' },
    })
    render(<UserMenu />)
    expect(screen.getByText('ann@example.com')).toBeVisible()

    await userEvent.click(screen.getByRole('button', { name: 'Log out' }))

    expect(logOut).toHaveBeenCalledOnce()
    expect(screen.getByRole('button', { name: 'Sign in' })).toBeVisible()
  })
})
