import type { ReactNode } from 'react'

import styles from './Header.module.css'

type HeaderProps = {
  /** Controls shown on the right, next to the credit link. */
  children?: ReactNode
}

export function Header({ children }: HeaderProps) {
  return (
    <header className={styles.header}>
      <div className={styles.brand}>
        <span className={styles.logo}>
          <svg
            aria-hidden="true"
            width="22"
            height="22"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <rect x="2" y="7" width="20" height="14" rx="2" />
            <path d="M17 2l-5 5-5-5" />
          </svg>
        </span>
        <span className={styles.name}>TV Shows Explorer</span>
      </div>
      <div className={styles.actions}>
        <a
          className={styles.credit}
          href="https://www.tvmaze.com/api"
          target="_blank"
          rel="noreferrer"
        >
          Data from TVmaze
        </a>
        {children}
      </div>
    </header>
  )
}
