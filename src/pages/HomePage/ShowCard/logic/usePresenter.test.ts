import { renderHook } from '@testing-library/react'

import type { Show } from '~/api/types'
import { favoritesStore } from '~/stores/favoritesStore'
import { sessionStore } from '~/stores/sessionStore'
import { toggleFavorite } from '~/tasks/toggleFavorite'

import { usePresenter } from './usePresenter'

vi.mock('~/tasks/toggleFavorite')

const show: Show = {
  id: 1,
  name: 'The Office',
  genres: ['Comedy'],
  status: 'Ended',
  premiered: '2005-03-24',
  network: null,
  webChannel: { name: 'Peacock' },
  image: { medium: 'https://example.com/o.jpg', original: '' },
  summary: null,
}

const props = { show }

describe('ShowCard usePresenter', () => {
  beforeEach(() => {
    favoritesStore.setState({ items: [show] })
    sessionStore.setState({ status: 'ready', user: { email: 'a@b.co' } })
  })

  it('returns the show formatted for the card', () => {
    const { result } = renderHook(() => usePresenter(props))

    expect(result.current.card).toMatchObject({
      name: 'The Office',
      meta: '2005 · Peacock',
      summary: '',
      imageUrl: 'https://example.com/o.jpg',
    })
    expect(result.current.favoriteLabel).toBe(
      'Favorite The Office (2005 · Peacock)',
    )
    expect(result.current.isFavorite).toBe(true)
    expect(result.current.canFavorite).toBe(true)
  })

  it('offers no favorite to a guest', () => {
    sessionStore.setState({ user: null })
    const { result } = renderHook(() => usePresenter(props))

    expect(result.current.canFavorite).toBe(false)
  })

  it('toggles this show as a favorite', () => {
    const { result } = renderHook(() => usePresenter(props))

    result.current.toggleFavorite()

    expect(toggleFavorite).toHaveBeenCalledWith(show, expect.anything())
  })

  it('keeps the same card while the show does not change', () => {
    const { result, rerender } = renderHook(() => usePresenter(props))
    const first = result.current.card

    rerender()
    expect(result.current.card).toBe(first)
  })
})
