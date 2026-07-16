import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { redirect } from 'next/navigation'
import { prisma } from '@/lib/prisma'
import Link from 'next/link'
import styles from '../list.module.css'

export default async function AdminInventory() {
  const session = await getServerSession(authOptions)
  if (!session) redirect('/admin/login')

  const cars = await prisma.car.findMany({ orderBy: { createdAt: 'desc' } })

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
        <div className={styles.tableWrap}>
          <table className={styles.table}>
            <thead>
              <tr>
                <th>Stock #</th>
                <th>Vehicle</th>
                <th>Price</th>
                <th>Mileage</th>
                <th>Title</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {cars.length === 0 && (
                <tr><td colSpan={7} className={styles.empty}>No vehicles yet. Add your first vehicle.</td></tr>
              )}
              {cars.map(car => (
                <tr key={car.id}>
                  <td className={styles.mono}>{car.stock}</td>
                  <td><strong>{car.year} {car.make} {car.model}{car.trim ? ` ${car.trim}` : ''}</strong></td>
                  <td>${car.price.toLocaleString()}</td>
                  <td>{car.mileage.toLocaleString()} mi</td>
                  <td>
                    <span className={`${styles.badge} ${car.titleType === 'rebuilt' ? styles.rebuilt : styles.clean}`}>
                      {car.titleType}
                    </span>
                  </td>
                  <td>
                    <span className={`${styles.badge} ${styles[car.status]}`}>{car.status}</span>
                  </td>
                  <td className={styles.actions}>
                    <Link href={`/admin/inventory/${car.id}`} className={styles.editBtn}>
                      <i className="fa-solid fa-pen-to-square" /> Edit
                    </Link>
                    <Link href={`/inventory/${car.id}`} target="_blank" className={styles.viewBtn}>
                      <i className="fa-solid fa-arrow-up-right-from-square" /> View
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
