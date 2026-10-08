import { useState } from 'react'
import Heading from '../../components/atoms/Heading/Heading.jsx'
import Button from '../../components/atoms/Button/Button.jsx'
import TextField from '../../components/atoms/TextField/TextField.jsx'
import styles from './LoginPage.module.css'

export default function LoginPage({ onSignIn, onSignUp, onGoogle }) {
  const [mode, setMode] = useState('signIn')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [notice, setNotice] = useState('')
  const [busy, setBusy] = useState(false)

  const signingUp = mode === 'signUp'

  async function run(action) {
    setBusy(true)
    setError('')
    setNotice('')
    try {
      await action()
    } catch (err) {
      setError(err.message || 'Something went wrong. Please try again.')
    } finally {
      setBusy(false)
    }
  }

  function handleSubmit(event) {
    event.preventDefault()
    run(async () => {
      if (signingUp) {
        const result = await onSignUp(email.trim(), password)
        if (result?.needsConfirmation) {
          setNotice('Check your email for a confirmation link, then come back and sign in.')
          setMode('signIn')
        }
      } else {
        await onSignIn(email.trim(), password)
      }
    })
  }

  function switchMode() {
    setMode(signingUp ? 'signIn' : 'signUp')
    setError('')
    setNotice('')
  }

  return (
    <main className={styles.page}>
      <img src={`${import.meta.env.BASE_URL}logo.png`} alt="" className={styles.logo} />
      <div className={styles.intro}>
        <Heading level={1} centered accent>
          Welcome to 3 Steps!
        </Heading>
        <p className={styles.tagline}>Looking for something to do when you have nothing to do?</p>
      </div>

      <form className={styles.card} onSubmit={handleSubmit}>
        <Heading level={2}>{signingUp ? 'Create your account' : 'Sign-in'}</Heading>
        <TextField
          id="login-email"
          label="Email"
          type="email"
          value={email}
          onChange={setEmail}
          autoComplete="email"
          size="medium"
          required
        />
        <TextField
          id="login-password"
          label="Password"
          type="password"
          value={password}
          onChange={setPassword}
          autoComplete={signingUp ? 'new-password' : 'current-password'}
          hint={signingUp ? 'At least 6 characters.' : undefined}
          size="medium"
          required
        />
        {error && (
          <p role="alert" className={styles.error}>
            {error}
          </p>
        )}
        {notice && (
          <p role="status" className={styles.notice}>
            {notice}
          </p>
        )}
        <div className={styles.actions}>
          <Button type="submit" variant="accent" size="large" fullWidth disabled={busy}>
            {signingUp ? 'Create account' : 'Sign in'}
          </Button>
          <Button variant="primary" size="large" fullWidth disabled={busy} onClick={() => run(onGoogle)}>
            Continue with Google
          </Button>
          <Button
            variant="primary"
            style="outline"
            size="large"
            fullWidth
            disabled={busy}
            onClick={switchMode}
          >
            {signingUp ? 'I already have an account' : 'Create an account'}
          </Button>
        </div>
      </form>
    </main>
  )
}
