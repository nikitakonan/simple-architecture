import type { Show } from '../contract'
import type { TvmazeShow } from '../tvmaze/types'

/**
 * The fields of a TVmaze show that the API exposes. TVmaze sends many more
 * (links, schedule, ratings...), so this keeps responses small and keeps the
 * contract independent of TVmaze's format.
 */
export function toShow(show: TvmazeShow): Show {
  return {
    id: show.id,
    name: show.name,
    genres: show.genres ?? [],
    status: show.status,
    premiered: show.premiered,
    network: show.network ? { name: show.network.name } : null,
    webChannel: show.webChannel ? { name: show.webChannel.name } : null,
    image: show.image
      ? { medium: show.image.medium, original: show.image.original }
      : null,
    summary: show.summary,
  }
}
