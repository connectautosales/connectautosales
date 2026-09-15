import { prisma } from '@/lib/prisma'
import { notFound, permanentRedirect } from 'next/navigation'
import VehicleDetail from './VehicleDetail'

const SITE = 'https://www.connectautosales.com'

async function getCar(slug) {
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

  const canonical = `/inventory/${car.slug || car.stock || car.id}`
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

  // Canonicalize on the descriptive slug — it carries the year/make/model keywords
  if (car.slug && slug !== car.slug) {
    permanentRedirect(`/inventory/${car.slug}`)
  }

  const settings = settingsRows[0] || null

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
    url: `${SITE}/inventory/${car.slug || car.stock}`,
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
    </>
  )
}
