import { render, screen } from '@testing-library/react'

import { usePresenter } from './logic/usePresenter'

import { App } from '.'

vi.mock('./logic/usePresenter')
vi.mock('~/pages/HomePage', () => ({ HomePage: () => <p>Home page</p> }))
vi.mock('~/pages/LoginPage', () => ({ LoginPage: () => <p>Login page</p> }))

describe('App', () => {
  it('shows the home page', () => {
    vi.mocked(usePresenter).mockReturnValue({ page: 'home' })
    render(<App />)

    expect(screen.getByText('Home page')).toBeInTheDocument()
  })

  it('shows the login page', () => {
    vi.mocked(usePresenter).mockReturnValue({ page: 'login' })
    render(<App />)

    expect(screen.getByText('Login page')).toBeInTheDocument()
  })
})
