'use client'
import { useState, useMemo } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import styles from '../list.module.css'

/* ── Inline dialog (replaces alert / confirm) ── */
function Dialog({ type, message, onConfirm, onClose }) {
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
          width: 48, height: 48, borderRadius: '50%',
          background: type === 'confirm' ? '#fee2e2' : type === 'error' ? '#fee2e2' : '#dcfce7',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          margin: '0 auto 16px',
        }}>
          {type === 'confirm' ? (
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#dc2626" strokeWidth="2.5"><polyline points="3 6 5 6 21 6"/><path d="M19 6l-1 14H6L5 6"/><path d="M10 11v6M14 11v6"/><path d="M9 6V4h6v2"/></svg>
          ) : type === 'error' ? (
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#dc2626" strokeWidth="2.5"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>
          ) : (
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#16a34a" strokeWidth="2.5"><polyline points="20 6 9 17 4 12"/></svg>
          )}
        </div>
        <p style={{ fontSize: 15, color: '#111827', fontWeight: 600, margin: '0 0 20px', lineHeight: 1.5 }}>{message}</p>
        <div style={{ display: 'flex', gap: 10, justifyContent: 'center' }}>
          {type === 'confirm' ? (
            <>
              <button onClick={onClose} style={{
                padding: '9px 20px', borderRadius: 8, border: '1px solid #e5e7eb',
                background: '#fff', color: '#374151', fontWeight: 600, fontSize: 14, cursor: 'pointer',
              }}>Cancel</button>
              <button onClick={onConfirm} style={{
                padding: '9px 20px', borderRadius: 8, border: 'none',
                background: '#dc2626', color: '#fff', fontWeight: 700, fontSize: 14, cursor: 'pointer',
              }}>Delete</button>
            </>
          ) : (
            <button onClick={onClose} style={{
              padding: '9px 24px', borderRadius: 8, border: 'none',
              background: '#0f172a', color: '#fff', fontWeight: 700, fontSize: 14, cursor: 'pointer',
            }}>OK</button>
          )}
        </div>
      </div>
    </div>
  )
}

