import Link from 'next/link'
import { permanentRedirect } from 'next/navigation'
import CarCard from '@/components/CarCard/CarCard'
import styles from './page.module.css'
import { OG_IMAGE } from '@/lib/seo'
import { formatPrice } from '@/lib/inventoryStats'
import { BODY_TYPES } from '@/lib/bodyTypes'
import {
  COMMON_MAKES, MAKE_NAMES, MAKE_NOTES, MIN_INDEXED, getCarsByMake, getLiveMakes, tidy,
} from '@/lib/makes'

export const revalidate = 3600

const titleCaseSlug = (slug) =>
  MAKE_NAMES[slug] || slug.split('-').map((w) => w.charAt(0).toUpperCase() + w.slice(1)).join('-')

async function load(slug) {
  const cars = await getCarsByMake(slug)
  if (!cars.length && !COMMON_MAKES.includes(slug)) return null
  const name = cars.length ? tidy(cars[0].make) : titleCaseSlug(slug)
  return { cars, name }
}

const list = (items) =>
  items.length <= 2 ? items.join(' and ') : `${items.slice(0, -1).join(', ')} and ${items[items.length - 1]}`

export async function generateMetadata({ params }) {
  const { make: slug } = await params
  const data = await load(slug)
  if (!data) return {}
  const { cars, name } = data
  const prices = cars.map((c) => Number(c.price)).filter((p) => p > 0)
  const min = prices.length ? Math.min(...prices) : null
  const path = `/make/${slug}`
  const title = cars.length >= MIN_INDEXED && min
    ? { absolute: `${cars.length} Used ${name} for Sale in Dearborn Heights, MI from ${formatPrice(min)}` }
    : { absolute: `Used ${name} for Sale in Dearborn Heights, MI | Connect Auto Sales` }
  const models = [...new Set(cars.map((c) => tidy(c.model)))].slice(0, 4)
  const description = cars.length
    ? `Used ${name} for sale in Dearborn Heights, MI: ${list(models)}. Real prices online, financing for all credit types and warranty options at Connect Auto Sales.`
    : `Looking for a used ${name} near Dearborn Heights, MI? See what is in stock at Connect Auto Sales, with financing for all credit types and warranty options.`
  return {
    title,
    description,
    alternates: { canonical: path },
    robots: cars.length >= MIN_INDEXED ? undefined : { index: false, follow: true },
    openGraph: {
      images: [OG_IMAGE],
      url: path,
      title: `Used ${name} for Sale in Dearborn Heights, MI | Connect Auto Sales`,
      description,
    },
  }
}

