import { act, renderHook } from '@testing-library/react'
import type { FormEvent } from 'react'

import { navigationStore } from '~/stores/navigationStore'
import { logIn } from './tasks/logIn'

import { usePresenter } from './usePresenter'

vi.mock('./tasks/logIn')

const event = { preventDefault: vi.fn() } as unknown as FormEvent

function setup(email: string) {
  const hook = renderHook(() => usePresenter())
  act(() => hook.result.current.changeEmail(email))
  const submit = () => act(() => hook.result.current.submit(event))
  return { result: hook.result, submit }
}

describe('LoginPage usePresenter', () => {
  it('shows a validation error without calling the server', async () => {
    const { result, submit } = setup('ann')

    await submit()

    expect(result.current.error).toBe('Enter a valid email address.')
    expect(logIn).not.toHaveBeenCalled()
  })

  it('signs in with the email', async () => {
    vi.mocked(logIn).mockResolvedValue(null)
    const { submit } = setup('ann@example.com')

    await submit()

    expect(logIn).toHaveBeenCalledWith('ann@example.com', expect.anything())
  })

  it('shows the error when signing in fails, and hides it on typing', async () => {
    vi.mocked(logIn).mockResolvedValue('Nope.')
    const { result, submit } = setup('ann@example.com')

    await submit()
    expect(result.current).toMatchObject({
      error: 'Nope.',
      isSubmitting: false,
    })

    act(() => result.current.changeEmail('ann@example.co'))
    expect(result.current.error).toBeNull()
  })

  it('goes back to the home page', () => {
    navigationStore.setState({ page: 'login' })
    const { result } = setup('')

    act(() => result.current.goBack())

    expect(navigationStore.getState().page).toBe('home')
  })
})
