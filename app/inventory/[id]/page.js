import Link from 'next/link'
import { cars } from '@/data/cars'
import styles from './page.module.css'
import { notFound } from 'next/navigation'

export function generateStaticParams() {
  return cars.map(car => ({ id: String(car.id) }))
}

export async function generateMetadata({ params }) {
  const { id } = await params
  const car = cars.find(c => c.id === parseInt(id))
  if (!car) return {}
  return { title: `${car.year} ${car.make} ${car.model} - Connect Auto Sales` }
}

export default async function CarDetailPage({ params }) {
  const { id } = await params
  const car = cars.find(c => c.id === parseInt(id))
  if (!car) notFound()

  const related = cars.filter(c => c.id !== car.id && (c.make === car.make || c.type === car.type)).slice(0, 3)

  return (
    <>
      <div className={styles.pageHero}>
        <div className="container">
          <div className={styles.breadcrumb}>
            <Link href="/">Home</Link>
            <span>›</span>
            <Link href="/inventory">Inventory</Link>
            <span>›</span>
            <span>{car.year} {car.make} {car.model}</span>
          </div>
        </div>
      </div>

      <section className={styles.carDetail}>
        <div className="container">
          <div className={styles.detailGrid}>
            {/* Image */}
            <div className={styles.imageSection}>
              <div className={styles.mainImage}>
                <div className={styles.imagePlaceholder}>
                  <svg width="120" height="120" viewBox="0 0 24 24" fill="none" stroke="#c0c8d4" strokeWidth="0.8">
                    <path d="M5 17H3a2 2 0 01-2-2V5a2 2 0 012-2h11a2 2 0 012 2v3"/>
                    <rect x="9" y="11" width="14" height="10" rx="2"/>
                    <circle cx="12" cy="21" r="1"/>
                    <circle cx="20" cy="21" r="1"/>
                  </svg>
                  <p>{car.year} {car.make} {car.model}</p>
                </div>
              </div>
              <div className={styles.typeBadge}>{car.type}</div>
            </div>

            {/* Info */}
            <div className={styles.infoSection}>
              <h1 className={styles.carTitle}>{car.year} {car.make} {car.model}</h1>
              <div className={styles.carPrice}>
                {car.price ? `$${car.price.toLocaleString()}` : 'Price Pending'}
              </div>

              <div className={styles.specsGrid}>
                {[
                  { label: 'Year', value: car.year, icon: '📅' },
                  { label: 'Mileage', value: `${car.mileage.toLocaleString()} mi`, icon: '🏁' },
                  { label: 'Transmission', value: car.transmission, icon: '⚙️' },
                  { label: 'Drivetrain', value: car.drivetrain, icon: '🚗' },
                  { label: 'Engine', value: car.engine, icon: '🔧' },
                  { label: 'Color', value: car.color, icon: '🎨' },
                ].map(s => (
                  <div key={s.label} className={styles.specItem}>
                    <span className={styles.specLabel}>{s.label}</span>
                    <span className={styles.specValue}>{s.value}</span>
                  </div>
                ))}
              </div>

              <div className={styles.actionButtons}>
                <Link href="/financing" className="btn-primary">Apply for Financing</Link>
                <Link href="/contact" className={styles.btnSecondary}>Ask a Question</Link>
              </div>

              <div className={styles.dealerInfo}>
                <div className={styles.dealerInfoItem}>
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#c0392b" strokeWidth="2">
                    <path d="M22 16.92v3a2 2 0 01-2.18 2 19.79 19.79 0 01-8.63-3.07A19.5 19.5 0 013.07 8.63 19.79 19.79 0 01.02 5c-.04-1.08.7-2 1.77-2.18h3a2 2 0 012 1.72c.127.96.361 1.903.7 2.81a2 2 0 01-.45 2.11L6.91 10.91a16 16 0 006.16 6.16l1.27-1.27a2 2 0 012.11-.45c.907.339 1.85.573 2.81.7a2 2 0 011.72 2.02z"/>
                  </svg>
                  <span>(313) 413-3400</span>
                </div>
                <div className={styles.dealerInfoItem}>
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#c0392b" strokeWidth="2">
                    <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0118 0z"/>
                    <circle cx="12" cy="10" r="3"/>
                  </svg>
                  <span>4413 S Beech Daly St, Dearborn Heights, MI</span>
                </div>
              </div>
            </div>
          </div>

          {/* Related */}
          {related.length > 0 && (
            <div className={styles.relatedSection}>
              <h2 className={styles.relatedTitle}>Similar Vehicles</h2>
              <div className={styles.relatedGrid}>
                {related.map(rc => (
                  <Link key={rc.id} href={`/inventory/${rc.id}`} className={styles.relatedCard}>
                    <div className={styles.relatedImage}>
                      <svg width="50" height="50" viewBox="0 0 24 24" fill="none" stroke="#aaa" strokeWidth="1">
                        <path d="M5 17H3a2 2 0 01-2-2V5a2 2 0 012-2h11a2 2 0 012 2v3"/>
                        <rect x="9" y="11" width="14" height="10" rx="2"/>
                        <circle cx="12" cy="21" r="1"/>
                        <circle cx="20" cy="21" r="1"/>
                      </svg>
                    </div>
                    <div className={styles.relatedInfo}>
                      <p className={styles.relatedName}>{rc.year} {rc.make} {rc.model}</p>
                      <p className={styles.relatedPrice}>
                        {rc.price ? `$${rc.price.toLocaleString()}` : 'Price Pending'}
                      </p>
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          )}
        </div>
      </section>
    </>
  )
}
