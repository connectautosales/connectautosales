import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { redirect } from 'next/navigation'
import { prisma } from '@/lib/prisma'
import Link from 'next/link'
import styles from '../list.module.css'

export default async function AdminContacts() {
  const session = await getServerSession(authOptions)
  if (!session) redirect('/admin/login')

  const msgs = await prisma.$queryRaw`SELECT * FROM contactmessage ORDER BY createdAt DESC`
  const unread = msgs.filter(m => !m.isRead).length

  return (
    <div className={styles.page}>
      <div className={styles.topBar}>
        <div className={styles.topBarLeft}>
          <h1 className={styles.title}>Contact Messages</h1>
          <p className={styles.sub}>{unread} unread · {msgs.length} total</p>
        </div>
      </div>

      <div className={styles.content}>
        <div className={styles.tableWrap}>
          <table className={styles.table}>
            <thead>
              <tr>
                <th style={{ width: 20 }}></th>
                <th>Name</th>
                <th>Phone</th>
                <th>Email</th>
                <th>Subject</th>
                <th>Date</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {msgs.length === 0 && (
                <tr><td colSpan={7} className={styles.empty}>No messages yet.</td></tr>
              )}
              {msgs.map(m => (
                <tr key={m.id} style={{ fontWeight: m.isRead ? 400 : 600 }}>
                  <td>{!m.isRead && <span className={styles.unreadDot} />}</td>
                  <td>{m.name || '—'}</td>
                  <td>{m.phone || '—'}</td>
                  <td>{m.email || '—'}</td>
                  <td>{m.subject || '—'}</td>
                  <td>{new Date(m.createdAt).toLocaleDateString()}</td>
                  <td>
                    <Link href={`/admin/contacts/${m.id}`} className={styles.editBtn}>
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
