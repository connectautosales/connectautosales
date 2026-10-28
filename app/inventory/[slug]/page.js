import Link from 'next/link'
import { prisma } from '@/lib/prisma'
import { notFound, permanentRedirect } from 'next/navigation'
import CarCard from '@/components/CarCard/CarCard'
import { BODY_TYPES } from '@/lib/bodyTypes'
import VehicleDetail from './VehicleDetail'
import { OG_IMAGE } from '@/lib/seo'
import styles from './page.module.css'

const SITE = 'https://www.connectautosales.com'

// Only these statuses are public. Sold and hidden vehicles must 404 — the
// client does not want sold inventory visible anywhere on the site.
const LIVE = ['available', 'pending', 'coming_soon']

async function findCar(slug) {
  // Try by stock first (works for numeric and alphanumeric like "1755A")
  const byStock = await prisma.$queryRawUnsafe(`SELECT * FROM car WHERE stock = ? LIMIT 1`, slug)
  if (byStock[0]) return byStock[0]
  // Try by numeric ID
  if (/^\d+$/.test(slug)) {
    const byId = await prisma.$queryRawUnsafe(`SELECT * FROM car WHERE id = ? LIMIT 1`, parseInt(slug))
    return byId[0] || null
  }
  // Fall back to slug column
  const rows = await prisma.$queryRaw`SELECT * FROM car WHERE slug = ${slug} LIMIT 1`
  return rows[0] || null
}

async function getCar(slug) {
  const car = await findCar(slug)
  return car && LIVE.includes(car.status) ? car : null
}

// Other live vehicles to link from this page: same body type first, then
// nearest in price. Gives every vehicle page crawlable links to the rest of
// the inventory, which previously only the listing pages provided.
async function getSimilar(car) {
  try {
    const rows = await prisma.$queryRawUnsafe(
      `SELECT * FROM car WHERE status IN (${LIVE.map(() => '?').join(',')}) AND id <> ?
       ORDER BY (type = ?) DESC, ABS(price - ?) ASC LIMIT 4`,
      ...LIVE,
      car.id,
      car.type || '',
      Number(car.price) || 0
    )
    return JSON.parse(JSON.stringify(rows, (_, v) => (typeof v === 'bigint' ? Number(v) : v)))
  } catch {
    return []
  }
}

function bodyTypeFor(type) {
  return Object.entries(BODY_TYPES).find(([, cfg]) => cfg.types.includes(type)) || null
}

function carName(car) {
  return `${car.year} ${car.make} ${car.model}${car.trim ? ' ' + car.trim : ''}`
}

// For titles: collapse stray spaces and turn shouted words ("CIVIC SPORT")
// into "Civic Sport", while leaving short trim codes such as SXT, LE, GT as
// they are.
function displayName(car) {
  return carName(car)
    .replace(/\s+/g, ' ')
    .trim()
    .replace(/\b([A-Z])([A-Z]{3,})\b/g, (_, first, rest) => first + rest.toLowerCase())
}

const DRIVETRAIN_TEXT = {
  AWD: 'all-wheel drive',
  'ALL WHEEL DRIVE': 'all-wheel drive',
  FWD: 'front-wheel drive',
  RWD: 'rear-wheel drive',
  '4WD': 'four-wheel drive',
  '4X4': 'four-wheel drive',
}

const money = (n) => `$${Number(n).toLocaleString('en-US')}`
const titleCase = (s) => String(s).toLowerCase().replace(/\b\w/g, (c) => c.toUpperCase())

function hasDamagePhotos(car) {
  try {
    const d = JSON.parse(car.damageImages || '[]')
    return Array.isArray(d) && d.length > 0
  } catch {
    return false
  }
}

