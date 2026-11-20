import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'

import type { Show } from '../../../api/types'

import { Favorites } from '.'

const items = [
  { id: 1, name: 'Fargo', image: null },
  { id: 2, name: 'Lost', image: null },
] as Show[]

function setup() {
  const onToggle = vi.fn()
  render(<Favorites items={items} isSaving={() => false} onToggle={onToggle} />)
  return {
    onToggle,
    button: screen.getByRole('button', { name: 'Favorites 2' }),
  }
}

describe('Favorites', () => {
  it('shows the count and opens the list on click', async () => {
    const { button } = setup()
    expect(button).toHaveAttribute('aria-expanded', 'false')

    await userEvent.click(button)

    expect(button).toHaveAttribute('aria-expanded', 'true')
    const list = screen.getByRole('region', { name: 'Favorite shows' })
    expect(list).toHaveTextContent('FargoLost')
  })

  it('closes the list with Escape', async () => {
    const { button } = setup()
    await userEvent.click(button)

    await userEvent.keyboard('{Escape}')

    expect(screen.queryByRole('region')).not.toBeInTheDocument()
  })

  it('removes a show from the list', async () => {
    const { button, onToggle } = setup()
    await userEvent.click(button)

    await userEvent.click(screen.getByRole('button', { name: 'Favorite Lost' }))

    expect(onToggle).toHaveBeenCalledWith(items[1])
  })
})
