import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { redirect } from 'next/navigation'
import { prisma } from '@/lib/prisma'
import Link from 'next/link'
import styles from '../list.module.css'

export default async function AdminTransport() {
  const session = await getServerSession(authOptions)
  if (!session) redirect('/admin/login')

  const items = await prisma.$queryRaw`SELECT * FROM transportrequest ORDER BY createdAt DESC`
  const newCount = items.filter(t => t.status === 'new').length

  return (
    <div className={styles.page}>
      <div className={styles.topBar}>
        <div className={styles.topBarLeft}>
          <h1 className={styles.title}>Transport Quote Requests</h1>
          <p className={styles.sub}>{items.length} total · {newCount} new</p>
        </div>
      </div>

      <div className={styles.content}>
        <div className={styles.tableWrap}>
          <table className={styles.table}>
            <thead>
              <tr>
                <th>Name</th>
                <th>Phone</th>
                <th>Email</th>
                <th>From</th>
                <th>To</th>
                <th>Vehicle</th>
                <th>Status</th>
                <th>Date</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {items.length === 0 && (
                <tr><td colSpan={9} className={styles.empty}>No transport requests yet.</td></tr>
              )}
              {items.map(t => (
                <tr key={t.id}>
                  <td><strong>{t.name || '—'}</strong></td>
                  <td>{t.phone || '—'}</td>
                  <td>{t.email || '—'}</td>
                  <td>{t.from || '—'}</td>
                  <td>{t.to || '—'}</td>
                  <td>{t.vehicle || '—'}</td>
                  <td><span className={`${styles.badge} ${styles[t.status]}`}>{t.status}</span></td>
                  <td>{new Date(t.createdAt).toLocaleDateString()}</td>
                  <td>
                    <Link href={`/admin/transport/${t.id}`} className={styles.editBtn}>
                      <i className="fa-solid fa-eye" /> View
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
