import { saveFavorite } from './saveFavorite'

const FAVORITES = { items: [] }

describe('saveFavorite', () => {
  it('adds or removes the show', async () => {
    const api = {
      addFavorite: vi.fn().mockResolvedValue(FAVORITES),
      removeFavorite: vi.fn().mockResolvedValue(FAVORITES),
    }

    await expect(saveFavorite({ id: 1, favorite: true }, api)).resolves.toBe(
      FAVORITES,
    )
    await saveFavorite({ id: 2, favorite: false }, api)

    expect(api.addFavorite).toHaveBeenCalledWith(1)
    expect(api.removeFavorite).toHaveBeenCalledWith(2)
  })
})
