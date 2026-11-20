import styles from './StarButton.module.css'

export type StarButtonProps = {
  /** The accessible name; it stays the same, `pressed` tells the state. */
  label: string
  pressed: boolean
  busy?: boolean
  onClick: () => void
}

export function StarButton({
  label,
  pressed,
  busy = false,
  onClick,
}: StarButtonProps) {
  return (
    <button
      type="button"
      className={styles.button}
      aria-label={label}
      aria-pressed={pressed}
      aria-busy={busy}
      title={pressed ? 'Remove from favorites' : 'Add to favorites'}
      onClick={onClick}
    >
      <svg
        className={styles.star}
        width="20"
        height="20"
        viewBox="0 0 24 24"
        stroke="currentColor"
        strokeWidth="1.75"
        strokeLinejoin="round"
        aria-hidden="true"
      >
        <path d="M12 2.8l2.84 5.76 6.36.92-4.6 4.49 1.09 6.33L12 17.31l-5.69 2.99 1.09-6.33-4.6-4.49 6.36-.92z" />
      </svg>
    </button>
  )
}
