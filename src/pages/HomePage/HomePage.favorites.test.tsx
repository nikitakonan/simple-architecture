import { screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'

import { toggleFavorite } from '../../services/favorites'
import { favoritesStore } from '../../stores/favoritesStore'

import { renderWith, show } from './HomePage.testUtils'

vi.mock('./logic/usePresenter')
vi.mock('../../services/favorites')

describe('HomePage favorites', () => {
  it('shows the favorites count, card stars and the toast', async () => {
    favoritesStore.setState({ items: [show] })
    renderWith({
      view: 'results',
      visibleShows: [show],
      toast: { id: 1, text: 'Added “Midsomer Murders” to favorites' },
    })

    expect(screen.getByRole('button', { name: 'Favorites 1' })).toBeVisible()
    expect(screen.getByText(/Added “Midsomer Murders”/)).toBeVisible()
    const star = screen.getByRole('button', {
      name: 'Favorite Midsomer Murders (1997 · ITV)',
    })
    expect(star).toHaveAttribute('aria-pressed', 'true')
    await userEvent.click(star)
    expect(toggleFavorite).toHaveBeenCalledWith(show)
  })
})
