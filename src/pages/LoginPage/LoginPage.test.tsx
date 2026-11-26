import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'

import { logIn } from '~/api/auth'
import { navigationStore } from '~/stores/navigationStore'
import { sessionStore } from '~/stores/sessionStore'

import { LoginPage } from '.'

vi.mock('~/api/auth')

function setup() {
  navigationStore.setState({ page: 'login' })
  render(<LoginPage />)
  return {
    field: screen.getByLabelText('Email'),
    submit: screen.getByRole('button', { name: 'Sign in' }),
  }
}

describe('LoginPage', () => {
  it('signs in and returns to the home page', async () => {
    const user = { email: 'ann@example.com' }
    vi.mocked(logIn).mockResolvedValue({ user })
    const { field, submit } = setup()

    await userEvent.type(field, 'ann@example.com')
    await userEvent.click(submit)

    expect(logIn).toHaveBeenCalledWith('ann@example.com')
    expect(sessionStore.getState().user).toEqual(user)
    expect(navigationStore.getState().page).toBe('home')
  })

  it('explains an invalid email next to the field', async () => {
    const { field, submit } = setup()

    await userEvent.type(field, 'ann{Enter}')

    expect(screen.getByRole('alert')).toHaveTextContent(
      'Enter a valid email address.',
    )
    expect(field).toHaveAttribute('aria-invalid', 'true')
    expect(submit).toBeEnabled()
    expect(logIn).not.toHaveBeenCalled()
  })

  it('shows that it is signing in', async () => {
    vi.mocked(logIn).mockReturnValue(new Promise(() => {}))
    const { field, submit } = setup()

    await userEvent.type(field, 'ann@example.com')
    await userEvent.click(submit)

    expect(screen.getByRole('button', { name: 'Signing in…' })).toBeDisabled()
  })

  it('goes back to the search', async () => {
    setup()

    await userEvent.click(
      screen.getByRole('button', { name: 'Back to search' }),
    )

    expect(navigationStore.getState().page).toBe('home')
  })
})
