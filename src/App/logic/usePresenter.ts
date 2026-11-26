import { useCurrentPage } from './useCurrentPage'
import { useLoadSession } from './useLoadSession'

export function usePresenter() {
  // Search works for guests too, so pages don't wait for the session check.
  useLoadSession()
  return { page: useCurrentPage() }
}
