// The server owns the API contract; the app imports its types from here.
export type {
  ApiError,
  AuthSession,
  Channel,
  Favorites,
  GenreOption,
  LoginRequest,
  Show,
  ShowImage,
  ShowsPage,
  User,
} from '../../server/src/contract'

/** What the app asks the API for: `GET /shows?q=&genre=&page=`. */
export type ShowsPageRequest = {
  query: string
  genre: string | null
  page: number
}
