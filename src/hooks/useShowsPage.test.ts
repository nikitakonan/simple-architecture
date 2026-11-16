import { act, renderHook, waitFor } from '@testing-library/react'

import { fetchShowsPage } from '../api/shows'
import type { ShowsPage, ShowsPageRequest } from '../api/types'

import { useShowsPage } from './useShowsPage'

vi.mock('../api/shows')

const PAGE = { query: 'murder', items: [] } as unknown as ShowsPage
const request = (query: string, page = 1): ShowsPageRequest => ({
  query,
  genre: null,
  page,
})
const pending = () => new Promise<ShowsPage>(() => {})

describe('useShowsPage', () => {
  beforeEach(() => {
    vi.mocked(fetchShowsPage).mockReset()
  })

  it('stays idle and sends no request for an empty query', () => {
    const { result } = renderHook(() => useShowsPage(request('   ')))

    expect(result.current.status).toBe('idle')
    expect(fetchShowsPage).not.toHaveBeenCalled()
  })

  it('loads and then returns the page', async () => {
    vi.mocked(fetchShowsPage).mockResolvedValue(PAGE)
    const { result } = renderHook(() => useShowsPage(request(' murder ', 2)))

    expect(result.current.status).toBe('loading')
    await waitFor(() => expect(result.current.status).toBe('success'))
    expect(result.current.data).toBe(PAGE)
    expect(fetchShowsPage).toHaveBeenCalledWith(
      { query: 'murder', genre: null, page: 2 },
      expect.any(AbortSignal),
    )
  })

  it('reports an error and can retry', async () => {
    vi.mocked(fetchShowsPage).mockRejectedValueOnce(new Error('Network down'))
    const { result } = renderHook(() => useShowsPage(request('murder')))

    await waitFor(() => expect(result.current.status).toBe('error'))
    expect(result.current.error).toBe('Network down')

    vi.mocked(fetchShowsPage).mockResolvedValue(PAGE)
    act(() => result.current.retry())
    await waitFor(() => expect(result.current.status).toBe('success'))
    expect(fetchShowsPage).toHaveBeenCalledTimes(2)
  })

  it('aborts the previous request when the page changes', () => {
    vi.mocked(fetchShowsPage).mockImplementation(pending)
    const { rerender } = renderHook(({ page }) => useShowsPage(page), {
      initialProps: { page: request('murder', 1) },
    })
    const firstSignal = vi.mocked(fetchShowsPage).mock.calls[0][1]

    rerender({ page: request('murder', 2) })

    expect(firstSignal?.aborted).toBe(true)
  })

  it('keeps the previous page while the next one loads', async () => {
    vi.mocked(fetchShowsPage).mockResolvedValueOnce(PAGE)
    const { result, rerender } = renderHook(({ req }) => useShowsPage(req), {
      initialProps: { req: request('murder') },
    })
    await waitFor(() => expect(result.current.status).toBe('success'))

    vi.mocked(fetchShowsPage).mockImplementation(pending)
    rerender({ req: request('office') })

    expect(result.current.status).toBe('loading')
    expect(result.current.data).toBe(PAGE)
  })
})
