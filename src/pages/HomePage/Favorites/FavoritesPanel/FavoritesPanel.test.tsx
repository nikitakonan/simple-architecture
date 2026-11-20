import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'

import { FavoritesPanel } from '.'

const lost = {
  id: 2,
  name: 'Lost',
  meta: '2004 · ABC',
  imageUrl: null,
  starLabel: 'Favorite Lost (2004 · ABC)',
}

function renderPanel(rows: (typeof lost)[]) {
  const props = {
    id: 'panel',
    rows,
    isSaving: (id: number) => id === 2,
    onToggle: vi.fn(),
    onClose: vi.fn(),
  }
  render(<FavoritesPanel {...props} />)
  return props
}

describe('FavoritesPanel', () => {
  it('lists the favorites with their stars', async () => {
    const props = renderPanel([lost])

    const star = screen.getByRole('button', {
      name: 'Favorite Lost (2004 · ABC)',
    })
    expect(star).toHaveAttribute('aria-pressed', 'true')
    expect(star).toHaveAttribute('aria-busy', 'true')
    await userEvent.click(star)
    expect(props.onToggle).toHaveBeenCalledWith(2)
    await userEvent.click(screen.getByRole('button', { name: 'Close' }))
    expect(props.onClose).toHaveBeenCalledOnce()
  })

  it('explains how to add favorites when there are none', () => {
    renderPanel([])

    expect(screen.getByText(/No favorites yet/)).toBeInTheDocument()
  })
})
