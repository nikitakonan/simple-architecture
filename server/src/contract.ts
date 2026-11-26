/**
 * The public contract of the API: what `GET /shows` and `/favorites` return.
 * The frontend relies on these types, so change them together with it.
 */

export type ShowImage = {
  medium: string
  original: string
}

export type Channel = {
  name: string
}

export type Show = {
  id: number
  name: string
  genres: string[]
  status: string
  premiered: string | null
  network: Channel | null
  webChannel: Channel | null
  image: ShowImage | null
  summary: string | null
}

export type GenreOption = {
  name: string
  count: number
}

/** `GET /shows?q=<query>&genre=<genre>&page=<page>` */
export type ShowsPage = {
  query: string
  /** The genre the results are filtered by, or `null` for all genres. */
  genre: string | null
  /** Genres of all results for `query`, so the chips survive filtering. */
  genres: GenreOption[]
  /** Number of results for `query` before the genre filter. */
  totalCount: number
  /** Number of results that have `genre` (equals `totalCount` without one). */
  matchCount: number
  /** The requested page, clamped to the existing pages. */
  page: number
  pageCount: number
  pageSize: number
  /** Index of the first item of this page among the matching results. */
  firstIndex: number
  items: Show[]
}

/**
 * `GET /favorites`. `PUT /favorites/:id` and `DELETE /favorites/:id` answer
 * with the updated list too, so the client never has to work it out itself.
 */
export type Favorites = {
  /** The favorite shows, sorted by name. */
  items: Show[]
}

/** Body of every non-2xx response. */
export type ApiError = {
  error: string
}

/** The signed-in user. Sign-in needs only an email: no password. */
export type User = {
  email: string
}

/**
 * `GET /auth/session`, `POST /auth/login` and `POST /auth/logout` all answer
 * with the current session: `user` is `null` for a guest.
 */
export type AuthSession = {
  user: User | null
}

/** Body of `POST /auth/login`. */
export type LoginRequest = {
  email: string
}
