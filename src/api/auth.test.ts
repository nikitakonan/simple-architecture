import { fetchSession, logIn, logOut } from './auth'

const ANN = { user: { email: 'ann@example.com' } }

describe('auth API', () => {
  let fetchMock: ReturnType<typeof vi.fn>

  beforeEach(() => {
    vi.stubEnv('VITE_API_URL', 'https://api.test')
    fetchMock = vi.fn().mockImplementation(async () => Response.json(ANN))
    vi.stubGlobal('fetch', fetchMock)
  })

  afterEach(() => {
    vi.unstubAllEnvs()
    vi.unstubAllGlobals()
  })

  it('loads the session with the cookie and a signal', async () => {
    const { signal } = new AbortController()

    await expect(fetchSession(signal)).resolves.toEqual(ANN)
    expect(fetchMock).toHaveBeenCalledWith('https://api.test/auth/session', {
      credentials: 'include',
      signal,
    })
  })

  it('posts the email as JSON to sign in', async () => {
    await logIn('ann@example.com')

    expect(fetchMock).toHaveBeenCalledWith('https://api.test/auth/login', {
      credentials: 'include',
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: '{"email":"ann@example.com"}',
    })
  })

  it('signs out with the cookie', async () => {
    fetchMock.mockResolvedValue(Response.json({ user: null }))

    await expect(logOut()).resolves.toEqual({ user: null })
    expect(fetchMock).toHaveBeenCalledWith('https://api.test/auth/logout', {
      credentials: 'include',
      method: 'POST',
    })
  })

  it('throws the error message from the API', async () => {
    fetchMock.mockResolvedValue(
      Response.json({ error: 'Enter a valid email address.' }, { status: 400 }),
    )

    await expect(logIn('x')).rejects.toThrow('Enter a valid email address.')
  })
})
