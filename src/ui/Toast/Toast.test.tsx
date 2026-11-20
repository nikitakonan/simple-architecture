import { render, screen } from '@testing-library/react'

import { Toast } from '.'

describe('Toast', () => {
  it('shows the message in a live region', () => {
    render(<Toast message="Added “Lost” to favorites" messageId={1} />)

    expect(screen.getByRole('status')).toHaveTextContent(
      'Added “Lost” to favorites',
    )
  })

  it('keeps an empty live region without a message', () => {
    render(<Toast message={null} />)

    expect(screen.getByRole('status')).toBeEmptyDOMElement()
  })
})
