import '@testing-library/jest-dom/vitest'
import { cleanup } from '@testing-library/react'
import { afterEach } from 'vitest'

import { favoritesStore } from '../stores/favoritesStore'
import { toastStore } from '../stores/toastStore'

afterEach(() => {
  cleanup()
  // The stores are app-wide singletons: give every test an empty database.
  favoritesStore.setState(favoritesStore.getInitialState(), true)
  toastStore.setState(toastStore.getInitialState(), true)
})
