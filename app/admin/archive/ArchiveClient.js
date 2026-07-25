'use client'
import { useState } from 'react'
import { useRouter } from 'next/navigation'
import styles from '../list.module.css'
import aStyles from './archive.module.css'

const TYPE_LABELS = {
  financing:  'Financing',
  auction:    'Auction',
  inspection: 'Inspection',
  contact:    'Contact',
  transport:  'Transport',
  testDrive:  'Test Drive',
}

function getDisplayName(rec) {
  try {
    const d = JSON.parse(rec.data)
    return d.firstName ? `${d.firstName} ${d.lastName || ''}`.trim()
      : d.name || d.email || `#${rec.originalId}`
  } catch { return `#${rec.originalId}` }
}

function ConfirmDialog({ message, onConfirm, onClose, danger }) {
  return (
    <div style={{
      position: 'fixed', inset: 0, zIndex: 9999,
      background: 'rgba(0,0,0,0.5)',
      display: 'flex', alignItems: 'center', justifyContent: 'center',
    }}>
      <div style={{
        background: '#fff', borderRadius: 12, padding: '28px 32px',
        maxWidth: 400, width: '90%', textAlign: 'center',
        boxShadow: '0 20px 60px rgba(0,0,0,0.25)',
      }}>
        <p style={{ fontSize: 15, fontWeight: 600, color: '#111', margin: '0 0 8px' }}>{message}</p>
        {danger && <p style={{ fontSize: 13, color: '#dc2626', margin: '0 0 20px', fontWeight: 600 }}>⚠️ This action cannot be undone.</p>}
        <div style={{ display: 'flex', gap: 10, justifyContent: 'center' }}>
          <button onClick={onClose} style={{ padding: '9px 20px', borderRadius: 8, border: '1px solid #e5e7eb', background: '#fff', color: '#374151', fontWeight: 600, fontSize: 14, cursor: 'pointer' }}>
            Cancel
          </button>
          <button onClick={onConfirm} style={{ padding: '9px 20px', borderRadius: 8, border: 'none', background: danger ? '#dc2626' : '#16a34a', color: '#fff', fontWeight: 700, fontSize: 14, cursor: 'pointer' }}>
            {danger ? 'Delete Permanently' : 'Restore'}
          </button>
        </div>
      </div>
    </div>
  )
}

export default function ArchiveClient({ records }) {
  const router = useRouter()
  const [filter, setFilter] = useState('all')
  const [expanded, setExpanded] = useState(null)
  const [confirm, setConfirm] = useState(null) // { action, id, name, danger }
  const [loading, setLoading] = useState(null)

  const filtered = filter === 'all' ? records : records.filter(r => r.recordType === filter)
  const types = ['all', ...new Set(records.map(r => r.recordType))]

  async function doAction(action, id) {
    setLoading(id)
    try {
      await fetch('/api/admin/archive', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action, id }),
      })
      router.refresh()
    } finally {
      setLoading(null)
      setConfirm(null)
    }
  }

  return (
    <div className={styles.page}>
      {confirm && (
        <ConfirmDialog
          message={confirm.action === 'restore'
            ? `Restore "${confirm.name}"?`
            : `Permanently delete "${confirm.name}"?`
          }
          danger={confirm.action === 'permanent'}
          onConfirm={() => doAction(confirm.action, confirm.id)}
          onClose={() => setConfirm(null)}
        />
      )}

      <div className={styles.topBar}>
        <div className={styles.topBarLeft}>
          <h1 className={styles.title}>
            <i className="fa-solid fa-box-archive" style={{ marginRight: 8, color: '#e50202' }} />
            Deleted Records Archive
          </h1>
          <p className={styles.sub}>{records.length} archived · super-admin only</p>
        </div>
      </div>

      <div className={styles.content}>
        {/* Type filter tabs */}
        <div className={aStyles.tabs}>
          {types.map(t => (
            <button
              key={t}
              className={`${aStyles.tab} ${filter === t ? aStyles.tabActive : ''}`}
              onClick={() => setFilter(t)}
            >
              {t === 'all' ? 'All' : TYPE_LABELS[t] || t}
              <span className={aStyles.tabCount}>
                {t === 'all' ? records.length : records.filter(r => r.recordType === t).length}
              </span>
            </button>
          ))}
        </div>

        {filtered.length === 0 ? (
          <div className={aStyles.empty}>
            <i className="fa-solid fa-inbox" />
            <p>No archived records{filter !== 'all' ? ` for ${TYPE_LABELS[filter] || filter}` : ''}.</p>
          </div>
        ) : (
          <div className={styles.tableWrap}>
            <table className={styles.table}>
              <thead>
                <tr>
                  <th>Type</th>
                  <th>Name / ID</th>
                  <th>Deleted By</th>
                  <th>Deleted At</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map(rec => (
                  <>
                    <tr key={rec.id}>
                      <td>
                        <span className={`${styles.badge} ${styles.new}`}>
                          {TYPE_LABELS[rec.recordType] || rec.recordType}
                        </span>
                      </td>
                      <td>
                        <strong>{getDisplayName(rec)}</strong>
                        <span style={{ color: '#94a3b8', fontSize: '0.75rem', marginLeft: 6 }}>
                          #{rec.originalId}
                        </span>
                      </td>
                      <td>
                        <span style={{ fontSize: '0.82rem', color: '#475569' }}>
                          {rec.deletedByEmail || '—'}
                        </span>
                        <span className={aStyles.roleBadge} data-role={rec.deletedByRole}>
                          {rec.deletedByRole}
                        </span>
                      </td>
                      <td style={{ fontSize: '0.82rem', color: '#475569' }}>
                        {new Date(rec.deletedAt).toLocaleString('en-US', { dateStyle: 'medium', timeStyle: 'short' })}
                      </td>
                      <td className={styles.actions}>
                        <button
                          className={aStyles.expandBtn}
                          onClick={() => setExpanded(expanded === rec.id ? null : rec.id)}
                        >
                          <i className={`fa-solid fa-chevron-${expanded === rec.id ? 'up' : 'down'}`} />
                          Data
                        </button>
                        <button
                          className={aStyles.restoreBtn}
                          disabled={loading === rec.id}
                          onClick={() => setConfirm({ action: 'restore', id: rec.id, name: getDisplayName(rec) })}
                        >
                          <i className="fa-solid fa-rotate-left" /> Restore
                        </button>
                        <button
                          className={aStyles.permDeleteBtn}
                          disabled={loading === rec.id}
                          onClick={() => setConfirm({ action: 'permanent', id: rec.id, name: getDisplayName(rec), danger: true })}
                        >
                          <i className="fa-solid fa-trash" /> Delete
                        </button>
                      </td>
                    </tr>
                    {expanded === rec.id && (
                      <tr key={`${rec.id}-data`}>
                        <td colSpan={5} style={{ background: '#f8fafc', padding: '0 16px 16px' }}>
                          <pre className={aStyles.dataBlock}>
                            {JSON.stringify(JSON.parse(rec.data), null, 2)}
                          </pre>
                        </td>
                      </tr>
                    )}
                  </>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  )
}
