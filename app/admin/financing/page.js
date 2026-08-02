import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { redirect } from 'next/navigation'
import { prisma } from '@/lib/prisma'
import styles from '../list.module.css'
import FinancingList from './FinancingList'

export default async function AdminFinancing() {
  const session = await getServerSession(authOptions)
  if (!session) redirect('/admin/login')

  const apps = await prisma.$queryRaw`
    SELECT id, firstName, lastName, phone, email,
           monthlyIncome, incomeFrequency, downPayment,
           status, priority, createdAt
    FROM financingapplication
    ORDER BY createdAt DESC
  `

  const newCount = apps.filter(a => a.status === 'new').length

  const rows = apps.map(a => ({
    id:              Number(a.id),
    name:            `${a.firstName} ${a.lastName}`,
    phone:           a.phone || '',
    email:           a.email || '',
    monthlyIncome:   a.monthlyIncome || '',
    incomeFrequency: a.incomeFrequency || '',
    downPayment:     a.downPayment || '',
    status:          a.status || 'new',
    priority:        a.priority || null,
    createdAt:       a.createdAt,
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
        <FinancingList initialRows={rows} />
      </div>
    </div>
  )
}
