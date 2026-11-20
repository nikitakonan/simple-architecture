import styles from './Toast.module.css'

export type ToastProps = {
  /** The message to show, or `null` to show nothing. */
  message: string | null
  /** Changes for every new message, so a repeated one is announced again. */
  messageId?: number
}

/**
 * A short notification at the bottom of the screen. The live region stays
 * mounted so screen readers announce every message put into it.
 */
export function Toast({ message, messageId }: ToastProps) {
  return (
    <div className={styles.region} role="status" aria-live="polite">
      {message && (
        <p key={messageId} className={styles.toast}>
          {message}
        </p>
      )}
    </div>
  )
}
