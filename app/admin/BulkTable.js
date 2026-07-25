'use client'
import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import DeleteRowBtn from './DeleteRowBtn'
import styles from './list.module.css'

/*
  rows: Array of {
    id: number,
    status: string,        // current status / 'read' | 'unread' for contacts
    cells: string[],       // display values, first one is rendered bold
  }
  headers: string[]        // column headers (no checkbox, no status, no actions)
  statusOptions: { value, label }[]
  type: string
  detailBase: string       // e.g. '/admin/financing'
  deleteTable: string
  deleteLabel: string
  isContactType?: boolean  // shows unread dot in first cell if status === 'unread'
*/
export default function BulkTable({
  rows, headers, statusOptions, type,
  detailBase, deleteTable, deleteLabel,
  isContactType = false,
}) {
  const router = useRouter()
  const [selected, setSelected] = useState(new Set())
  const [bulkStatus, setBulkStatus] = useState(statusOptions[1]?.value || statusOptions[0]?.value || '')
  const [applying, setApplying] = useState(false)
  const [done, setDone] = useState(false)

  const allIds = rows.map(r => r.id)
  const allSelected = allIds.length > 0 && allIds.every(id => selected.has(id))
  const someSelected = selected.size > 0

  function toggleAll() {
    if (allSelected) {
      setSelected(new Set())
    } else {
      setSelected(new Set(allIds))
    }
  }

  function toggleOne(id) {
    setSelected(prev => {
      const next = new Set(prev)
      if (next.has(id)) next.delete(id)
      else next.add(id)
      return next
    })
  }

  async function applyBulk() {
    if (selected.size === 0 || !bulkStatus) return
    setApplying(true)
    try {
      await fetch('/api/admin/bulk-status', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ type, ids: [...selected], status: bulkStatus }),
      })
      setDone(true)
      setSelected(new Set())
      setTimeout(() => { setDone(false); router.refresh() }, 1200)
    } catch {
      // silent — page will refresh
    } finally {
      setApplying(false)
    }
  }

  const badgeClass = (status) => {
    const s = status?.replace(/ /g, '-') || ''
    return `${styles.badge} ${styles[s] || ''}`
  }

  return (
    <div style={{ position: 'relative' }}>
      {/* Bulk action bar */}
      {someSelected && (
        <div className={styles.bulkBar}>
          <span className={styles.bulkCount}>
            <i className="fa-solid fa-check-square" /> {selected.size} selected
          </span>
          <div className={styles.bulkActions}>
            <select
              value={bulkStatus}
              onChange={e => setBulkStatus(e.target.value)}
              className={styles.bulkSelect}
            >
              {statusOptions.map(s => (
                <option key={s.value} value={s.value}>{s.label}</option>
              ))}
            </select>
            <button
              onClick={applyBulk}
              disabled={applying || done}
              className={styles.bulkApplyBtn}
            >
              {done
                ? <><i className="fa-solid fa-circle-check" /> Done!</>
                : applying
                ? <><i className="fa-solid fa-spinner fa-spin" /> Applying...</>
                : <><i className="fa-solid fa-bolt" /> Apply</>
              }
            </button>
            <button
              onClick={() => setSelected(new Set())}
              className={styles.bulkClearBtn}
            >
              Clear
            </button>
          </div>
        </div>
      )}

      <div className={styles.tableWrap}>
        <table className={styles.table}>
          <thead>
            <tr>
              <th style={{ width: 36, paddingRight: 0 }}>
                <input
                  type="checkbox"
                  checked={allSelected}
                  onChange={toggleAll}
                  className={styles.checkbox}
                  title="Select all"
                />
              </th>
              {headers.map(h => <th key={h}>{h}</th>)}
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {rows.length === 0 && (
              <tr>
                <td colSpan={headers.length + 3} className={styles.empty}>
                  No records yet.
                </td>
              </tr>
            )}
            {rows.map((row, ri) => (
              <tr
                key={row.id}
                style={{
                  fontWeight: isContactType && row.status === 'unread' ? 600 : 400,
                  background: selected.has(row.id) ? '#fef2f2' : undefined,
                }}
                onClick={() => toggleOne(row.id)}
                className={styles.selectableRow}
              >
                <td style={{ paddingRight: 0 }} onClick={e => e.stopPropagation()}>
                  <input
                    type="checkbox"
                    checked={selected.has(row.id)}
                    onChange={() => toggleOne(row.id)}
                    className={styles.checkbox}
                  />
                </td>
                {row.cells.map((cell, ci) => (
                  <td key={ci}>
                    {ci === 0
                      ? <strong>{isContactType && row.status === 'unread' && <span className={styles.unreadDot} style={{ marginRight: 6 }} />}{cell}</strong>
                      : cell || '—'
                    }
                  </td>
                ))}
                <td onClick={e => e.stopPropagation()}>
                  <span className={badgeClass(row.status)}>{row.status}</span>
                </td>
                <td className={styles.actions} onClick={e => e.stopPropagation()}>
                  <Link href={`${detailBase}/${row.id}`} className={styles.editBtn}>
                    <i className="fa-solid fa-eye" /> View
                  </Link>
                  <DeleteRowBtn table={deleteTable} id={row.id} label={deleteLabel} />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}
