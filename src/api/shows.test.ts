import { fetchShowsPage } from './shows'

const PAGE = { query: 'murder', items: [] }

describe('fetchShowsPage', () => {
  beforeEach(() => {
    vi.stubEnv('VITE_API_URL', 'https://api.test/')
  })

  afterEach(() => {
    vi.unstubAllEnvs()
    vi.unstubAllGlobals()
  })

  it('requests the page with the query, genre and signal', async () => {
    const fetchMock = vi
      .fn()
      .mockResolvedValue(new Response(JSON.stringify(PAGE)))
    vi.stubGlobal('fetch', fetchMock)
    const { signal } = new AbortController()

    const result = await fetchShowsPage(
      { query: 'law & order', genre: 'Crime', page: 2 },
      signal,
    )

    expect(fetchMock).toHaveBeenCalledWith(
      'https://api.test/shows?q=law+%26+order&page=2&genre=Crime',
      { signal },
    )
    expect(result).toEqual(PAGE)
  })

  it('leaves out the genre when none is selected', async () => {
    const fetchMock = vi
      .fn()
      .mockResolvedValue(new Response(JSON.stringify(PAGE)))
    vi.stubGlobal('fetch', fetchMock)

    await fetchShowsPage({ query: 'murder', genre: null, page: 1 })

    expect(fetchMock.mock.calls[0][0]).toBe(
      'https://api.test/shows?q=murder&page=1',
    )
  })

  it('throws the error message from the API', async () => {
    const body = JSON.stringify({ error: 'TVmaze did not respond.' })
    vi.stubGlobal(
      'fetch',
      vi.fn().mockResolvedValue(new Response(body, { status: 502 })),
    )

    await expect(
      fetchShowsPage({ query: 'murder', genre: null, page: 1 }),
    ).rejects.toThrow('TVmaze did not respond.')
  })

  it('falls back to the status when the error is not JSON', async () => {
    vi.stubGlobal(
      'fetch',
      vi.fn().mockResolvedValue(new Response('Bad gateway', { status: 502 })),
    )

    await expect(
      fetchShowsPage({ query: 'murder', genre: null, page: 1 }),
    ).rejects.toThrow('API request failed: 502')
  })
})