// One short, factual paragraph per fact the shopper needs, built only from
// this car's own data so every vehicle page reads differently.
function BuyingThisVehicle({ car, name, bodyType }) {
  const mileage = Number(car.mileage) || 0
  const miles = mileage ? `${mileage.toLocaleString('en-US')} mile${mileage === 1 ? '' : 's'}` : null
  const drive = DRIVETRAIN_TEXT[String(car.drivetrain || '').trim().toUpperCase()]
  const fuel = { HYBRID: 'a hybrid powertrain', DIESEL: 'a diesel engine' }[String(car.fuelType || '').toUpperCase()]
  const color = car.color ? titleCase(car.color.trim()) : null
  // Trailers and campers have no powertrain worth describing.
  const motorized = !['Camper', 'Trailer'].includes(car.type)

  const transmission = car.transmission
    ? `${/^[aeiou]/i.test(car.transmission) ? 'an' : 'a'} ${car.transmission.toLowerCase()} transmission`
    : null
  const specs = motorized ? [miles, drive, transmission, fuel].filter(Boolean) : []
  const rebuilt = car.titleType === 'rebuilt'

  return (
    <section className={styles.buyingSection}>
      <div className="container">
        <div className={styles.buyingInner}>
          <h2 className={styles.sectionTitle}>Buying This Vehicle</h2>
          <div className={styles.sectionLine} />
          <p>
            This {color ? `${color.toLowerCase()} ` : ''}{name}
            {specs.length ? ` comes with ${specs.join(', ').replace(/, ([^,]*)$/, ' and $1')}` : ''}.
            {car.price ? (
              <> The price is {money(car.price)} when paid in full{car.financePrice && Number(car.financePrice) !== Number(car.price)
                ? `, or ${money(car.financePrice)} with financing` : ''}.</>
            ) : null}
          </p>
          {rebuilt ? (
            <p>
              It has a rebuilt title, which means it was declared a total loss at some point, then
              repaired and inspected before being retitled.
              {hasDamagePhotos(car) ? ' The Previous Damage Photos above show the damage before the repair.' : ''}
              {' '}Rebuilt title vehicles cost less than the same model with a clean title.{' '}
              <Link href="/rebuilt-title">What a rebuilt title means in Michigan</Link>.
            </p>
          ) : (
            <p>It has a clean title.</p>
          )}
          <p>
            Financing is available for all credit types, including first-time buyers, and warranty
            coverage can be added. <Link href="/financing">Apply for financing</Link> or{' '}
            <Link href="/warranty">see warranty options</Link>.
          </p>
          <p>
            See it at our lot on S Beech Daly Street in Dearborn Heights, a short drive from Dearborn,
            Inkster, Taylor and Westland. Use the test drive button above to book a time
            {bodyType ? <>, or browse more <Link href={`/body-type/${bodyType[0]}`}>used {bodyType[1].label.toLowerCase()}</Link></> : null}.
          </p>
        </div>
      </div>
    </section>
  )
}

function carImages(car) {
  try {
    const parsed = JSON.parse(car.images || '[]')
    return Array.isArray(parsed) ? parsed.filter(Boolean) : []
  } catch {
    return []
  }
}

export async function generateMetadata({ params }) {
  const { slug } = await params
  const car = await getCar(slug)
  if (!car) return { title: 'Vehicle No Longer Available', robots: { index: false } }

  const name = displayName(car)
  const price = car.price ? `$${Number(car.price).toLocaleString('en-US')}` : null
  const miles = car.mileage ? `${Number(car.mileage).toLocaleString('en-US')} miles` : null
  // The price is what a shopper scans for in search results, so it goes in the
  // title. "absolute" skips the site-wide "| Connect Auto Sales" suffix to keep
  // the title short enough not to be cut off.
  const title = price
    ? { absolute: `${name} - ${price} | Dearborn Heights, MI` }
    : `${name} for Sale in Dearborn Heights, MI`
  const description = [
    `${name} for sale in Dearborn Heights, MI${price ? ` for ${price}` : ''}.`,
    [miles, car.titleType === 'rebuilt' ? 'rebuilt title' : 'clean title'].filter(Boolean).join(', ') + '.',
    'Financing for all credit types and warranty options. Call (313) 413-3400.',
  ].join(' ')

  const canonical = `/inventory/${car.stock || car.slug || car.id}`
  const images = carImages(car)

  return {
    title,
    description,
    alternates: { canonical },
    openGraph: {
      type: 'website',
      url: canonical,
      title: price ? `${name} - ${price} | Connect Auto Sales` : `${name} | Connect Auto Sales`,
      description,
      images: images.length ? [images[0]] : [OG_IMAGE],
    },
  }
}

