import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { redirect } from 'next/navigation'
import { prisma } from '@/lib/prisma'
import Link from 'next/link'
import styles from '../list.module.css'
import DeleteRowBtn from '../DeleteRowBtn'

export default async function AdminAuction() {
  const session = await getServerSession(authOptions)
  if (!session) redirect('/admin/login')

  const requests = await prisma.$queryRaw`SELECT * FROM auctionrequest ORDER BY createdAt DESC`
  const newCount = requests.filter(r => r.status === 'new').length

  return (
    <div className={styles.page}>
      <div className={styles.topBar}>
        <div className={styles.topBarLeft}>
          <h1 className={styles.title}>Auction Requests</h1>
          <p className={styles.sub}>{requests.length} total · {newCount} new</p>
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
                <th>Lot #</th>
                <th>Status</th>
                <th>Date</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {requests.length === 0 && (
                <tr><td colSpan={7} className={styles.empty}>No auction requests yet.</td></tr>
              )}
              {requests.map(r => (
                <tr key={r.id}>
                  <td><strong>{r.firstName} {r.lastName}</strong></td>
                  <td>{r.phone}</td>
                  <td>{r.email}</td>
                  <td className={styles.mono}>{r.lotNumber || '—'}</td>
                  <td><span className={`${styles.badge} ${styles[r.status]}`}>{r.status}</span></td>
                  <td>{new Date(r.createdAt).toLocaleDateString()}</td>
                  <td className={styles.actions}>
                    <Link href={`/admin/auction/${r.id}`} className={styles.editBtn}>
                      <i className="fa-solid fa-eye" /> View
                    </Link>
                    <DeleteRowBtn table="auctionrequest" id={r.id} label="auction request" />
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
