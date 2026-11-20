import { FavoritesPanel } from './FavoritesPanel'
import { type FavoritesProps, usePresenter } from './logic/usePresenter'

import styles from './Favorites.module.css'

export function Favorites(props: FavoritesProps) {
  const favorites = usePresenter(props)

  return (
    // biome-ignore lint/a11y/noStaticElementInteractions: Escape from inside closes the panel
    <div
      ref={favorites.rootRef}
      className={styles.root}
      onKeyDown={favorites.closeOnEscape}
    >
      <button
        type="button"
        className={styles.button}
        aria-expanded={favorites.isOpen}
        aria-controls={favorites.panelId}
        onClick={favorites.toggleOpen}
      >
        <svg
          width="18"
          height="18"
          viewBox="0 0 24 24"
          fill="currentColor"
          aria-hidden="true"
        >
          <path d="M12 2.8l2.84 5.76 6.36.92-4.6 4.49 1.09 6.33L12 17.31l-5.69 2.99 1.09-6.33-4.6-4.49 6.36-.92z" />
        </svg>
        Favorites <span className={styles.count}>{favorites.count}</span>
      </button>
      {favorites.isOpen && (
        <FavoritesPanel
          id={favorites.panelId}
          rows={favorites.rows}
          isSaving={favorites.isSaving}
          onToggle={favorites.toggleById}
          onClose={favorites.close}
        />
      )}
    </div>
  )
}
