import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { redirect } from 'next/navigation'
import { prisma } from '@/lib/prisma'
import styles from '../list.module.css'
import BulkTable from '../BulkTable'

export default async function AdminFinancing() {
  const session = await getServerSession(authOptions)
  if (!session) redirect('/admin/login')

  const apps = await prisma.$queryRaw`SELECT id, firstName, lastName, phone, email, monthlyIncome, downPayment, status, createdAt FROM financingapplication ORDER BY createdAt DESC`
  const newCount = apps.filter(a => a.status === 'new').length

  const rows = apps.map(a => ({
    id: a.id,
    status: a.status || 'new',
    cells: [
      `${a.firstName} ${a.lastName}`,
      a.phone || '—',
      a.email || '—',
      a.monthlyIncome ? `$${a.monthlyIncome}/mo` : '—',
      a.downPayment ? `$${a.downPayment}` : '—',
      new Date(a.createdAt).toLocaleDateString(),
    ],
  }))

  return (
    <div className={styles.page}>
      <div className={styles.topBar}>
        <div className={styles.topBarLeft}>
          <h1 className={styles.title}>Financing Applications</h1>
          <p className={styles.sub}>{apps.length} total · {newCount} new</p>
        </div>
      </div>
      <div className={styles.content}>
        <BulkTable
          rows={rows}
          headers={['Name', 'Phone', 'Email', 'Income', 'Down Payment', 'Date']}
          statusOptions={[
            { value: 'new',       label: 'New' },
            { value: 'reviewed',  label: 'Reviewed' },
            { value: 'contacted', label: 'Contacted' },
            { value: 'approved',  label: 'Approved' },
            { value: 'rejected',  label: 'Rejected' },
          ]}
          type="financing"
          detailBase="/admin/financing"
          deleteTable="financingapplication"
          deleteLabel="application"
        />
      </div>
    </div>
  )
}
