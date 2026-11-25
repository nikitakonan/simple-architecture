import { toastStore } from '~/stores/toastStore'

import { showToast, TOAST_MS } from './showToast'

describe('showToast', () => {
  beforeEach(() => vi.useFakeTimers())
  afterEach(() => vi.useRealTimers())

  it('shows a message and hides it after TOAST_MS', () => {
    showToast('Saved')

    expect(toastStore.getState().toast).toEqual({ id: 1, text: 'Saved' })
    vi.advanceTimersByTime(TOAST_MS)
    expect(toastStore.getState().toast).toBeNull()
  })

  it('replaces the message, and the old timer leaves the new one alone', () => {
    showToast('Saved')
    vi.advanceTimersByTime(TOAST_MS - 1)
    showToast('Saved again')
    vi.advanceTimersByTime(1)

    expect(toastStore.getState().toast).toEqual({ id: 2, text: 'Saved again' })
    vi.advanceTimersByTime(TOAST_MS)
    expect(toastStore.getState().toast).toBeNull()
  })
})
