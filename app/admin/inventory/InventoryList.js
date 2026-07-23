'use client'
import { useState, useMemo } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import styles from '../list.module.css'

export default function InventoryList({ initialCars }) {
  const router = useRouter()
  const [cars, setCars] = useState(initialCars)
  const [search, setSearch] = useState('')
  const [sortBy, setSortBy] = useState('newest')
  const [deleting, setDeleting] = useState(null)
  const [duplicating, setDuplicating] = useState(null)

  const filtered = useMemo(() => {
    let list = [...cars]
    if (search.trim()) {
      const q = search.trim().toLowerCase()
      list = list.filter(c =>
        (c.stock || '').toLowerCase().includes(q) ||
        (c.make || '').toLowerCase().includes(q) ||
        (c.model || '').toLowerCase().includes(q) ||
        String(c.year || '').includes(q)
      )
    }
    switch (sortBy) {
      case 'newest': list.sort((a, b) => b.id - a.id); break
      case 'oldest': list.sort((a, b) => a.id - b.id); break
      case 'stock':  list.sort((a, b) => (a.stock || '').localeCompare(b.stock || '')); break
      case 'make':   list.sort((a, b) => (a.make || '').localeCompare(b.make || '')); break
      case 'model':  list.sort((a, b) => (a.model || '').localeCompare(b.model || '')); break
      case 'year_desc': list.sort((a, b) => (b.year || 0) - (a.year || 0)); break
      case 'year_asc':  list.sort((a, b) => (a.year || 0) - (b.year || 0)); break
      case 'price_asc': list.sort((a, b) => (a.price || 0) - (b.price || 0)); break
      case 'price_desc': list.sort((a, b) => (b.price || 0) - (a.price || 0)); break
    }
    return list
  }, [cars, search, sortBy])

  async function handleDelete(car) {
    if (!confirm(`Delete ${car.year} ${car.make} ${car.model}? This cannot be undone.`)) return
    setDeleting(car.id)
    try {
      await fetch(`/api/admin/cars/${car.id}`, { method: 'DELETE' })
      setCars(prev => prev.filter(c => c.id !== car.id))
    } catch { alert('Delete failed.') }
    finally { setDeleting(null) }
  }

  async function handleDuplicate(car) {
    setDuplicating(car.id)
    try {
      const res = await fetch(`/api/admin/cars/${car.id}/duplicate`, { method: 'POST' })
      const data = await res.json()
      if (data.id) router.push(`/admin/inventory/${data.id}`)
    } catch { alert('Duplicate failed.') }
    finally { setDuplicating(null) }
  }

  return (
    <>
      <div className={styles.filterBar}>
        <input
          className={styles.searchInput}
          type="text"
          placeholder="Search by stock, make, model, year..."
          value={search}
          onChange={e => setSearch(e.target.value)}
        />
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
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {filtered.length === 0 && (
              <tr><td colSpan={7} className={styles.empty}>No vehicles found.</td></tr>
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
                <td className={styles.actions}>
                  <Link href={`/admin/inventory/${car.id}`} className={styles.editBtn}>
                    <i className="fa-solid fa-pen-to-square" /> Edit
                  </Link>
                  <Link href={`/inventory/${car.slug || car.id}`} target="_blank" className={styles.viewBtn}>
                    <i className="fa-solid fa-arrow-up-right-from-square" /> View
                  </Link>
                  <button
                    className={styles.dupBtn}
                    onClick={() => handleDuplicate(car)}
                    disabled={duplicating === car.id}
                    title="Duplicate"
                  >
                    {duplicating === car.id ? '...' : <><i className="fa-solid fa-copy" /> Copy</>}
                  </button>
                  <button
                    className={styles.deleteBtn}
                    onClick={() => handleDelete(car)}
                    disabled={deleting === car.id}
                    title="Delete"
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
