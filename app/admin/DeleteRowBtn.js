'use client'
import { useState } from 'react'
import { useRouter } from 'next/navigation'
import styles from './list.module.css'

function Dialog({ message, onConfirm, onClose }) {
  if (!message) return null
  return (
    <div style={{
      position: 'fixed', inset: 0, zIndex: 9999,
      background: 'rgba(0,0,0,0.45)',
      display: 'flex', alignItems: 'center', justifyContent: 'center',
    }}>
      <div style={{
        background: '#fff', borderRadius: 12, padding: '28px 32px',
        maxWidth: 400, width: '90%', boxShadow: '0 20px 60px rgba(0,0,0,0.2)',
        textAlign: 'center',
      }}>
        <div style={{
          width: 48, height: 48, borderRadius: '50%', background: '#fee2e2',
          display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 16px',
        }}>
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#dc2626" strokeWidth="2.5">
            <polyline points="3 6 5 6 21 6"/><path d="M19 6l-1 14H6L5 6"/>
            <path d="M10 11v6M14 11v6"/><path d="M9 6V4h6v2"/>
          </svg>
        </div>
        <p style={{ fontSize: 15, color: '#111827', fontWeight: 600, margin: '0 0 20px', lineHeight: 1.5 }}>{message}</p>
        <div style={{ display: 'flex', gap: 10, justifyContent: 'center' }}>
          <button onClick={onClose} style={{
            padding: '9px 20px', borderRadius: 8, border: '1px solid #e5e7eb',
            background: '#fff', color: '#374151', fontWeight: 600, fontSize: 14, cursor: 'pointer',
          }}>Cancel</button>
          <button onClick={onConfirm} style={{
            padding: '9px 20px', borderRadius: 8, border: 'none',
            background: '#dc2626', color: '#fff', fontWeight: 700, fontSize: 14, cursor: 'pointer',
          }}>Delete</button>
        </div>
      </div>
    </div>
  )
}

export default function DeleteRowBtn({ table, id, label }) {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [confirm, setConfirm] = useState(false)

  async function doDelete() {
    setConfirm(false)
    setLoading(true)
    try {
      await fetch('/api/admin/delete', {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ table, id }),
      })
      router.refresh()
    } catch {
      // silent fail — row will still be visible on refresh
    } finally {
      setLoading(false)
    }
  }

  return (
    <>
      <Dialog
        message={confirm ? `Delete this ${label || 'record'}? This cannot be undone.` : null}
        onConfirm={doDelete}
        onClose={() => setConfirm(false)}
      />
      <button className={styles.deleteBtn} onClick={() => setConfirm(true)} disabled={loading}>
        <i className="fa-solid fa-trash" /> {loading ? '...' : 'Del'}
      </button>
    </>
  )
}
