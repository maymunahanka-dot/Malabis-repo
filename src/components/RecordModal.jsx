import { useMemo, useState } from 'react'
import { computeBalance } from '../lib/money'

function buildForm(initial, defaultSerial) {
  if (initial) {
    return {
      serialNo: initial.serialNo || '',
      name: initial.name || '',
      phoneNumber: initial.phoneNumber || '',
      dateIn: initial.dateIn || '',
      dateOut: initial.dateOut || '',
      totalAmount: initial.totalAmount ?? '',
      deposit: initial.deposit ?? '',
      isPaid: Boolean(initial.isPaid),
    }
  }
  return {
    serialNo: defaultSerial || '',
    name: '',
    phoneNumber: '',
    dateIn: new Date().toISOString().slice(0, 10),
    dateOut: '',
    totalAmount: '',
    deposit: '',
    isPaid: false,
  }
}

export function RecordModal({ open, mode, initial, defaultSerial, onClose, onSave }) {
  const [form, setForm] = useState(() => buildForm(initial, defaultSerial))
  const [busy, setBusy] = useState(false)
  const [error, setError] = useState('')

  const balance = useMemo(
    () => computeBalance(form.totalAmount, form.deposit),
    [form.totalAmount, form.deposit],
  )

  function update(field, value) {
    setForm((prev) => ({ ...prev, [field]: value }))
  }

  async function handleSubmit(event) {
    event.preventDefault()
    setError('')
    setBusy(true)
    try {
      await onSave({ ...form, isPaid: form.isPaid || balance <= 0 })
      onClose()
    } catch (err) {
      setError(err?.message || 'Could not save this record.')
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
        aria-labelledby="record-title"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="drawer-head">
          <div>
            <p className="eyebrow">{mode === 'edit' ? 'Update' : 'New entry'}</p>
            <h3 id="record-title">
              {mode === 'edit' ? 'Edit record' : 'Add record'}
            </h3>
          </div>
          <button className="icon-btn" type="button" onClick={onClose} aria-label="Close">
            ×
          </button>
        </div>
        <form className="drawer-form" onSubmit={handleSubmit}>
          <div className="drawer-body">
            <label>
              Serial no
              <input
                required
                value={form.serialNo}
                onChange={(e) => update('serialNo', e.target.value)}
              />
            </label>
            <label>
              Name
              <input
                required
                value={form.name}
                onChange={(e) => update('name', e.target.value)}
              />
            </label>
            <label>
              Phone number
              <input
                required
                value={form.phoneNumber}
                onChange={(e) => update('phoneNumber', e.target.value)}
              />
            </label>
            <label>
              Date in
              <input
                type="date"
                required
                value={form.dateIn}
                onChange={(e) => update('dateIn', e.target.value)}
              />
            </label>
            <label>
              Date out
              <input
                type="date"
                value={form.dateOut}
                onChange={(e) => update('dateOut', e.target.value)}
              />
            </label>
            <label>
              Total amount
              <input
                type="number"
                min="0"
                step="0.01"
                required
                value={form.totalAmount}
                onChange={(e) => update('totalAmount', e.target.value)}
              />
            </label>
            <label>
              Deposit
              <input
                type="number"
                min="0"
                step="0.01"
                value={form.deposit}
                onChange={(e) => update('deposit', e.target.value)}
              />
            </label>
            <div className="balance-box">
              <span>Balance</span>
              <strong>{balance.toFixed(2)}</strong>
            </div>
            <label className="check">
              <input
                type="checkbox"
                checked={form.isPaid || balance <= 0}
                onChange={(e) => update('isPaid', e.target.checked)}
              />
              Is paid
            </label>
            {error ? <p className="alert">{error}</p> : null}
          </div>
          <div className="drawer-actions">
            <button className="btn ghost" type="button" onClick={onClose}>
              Cancel
            </button>
            <button className="btn primary" type="submit" disabled={busy}>
              {busy ? 'Saving…' : 'Save record'}
            </button>
          </div>
        </form>
      </aside>
    </div>
  )
}
