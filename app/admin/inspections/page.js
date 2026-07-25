import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { redirect } from 'next/navigation'
import { prisma } from '@/lib/prisma'
import styles from '../list.module.css'
import BulkTable from '../BulkTable'

export default async function AdminInspections() {
  const session = await getServerSession(authOptions)
  if (!session) redirect('/admin/login')

  const items = await prisma.$queryRaw`SELECT * FROM salvageinspection ORDER BY createdAt DESC`
  const newCount = items.filter(i => i.status === 'new').length

  const rows = items.map(i => {
    const docs = [
      i.salvageTitle ? 'Title' : null,
      i.validId ? 'ID' : null,
      i.receipts ? 'Receipts' : null,
    ].filter(Boolean).join(', ') || '—'

    return {
      id: i.id,
      status: i.status || 'new',
      cells: [
        `${i.firstName || ''} ${i.lastName || ''}`.trim() || '—',
        i.phone || '—',
        i.email || '—',
        docs,
        new Date(i.createdAt).toLocaleDateString(),
      ],
    }
  })

  return (
    <div className={styles.page}>
      <div className={styles.topBar}>
        <div className={styles.topBarLeft}>
          <h1 className={styles.title}>Salvage Inspections</h1>
          <p className={styles.sub}>{items.length} total · {newCount} new</p>
        </div>
      </div>
      <div className={styles.content}>
        <BulkTable
          rows={rows}
          headers={['Name', 'Phone', 'Email', 'Documents', 'Date']}
          statusOptions={[
            { value: 'new',                label: 'New' },
            { value: 'documents-reviewed', label: 'Documents Reviewed' },
            { value: 'scheduled',          label: 'Scheduled' },
            { value: 'completed',          label: 'Completed' },
          ]}
          type="inspection"
          detailBase="/admin/inspections"
          deleteTable="salvageinspection"
          deleteLabel="inspection"
        />
      </div>
    </div>
  )
}
