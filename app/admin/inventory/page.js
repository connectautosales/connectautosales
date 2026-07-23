import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { redirect } from 'next/navigation'
import { prisma } from '@/lib/prisma'
import Link from 'next/link'
import styles from '../list.module.css'
import InventoryList from './InventoryList'

export default async function AdminInventory() {
  const session = await getServerSession(authOptions)
  if (!session) redirect('/admin/login')

  const cars = await prisma.$queryRaw`SELECT * FROM car ORDER BY createdAt DESC`

  return (
    <div className={styles.page}>
      <div className={styles.topBar}>
        <div className={styles.topBarLeft}>
          <h1 className={styles.title}>Inventory</h1>
          <p className={styles.sub}>{cars.length} vehicles total</p>
        </div>
        <Link href="/admin/inventory/new" className={styles.addBtn}>
          <i className="fa-solid fa-plus" /> Add Vehicle
        </Link>
      </div>

      <div className={styles.content}>
        <InventoryList initialCars={JSON.parse(JSON.stringify(cars))} />
      </div>
    </div>
  )
}
