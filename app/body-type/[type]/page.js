import Link from 'next/link'
import { permanentRedirect } from 'next/navigation'
import { prisma } from '@/lib/prisma'
import CarCard from '@/components/CarCard/CarCard'
import { BODY_TYPES, resolveBodyType } from '@/lib/bodyTypes'
import styles from './page.module.css'

const LIVE = ['available', 'pending', 'coming_soon']

export function generateStaticParams() {
  return Object.keys(BODY_TYPES).map((type) => ({ type }))
}

async function getCars(types) {
  try {
    const rows = await prisma.$queryRawUnsafe(
      `SELECT * FROM car WHERE status IN (${LIVE.map(() => '?').join(',')})
       AND type IN (${types.map(() => '?').join(',')}) ORDER BY createdAt DESC`,
      ...LIVE,
      ...types
    )
    return JSON.parse(JSON.stringify(rows, (_, v) => (typeof v === 'bigint' ? Number(v) : v)))
  } catch {
    return []
  }
}

export async function generateMetadata({ params }) {
  const { type } = await params
  const key = resolveBodyType(type)
  if (!key) return { title: 'Inventory' }
  const cfg = BODY_TYPES[key]
  return {
    title: cfg.title,
    description: cfg.description,
    alternates: { canonical: `/body-type/${key}` },
    openGraph: {
      url: `/body-type/${key}`,
      title: `${cfg.title} | Connect Auto Sales`,
      description: cfg.description,
    },
  }
}

export default async function BodyTypePage({ params }) {
  const { type } = await params
  const key = resolveBodyType(type)
  if (!key) permanentRedirect('/inventory')
  if (key !== String(type).toLowerCase()) permanentRedirect(`/body-type/${key}`)

  const cfg = BODY_TYPES[key]
  const cars = await getCars(cfg.types)
  const others = Object.entries(BODY_TYPES).filter(([k]) => k !== key)

  return (
    <>
      <section className={styles.hero}>
        <div className="container">
          <p className={styles.heroLabel}>CONNECT AUTO SALES</p>
          <h1 className={styles.heroTitle}>{cfg.heading}</h1>
          <p className={styles.heroSub}>{cfg.sub}</p>
        </div>
      </section>

      <div className={styles.statsBar}>
        <div className="container">
          <div className={styles.statsInner}>
            <div className={styles.statItem}>
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <rect x="1" y="3" width="15" height="13" rx="2" /><path d="M16 8h4l3 3v4h-7V8z" />
                <circle cx="5.5" cy="18.5" r="2.5" /><circle cx="18.5" cy="18.5" r="2.5" />
              </svg>
              <span><strong>{cars.length}</strong> {cfg.label} Available</span>
            </div>
            <div className={styles.statDivider} />
            <div className={styles.statItem}>
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <rect x="2" y="5" width="20" height="14" rx="2" /><line x1="2" y1="10" x2="22" y2="10" />
              </svg>
              <span>Financing Available</span>
            </div>
            <div className={styles.statDivider} />
            <div className={styles.statItem}>
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
              </svg>
              <span>Warranty Options Available</span>
            </div>
          </div>
        </div>
      </div>

      <section className={styles.inventorySection}>
        <div className="container">
          {cars.length > 0 ? (
            <div className={styles.carsGrid}>
              {cars.map((car) => <CarCard key={car.id} car={car} />)}
            </div>
          ) : (
            <div className={styles.noResults}>
              <p>We don&apos;t have any {cfg.label.toLowerCase()} in stock right now.</p>
              <p className={styles.noResultsSub}>
                Our inventory changes weekly — call us and we&apos;ll let you know as soon as one arrives,
                or we can source one for you through our auction access.
              </p>
              <div className={styles.noResultsActions}>
                <a href="tel:3134133400" className={styles.primaryBtn}>CALL (313) 413-3400</a>
                <Link href="/inventory" className={styles.secondaryBtn}>VIEW ALL INVENTORY</Link>
              </div>
            </div>
          )}
        </div>
      </section>

      <section className={styles.ctaBand}>
        <div className="container">
          <div className={styles.ctaInner}>
            <div>
              <h2 className={styles.ctaTitle}>Found something you like?</h2>
              <p className={styles.ctaText}>
                Get pre-approved in minutes — we finance all credit types, including first-time buyers.
                Call us to schedule a test drive or ask about a specific vehicle.
              </p>
            </div>
            <div className={styles.ctaActions}>
              <a href="tel:3134133400" className={styles.primaryBtn}>CALL (313) 413-3400</a>
              <Link href="/financing" className={styles.secondaryBtn}>GET PRE-APPROVED</Link>
            </div>
          </div>
        </div>
      </section>

      <section className={styles.browseMore}>
        <div className="container">
          <h2 className={styles.browseTitle}>BROWSE BY BODY TYPE</h2>
          <div className={styles.browseLinks}>
            {others.map(([slug, o]) => (
              <Link key={slug} href={`/body-type/${slug}`} className={styles.browseLink}>
                {o.label}
              </Link>
            ))}
            <Link href="/inventory" className={styles.browseLink}>All Inventory</Link>
          </div>
        </div>
      </section>
    </>
  )
}
