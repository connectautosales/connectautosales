import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { redirect } from 'next/navigation'
import { prisma } from '@/lib/prisma'
import Link from 'next/link'
import styles from '../list.module.css'
import DeleteRowBtn from '../DeleteRowBtn'

export default async function AdminFinancing() {
  const session = await getServerSession(authOptions)
  if (!session) redirect('/admin/login')

  const apps = await prisma.$queryRaw`SELECT id, firstName, lastName, phone, email, monthlyIncome, downPayment, status, createdAt FROM financingapplication ORDER BY createdAt DESC`
  const newCount = apps.filter(a => a.status === 'new').length

  return (
    <div className={styles.page}>
      <div className={styles.topBar}>
        <div className={styles.topBarLeft}>
          <h1 className={styles.title}>Financing Applications</h1>
          <p className={styles.sub}>{apps.length} total · {newCount} new</p>
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
                <th>Income</th>
                <th>Down Payment</th>
                <th>Status</th>
                <th>Date</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {apps.length === 0 && (
                <tr><td colSpan={8} className={styles.empty}>No applications yet.</td></tr>
              )}
              {apps.map(a => (
                <tr key={a.id}>
                  <td><strong>{a.firstName} {a.lastName}</strong></td>
                  <td>{a.phone}</td>
                  <td>{a.email}</td>
                  <td>${a.monthlyIncome}/mo</td>
                  <td>${a.downPayment}</td>
                  <td><span className={`${styles.badge} ${styles[a.status]}`}>{a.status}</span></td>
                  <td>{new Date(a.createdAt).toLocaleDateString()}</td>
                  <td className={styles.actions}>
                    <Link href={`/admin/financing/${a.id}`} className={styles.editBtn}>
                      <i className="fa-solid fa-eye" /> View
                    </Link>
                    <DeleteRowBtn table="financingapplication" id={a.id} label="application" />
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
