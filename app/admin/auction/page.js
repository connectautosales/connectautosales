import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { redirect } from 'next/navigation'
import { prisma } from '@/lib/prisma'
import styles from '../list.module.css'
import BulkTable from '../BulkTable'

export default async function AdminAuction() {
  const session = await getServerSession(authOptions)
  if (!session) redirect('/admin/login')

  const requests = await prisma.$queryRaw`SELECT * FROM auctionrequest ORDER BY createdAt DESC`
  const newCount = requests.filter(r => r.status === 'new').length

  const rows = requests.map(r => ({
    id: r.id,
    status: r.status || 'new',
    cells: [
      `${r.firstName} ${r.lastName}`,
      r.phone || '—',
      r.email || '—',
      r.lotNumber || '—',
      new Date(r.createdAt).toLocaleDateString(),
    ],
  }))

  return (
    <div className={styles.page}>
      <div className={styles.topBar}>
        <div className={styles.topBarLeft}>
          <h1 className={styles.title}>Auction Requests</h1>
          <p className={styles.sub}>{requests.length} total · {newCount} new</p>
        </div>
      </div>
      <div className={styles.content}>
        <BulkTable
          rows={rows}
          headers={['Name', 'Phone', 'Email', 'Lot #', 'Date']}
          statusOptions={[
            { value: 'new',       label: 'New' },
            { value: 'reviewed',  label: 'Reviewed' },
            { value: 'contacted', label: 'Contacted' },
            { value: 'completed', label: 'Completed' },
          ]}
          type="auction"
          detailBase="/admin/auction"
          deleteTable="auctionrequest"
          deleteLabel="auction request"
        />
      </div>
    </div>
  )
}
