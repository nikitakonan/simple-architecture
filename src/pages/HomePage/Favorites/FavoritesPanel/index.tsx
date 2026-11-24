import { StarButton } from '~/ui/StarButton'

import styles from './FavoritesPanel.module.css'

type FavoriteRow = {
  id: number
  name: string
  meta: string
  imageUrl: string | null
  starLabel: string
}

type FavoritesPanelProps = {
  id: string
  rows: FavoriteRow[]
  isSaving: (id: number) => boolean
  /** Called with the id of the show whose star was clicked. */
  onToggle: (id: number) => void
  onClose: () => void
}

export function FavoritesPanel({
  id,
  rows,
  isSaving,
  onToggle,
  onClose,
}: FavoritesPanelProps) {
  return (
    <section id={id} className={styles.panel} aria-label="Favorite shows">
      <div className={styles.header}>
        <h2 className={styles.title}>Favorites</h2>
        <button type="button" className={styles.close} onClick={onClose}>
          Close
        </button>
      </div>
      {rows.length === 0 ? (
        <p className={styles.empty}>
          No favorites yet. Tap the star on a show to keep it here.
        </p>
      ) : (
        <ul className={styles.list}>
          {rows.map((row) => (
            <li key={row.id} className={styles.item}>
              {row.imageUrl ? (
                <img className={styles.thumb} src={row.imageUrl} alt="" />
              ) : (
                <span className={styles.thumb} aria-hidden="true" />
              )}
              <span className={styles.text}>
                <span className={styles.name}>{row.name}</span>
                {row.meta && <span className={styles.meta}>{row.meta}</span>}
              </span>
              <StarButton
                label={row.starLabel}
                pressed
                busy={isSaving(row.id)}
                onClick={() => onToggle(row.id)}
              />
            </li>
          ))}
        </ul>
      )}
    </section>
  )
}
