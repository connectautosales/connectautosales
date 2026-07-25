import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { redirect } from 'next/navigation'
import { prisma } from '@/lib/prisma'
import styles from '../list.module.css'
import BulkTable from '../BulkTable'

export default async function AdminContacts() {
  const session = await getServerSession(authOptions)
  if (!session) redirect('/admin/login')

  const msgs = await prisma.$queryRaw`SELECT * FROM contactmessage ORDER BY createdAt DESC`
  const unread = msgs.filter(m => !m.isRead).length

  const rows = msgs.map(m => ({
    id: m.id,
    status: m.isRead ? 'read' : 'unread',
    cells: [
      m.name || '—',
      m.phone || '—',
      m.email || '—',
      m.subject || '—',
      new Date(m.createdAt).toLocaleDateString(),
    ],
  }))

  return (
    <div className={styles.page}>
      <div className={styles.topBar}>
        <div className={styles.topBarLeft}>
          <h1 className={styles.title}>Contact Messages</h1>
          <p className={styles.sub}>{unread} unread · {msgs.length} total</p>
        </div>
      </div>
      <div className={styles.content}>
        <BulkTable
          rows={rows}
          headers={['Name', 'Phone', 'Email', 'Subject', 'Date']}
          statusOptions={[
            { value: 'unread', label: 'Unread' },
            { value: 'read',   label: 'Read / Replied' },
          ]}
          type="contact"
          detailBase="/admin/contacts"
          deleteTable="contactmessage"
          deleteLabel="message"
          isContactType
        />
      </div>
    </div>
  )
}
