/** The parts of TVmaze's response that the API reads. TVmaze sends more. */

export type TvmazeChannel = {
  name: string
}

export type TvmazeShow = {
  id: number
  name: string
  genres: string[]
  status: string
  premiered: string | null
  network: TvmazeChannel | null
  webChannel: TvmazeChannel | null
  image: { medium: string; original: string } | null
  summary: string | null
}

export type TvmazeSearchResult = {
  score: number
  show: TvmazeShow
}
