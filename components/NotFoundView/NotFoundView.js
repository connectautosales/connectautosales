import Link from 'next/link'
import { prisma } from '@/lib/prisma'
import CarCard from '@/components/CarCard/CarCard'
import { BODY_TYPES } from '@/lib/bodyTypes'
import styles from './NotFoundView.module.css'

const SHORTCUTS = [
  ...Object.entries(BODY_TYPES).map(([slug, cfg]) => ({ href: `/body-type/${slug}`, label: `Used ${cfg.label}` })),
  { href: '/used-cars-under-10000', label: 'Cars Under $10,000' },
  { href: '/buy-here-pay-here', label: 'Buy Here Pay Here' },
  { href: '/financing', label: 'Get Pre-Approved' },
]

// Newest live vehicles, so a dead link (an old ad, a sold car, a retired
// WordPress URL) still lands the visitor on something they can act on.
async function getLatestCars() {
  try {
    const rows = await prisma.$queryRaw`
      SELECT id, stock, slug, year, make, model, trim, price, financePrice,
             mileage, titleType, type, images, status, isNewArrival, createdAt
      FROM car
      WHERE status IN ('available', 'pending', 'coming_soon')
      ORDER BY createdAt DESC
      LIMIT 8
    `
    return JSON.parse(JSON.stringify(rows, (_, v) => (typeof v === 'bigint' ? Number(v) : v)))
  } catch {
    return []
  }
}

export default async function NotFoundView({ heading, text }) {
  const cars = await getLatestCars()

  return (
    <div className={styles.page}>
      <section className={styles.hero}>
        <div className="container">
          <p className={styles.label}>CONNECT AUTO SALES</p>
          <h1 className={styles.title}>{heading}</h1>
          <p className={styles.text}>{text}</p>
          <div className={styles.actions}>
            <Link href="/inventory" className={styles.primaryBtn}>VIEW ALL INVENTORY</Link>
            <a href="tel:3134133400" className={styles.secondaryBtn}>CALL (313) 413-3400</a>
          </div>
          <nav className={styles.shortcuts} aria-label="Popular pages">
            {SHORTCUTS.map((s) => (
              <Link key={s.href} href={s.href} className={styles.shortcut}>{s.label}</Link>
            ))}
          </nav>
        </div>
      </section>

      {cars.length > 0 && (
        <section className={styles.carsSection}>
          <div className="container">
            <h2 className={styles.carsTitle}>Latest Arrivals</h2>
            <div className={styles.sectionLine} />
            <div className={styles.carsGrid}>
              {cars.map((car) => <CarCard key={car.id} car={car} />)}
            </div>
          </div>
        </section>
      )}
    </div>
  )
}
