type WithGenres = { genres: string[] }

/** Items that have `genre`, or all items when no genre is selected. */
export function filterByGenre<T extends WithGenres>(
  items: T[],
  genre: string | null,
): T[] {
  if (genre === null) return items
  return items.filter((item) => item.genres.includes(genre))
}
