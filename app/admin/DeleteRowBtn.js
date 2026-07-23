'use client'
import { useState } from 'react'
import { useRouter } from 'next/navigation'
import styles from './list.module.css'

export default function DeleteRowBtn({ table, id, label }) {
  const router = useRouter()
  const [loading, setLoading] = useState(false)

  async function handleDelete() {
    if (!confirm(`Delete this ${label || 'record'}? This cannot be undone.`)) return
    setLoading(true)
    try {
      await fetch('/api/admin/delete', {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ table, id }),
      })
      router.refresh()
    } catch { alert('Delete failed.') }
    finally { setLoading(false) }
  }

  return (
    <button className={styles.deleteBtn} onClick={handleDelete} disabled={loading}>
      <i className="fa-solid fa-trash" /> {loading ? '...' : 'Del'}
    </button>
  )
}