export default async function MakePage({ params }) {
  const { make: slug } = await params
  const data = await load(slug)
  // Unknown makes used to redirect to the inventory (legacy /make/* URLs), so
  // keep doing that rather than serving a 404.
  if (!data) permanentRedirect('/inventory')
  const { cars, name } = data

  const prices = cars.map((c) => Number(c.price)).filter((p) => p > 0)
  const years = cars.map((c) => Number(c.year)).filter(Boolean)
  const miles = cars.map((c) => Number(c.mileage)).filter((m) => m > 0)
  const clean = cars.filter((c) => c.titleType === 'clean').length
  const rebuilt = cars.filter((c) => c.titleType === 'rebuilt').length
  const label = (c) => `${c.year} ${tidy(c.model)}${c.trim ? ' ' + tidy(c.trim) : ''}`
  const onLot = cars.filter((c) => c.status !== 'coming_soon').map(label)
  const arriving = cars.filter((c) => c.status === 'coming_soon').map(label)
  const bodyTypes = Object.entries(BODY_TYPES).filter(([, cfg]) => cars.some((c) => cfg.types.includes(c.type)))
  const otherMakes = (await getLiveMakes()).filter((m) => m.slug !== slug && m.count >= MIN_INDEXED)
  const range = (arr, fmt) => {
    if (!arr.length) return null
    const lo = Math.min(...arr)
    const hi = Math.max(...arr)
    return lo === hi ? fmt(lo) : `${fmt(lo)} to ${fmt(hi)}`
  }
  const n = cars.length

  return (
    <>
      <section className={styles.hero}>
        <div className="container">
          <p className={styles.heroLabel}>CONNECT AUTO SALES</p>
          <h1 className={styles.heroTitle}>{`USED ${name.toUpperCase()} FOR SALE IN DEARBORN HEIGHTS, MI`}</h1>
          <p className={styles.heroSub}>
            {n
              ? `${n} used ${name} ${n === 1 ? 'vehicle' : 'vehicles'} for sale${prices.length ? `, priced ${range(prices, formatPrice)}` : ''}.`
              : `No used ${name} vehicles on the lot right now. Our inventory changes every week.`}
          </p>
        </div>
      </section>

      <section className={styles.listing}>
        <div className="container">
          {n > 0 ? (
            <div className={styles.carsGrid}>
              {cars.map((car) => <CarCard key={car.id} car={car} />)}
            </div>
          ) : (
            <div className={styles.empty}>
              <p>{`No used ${name} in stock right now.`}</p>
              <p className={styles.emptySub}>
                Call and tell us what you are looking for, or browse the rest of the lot.
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
              <h2 className={styles.sectionTitle}>{`OUR USED ${name.toUpperCase()} INVENTORY`}</h2>
              <div className={styles.line} />
              {n > 0 && (
                <p className={styles.body}>
                  {onLot.length ? `On the lot now: ${list(onLot)}.` : ''}
                  {arriving.length ? ` Arriving soon: ${list(arriving)}.` : ''}
                  {years.length
                    ? ` Model ${Math.min(...years) === Math.max(...years) ? 'year' : 'years'} ${range(years, String)}`
                    : ''}
                  {miles.length ? `, with ${range(miles, (m) => m.toLocaleString('en-US'))} miles` : ''}
                  {years.length || miles.length ? '.' : ''}
                  {clean && rebuilt
                    ? ` ${clean} ${clean === 1 ? 'has a clean title' : 'have clean titles'} and ${rebuilt} ${rebuilt === 1 ? 'has a rebuilt title' : 'have rebuilt titles'}.`
                    : clean ? ` ${n === 1 ? 'It has' : 'All have'} a clean title.`
                    : rebuilt ? ` ${n === 1 ? 'It has' : 'All have'} a rebuilt title.` : ''}
                </p>
              )}
              {MAKE_NOTES[slug] && <p className={styles.body}>{MAKE_NOTES[slug]}</p>}
              <p className={styles.body}>
                Every vehicle is listed with its real price and a full set of photos. Financing is
                available for bad credit, no credit and first-time buyers (
                <Link href="/financing" className={styles.link}>apply online</Link>), and{' '}
                <Link href="/warranty" className={styles.link}>warranty coverage</Link> can be added
                {rebuilt ? (
                  <>, including on <Link href="/rebuilt-title" className={styles.link}>rebuilt titles</Link></>
                ) : null}.
              </p>
            </div>

            <aside className={styles.side}>
              <h3 className={styles.sideTitle}>Visit us</h3>
              <p className={styles.sideText}>
                4413 S Beech Daly St<br />
                Dearborn Heights, MI 48125
              </p>
              <p className={styles.sideText}>
                Mon&ndash;Fri: 10AM&ndash;6PM<br />
                Sat: 10AM&ndash;4PM<br />
                Sun: Closed
              </p>
              <a href="tel:3134133400" className={styles.callBtn}>CALL (313) 413-3400</a>
            </aside>
          </div>

          {bodyTypes.length > 0 && (
            <>
              <h3 className={styles.sideTitle} style={{ marginTop: 40 }}>Shop by body type</h3>
              <div className={styles.chips}>
                {bodyTypes.map(([s, cfg]) => (
                  <Link key={s} href={`/body-type/${s}`} className={styles.chip}>{`Used ${cfg.label}`}</Link>
                ))}
                <Link href="/inventory" className={styles.chip}>All Inventory</Link>
              </div>
            </>
          )}

          {otherMakes.length > 0 && (
            <>
              <h3 className={styles.sideTitle} style={{ marginTop: 32 }}>Other makes in stock</h3>
              <div className={styles.nearby}>
                {otherMakes.map((m) => (
                  <Link key={m.slug} href={`/make/${m.slug}`} className={styles.chip}>{`Used ${m.make} (${m.count})`}</Link>
                ))}
              </div>
            </>
          )}
        </div>
      </section>
    </>
  )
}
