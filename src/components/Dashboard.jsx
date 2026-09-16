import { useEffect, useMemo, useState } from 'react'
import { useAuth } from '../context/AuthContext'
import { formatMoney, toNumber } from '../lib/money'
import {
  createRecord,
  nextSerialNo,
  removeRecord,
  saveRecord,
  subscribeRecords,
} from '../lib/records'
import { BrandMark } from './BrandMark'
import { ProfileView } from './ProfileView'
import { RecordModal } from './RecordModal'

export function Dashboard() {
  const { user, logout } = useAuth()
  const [profileOpen, setProfileOpen] = useState(false)
  const [records, setRecords] = useState([])
  const [queryText, setQueryText] = useState('')
  const [filter, setFilter] = useState('all')
  const [modal, setModal] = useState({ open: false, mode: 'create', record: null })
  const [error, setError] = useState('')

  useEffect(() => {
    return subscribeRecords(setRecords, (err) => {
      setError(err?.message || 'Could not load records.')
    })
  }, [])

  const filtered = useMemo(() => {
    const q = queryText.trim().toLowerCase()
    return records.filter((row) => {
      const paid = Boolean(row.isPaid) || toNumber(row.balance) <= 0
      if (filter === 'paid' && !paid) return false
      if (filter === 'open' && paid) return false
      if (!q) return true
      return [row.serialNo, row.name, row.phoneNumber]
        .join(' ')
        .toLowerCase()
        .includes(q)
    })
  }, [records, queryText, filter])

  const stats = useMemo(() => {
    const open = records.filter((r) => !(r.isPaid || toNumber(r.balance) <= 0))
    const outstanding = open.reduce((sum, r) => sum + toNumber(r.balance), 0)
    const deposits = records.reduce((sum, r) => sum + toNumber(r.deposit), 0)
    return {
      total: records.length,
      open: open.length,
      outstanding,
      deposits,
    }
  }, [records])

  async function handleSave(payload) {
    if (modal.mode === 'edit' && modal.record?.id) {
      await saveRecord(modal.record.id, payload)
    } else {
      await createRecord(payload)
    }
  }

  async function handleDelete(record) {
    const ok = window.confirm(`Delete serial ${record.serialNo} for ${record.name}?`)
    if (!ok) return
    await removeRecord(record.id)
  }

  return (
    <div className="app-shell">
      <TopBar email={user?.email} onProfile={() => setProfileOpen(true)} onLogout={logout} />

      <section className="hero-row">
        <div>
          <p className="eyebrow">Records</p>
          <h1>Customer ledger</h1>
        </div>
        <button
          className="btn primary"
          type="button"
          onClick={() => setModal({ open: true, mode: 'create', record: null })}
        >
          Add record
        </button>
      </section>

      <section className="stats">
        <article>
          <span>Records</span>
          <strong>{stats.total}</strong>
        </article>
        <article>
          <span>Open</span>
          <strong>{stats.open}</strong>
        </article>
        <article>
          <span>Outstanding</span>
          <strong>{formatMoney(stats.outstanding)}</strong>
        </article>
        <article>
          <span>Deposits</span>
          <strong>{formatMoney(stats.deposits)}</strong>
        </article>
      </section>

      <section className="toolbar">
        <input
          className="search"
          placeholder="Search serial, name, or phone"
          value={queryText}
          onChange={(e) => setQueryText(e.target.value)}
        />
        <div className="pills">
          {[
            ['all', 'All'],
            ['open', 'Unpaid'],
            ['paid', 'Paid'],
          ].map(([id, label]) => (
            <button
              key={id}
              type="button"
              className={filter === id ? 'pill active' : 'pill'}
              onClick={() => setFilter(id)}
            >
              {label}
            </button>
          ))}
        </div>
      </section>

      {error ? <p className="alert">{error}</p> : null}

      <div className="table-wrap">
        <table>
          <thead>
            <tr>
              <th>Serial</th>
              <th>Name</th>
              <th>Phone</th>
              <th>In</th>
              <th>Out</th>
              <th>Total</th>
              <th>Deposit</th>
              <th>Balance</th>
              <th>Paid</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            {filtered.length === 0 ? (
              <tr>
                <td colSpan={10} className="empty">
                  No records yet. Add the first entry.
                </td>
              </tr>
            ) : (
              filtered.map((row) => {
                const paid = Boolean(row.isPaid) || toNumber(row.balance) <= 0
                return (
                  <tr key={row.id}>
                    <td className="mono">{row.serialNo}</td>
                    <td>{row.name}</td>
                    <td>{row.phoneNumber}</td>
                    <td>{row.dateIn || '—'}</td>
                    <td>{row.dateOut || '—'}</td>
                    <td>{formatMoney(row.totalAmount)}</td>
                    <td>{formatMoney(row.deposit)}</td>
                    <td>{formatMoney(row.balance)}</td>
                    <td>
                      <span className={paid ? 'badge paid' : 'badge open'}>
                        {paid ? 'Paid' : 'Unpaid'}
                      </span>
                    </td>
                    <td className="row-actions">
                      <button
                        type="button"
                        className="text-btn"
                        onClick={() => setModal({ open: true, mode: 'edit', record: row })}
                      >
                        Edit
                      </button>
                      <button
                        type="button"
                        className="text-btn danger"
                        onClick={() => handleDelete(row)}
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                )
              })
            )}
          </tbody>
        </table>
      </div>

      {modal.open ? (
        <RecordModal
          key={modal.record?.id || 'new'}
          open
          mode={modal.mode}
          initial={modal.record}
          defaultSerial={nextSerialNo(records)}
          onClose={() => setModal({ open: false, mode: 'create', record: null })}
          onSave={handleSave}
        />
      ) : null}

      <ProfileView open={profileOpen} onClose={() => setProfileOpen(false)} />
    </div>
  )
}

function TopBar({ email, onProfile, onLogout }) {
  return (
    <header className="topbar">
      <div className="brand">
        <BrandMark size={36} />
        <div>
          <strong>Malabis</strong>
          <span>Ledger</span>
        </div>
      </div>
      <div className="top-actions">
        <span className="who">{email}</span>
        <button className="btn ghost" type="button" onClick={onProfile}>
          Edit profile
        </button>
        <button className="btn ghost" type="button" onClick={onLogout}>
          Log out
        </button>
      </div>
    </header>
  )
}
