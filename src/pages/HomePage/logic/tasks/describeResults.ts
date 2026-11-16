type ResultsInput = {
  total: number
  filtered: number
  genre: string | null
}

/** "12 shows", or "4 Drama of 12 shows" when a genre is selected. */
export function describeResults({
  total,
  filtered,
  genre,
}: ResultsInput): string {
  const showsWord = total === 1 ? 'show' : 'shows'
  return genre
    ? `${filtered} ${genre} of ${total} ${showsWord}`
    : `${total} ${showsWord}`
}
