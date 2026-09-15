import Link from 'next/link'
import { prisma } from '@/lib/prisma'
import { BODY_TYPES } from '@/lib/bodyTypes'
import styles from './page.module.css'

const LIVE = ['available', 'pending', 'coming_soon']

export const metadata = {
  title: 'Shop Used Cars by Body Type in Dearborn Heights, MI',
  description:
    'Shop our used inventory by body type — SUVs, sedans, trucks, minivans and hatchbacks for sale in Dearborn Heights, Michigan. Financing and warranty options available.',
  alternates: { canonical: '/body-type' },
  openGraph: {
    url: '/body-type',
    title: 'Shop Used Cars by Body Type | Connect Auto Sales',
    description: 'Shop SUVs, sedans, trucks, minivans and hatchbacks for sale in Dearborn Heights, Michigan.',
  },
}

async function getCounts() {
  try {
    const rows = await prisma.$queryRawUnsafe(
      `SELECT type, COUNT(*) AS n FROM car WHERE status IN (${LIVE.map(() => '?').join(',')}) GROUP BY type`,
      ...LIVE
    )
    return rows.reduce((acc, r) => {
      acc[r.type] = Number(r.n)
      return acc
    }, {})
  } catch {
    return {}
  }
}

export default async function BodyTypeHubPage() {
  const counts = await getCounts()
  const entries = Object.entries(BODY_TYPES).map(([slug, cfg]) => [
    slug,
    cfg,
    cfg.types.reduce((sum, t) => sum + (counts[t] || 0), 0),
  ])

  return (
    <>
      <section className={styles.hero}>
        <div className="container">
          <p className={styles.heroLabel}>CONNECT AUTO SALES</p>
          <h1 className={styles.heroTitle}>SHOP BY BODY TYPE</h1>
          <p className={styles.heroSub}>
            Find the right fit — SUVs, sedans, trucks, vans and hatchbacks in Dearborn Heights.
          </p>
        </div>
      </section>

      <section className={styles.grid}>
        <div className="container">
          <div className={styles.cards}>
            {entries.map(([slug, cfg, count]) => (
              <Link key={slug} href={`/body-type/${slug}`} className={styles.card}>
                <span className={styles.cardLabel}>{cfg.label}</span>
                <span className={styles.cardCount}>
                  {count > 0 ? `${count} available` : 'Ask us'}
                </span>
              </Link>
            ))}
          </div>
        </div>
      </section>

      <section className={styles.ctaBand}>
        <div className="container">
          <div className={styles.ctaInner}>
            <div>
              <h2 className={styles.ctaTitle}>Not sure what you need?</h2>
              <p className={styles.ctaText}>
                Tell us your budget and how you&apos;ll use it — we&apos;ll match you with the right vehicle
                and get you pre-approved. All credit types welcome.
              </p>
            </div>
            <div className={styles.ctaActions}>
              <a href="tel:3134133400" className={styles.primaryBtn}>CALL (313) 413-3400</a>
              <Link href="/inventory" className={styles.secondaryBtn}>VIEW ALL INVENTORY</Link>
            </div>
          </div>
        </div>
      </section>
    </>
  )
}