export default async function VehicleDetailPage({ params }) {
  const { slug } = await params

  const [car, settingsRows] = await Promise.all([
    getCar(slug),
    prisma.$queryRaw`SELECT * FROM sitesettings LIMIT 1`,
  ])

  if (!car) notFound()

  // Canonicalize on the stock number so each vehicle has exactly one indexable URL
  if (car.stock && slug !== String(car.stock)) {
    permanentRedirect(`/inventory/${car.stock}`)
  }

  const settings = settingsRows[0] || null
  const similar = await getSimilar(car)
  const bodyType = bodyTypeFor(car.type)

  const serialized = JSON.parse(JSON.stringify(car, (_, v) =>
    typeof v === 'bigint' ? Number(v) : v
  ))

  const images = carImages(car)
  const schema = {
    '@context': 'https://schema.org',
    '@type': 'Car',
    name: carName(car),
    brand: { '@type': 'Brand', name: car.make },
    model: car.model,
    vehicleModelDate: String(car.year),
    sku: car.stock,
    ...(car.vin && { vehicleIdentificationNumber: car.vin }),
    ...(car.color && { color: car.color }),
    ...(car.transmission && { vehicleTransmission: car.transmission }),
    ...(car.fuelType && { fuelType: car.fuelType }),
    ...(car.drivetrain && { driveWheelConfiguration: car.drivetrain }),
    ...(car.mileage && {
      mileageFromOdometer: { '@type': 'QuantitativeValue', value: Number(car.mileage), unitCode: 'SMI' },
    }),
    ...(images.length && { image: images.map((i) => (i.startsWith('http') ? i : `${SITE}${i}`)) }),
    url: `${SITE}/inventory/${car.stock || car.slug}`,
    ...(car.description?.trim() && { description: car.description.trim().replace(/\s+/g, ' ').slice(0, 500) }),
    ...(car.titleType === 'rebuilt' && {
      knownVehicleDamages: 'Rebuilt title: previously declared a total loss, then repaired and inspected before being retitled.',
    }),
    offers: {
      '@type': 'Offer',
      price: Number(car.price),
      priceCurrency: 'USD',
      availability: car.status === 'sold' ? 'https://schema.org/SoldOut' : 'https://schema.org/InStock',
      itemCondition: 'https://schema.org/UsedCondition',
      seller: { '@type': 'AutoDealer', name: 'Connect Auto Sales' },
    },
  }

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
      />
      <VehicleDetail car={serialized} settings={settings} />
      <BuyingThisVehicle car={car} name={displayName(car)} bodyType={bodyType} />
      {similar.length > 0 && (
        <section className={styles.similarSection}>
          <div className="container">
            <h2 className={styles.sectionTitle}>Similar Vehicles</h2>
            <div className={styles.sectionLine} />
            <div className={styles.similarGrid}>
              {similar.map((c) => <CarCard key={c.id} car={c} />)}
            </div>
            <div className={styles.similarLinks}>
              {bodyType && (
                <Link href={`/body-type/${bodyType[0]}`}>All used {bodyType[1].label.toLowerCase()}</Link>
              )}
              <Link href="/inventory">View all inventory</Link>
            </div>
          </div>
        </section>
      )}
    </>
  )
}
