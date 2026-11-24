import type { ToastState } from '../stores/types'

import { showToast, TOAST_MS } from './showToast'

function setup() {
  let state: ToastState = { toast: null }
  const store = {
    getState: () => state,
    setState: (patch: Partial<ToastState>) => {
      state = { ...state, ...patch }
    },
  }
  const timers: (() => void)[] = []
  const schedule = vi.fn((callback: () => void) => {
    timers.push(callback)
  })
  return { store, schedule, timers }
}

describe('showToast', () => {
  it('shows a message and hides it when its timer runs', () => {
    const { store, schedule, timers } = setup()

    showToast('Saved', { store, schedule })

    expect(store.getState().toast).toEqual({ id: 1, text: 'Saved' })
    expect(schedule).toHaveBeenCalledWith(expect.any(Function), TOAST_MS)
    timers[0]()
    expect(store.getState().toast).toBeNull()
  })

  it('replaces the message, and the old timer leaves the new one alone', () => {
    const { store, schedule, timers } = setup()

    showToast('Saved', { store, schedule })
    showToast('Saved again', { store, schedule })
    timers[0]()

    expect(store.getState().toast).toEqual({ id: 2, text: 'Saved again' })
    timers[1]()
    expect(store.getState().toast).toBeNull()
  })
})
