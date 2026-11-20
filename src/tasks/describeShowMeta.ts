import type { Show } from '../api/types'

/** "2005 · NBC": the premiere year and the channel, whichever are known. */
export function describeShowMeta(
  show: Pick<Show, 'premiered' | 'network' | 'webChannel'>,
): string {
  const year = show.premiered?.slice(0, 4)
  const channel = show.network?.name ?? show.webChannel?.name
  return [year, channel].filter(Boolean).join(' · ')
}
