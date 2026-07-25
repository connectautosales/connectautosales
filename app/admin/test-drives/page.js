import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { redirect } from 'next/navigation'
import { prisma } from '@/lib/prisma'
import styles from '../list.module.css'
import BulkTable from '../BulkTable'

export default async function AdminTestDrives() {
  const session = await getServerSession(authOptions)
  if (!session) redirect('/admin/login')

  const items = await prisma.$queryRaw`SELECT * FROM testdriverequest ORDER BY createdAt DESC`
  const newCount = items.filter(i => i.status === 'new').length

  const rows = items.map(i => ({
    id: i.id,
    status: i.status || 'new',
    cells: [
      `${i.firstName} ${i.lastName}`,
      i.phone || '—',
      i.email || '—',
      i.vehicle || '—',
      i.preferredDate || '—',
      i.preferredTime || '—',
      new Date(i.createdAt).toLocaleDateString(),
    ],
  }))

  return (
    <div className={styles.page}>
      <div className={styles.topBar}>
        <div className={styles.topBarLeft}>
          <h1 className={styles.title}>Test Drive Requests</h1>
          <p className={styles.sub}>{items.length} total · {newCount} new</p>
        </div>
      </div>
      <div className={styles.content}>
        <BulkTable
          rows={rows}
          headers={['Name', 'Phone', 'Email', 'Vehicle', 'Pref. Date', 'Pref. Time', 'Submitted']}
          statusOptions={[
            { value: 'new',       label: 'New' },
            { value: 'contacted', label: 'Contacted' },
            { value: 'confirmed', label: 'Confirmed' },
            { value: 'completed', label: 'Completed' },
            { value: 'cancelled', label: 'Cancelled' },
          ]}
          type="testDrive"
          detailBase="/admin/test-drives"
          deleteTable="testdriverequest"
          deleteLabel="test drive request"
        />
      </div>
    </div>
  )
}
