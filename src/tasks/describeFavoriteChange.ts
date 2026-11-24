type FavoriteChangeInput = { name: string; favorite: boolean }

/** The toast text after a show was added to or removed from favorites. */
export function describeFavoriteChange({
  name,
  favorite,
}: FavoriteChangeInput): string {
  return favorite
    ? `Added “${name}” to favorites`
    : `Removed “${name}” from favorites`
}
