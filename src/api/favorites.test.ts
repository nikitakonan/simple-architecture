import { addFavorite, fetchFavorites, removeFavorite } from './favorites'

const FAVORITES = { items: [{ id: 1, name: 'Lost' }] }

describe('favorites API', () => {
  let fetchMock: ReturnType<typeof vi.fn>

  beforeEach(() => {
    vi.stubEnv('VITE_API_URL', 'https://api.test')
    fetchMock = vi.fn().mockImplementation(async () => Response.json(FAVORITES))
    vi.stubGlobal('fetch', fetchMock)
  })

  afterEach(() => {
    vi.unstubAllEnvs()
    vi.unstubAllGlobals()
  })

  it('loads the favorites with a signal', async () => {
    const { signal } = new AbortController()

    await expect(fetchFavorites(signal)).resolves.toEqual(FAVORITES)
    expect(fetchMock).toHaveBeenCalledWith('https://api.test/favorites', {
      credentials: 'include',
      signal,
    })
  })

  it('adds and removes a show by id', async () => {
    await addFavorite(7)
    await removeFavorite(7)

    expect(fetchMock.mock.calls).toEqual([
      [
        'https://api.test/favorites/7',
        { credentials: 'include', method: 'PUT' },
      ],
      [
        'https://api.test/favorites/7',
        { credentials: 'include', method: 'DELETE' },
      ],
    ])
  })

  it('throws the error message from the API', async () => {
    fetchMock.mockResolvedValue(
      Response.json({ error: 'No such show.' }, { status: 404 }),
    )

    await expect(addFavorite(7)).rejects.toThrow('No such show.')
  })
})
