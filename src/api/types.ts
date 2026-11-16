// The server owns the API contract; the app imports its types from here.
export type {
  ApiError,
  Channel,
  GenreOption,
  Show,
  ShowImage,
  ShowsPage,
} from '../../server/src/contract'

/** What the app asks the API for: `GET /shows?q=&genre=&page=`. */
export type ShowsPageRequest = {
  query: string
  genre: string | null
  page: number
}
