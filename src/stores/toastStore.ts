import { createStore } from 'zustand/vanilla'

import type { ToastState } from './types'

/** The toast on screen. Data only: tasks read and write it. */
export const toastStore = createStore<ToastState>()(() => ({ toast: null }))
