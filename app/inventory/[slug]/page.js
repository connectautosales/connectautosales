import Link from 'next/link'
import { prisma } from '@/lib/prisma'
import { notFound, permanentRedirect } from 'next/navigation'
import CarCard from '@/components/CarCard/CarCard'
import { BODY_TYPES } from '@/lib/bodyTypes'
import VehicleDetail from './VehicleDetail'
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
  if (!car) return { title: 'Vehicle Not Found' }

  const name = carName(car)
  const price = car.price ? `$${Number(car.price).toLocaleString('en-US')}` : null
  const miles = car.mileage ? `${Number(car.mileage).toLocaleString('en-US')} miles` : null
  const title = `${name} for Sale in Dearborn Heights, MI`
  const description = [
    `${name} for sale at Connect Auto Sales in Dearborn Heights, Michigan.`,
    [price, miles, car.titleType === 'rebuilt' ? 'rebuilt title' : 'clean title'].filter(Boolean).join(', ') + '.',
    'Financing and warranty options available. Call (313) 413-3400.',
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
      title: `${name} | Connect Auto Sales`,
      description,
      images: images.length ? [images[0]] : undefined,
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
