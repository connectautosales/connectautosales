import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { redirect } from 'next/navigation'
import { prisma } from '@/lib/prisma'
import Link from 'next/link'
import styles from '../list.module.css'

export default async function AdminTestDrives() {
  const session = await getServerSession(authOptions)
  if (!session) redirect('/admin/login')

  const items = await prisma.$queryRaw`SELECT * FROM testdriverequest ORDER BY createdAt DESC`
  const newCount = items.filter(i => i.status === 'new').length

  return (
    <div className={styles.page}>
      <div className={styles.topBar}>
        <div className={styles.topBarLeft}>
          <h1 className={styles.title}>Test Drive Requests</h1>
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
                <th>Vehicle</th>
                <th>Date</th>
                <th>Time</th>
                <th>Status</th>
                <th>Submitted</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {items.length === 0 && (
                <tr><td colSpan={9} className={styles.empty}>No test drive requests yet.</td></tr>
              )}
              {items.map(i => (
                <tr key={i.id}>
                  <td><strong>{i.firstName} {i.lastName}</strong></td>
                  <td>{i.phone || '—'}</td>
                  <td>{i.email || '—'}</td>
                  <td>{i.vehicle || '—'}</td>
                  <td>{i.preferredDate || '—'}</td>
                  <td>{i.preferredTime || '—'}</td>
                  <td><span className={`${styles.badge} ${styles[i.status?.replace(/ /g, '-')]}`}>{i.status}</span></td>
                  <td>{new Date(i.createdAt).toLocaleDateString()}</td>
                  <td>
                    <Link href={`/admin/test-drives/${i.id}`} className={styles.editBtn}>
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
