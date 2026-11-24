import { StarButton } from '~/ui/StarButton'

import { type ShowCardProps, usePresenter } from './logic/usePresenter'

import styles from './ShowCard.module.css'

export function ShowCard(props: ShowCardProps) {
  const { card, ...favorite } = usePresenter(props)

  return (
    <li className={styles.card}>
      <div className={styles.poster} data-tone={card.tone}>
        {card.imageUrl ? (
          <img
            className={styles.image}
            src={card.imageUrl}
            alt=""
            loading="lazy"
          />
        ) : (
          <span className={styles.initials} aria-hidden="true">
            {card.initials}
          </span>
        )}
        {card.status && <span className={styles.status}>{card.status}</span>}
        <span className={styles.favorite}>
          <StarButton
            label={favorite.favoriteLabel}
            pressed={favorite.isFavorite}
            busy={favorite.isSavingFavorite}
            onClick={favorite.toggleFavorite}
          />
        </span>
      </div>
      <div className={styles.heading}>
        <h2 className={styles.name}>{card.name}</h2>
        {card.meta && <p className={styles.meta}>{card.meta}</p>}
      </div>
      {card.genres.length > 0 && (
        <ul className={styles.genres} aria-label="Genres">
          {card.genres.map((genre) => (
            <li key={genre} className={styles.genre}>
              {genre}
            </li>
          ))}
        </ul>
      )}
      {card.summary && <p className={styles.summary}>{card.summary}</p>}
    </li>
  )
}
