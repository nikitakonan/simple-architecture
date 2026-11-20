type FavoriteLabelInput = { name: string; meta: string }

/**
 * The accessible name of a show's star button. The year and channel tell
 * apart shows with the same name ("The Office" from NBC and from BBC Two).
 */
export function getFavoriteLabel({ name, meta }: FavoriteLabelInput): string {
  return meta ? `Favorite ${name} (${meta})` : `Favorite ${name}`
}
