import Link from 'next/link'
import { prisma } from '@/lib/prisma'
import CarCard from '@/components/CarCard/CarCard'
import styles from './page.module.css'

const LIVE = ['available', 'pending', 'coming_soon']
const CAP = 10000

export const metadata = {
  title: 'Used Cars Under $10,000 in Dearborn Heights, MI',
  description:
    'Affordable used cars under $10,000 for sale in Dearborn Heights, Michigan. Financing available for bad credit and first-time buyers, warranty options, clean and rebuilt titles.',
  alternates: { canonical: '/used-cars-under-10000' },
  openGraph: {
    url: '/used-cars-under-10000',
    title: 'Used Cars Under $10,000 in Dearborn Heights, MI | Connect Auto Sales',
    description:
      'Affordable used cars under $10,000 in Dearborn Heights. Financing for all credit situations and warranty options available.',
  },
}

async function getCars() {
  try {
    const rows = await prisma.$queryRawUnsafe(
      `SELECT id, stock, slug, year, make, model, trim, price, financePrice, mileage,
              titleType, type, images, status, isNewArrival, createdAt
       FROM car
       WHERE status IN (${LIVE.map(() => '?').join(',')}) AND price > 0 AND price < ?
       ORDER BY price ASC`,
      ...LIVE,
      CAP
    )
    return JSON.parse(JSON.stringify(rows, (_, v) => (typeof v === 'bigint' ? Number(v) : v)))
  } catch {
    return []
  }
}

export default async function UnderTenPage() {
  const cars = await getCars()
  const cheapest = cars.length ? Math.min(...cars.map((c) => c.price)) : null

  return (
    <>
      <section className={styles.hero}>
        <div className="container">
          <p className={styles.heroLabel}>CONNECT AUTO SALES</p>
          <h1 className={styles.heroTitle}>USED CARS UNDER $10,000 IN DEARBORN HEIGHTS</h1>
          <p className={styles.heroSub}>
            {cheapest
              ? `Affordable pre-owned vehicles starting at $${Number(cheapest).toLocaleString('en-US')}, with financing and warranty options available.`
              : 'Affordable pre-owned vehicles with financing and warranty options available.'}
          </p>
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
              <span><strong>{cars.length}</strong> Vehicles Under $10,000</span>
            </div>
            <div className={styles.statDivider} />
            <div className={styles.statItem}>
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <rect x="2" y="5" width="20" height="14" rx="2" /><line x1="2" y1="10" x2="22" y2="10" />
              </svg>
              <span>Bad Credit &amp; First-Time Buyers Welcome</span>
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

      <section className={styles.listing}>
        <div className="container">
          {cars.length > 0 ? (
            <div className={styles.carsGrid}>
              {cars.map((car) => <CarCard key={car.id} car={car} />)}
            </div>
          ) : (
            <div className={styles.empty}>
              <p>Nothing under $10,000 on the lot right now.</p>
              <p className={styles.emptySub}>
                Our inventory turns over weekly. Call and tell us your budget and we&apos;ll let
                you know the moment something lands, or source one for you through our auction
                access.
              </p>
              <div className={styles.emptyActions}>
                <a href="tel:3134133400" className={styles.primaryBtn}>CALL (313) 413-3400</a>
                <Link href="/inventory" className={styles.secondaryBtn}>VIEW ALL INVENTORY</Link>
              </div>
            </div>
          )}
        </div>
      </section>

      <section className={styles.copy}>
        <div className="container">
          <div className={styles.copyGrid}>
            <div>
              <h2 className={styles.sectionTitle}>BUYING AN AFFORDABLE USED CAR IN METRO DETROIT</h2>
              <div className={styles.line} />
              <p className={styles.body}>
                A lower price does not have to mean a worse car. Most of what sits under
                $10,000 on our lot is there because of mileage or because it carries a rebuilt
                title, not because something is wrong with it. Every vehicle is inspected
                before it goes up for sale, and we show you the history and the photos so you
                can judge for yourself.
              </p>
              <p className={styles.body}>
                If a rebuilt title is new to you, it means the vehicle was declared a total
                loss at some point, then repaired and re-inspected. In Michigan that inspection
                is state certified. It is why the same car can cost noticeably less here than
                with a clean title, and it is worth understanding before you rule it out.{' '}
                <Link href="/rebuilt-title" className={styles.link}>Read more about rebuilt titles</Link>.
              </p>
              <p className={styles.body}>
                Financing is available on vehicles in this price range. We work with bad
                credit, no credit and first-time buyers through our outside lender network, and
                we offer{' '}
                <Link href="/buy-here-pay-here" className={styles.link}>in-house financing</Link>{' '}
                on select vehicles for qualified buyers. Warranty coverage is available too,
                including on rebuilt titles.
              </p>
            </div>

            <aside className={styles.side}>
              <h3 className={styles.sideTitle}>Looking for something specific?</h3>
              <div className={styles.chips}>
                <Link href="/body-type/sedan" className={styles.chip}>Sedans</Link>
                <Link href="/body-type/suv" className={styles.chip}>SUVs</Link>
                <Link href="/body-type/truck" className={styles.chip}>Trucks</Link>
                <Link href="/body-type/van" className={styles.chip}>Vans &amp; Minivans</Link>
                <Link href="/body-type/hatchback" className={styles.chip}>Hatchbacks</Link>
                <Link href="/inventory" className={styles.chip}>All Inventory</Link>
              </div>
              <div className={styles.divider} />
              <p className={styles.sideText}>
                Tell us your budget and what you need it for. We&apos;ll point you at what you
                can actually get approved on.
              </p>
              <a href="tel:3134133400" className={styles.callBtn}>CALL (313) 413-3400</a>
            </aside>
          </div>
        </div>
      </section>
    </>
  )
}
