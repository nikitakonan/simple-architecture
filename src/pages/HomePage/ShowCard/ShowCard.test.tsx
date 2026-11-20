import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'

import type { Show } from '../../../api/types'

import { ShowCard } from '.'

const show: Show = {
  id: 7,
  name: 'Murder, She Wrote',
  genres: ['Drama', 'Crime'],
  status: 'Ended',
  premiered: '1984-09-30',
  network: { name: 'CBS' },
  webChannel: null,
  image: null,
  summary: '<p>A writer solves <b>murders</b>.</p>',
}

function renderCard(isFavorite = false) {
  const onToggleFavorite = vi.fn()
  render(
    <ShowCard
      show={show}
      isFavorite={isFavorite}
      isSavingFavorite={false}
      onToggleFavorite={onToggleFavorite}
    />,
  )
  return onToggleFavorite
}

describe('ShowCard', () => {
  it('renders the formatted show', () => {
    renderCard()

    expect(
      screen.getByRole('heading', { name: 'Murder, She Wrote' }),
    ).toBeInTheDocument()
    expect(screen.getByText('1984 · CBS')).toBeInTheDocument()
    expect(screen.getByText('A writer solves murders.')).toBeInTheDocument()
    expect(screen.getByText('MSW')).toBeInTheDocument()
    expect(screen.getByRole('list', { name: 'Genres' })).toHaveTextContent(
      'DramaCrime',
    )
  })

  it('has a star that toggles the show as a favorite', async () => {
    const onToggleFavorite = renderCard(true)

    const star = screen.getByRole('button', {
      name: 'Favorite Murder, She Wrote (1984 · CBS)',
    })
    expect(star).toHaveAttribute('aria-pressed', 'true')
    await userEvent.click(star)
    expect(onToggleFavorite).toHaveBeenCalledWith(show)
  })
})
