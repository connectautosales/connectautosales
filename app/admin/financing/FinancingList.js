'use client'
import { useState, useMemo } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import styles from '../list.module.css'

const PRIORITY_CONFIG = {
  high:   { label: 'High',   color: '#15803d', bg: '#dcfce7' },
  medium: { label: 'Medium', color: '#1d4ed8', bg: '#dbeafe' },
  low:    { label: 'Low',    color: '#7c3aed', bg: '#ede9fe' },
}

const STATUS_CONFIG = {
  new:       { color: '#92400e', bg: '#fef3c7' },
  open:      { color: '#0369a1', bg: '#e0f2fe' },
  approved:  { color: '#15803d', bg: '#dcfce7' },
  rejected:  { color: '#dc2626', bg: '#fee2e2' },
  completed: { color: '#ffffff', bg: '#0a1628' },
}

function fmtFreq(freq) {
  const map = { weekly: '/wk', 'bi-weekly': '/2wk', monthly: '/mo', yearly: '/yr', hourly: '/hr' }
  return map[freq] || ''
}

export default function FinancingList({ initialRows }) {
  const router = useRouter()
  const [rows, setRows] = useState(initialRows)
  const [confirmDel, setConfirmDel] = useState(null)
  const [sortBy, setSortBy] = useState('date_desc')
  const [statusFilter, setStatusFilter] = useState('all')
  const [priorityFilter, setPriorityFilter] = useState('all')
  const [settingPriority, setSettingPriority] = useState(null)

  const sorted = useMemo(() => {
    let list = [...rows]
    if (statusFilter !== 'all') list = list.filter(r => r.status === statusFilter)
    if (priorityFilter !== 'all') list = list.filter(r => r.priority === priorityFilter)
    switch (sortBy) {
      case 'date_desc': list.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt)); break
      case 'date_asc':  list.sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt)); break
      case 'status':    list.sort((a, b) => (a.status || '').localeCompare(b.status || '')); break
      case 'priority':  list.sort((a, b) => {
        const order = { high: 0, medium: 1, low: 2, null: 3, undefined: 3 }
        return (order[a.priority] ?? 3) - (order[b.priority] ?? 3)
      }); break
      case 'name':      list.sort((a, b) => a.name.localeCompare(b.name)); break
    }
    return list
  }, [rows, sortBy, statusFilter, priorityFilter])

  async function setPriority(id, priority) {
    setSettingPriority(id)
    try {
      await fetch(`/api/admin/financing/${id}/priority`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ priority }),
      })
      setRows(prev => prev.map(r => r.id === id ? { ...r, priority } : r))
    } finally {
      setSettingPriority(null)
    }
  }

  async function doDelete(id) {
    await fetch('/api/admin/delete', {
      method: 'DELETE',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ table: 'financingapplication', ids: [id] }),
    })
    setRows(prev => prev.filter(r => r.id !== id))
    setConfirmDel(null)
  }

  return (
    <div>
      {/* Confirm delete dialog */}
      {confirmDel && (
        <div style={{ position:'fixed', inset:0, zIndex:9999, background:'rgba(0,0,0,0.45)', display:'flex', alignItems:'center', justifyContent:'center' }}>
          <div style={{ background:'#fff', borderRadius:12, padding:'28px 32px', maxWidth:400, width:'90%', textAlign:'center', boxShadow:'0 20px 60px rgba(0,0,0,0.2)' }}>
            <p style={{ fontSize:15, fontWeight:600, margin:'0 0 20px' }}>Delete this application? This cannot be undone.</p>
            <div style={{ display:'flex', gap:10, justifyContent:'center' }}>
              <button onClick={() => setConfirmDel(null)} style={{ padding:'9px 20px', borderRadius:8, border:'1px solid #e5e7eb', background:'#fff', fontWeight:600, fontSize:14, cursor:'pointer' }}>Cancel</button>
              <button onClick={() => doDelete(confirmDel)} style={{ padding:'9px 20px', borderRadius:8, border:'none', background:'#dc2626', color:'#fff', fontWeight:700, fontSize:14, cursor:'pointer' }}>Delete</button>
            </div>
          </div>
        </div>
      )}

      {/* Filter / Sort bar */}
      <div className={styles.filterBar} style={{ marginBottom: 16 }}>
        <select className={styles.sortSelect} value={statusFilter} onChange={e => setStatusFilter(e.target.value)}>
          <option value="all">All Status</option>
          <option value="new">New</option>
          <option value="open">Open</option>
          <option value="approved">Approved</option>
          <option value="rejected">Rejected</option>
          <option value="completed">Completed</option>
        </select>
        <select className={styles.sortSelect} value={priorityFilter} onChange={e => setPriorityFilter(e.target.value)}>
          <option value="all">All Priorities</option>
          <option value="high">High Priority</option>
          <option value="medium">Medium Priority</option>
          <option value="low">Low Priority</option>
        </select>
        <select className={styles.sortSelect} value={sortBy} onChange={e => setSortBy(e.target.value)}>
          <option value="date_desc">Date (Newest)</option>
          <option value="date_asc">Date (Oldest)</option>
          <option value="status">Status</option>
          <option value="priority">Priority</option>
          <option value="name">Name A-Z</option>
        </select>
      </div>

      <div className={styles.tableWrap}>
        <table className={styles.table}>
          <thead>
            <tr>
              <th>Name</th>
              <th>Phone</th>
              <th>Email</th>
              <th>Income</th>
              <th>Down Payment</th>
              <th>Date</th>
              <th>Status</th>
              <th>Priority</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {sorted.length === 0 && (
              <tr><td colSpan={9} className={styles.empty}>No applications found.</td></tr>
            )}
            {sorted.map(row => {
              const sc = STATUS_CONFIG[row.status] || STATUS_CONFIG.new
              const pc = row.priority ? PRIORITY_CONFIG[row.priority] : null
              return (
                <tr key={row.id}>
                  <td><strong>{row.name}</strong></td>
                  <td>{row.phone || '—'}</td>
                  <td>{row.email || '—'}</td>
                  <td>{row.monthlyIncome ? `$${row.monthlyIncome}${fmtFreq(row.incomeFrequency)}` : '—'}</td>
                  <td>{row.downPayment ? `$${row.downPayment}` : '—'}</td>
                  <td>{new Date(row.createdAt).toLocaleDateString()}</td>
                  <td>
                    <span className={styles.badge} style={{ background: sc.bg, color: sc.color }}>
                      {row.status}
                    </span>
                  </td>
                  <td>
                    {row.status === 'approved' ? (
                      <select
                        value={row.priority || ''}
                        disabled={settingPriority === row.id}
                        onChange={e => setPriority(row.id, e.target.value || null)}
                        style={{
                          fontSize: 12, fontWeight: 700, borderRadius: 6,
                          border: '1.5px solid',
                          padding: '3px 6px', cursor: 'pointer',
                          background: pc ? pc.bg : '#f1f5f9',
                          color: pc ? pc.color : '#6b7280',
                          borderColor: pc ? pc.color : '#d1d5db',
                        }}
                      >
                        <option value="">Set Priority</option>
                        <option value="high">High</option>
                        <option value="medium">Medium</option>
                        <option value="low">Low</option>
                      </select>
                    ) : pc ? (
                      <span className={styles.badge} style={{ background: pc.bg, color: pc.color }}>
                        {pc.label}
                      </span>
                    ) : (
                      <span style={{ color: '#9ca3af', fontSize: 12 }}>—</span>
                    )}
                  </td>
                  <td className={styles.actions}>
                    <Link href={`/admin/financing/${row.id}`} className={styles.editBtn}>
                      <i className="fa-solid fa-eye" /> View
                    </Link>
                    <button
                      className={styles.deleteBtn}
                      onClick={() => setConfirmDel(row.id)}
                    >
                      <i className="fa-solid fa-trash" /> Del
                    </button>
                  </td>
                </tr>
              )
            })}
          </tbody>
        </table>
      </div>
    </div>
  )
}
