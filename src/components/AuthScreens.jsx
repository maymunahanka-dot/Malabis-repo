import { useState } from 'react'
import { useAuth } from '../context/AuthContext'
import { formatAuthError } from '../lib/errors'
import { BrandMark } from './BrandMark'

export function SetupScreen() {
  return (
    <div className="auth-shell">
      <aside className="auth-panel">
        <BrandMark size={56} />
        <p className="eyebrow">Malabis ledger</p>
        <h1>Connect your Firebase project.</h1>
        <p className="lede">
          This app talks to Firebase directly. Copy your web app keys into a
          <code> .env </code> file, then restart the dev server.
        </p>
      </aside>
      <main className="auth-card">
        <ol className="setup-steps">
          <li>Create a project at console.firebase.google.com</li>
          <li>Enable Authentication → Email/Password</li>
          <li>Create a Cloud Firestore database</li>
          <li>Project settings → Your apps → Web app</li>
          <li>Paste the keys into <code>.env</code></li>
          <li>Publish the rules in <code>firestore.rules</code></li>
        </ol>
        <pre className="env-sample">{`VITE_FIREBASE_API_KEY=
VITE_FIREBASE_AUTH_DOMAIN=
VITE_FIREBASE_PROJECT_ID=
VITE_FIREBASE_STORAGE_BUCKET=
VITE_FIREBASE_MESSAGING_SENDER_ID=
VITE_FIREBASE_APP_ID=`}</pre>
      </main>
    </div>
  )
}

export function AuthScreen() {
  const { login, createAccount } = useAuth()
  const [mode, setMode] = useState('login')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [busy, setBusy] = useState(false)
  const [error, setError] = useState('')

  const isSignup = mode === 'signup'

  async function handleSubmit(event) {
    event.preventDefault()
    setError('')
    setBusy(true)
    try {
      if (isSignup) await createAccount(email.trim(), password)
      else await login(email.trim(), password)
    } catch (err) {
      setError(formatAuthError(err))
    } finally {
      setBusy(false)
    }
  }

  return (
    <div className="auth-shell">
      <aside className="auth-panel">
        <BrandMark size={56} />
        <p className="eyebrow">{isSignup ? 'Create account' : 'Welcome back'}</p>
        <h1>{isSignup ? 'Sign up to start the ledger.' : 'Sign in to open the ledger.'}</h1>
        <p className="lede">
          Serials, deposits, balances, and customer details stay on your
          Firebase project.
        </p>
      </aside>
      <main className="auth-card">
        <form className="stack" onSubmit={handleSubmit}>
          <div>
            <p className="eyebrow">Malabis</p>
            <h2>{isSignup ? 'Sign up' : 'Log in'}</h2>
            <p className="muted">
              {isSignup
                ? 'Choose the email and password you will use to sign in.'
                : 'Enter your email and password to continue.'}
            </p>
          </div>
          <label>
            Email
            <input
              type="email"
              autoComplete="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </label>
          <label>
            Password
            <input
              type="password"
              autoComplete={isSignup ? 'new-password' : 'current-password'}
              required
              minLength={6}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </label>
          {error ? <p className="alert">{error}</p> : null}
          <button className="btn primary" type="submit" disabled={busy}>
            {busy ? 'Please wait…' : isSignup ? 'Sign up' : 'Log in'}
          </button>
          <button
            className="btn ghost"
            type="button"
            onClick={() => {
              setError('')
              setMode(isSignup ? 'login' : 'signup')
            }}
          >
            {isSignup ? 'Already have an account? Log in' : 'Sign up'}
          </button>
        </form>
      </main>
    </div>
  )
}
