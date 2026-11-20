import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'

import { StarButton } from '.'

describe('StarButton', () => {
  it('reports its pressed state and handles clicks', async () => {
    const onClick = vi.fn()
    render(<StarButton label="Favorite Lost" pressed onClick={onClick} />)

    const button = screen.getByRole('button', { name: 'Favorite Lost' })
    expect(button).toHaveAttribute('aria-pressed', 'true')
    expect(button).toHaveAttribute('aria-busy', 'false')
    await userEvent.click(button)
    expect(onClick).toHaveBeenCalledOnce()
  })

  it('marks itself busy while saving', () => {
    render(
      <StarButton
        label="Favorite Lost"
        pressed={false}
        busy
        onClick={vi.fn()}
      />,
    )

    const button = screen.getByRole('button', { name: 'Favorite Lost' })
    expect(button).toHaveAttribute('aria-pressed', 'false')
    expect(button).toHaveAttribute('aria-busy', 'true')
  })
})
