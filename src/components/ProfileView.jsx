import { useState } from 'react'
import { useAuth } from '../context/AuthContext'
import { formatAuthError } from '../lib/errors'

export function ProfileView({ open, onClose }) {
  const { user, changePassword, logout } = useAuth()
  const [passForm, setPassForm] = useState({ current: '', next: '', confirm: '' })
  const [message, setMessage] = useState('')
  const [error, setError] = useState('')
  const [busy, setBusy] = useState(false)

  async function submitPassword(event) {
    event.preventDefault()
    setError('')
    setMessage('')
    if (passForm.next !== passForm.confirm) {
      setError('New passwords do not match.')
      return
    }
    setBusy(true)
    try {
      await changePassword(passForm.current, passForm.next)
      setPassForm({ current: '', next: '', confirm: '' })
      setMessage('Password updated.')
    } catch (err) {
      setError(formatAuthError(err))
    } finally {
      setBusy(false)
    }
  }

  if (!open) return null

  return (
    <div className="drawer-backdrop" onClick={onClose} role="presentation">
      <aside
        className="drawer"
        role="dialog"
        aria-labelledby="profile-title"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="drawer-head">
          <div>
            <p className="eyebrow">Account</p>
            <h3 id="profile-title">Edit profile</h3>
          </div>
          <button className="icon-btn" type="button" onClick={onClose} aria-label="Close">
            ×
          </button>
        </div>
        <form className="drawer-form" onSubmit={submitPassword}>
          <div className="drawer-body">
            <p className="muted">Signed in as {user?.email}</p>
            {message ? <p className="alert success">{message}</p> : null}
            {error ? <p className="alert">{error}</p> : null}
            <label>
              Current password
              <input
                type="password"
                autoComplete="current-password"
                required
                value={passForm.current}
                onChange={(e) => setPassForm((p) => ({ ...p, current: e.target.value }))}
              />
            </label>
            <label>
              New password
              <input
                type="password"
                autoComplete="new-password"
                required
                minLength={6}
                value={passForm.next}
                onChange={(e) => setPassForm((p) => ({ ...p, next: e.target.value }))}
              />
            </label>
            <label>
              Confirm new password
              <input
                type="password"
                autoComplete="new-password"
                required
                minLength={6}
                value={passForm.confirm}
                onChange={(e) => setPassForm((p) => ({ ...p, confirm: e.target.value }))}
              />
            </label>
            <button className="btn danger" type="button" onClick={logout}>
              Log out
            </button>
          </div>
          <div className="drawer-actions">
            <button className="btn ghost" type="button" onClick={onClose}>
              Cancel
            </button>
            <button className="btn primary" type="submit" disabled={busy}>
              {busy ? 'Updating…' : 'Update password'}
            </button>
          </div>
        </form>
      </aside>
    </div>
  )
}
