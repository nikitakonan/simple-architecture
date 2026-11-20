import { screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'

import { renderWith, show } from './HomePage.testUtils'

vi.mock('./logic/usePresenter')

describe('HomePage', () => {
  it('starts with the search field and sends input to the presenter', async () => {
    const presenter = renderWith({})

    expect(screen.getByLabelText('Search TV shows by title')).toHaveValue('')
    expect(screen.queryByRole('list')).not.toBeInTheDocument()
    await userEvent.type(screen.getByRole('searchbox'), 'a')
    expect(presenter.changeQuery).toHaveBeenCalledWith('a')
    await userEvent.click(screen.getByRole('button', { name: 'office' }))
    expect(presenter.changeQuery).toHaveBeenCalledWith('office')
  })

  it('shows placeholders while loading', () => {
    renderWith({ query: 'mur', view: 'loading', isSearching: true })
    expect(screen.getByLabelText('Loading results')).toBeInTheDocument()
    expect(screen.getByText('Searching…')).toBeInTheDocument()
  })

  it('shows the error with a retry button', async () => {
    const presenter = renderWith({
      query: 'murder',
      view: 'error',
      errorMessage: 'TVmaze didn’t respond.',
    })

    expect(screen.getByRole('alert')).toHaveTextContent(
      'TVmaze didn’t respond.',
    )
    await userEvent.click(screen.getByRole('button', { name: 'Try again' }))
    expect(presenter.retry).toHaveBeenCalledOnce()
  })

  it('tells the user when nothing matched', () => {
    renderWith({ query: 'zxqv', view: 'empty', searchedFor: 'zxqv' })

    expect(screen.getByText('No shows match “zxqv”.')).toBeInTheDocument()
  })

  it('renders results, genre chips and pagination', async () => {
    const presenter = renderWith({
      query: 'murder',
      view: 'results',
      searchedFor: 'murder',
      genres: [{ name: 'Crime', count: 4 }],
      selectedGenre: 'Crime',
      totalCount: 4,
      resultsLabel: '4 Crime of 4 shows',
      visibleShows: [show],
      pageCount: 2,
      rangeLabel: 'Showing 1–3 of 4',
    })

    expect(
      screen.getByRole('heading', { name: 'Midsomer Murders' }),
    ).toBeVisible()
    await userEvent.click(screen.getByRole('button', { name: 'All 4' }))
    expect(presenter.selectGenre).toHaveBeenCalledWith(null)
    await userEvent.click(screen.getByRole('button', { name: 'Reset filter' }))
    expect(presenter.resetGenre).toHaveBeenCalledOnce()
    await userEvent.click(screen.getByRole('button', { name: 'Next page' }))
    expect(presenter.setPage).toHaveBeenCalledWith(2)
  })
})
