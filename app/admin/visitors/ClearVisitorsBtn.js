'use client'
import { useState } from 'react'
import { useRouter } from 'next/navigation'

export default function ClearVisitorsBtn({ total }) {
  const router = useRouter()
  const [confirm, setConfirm] = useState(false)
  const [clearing, setClearing] = useState(false)

  async function doClear() {
    setClearing(true)
    try {
      await fetch('/api/admin/clear-visitors', { method: 'DELETE' })
      router.refresh()
    } finally {
      setClearing(false)
      setConfirm(false)
    }
  }

  return (
    <>
      {confirm && (
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
            <div style={{
              width: 48, height: 48, borderRadius: '50%', background: '#fee2e2',
              display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 16px',
            }}>
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#dc2626" strokeWidth="2.5">
                <polyline points="3 6 5 6 21 6"/><path d="M19 6l-1 14H6L5 6"/>
                <path d="M10 11v6M14 11v6"/><path d="M9 6V4h6v2"/>
              </svg>
            </div>
            <p style={{ fontSize: 15, fontWeight: 700, color: '#111', margin: '0 0 6px' }}>
              Clear all {total.toLocaleString()} visitor records?
            </p>
            <p style={{ fontSize: 13, color: '#dc2626', fontWeight: 600, margin: '0 0 20px' }}>
              This action cannot be undone.
            </p>
            <div style={{ display: 'flex', gap: 10, justifyContent: 'center' }}>
              <button
                onClick={() => setConfirm(false)}
                style={{ padding: '9px 20px', borderRadius: 8, border: '1px solid #e5e7eb', background: '#fff', color: '#374151', fontWeight: 600, fontSize: 14, cursor: 'pointer' }}
              >
                Cancel
              </button>
              <button
                onClick={doClear}
                disabled={clearing}
                style={{ padding: '9px 20px', borderRadius: 8, border: 'none', background: '#dc2626', color: '#fff', fontWeight: 700, fontSize: 14, cursor: 'pointer', opacity: clearing ? 0.7 : 1 }}
              >
                {clearing ? 'Clearing...' : 'Clear All'}
              </button>
            </div>
          </div>
        </div>
      )}

      <button
        onClick={() => setConfirm(true)}
        style={{
          display: 'inline-flex', alignItems: 'center', gap: 7,
          padding: '10px 16px', borderRadius: 8,
          background: '#fee2e2', color: '#991b1b',
          border: '1px solid #fecaca',
          fontSize: '0.84rem', fontWeight: 700, cursor: 'pointer',
          transition: 'all 0.15s',
        }}
      >
        <i className="fa-solid fa-trash" /> Clear All Visitors
      </button>
    </>
  )
}
