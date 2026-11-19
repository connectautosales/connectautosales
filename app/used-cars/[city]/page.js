import Link from 'next/link'
import { notFound } from 'next/navigation'
import { prisma } from '@/lib/prisma'
import CarCard from '@/components/CarCard/CarCard'
import styles from './page.module.css'
import { OG_IMAGE } from '@/lib/seo'
import { getInventoryStats, formatPrice } from '@/lib/inventoryStats'
import { CITIES, CITY_SLUGS, DEALER_ADDRESS } from '@/lib/cities'

const LIVE = ['available', 'pending', 'coming_soon']
const SHOW = 12

export const dynamicParams = false
export const revalidate = 3600

export function generateStaticParams() {
  return CITY_SLUGS.map((city) => ({ city }))
}

export async function generateMetadata({ params }) {
  const { city: slug } = await params
  const city = CITIES[slug]
  if (!city) return {}
  const { count, minPrice } = await getInventoryStats()
  const path = `/used-cars/${slug}`
  const title = count > 1 && minPrice
    ? { absolute: `${count} Used Cars for Sale near ${city.name}, MI from ${formatPrice(minPrice)}` }
    : { absolute: `Used Cars for Sale near ${city.name}, MI | Connect Auto Sales` }
  const description = `Used cars, SUVs and trucks for sale ${city.miles} from ${city.name}, MI at Connect Auto Sales in Dearborn Heights. Real prices online, financing for all credit types and warranty options.`
  return {
    title,
    description,
    alternates: { canonical: path },
    openGraph: {
      images: [OG_IMAGE],
      url: path,
      title: `Used Cars for Sale near ${city.name}, MI | Connect Auto Sales`,
      description,
    },
  }
}

async function getCars() {
  try {
    const rows = await prisma.$queryRawUnsafe(
      `SELECT id, stock, slug, year, make, model, trim, price, financePrice, mileage,
              titleType, type, images, status, isNewArrival, createdAt
       FROM car
       WHERE status IN (${LIVE.map(() => '?').join(',')})
       ORDER BY createdAt DESC`,
      ...LIVE
    )
    return JSON.parse(JSON.stringify(rows, (_, v) => (typeof v === 'bigint' ? Number(v) : v)))
  } catch {
    return []
  }
}

