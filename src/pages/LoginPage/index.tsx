import { usePresenter } from './logic/usePresenter'

import styles from './LoginPage.module.css'

export function LoginPage() {
  const login = usePresenter()

  return (
    <main className={styles.page}>
      <form className={styles.card} noValidate onSubmit={login.submit}>
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
        <h1 className={styles.title}>Sign in</h1>
        <p className={styles.lead}>No password, no sign-up: just your email.</p>

        <label htmlFor="login-email" className={styles.label}>
          Email
        </label>
        <input
          id="login-email"
          className={styles.input}
          type="email"
          autoComplete="email"
          placeholder="you@example.com"
          value={login.email}
          aria-invalid={login.error !== null}
          aria-describedby={login.error ? 'login-error' : undefined}
          onChange={(event) => login.changeEmail(event.target.value)}
        />
        {login.error && (
          <p id="login-error" className={styles.error} role="alert">
            {login.error}
          </p>
        )}

        <button
          type="submit"
          className={styles.submit}
          disabled={login.isSubmitting}
        >
          {login.isSubmitting ? 'Signing in…' : 'Sign in'}
        </button>
        <button type="button" className={styles.back} onClick={login.goBack}>
          Back to search
        </button>
      </form>
    </main>
  )
}
