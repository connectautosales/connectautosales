import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { redirect } from 'next/navigation'
import { prisma } from '@/lib/prisma'
import styles from '../list.module.css'
import BulkTable from '../BulkTable'

export default async function AdminTransport() {
  const session = await getServerSession(authOptions)
  if (!session) redirect('/admin/login')

  const items = await prisma.$queryRaw`SELECT * FROM transportrequest ORDER BY createdAt DESC`
  const newCount = items.filter(t => t.status === 'new').length

  const rows = items.map(t => ({
    id: t.id,
    status: t.status || 'new',
    cells: [
      t.name || '—',
      t.phone || '—',
      t.email || '—',
      t.from || '—',
      t.to || '—',
      t.vehicle || '—',
      new Date(t.createdAt).toLocaleDateString(),
    ],
  }))

  return (
    <div className={styles.page}>
      <div className={styles.topBar}>
        <div className={styles.topBarLeft}>
          <h1 className={styles.title}>Transport Quote Requests</h1>
          <p className={styles.sub}>{items.length} total · {newCount} new</p>
        </div>
      </div>
      <div className={styles.content}>
        <BulkTable
          rows={rows}
          headers={['Name', 'Phone', 'Email', 'From', 'To', 'Vehicle', 'Date']}
          statusOptions={[
            { value: 'new',       label: 'New' },
            { value: 'reviewed',  label: 'Reviewed' },
            { value: 'contacted', label: 'Contacted' },
            { value: 'completed', label: 'Completed' },
          ]}
          type="transport"
          detailBase="/admin/transport"
          deleteTable="transportrequest"
          deleteLabel="transport request"
        />
      </div>
    </div>
  )
}