export default function InventoryList({ initialCars }) {
  const router = useRouter()
  const [cars, setCars] = useState(initialCars)
  const [search, setSearch] = useState('')
  const [sortBy, setSortBy] = useState('newest')
  const [statusFilter, setStatusFilter] = useState('all')
  const [deleting, setDeleting] = useState(null)
  const [duplicating, setDuplicating] = useState(null)
  const [markingSold, setMarkingSold] = useState(null)
  const [togglingFeatured, setTogglingFeatured] = useState(null)
  const [dialog, setDialog] = useState(null) // { type, message, onConfirm? }

  const showDialog = (type, message, onConfirm) => setDialog({ type, message, onConfirm })
  const closeDialog = () => setDialog(null)

  const filtered = useMemo(() => {
    let list = [...cars]
    if (statusFilter !== 'all') list = list.filter(c => c.status === statusFilter)
    if (search.trim()) {
      const q = search.trim().toLowerCase()
      list = list.filter(c => {
        const full = `${c.year || ''} ${c.make || ''} ${c.model || ''} ${c.trim || ''}`.toLowerCase()
        return full.includes(q) ||
          (c.stock || '').toLowerCase().includes(q) ||
          (c.vin || '').toLowerCase().includes(q)
      })
    }
    switch (sortBy) {
      case 'newest':    list.sort((a, b) => b.id - a.id); break
      case 'oldest':    list.sort((a, b) => a.id - b.id); break
      case 'stock':     list.sort((a, b) => (a.stock || '').localeCompare(b.stock || '')); break
      case 'make':      list.sort((a, b) => (a.make || '').localeCompare(b.make || '')); break
      case 'model':     list.sort((a, b) => (a.model || '').localeCompare(b.model || '')); break
      case 'year_desc': list.sort((a, b) => (b.year || 0) - (a.year || 0)); break
      case 'year_asc':  list.sort((a, b) => (a.year || 0) - (b.year || 0)); break
      case 'price_asc': list.sort((a, b) => (a.price || 0) - (b.price || 0)); break
      case 'price_desc':list.sort((a, b) => (b.price || 0) - (a.price || 0)); break
    }
    return list
  }, [cars, search, sortBy, statusFilter])

  function confirmDelete(car) {
    showDialog('confirm', `Delete ${car.year} ${car.make} ${car.model}? This cannot be undone.`, async () => {
      closeDialog()
      setDeleting(car.id)
      try {
        const res = await fetch(`/api/admin/cars/${car.id}`, { method: 'DELETE' })
        if (!res.ok) throw new Error()
        setCars(prev => prev.filter(c => c.id !== car.id))
      } catch {
        showDialog('error', 'Delete failed. Please try again.')
      } finally {
        setDeleting(null)
      }
    })
  }

  async function handleMarkSold(car) {
    if (markingSold) return
    setMarkingSold(car.id)
    const newStatus = car.status === 'sold' ? 'available' : 'sold'
    try {
      const res = await fetch(`/api/admin/cars/${car.id}/status`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: newStatus }),
      })
      if (!res.ok) throw new Error('Failed')
      setCars(prev => prev.map(c => c.id === car.id ? { ...c, status: newStatus } : c))
    } catch {
      setDialog({ type: 'error', message: 'Failed to update status.' })
    } finally {
      setMarkingSold(null)
    }
  }

  async function handleToggleFeatured(car) {
    if (togglingFeatured) return
    setTogglingFeatured(car.id)
    const newFeatured = !car.featured
    try {
      const res = await fetch(`/api/admin/cars/${car.id}/featured`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ featured: newFeatured }),
      })
      if (!res.ok) throw new Error('Failed')
      setCars(prev => prev.map(c => c.id === car.id ? { ...c, featured: newFeatured } : c))
    } catch {
      showDialog('error', 'Failed to update featured status.')
    } finally {
      setTogglingFeatured(null)
    }
  }

  async function handleDuplicate(car) {
    setDuplicating(car.id)
    try {
      const res = await fetch(`/api/admin/cars/${car.id}/duplicate`, { method: 'POST' })
      const data = await res.json()
      if (!res.ok || !data.id) throw new Error(data.error || 'Failed')
      router.push(`/admin/inventory/${data.id}`)
    } catch (e) {
      showDialog('error', `Duplicate failed: ${e.message}`)
    } finally {
      setDuplicating(null)
    }
  }

  return (
    <>
      <Dialog
        type={dialog?.type}
        message={dialog?.message}
        onConfirm={dialog?.onConfirm}
        onClose={closeDialog}
      />

      <div className={styles.filterBar}>
        <input
          className={styles.searchInput}
          type="text"
          placeholder="Search by stock, make, model, year..."
          value={search}
          onChange={e => setSearch(e.target.value)}
        />
        <select className={styles.sortSelect} value={statusFilter} onChange={e => setStatusFilter(e.target.value)}>
          <option value="all">All Status</option>
          <option value="available">Available</option>
          <option value="pending">Pending</option>
          <option value="sold">Sold</option>
          <option value="hidden">Hidden</option>
        </select>
        <select className={styles.sortSelect} value={sortBy} onChange={e => setSortBy(e.target.value)}>
          <option value="newest">Newest First</option>
          <option value="oldest">Oldest First</option>
          <option value="stock">Stock #</option>
          <option value="make">Make A–Z</option>
          <option value="model">Model A–Z</option>
          <option value="year_desc">Year (Newest)</option>
          <option value="year_asc">Year (Oldest)</option>
          <option value="price_asc">Price Low–High</option>
          <option value="price_desc">Price High–Low</option>
        </select>
      </div>

      <div className={styles.tableWrap}>
        <table className={styles.table}>
          <thead>
            <tr>
              <th>Stock #</th>
              <th>Vehicle</th>
              <th>Price</th>
              <th>Mileage</th>
              <th>Title</th>
              <th>Status</th>
              <th>Featured</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {filtered.length === 0 && (
              <tr><td colSpan={8} className={styles.empty}>No vehicles found.</td></tr>
            )}
            {filtered.map(car => (
              <tr key={car.id}>
                <td className={styles.mono}>{car.stock}</td>
                <td><strong>{car.year} {car.make} {car.model}{car.trim ? ` ${car.trim}` : ''}</strong></td>
                <td>${(car.price || 0).toLocaleString()}</td>
                <td>{(car.mileage || 0).toLocaleString()} mi</td>
                <td>
                  <span className={`${styles.badge} ${car.titleType === 'rebuilt' ? styles.rebuilt : styles.clean}`}>
                    {car.titleType}
                  </span>
                </td>
                <td>
                  <span className={`${styles.badge} ${styles[car.status]}`}>{car.status}</span>
                </td>
                <td>
                  <button
                    onClick={() => handleToggleFeatured(car)}
                    disabled={togglingFeatured === car.id}
                    title={car.featured ? 'Remove from homepage' : 'Add to homepage'}
                    style={{
                      background: car.featured ? '#0a1628' : '#fff',
                      color: car.featured ? '#fff' : '#6b7280',
                      border: `1.5px solid ${car.featured ? '#0a1628' : '#d1d5db'}`,
                      borderRadius: 6, padding: '4px 10px', fontSize: 12,
                      fontWeight: 700, cursor: 'pointer', whiteSpace: 'nowrap',
                      transition: 'all 0.15s',
                    }}
                  >
                    {togglingFeatured === car.id ? '...' : car.featured ? '★ On' : '☆ Off'}
                  </button>
                </td>
                <td className={styles.actions}>
                  <Link href={`/admin/inventory/${car.id}`} className={styles.editBtn}>
                    <i className="fa-solid fa-pen-to-square" /> Edit
                  </Link>
                  <Link href={`/inventory/${car.stock || car.slug || car.id}`} target="_blank" className={styles.viewBtn}>
                    <i className="fa-solid fa-arrow-up-right-from-square" /> View
                  </Link>
                  <button
                    className={car.status === 'sold' ? styles.dupBtn : styles.soldBtn}
                    onClick={() => handleMarkSold(car)}
                    disabled={markingSold === car.id}
                  >
                    {markingSold === car.id ? '...' : car.status === 'sold' ? <><i className="fa-solid fa-rotate-left" /> Unsold</> : <><i className="fa-solid fa-tag" /> Sold</>}
                  </button>
                  <button
                    className={styles.dupBtn}
                    onClick={() => handleDuplicate(car)}
                    disabled={duplicating === car.id}
                  >
                    {duplicating === car.id ? '...' : <><i className="fa-solid fa-copy" /> Copy</>}
                  </button>
                  <button
                    className={styles.deleteBtn}
                    onClick={() => confirmDelete(car)}
                    disabled={deleting === car.id}
                  >
                    {deleting === car.id ? '...' : <><i className="fa-solid fa-trash" /> Del</>}
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </>
  )
}
