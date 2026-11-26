import { type FormEvent, useState } from 'react'

import * as authApi from '~/api/auth'
import { closeLogin } from './tasks/closeLogin'
import { logIn } from './tasks/logIn'
import { validateEmail } from './tasks/validateEmail'

export function usePresenter() {
  const [email, setEmail] = useState('')
  const [error, setError] = useState<string | null>(null)
  const [isSubmitting, setIsSubmitting] = useState(false)

  const submit = async (event: FormEvent) => {
    event.preventDefault()
    if (isSubmitting) return
    const invalid = validateEmail(email)
    setError(invalid)
    if (invalid) return

    setIsSubmitting(true)
    // On success the task switches to the home page, which unmounts this one.
    const failed = await logIn(email, authApi)
    if (failed) {
      setError(failed)
      setIsSubmitting(false)
    }
  }

  return {
    email,
    // Typing again hides the old error until the next submit.
    changeEmail: (value: string) => {
      setEmail(value)
      setError(null)
    },
    error,
    isSubmitting,
    submit,
    goBack: closeLogin,
  }
}