export default async function CityPage({ params }) {
  const { city: slug } = await params
  const city = CITIES[slug]
  if (!city) notFound()

  const cars = await getCars()
  const shown = cars.slice(0, SHOW)
  const prices = cars.map((c) => Number(c.price)).filter((p) => p > 0)
  const cheapest = prices.length ? Math.min(...prices) : null
  const underTen = prices.filter((p) => p < 10000).length
  const directions = `https://www.google.com/maps/dir/?api=1&origin=${encodeURIComponent(`${city.name}, MI`)}&destination=${encodeURIComponent(`Connect Auto Sales, ${DEALER_ADDRESS}`)}`
  const others = Object.entries(CITIES).filter(([s]) => s !== slug)

  const faqs = [
    ...city.faqs,
    {
      q: `What are your hours for ${city.name} buyers?`,
      a: 'Monday to Friday 10AM to 6PM and Saturday 10AM to 4PM. We are closed on Sunday.',
    },
  ]
  const faqSchema = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: faqs.map((f) => ({
      '@type': 'Question',
      name: f.q,
      acceptedAnswer: { '@type': 'Answer', text: f.a },
    })),
  }

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }} />

      <section className={styles.hero}>
        <div className="container">
          <p className={styles.heroLabel}>CONNECT AUTO SALES</p>
          <h1 className={styles.heroTitle}>USED CARS FOR SALE NEAR {city.name.toUpperCase()}, MI</h1>
          <p className={styles.heroSub}>
            {`Our lot in Dearborn Heights is ${city.miles} from ${city.name}, ${city.drive} by car.`}
            {cheapest ? ` ${cars.length} vehicles in stock from ${formatPrice(cheapest)}.` : ''}
          </p>
        </div>
      </section>

      <div className={styles.statsBar}>
        <div className="container">
          <div className={styles.statsInner}>
            <div className={styles.statItem}>
              <span><strong>{cars.length}</strong> Vehicles In Stock</span>
            </div>
            <div className={styles.statDivider} />
            <div className={styles.statItem}>
              <span><strong>{underTen}</strong> Under $10,000</span>
            </div>
            <div className={styles.statDivider} />
            <div className={styles.statItem}>
              <span>Financing For All Credit Types</span>
            </div>
          </div>
        </div>
      </div>

      <section className={styles.copy}>
        <div className="container">
          <div className={styles.copyGrid}>
            <div>
              <h2 className={styles.sectionTitle}>{`A USED CAR DEALER ${city.direction.toUpperCase()}`}</h2>
              <div className={styles.line} />
              {city.intro.map((p, i) => (
                <p key={i} className={styles.body}>{p}</p>
              ))}
              <p className={styles.body}>
                Financing is available for bad credit, no credit and first-time buyers, and you
                can{' '}
                <Link href="/financing" className={styles.link}>apply online</Link> before you
                visit. We also offer{' '}
                <Link href="/warranty" className={styles.link}>warranty coverage</Link>, explain{' '}
                <Link href="/rebuilt-title" className={styles.link}>rebuilt titles</Link> honestly,
                and run{' '}
                <Link href="/salvage-inspections" className={styles.link}>Michigan salvage inspections</Link>{' '}
                for {city.name} drivers rebuilding a vehicle.
              </p>
            </div>

            <aside className={styles.side}>
              <h3 className={styles.sideTitle}>{`Getting here from ${city.name}`}</h3>
              <p className={styles.sideText}>
                4413 S Beech Daly St<br />
                Dearborn Heights, MI 48125
              </p>
              <p className={styles.sideText}>
                {`${city.miles} from ${city.name}, ${city.drive} by car.`}
              </p>
              <p className={styles.sideText}>
                Mon&ndash;Fri: 10AM&ndash;6PM<br />
                Sat: 10AM&ndash;4PM<br />
                Sun: Closed
              </p>
              <a href={directions} target="_blank" rel="noreferrer" className={styles.callBtn}>
                GET DIRECTIONS
              </a>
              <div className={styles.divider} />
              <a href="tel:3134133400" className={styles.callBtn}>CALL (313) 413-3400</a>
            </aside>
          </div>
        </div>
      </section>

      <section className={styles.listing}>
        <div className="container">
          <h2 className={styles.sectionTitle}>{`NEWEST ARRIVALS FOR ${city.name.toUpperCase()} BUYERS`}</h2>
          <div className={styles.line} />
          {shown.length > 0 ? (
            <>
              <div className={styles.carsGrid}>
                {shown.map((car) => <CarCard key={car.id} car={car} />)}
              </div>
              {cars.length > SHOW && (
                <div className={styles.moreRow}>
                  <Link href="/inventory" className={styles.secondaryBtn}>
                    {`VIEW ALL ${cars.length} VEHICLES`}
                  </Link>
                </div>
              )}
            </>
          ) : (
            <div className={styles.empty}>
              <p>Our inventory is being updated.</p>
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
          <h2 className={styles.sectionTitle}>{`QUESTIONS FROM ${city.name.toUpperCase()} BUYERS`}</h2>
          <div className={styles.line} />
          <div className={styles.faq}>
            {faqs.map((f) => (
              <div key={f.q} className={styles.faqItem}>
                <h3>{f.q}</h3>
                <p>{f.a}</p>
              </div>
            ))}
          </div>

          <h3 className={styles.sideTitle} style={{ marginTop: 40 }}>Shop by body type</h3>
          <div className={styles.chips}>
            <Link href="/body-type/suv" className={styles.chip}>SUVs</Link>
            <Link href="/body-type/sedan" className={styles.chip}>Sedans</Link>
            <Link href="/body-type/truck" className={styles.chip}>Trucks</Link>
            <Link href="/body-type/van" className={styles.chip}>Vans &amp; Minivans</Link>
            <Link href="/used-cars-under-10000" className={styles.chip}>Under $10,000</Link>
          </div>

          <h3 className={styles.sideTitle} style={{ marginTop: 32 }}>We also serve</h3>
          <div className={styles.nearby}>
            {others.map(([s, c]) => (
              <Link key={s} href={`/used-cars/${s}`} className={styles.chip}>{`Used cars near ${c.name}`}</Link>
            ))}
          </div>
        </div>
      </section>
    </>
  )
}
